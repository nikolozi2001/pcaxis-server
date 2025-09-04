/**
 * Health Routes
 */
import express from 'express';
import healthController from '../controllers/healthController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /health - Simple health check
router.get('/', asyncHandler(healthController.healthCheck.bind(healthController)));

// GET /status - Detailed system status
router.get('/status', asyncHandler(healthController.systemStatus.bind(healthController)));

export default router;
