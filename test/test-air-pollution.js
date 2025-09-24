/**
 * Test script for Air Pollution datasets
 * Tests all new air pollution datasets added to the configuration
 */

import { DATASETS } from '../src/config/datasets.js';

const BASE_URL = 'http://localhost:3000/api';
const PXWEB_BASE_URL = 'https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database';

// Filter air pollution datasets
const airPollutionDatasets = Object.values(DATASETS).filter(dataset => 
  dataset.subcategory === 'air-pollution'
);

console.log('🔬 Testing Air Pollution Datasets');
console.log('='.repeat(50));
console.log(`Found ${airPollutionDatasets.length} air pollution datasets:`);

airPollutionDatasets.forEach(dataset => {
  console.log(`📊 ${dataset.id}: ${dataset.name}`);
  console.log(`   Description: ${dataset.description}`);
  console.log(`   Path: ${dataset.path}`);
  console.log('');
});

console.log('🧪 Testing PXWeb API connections...');
console.log('='.repeat(50));

async function testDataset(dataset) {
  const pxwebUrl = `${PXWEB_BASE_URL}/${dataset.path}`;
  const localUrl = `${BASE_URL}/datasets/${dataset.id}/metadata`;
  
  try {
    console.log(`\n📊 Testing: ${dataset.name}`);
    console.log(`🔗 PXWeb URL: ${pxwebUrl}`);
    
    // Test PXWeb API
    const pxwebResponse = await fetch(pxwebUrl);
    if (pxwebResponse.ok) {
      const data = await pxwebResponse.json();
      console.log(`✅ PXWeb API: OK (${data.title || 'No title'})`);
      
      if (data.variables) {
        console.log(`   📈 Variables: ${data.variables.length}`);
        data.variables.forEach(variable => {
          console.log(`      - ${variable.text} (${variable.values.length} values)`);
        });
      }
    } else {
      console.log(`❌ PXWeb API: Failed (${pxwebResponse.status})`);
    }
    
    // Test Local API
    console.log(`🔗 Local URL: ${localUrl}`);
    const localResponse = await fetch(localUrl);
    if (localResponse.ok) {
      console.log(`✅ Local API: OK`);
    } else {
      console.log(`❌ Local API: Failed (${localResponse.status})`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing ${dataset.name}: ${error.message}`);
  }
}

// Test all air pollution datasets
async function runTests() {
  for (const dataset of airPollutionDatasets) {
    await testDataset(dataset);
  }
  
  console.log('\n🎯 Summary');
  console.log('='.repeat(50));
  console.log('Air pollution datasets have been updated with real data from:');
  console.log('https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database/Environment%20Statistics/Air%20Pollution/');
  console.log('\nDatasets include:');
  console.log('1. Air Pollution by Regions');
  console.log('2. Air Pollution by Cities');
  console.log('3. Transport Emissions');
  console.log('4. Stationary Source Pollution');
}

runTests().catch(console.error);
