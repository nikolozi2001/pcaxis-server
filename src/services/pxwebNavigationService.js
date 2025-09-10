/**
 * PXWeb Navigation Service
 * Handles navigation and discovery of PXWeb API structure
 */
import { config } from '../config/index.js';

export class PXWebNavigationService {
  constructor() {
    this.baseUrl = config.pxweb.baseUrl;
    this.timeout = config.pxweb.timeout;
  }

  /**
   * Explore a PXWeb path and return its structure
   * @param {string} path - Path to explore (relative to base URL)
   * @returns {Promise<Object>} - Navigation structure
   */
  async explorePath(path = '') {
    try {
      const url = path ? `${this.baseUrl}/${path}` : this.baseUrl;
      
      const response = await this._makeRequest(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Navigation failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        path: path || 'root',
        url: url,
        items: data.map(item => ({
          id: item.id,
          type: item.type, // 'l' for folder, 't' for table
          text: item.text,
          isFolder: item.type === 'l',
          isTable: item.type === 't'
        }))
      };
    } catch (error) {
      throw new Error(`PXWeb navigation error: ${error.message}`);
    }
  }

  /**
   * Find all tables in a given path recursively
   * @param {string} path - Starting path
   * @param {number} maxDepth - Maximum recursion depth
   * @returns {Promise<Array>} - Array of table information
   */
  async findTables(path, maxDepth = 2) {
    const tables = [];
    
    try {
      await this._findTablesRecursive(path, tables, 0, maxDepth);
      return tables;
    } catch (error) {
      throw new Error(`Table discovery error: ${error.message}`);
    }
  }

  /**
   * Recursive helper for finding tables
   * @param {string} currentPath 
   * @param {Array} tables 
   * @param {number} currentDepth 
   * @param {number} maxDepth 
   */
  async _findTablesRecursive(currentPath, tables, currentDepth, maxDepth) {
    if (currentDepth >= maxDepth) return;

    const structure = await this.explorePath(currentPath);
    
    for (const item of structure.items) {
      if (item.isTable) {
        tables.push({
          id: this._pathToId(currentPath, item.id),
          name: item.text,
          path: currentPath ? `${currentPath}/${item.id}` : item.id,
          category: this._extractCategory(currentPath)
        });
      } else if (item.isFolder) {
        const newPath = currentPath ? `${currentPath}/${item.id}` : item.id;
        await this._findTablesRecursive(newPath, tables, currentDepth + 1, maxDepth);
      }
    }
  }

  /**
   * Convert path and filename to a clean ID
   * @param {string} path 
   * @param {string} filename 
   * @returns {string}
   */
  _pathToId(path, filename) {
    const cleanPath = path.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const cleanFile = filename.replace(/\.px$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${cleanPath}-${cleanFile}`.replace(/--+/g, '-').replace(/^-|-$/g, '');
  }

  /**
   * Extract category from path
   * @param {string} path 
   * @returns {string}
   */
  _extractCategory(path) {
    if (!path) return 'general';
    
    const parts = path.split('/');
    const mainCategory = parts[0]?.toLowerCase().replace(/[^a-z]/g, '');
    
    const categoryMap = {
      'environmentstatistics': 'environment'
    };
    
    return categoryMap[mainCategory] || 'environment';
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

export default new PXWebNavigationService();
