/**
 * PXWeb API Service
 * Handles all interactions with the PXWeb API
 */
import JSONstat from 'jsonstat-toolkit';
import { config } from '../config/index.js';

export class PXWebService {
  constructor() {
    this.baseUrl = config.pxweb.baseUrl;
    this.timeout = config.pxweb.timeout;
  }

  /**
   * Fetch data from PXWeb API
   * @param {string} datasetPath - Path to the dataset
   * @param {string} language - Language code ('ka' for Georgian, 'en' for English)
   * @returns {Promise<Object>} - Object containing metadata, dataset, and raw data
   */
  async fetchData(datasetPath, language = 'ka') {
    try {
      // 1. Get metadata
      const metadata = await this._fetchMetadata(datasetPath, language);
      
      if (!metadata?.variables?.length) {
        throw new Error('Invalid metadata: missing variables');
      }

      // 2. Build query for all data
      const query = this._buildQuery(metadata.variables);

      // 3. Fetch actual data
      const rawData = await this._fetchRawData(datasetPath, query, language);
      
      // 4. Process with JSON-Stat
      const jstat = JSONstat(rawData);
      if (!jstat.length) {
        throw new Error('No datasets in JSON-Stat response');
      }

      const dataset = jstat.Dataset(0);
      if (!dataset) {
        throw new Error('Dataset not found');
      }

      return {
        metadata,
        dataset,
        rawData,
        language
      };
    } catch (error) {
      throw new Error(`PXWeb API error: ${error.message}`);
    }
  }

  /**
   * Fetch metadata for a dataset
   * @param {string} datasetPath 
   * @param {string} language - Language code ('ka' or 'en')
   * @returns {Promise<Object>}
   */
  async _fetchMetadata(datasetPath, language = 'ka') {
    const baseUrl = this.baseUrl.replace('/ka/', `/${language}/`);
    const metaUrl = `${baseUrl}/${datasetPath}`;
    
    const response = await this._makeRequest(metaUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Metadata fetch failed: ${response.status}`);
    }
    
    const metadata = await response.json();
    
    // Ensure the language information is attached to the metadata
    metadata.language = language;
    
    return metadata;
  }

  /**
   * Build query object for PXWeb API
   * @param {Array} variables 
   * @returns {Array}
   */
  _buildQuery(variables) {
    return variables.map(v => ({
      code: v.code,
      selection: { filter: "all", values: ["*"] }
    }));
  }

  /**
   * Fetch raw data from PXWeb API
   * @param {string} datasetPath 
   * @param {Array} query 
   * @param {string} language - Language code ('ka' or 'en')
   * @returns {Promise<Object>}
   */
  async _fetchRawData(datasetPath, query, language = 'ka') {
    const baseUrl = this.baseUrl.replace('/ka/', `/${language}/`);
    const dataUrl = `${baseUrl}/${datasetPath}`;
    
    const response = await this._makeRequest(dataUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        response: { format: 'json-stat' } 
      })
    });

    if (!response.ok) {
      throw new Error(`Data fetch failed: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Make HTTP request with timeout
   * @param {string} url 
   * @param {Object} options 
   * @returns {Promise<Response>}
   */
  async _makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }
}

export default new PXWebService();
