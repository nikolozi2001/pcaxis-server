/**
 * Lakes and Reservoirs Routes
 * Routes for Georgian lakes and reservoirs data
 */
import express from 'express';
import lakesController from '../controllers/lakesController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/lakes - Get all lakes with optional filtering and pagination
router.get('/', asyncHandler(lakesController.getAllLakes.bind(lakesController)));

// GET /api/lakes/stats - Get lakes statistics
router.get('/stats', asyncHandler(lakesController.getLakesStats.bind(lakesController)));

// GET /api/lakes/search - Search lakes by name, location, etc.
router.get('/search', asyncHandler(lakesController.searchLakes.bind(lakesController)));

// GET /api/lakes/refresh - Manually refresh lakes data
router.get('/refresh', asyncHandler(lakesController.refreshData.bind(lakesController)));

// GET /api/lakes/status - Get data loading status and cache info
router.get('/status', asyncHandler(lakesController.getDataStatus.bind(lakesController)));

// GET /api/lakes/bilingual - Get all lakes in both languages
router.get('/bilingual', asyncHandler(lakesController.getLakesBiLingual.bind(lakesController)));

// GET /api/lakes/bilingual/:id - Get specific lake in both languages
router.get('/bilingual/:id', asyncHandler(lakesController.getLakesBiLingual.bind(lakesController)));

// GET /api/lakes/type/:type - Get lakes by type (lakes or reservoirs)
router.get('/type/:type', asyncHandler(lakesController.getLakesByType.bind(lakesController)));

// GET /api/lakes/:id - Get specific lake by ID
router.get('/:id', asyncHandler(lakesController.getLakeById.bind(lakesController)));

export default router;