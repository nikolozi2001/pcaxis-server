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

/**
 * @route GET /api/air-quality/tbilisi/pm25-average
 * @desc Get PM2.5 average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/pm25-average', airQualityController.getTbilisiPM25Average);

/**
 * @route GET /api/air-quality/tbilisi/pm10-average
 * @desc Get PM10 average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/pm10-average', airQualityController.getTbilisiPM10Average);

/**
 * @route GET /api/air-quality/tbilisi/no2-average
 * @desc Get NO2 average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/no2-average', airQualityController.getTbilisiNO2Average);

/**
 * @route GET /api/air-quality/tbilisi/o3-average
 * @desc Get O3 average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/o3-average', airQualityController.getTbilisiO3Average);

/**
 * @route GET /api/air-quality/tbilisi/so2-average
 * @desc Get SO2 average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/so2-average', airQualityController.getTbilisiSO2Average);

/**
 * @route GET /api/air-quality/tbilisi/co-average
 * @desc Get CO average for all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/co-average', airQualityController.getTbilisiCOAverage);

/**
 * @route GET /api/air-quality/tbilisi/all-pollutants-average
 * @desc Get averages for all pollutants from all Tbilisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/tbilisi/all-pollutants-average', airQualityController.getTbilisiAllPollutantsAverage);

/**
 * @route GET /api/air-quality/kutaisi/pm25-average
 * @desc Get PM2.5 average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/pm25-average', airQualityController.getKutaisiPM25Average);

/**
 * @route GET /api/air-quality/kutaisi/pm10-average
 * @desc Get PM10 average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/pm10-average', airQualityController.getKutaisiPM10Average);

/**
 * @route GET /api/air-quality/kutaisi/no2-average
 * @desc Get NO2 average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/no2-average', airQualityController.getKutaisiNO2Average);

/**
 * @route GET /api/air-quality/kutaisi/o3-average
 * @desc Get O3 average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/o3-average', airQualityController.getKutaisiO3Average);

/**
 * @route GET /api/air-quality/kutaisi/so2-average
 * @desc Get SO2 average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/so2-average', airQualityController.getKutaisiSO2Average);

/**
 * @route GET /api/air-quality/kutaisi/co-average
 * @desc Get CO average for all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/co-average', airQualityController.getKutaisiCOAverage);

/**
 * @route GET /api/air-quality/kutaisi/all-pollutants-average
 * @desc Get averages for all pollutants from all Kutaisi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/kutaisi/all-pollutants-average', airQualityController.getKutaisiAllPollutantsAverage);

/**
 * @route GET /api/air-quality/batumi/pm25-average
 * @desc Get PM2.5 average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/pm25-average', airQualityController.getBatumiPM25Average);

/**
 * @route GET /api/air-quality/batumi/pm10-average
 * @desc Get PM10 average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/pm10-average', airQualityController.getBatumiPM10Average);

/**
 * @route GET /api/air-quality/batumi/no2-average
 * @desc Get NO2 average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/no2-average', airQualityController.getBatumiNO2Average);

/**
 * @route GET /api/air-quality/batumi/o3-average
 * @desc Get O3 average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/o3-average', airQualityController.getBatumiO3Average);

/**
 * @route GET /api/air-quality/batumi/so2-average
 * @desc Get SO2 average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/so2-average', airQualityController.getBatumiSO2Average);

/**
 * @route GET /api/air-quality/batumi/co-average
 * @desc Get CO average for all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/co-average', airQualityController.getBatumiCOAverage);

/**
 * @route GET /api/air-quality/batumi/all-pollutants-average
 * @desc Get averages for all pollutants from all Batumi monitoring stations
 * @query {number} hours - Hours of data to look back (default: 6)
 */
router.get('/batumi/all-pollutants-average', airQualityController.getBatumiAllPollutantsAverage);

export default router;