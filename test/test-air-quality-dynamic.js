/**
 * Test script for Air Quality Service
 * This script tests the dynamic air quality data fetching functionality
 */

import airQualityService from '../src/services/airQualityService.js';

async function testAirQualityService() {
  console.log('🧪 Testing Air Quality Service...\n');

  try {
    // Test 1: Get latest data for default station (TSRT)
    console.log('📊 Test 1: Getting latest data for TSRT station...');
    const latestData = await airQualityService.getLatestData({
      stationCode: 'TSRT',
      hoursBack: 24
    });
    
    console.log('✅ Success! Latest data received:');
    console.log(`   Stations found: ${latestData.totalStations}`);
    console.log(`   Timestamp: ${latestData.timestamp}`);
    
    if (latestData.stations && latestData.stations.length > 0) {
      const station = latestData.stations[0];
      console.log(`   Station: ${station.settlement} (${station.code})`);
      console.log(`   Substances available: ${station.substances.length}`);
      
      station.substances.forEach(substance => {
        console.log(`   - ${substance.name}: ${substance.latestValue} ${substance.unit_en} (${substance.qualityLevel})`);
        console.log(`     Last updated: ${substance.latestTimestamp}`);
      });
    }
    console.log('');

    // Test 2: Get specific station data
    console.log('📊 Test 2: Getting specific station data...');
    const stationData = await airQualityService.getStationData('TSRT', {
      hoursBack: 12
    });
    
    console.log('✅ Success! Station data received:');
    console.log(`   Station: ${stationData.station.settlement}`);
    console.log(`   Location: ${stationData.station.address}`);
    console.log(`   Coordinates: ${stationData.station.lat}, ${stationData.station.long}`);
    console.log('');

    // Test 3: Get latest PM10 reading
    console.log('📊 Test 3: Getting latest PM10 reading...');
    try {
      const pm10Data = await airQualityService.getLatestSubstanceReading('TSRT', 'PM10', {
        hoursBack: 6
      });
      
      console.log('✅ Success! PM10 data received:');
      console.log(`   Value: ${pm10Data.substance.value} ${pm10Data.substance.unit}`);
      console.log(`   Quality Level: ${pm10Data.substance.qualityLevel}`);
      console.log(`   Timestamp: ${pm10Data.substance.timestamp}`);
      console.log(`   Description: ${pm10Data.substance.annotation}`);
    } catch (error) {
      console.log('⚠️  PM10 data not available:', error.message);
    }
    console.log('');

    // Test 4: Get available stations
    console.log('📊 Test 4: Getting available monitoring stations...');
    const stations = await airQualityService.getStations();
    
    console.log('✅ Success! Available stations:');
    stations.forEach(station => {
      console.log(`   - ${station.code}: ${station.settlement}`);
      console.log(`     Substances: ${station.availableSubstances.join(', ')}`);
    });
    console.log('');

    // Test 5: Test date range generation
    console.log('📊 Test 5: Testing date range generation...');
    const dateRange1 = airQualityService.generateDateRange(1); // Last 1 hour
    const dateRange24 = airQualityService.generateDateRange(24); // Last 24 hours
    
    console.log('✅ Date ranges generated:');
    console.log(`   Last 1 hour: ${dateRange1.from_date_time} to ${dateRange1.to_date_time}`);
    console.log(`   Last 24 hours: ${dateRange24.from_date_time} to ${dateRange24.to_date_time}`);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAirQualityService();
}

export { testAirQualityService };