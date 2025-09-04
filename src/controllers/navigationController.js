/**
 * Navigation Controller
 * Handles PXWeb API exploration and dataset discovery
 */
import pxwebNavigationService from '../services/pxwebNavigationService.js';
import { CATEGORIES, ENVIRONMENT_SUBCATEGORIES } from '../config/datasets.js';

export class NavigationController {
  /**
   * Explore PXWeb API structure
   * @param {Request} req 
   * @param {Response} res 
   */
  async explorePath(req, res) {
    try {
      const { path } = req.query;
      
      const structure = await pxwebNavigationService.explorePath(path);
      
      res.json({
        success: true,
        data: structure
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to explore path',
        message: error.message
      });
    }
  }

  /**
   * Get categories and subcategories
   * @param {Request} req 
   * @param {Response} res 
   */
  async getCategories(req, res) {
    try {
      res.json({
        success: true,
        data: {
          categories: CATEGORIES,
          environmentSubcategories: ENVIRONMENT_SUBCATEGORIES
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get categories',
        message: error.message
      });
    }
  }

  /**
   * Discover tables in a given path
   * @param {Request} req 
   * @param {Response} res 
   */
  async discoverTables(req, res) {
    try {
      const { path, maxDepth = 2 } = req.query;
      
      if (!path) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter',
          message: 'Path parameter is required'
        });
      }

      const tables = await pxwebNavigationService.findTables(path, parseInt(maxDepth));
      
      res.json({
        success: true,
        data: {
          path,
          tablesFound: tables.length,
          tables
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to discover tables',
        message: error.message
      });
    }
  }

  /**
   * Get environment statistics structure
   * @param {Request} req 
   * @param {Response} res 
   */
  async getEnvironmentStructure(req, res) {
    try {
      const environmentPath = 'Environment%20Statistics';
      const structure = await pxwebNavigationService.explorePath(environmentPath);
      
      // Enhance with our known subcategory information
      const enhancedItems = structure.items.map(item => {
        const subcategoryKey = item.id.toLowerCase().replace(/[^a-z]/g, '-');
        const subcategory = Object.values(ENVIRONMENT_SUBCATEGORIES)
          .find(sub => sub.id === subcategoryKey || 
                       sub.name.toLowerCase().includes(item.id.toLowerCase()));
        
        return {
          ...item,
          subcategory: subcategory || {
            id: subcategoryKey,
            name: item.text,
            georgianName: item.text
          }
        };
      });

      res.json({
        success: true,
        data: {
          ...structure,
          items: enhancedItems,
          subcategories: ENVIRONMENT_SUBCATEGORIES
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get environment structure',
        message: error.message
      });
    }
  }
}

export default new NavigationController();
