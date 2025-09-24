/**
 * Smart Data Retrieval - Finds the most recent available data
 */

import airQualityService from './src/services/airQualityService.js';

async function findMostRecentData(stationCode = 'TSRT') {
  console.log(`🔍 Finding most recent data for station ${stationCode}...\n`);
  
  // Try different time ranges to find the most recent data
  const timeRanges = [1, 3, 6, 12, 24, 48];
  let mostRecentData = null;
  let mostRecentTime = null;
  
  for (const hours of timeRanges) {
    try {
      console.log(`⏰ Checking last ${hours} hour(s)...`);
      
      const data = await airQualityService.getLatestData({
        stationCode: stationCode,
        hoursBack: hours
      });
      
      if (data.stations && data.stations.length > 0) {
        const station = data.stations[0];
        
        // Find the most recent timestamp across all substances
        let latestTimestamp = null;
        station.substances.forEach(substance => {
          const substanceTime = new Date(substance.latestTimestamp);
          if (!latestTimestamp || substanceTime > latestTimestamp) {
            latestTimestamp = substanceTime;
          }
        });
        
        if (latestTimestamp && (!mostRecentTime || latestTimestamp > mostRecentTime)) {
          mostRecentTime = latestTimestamp;
          mostRecentData = data;
          
          const georgiaTime = latestTimestamp.toLocaleString('en-US', {
            timeZone: 'Asia/Tbilisi',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          console.log(`   ✅ Found data updated at: ${georgiaTime} (Georgia time)`);
        } else {
          console.log(`   📊 Same data as previous range`);
        }
      } else {
        console.log(`   ❌ No data available`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  if (mostRecentData) {
    console.log(`\n🎯 MOST RECENT DATA FOUND:`);
    console.log(`📍 Station: ${mostRecentData.stations[0].settlement}`);
    console.log(`⏰ Current Georgia time: ${mostRecentData.currentGeorgiaTime}`);
    console.log(`🔄 Most recent reading: ${mostRecentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Tbilisi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })} (Georgia time)`);
    
    const dataAge = mostRecentData.dataFreshness;
    console.log(`⏳ Data age: ${dataAge.oldestDataAgeMinutes} minutes (${Math.floor(dataAge.oldestDataAgeMinutes/60)} hours)`);
    console.log(`📊 Freshness level: ${dataAge.overall}`);
    
    if (dataAge.note) {
      console.log(`ℹ️  ${dataAge.note}`);
    }
    
    console.log(`\n💨 Latest readings:`);
    mostRecentData.stations[0].substances.forEach(substance => {
      const qualityEmoji = getQualityEmoji(substance.qualityLevel);
      console.log(`   ${qualityEmoji} ${substance.name}: ${substance.latestValue.toFixed(2)} ${substance.unit_en} (${substance.qualityLevel})`);
    });
    
    return mostRecentData;
  } else {
    console.log(`\n❌ No recent data found for station ${stationCode}`);
    return null;
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

// Test with multiple stations
async function checkMultipleStations() {
  const stations = ['TSRT', 'KZBG', 'ORN01', 'BTUM'];
  
  console.log(`\n🌐 Checking data freshness across multiple stations...\n`);
  
  for (const stationCode of stations) {
    try {
      const data = await airQualityService.getLatestData({
        stationCode: stationCode,
        hoursBack: 24
      });
      
      if (data.stations && data.stations.length > 0) {
        const station = data.stations[0];
        console.log(`📍 ${station.code}: ${station.settlement}`);
        console.log(`   📊 Substances: ${station.substances.length}`);
        console.log(`   ⏳ Data age: ${data.dataFreshness.oldestDataAgeMinutes} minutes ago`);
        console.log(`   🔄 Freshness: ${data.dataFreshness.overall}`);
      } else {
        console.log(`📍 ${stationCode}: No data available`);
      }
    } catch (error) {
      console.log(`📍 ${stationCode}: Error - ${error.message}`);
    }
    console.log('');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  findMostRecentData('TSRT').then(() => {
    return checkMultipleStations();
  }).catch(console.error);
}

export { findMostRecentData, checkMultipleStations };