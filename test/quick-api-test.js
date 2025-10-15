import express from 'express';
import cors from 'cors';
import datasetController from '../src/controllers/datasetController.js';

// Quick test server to verify the fix
const app = express();
app.use(cors());
app.use(express.json());

// Test the specific endpoint
app.get('/api/datasets/atmospheric-precipitation/data', (req, res) => {
  req.params = { id: 'atmospheric-precipitation' };
  req.query = { lang: 'ka' };
  datasetController.getData(req, res);
});

const PORT = 3001; // Use different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('🌧️  Test endpoint: http://localhost:3001/api/datasets/atmospheric-precipitation/data');
  console.log('');
  console.log('Expected: categories should now be ["0", "1", "2", ...] instead of text names');
});

// Auto-test after 1 second
setTimeout(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/datasets/atmospheric-precipitation/data');
    const data = await response.json();
    
    if (data.success && data.data.categories) {
      const first5 = data.data.categories.slice(0, 5);
      console.log('✅ API Response received!');
      console.log('📊 First 5 categories:', first5);
      
      const areNumeric = first5.every(cat => /^\d+$/.test(cat));
      if (areNumeric) {
        console.log('🎉 SUCCESS: Categories are numeric IDs!');
      } else {
        console.log('❌ Issue: Categories are still text names');
      }
    }
  } catch (error) {
    console.error('🚨 Test failed:', error.message);
  }
  
  process.exit(0);
}, 2000);