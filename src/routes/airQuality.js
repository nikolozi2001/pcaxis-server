/**
 * Air Quality Routes
 * Routes for real-time air quality data from air.gov.ge
 */
import { Router } from 'express';
import airQualityController from '../controllers/airQualityController.js';

const router = Router();

/**
 * @route GET /api/air-quality/latest
 * @desc Get latest air quality data for all pollutants
 * @query {string} station - Station code (default: TSRT - Tsereteli Ave, Tbilisi)
 * @query {string} municipality - Municipality ID (default: all)
 * @query {string} substances - Comma-separated pollutants (default: PM10,PM2.5,NO2,O3,SO2,CO)
 * @query {number} hours - Hours of data to fetch (default: 24)
 */
router.get('/latest', airQualityController.getLatestData);

/**
 * @route GET /api/air-quality/stations
 * @desc Get list of available air quality monitoring stations
 */
router.get('/stations', airQualityController.getStations);

/**
 * @route GET /api/air-quality/pollutant/:pollutant
 * @desc Get data for a specific pollutant
 * @param {string} pollutant - Pollutant name (PM10, PM2.5, NO2, O3, SO2, CO)
 * @query {string} station - Station code (default: TSRT - Tsereteli Ave, Tbilisi)
 * @query {number} hours - Hours of data to fetch (default: 24)
 */
router.get('/pollutant/:pollutant', airQualityController.getPollutantData);

/**
 * @route GET /api/air-quality/summary
 * @desc Get air quality summary with latest readings and overall status
 * @query {string} station - Station code (default: TSRT - Tsereteli Ave, Tbilisi)
 */
router.get('/summary', airQualityController.getSummary);

export default router;