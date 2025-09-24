/**
 * Example: Calculate Tbilisi PM2.5 Average
 * This example demonstrates how to calculate the average PM2.5 for all Tbilisi stations
 */

import airQualityService from './src/services/airQualityService.js';

async function getTbilisiPM25Average() {
  try {
    console.log('🏙️ Calculating Tbilisi PM2.5 Average...\n');

    // Get the average PM2.5 for all Tbilisi stations
    const averageData = await airQualityService.getTbilisiPM25Average({
      hoursBack: 6 // Look back 6 hours for data
    });

    if (averageData.success) {
      console.log('📊 TBILISI PM2.5 AVERAGE REPORT');
      console.log('=' .repeat(50));
      console.log(`🕐 Current time: ${averageData.currentGeorgiaTime}`);
      console.log(`🏙️ City: ${averageData.city}`);
      console.log(`💨 Substance: ${averageData.substance}`);
      console.log('');

      // Show the average result
      const qualityEmoji = getQualityEmoji(averageData.average.qualityLevel);
      console.log('🎯 AVERAGE RESULT:');
      console.log(`   ${qualityEmoji} ${averageData.average.value} ${averageData.average.unit}`);
      console.log(`   Quality Level: ${averageData.average.qualityLevel.toUpperCase()}`);
      console.log(`   Calculation: ${averageData.average.calculation.formula}`);
      console.log(`   Based on: ${averageData.average.calculation.stationsWithData}/${averageData.average.calculation.totalStations} stations\n`);

      // Show individual station data
      console.log('📍 INDIVIDUAL STATION DATA:');
      averageData.stations.forEach((station, index) => {
        const stationEmoji = station.pm25Value !== null ? getQualityEmoji(station.qualityLevel) : '❌';
        console.log(`${index + 1}. ${station.code}: ${station.settlement}`);
        console.log(`   📮 Address: ${station.address}`);
        
        if (station.pm25Value !== null) {
          console.log(`   ${stationEmoji} PM2.5: ${station.pm25Value.toFixed(2)} μg/m³ (${station.qualityLevel})`);
          if (station.dataAge) {
            console.log(`   ⏰ Data age: ${station.dataAge.ageText}`);
            console.log(`   📅 Last updated: ${station.dataAge.dataTime}`);
          }
        } else {
          console.log(`   ❌ No PM2.5 data available`);
        }
        console.log('');
      });

      // Show data freshness info
      if (averageData.dataFreshness.note) {
        console.log(`ℹ️  ${averageData.dataFreshness.note}`);
      }

      // Health recommendations based on average
      console.log('🏥 HEALTH RECOMMENDATIONS:');
      const healthAdvice = getHealthAdvice(averageData.average.qualityLevel, averageData.average.value);
      console.log(`   ${healthAdvice}`);

    } else {
      console.log('❌ Failed to calculate average');
    }

  } catch (error) {
    console.error('❌ Error calculating Tbilisi PM2.5 average:', error.message);
  }
}

function getQualityEmoji(level) {
  const emojis = {
    'good': '🟢',
    'fair': '🟡',
    'moderate': '🟠',
    'poor': '🔴',
    'very_poor': '🟣',
    'no_data': '❌',
    'unknown': '⚪'
  };
  return emojis[level] || '⚪';
}

function getHealthAdvice(qualityLevel, value) {
  switch (qualityLevel) {
    case 'good':
      return '✅ Air quality is good. Perfect for outdoor activities!';
    case 'fair':
      return '⚠️ Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.';
    case 'moderate':
      return '🚨 Air quality is moderate. Sensitive groups should reduce outdoor activities.';
    case 'poor':
      return '❌ Air quality is poor. Everyone should limit outdoor activities, especially sensitive groups.';
    case 'very_poor':
      return '🆘 Air quality is very poor. Avoid outdoor activities. Stay indoors and use air purifiers if available.';
    default:
      return 'ℹ️ Air quality data insufficient for health recommendations.';
  }
}

// Also create a simple comparison function
async function compareTbilisiStations() {
  try {
    console.log('\n📊 TBILISI STATIONS COMPARISON\n');
    
    const averageData = await airQualityService.getTbilisiPM25Average();
    
    // Sort stations by PM2.5 value
    const stationsWithData = averageData.stations
      .filter(s => s.pm25Value !== null)
      .sort((a, b) => b.pm25Value - a.pm25Value);
    
    console.log('🏆 RANKING (Highest to Lowest PM2.5):');
    stationsWithData.forEach((station, index) => {
      const emoji = getQualityEmoji(station.qualityLevel);
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      console.log(`${medal} ${station.code}: ${station.pm25Value.toFixed(2)} μg/m³ ${emoji}`);
      console.log(`    ${station.settlement}`);
    });
    
    console.log(`\n📈 Average: ${averageData.average.value} μg/m³ ${getQualityEmoji(averageData.average.qualityLevel)}`);
    
    // Show which stations are above/below average
    console.log('\n📊 Compared to city average:');
    stationsWithData.forEach(station => {
      const diff = station.pm25Value - averageData.average.value;
      const indicator = diff > 0 ? '↗️' : diff < 0 ? '↘️' : '➡️';
      const diffText = Math.abs(diff).toFixed(2);
      console.log(`   ${indicator} ${station.code}: ${diff > 0 ? '+' : ''}${diff.toFixed(2)} μg/m³ (${diff > 0 ? 'above' : diff < 0 ? 'below' : 'equal to'} average)`);
    });
    
  } catch (error) {
    console.error('❌ Error comparing stations:', error.message);
  }
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
  getTbilisiPM25Average().then(() => {
    return compareTbilisiStations();
  }).catch(console.error);
}

export { getTbilisiPM25Average, compareTbilisiStations };