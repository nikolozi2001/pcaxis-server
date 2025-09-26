/**
 * Rivers Controller
 * Handles Georgian rivers and water bodies data
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RiversController {
  constructor() {
    this.riversDataGeo = null;
    this.riversDataEng = null;
    this.loadRiversData();
  }

  /**
   * Load rivers data from both Georgian and English CSV files
   */
  async loadRiversData() {
    try {
      // Load Georgian data
      const csvPathGeo = path.resolve(__dirname, '../../data/Rivers_GEO.csv');
      const csvContentGeo = await fs.readFile(csvPathGeo, 'utf-8');
      this.riversDataGeo = this.parseCSVData(csvContentGeo);
      
      // Load English data
      const csvPathEng = path.resolve(__dirname, '../../data/Rivers_ENG.csv');
      const csvContentEng = await fs.readFile(csvPathEng, 'utf-8');
      this.riversDataEng = this.parseCSVData(csvContentEng);

      console.log(`Loaded ${this.riversDataGeo.length} rivers (Georgian) and ${this.riversDataEng.length} rivers (English) from CSV files`);
    } catch (error) {
      console.error('Error loading rivers data:', error);
      this.riversDataGeo = [];
      this.riversDataEng = [];
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
      const river = {};
      
      headers.forEach((header, i) => {
        river[header] = values[i] || '';
      });
      
      // Add numeric ID for API consistency
      river.id = index + 1;
      
      // Parse numeric fields - handle both column name formats
      const lengthField = river.length || river.length_km;
      const basinField = river.basinArea || river.basinArea_sqkm;
      
      if (lengthField) river.length = parseFloat(lengthField) || 0;
      if (basinField) river.basinArea = parseFloat(basinField) || 0;
      
      // Standardize field names
      if (river.length_km) {
        river.length = river.length;
        delete river.length_km;
      }
      if (river.basinArea_sqkm) {
        river.basinArea = river.basinArea;
        delete river.basinArea_sqkm;
      }
      
      return river;
    });
  }

  /**
   * Get rivers data based on language preference
   */
  getRiversData(language = 'geo') {
    if (language === 'eng' || language === 'en') {
      return this.riversDataEng || [];
    }
    return this.riversDataGeo || [];
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
   * Get all rivers
   */
  async getAllRivers(req, res) {
    const { limit, offset, seaBasin, sortBy, order, lang } = req.query;
    
    let rivers = [...this.getRiversData(lang)];
    
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
    
    const riversData = this.getRiversData(lang);
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
    const riversData = this.getRiversData(lang);
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
    
    const riversData = this.getRiversData(lang);
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
    
    const riversData = this.getRiversData(lang);
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
}

export default new RiversController();