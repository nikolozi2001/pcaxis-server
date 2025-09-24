/**
 * Test the Tbilisi PM2.5 average API endpoint
 */

async function testTbilisiAverageAPI() {
  try {
    console.log('🧪 Testing Tbilisi PM2.5 Average API endpoint...\n');
    
    // Test the API endpoint
    const url = 'http://localhost:3000/api/air-quality/tbilisi/pm25-average';
    console.log(`📡 Making request to: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ API Response successful!\n');
      console.log('📊 RESPONSE DATA:');
      console.log(JSON.stringify(data, null, 2));
      
      console.log('\n🎯 SUMMARY:');
      console.log(`   City: ${data.data.city}`);
      console.log(`   Average PM2.5: ${data.data.average.value} ${data.data.average.unit}`);
      console.log(`   Quality Level: ${data.data.average.qualityLevel}`);
      console.log(`   Stations with data: ${data.data.average.calculation.stationsWithData}/${data.data.average.calculation.totalStations}`);
      
    } else {
      console.log('❌ API Error:');
      console.log(data);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Server is not running');
      console.log('💡 Start the server first with: npm start');
    } else {
      console.log('❌ Error testing API:', error.message);
    }
  }
}

// Direct service test (without server)
async function testDirectService() {
  try {
    console.log('🧪 Testing direct service call...\n');
    
    // Import and test the service directly
    const { default: airQualityService } = await import('./src/services/airQualityService.js');
    
    const result = await airQualityService.getTbilisiPM25Average();
    
    console.log('✅ Direct service test successful!\n');
    console.log('📊 RESULT:');
    console.log(`   Average PM2.5: ${result.average.value} ${result.average.unit}`);
    console.log(`   Quality Level: ${result.average.qualityLevel}`);
    console.log(`   Calculation: ${result.average.calculation.formula}`);
    console.log(`   Stations: ${result.average.calculation.stationsWithData}/${result.average.calculation.totalStations}`);
    
    console.log('\n📍 Station breakdown:');
    result.stations.forEach(station => {
      if (station.pm25Value !== null) {
        console.log(`   ${station.code}: ${station.pm25Value.toFixed(2)} μg/m³`);
      } else {
        console.log(`   ${station.code}: No data`);
      }
    });
    
  } catch (error) {
    console.log('❌ Direct service test failed:', error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // First test the service directly
  testDirectService().then(() => {
    console.log('\n' + '='.repeat(60) + '\n');
    // Then try the API endpoint
    return testTbilisiAverageAPI();
  }).catch(console.error);
}

export { testTbilisiAverageAPI, testDirectService };