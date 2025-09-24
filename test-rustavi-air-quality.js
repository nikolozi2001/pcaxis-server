/**
 * Test script for Rustavi air quality averages
 * Tests the new functionality to calculate averages for all pollutants in Rustavi
 */

import airQualityService from './src/services/airQualityService.js';

console.log('🏭 Testing Rustavi Air Quality Averages');
console.log('='.repeat(60));

async function testRustaviPollutants() {
  console.log('\n🔬 Testing Individual Pollutant Averages for Rustavi');
  console.log('-'.repeat(55));
  
  const pollutants = [
    { name: 'PM10', method: 'getRustaviPM10Average' },
    { name: 'PM2.5', method: 'getRustaviPM25Average' },
    { name: 'NO2', method: 'getRustaviNO2Average' },
    { name: 'O3', method: 'getRustaviO3Average' },
    { name: 'SO2', method: 'getRustaviSO2Average' },
    { name: 'CO', method: 'getRustaviCOAverage' }
  ];

  for (const pollutant of pollutants) {
    try {
      console.log(`\n📊 Testing ${pollutant.name} Average:`);
      
      const result = await airQualityService[pollutant.method]();
      
      if (result.success) {
        const avg = result.average;
        console.log(`   ✅ Average ${pollutant.name}: ${avg.value} ${avg.unit}`);
        console.log(`   📈 Quality Level: ${avg.qualityLevel}`);
        console.log(`   🏪 Stations with data: ${avg.calculation.stationsWithData}/${avg.calculation.totalStations}`);
        console.log(`   🕐 Data age: ${result.dataFreshness.oldestDataAgeMinutes} minutes`);
        
        // Show individual station data
        result.stations.forEach(station => {
          if (station.pollutantValue !== null) {
            console.log(`      • ${station.code}: ${station.pollutantValue} ${avg.unit}`);
          }
        });
      } else {
        console.log(`   ❌ Failed to get ${pollutant.name} average`);
      }
    } catch (error) {
      console.log(`   ⚠️ Error testing ${pollutant.name}: ${error.message}`);
    }
  }
}

async function testRustaviAllPollutants() {
  console.log('\n\n🌍 Testing All Pollutants Together for Rustavi');
  console.log('-'.repeat(55));
  
  try {
    const result = await airQualityService.getRustaviAllPollutantsAverage();
    
    if (result.success) {
      console.log(`\n📍 City: ${result.city}`);
      console.log(`🕐 Analysis Time: ${result.currentGeorgiaTime}`);
      console.log(`📈 Summary: ${result.summary.successfulCalculations}/${result.summary.totalPollutants} pollutants calculated`);
      
      console.log('\n📊 Pollutant Averages:');
      console.log('-'.repeat(30));
      
      for (const [pollutant, data] of Object.entries(result.pollutantAverages)) {
        if (data.success) {
          const avg = data.average;
          console.log(`${pollutant.padEnd(6)}: ${avg.value.toString().padStart(8)} ${avg.unit.padEnd(6)} (${avg.qualityLevel})`);
        }
      }
      
      // Show any errors
      if (result.errors && Object.keys(result.errors).length > 0) {
        console.log('\n⚠️ Errors:');
        for (const [pollutant, error] of Object.entries(result.errors)) {
          console.log(`   ${pollutant}: ${error}`);
        }
      }
      
      // Show data freshness summary
      let overallFreshness = 0;
      let validCalculations = 0;
      
      for (const data of Object.values(result.pollutantAverages)) {
        if (data.success && data.dataFreshness) {
          overallFreshness = Math.max(overallFreshness, data.dataFreshness.oldestDataAgeMinutes);
          validCalculations++;
        }
      }
      
      console.log(`\n🕐 Data Freshness: ${overallFreshness} minutes old (based on ${validCalculations} calculations)`);
      
    } else {
      console.log('❌ Failed to get all pollutants averages');
    }
  } catch (error) {
    console.log(`⚠️ Error testing all pollutants: ${error.message}`);
  }
}

async function testRustaviStationInfo() {
  console.log('\n\n🏢 Rustavi Station Information');
  console.log('-'.repeat(30));
  
  try {
    // Get all stations to show Rustavi ones
    const allData = await airQualityService.getLatestData({
      stationCode: 'all',
      hoursBack: 6
    });

    const rustaviStations = allData.stations.filter(station => 
      station.settlement.startsWith('ქ.რუსთავი')
    );

    console.log(`📍 Found ${rustaviStations.length} Rustavi monitoring stations:\n`);
    
    rustaviStations.forEach((station, index) => {
      console.log(`${index + 1}. Station Code: ${station.code}`);
      console.log(`   Settlement: ${station.settlement}`);
      console.log(`   Address: ${station.address}`);
      console.log(`   Available Pollutants: ${station.substances.map(s => s.name).join(', ')}`);
      console.log('');
    });
    
  } catch (error) {
    console.log(`⚠️ Error getting station info: ${error.message}`);
  }
}

async function runRustaviTests() {
  console.log(`🚀 Starting Rustavi air quality testing at ${new Date().toLocaleString()}`);
  
  try {
    await testRustaviStationInfo();
    await testRustaviPollutants();
    await testRustaviAllPollutants();
    
    console.log('\n\n✅ All Rustavi tests completed successfully!');
    console.log('\n📋 Available Rustavi API Endpoints:');
    console.log('   • GET /api/air-quality/rustavi/pm10-average');
    console.log('   • GET /api/air-quality/rustavi/pm25-average');
    console.log('   • GET /api/air-quality/rustavi/no2-average');
    console.log('   • GET /api/air-quality/rustavi/o3-average');
    console.log('   • GET /api/air-quality/rustavi/so2-average');
    console.log('   • GET /api/air-quality/rustavi/co-average');
    console.log('   • GET /api/air-quality/rustavi/all-pollutants-average');
    
    console.log('\n📖 Query Parameters:');
    console.log('   • hours=6 (default) - Hours to look back for data');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
runRustaviTests();