import express from 'express';
import cors from 'cors';
import JSONstat from 'jsonstat-toolkit';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PXWeb API base URL
const PXWEB_BASE_URL = 'https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database';

// Available datasets
const DATASETS = {
  'divorced-people-age': 'Gender%20Statistics/Demography/21_Mean_Age_of_Divorced_People.px',
  'population': 'Gender%20Statistics/Demography/01_Population_of_Georgia.px',
  'mean-age': 'Gender%20Statistics/Demography/02_Mean_Age_of_Population.px',
  'live-births-age': 'Gender%20Statistics/Demography/06_Live_Births_by_Age_of_Mother.px',
  'life-expectancy': 'Gender%20Statistics/Demography/16_Life_Expectancy_at_Birth.px'
};

// Helper function to fetch from PXWeb API
async function fetchPXWebData(datasetPath) {
  try {
    // 1. Get metadata
    const metaUrl = `${PXWEB_BASE_URL}/${datasetPath}`;
    const metaResponse = await fetch(metaUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!metaResponse.ok) {
      throw new Error(`Metadata fetch failed: ${metaResponse.status}`);
    }
    
    const metadata = await metaResponse.json();
    
    if (!metadata?.variables?.length) {
      throw new Error('Invalid metadata: missing variables');
    }

    // 2. Build query for all data
    const query = metadata.variables.map(v => ({
      code: v.code,
      selection: { filter: "all", values: ["*"] }
    }));

    // 3. Fetch actual data
    const dataResponse = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        response: { format: 'json-stat' } 
      })
    });

    if (!dataResponse.ok) {
      throw new Error(`Data fetch failed: ${dataResponse.status}`);
    }

    const rawData = await dataResponse.json();
    
    // 4. Process with JSON-Stat
    const jstat = JSONstat(rawData);
    if (!jstat.length) {
      throw new Error('No datasets in JSON-Stat response');
    }

    const dataset = jstat.Dataset(0);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    return {
      metadata,
      dataset,
      rawData
    };
  } catch (error) {
    throw new Error(`PXWeb API error: ${error.message}`);
  }
}

// Helper function to process data into chart-friendly format
function processDataForChart(dataset) {
  const dimIds = dataset.id;
  const yearDimId = dimIds.find(d => /year|წელი|vuosi|anio/i.test(d)) || dimIds[0];
  const otherDims = dimIds.filter(d => d !== yearDimId);
  
  const years = dataset.Dimension(yearDimId).id;
  
  // Handle categorical dimensions (like Gender)
  const catDimId = otherDims[0];
  const catIds = catDimId ? dataset.Dimension(catDimId).id : [];
  const catLabels = catDimId && dataset.Dimension(catDimId).Category()?.label 
    ? dataset.Dimension(catDimId).Category().label 
    : {};
  
  const rows = years.map(year => {
    const row = { year: Number(year) || year };
    
    if (catIds.length > 0) {
      // Multi-dimensional data (e.g., by gender)
      catIds.forEach(catId => {
        const cell = dataset.Data({ [yearDimId]: year, [catDimId]: catId });
        const label = catLabels[catId] || catId;
        row[label] = cell ? Number(cell.value) : null;
      });
    } else {
      // Single dimension data
      const cell = dataset.Data({ [yearDimId]: year });
      row.value = cell ? Number(cell.value) : null;
    }
    
    return row;
  });
  
  return {
    title: dataset.label || 'Dataset',
    dimensions: dimIds,
    categories: catIds.map(id => catLabels[id] || id),
    data: rows
  };
}

// Routes

// Get available datasets
app.get('/api/datasets', (req, res) => {
  res.json({
    datasets: Object.keys(DATASETS).map(key => ({
      id: key,
      name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: DATASETS[key]
    }))
  });
});

// Get raw metadata for a dataset
app.get('/api/datasets/:id/metadata', async (req, res) => {
  const { id } = req.params;
  
  if (!DATASETS[id]) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  try {
    const datasetPath = DATASETS[id];
    const metaUrl = `${PXWEB_BASE_URL}/${datasetPath}`;
    
    const response = await fetch(metaUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const metadata = await response.json();
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get processed data for a dataset
app.get('/api/datasets/:id/data', async (req, res) => {
  const { id } = req.params;
  
  if (!DATASETS[id]) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  try {
    const { dataset } = await fetchPXWebData(DATASETS[id]);
    const processedData = processDataForChart(dataset);
    
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get raw JSON-Stat data for a dataset
app.get('/api/datasets/:id/jsonstat', async (req, res) => {
  const { id } = req.params;
  
  if (!DATASETS[id]) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  
  try {
    const { rawData } = await fetchPXWebData(DATASETS[id]);
    res.json(rawData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PXWeb Backend Server running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/datasets           - List available datasets`);
  console.log(`   GET  /api/datasets/:id/metadata - Get dataset metadata`);
  console.log(`   GET  /api/datasets/:id/data     - Get processed chart data`);
  console.log(`   GET  /api/datasets/:id/jsonstat - Get raw JSON-Stat data`);
  console.log(`   GET  /health                    - Health check`);
  console.log(`\n📝 Example: http://localhost:${PORT}/api/datasets/divorced-people-age/data`);
});
