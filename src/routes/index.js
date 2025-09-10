/**
 * Main Routes Index
 */
import express from 'express';
import datasetRoutes from './datasets.js';
import healthRoutes from './health.js';
import navigationRoutes from './navigation.js';

const router = express.Router();

// API Routes
router.use('/datasets', datasetRoutes);
router.use('/navigation', navigationRoutes);

// Health Routes
router.use('/health', healthRoutes);

// API Info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PXWeb API Server',
    version: '1.0.0',
    endpoints: {
      datasets: '/api/datasets',
      navigation: '/api/navigation',
      health: '/health'
    },
    documentation: {
      datasets: {
        list: 'GET /api/datasets',
        metadata: 'GET /api/datasets/:id/metadata',
        data: 'GET /api/datasets/:id/data',
        jsonstat: 'GET /api/datasets/:id/jsonstat'
      },
      navigation: {
        explore: 'GET /api/navigation/explore?path=...',
        categories: 'GET /api/navigation/categories',
        discover: 'GET /api/navigation/discover?path=...&maxDepth=2',
        environment: 'GET /api/navigation/environment'
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
