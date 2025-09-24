/**
 * Example usage of the Tbilisi air quality averaging API
 * This script demonstrates how to call all the new pollutant endpoints
 */

// Simple example using Node.js built-in fetch
async function testPollutantEndpoints() {
  const baseUrl = 'http://localhost:3000/api/air-quality/tbilisi';
  
  console.log('🌍 Tbilisi Air Quality Pollutant Averages');
  console.log('=' .repeat(50));
  
  const pollutants = [
    { name: 'PM10', endpoint: 'pm10-average' },
    { name: 'PM2.5', endpoint: 'pm25-average' },
    { name: 'NO2', endpoint: 'no2-average' },
    { name: 'O3', endpoint: 'o3-average' },
    { name: 'SO2', endpoint: 'so2-average' },
    { name: 'CO', endpoint: 'co-average' }
  ];

  // Test individual pollutant endpoints
  for (const pollutant of pollutants) {
    try {
      console.log(`\n📊 Testing ${pollutant.name}:`);
      
      const response = await fetch(`${baseUrl}/${pollutant.endpoint}?hours=6`);
      const data = await response.json();
      
      if (data.success && data.data.success) {
        const result = data.data;
        const avg = result.average;
        
        console.log(`   ✅ Average: ${avg.value} ${avg.unit} (${avg.qualityLevel})`);
        console.log(`   📈 Stations: ${avg.calculation.stationsWithData}/${avg.calculation.totalStations}`);
        console.log(`   🕐 Data age: ${result.dataFreshness.oldestDataAgeMinutes} minutes`);
        
        // Show which stations have data
        const stationsWithData = result.stations.filter(s => s.pollutantValue !== null);
        if (stationsWithData.length > 0) {
          console.log(`   🏢 Active stations: ${stationsWithData.map(s => s.code).join(', ')}`);
        }
      } else {
        console.log(`   ❌ Failed to get ${pollutant.name} data`);
      }
    } catch (error) {
      console.log(`   ⚠️ Error: ${error.message}`);
    }
  }
  
  // Test the comprehensive endpoint
  console.log('\n\n🌐 All Pollutants Summary:');
  console.log('-'.repeat(30));
  
  try {
    const response = await fetch(`${baseUrl}/all-pollutants-average?hours=6`);
    const data = await response.json();
    
    if (data.success && data.data.success) {
      const result = data.data;
      
      console.log(`📍 City: ${result.city}`);
      console.log(`🕐 Time: ${result.currentGeorgiaTime}`);
      console.log(`📊 Results: ${result.summary.successfulCalculations}/${result.summary.totalPollutants} pollutants`);
      
      console.log('\n📈 Quick Summary:');
      for (const [pollutant, pollutantData] of Object.entries(result.pollutantAverages)) {
        if (pollutantData.success) {
          const avg = pollutantData.average;
          const quality = avg.qualityLevel.toUpperCase();
          const stations = `${avg.calculation.stationsWithData}/${avg.calculation.totalStations}`;
          
          console.log(`   ${pollutant.padEnd(6)}: ${avg.value.toString().padStart(6)} ${avg.unit} (${quality}) [${stations}]`);
        }
      }
      
      // Show overall air quality assessment
      const allGood = Object.values(result.pollutantAverages).every(p => 
        p.success && ['good', 'fair'].includes(p.average.qualityLevel)
      );
      
      const overallAssessment = allGood ? '🟢 GOOD' : '🟡 ATTENTION NEEDED';
      console.log(`\n🎯 Overall Assessment: ${overallAssessment}`);
      
    } else {
      console.log('❌ Failed to get comprehensive data');
    }
  } catch (error) {
    console.log(`⚠️ Error: ${error.message}`);
  }
}

// Example of how to use the data in a web application
function generateAirQualityReport(pollutantAverages) {
  const report = {
    timestamp: new Date().toISOString(),
    city: 'Tbilisi',
    pollutants: {},
    summary: {
      totalPollutants: 0,
      goodQuality: 0,
      concernLevels: 0,
      overallRating: 'unknown'
    }
  };
  
  for (const [pollutant, data] of Object.entries(pollutantAverages)) {
    if (data.success) {
      report.pollutants[pollutant] = {
        value: data.average.value,
        unit: data.average.unit,
        qualityLevel: data.average.qualityLevel,
        stationsUsed: data.average.calculation.stationsWithData,
        totalStations: data.average.calculation.totalStations
      };
      
      report.summary.totalPollutants++;
      
      if (['good', 'fair'].includes(data.average.qualityLevel)) {
        report.summary.goodQuality++;
      } else {
        report.summary.concernLevels++;
      }
    }
  }
  
  // Determine overall rating
  const goodRatio = report.summary.goodQuality / report.summary.totalPollutants;
  if (goodRatio >= 0.8) {
    report.summary.overallRating = 'excellent';
  } else if (goodRatio >= 0.6) {
    report.summary.overallRating = 'good';
  } else if (goodRatio >= 0.4) {
    report.summary.overallRating = 'moderate';
  } else {
    report.summary.overallRating = 'poor';
  }
  
  return report;
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  testPollutantEndpoints().catch(console.error);
}

export { testPollutantEndpoints, generateAirQualityReport };