/**
 * Advanced Tbilisi PM2.5 Average Examples
 * Shows different scenarios and use cases
 */

import airQualityService from './src/services/airQualityService.js';

async function showDifferentScenarios() {
  console.log('📊 TBILISI PM2.5 AVERAGE - DIFFERENT SCENARIOS\n');

  // Scenario 1: All stations working
  console.log('🟢 SCENARIO 1: All stations have data');
  console.log('='.repeat(50));
  try {
    const result1 = await airQualityService.getTbilisiPM25Average({ hoursBack: 6 });
    console.log(`Average: ${result1.average.value} μg/m³ (${result1.average.qualityLevel})`);
    console.log(`Stations: ${result1.average.calculation.stationsWithData}/${result1.average.calculation.totalStations}`);
    console.log(`Formula: ${result1.average.calculation.formula}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Scenario 2: Show what happens with different time ranges
  console.log('⏰ SCENARIO 2: Different time ranges');
  console.log('='.repeat(50));
  const timeRanges = [1, 3, 6, 12, 24];
  
  for (const hours of timeRanges) {
    try {
      const result = await airQualityService.getTbilisiPM25Average({ hoursBack: hours });
      const stationsWithData = result.stations.filter(s => s.pm25Value !== null).length;
      console.log(`${hours}h back: ${result.average.value} μg/m³ (${stationsWithData}/4 stations)`);
    } catch (error) {
      console.log(`${hours}h back: Error - ${error.message}`);
    }
  }
  console.log('');

  // Scenario 3: Health implications
  console.log('🏥 SCENARIO 3: Health implications by average ranges');
  console.log('='.repeat(50));
  
  const healthRanges = [
    { range: '0-12 μg/m³', level: 'good', emoji: '🟢', advice: 'Perfect for all outdoor activities' },
    { range: '12-25 μg/m³', level: 'fair', emoji: '🟡', advice: 'Acceptable, but sensitive people should be cautious' },
    { range: '25-35 μg/m³', level: 'moderate', emoji: '🟠', advice: 'Unhealthy for sensitive groups' },
    { range: '35-60 μg/m³', level: 'poor', emoji: '🔴', advice: 'Unhealthy for everyone' },
    { range: '60+ μg/m³', level: 'very_poor', emoji: '🟣', advice: 'Very unhealthy - avoid outdoor activities' }
  ];
  
  const currentResult = await airQualityService.getTbilisiPM25Average();
  const currentValue = currentResult.average.value;
  
  healthRanges.forEach(range => {
    const isCurrent = range.level === currentResult.average.qualityLevel;
    const marker = isCurrent ? '👈 CURRENT' : '';
    console.log(`${range.emoji} ${range.range}: ${range.advice} ${marker}`);
  });
  
  console.log(`\nCurrent Tbilisi average: ${currentValue} μg/m³ (${currentResult.average.qualityLevel})`);
}

// Function to demonstrate the calculation logic
async function demonstrateCalculation() {
  console.log('\n🧮 CALCULATION DEMONSTRATION\n');
  console.log('='.repeat(50));
  
  const result = await airQualityService.getTbilisiPM25Average();
  
  console.log('Step-by-step calculation:');
  console.log('1. Get PM2.5 from all Tbilisi stations:');
  
  let sum = 0;
  let validStations = 0;
  
  result.stations.forEach((station, index) => {
    if (station.pm25Value !== null) {
      console.log(`   Station ${index + 1} (${station.code}): ${station.pm25Value.toFixed(2)} μg/m³`);
      sum += station.pm25Value;
      validStations++;
    } else {
      console.log(`   Station ${index + 1} (${station.code}): No data - EXCLUDED`);
    }
  });
  
  console.log(`\n2. Sum all valid readings: ${sum.toFixed(2)} μg/m³`);
  console.log(`3. Count stations with data: ${validStations} stations`);
  console.log(`4. Calculate average: ${sum.toFixed(2)} ÷ ${validStations} = ${(sum/validStations).toFixed(2)} μg/m³`);
  console.log(`\nResult: ${result.average.value} μg/m³ (${result.average.qualityLevel})`);
}

// Function to show API usage examples
function showAPIUsageExamples() {
  console.log('\n🚀 API USAGE EXAMPLES\n');
  console.log('='.repeat(50));
  
  console.log('1. Basic request:');
  console.log('   GET /api/air-quality/tbilisi/pm25-average');
  console.log('   Returns: Current average from last 6 hours\n');
  
  console.log('2. Custom time range:');
  console.log('   GET /api/air-quality/tbilisi/pm25-average?hours=12');
  console.log('   Returns: Average from last 12 hours\n');
  
  console.log('3. JavaScript/Node.js:');
  console.log(`   const response = await fetch('http://localhost:3000/api/air-quality/tbilisi/pm25-average');`);
  console.log(`   const data = await response.json();`);
  console.log(`   console.log(\`Average: \${data.data.average.value} μg/m³\`);`);
  console.log('');
  
  console.log('4. curl command:');
  console.log(`   curl "http://localhost:3000/api/air-quality/tbilisi/pm25-average?hours=24"`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  showDifferentScenarios()
    .then(() => demonstrateCalculation())
    .then(() => showAPIUsageExamples())
    .catch(console.error);
}

export { showDifferentScenarios, demonstrateCalculation, showAPIUsageExamples };