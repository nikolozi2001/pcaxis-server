/**
 * Dataset Controller
 * Handles all dataset-related HTTP requests
 */
import { DATASETS } from '../config/datasets.js';
import pxwebService from '../services/pxwebService.js';
import dataProcessingService from '../services/dataProcessingService.js';

export class DatasetController {
  /**
   * Get list of available datasets
   * @param {Request} req 
   * @param {Response} res 
   */
  async getDatasets(req, res) {
    try {
      const { category } = req.query;
      
      let datasets = Object.values(DATASETS).map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        category: dataset.category
      }));

      // Filter by category if specified
      if (category) {
        datasets = datasets.filter(dataset => dataset.category === category);
      }

      // Group by category
      const groupedByCategory = datasets.reduce((acc, dataset) => {
        if (!acc[dataset.category]) {
          acc[dataset.category] = [];
        }
        acc[dataset.category].push(dataset);
        return acc;
      }, {});

      res.json({
        success: true,
        count: datasets.length,
        data: datasets,
        grouped: groupedByCategory,
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
      
      if (!DATASETS[id]) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found',
          message: `Dataset with id '${id}' does not exist`
        });
      }

      const dataset = DATASETS[id];
      
      // Use the updated service with language support
      const baseUrl = pxwebService.baseUrl.replace('/ka/', `/${lang}/`);
      const metaUrl = `${baseUrl}/${dataset.path}`;
      
      const response = await fetch(metaUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const metadata = await response.json();
      const processedMetadata = dataProcessingService.processMetadata(metadata);

      res.json({
        success: true,
        data: {
          ...dataset,
          metadata: processedMetadata,
          language: lang
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch metadata',
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
      const { lang = 'ka' } = req.query; // Default to Georgian, allow English with ?lang=en
      
      if (!DATASETS[id]) {
        return res.status(404).json({
          success: false,
          error: 'Dataset not found',
          message: `Dataset with id '${id}' does not exist`
        });
      }

      const dataset = DATASETS[id];
      const { dataset: jsonStatDataset } = await pxwebService.fetchData(dataset.path, lang);
      const processedData = dataProcessingService.processForChart(jsonStatDataset);

      res.json({
        success: true,
        data: {
          ...dataset,
          ...processedData,
          language: lang
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dataset data',
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
