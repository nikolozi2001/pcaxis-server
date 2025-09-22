/**
 * Main Routes Index
 */
import express from 'express';
import datasetRoutes from './datasets.js';
import healthRoutes from './health.js';
import navigationRoutes from './navigation.js';
import airQualityRoutes from './airQuality.js';

const router = express.Router();

// API Routes
router.use('/datasets', datasetRoutes);
router.use('/navigation', navigationRoutes);
router.use('/air-quality', airQualityRoutes);

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
