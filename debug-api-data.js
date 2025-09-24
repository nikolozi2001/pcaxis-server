/**
 * Debug script to check current API data availability
 */

import airQualityService from './src/services/airQualityService.js';

async function debugApiData() {
  try {
    console.log('🔍 Debugging API data availability...\n');
    
    // Get current Georgia time
    const georgiaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Tbilisi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    console.log(`🕐 Current Georgia time: ${georgiaTime}`);
    console.log(`🕐 Current UTC time: ${new Date().toISOString()}`);
    
    // Test different time ranges to see data availability
    const timeRanges = [1, 3, 6, 12, 24];
    
    for (const hours of timeRanges) {
      console.log(`\n📊 Testing last ${hours} hour(s):`);
      
      try {
        const data = await airQualityService.getLatestData({
          stationCode: 'TSRT',
          hoursBack: hours
        });
        
        if (data.stations && data.stations.length > 0) {
          const station = data.stations[0];
          console.log(`   Station: ${station.code}`);
          
          station.substances.forEach(substance => {
            const latestTime = new Date(substance.latestTimestamp);
            const georgiaLatestTime = latestTime.toLocaleString('en-US', {
              timeZone: 'Asia/Tbilisi',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            
            console.log(`   ${substance.name}: ${substance.latestValue.toFixed(2)} at ${georgiaLatestTime} (Georgia time)`);
            
            // Show all available readings for this substance
            if (substance.allReadings && substance.allReadings.length > 0) {
              console.log(`     Available readings: ${substance.allReadings.length}`);
              console.log(`     Time range: ${new Date(substance.allReadings[0].timestamp).toLocaleString('en-US', {timeZone: 'Asia/Tbilisi', hour12: true})} to ${new Date(substance.allReadings[substance.allReadings.length-1].timestamp).toLocaleString('en-US', {timeZone: 'Asia/Tbilisi', hour12: true})}`);
            }
          });
        } else {
          console.log('   No data available');
        }
        
      } catch (error) {
        console.log(`   Error: ${error.message}`);
      }
    }
    
    // Test with a longer range to see if there's more recent data
    console.log(`\n📊 Testing with extended range (48 hours):`);
    try {
      const extendedData = await airQualityService.getLatestData({
        stationCode: 'TSRT',
        hoursBack: 48
      });
      
      if (extendedData.stations && extendedData.stations.length > 0) {
        const station = extendedData.stations[0];
        
        station.substances.forEach(substance => {
          if (substance.allReadings && substance.allReadings.length > 0) {
            console.log(`\n   ${substance.name} - Last 10 readings:`);
            substance.allReadings.slice(-10).forEach(reading => {
              const georgiaTime = new Date(reading.timestamp).toLocaleString('en-US', {
                timeZone: 'Asia/Tbilisi',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              console.log(`     ${georgiaTime}: ${reading.value.toFixed(2)} μg/m³`);
            });
          }
        });
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  debugApiData();
}

export { debugApiData };