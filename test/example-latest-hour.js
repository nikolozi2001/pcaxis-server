/**
 * Example: Get Latest Hour Air Quality Data
 * This example demonstrates how to get the most recent air quality readings
 */

import airQualityService from '../src/services/airQualityService.js';

async function getLatestHourData() {
  try {
    console.log('🌍 Getting latest hour air quality data...\n');

    // Get data from the last hour only
    const latestData = await airQualityService.getLatestData({
      stationCode: 'TSRT', // Tsereteli Avenue station
      hoursBack: 1 // Only last 1 hour
    });

    if (latestData.stations && latestData.stations.length > 0) {
      const station = latestData.stations[0];
      
      console.log(`📍 Station: ${station.settlement}`);
      console.log(`📮 Address: ${station.address}`);
      console.log(`⏰ Current Georgia time: ${latestData.currentGeorgiaTime}`);
      console.log(`🔄 Data retrieved at: ${new Date(latestData.timestamp).toLocaleString()}\n`);
      
      // Show data freshness information
      if (latestData.dataFreshness) {
        const freshnessEmoji = getFreshnessEmoji(latestData.dataFreshness.overall);
        console.log(`${freshnessEmoji} Data Freshness: ${latestData.dataFreshness.overall} (${latestData.dataFreshness.oldestDataAgeMinutes} minutes old)`);
        if (latestData.dataFreshness.note) {
          console.log(`ℹ️  ${latestData.dataFreshness.note}`);
        }
        console.log('');
      }
      
      console.log('💨 Current Air Quality Readings:');
      station.substances.forEach(substance => {
        const qualityEmoji = getQualityEmoji(substance.qualityLevel);
        const freshnessEmoji = getFreshnessEmoji(substance.dataAge.freshness);
        
        console.log(`   ${qualityEmoji} ${substance.name}: ${substance.latestValue.toFixed(2)} ${substance.unit_en}`);
        console.log(`      Quality: ${substance.qualityLevel} | Data age: ${substance.dataAge.ageText} ${freshnessEmoji}`);
        console.log(`      Last updated: ${substance.dataAge.dataTime} (Georgia time)`);
      });

      // Get specific PM10 reading for more detailed info
      console.log('\n🔍 Detailed PM10 Analysis:');
      try {
        const pm10Reading = await airQualityService.getLatestSubstanceReading('TSRT', 'PM10', { hoursBack: 1 });
        console.log(`   Current PM10 level: ${pm10Reading.substance.value.toFixed(2)} ${pm10Reading.substance.unit}`);
        console.log(`   Air Quality Status: ${pm10Reading.substance.qualityLevel.toUpperCase()}`);
        console.log(`   Health Impact: ${pm10Reading.substance.annotation}`);
        
        // Show trend if we have historical data
        const historicalData = await airQualityService.getLatestData({
          stationCode: 'TSRT',
          hoursBack: 6 // Get last 6 hours for trend
        });
        
        if (historicalData.stations[0]?.substances) {
          const pm10Historical = historicalData.stations[0].substances.find(s => s.name === 'PM10');
          if (pm10Historical && pm10Historical.allReadings.length > 1) {
            console.log(`\n📈 PM10 Trend (last ${pm10Historical.allReadings.length} readings):`);
            pm10Historical.allReadings.slice(-5).forEach(reading => {
              const time = new Date(reading.timestamp).toLocaleTimeString();
              console.log(`   ${time}: ${reading.value.toFixed(2)} μg/m³`);
            });
          }
        }
        
      } catch (error) {
        console.log(`   ⚠️ Could not get detailed PM10 data: ${error.message}`);
      }

    } else {
      console.log('❌ No data available for the requested station and time period.');
    }

  } catch (error) {
    console.error('❌ Error fetching air quality data:', error.message);
  }
}

function getQualityEmoji(level) {
  const emojis = {
    'good': '🟢',
    'fair': '🟡',
    'moderate': '🟠',
    'poor': '🔴',
    'very_poor': '🟣',
    'unknown': '⚪'
  };
  return emojis[level] || '⚪';
}

function getFreshnessEmoji(freshness) {
  const emojis = {
    'very_fresh': '🔥', // Very recent (≤15 min)
    'fresh': '✨',      // Recent (≤30 min)
    'moderate': '⏰',   // Moderate age (≤2 hours)
    'stale': '⏳',      // Stale (≤6 hours)
    'very_stale': '🕰️', // Very stale (>6 hours)
    'unknown': '❓'
  };
  return emojis[freshness] || '❓';
}

// Example of getting data for all stations
async function getAllStationsLatestData() {
  try {
    console.log('\n🌐 Getting latest data from all monitoring stations...\n');
    
    const allStationsData = await airQualityService.getLatestData({
      stationCode: 'all',
      hoursBack: 1
    });
    
    console.log(`Found ${allStationsData.totalStations} active stations:\n`);
    
    allStationsData.stations.forEach((station, index) => {
      console.log(`${index + 1}. ${station.settlement} (${station.code})`);
      
      if (station.substances.length > 0) {
        // Show the worst pollutant level
        const worstSubstance = station.substances.reduce((worst, current) => {
          const levels = ['good', 'fair', 'moderate', 'poor', 'very_poor'];
          const currentLevel = levels.indexOf(current.qualityLevel);
          const worstLevel = levels.indexOf(worst.qualityLevel);
          return currentLevel > worstLevel ? current : worst;
        });
        
        const emoji = getQualityEmoji(worstSubstance.qualityLevel);
        console.log(`   ${emoji} Worst: ${worstSubstance.name} - ${worstSubstance.qualityLevel}`);
        console.log(`   📊 Available: ${station.substances.map(s => s.name).join(', ')}`);
      } else {
        console.log('   ⚪ No recent data available');
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error fetching all stations data:', error.message);
  }
}

// Run examples
async function runExamples() {
  await getLatestHourData();
  await getAllStationsLatestData();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

export { getLatestHourData, getAllStationsLatestData };