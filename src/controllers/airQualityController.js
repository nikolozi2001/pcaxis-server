/**
 * Air Quality Controller
 * Handles air quality related HTTP requests
 */
import airQualityService from '../services/airQualityService.js';

export class AirQualityController {
  /**
   * Get latest air quality data
   * @param {Request} req 
   * @param {Response} res 
   */
  async getLatestData(req, res) {
    try {
      const {
        station = 'all', // Changed default to 'all' to get all stations
        municipality = 'all',
        substances = 'PM10,PM2.5,NO2,O3,SO2,CO',
        hours = 1 // Changed to 1 hour for latest data
      } = req.query;

      // Parse substances parameter
      const substanceList = typeof substances === 'string' 
        ? substances.split(',').map(s => s.trim())
        : ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];

      const options = {
        stationCode: station,
        municipalityId: municipality,
        substances: substanceList,
        hours: parseInt(hours, 10) || 1
      };

      const airQualityData = await airQualityService.getLatestData(options);

      res.json({
        success: true,
        data: airQualityData,
        request: {
          station,
          municipality,
          substances: substanceList,
          hours: options.hours
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch air quality data',
        message: error.message
      });
    }
  }

  /**
   * Get available monitoring stations
   * @param {Request} req 
   * @param {Response} res 
   */
  async getStations(req, res) {
    try {
      const stations = await airQualityService.getStations();

      res.json({
        success: true,
        count: stations.length,
        data: stations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stations',
        message: error.message
      });
    }
  }

  /**
   * Get specific pollutant data
   * @param {Request} req 
   * @param {Response} res 
   */
  async getPollutantData(req, res) {
    try {
      const { pollutant } = req.params;
      const {
        station = 'TSRT', // Default to Tsereteli Ave station
        hours = 24
      } = req.query;

      // Validate pollutant
      const validPollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
      if (!validPollutants.includes(pollutant.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pollutant',
          message: `Pollutant must be one of: ${validPollutants.join(', ')}`,
          validPollutants
        });
      }

      const options = {
        stationCode: station,
        substances: [pollutant.toUpperCase()],
        hours: parseInt(hours, 10) || 24
      };

      const airQualityData = await airQualityService.getLatestData(options);

      // Extract specific pollutant data
      const pollutantData = airQualityData.substances?.find(s => 
        s.name.toUpperCase() === pollutant.toUpperCase()
      );

      if (!pollutantData) {
        return res.status(404).json({
          success: false,
          error: 'Pollutant data not found',
          message: `No data available for ${pollutant} at station ${station}`
        });
      }

      res.json({
        success: true,
        data: {
          pollutant: pollutantData,
          station: airQualityData.station,
          timestamp: airQualityData.timestamp
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pollutant data',
        message: error.message
      });
    }
  }

  /**
   * Get air quality summary
   * @param {Request} req 
   * @param {Response} res 
   */
  async getSummary(req, res) {
    try {
      const { station = 'TSRT' } = req.query; // Default to Tsereteli Ave station

      const options = {
        stationCode: station,
        substances: ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'],
        hours: 1 // Just get the latest reading
      };

      const airQualityData = await airQualityService.getLatestData(options);

      res.json({
        success: true,
        data: {
          station: airQualityData.station,
          timestamp: airQualityData.timestamp,
          summary: airQualityData.summary,
          latestReadings: airQualityData.substances?.map(s => ({
            name: s.name,
            value: s.latestValue,
            unit: s.unit,
            status: s.status,
            timestamp: s.latestTimestamp
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch air quality summary',
        message: error.message
      });
    }
  }

  /**
   * Get Tbilisi PM2.5 average from all stations
   * @param {Request} req 
   * @param {Response} res 
   */
  async getTbilisiPM25Average(req, res) {
    try {
      const { hours = 6 } = req.query; // Default to 6 hours back

      const options = {
        hoursBack: parseInt(hours, 10) || 6
      };

      const averageData = await airQualityService.getTbilisiPM25Average(options);

      res.json({
        success: true,
        data: averageData,
        request: {
          city: 'Tbilisi',
          substance: 'PM2.5',
          hoursBack: options.hoursBack
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to calculate Tbilisi PM2.5 average',
        message: error.message
      });
    }
  }
}

export default new AirQualityController();