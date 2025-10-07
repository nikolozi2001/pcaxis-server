import axios from 'axios';

const BASE_URL = 'http://192.168.1.27:3000/api/datasets/forest-planting-recovery';

async function testYearConsistency() {
    try {
        console.log('🔄 Testing year consistency between metadata and data endpoints...\n');
        
        // Fetch metadata
        console.log('📊 Fetching metadata...');
        const metadataResponse = await axios.get(`${BASE_URL}/metadata`);
        const metadata = metadataResponse.data.data.metadata;
        
        // Find year variable in metadata
        const yearVar = metadata.variables.find(v => v.code === 'Year');
        const metadataYears = yearVar ? yearVar.valueTexts : [];
        const metadataFirstYear = metadataYears[0];
        const metadataLastYear = metadataYears[metadataYears.length - 1];
        
        console.log(`   Years in metadata: ${metadataYears.join(', ')}`);
        console.log(`   Metadata year range: ${metadataFirstYear} - ${metadataLastYear}`);
        
        // Fetch data
        console.log('\n📈 Fetching data...');
        const dataResponse = await axios.get(`${BASE_URL}/data`);
        const dataResult = dataResponse.data.data;
        
        // Get years from data
        const dataYears = dataResult.data.map(row => row.year).sort((a, b) => a - b);
        const dataFirstYear = dataYears[0];
        const dataLastYear = dataYears[dataYears.length - 1];
        const dataYearRange = dataResult.metadata.yearRange;
        
        console.log(`   Years in data: ${dataYears.join(', ')}`);
        console.log(`   Data year range: ${dataFirstYear} - ${dataLastYear}`);
        console.log(`   Metadata yearRange: ${dataYearRange.start} - ${dataYearRange.end}`);
        
        // Check consistency
        console.log('\n✅ Consistency Check:');
        const metadataLastYearNum = parseInt(metadataLastYear);
        const dataLastYearNum = parseInt(dataLastYear);
        const consistent = metadataLastYearNum === dataLastYearNum && metadataLastYearNum === dataYearRange.end;
        
        if (consistent) {
            console.log(`   ✅ SUCCESS: All endpoints show consistent last year: ${dataLastYearNum}`);
        } else {
            console.log(`   ❌ INCONSISTENT:`);
            console.log(`      Metadata last year: ${metadataLastYear}`);
            console.log(`      Data last year: ${dataLastYear}`);
            console.log(`      Data metadata yearRange end: ${dataYearRange.end}`);
        }
        
        console.log('\n📊 Summary:');
        console.log(`   Total years in metadata: ${metadataYears.length}`);
        console.log(`   Total years in data: ${dataYears.length}`);
        console.log(`   Years consistent: ${consistent ? 'YES' : 'NO'}`);
        
    } catch (error) {
        console.error('❌ Error testing year consistency:', error.response?.data || error.message);
    }
}

testYearConsistency();