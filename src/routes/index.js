/**
 * Main Routes Index
 */
import express from 'express';
import datasetRoutes from './datasets.js';
import healthRoutes from './health.js';
import navigationRoutes from './navigation.js';
import airQualityRoutes from './airQuality.js';
import riversRoutes from './rivers.js';
import lakesRoutes from './lakes.js';

const router = express.Router();

// API Routes
router.use('/datasets', datasetRoutes);
router.use('/navigation', navigationRoutes);
router.use('/air-quality', airQualityRoutes);
router.use('/rivers', riversRoutes);
router.use('/lakes', lakesRoutes);

// Health Routes
router.use('/health', healthRoutes);

// API Info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PXWeb Environmental API Server',
    version: '1.0.0',
    endpoints: {
      datasets: '/api/datasets',
      navigation: '/api/navigation',
      airQuality: '/api/air-quality',
      rivers: '/api/rivers',
      lakes: '/api/lakes',
      health: '/health'
    },
    documentation: {
      datasets: {
        list: 'GET /api/datasets',
        metadata: 'GET /api/datasets/:id/metadata',
        data: 'GET /api/datasets/:id/data',
        jsonstat: 'GET /api/datasets/:id/jsonstat'
      },
      airQuality: {
        latest: 'GET /api/air-quality/latest',
        stations: 'GET /api/air-quality/stations',
        pollutant: 'GET /api/air-quality/pollutant/:pollutant',
        summary: 'GET /api/air-quality/summary'
      },
      navigation: {
        explore: 'GET /api/navigation/explore',
        categories: 'GET /api/navigation/categories'
      },
      rivers: {
        list: 'GET /api/rivers?lang=geo|eng',
        byId: 'GET /api/rivers/:id?lang=geo|eng',
        stats: 'GET /api/rivers/stats?lang=geo|eng',
        search: 'GET /api/rivers/search?q=:query&lang=geo|eng',
        bySeaBasin: 'GET /api/rivers/sea-basin/:basin?lang=geo|eng',
        bilingual: 'GET /api/rivers/bilingual',
        bilingualById: 'GET /api/rivers/bilingual/:id'
      },
      lakes: {
        list: 'GET /api/lakes?lang=geo|eng',
        byId: 'GET /api/lakes/:id?lang=geo|eng',
        stats: 'GET /api/lakes/stats?lang=geo|eng',
        search: 'GET /api/lakes/search?q=:query&lang=geo|eng',
        byType: 'GET /api/lakes/type/:type?lang=geo|eng',
        bilingual: 'GET /api/lakes/bilingual',
        bilingualById: 'GET /api/lakes/bilingual/:id'
      },
      health: {
        simple: 'GET /health',
        detailed: 'GET /health/status'
      }
    },
    categories: {
      environment: 'Environmental and ecological statistics'
    }
  });
});

export default router;
