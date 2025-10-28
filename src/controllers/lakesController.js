/**
 * Lakes and Reservoirs Controller
 * Handles Georgian lakes and reservoirs data
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LakesController {
  constructor() {
    this.lakesDataGeo = null;
    this.lakesDataEng = null;
    this.lastLoadTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
    // Check for Excel files first, fallback to CSV
    this.dataPathGeo = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_GEO.xlsx');
    this.dataPathEng = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_ENG.xlsx');
    this.csvPathGeo = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_GEO.csv');
    this.csvPathEng = path.resolve(__dirname, '../../data/Lakes_and_Reservoirs_ENG.csv');
    
    // Load initial data
    this.loadLakesData();
  }

  /**
   * Determine which file format to use (Excel preferred, CSV fallback)
   */
  async getFilePaths() {
    try {
      // Check if Excel files exist
      await Promise.all([
        fs.stat(this.dataPathGeo),
        fs.stat(this.dataPathEng)
      ]);
      return {
        geoPath: this.dataPathGeo,
        engPath: this.dataPathEng,
        isExcel: true
      };
    } catch {
      // Fallback to CSV files
      return {
        geoPath: this.csvPathGeo,
        engPath: this.csvPathEng,
        isExcel: false
      };
    }
  }

  /**
   * Check if data needs to be reloaded (cache invalidation)
   */
  async shouldReloadData() {
    if (!this.lastLoadTime) return true;
    
    // Check if cache timeout has passed
    if (Date.now() - this.lastLoadTime > this.cacheTimeout) return true;
    
    try {
      const { geoPath, engPath } = await this.getFilePaths();
      // Check if files have been modified since last load
      const [statsGeo, statsEng] = await Promise.all([
        fs.stat(geoPath),
        fs.stat(engPath)
      ]);
      
      const latestFileTime = Math.max(
        statsGeo.mtime.getTime(),
        statsEng.mtime.getTime()
      );
      
      return latestFileTime > this.lastLoadTime;
    } catch (error) {
      console.error('Error checking file stats:', error);
      return false;
    }
  }

  /**
   * Load lakes data from both Georgian and English CSV files
   */
  async loadLakesData(force = false) {
    try {
      // Check if we need to reload data
      if (!force && !(await this.shouldReloadData())) {
        return;
      }

      const { geoPath, engPath, isExcel } = await this.getFilePaths();
      const fileType = isExcel ? 'Excel' : 'CSV';
      
      console.log(`🔄 Reloading lakes data from ${fileType} files...`);
      
      if (isExcel) {
        // Load data from Excel files
        this.lakesDataGeo = this.parseExcelData(geoPath);
        this.lakesDataEng = this.parseExcelData(engPath);
      } else {
        // Load data from CSV files
        const csvContentGeo = await fs.readFile(geoPath, 'utf-8');
        this.lakesDataGeo = this.parseCSVData(csvContentGeo);
        
        const csvContentEng = await fs.readFile(engPath, 'utf-8');
        this.lakesDataEng = this.parseCSVData(csvContentEng);
      }

      this.lastLoadTime = Date.now();
      console.log(`✅ Loaded ${this.lakesDataGeo.length} lakes (Georgian) and ${this.lakesDataEng.length} lakes (English) from ${fileType} files`);
    } catch (error) {
      console.error('❌ Error loading lakes data:', error);
      if (!this.lakesDataGeo || !this.lakesDataEng) {
        this.lakesDataGeo = [];
        this.lakesDataEng = [];
      }
    }
  }

  /**
   * Parse Excel data into structured format
   */
  parseExcelData(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      return data.map((row, index) => {
        const lake = { ...row };
        
        // Add numeric ID for API consistency
        lake.id = index + 1;
        
        // Ensure numeric fields are properly parsed
        if (lake.area) lake.area = parseFloat(lake.area) || 0;
        if (lake.depth) lake.depth = parseFloat(lake.depth) || 0;
        if (lake.volume) lake.volume = parseFloat(lake.volume) || 0;
        if (lake.elevation) lake.elevation = parseFloat(lake.elevation) || 0;
        
        // Ensure string fields are strings
        if (lake.name) lake.name = String(lake.name);
        if (lake.location) lake.location = String(lake.location);
        if (lake.type) lake.type = String(lake.type);
        if (lake.mainUse) lake.mainUse = String(lake.mainUse);
        
        return lake;
      });
    } catch (error) {
      console.error(`Error parsing Excel file ${filePath}:`, error);
      return [];
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
   * Automatically checks for data updates before returning
   */
  async getLakesData(language = 'geo') {
    await this.loadLakesData();
    
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
    
    let lakes = [...await this.getLakesData(lang)];
    
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
    
    const lakesData = await this.getLakesData(lang);
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
    const lakesData = await this.getLakesData(lang);
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
    
    const lakesData = await this.getLakesData(lang);
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
    
    const lakesData = await this.getLakesData(lang);
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
    
    // Ensure data is loaded
    await this.loadLakesData();
    
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

  /**
   * Manually refresh lakes data (force reload)
   */
  async refreshData(req, res) {
    try {
      await this.loadLakesData(true); // Force reload
      
      res.json({
        success: true,
        message: 'Lakes data refreshed successfully',
        data: {
          georgianLakes: this.lakesDataGeo.length,
          englishLakes: this.lakesDataEng.length,
          lastUpdated: new Date(this.lastLoadTime).toISOString()
        }
      });
    } catch (error) {
      console.error('Error refreshing lakes data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh data',
        message: error.message
      });
    }
  }

  /**
   * Get data loading status and cache info
   */
  async getDataStatus(req, res) {
    try {
      const { geoPath, engPath, isExcel } = await this.getFilePaths();
      const [statsGeo, statsEng] = await Promise.all([
        fs.stat(geoPath).catch(() => null),
        fs.stat(engPath).catch(() => null)
      ]);

      res.json({
        success: true,
        data: {
          status: {
            dataLoaded: !!(this.lakesDataGeo && this.lakesDataEng),
            georgianLakes: this.lakesDataGeo?.length || 0,
            englishLakes: this.lakesDataEng?.length || 0,
            lastLoadTime: this.lastLoadTime ? new Date(this.lastLoadTime).toISOString() : null,
            cacheTimeout: this.cacheTimeout
          },
          files: {
            fileType: isExcel ? 'Excel (.xlsx)' : 'CSV (.csv)',
            georgianFile: {
              path: geoPath,
              exists: !!statsGeo,
              lastModified: statsGeo ? statsGeo.mtime.toISOString() : null,
              size: statsGeo ? statsGeo.size : null
            },
            englishFile: {
              path: engPath,
              exists: !!statsEng,
              lastModified: statsEng ? statsEng.mtime.toISOString() : null,
              size: statsEng ? statsEng.size : null
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting data status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get data status',
        message: error.message
      });
    }
  }
}

export default new LakesController();