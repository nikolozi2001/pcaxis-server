/**
 * Dataset Routes
 */
import express from 'express';
import datasetController from '../controllers/datasetController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/datasets - Get all available datasets
router.get('/', asyncHandler(datasetController.getDatasets.bind(datasetController)));

// GET /api/datasets/:id/metadata - Get dataset metadata
router.get('/:id/metadata', asyncHandler(datasetController.getMetadata.bind(datasetController)));

// GET /api/datasets/:id/data - Get processed dataset data
router.get('/:id/data', asyncHandler(datasetController.getData.bind(datasetController)));

// GET /api/datasets/:id/jsonstat - Get raw JSON-Stat data
router.get('/:id/jsonstat', asyncHandler(datasetController.getJsonStat.bind(datasetController)));

export default router;
