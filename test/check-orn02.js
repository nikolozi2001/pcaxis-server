import airQualityService from '../src/services/airQualityService.js';

console.log('🔍 Checking ORN02 station data...');

async function checkORN02() {
  try {
    // Get all data
    const allData = await airQualityService.getLatestData({
      stationCode: 'all',
      hoursBack: 6
    });

    // Find ORN02 specifically
    const orn02 = allData.stations.find(station => station.code === 'ORN02');
    
    if (orn02) {
      console.log('\n🏢 ORN02 STATION DETAILS:');
      console.log(`Code: ${orn02.code}`);
      console.log(`Settlement: "${orn02.settlement}"`);
      console.log(`Address: ${orn02.address}`);
      
      console.log('\n💨 POLLUTANT DATA:');
      if (orn02.substances && orn02.substances.length > 0) {
        orn02.substances.forEach(substance => {
          console.log(`${substance.name}: ${substance.latestValue} ${substance.unit} at ${substance.latestTimestamp}`);
        });
      } else {
        console.log('No substance data available');
      }
      
      // Check specifically for PM10
      const pm10Data = orn02.substances?.find(s => s.name === 'PM10');
      if (pm10Data) {
        console.log(`\n🎯 PM10 SPECIFIC DATA:`);
        console.log(`Value: ${pm10Data.latestValue} ${pm10Data.unit}`);
        console.log(`Timestamp: ${pm10Data.latestTimestamp}`);
        console.log(`This should be: 36.54 according to your example`);
      }
      
    } else {
      console.log('❌ ORN02 station not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkORN02();