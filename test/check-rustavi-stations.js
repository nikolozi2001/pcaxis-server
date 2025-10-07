import airQualityService from '../src/services/airQualityService.js';

console.log('🔍 Checking all available Rustavi stations...');

async function checkRustaviStations() {
  try {
    // Get all data
    const allData = await airQualityService.getLatestData({
      stationCode: 'all',
      hoursBack: 6
    });

    console.log('\n🏢 ALL STATIONS IN API:');
    allData.stations.forEach((station, index) => {
      console.log(`${index + 1}. ${station.code} - ${station.settlement}`);
      console.log(`   Address: ${station.address}`);
      console.log('');
    });

    // Filter for Rustavi specifically
    const rustaviStations = allData.stations.filter(station => 
      station.settlement.startsWith('ქ.რუსთავი')
    );

    console.log(`\n🎯 RUSTAVI STATIONS (${rustaviStations.length} found):`);
    rustaviStations.forEach((station, index) => {
      console.log(`${index + 1}. ${station.code} - ${station.settlement}`);
      console.log(`   Address: ${station.address}`);
      
      // Check PM10 data
      const pm10Data = station.substances?.find(s => s.name === 'PM10');
      if (pm10Data && pm10Data.latestValue !== null) {
        console.log(`   PM10: ${pm10Data.latestValue} μg/m³ at ${pm10Data.latestTimestamp}`);
      } else {
        console.log(`   PM10: No data available`);
      }
      console.log('');
    });

    // Also check for any station that might be in Rustavi but not matching our filter
    console.log('\n🔎 SEARCHING FOR OTHER POSSIBLE RUSTAVI STATIONS:');
    allData.stations.forEach((station) => {
      if (station.settlement.toLowerCase().includes('რუსთავ') || 
          station.address.toLowerCase().includes('რუსთავ') ||
          station.settlement.toLowerCase().includes('rustav') ||
          station.address.toLowerCase().includes('rustav')) {
        console.log(`Found: ${station.code} - ${station.settlement} - ${station.address}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRustaviStations();