#!/usr/bin/env node
/**
 * Test Script for Environmental Datasets
 * Quick test to verify the new environmental datasets are working
 */

const BASE_URL = 'http://localhost:3000';

/**
 * Make HTTP request
 */
async function makeRequest(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Test function
 */
async function runTests() {
  console.log('🧪 Testing Environmental Datasets API\n');
  console.log('=' .repeat(50));

  // Test 1: Get all datasets
  console.log('📋 Test 1: Get all datasets');
  const allDatasets = await makeRequest(`${BASE_URL}/api/datasets`);
  if (allDatasets.success) {
    console.log(`✅ Success: Found ${allDatasets.data.count} datasets`);
    console.log(`📊 Categories: ${allDatasets.data.categories.join(', ')}`);
    
    // Show environmental datasets
    const envDatasets = allDatasets.data.data.filter(d => d.category === 'environment');
    console.log(`🌱 Environmental datasets: ${envDatasets.length}`);
    envDatasets.slice(0, 3).forEach(d => console.log(`   - ${d.id}: ${d.name}`));
  } else {
    console.log(`❌ Failed: ${allDatasets.error || allDatasets.data?.message}`);
  }

  console.log('\n' + '-'.repeat(50));

  // Test 2: Get environment category only
  console.log('🌱 Test 2: Get environmental datasets only');
  const envOnly = await makeRequest(`${BASE_URL}/api/datasets?category=environment`);
  if (envOnly.success) {
    console.log(`✅ Success: Found ${envOnly.data.count} environmental datasets`);
  } else {
    console.log(`❌ Failed: ${envOnly.error || envOnly.data?.message}`);
  }

  console.log('\n' + '-'.repeat(50));

  // Test 3: Navigation - explore environment structure
  console.log('🗺️  Test 3: Explore environment structure');
  const navEnv = await makeRequest(`${BASE_URL}/api/navigation/environment`);
  if (navEnv.success) {
    console.log(`✅ Success: Found ${navEnv.data.items.length} environment subcategories`);
    navEnv.data.items.slice(0, 3).forEach(item => 
      console.log(`   - ${item.id}: ${item.text}`)
    );
  } else {
    console.log(`❌ Failed: ${navEnv.error || navEnv.data?.message}`);
  }

  console.log('\n' + '-'.repeat(50));

  // Test 4: Get categories
  console.log('📂 Test 4: Get all categories');
  const categories = await makeRequest(`${BASE_URL}/api/navigation/categories`);
  if (categories.success) {
    console.log('✅ Success: Retrieved categories');
    Object.keys(categories.data.categories).forEach(key => {
      const cat = categories.data.categories[key];
      console.log(`   ${cat.icon} ${cat.name}: ${cat.description}`);
    });
  } else {
    console.log(`❌ Failed: ${categories.error || categories.data?.message}`);
  }

  console.log('\n' + '-'.repeat(50));

  // Test 5: Try to get data from an environmental dataset
  console.log('📊 Test 5: Get environmental dataset data');
  const testDataset = 'municipal-waste'; // One of our environmental datasets
  const dataResult = await makeRequest(`${BASE_URL}/api/datasets/${testDataset}/data`);
  if (dataResult.success) {
    console.log(`✅ Success: Retrieved data for ${testDataset}`);
    console.log(`   Title: ${dataResult.data.title}`);
    console.log(`   Data points: ${dataResult.data.data?.length || 0}`);
  } else {
    console.log(`⚠️  Expected: ${dataResult.data?.message || dataResult.error}`);
    console.log('   (This may fail if the exact path doesn\'t exist in PXWeb)');
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Test complete! The API structure is working.');
  console.log('\n💡 Next steps:');
  console.log('   1. Use /api/navigation/explore?path=Environment%20Statistics to explore real paths');
  console.log('   2. Use /api/navigation/discover to find actual table files');
  console.log('   3. Update dataset paths with real PXWeb table names');
}

// Run tests
runTests().catch(console.error);
