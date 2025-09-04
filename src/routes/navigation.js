/**
 * Navigation Routes
 * Routes for exploring the PXWeb API structure
 */
import express from 'express';
import navigationController from '../controllers/navigationController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/navigation/explore?path=... - Explore PXWeb path structure
router.get('/explore', asyncHandler(navigationController.explorePath.bind(navigationController)));

// GET /api/navigation/categories - Get all categories and subcategories
router.get('/categories', asyncHandler(navigationController.getCategories.bind(navigationController)));

// GET /api/navigation/discover?path=...&maxDepth=2 - Discover tables in path
router.get('/discover', asyncHandler(navigationController.discoverTables.bind(navigationController)));

// GET /api/navigation/environment - Get environment statistics structure
router.get('/environment', asyncHandler(navigationController.getEnvironmentStructure.bind(navigationController)));

export default router;
