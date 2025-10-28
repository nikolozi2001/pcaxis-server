/**
 * Rivers Controller
 * Handles Georgian rivers and water bodies data
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RiversController {
  constructor() {
    this.riversDataGeo = null;
    this.riversDataEng = null;
    this.lastLoadTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
    this.xlsxPathGeo = path.resolve(__dirname, '../../data/Rivers_GEO.xlsx');
    this.xlsxPathEng = path.resolve(__dirname, '../../data/Rivers_ENG.xlsx');
    
    // Load initial data
    this.loadRiversData();
  }

  /**
   * Check if data needs to be reloaded (cache invalidation)
   */
  async shouldReloadData() {
    if (!this.lastLoadTime) return true;
    
    // Check if cache timeout has passed
    if (Date.now() - this.lastLoadTime > this.cacheTimeout) return true;
    
    try {
      // Check if Excel files have been modified since last load
      const [statsGeo, statsEng] = await Promise.all([
        fs.stat(this.xlsxPathGeo),
        fs.stat(this.xlsxPathEng)
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
   * Load rivers data from both Georgian and English CSV files
   */
  async loadRiversData(force = false) {
    try {
      // Check if we need to reload data
      if (!force && !(await this.shouldReloadData())) {
        return;
      }

      console.log('🔄 Reloading rivers data from Excel files...');
      
      // Load Georgian data
      this.riversDataGeo = this.parseExcelData(this.xlsxPathGeo);
      
      // Load English data
      this.riversDataEng = this.parseExcelData(this.xlsxPathEng);

      this.lastLoadTime = Date.now();
      console.log(`✅ Loaded ${this.riversDataGeo.length} rivers (Georgian) and ${this.riversDataEng.length} rivers (English) from Excel files`);
    } catch (error) {
      console.error('❌ Error loading rivers data:', error);
      if (!this.riversDataGeo || !this.riversDataEng) {
        this.riversDataGeo = [];
        this.riversDataEng = [];
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
        const river = { ...row };
        
        // Add numeric ID for API consistency
        river.id = index + 1;
        
        // Ensure numeric fields are properly parsed
        if (river.length) river.length = parseFloat(river.length) || 0;
        if (river.basinArea) river.basinArea = parseFloat(river.basinArea) || 0;
        
        // Ensure string fields are strings
        if (river.name) river.name = String(river.name);
        if (river.location) river.location = String(river.location);
        if (river.seaBasin) river.seaBasin = String(river.seaBasin);
        if (river.mainUse) river.mainUse = String(river.mainUse);
        
        return river;
      });
    } catch (error) {
      console.error(`Error parsing Excel file ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Get rivers data based on language preference
   * Automatically checks for data updates before returning
   */
  async getRiversData(language = 'geo') {
    await this.loadRiversData();
    
    if (language === 'eng' || language === 'en') {
      return this.riversDataEng || [];
    }
    return this.riversDataGeo || [];
  }



  /**
   * Get all rivers
   */
  async getAllRivers(req, res) {
    const { limit, offset, seaBasin, sortBy, order, lang } = req.query;
    
    let rivers = [...await this.getRiversData(lang)];
    
    // Filter by sea basin
    if (seaBasin) {
      rivers = rivers.filter(river => 
        river.seaBasin && river.seaBasin.toLowerCase().includes(seaBasin.toLowerCase())
      );
    }
    
    // Sort rivers
    if (sortBy) {
      const sortField = sortBy;
      const sortOrder = order === 'desc' ? -1 : 1;
      
      rivers.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Handle numeric fields
        if (sortField === 'length' || sortField === 'basinArea') {
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
    const totalCount = rivers.length;
    const startIndex = parseInt(offset) || 0;
    const limitCount = parseInt(limit) || totalCount;
    rivers = rivers.slice(startIndex, startIndex + limitCount);
    
    res.json({
      success: true,
      data: {
        rivers,
        metadata: {
          totalCount,
          returnedCount: rivers.length,
          offset: startIndex,
          limit: limitCount,
          language: lang || 'geo',
          filters: { seaBasin },
          sorting: { sortBy, order }
        }
      }
    });
  }

  /**
   * Get river by ID
   */
  async getRiverById(req, res) {
    const { id } = req.params;
    const { lang } = req.query;
    const riverId = parseInt(id);
    
    const riversData = await this.getRiversData(lang);
    const river = riversData.find(r => r.id === riverId);
    
    if (!river) {
      return res.status(404).json({
        success: false,
        error: 'River not found',
        message: `No river found with ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: { 
        river,
        metadata: {
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get rivers statistics
   */
  async getRiversStats(req, res) {
    const { lang } = req.query;
    const riversData = await this.getRiversData(lang);
    const totalRivers = riversData.length;
    
    // Calculate statistics
    const lengths = riversData.map(r => r.length).filter(l => l > 0);
    const basinAreas = riversData.map(r => r.basinArea).filter(a => a > 0);
    
    const stats = {
      totalRivers,
      averageLength: lengths.length > 0 ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0,
      maxLength: Math.max(...lengths, 0),
      minLength: Math.min(...lengths, Infinity) === Infinity ? 0 : Math.min(...lengths),
      averageBasinArea: basinAreas.length > 0 ? basinAreas.reduce((a, b) => a + b, 0) / basinAreas.length : 0,
      maxBasinArea: Math.max(...basinAreas, 0),
      minBasinArea: Math.min(...basinAreas, Infinity) === Infinity ? 0 : Math.min(...basinAreas)
    };
    
    // Count by sea basin
    const seaBasinCounts = {};
    riversData.forEach(river => {
      const basin = river.seaBasin || 'Unknown';
      seaBasinCounts[basin] = (seaBasinCounts[basin] || 0) + 1;
    });
    
    // Count by main use
    const mainUseCounts = {};
    riversData.forEach(river => {
      if (river.mainUse) {
        const uses = river.mainUse.split(',').map(use => use.trim());
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
          bySeaBasin: seaBasinCounts,
          byMainUse: mainUseCounts
        },
        metadata: {
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Search rivers by name or location
   */
  async searchRivers(req, res) {
    const { q, field, lang } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
        message: 'Please provide a search query using the "q" parameter'
      });
    }
    
    const riversData = await this.getRiversData(lang);
    const searchTerm = q.toLowerCase();
    const searchField = field || 'all';
    
    let results = riversData.filter(river => {
      if (searchField === 'all') {
        return river.name.toLowerCase().includes(searchTerm) ||
               river.location.toLowerCase().includes(searchTerm) ||
               river.seaBasin.toLowerCase().includes(searchTerm) ||
               river.mainUse.toLowerCase().includes(searchTerm);
      } else if (river[searchField]) {
        return river[searchField].toLowerCase().includes(searchTerm);
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
          totalRivers: riversData.length,
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get rivers by sea basin
   */
  async getRiversBySeaBasin(req, res) {
    const { basin } = req.params;
    const { lang } = req.query;
    
    const riversData = await this.getRiversData(lang);
    const rivers = riversData.filter(river => 
      river.seaBasin && river.seaBasin.toLowerCase().includes(basin.toLowerCase())
    );
    
    if (rivers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No rivers found',
        message: `No rivers found for sea basin: ${basin}`
      });
    }
    
    res.json({
      success: true,
      data: {
        seaBasin: basin,
        rivers,
        metadata: {
          riverCount: rivers.length,
          averageLength: rivers.reduce((sum, r) => sum + (r.length || 0), 0) / rivers.length,
          totalBasinArea: rivers.reduce((sum, r) => sum + (r.basinArea || 0), 0),
          language: lang || 'geo'
        }
      }
    });
  }

  /**
   * Get rivers in both languages for comparison
   */
  async getRiversBiLingual(req, res) {
    const { id } = req.params;
    
    // Ensure data is loaded
    await this.loadRiversData();
    
    if (id) {
      // Get specific river in both languages
      const riverId = parseInt(id);
      const riverGeo = this.riversDataGeo.find(r => r.id === riverId);
      const riverEng = this.riversDataEng.find(r => r.id === riverId);
      
      if (!riverGeo || !riverEng) {
        return res.status(404).json({
          success: false,
          error: 'River not found',
          message: `No river found with ID: ${id}`
        });
      }
      
      res.json({
        success: true,
        data: {
          river: {
            georgian: riverGeo,
            english: riverEng
          }
        }
      });
    } else {
      // Get all rivers in both languages
      res.json({
        success: true,
        data: {
          georgian: this.riversDataGeo,
          english: this.riversDataEng,
          metadata: {
            totalRivers: this.riversDataGeo.length,
            languages: ['georgian', 'english']
          }
        }
      });
    }
  }

  /**
   * Manually refresh rivers data (force reload)
   */
  async refreshData(req, res) {
    try {
      await this.loadRiversData(true); // Force reload
      
      res.json({
        success: true,
        message: 'Rivers data refreshed successfully',
        data: {
          georgianRivers: this.riversDataGeo.length,
          englishRivers: this.riversDataEng.length,
          lastUpdated: new Date(this.lastLoadTime).toISOString()
        }
      });
    } catch (error) {
      console.error('Error refreshing rivers data:', error);
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
      const [statsGeo, statsEng] = await Promise.all([
        fs.stat(this.xlsxPathGeo).catch(() => null),
        fs.stat(this.xlsxPathEng).catch(() => null)
      ]);

      res.json({
        success: true,
        data: {
          status: {
            dataLoaded: !!(this.riversDataGeo && this.riversDataEng),
            georgianRivers: this.riversDataGeo?.length || 0,
            englishRivers: this.riversDataEng?.length || 0,
            lastLoadTime: this.lastLoadTime ? new Date(this.lastLoadTime).toISOString() : null,
            cacheTimeout: this.cacheTimeout
          },
          files: {
            fileType: 'Excel (.xlsx)',
            georgianFile: {
              path: this.xlsxPathGeo,
              exists: !!statsGeo,
              lastModified: statsGeo ? statsGeo.mtime.toISOString() : null,
              size: statsGeo ? statsGeo.size : null
            },
            englishFile: {
              path: this.xlsxPathEng,
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

export default new RiversController();