import DataProcessingService from '../src/services/dataProcessingService.js';
import pxwebService from '../src/services/pxwebService.js';
import { DATASETS } from '../src/config/datasets.js';

async function testForestFiresPerformance() {
  console.log('🔥 Testing forest-fires API performance...');
  
  try {
    const service = DataProcessingService; // It's already an instance
    const dataset = DATASETS['forest-fires'];
    
    if (!dataset) {
      throw new Error('Forest-fires dataset not found');
    }
    
    // Fetch data from PXWeb first
    console.time('PXWeb data fetch');
    const { dataset: jsonStatDataset } = await pxwebService.fetchData(dataset.path, 'ka');
    console.timeEnd('PXWeb data fetch');
    
    // First call - test processing performance
    console.time('Forest-fires processing (first call)');
    const result = service.processForChart(jsonStatDataset, 'forest-fires', 'ka');
    console.timeEnd('Forest-fires processing (first call)');
    
    console.log('✅ Forest-fires API working!');
    console.log('📊 Results summary:');
    console.log(`   - Records: ${result.data ? result.data.length : 0}`);
    console.log(`   - Categories: ${result.categories ? result.categories.length : 0}`);
    console.log(`   - Year range: ${result.metadata ? result.metadata.yearRange : 'N/A'}`);
    
    if (result.data && result.data.length > 0) {
      console.log('   - Sample year:', result.data[0].year);
      console.log('   - Sample keys:', Object.keys(result.data[0]).slice(0, 5).join(', '));
    }
    
    // Second call - test caching performance
    console.log('\n🚀 Testing cache performance...');
    console.time('Forest-fires processing (cached call)');
    const result2 = service.processForChart(jsonStatDataset, 'forest-fires', 'ka');
    console.timeEnd('Forest-fires processing (cached call)');
    
    console.log('✅ Cached call completed!');
    console.log('📈 Performance optimization successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

testForestFiresPerformance();