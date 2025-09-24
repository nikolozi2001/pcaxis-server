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
   * Calculate average PM2.5 for Tbilisi stations
   * @param {Object} options - Options for the calculation
   * @returns {Promise<Object>} Average PM2.5 data for Tbilisi
   */
  async getTbilisiPM25Average(options = {}) {
    try {
      console.log('🔍 Calculating Tbilisi PM2.5 average...');
      
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

      // Extract PM2.5 data from each station
      const pm25Data = [];
      const stationDetails = [];

      tbilisiStations.forEach(station => {
        const pm25Substance = station.substances.find(s => s.name === 'PM2.5');
        
        if (pm25Substance && pm25Substance.latestValue !== null && pm25Substance.latestValue !== undefined) {
          pm25Data.push(pm25Substance.latestValue);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pm25Value: pm25Substance.latestValue,
            timestamp: pm25Substance.latestTimestamp,
            dataAge: pm25Substance.dataAge,
            qualityLevel: pm25Substance.qualityLevel
          });
          console.log(`   ✅ ${station.code}: ${pm25Substance.latestValue.toFixed(2)} μg/m³`);
        } else {
          console.log(`   ❌ ${station.code}: No PM2.5 data available`);
          stationDetails.push({
            code: station.code,
            settlement: station.settlement,
            address: station.address,
            pm25Value: null,
            timestamp: null,
            dataAge: null,
            qualityLevel: 'no_data'
          });
        }
      });

      if (pm25Data.length === 0) {
        throw new Error('No PM2.5 data available from any Tbilisi station');
      }

      // Calculate average
      const sum = pm25Data.reduce((acc, value) => acc + value, 0);
      const average = sum / pm25Data.length;
      const stationsWithData = pm25Data.length;
      const totalStations = tbilisiStations.length;

      // Determine overall quality level based on average
      let averageQualityLevel = 'unknown';
      if (average >= 0 && average < 12) {
        averageQualityLevel = 'good';
      } else if (average >= 12 && average < 25) {
        averageQualityLevel = 'fair';
      } else if (average >= 25 && average < 35) {
        averageQualityLevel = 'moderate';
      } else if (average >= 35 && average < 60) {
        averageQualityLevel = 'poor';
      } else if (average >= 60) {
        averageQualityLevel = 'very_poor';
      }

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

      console.log(`📊 Average PM2.5: ${average.toFixed(2)} μg/m³ (${averageQualityLevel})`);
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
        substance: 'PM2.5',
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
      console.error('Error calculating Tbilisi PM2.5 average:', error);
      throw new Error(`Failed to calculate Tbilisi PM2.5 average: ${error.message}`);
    }
  }
}

export default new AirQualityService();
