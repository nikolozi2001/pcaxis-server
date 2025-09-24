import airQualityService from './src/services/airQualityService.js';

console.log('🔍 Testing Rustavi PM10 calculation with debug info...');

async function testRustaviPM10() {
  try {
    const result = await airQualityService.getRustaviPM10Average();
    
    console.log('\n📊 RESULT SUMMARY:');
    console.log(`Average: ${result.average.value} ${result.average.unit}`);
    console.log(`Quality: ${result.average.qualityLevel}`);
    console.log(`Calculation: ${result.average.calculation.formula}`);
    console.log(`Stations used: ${result.average.calculation.stationsWithData}/${result.average.calculation.totalStations}`);
    
    console.log('\n🏢 STATION BREAKDOWN:');
    result.stations.forEach((station, index) => {
      console.log(`${index + 1}. ${station.code} - ${station.settlement}`);
      console.log(`   Address: ${station.address}`);
      console.log(`   PM10: ${station.pollutantValue} ${result.average.unit} (${station.qualityLevel})`);
      console.log(`   Timestamp: ${station.timestamp}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRustaviPM10();