/**
 * Dataset Controller
 * Handles all dataset-related HTTP requests
 */
import { DATASETS } from '../config/datasets.js';
import pxwebService from '../services/pxwebService.js';
import dataProcessingService from '../services/dataProcessingService.js';
import redisService from '../services/redisService.js';

const CACHE_TTL = 3600; // 1 hour

export class DatasetController {
  /**
   * Get list of available datasets
   * @param {Request} req 
   * @param {Response} res 
   */
  async getDatasets(req, res) {
    try {
      const { category, subcategory } = req.query;

      let datasets = Object.values(DATASETS).map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        category: dataset.category,
        subcategory: dataset.subcategory || null
      }));

      if (category) {
        datasets = datasets.filter(dataset => dataset.category === category);
      }

      if (subcategory) {
        datasets = datasets.filter(dataset => dataset.subcategory === subcategory);
      }

      const groupedByCategory = datasets.reduce((acc, dataset) => {
        if (!acc[dataset.category]) acc[dataset.category] = [];
        acc[dataset.category].push(dataset);
        return acc;
      }, {});

      const groupedBySubcategory = datasets.reduce((acc, dataset) => {
        const key = dataset.subcategory || 'other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(dataset);
        return acc;
      }, {});

      res.json({
        success: true,
        count: datasets.length,
        data: datasets,
        grouped: groupedByCategory,
        groupedBySubcategory,
        categories: Object.keys(groupedByCategory)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch datasets',
        message: error.message
      });
    }
  }

  /**
   * Get dataset metadata
   * @param {Request} req 
   * @param {Response} res 
   */
  async getMetadata(req, res) {
    try {
      const { id } = req.params;
      const { lang = 'ka' } = req.query; // Default to Georgian, allow English with ?lang=en

      const safeId = id?.replace(/[^a-z0-9\-_]/gi, '');
      if (!safeId || safeId !== id) {
        return res.status(400).json({ success: false, error: 'Invalid dataset ID' });
      }

      if (!DATASETS[id]) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found',
          message: `Dataset with id '${id}' does not exist`
        });
      }

      const cacheKey = `metadata:${id}:${lang}`;
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Add random delay to spread out concurrent requests
      const delay = Math.random() * 1500; // 0-1500ms random delay
      await new Promise(resolve => setTimeout(resolve, delay));

      const dataset = DATASETS[id];

      // Fetch metadata in the requested language
      const { metadata } = await pxwebService.fetchData(dataset.path, lang);
      const processedMetadata = dataProcessingService.processMetadata(metadata, id, lang);

      const result = {
        success: true,
        data: {
          ...dataset,
          metadata: processedMetadata,
          language: lang
        }
      };

      await redisService.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      res.json(result);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] getMetadata error for '${req.params.id}':`, error.message);
      const isUpstream = error.message?.includes('Cannot reach external PXWeb API') ||
                         error.message?.includes('timed out');
      res.status(isUpstream ? 502 : 500).json({
        success: false,
        error: isUpstream ? 'External API unavailable' : 'Failed to fetch metadata',
        message: error.message
      });
    }
  }

  /**
   * Get processed dataset data
   * @param {Request} req 
   * @param {Response} res 
   */
  async getData(req, res) {
    try {
      const { id } = req.params;
      const { lang = 'ka', category, ownership, region, gender, activity } = req.query;

      // Build dimension filters from query params (map friendly names → PXWeb dimension codes)
      const dimensionFilters = {};
      if (category)  dimensionFilters['Category']         = category;
      if (ownership) dimensionFilters['Ownership Type']   = ownership;
      if (region)    dimensionFilters['Region']           = region;
      if (gender)    dimensionFilters['Gender']           = gender;
      if (activity)  dimensionFilters['Type of Activity'] = activity;

      const safeId = id?.replace(/[^a-z0-9\-_]/gi, '');
      if (!safeId || safeId !== id) {
        return res.status(400).json({ success: false, error: 'Invalid dataset ID' });
      }

      if (!DATASETS[id]) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found',
          message: `Dataset with id '${id}' does not exist`
        });
      }

      // Cache key includes active filters so filtered results are cached separately
      const filterSuffix = Object.keys(dimensionFilters).length
        ? ':' + Object.entries(dimensionFilters).map(([k, v]) => `${k}=${v}`).join('&')
        : '';
      const cacheKey = `data:${id}:${lang}${filterSuffix}`;
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Add random delay to spread out concurrent requests
      const delay = Math.random() * 2000; // 0-2000ms random delay
      await new Promise(resolve => setTimeout(resolve, delay));

      const dataset = DATASETS[id];
      const { dataset: jsonStatDataset, metadata } = await pxwebService.fetchData(dataset.path, lang);
      const processedData = dataProcessingService.processForChart(jsonStatDataset, id, lang, metadata, dimensionFilters);

      const result = {
        success: true,
        data: {
          ...dataset,
          ...processedData,
          language: lang,
          filters: Object.keys(dimensionFilters).length ? dimensionFilters : undefined
        }
      };

      await redisService.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      res.json(result);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] getData error for '${req.params.id}':`, error.message);
      const isUpstream = error.message?.includes('Cannot reach external PXWeb API') ||
                         error.message?.includes('timed out');
      res.status(isUpstream ? 502 : 500).json({
        success: false,
        error: isUpstream ? 'External API unavailable' : 'Failed to fetch dataset data',
        message: error.message
      });
    }
  }

  /**
   * Get raw JSON-Stat data
   * @param {Request} req 
   * @param {Response} res 
   */
  async getJsonStat(req, res) {
    try {
      const { id } = req.params;

      const safeId = id?.replace(/[^a-z0-9\-_]/gi, '');
      if (!safeId || safeId !== id) {
        return res.status(400).json({ success: false, error: 'Invalid dataset ID' });
      }

      if (!DATASETS[id]) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found',
          message: `Dataset with id '${id}' does not exist`
        });
      }

      const dataset = DATASETS[id];
      const { rawData } = await pxwebService.fetchData(dataset.path);

      res.json({
        success: true,
        data: rawData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch JSON-Stat data',
        message: error.message
      });
    }
  }
}

export default new DatasetController();
