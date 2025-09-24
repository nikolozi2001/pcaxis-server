/**
 * Rivers Routes
 * Routes for Georgian rivers and water bodies data
 */
import express from 'express';
import riversController from '../controllers/riversController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/rivers - Get all rivers with optional filtering and pagination
router.get('/', asyncHandler(riversController.getAllRivers.bind(riversController)));

// GET /api/rivers/stats - Get rivers statistics
router.get('/stats', asyncHandler(riversController.getRiversStats.bind(riversController)));

// GET /api/rivers/search - Search rivers by name, location, etc.
router.get('/search', asyncHandler(riversController.searchRivers.bind(riversController)));

// GET /api/rivers/bilingual - Get all rivers in both languages
router.get('/bilingual', asyncHandler(riversController.getRiversBiLingual.bind(riversController)));

// GET /api/rivers/bilingual/:id - Get specific river in both languages
router.get('/bilingual/:id', asyncHandler(riversController.getRiversBiLingual.bind(riversController)));

// GET /api/rivers/sea-basin/:basin - Get rivers by sea basin
router.get('/sea-basin/:basin', asyncHandler(riversController.getRiversBySeaBasin.bind(riversController)));

// GET /api/rivers/:id - Get specific river by ID
router.get('/:id', asyncHandler(riversController.getRiverById.bind(riversController)));

export default router;