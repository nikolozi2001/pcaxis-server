/**
 * Lakes and Reservoirs Controller
 * Handles Georgian lakes and reservoirs data
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LakesController {
  constructor() {
    this.lakesDataGeo = null;
    this.lakesDataEng = null;
    this.loadLakesData();
  }

  /**
   * Load lakes data from both Georgian and English CSV files
   */
  async loadLakesData() {
    try {
      // Load Georgian data
      const csvPathGeo = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_GEO.csv');
      const csvContentGeo = await fs.readFile(csvPathGeo, 'utf-8');
      this.lakesDataGeo = this.parseCSVData(csvContentGeo);
      
      // Load English data
      const csvPathEng = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_ENG.csv');
      const csvContentEng = await fs.readFile(csvPathEng, 'utf-8');
      this.lakesDataEng = this.parseCSVData(csvContentEng);

      console.log(`Loaded ${this.lakesDataGeo.length} lakes (Georgian) and ${this.lakesDataEng.length} lakes (English) from CSV files`);
    } catch (error) {
      console.error('Error loading lakes data:', error);
      this.lakesDataGeo = [];
      this.lakesDataEng = [];
    }
  }

  /**
   * Parse CSV data into structured format
   */
  parseCSVData(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/\r/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = this.parseCSVLine(line);
      const lake = {};
      
      headers.forEach((header, i) => {
        lake[header] = values[i] || '';
      });
      
      // Add numeric ID for API consistency
      lake.id = index + 1;
      
      // Parse numeric fields - handle both column name formats
      const areaField = lake.area || lake.area_sqkm;
      const volumeField = lake.volume || lake.volume_mcm;
      const avgDepthField = lake.avgDepth || lake.avgDepth_m;
      const maxDepthField = lake.maxDepth || lake.maxDepth_m;
      
      if (areaField) lake.area = parseFloat(areaField) || 0;
      if (volumeField) lake.volume = parseFloat(volumeField) || 0;
      if (avgDepthField) lake.avgDepth = parseFloat(avgDepthField) || 0;
      if (maxDepthField) lake.maxDepth = parseFloat(maxDepthField) || 0;
      
      // Standardize field names
      if (lake.area_sqkm) {
        lake.area = lake.area;
        delete lake.area_sqkm;
      }
      if (lake.volume_mcm) {
        lake.volume = lake.volume;
        delete lake.volume_mcm;
      }
      if (lake.avgDepth_m) {
        lake.avgDepth = lake.avgDepth;
        delete lake.avgDepth_m;
      }
      if (lake.maxDepth_m) {
        lake.maxDepth = lake.maxDepth;
        delete lake.maxDepth_m;
      }
      
      return lake;
    });
  }

  /**
   * Get lakes data based on language preference
   */
  getLakesData(language = 'geo') {
    if (language === 'eng' || language === 'en') {
      return this.lakesDataEng || [];
    }
    return this.lakesDataGeo || [];
  }

  /**
   * Parse CSV line handling quoted values
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Get all lakes
   */
  async getAllLakes(req, res) {
    const { limit, offset, type, sortBy, order, lang } = req.query;
    
    let lakes = [...this.getLakesData(lang)];
    
    // Filter by type (lake or reservoir)
    if (type) {
      lakes = lakes.filter(lake => {
        const lakeType = lake.name.toLowerCase();
        if (type === 'lake') {
          return lakeType.includes('ტბა') || lakeType.includes('lake');
        } else if (type === 'reservoir') {
          return lakeType.includes('წყალსაცავი') || lakeType.includes('reservoir');
        }
        return true;
      });
    }
    
    // Sort lakes
    if (sortBy) {
      const sortField = sortBy;
      const sortOrder = order === 'desc' ? -1 : 1;
      
      lakes.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Handle numeric fields
        if (['area', 'volume', 'avgDepth', 'maxDepth'].includes(sortField)) {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Apply pagination
    const totalCount = lakes.length;
    const startIndex = parseInt(offset) || 0;
    const limitCount = parseInt(limit) || totalCount;
    lakes = lakes.slice(startIndex, startIndex + limitCount);
    
    res.json({
      success: true,
      data: {
        lakes,
        metadata: {
          totalCount,
          returnedCount: lakes.length,
          offset: startIndex,
          limit: limitCount,
          language: lang || 'geo',
          filters: { type },
          sorting: { sortBy, order }
        }
      }
    });
  }

  /**
   * Get lake by ID
   */
  async getLakeById(req, res) {
    const { id } = req.params;
    const { lang } = req.query;
    const lakeId = parseInt(id);
    
    const lakesData = this.getLakesData(lang);
    const lake = lakesData.find(l => l.id === lakeId);
    
    if (!lake) {
      return res.status(404).json({
        success: false,
        error: 'Lake not found',
        message: `No lake found with ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: { 
        lake,
        metadata: {
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get lakes statistics
   */
  async getLakesStats(req, res) {
    const { lang } = req.query;
    const lakesData = this.getLakesData(lang);
    const totalLakes = lakesData.length;
    
    // Calculate statistics
    const areas = lakesData.map(l => l.area).filter(a => a > 0);
    const volumes = lakesData.map(l => l.volume).filter(v => v > 0);
    const avgDepths = lakesData.map(l => l.avgDepth).filter(d => d > 0);
    const maxDepths = lakesData.map(l => l.maxDepth).filter(d => d > 0);
    
    const stats = {
      totalLakes,
      averageArea: areas.length > 0 ? areas.reduce((a, b) => a + b, 0) / areas.length : 0,
      maxArea: Math.max(...areas, 0),
      minArea: Math.min(...areas, Infinity) === Infinity ? 0 : Math.min(...areas),
      averageVolume: volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0,
      maxVolume: Math.max(...volumes, 0),
      minVolume: Math.min(...volumes, Infinity) === Infinity ? 0 : Math.min(...volumes),
      averageAvgDepth: avgDepths.length > 0 ? avgDepths.reduce((a, b) => a + b, 0) / avgDepths.length : 0,
      maxDepth: Math.max(...maxDepths, 0),
      minDepth: Math.min(...maxDepths, Infinity) === Infinity ? 0 : Math.min(...maxDepths)
    };
    
    // Count by type
    const typeCounts = { lakes: 0, reservoirs: 0 };
    lakesData.forEach(lake => {
      const lakeType = lake.name.toLowerCase();
      if (lakeType.includes('ტბა') || lakeType.includes('lake')) {
        typeCounts.lakes++;
      } else if (lakeType.includes('წყალსაცავი') || lakeType.includes('reservoir')) {
        typeCounts.reservoirs++;
      }
    });
    
    // Count by main use
    const mainUseCounts = {};
    lakesData.forEach(lake => {
      if (lake.mainUse) {
        const uses = lake.mainUse.split(',').map(use => use.trim());
        uses.forEach(use => {
          mainUseCounts[use] = (mainUseCounts[use] || 0) + 1;
        });
      }
    });
    
    res.json({
      success: true,
      data: {
        statistics: stats,
        distribution: {
          byType: typeCounts,
          byMainUse: mainUseCounts
        },
        metadata: {
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Search lakes by name or location
   */
  async searchLakes(req, res) {
    const { q, field, lang } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
        message: 'Please provide a search query using the "q" parameter'
      });
    }
    
    const lakesData = this.getLakesData(lang);
    const searchTerm = q.toLowerCase();
    const searchField = field || 'all';
    
    let results = lakesData.filter(lake => {
      if (searchField === 'all') {
        return lake.name.toLowerCase().includes(searchTerm) ||
               lake.location.toLowerCase().includes(searchTerm) ||
               lake.mainUse.toLowerCase().includes(searchTerm);
      } else if (lake[searchField]) {
        return lake[searchField].toLowerCase().includes(searchTerm);
      }
      return false;
    });
    
    res.json({
      success: true,
      data: {
        results,
        metadata: {
          searchTerm: q,
          searchField,
          resultCount: results.length,
          totalLakes: lakesData.length,
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get lakes by type (lake or reservoir)
   */
  async getLakesByType(req, res) {
    const { type } = req.params;
    const { lang } = req.query;
    
    const lakesData = this.getLakesData(lang);
    let lakes = [];
    
    if (type === 'lakes') {
      lakes = lakesData.filter(lake => {
        const lakeType = lake.name.toLowerCase();
        return lakeType.includes('ტბა') || lakeType.includes('lake');
      });
    } else if (type === 'reservoirs') {
      lakes = lakesData.filter(lake => {
        const lakeType = lake.name.toLowerCase();
        return lakeType.includes('წყალსაცავი') || lakeType.includes('reservoir');
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid type',
        message: 'Type must be either "lakes" or "reservoirs"'
      });
    }
    
    if (lakes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No lakes found',
        message: `No ${type} found`
      });
    }
    
    res.json({
      success: true,
      data: {
        type,
        lakes,
        metadata: {
          lakeCount: lakes.length,
          averageArea: lakes.reduce((sum, l) => sum + (l.area || 0), 0) / lakes.length,
          totalVolume: lakes.reduce((sum, l) => sum + (l.volume || 0), 0),
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get lakes in both languages for comparison
   */
  async getLakesBiLingual(req, res) {
    const { id } = req.params;
    
    if (id) {
      // Get specific lake in both languages
      const lakeId = parseInt(id);
      const lakeGeo = this.lakesDataGeo.find(l => l.id === lakeId);
      const lakeEng = this.lakesDataEng.find(l => l.id === lakeId);
      
      if (!lakeGeo || !lakeEng) {
        return res.status(404).json({
          success: false,
          error: 'Lake not found',
          message: `No lake found with ID: ${id}`
        });
      }
      
      res.json({
        success: true,
        data: {
          lake: {
            georgian: lakeGeo,
            english: lakeEng
          }
        }
      });
    } else {
      // Get all lakes in both languages
      res.json({
        success: true,
        data: {
          georgian: this.lakesDataGeo,
          english: this.lakesDataEng,
          metadata: {
            totalLakes: this.lakesDataGeo.length,
            languages: ['georgian', 'english']
          }
        }
      });
    }
  }
}

export default new LakesController();