/**
 * Main Routes Index
 */
import express from 'express';
import datasetRoutes from './datasets.js';
import healthRoutes from './health.js';

const router = express.Router();

// API Routes
router.use('/datasets', datasetRoutes);

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
      health: '/health'
    },
    documentation: {
      datasets: {
        list: 'GET /api/datasets',
        metadata: 'GET /api/datasets/:id/metadata',
        data: 'GET /api/datasets/:id/data',
        jsonstat: 'GET /api/datasets/:id/jsonstat'
      },
      health: {
        simple: 'GET /health',
        detailed: 'GET /health/status'
      }
    }
  });
});

export default router;
