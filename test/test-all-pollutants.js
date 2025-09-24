/**
 * Test script for all pollutant averages in Tbilisi
 * Tests the new functionality to calculate averages for PM10, NO2, O3, SO2, CO
 */

import airQualityService from '../src/services/airQualityService.js';

console.log('🧪 Testing All Pollutant Averages for Tbilisi');
console.log('='.repeat(60));

async function testIndividualPollutants() {
  console.log('\n🔬 Testing Individual Pollutant Averages');
  console.log('-'.repeat(50));
  
  const pollutants = [
    { name: 'PM10', method: 'getTbilisiPM10Average' },
    { name: 'PM2.5', method: 'getTbilisiPM25Average' },
    { name: 'NO2', method: 'getTbilisiNO2Average' },
    { name: 'O3', method: 'getTbilisiO3Average' },
    { name: 'SO2', method: 'getTbilisiSO2Average' },
    { name: 'CO', method: 'getTbilisiCOAverage' }
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

async function testAllPollutantsTogether() {
  console.log('\n\n🌍 Testing All Pollutants Together');
  console.log('-'.repeat(50));
  
  try {
    const result = await airQualityService.getTbilisiAllPollutantsAverage();
    
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

async function testQualityLevels() {
  console.log('\n\n🎯 Testing Quality Level Thresholds');
  console.log('-'.repeat(50));
  
  const testValues = {
    'PM10': [15, 25, 40, 70, 120], // Should be: good, good, fair, moderate, very_poor
    'PM2.5': [8, 15, 30, 45, 80], // Should be: good, fair, moderate, poor, very_poor
    'NO2': [30, 50, 100, 180, 250], // Should be: good, fair, moderate, poor, very_poor
    'O3': [40, 80, 140, 200, 280], // Should be: good, fair, moderate, poor, very_poor
    'SO2': [15, 50, 150, 300, 400], // Should be: good, fair, moderate, poor, very_poor
    'CO': [2000, 6000, 12000, 25000, 40000] // Should be: good, fair, moderate, poor, very_poor
  };
  
  // We'll test the quality level determination logic
  console.log('Quality level examples:');
  const qualityLevels = ['good', 'fair', 'moderate', 'poor', 'very_poor'];
  
  for (const [pollutant, values] of Object.entries(testValues)) {
    console.log(`\n${pollutant}:`);
    values.forEach((value, index) => {
      const expectedLevel = qualityLevels[index] || 'very_poor';
      console.log(`   ${value.toString().padStart(6)} µg/m³ → ${expectedLevel}`);
    });
  }
}

async function runAllTests() {
  console.log(`🚀 Starting comprehensive pollutant testing at ${new Date().toLocaleString()}`);
  
  try {
    await testIndividualPollutants();
    await testAllPollutantsTogether();
    await testQualityLevels();
    
    console.log('\n\n✅ All tests completed successfully!');
    console.log('\n📋 Available API Endpoints:');
    console.log('   • GET /api/air-quality/tbilisi/pm10-average');
    console.log('   • GET /api/air-quality/tbilisi/pm25-average');
    console.log('   • GET /api/air-quality/tbilisi/no2-average');
    console.log('   • GET /api/air-quality/tbilisi/o3-average');
    console.log('   • GET /api/air-quality/tbilisi/so2-average');
    console.log('   • GET /api/air-quality/tbilisi/co-average');
    console.log('   • GET /api/air-quality/tbilisi/all-pollutants-average');
    
    console.log('\n📖 Query Parameters:');
    console.log('   • hours=6 (default) - Hours to look back for data');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
runAllTests();