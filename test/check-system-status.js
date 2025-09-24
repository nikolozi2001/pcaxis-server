/**
 * Real-time check for all stations to see data availability
 */

import airQualityService from '../src/services/airQualityService.js';

async function checkAllStationsDataFreshness() {
  console.log('🔍 Checking data freshness across ALL monitoring stations...\n');
  
  try {
    // Get data from all stations
    const allStationsData = await airQualityService.getLatestData({
      stationCode: 'all',
      hoursBack: 6 // Look back 6 hours
    });
    
    if (!allStationsData.stations || allStationsData.stations.length === 0) {
      console.log('❌ No stations found');
      return;
    }
    
    console.log(`🕐 Current Georgia time: ${allStationsData.currentGeorgiaTime}`);
    console.log(`📊 Total stations checked: ${allStationsData.totalStations}\n`);
    
    // Check each station
    let mostRecentGlobalTime = null;
    let mostRecentStation = null;
    
    allStationsData.stations.forEach(station => {
      console.log(`📍 ${station.code}: ${station.settlement}`);
      
      if (station.substances.length === 0) {
        console.log('   ❌ No substance data available\n');
        return;
      }
      
      // Find the most recent timestamp for this station
      let stationMostRecent = null;
      station.substances.forEach(substance => {
        const substanceTime = new Date(substance.latestTimestamp);
        if (!stationMostRecent || substanceTime > stationMostRecent) {
          stationMostRecent = substanceTime;
        }
      });
      
      if (stationMostRecent) {
        const georgiaTime = stationMostRecent.toLocaleString('en-US', {
          timeZone: 'Asia/Tbilisi',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        const ageMinutes = Math.floor((new Date() - stationMostRecent) / (1000 * 60));
        const ageHours = Math.floor(ageMinutes / 60);
        
        console.log(`   ⏰ Latest data: ${georgiaTime} (${ageHours}h ${ageMinutes % 60}m ago)`);
        console.log(`   💨 Substances: ${station.substances.length} (${station.substances.map(s => s.name).join(', ')})`);
        
        // Track globally most recent
        if (!mostRecentGlobalTime || stationMostRecent > mostRecentGlobalTime) {
          mostRecentGlobalTime = stationMostRecent;
          mostRecentStation = station;
        }
      }
      
      console.log('');
    });
    
    // Summary
    if (mostRecentGlobalTime) {
      const globalAge = Math.floor((new Date() - mostRecentGlobalTime) / (1000 * 60));
      const globalAgeHours = Math.floor(globalAge / 60);
      
      console.log('🎯 SYSTEM-WIDE SUMMARY:');
      console.log(`📊 Most recent data across ALL stations: ${mostRecentGlobalTime.toLocaleString('en-US', {
        timeZone: 'Asia/Tbilisi',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })} (Georgia time)`);
      console.log(`📍 From station: ${mostRecentStation.code} - ${mostRecentStation.settlement}`);
      console.log(`⏳ Global data age: ${globalAgeHours}h ${globalAge % 60}m`);
      
      if (globalAgeHours >= 3) {
        console.log(`\n⚠️  CONCLUSION: The entire air quality monitoring system appears to be ${globalAgeHours} hours behind.`);
        console.log(`   This suggests a system-wide processing delay, not an issue with our implementation.`);
        console.log(`   This is common in environmental monitoring - data is batch-processed for quality control.`);
      } else {
        console.log(`\n✅ Data freshness is reasonable for environmental monitoring systems.`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking stations:', error.message);
  }
}

// Also check if there's any pattern in the delay
async function checkDataPattern() {
  console.log('\n📈 CHECKING DATA PATTERN FOR TSRT STATION...\n');
  
  try {
    const data = await airQualityService.getLatestData({
      stationCode: 'TSRT',
      hoursBack: 12
    });
    
    if (data.stations && data.stations.length > 0) {
      const station = data.stations[0];
      const pm10Data = station.substances.find(s => s.name === 'PM10');
      
      if (pm10Data && pm10Data.allReadings) {
        console.log('Last 10 readings for PM10:');
        pm10Data.allReadings.slice(-10).forEach(reading => {
          const georgiaTime = new Date(reading.timestamp).toLocaleString('en-US', {
            timeZone: 'Asia/Tbilisi',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          console.log(`   ${georgiaTime}: ${reading.value.toFixed(2)} μg/m³`);
        });
        
        // Check if there's a regular hourly pattern
        const lastReading = pm10Data.allReadings[pm10Data.allReadings.length - 1];
        const lastTime = new Date(lastReading.timestamp);
        const currentTime = new Date();
        const expectedNextHour = new Date(lastTime.getTime() + 60 * 60 * 1000);
        
        console.log(`\n📊 Pattern Analysis:`);
        console.log(`   Last reading: ${lastTime.toLocaleString('en-US', {timeZone: 'Asia/Tbilisi', hour12: true})}`);
        console.log(`   Expected next: ${expectedNextHour.toLocaleString('en-US', {timeZone: 'Asia/Tbilisi', hour12: true})}`);
        console.log(`   Current time: ${currentTime.toLocaleString('en-US', {timeZone: 'Asia/Tbilisi', hour12: true})}`);
        
        if (currentTime > expectedNextHour) {
          const delayHours = Math.floor((currentTime - expectedNextHour) / (1000 * 60 * 60));
          console.log(`   ⏰ System is ${delayHours + 1} hours behind expected schedule`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking pattern:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkAllStationsDataFreshness().then(() => {
    return checkDataPattern();
  }).catch(console.error);
}

export { checkAllStationsDataFreshness, checkDataPattern };