/**
 * Air Quality Service
 * Handles communication with the air.gov.ge API for air quality data
 */

export class AirQualityService {
  constructor() {
    this.baseUrl = 'https://air.gov.ge/api';
    this.defaultStationCode = 'TSRT';
  }

  /**
   * Generate dynamic date range for API calls
   * @param {number} hoursBack - How many hours back from current time
   * @returns {Object} Object with from_date_time and to_date_time
   */
  generateDateRange(hoursBack = 24) {
    const now = new Date();
    // Add a few hours to the end time to catch any available future data
    const endTime = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // 4 hours ahead
    const fromDate = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));
    
    // Format dates to match API requirements (ISO format without milliseconds)
    const toDateTime = endTime.toISOString().slice(0, 19);
    const fromDateTime = fromDate.toISOString().slice(0, 19);
    
    return {
      from_date_time: fromDateTime,
      to_date_time: toDateTime
    };
  }

  /**
   * Smart data fetching - tries to get the most recent available data
   * @param {Object} options - API call options
   * @returns {Promise<Object>} Latest available data
   */
  async getSmartLatestData(options = {}) {
    const { stationCode = this.defaultStationCode } = options;
    
    // Try different time ranges to find the most recent data
    const hoursBackOptions = [6, 12, 24, 48];
    
    for (const hoursBack of hoursBackOptions) {
      try {
        const url = this.buildApiUrl({ ...options, hoursBack });
        console.log(`Trying ${hoursBack}h range: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) continue;
        
        const rawData = await response.json();
        const processedData = this.extractLatestData(rawData);
        
        if (processedData && processedData.length > 0) {
          // Check if we have recent data (less than 2 hours old)
          const station = processedData[0];
          if (station.substances && station.substances.length > 0) {
            const latestReading = station.substances[0];
            const dataAge = latestReading.dataAge;
            
            if (dataAge && dataAge.ageMinutes < 180) { // Less than 3 hours old
              return {
                success: true,
                timestamp: new Date().toISOString(),
                currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
                  timeZone: 'Asia/Tbilisi',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }),
                requestOptions: { ...options, hoursBack },
                stations: processedData,
                totalStations: processedData.length,
                dataFreshness: {
                  overall: dataAge.freshness,
                  oldestDataAgeMinutes: dataAge.ageMinutes,
                  isRealTime: dataAge.isRealTime,
                  note: dataAge.ageMinutes > 60 ? 'Data may have processing delays - this is normal for air quality monitoring systems' : null
                }
              };
            }
          }
        }
      } catch (error) {
        console.log(`Error with ${hoursBack}h range:`, error.message);
      }
    }
    
    // If we couldn't find recent data, fall back to regular method
    return this.getLatestData(options);
  }

  /**
   * Build API URL with query parameters
   * @param {Object} options - API call options
   * @returns {string} Complete API URL
   */
  buildApiUrl(options = {}) {
    const {
      stationCode = this.defaultStationCode,
      municipalityId = 'all',
      substance = 'all',
      lastData = false,
      chart = true,
      format = 'json',
      hoursBack = 24
    } = options;

    const dateRange = this.generateDateRange(hoursBack);
    
    const params = new URLSearchParams({
      from_date_time: dateRange.from_date_time,
      to_date_time: dateRange.to_date_time,
      station_code: stationCode,
      municipality_id: municipalityId,
      substance: substance,
      last_data: lastData.toString(),
      chart: chart.toString(),
      format: format
    });

    return `${this.baseUrl}/get_data_1hour/?${params.toString()}`;
  }

  /**
   * Get current time in Georgia timezone
   * @returns {Date} Current time in Georgia timezone
   */
  getCurrentGeorgiaTime() {
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Tbilisi"}));
  }

  /**
   * Calculate data freshness/age
   * @param {string} timestamp - Data timestamp
   * @returns {Object} Data age information
   */
  calculateDataAge(timestamp) {
    const dataTime = new Date(timestamp);
    const currentGeorgiaTime = this.getCurrentGeorgiaTime();
    const ageMinutes = Math.floor((currentGeorgiaTime - dataTime) / (1000 * 60));
    const ageHours = Math.floor(ageMinutes / 60);
    
    let ageText = '';
    let freshness = 'unknown';
    
    if (ageMinutes < 60) {
      ageText = `${ageMinutes} minutes ago`;
      freshness = ageMinutes <= 15 ? 'very_fresh' : ageMinutes <= 30 ? 'fresh' : 'moderate';
    } else if (ageHours < 24) {
      ageText = `${ageHours} hour${ageHours > 1 ? 's' : ''} ago`;
      freshness = ageHours <= 2 ? 'moderate' : ageHours <= 6 ? 'stale' : 'very_stale';
    } else {
      const ageDays = Math.floor(ageHours / 24);
      ageText = `${ageDays} day${ageDays > 1 ? 's' : ''} ago`;
      freshness = 'very_stale';
    }
    
    return {
      ageMinutes,
      ageHours,
      ageText,
      freshness,
      isRealTime: ageMinutes <= 15,
      dataTime: dataTime.toLocaleString('en-US', {
        timeZone: 'Asia/Tbilisi',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  }

  /**
   * Extract the latest hourly data from API response
   * @param {Array} apiData - Raw API response data
   * @returns {Object} Processed latest data
   */
  extractLatestData(apiData) {
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return null;
    }

    const currentTime = new Date();
    const results = [];

    // Process each station
    apiData.forEach(station => {
      const stationInfo = {
        id: station.id,
        code: station.code,
        settlement: station.settlement,
        settlement_en: station.settlement_en,
        address: station.address,
        lat: station.lat,
        long: station.long,
        substances: []
      };

      // Process each substance for this station
      station.stationequipment_set?.forEach(equipment => {
        const substance = equipment.substance;
        const data1hour = equipment.data1hour_set || [];

        if (substance && data1hour.length > 0) {
          // Find the most recent data point
          let latestReading = null;
          let latestTimestamp = null;

          data1hour.forEach(reading => {
            const readingTime = new Date(reading.date_time);
            if (!latestTimestamp || readingTime > latestTimestamp) {
              latestTimestamp = readingTime;
              latestReading = reading;
            }
          });

          if (latestReading) {
            // Calculate data age and freshness
            const dataAge = this.calculateDataAge(latestReading.date_time);
            
            // Determine air quality level based on PM10 standards (example)
            let qualityLevel = 'unknown';
            if (substance.airqualityindexlevel_set && substance.airqualityindexlevel_set.length > 0) {
              const levels = substance.airqualityindexlevel_set[0];
              const value = latestReading.value;
              
              if (value >= levels.good_from && value < levels.good_to) {
                qualityLevel = 'good';
              } else if (value >= levels.fair_from && value < levels.fair_to) {
                qualityLevel = 'fair';
              } else if (value >= levels.moderate_from && value < levels.moderate_to) {
                qualityLevel = 'moderate';
              } else if (value >= levels.poor_from && value < levels.poor_to) {
                qualityLevel = 'poor';
              } else if (value >= levels.very_poor_from) {
                qualityLevel = 'very_poor';
              }
            }

            stationInfo.substances.push({
              name: substance.name,
              unit_ge: substance.unit_ge,
              unit_en: substance.unit_en,
              annotation_ge: substance.annotation_ge,
              annotation_en: substance.annotation_en,
              latestValue: latestReading.value,
              latestTimestamp: latestReading.date_time,
              qualityLevel: qualityLevel,
              dataAge: dataAge,
              allReadings: data1hour.map(reading => ({
                value: reading.value,
                timestamp: reading.date_time
              }))
            });
          }
        }
      });

      if (stationInfo.substances.length > 0) {
        results.push(stationInfo);
      }
    });

    return results;
  }

  /**
   * Get latest air quality data from the API
   * @param {Object} options - Options for the API call
   * @returns {Promise<Object>} Latest air quality data
   */
  async getLatestData(options = {}) {
    try {
      const url = this.buildApiUrl(options);
      console.log('Fetching air quality data from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      const processedData = this.extractLatestData(rawData);
      
      // Calculate overall data freshness
      let overallFreshness = 'unknown';
      let oldestDataAge = 0;
      
      if (processedData && processedData.length > 0) {
        processedData.forEach(station => {
          station.substances.forEach(substance => {
            if (substance.dataAge && substance.dataAge.ageMinutes > oldestDataAge) {
              oldestDataAge = substance.dataAge.ageMinutes;
              overallFreshness = substance.dataAge.freshness;
            }
          });
        });
      }

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        requestOptions: options,
        stations: processedData,
        totalStations: processedData?.length || 0,
        dataFreshness: {
          overall: overallFreshness,
          oldestDataAgeMinutes: oldestDataAge,
          isRealTime: oldestDataAge <= 15,
          note: oldestDataAge > 60 ? 'Data may have processing delays - this is normal for air quality monitoring systems' : null
        }
      };
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw new Error(`Failed to fetch air quality data: ${error.message}`);
    }
  }

  /**
   * Get data for a specific station
   * @param {string} stationCode - Station code (e.g., 'TSRT')
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Station-specific data
   */
  async getStationData(stationCode, options = {}) {
    const data = await this.getLatestData({
      ...options,
      stationCode: stationCode
    });
    
    const station = data.stations?.find(s => s.code === stationCode);
    
    if (!station) {
      throw new Error(`No data found for station: ${stationCode}`);
    }
    
    return {
      ...data,
      station: station
    };
  }

  /**
   * Get the most recent reading for a specific substance at a station
   * @param {string} stationCode - Station code
   * @param {string} substanceName - Substance name (e.g., 'PM10')
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Latest substance reading
   */
  async getLatestSubstanceReading(stationCode, substanceName, options = {}) {
    const stationData = await this.getStationData(stationCode, options);
    
    const substance = stationData.station.substances?.find(s => 
      s.name.toUpperCase() === substanceName.toUpperCase()
    );
    
    if (!substance) {
      throw new Error(`No data found for substance ${substanceName} at station ${stationCode}`);
    }
    
    return {
      station: {
        code: stationData.station.code,
        settlement: stationData.station.settlement,
        address: stationData.station.address
      },
      substance: {
        name: substance.name,
        value: substance.latestValue,
        unit: substance.unit_en || substance.unit_ge,
        qualityLevel: substance.qualityLevel,
        timestamp: substance.latestTimestamp,
        annotation: substance.annotation_en || substance.annotation_ge
      },
      timestamp: stationData.timestamp
    };
  }

  /**
   * Get available monitoring stations
   * @returns {Promise<Array>} List of available stations
   */
  async getStations() {
    try {
      // This would typically be a separate endpoint, but we can extract from data call
      const data = await this.getLatestData({ 
        stationCode: 'all',
        hoursBack: 1 // Just get recent data to identify stations
      });
      
      return data.stations?.map(station => ({
        id: station.id,
        code: station.code,
        settlement: station.settlement,
        settlement_en: station.settlement_en,
        address: station.address,
        lat: station.lat,
        long: station.long,
        availableSubstances: station.substances.map(s => s.name)
      })) || [];
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw new Error(`Failed to fetch stations: ${error.message}`);
    }
  }

  /**
   * Calculate average for a specific pollutant for Tbilisi stations
   * @param {string} pollutant - The pollutant name (PM10, PM2.5, NO2, O3, SO2, CO)
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average pollutant data for Tbilisi
   */
  async getTbilisiPollutantAverage(pollutant, options = {}) {
    try {
      console.log(`🔍 Calculating Tbilisi ${pollutant} average...`);
      
      // Validate pollutant
      const validPollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
      if (!validPollutants.includes(pollutant.toUpperCase())) {
        throw new Error(`Invalid pollutant: ${pollutant}. Must be one of: ${validPollutants.join(', ')}`);
      }

      const pollutantName = pollutant.toUpperCase();
      
      // Get data from all stations
      const allData = await this.getLatestData({
        stationCode: 'all',
        hoursBack: options.hoursBack || 6
      });

      // Filter Tbilisi stations (stations that have "თბილისი" in their settlement name)
      const tbilisiStations = allData.stations.filter(station => 
        station.settlement.includes('თბილისი')
      );

      console.log(`📍 Found ${tbilisiStations.length} Tbilisi stations`);

      // Extract pollutant data from each station
      const pollutantData = [];
      const stationDetails = [];

      tbilisiStations.forEach(station => {
        const substance = station.substances.find(s => s.name === pollutantName);
        
        if (substance && substance.latestValue !== null && substance.latestValue !== undefined) {
          pollutantData.push(substance.latestValue);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: substance.latestValue,
            timestamp: substance.latestTimestamp,
            dataAge: substance.dataAge,
            qualityLevel: substance.qualityLevel
          });
          console.log(`   ✅ ${station.code}: ${substance.latestValue.toFixed(2)} ${substance.unit_en || 'μg/m³'}`);
        } else {
          console.log(`   ❌ ${station.code}: No ${pollutantName} data available`);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: null,
            timestamp: null,
            dataAge: null,
            qualityLevel: 'no_data'
          });
        }
      });

      if (pollutantData.length === 0) {
        throw new Error(`No ${pollutantName} data available from any Tbilisi station`);
      }

      // Calculate average
      const sum = pollutantData.reduce((acc, value) => acc + value, 0);
      const average = sum / pollutantData.length;
      const stationsWithData = pollutantData.length;
      const totalStations = tbilisiStations.length;

      // Determine overall quality level based on average and pollutant type
      let averageQualityLevel = this.determineQualityLevel(pollutantName, average);

      // Find the most recent timestamp among all stations
      let mostRecentTimestamp = null;
      let oldestDataAgeMinutes = 0;
      
      stationDetails.forEach(station => {
        if (station.timestamp && station.dataAge) {
          const stationTime = new Date(station.timestamp);
          if (!mostRecentTimestamp || stationTime > mostRecentTimestamp) {
            mostRecentTimestamp = stationTime;
          }
          if (station.dataAge.ageMinutes > oldestDataAgeMinutes) {
            oldestDataAgeMinutes = station.dataAge.ageMinutes;
          }
        }
      });

      console.log(`📊 Average ${pollutantName}: ${average.toFixed(2)} μg/m³ (${averageQualityLevel})`);
      console.log(`📈 Based on ${stationsWithData}/${totalStations} stations with data`);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        city: 'Tbilisi',
        substance: pollutantName,
        average: {
          value: parseFloat(average.toFixed(2)),
          unit: 'μg/m³',
          qualityLevel: averageQualityLevel,
          calculation: {
            sum: parseFloat(sum.toFixed(2)),
            stationsWithData: stationsWithData,
            totalStations: totalStations,
            formula: `${sum.toFixed(2)} ÷ ${stationsWithData} = ${average.toFixed(2)}`
          }
        },
        stations: stationDetails,
        dataFreshness: {
          mostRecentTimestamp: mostRecentTimestamp?.toISOString(),
          oldestDataAgeMinutes: oldestDataAgeMinutes,
          note: oldestDataAgeMinutes > 60 ? 'Some station data may have processing delays' : null
        },
        requestOptions: options
      };

    } catch (error) {
      console.error(`Error calculating Tbilisi ${pollutant} average:`, error);
      throw new Error(`Failed to calculate Tbilisi ${pollutant} average: ${error.message}`);
    }
  }

  /**
   * Determine quality level based on pollutant type and value
   * @param {string} pollutant - Pollutant name
   * @param {number} value - Pollutant value
   * @returns {string} Quality level
   */
  determineQualityLevel(pollutant, value) {
    const thresholds = {
      'PM10': { good: 20, fair: 35, moderate: 50, poor: 100 },
      'PM2.5': { good: 12, fair: 25, moderate: 35, poor: 60 },
      'NO2': { good: 40, fair: 70, moderate: 150, poor: 200 },
      'O3': { good: 60, fair: 120, moderate: 180, poor: 240 },
      'SO2': { good: 20, fair: 80, moderate: 250, poor: 350 },
      'CO': { good: 4000, fair: 8000, moderate: 15000, poor: 30000 }
    };

    const levels = thresholds[pollutant];
    if (!levels) return 'unknown';

    if (value <= levels.good) return 'good';
    if (value <= levels.fair) return 'fair';
    if (value <= levels.moderate) return 'moderate';
    if (value <= levels.poor) return 'poor';
    return 'very_poor';
  }

  /**
   * Calculate average PM2.5 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average PM2.5 data for Tbilisi
   */
  async getTbilisiPM25Average(options = {}) {
    return this.getTbilisiPollutantAverage('PM2.5', options);
  }

  /**
   * Calculate average PM10 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average PM10 data for Tbilisi
   */
  async getTbilisiPM10Average(options = {}) {
    return this.getTbilisiPollutantAverage('PM10', options);
  }

  /**
   * Calculate average NO2 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average NO2 data for Tbilisi
   */
  async getTbilisiNO2Average(options = {}) {
    return this.getTbilisiPollutantAverage('NO2', options);
  }

  /**
   * Calculate average O3 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average O3 data for Tbilisi
   */
  async getTbilisiO3Average(options = {}) {
    return this.getTbilisiPollutantAverage('O3', options);
  }

  /**
   * Calculate average SO2 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average SO2 data for Tbilisi
   */
  async getTbilisiSO2Average(options = {}) {
    return this.getTbilisiPollutantAverage('SO2', options);
  }

  /**
   * Calculate average CO for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average CO data for Tbilisi
   */
  async getTbilisiCOAverage(options = {}) {
    return this.getTbilisiPollutantAverage('CO', options);
  }

  /**
   * Get all pollutant averages for Tbilisi
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} All pollutant averages for Tbilisi
   */
  async getTbilisiAllPollutantsAverage(options = {}) {
    try {
      console.log('🔍 Calculating all pollutants averages for Tbilisi...');
      
      const pollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
      const results = {};
      const errors = {};

      for (const pollutant of pollutants) {
        try {
          const result = await this.getTbilisiPollutantAverage(pollutant, options);
          results[pollutant] = result;
        } catch (error) {
          console.log(`⚠️ Failed to get ${pollutant} average: ${error.message}`);
          errors[pollutant] = error.message;
        }
      }

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        city: 'Tbilisi',
        pollutantAverages: results,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        summary: {
          totalPollutants: pollutants.length,
          successfulCalculations: Object.keys(results).length,
          failedCalculations: Object.keys(errors).length
        }
      };

    } catch (error) {
      console.error('Error calculating all pollutants averages:', error);
      throw new Error(`Failed to calculate all pollutants averages: ${error.message}`);
    }
  }

  /**
   * Generic method to calculate average for any pollutant for Kutaisi stations
   * @param {string} pollutant - Pollutant name (PM10, PM2.5, NO2, O3, SO2, CO)
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average pollutant data for Kutaisi
   */
  async getKutaisiPollutantAverage(pollutant, options = {}) {
    try {
      console.log(`🔍 Calculating Kutaisi ${pollutant} average...`);
      
      // Validate pollutant
      const validPollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
      if (!validPollutants.includes(pollutant.toUpperCase())) {
        throw new Error(`Invalid pollutant: ${pollutant}. Must be one of: ${validPollutants.join(', ')}`);
      }

      const pollutantName = pollutant.toUpperCase();
      
      // Get data from all stations
      const allData = await this.getLatestData({
        stationCode: 'all',
        hoursBack: options.hoursBack || 6
      });

      // Filter Kutaisi stations (stations that have "ქუთაისი" in their settlement name)
      const kutaisiStations = allData.stations.filter(station => 
        station.settlement.includes('ქუთაისი')
      );

      console.log(`📍 Found ${kutaisiStations.length} Kutaisi stations`);

      // Extract pollutant data from each station
      const pollutantData = [];
      const stationDetails = [];

      kutaisiStations.forEach(station => {
        const substance = station.substances.find(s => s.name === pollutantName);
        
        if (substance && substance.latestValue !== null && substance.latestValue !== undefined) {
          pollutantData.push(substance.latestValue);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: substance.latestValue,
            timestamp: substance.latestTimestamp,
            dataAge: substance.dataAge,
            qualityLevel: substance.qualityLevel
          });
          console.log(`   ✅ ${station.code}: ${substance.latestValue.toFixed(2)} ${substance.unit_en || 'μg/m³'}`);
        } else {
          console.log(`   ❌ ${station.code}: No ${pollutantName} data available`);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: null,
            timestamp: null,
            dataAge: null,
            qualityLevel: 'no_data'
          });
        }
      });

      if (pollutantData.length === 0) {
        throw new Error(`No ${pollutantName} data available from any Kutaisi station`);
      }

      // Calculate average
      const sum = pollutantData.reduce((acc, value) => acc + value, 0);
      const average = sum / pollutantData.length;
      const stationsWithData = pollutantData.length;
      const totalStations = kutaisiStations.length;

      // Determine overall quality level based on average and pollutant type
      let averageQualityLevel = this.determineQualityLevel(pollutantName, average);

      // Find the most recent timestamp among all stations
      let mostRecentTimestamp = null;
      let oldestDataAgeMinutes = 0;
      
      stationDetails.forEach(station => {
        if (station.timestamp && station.dataAge) {
          const stationTime = new Date(station.timestamp);
          if (!mostRecentTimestamp || stationTime > mostRecentTimestamp) {
            mostRecentTimestamp = stationTime;
          }
          if (station.dataAge.ageMinutes > oldestDataAgeMinutes) {
            oldestDataAgeMinutes = station.dataAge.ageMinutes;
          }
        }
      });

      console.log(`📊 Average ${pollutantName}: ${average.toFixed(2)} μg/m³ (${averageQualityLevel})`);
      console.log(`📈 Based on ${stationsWithData}/${totalStations} stations with data`);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        city: 'Kutaisi',
        substance: pollutantName,
        average: {
          value: parseFloat(average.toFixed(2)),
          unit: 'μg/m³',
          qualityLevel: averageQualityLevel,
          calculation: {
            sum: parseFloat(sum.toFixed(2)),
            stationsWithData: stationsWithData,
            totalStations: totalStations,
            formula: `${sum.toFixed(2)} ÷ ${stationsWithData} = ${average.toFixed(2)}`
          }
        },
        stations: stationDetails,
        dataFreshness: {
          mostRecentTimestamp: mostRecentTimestamp?.toISOString(),
          oldestDataAgeMinutes: oldestDataAgeMinutes,
          note: oldestDataAgeMinutes > 60 ? 'Some station data may have processing delays' : null
        },
        requestOptions: options
      };

    } catch (error) {
      console.error(`Error calculating Kutaisi ${pollutant} average:`, error);
      throw new Error(`Failed to calculate Kutaisi ${pollutant} average: ${error.message}`);
    }
  }

  /**
   * Calculate average PM2.5 for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average PM2.5 data for Kutaisi
   */
  async getKutaisiPM25Average(options = {}) {
    return this.getKutaisiPollutantAverage('PM2.5', options);
  }

  /**
   * Calculate average PM10 for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average PM10 data for Kutaisi
   */
  async getKutaisiPM10Average(options = {}) {
    return this.getKutaisiPollutantAverage('PM10', options);
  }

  /**
   * Calculate average NO2 for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average NO2 data for Kutaisi
   */
  async getKutaisiNO2Average(options = {}) {
    return this.getKutaisiPollutantAverage('NO2', options);
  }

  /**
   * Calculate average O3 for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average O3 data for Kutaisi
   */
  async getKutaisiO3Average(options = {}) {
    return this.getKutaisiPollutantAverage('O3', options);
  }

  /**
   * Calculate average SO2 for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average SO2 data for Kutaisi
   */
  async getKutaisiSO2Average(options = {}) {
    return this.getKutaisiPollutantAverage('SO2', options);
  }

  /**
   * Calculate average CO for Kutaisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average CO data for Kutaisi
   */
  async getKutaisiCOAverage(options = {}) {
    return this.getKutaisiPollutantAverage('CO', options);
  }

  /**
   * Get all pollutant averages for Kutaisi
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} All pollutant averages for Kutaisi
   */
  async getKutaisiAllPollutantsAverage(options = {}) {
    try {
      console.log('🔍 Calculating all pollutants averages for Kutaisi...');
      
      const pollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
      const results = {};
      const errors = {};

      for (const pollutant of pollutants) {
        try {
          const result = await this.getKutaisiPollutantAverage(pollutant, options);
          results[pollutant] = result;
        } catch (error) {
          console.log(`⚠️ Failed to get ${pollutant} average: ${error.message}`);
          errors[pollutant] = error.message;
        }
      }

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: this.getCurrentGeorgiaTime().toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        city: 'Kutaisi',
        pollutantAverages: results,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        summary: {
          totalPollutants: pollutants.length,
          successfulCalculations: Object.keys(results).length,
          failedCalculations: Object.keys(errors).length
        }
      };

    } catch (error) {
      console.error('Error calculating all pollutants averages:', error);
      throw new Error(`Failed to calculate all pollutants averages: ${error.message}`);
    }
  }

  /**
   * Generic method to calculate pollutant average for Batumi stations
   * @param {string} substance - The pollutant substance (e.g., 'PM2.5', 'PM10', etc.)
   * @param {Object} options - Query options
   * @returns {Object} Average pollutant data with station breakdown
   */
  async getBatumiPollutantAverage(substance, options = {}) {
    const { hoursBack = 6 } = options;
    
    console.log(`🔍 Calculating Batumi ${substance} average...`);
    
    try {
      // Get all data for the time period
      const allData = await this.getLatestData({
        stationCode: 'all',
        hoursBack
      });

      // Filter for Batumi stations (using Georgian text - must start with ქ.ბათუმი)
      const batumiStations = allData.stations.filter(station => 
        station.settlement.startsWith('ქ.ბათუმი')
      );

      console.log(`📍 Found ${batumiStations.length} Batumi stations`);

      if (batumiStations.length === 0) {
        throw new Error(`No Batumi monitoring stations found`);
      }

      // Extract pollutant data from each station
      const stationData = [];
      let totalValue = 0;
      let stationsWithData = 0;
      let oldestDataAgeMinutes = 0;
      let unit = '';

      for (const station of batumiStations) {
        // Find the specific substance data
        const substanceData = station.substances?.find(s => 
          s.name === substance || s.name === substance.replace('.', '.')
        );

        if (substanceData && substanceData.latestValue !== null && substanceData.latestValue !== undefined) {
          const value = parseFloat(substanceData.latestValue);
          
          if (!isNaN(value)) {
            totalValue += value;
            stationsWithData++;
            unit = substanceData.unit || 'μg/m³';
            
            // Calculate data age
            const dataAge = this.calculateDataAge(substanceData.latestTimestamp);
            oldestDataAgeMinutes = Math.max(oldestDataAgeMinutes, dataAge.ageMinutes);
            
            console.log(`   ✅ ${station.code}: ${value.toFixed(2)} ${unit}`);
            
            stationData.push({
              code: station.code,
              settlement: station.settlement,
              address: station.address,
              pollutantValue: value,
              timestamp: substanceData.latestTimestamp,
              dataAge,
              qualityLevel: this.determineQualityLevel(substance, value)
            });
          } else {
            console.log(`   ❌ ${station.code}: Invalid ${substance} data`);
            stationData.push({
              code: station.code,
              settlement: station.settlement,
              address: station.address,
              pollutantValue: null,
              timestamp: null,
              dataAge: null,
              qualityLevel: 'no_data'
            });
          }
        } else {
          console.log(`   ❌ ${station.code}: No ${substance} data available`);
          stationData.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: null,
            timestamp: null,
            dataAge: null,
            qualityLevel: 'no_data'
          });
        }
      }

      if (stationsWithData === 0) {
        throw new Error(`No ${substance} data available from any Batumi station`);
      }

      // Calculate average
      const averageValue = totalValue / stationsWithData;
      const qualityLevel = this.determineQualityLevel(substance, averageValue);
      
      console.log(`📊 Average ${substance}: ${averageValue.toFixed(2)} ${unit} (${qualityLevel})`);
      console.log(`📈 Based on ${stationsWithData}/${batumiStations.length} stations with data`);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        city: 'Batumi',
        substance,
        average: {
          value: Math.round(averageValue * 100) / 100,
          unit,
          qualityLevel,
          calculation: {
            sum: Math.round(totalValue * 100) / 100,
            stationsWithData,
            totalStations: batumiStations.length,
            formula: `${totalValue.toFixed(2)} ÷ ${stationsWithData} = ${averageValue.toFixed(2)}`
          }
        },
        stations: stationData,
        dataFreshness: {
          mostRecentTimestamp: new Date(Date.now() - oldestDataAgeMinutes * 60000).toISOString(),
          oldestDataAgeMinutes,
          note: oldestDataAgeMinutes > 120 ? 'Some station data may have processing delays' : null
        },
        requestOptions: {
          hoursBack
        }
      };

    } catch (error) {
      console.error(`Error calculating Batumi ${substance} average:`, error);
      throw new Error(`Failed to calculate Batumi ${substance} average: ${error.message}`);
    }
  }

  /**
   * Get Batumi PM10 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} PM10 average data
   */
  async getBatumiPM10Average(options = {}) {
    return this.getBatumiPollutantAverage('PM10', options);
  }

  /**
   * Get Batumi PM2.5 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} PM2.5 average data
   */
  async getBatumiPM25Average(options = {}) {
    return this.getBatumiPollutantAverage('PM2.5', options);
  }

  /**
   * Get Batumi NO2 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} NO2 average data
   */
  async getBatumiNO2Average(options = {}) {
    return this.getBatumiPollutantAverage('NO2', options);
  }

  /**
   * Get Batumi O3 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} O3 average data
   */
  async getBatumiO3Average(options = {}) {
    return this.getBatumiPollutantAverage('O3', options);
  }

  /**
   * Get Batumi SO2 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} SO2 average data
   */
  async getBatumiSO2Average(options = {}) {
    return this.getBatumiPollutantAverage('SO2', options);
  }

  /**
   * Get Batumi CO average from all stations
   * @param {Object} options - Query options
   * @returns {Object} CO average data
   */
  async getBatumiCOAverage(options = {}) {
    return this.getBatumiPollutantAverage('CO', options);
  }

  /**
   * Get comprehensive air quality report for all pollutants in Batumi
   * @param {Object} options - Query options
   * @returns {Object} Comprehensive air quality data for all pollutants
   */
  async getBatumiAllPollutantsAverage(options = {}) {
    console.log('🔍 Calculating all pollutants averages for Batumi...');
    
    const pollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
    const results = {};
    const errors = {};
    let successfulCalculations = 0;

    for (const pollutant of pollutants) {
      try {
        const result = await this.getBatumiPollutantAverage(pollutant, options);
        results[pollutant] = result;
        successfulCalculations++;
      } catch (error) {
        console.error(`⚠️ Failed to get ${pollutant} average:`, error.message);
        errors[pollutant] = error.message;
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      currentGeorgiaTime: new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Tbilisi',
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      city: 'Batumi',
      pollutantAverages: results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      summary: {
        totalPollutants: pollutants.length,
        successfulCalculations,
        failedCalculations: pollutants.length - successfulCalculations
      }
    };
  }

  /**
   * Generic method to calculate pollutant average for Rustavi stations
   * @param {string} substance - The pollutant substance (e.g., 'PM2.5', 'PM10', etc.)
   * @param {Object} options - Query options
   * @returns {Object} Average pollutant data with station breakdown
   */
  async getRustaviPollutantAverage(substance, options = {}) {
    const { hoursBack = 6 } = options;
    
    console.log(`🔍 Calculating Rustavi ${substance} average...`);
    
    try {
      // Get all data for the time period
      const allData = await this.getLatestData({
        stationCode: 'all',
        hoursBack
      });

      // Filter for Rustavi stations (using Georgian text - starts with ქ.რუსთავი)
      // Handle both formats: "ქ.რუსთავი - " and "ქ.რუსთავი-"
      // Also handle BOM and other invisible characters by trimming
      const rustaviStations = allData.stations.filter(station => {
        const cleanSettlement = station.settlement.replace(/^\ufeff/, '').trim();
        return cleanSettlement.startsWith('ქ.რუსთავი-') || 
               cleanSettlement.startsWith('ქ.რუსთავი ');
      });

      console.log(`📍 Found ${rustaviStations.length} Rustavi stations`);

      if (rustaviStations.length === 0) {
        throw new Error(`No Rustavi monitoring stations found`);
      }

      // Extract pollutant data from each station
      const stationData = [];
      let totalValue = 0;
      let stationsWithData = 0;
      let oldestDataAgeMinutes = 0;
      let unit = '';

      for (const station of rustaviStations) {
        // Find the specific substance data
        const substanceData = station.substances?.find(s => 
          s.name === substance || s.name === substance.replace('.', '.')
        );

        if (substanceData && substanceData.latestValue !== null && substanceData.latestValue !== undefined) {
          const value = parseFloat(substanceData.latestValue);
          
          if (!isNaN(value)) {
            totalValue += value;
            stationsWithData++;
            unit = substanceData.unit || 'μg/m³';
            
            // Calculate data age
            const dataAge = this.calculateDataAge(substanceData.latestTimestamp);
            oldestDataAgeMinutes = Math.max(oldestDataAgeMinutes, dataAge.ageMinutes);
            
            console.log(`   ✅ ${station.code}: ${value.toFixed(2)} ${unit}`);
            
            stationData.push({
              code: station.code,
              settlement: station.settlement,
              address: station.address,
              pollutantValue: value,
              timestamp: substanceData.latestTimestamp,
              dataAge,
              qualityLevel: this.determineQualityLevel(substance, value)
            });
          } else {
            console.log(`   ❌ ${station.code}: Invalid ${substance} data`);
            stationData.push({
              code: station.code,
              settlement: station.settlement,
              address: station.address,
              pollutantValue: null,
              timestamp: null,
              dataAge: null,
              qualityLevel: 'no_data'
            });
          }
        } else {
          console.log(`   ❌ ${station.code}: No ${substance} data available`);
          stationData.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pollutantValue: null,
            timestamp: null,
            dataAge: null,
            qualityLevel: 'no_data'
          });
        }
      }

      if (stationsWithData === 0) {
        throw new Error(`No ${substance} data available from any Rustavi station`);
      }

      // Calculate average
      const averageValue = totalValue / stationsWithData;
      const qualityLevel = this.determineQualityLevel(substance, averageValue);
      
      console.log(`📊 Average ${substance}: ${averageValue.toFixed(2)} ${unit} (${qualityLevel})`);
      console.log(`📈 Based on ${stationsWithData}/${rustaviStations.length} stations with data`);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        currentGeorgiaTime: new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Tbilisi',
          year: 'numeric',
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        city: 'Rustavi',
        substance,
        average: {
          value: Math.round(averageValue * 100) / 100,
          unit,
          qualityLevel,
          calculation: {
            sum: Math.round(totalValue * 100) / 100,
            stationsWithData,
            totalStations: rustaviStations.length,
            formula: `${totalValue.toFixed(2)} ÷ ${stationsWithData} = ${averageValue.toFixed(2)}`
          }
        },
        stations: stationData,
        dataFreshness: {
          mostRecentTimestamp: new Date(Date.now() - oldestDataAgeMinutes * 60000).toISOString(),
          oldestDataAgeMinutes,
          note: oldestDataAgeMinutes > 120 ? 'Some station data may have processing delays' : null
        },
        requestOptions: {
          hoursBack
        }
      };

    } catch (error) {
      console.error(`Error calculating Rustavi ${substance} average:`, error);
      throw new Error(`Failed to calculate Rustavi ${substance} average: ${error.message}`);
    }
  }

  /**
   * Get Rustavi PM10 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} PM10 average data
   */
  async getRustaviPM10Average(options = {}) {
    return this.getRustaviPollutantAverage('PM10', options);
  }

  /**
   * Get Rustavi PM2.5 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} PM2.5 average data
   */
  async getRustaviPM25Average(options = {}) {
    return this.getRustaviPollutantAverage('PM2.5', options);
  }

  /**
   * Get Rustavi NO2 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} NO2 average data
   */
  async getRustaviNO2Average(options = {}) {
    return this.getRustaviPollutantAverage('NO2', options);
  }

  /**
   * Get Rustavi O3 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} O3 average data
   */
  async getRustaviO3Average(options = {}) {
    return this.getRustaviPollutantAverage('O3', options);
  }

  /**
   * Get Rustavi SO2 average from all stations
   * @param {Object} options - Query options
   * @returns {Object} SO2 average data
   */
  async getRustaviSO2Average(options = {}) {
    return this.getRustaviPollutantAverage('SO2', options);
  }

  /**
   * Get Rustavi CO average from all stations
   * @param {Object} options - Query options
   * @returns {Object} CO average data
   */
  async getRustaviCOAverage(options = {}) {
    return this.getRustaviPollutantAverage('CO', options);
  }

  /**
   * Get comprehensive air quality report for all pollutants in Rustavi
   * @param {Object} options - Query options
   * @returns {Object} Comprehensive air quality data for all pollutants
   */
  async getRustaviAllPollutantsAverage(options = {}) {
    console.log('🔍 Calculating all pollutants averages for Rustavi...');
    
    const pollutants = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO'];
    const results = {};
    const errors = {};
    let successfulCalculations = 0;

    for (const pollutant of pollutants) {
      try {
        const result = await this.getRustaviPollutantAverage(pollutant, options);
        results[pollutant] = result;
        successfulCalculations++;
      } catch (error) {
        console.error(`⚠️ Failed to get ${pollutant} average:`, error.message);
        errors[pollutant] = error.message;
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      currentGeorgiaTime: new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Tbilisi',
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      city: 'Rustavi',
      pollutantAverages: results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      summary: {
        totalPollutants: pollutants.length,
        successfulCalculations,
        failedCalculations: pollutants.length - successfulCalculations
      }
    };
  }
}

export default new AirQualityService();
