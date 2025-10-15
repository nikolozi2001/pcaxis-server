# DataProcessingService Maintenance Guide

## 📋 Quick Reference Checklist

### ✅ Adding a New Dataset (Standard Process)

1. **Identify Requirements**
   - [ ] Does it need numeric indices instead of category names?
   - [ ] Does it have custom year mappings?
   - [ ] Does it have region/location mappings?
   - [ ] How many dimensions does it have?

2. **Update Configuration**
   - [ ] Add to `DATASET_PROCESSORS` if special handling needed
   - [ ] Add to `EXCLUDE_FROM_TWO_DIM` if bypassing 2D processing
   - [ ] Add to `DATASET_YEAR_MAPPINGS` if custom year mapping needed
   - [ ] Create region mappings if geographic data

3. **Create Processor Method**
   - [ ] Follow naming convention: `_process[DatasetName]Special`
   - [ ] Use helper methods: `_parseYear`, `_createNumericCategoryMapping`
   - [ ] Include proper error handling and logging
   - [ ] Return standardized data structure

4. **Test Implementation**
   - [ ] Basic structure: `curl "http://localhost:3000/api/datasets/DATASET/data" | head -50`
   - [ ] Year validation: `curl -s "..." | grep -o '"year":[0-9]*' | sort -u`
   - [ ] Category validation: `curl -s "..." | grep -A5 '"categories"'`
   - [ ] Metadata check: Verify yearRange, categoryMapping, dimensionCount

### ⚠️ Common Issues & Solutions

| Problem | Solution | Prevention |
|---------|----------|------------|
| Returns category names instead of indices | Add to `DATASET_PROCESSORS` & `EXCLUDE_FROM_TWO_DIM` | Check client requirements |
| Years show as 0,1,2 instead of 2017,2018 | Add mapping to `DATASET_YEAR_MAPPINGS` | Test year parsing early |
| New dataset not using special processor | Verify exact dataset ID match | Use browser dev tools to check ID |
| Empty/null data returned | Check `_logProcessing` output | Add logging to processor |

### 🔧 Configuration Templates

#### Basic Numeric Indices Dataset
```javascript
// 1. Add to configurations
static DATASET_PROCESSORS = {
  'new-dataset': '_processNewDatasetSpecial'
};

static EXCLUDE_FROM_TWO_DIM = new Set([
  'new-dataset'  // Add here
]);

// 2. Create processor method
_processNewDatasetSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
  const validYears = years.filter(year => year && year.toString().trim() !== '');
  const yearLabels = this._getCategoryLabels(dataset, yearDimId);
  
  const categoryDim = otherDims[0];
  const categoryValues = dataset.Dimension(categoryDim).id;
  const categoryLabels = this._getCategoryLabels(dataset, categoryDim);
  
  const data = [];
  validYears.forEach((year, yearIndex) => {
    const actualYear = this._parseYear(year, yearIndex, yearLabels, 'new-dataset');
    const row = { year: actualYear };
    
    categoryValues.forEach((categoryId, categoryIndex) => {
      const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
      const cell = dataset.Data(queryObj);
      row[categoryIndex.toString()] = cell ? Number(cell.value) : null;
    });
    
    data.push(row);
  });
  
  return {
    title: dataset.label || 'Dataset Title',
    dimensions: [yearDimId, categoryDim],
    categories: categoryValues.map((_, index) => index.toString()),
    data: data,
    metadata: {
      totalRecords: data.length,
      hasCategories: true,
      yearRange: this._getYearRange(data.map(row => row.year)),
      categoryMapping: this._createNumericCategoryMapping(categoryValues, categoryLabels, 'new-dataset')
    }
  };
}
```

#### Dataset with Custom Year Mapping
```javascript
// Add year mapping configuration
static DATASET_YEAR_MAPPINGS = {
  'custom-years-dataset': {
    '0': 2020, '1': 2021, '2': 2022, '3': 2023
  }
};

// Use in processor
const actualYear = this._parseYear(year, yearIndex, yearLabels, 'custom-years-dataset');
```

#### Dataset with Region Mappings
```javascript
// Create region mapping configuration
static CUSTOM_DATASET_REGION_MAPPINGS = {
  indexToId: {
    "0": 1, "1": 2, "2": 3
  },
  indexToCode: {
    "0": "REG-01", "1": "REG-02", "2": "REG-03"
  }
};

// Use in processor
const regionIndexToIdMapping = DataProcessingService.CUSTOM_DATASET_REGION_MAPPINGS.indexToId;
const regionCodeMapping = DataProcessingService.CUSTOM_DATASET_REGION_MAPPINGS.indexToCode;
```

### 🧪 Testing Commands

```bash
# Basic structure test
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | head -100

# Year validation (should show actual years like 2017, 2018, not indices like 0, 1)
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | grep -o '"year":[0-9]*' | sort -u

# Category validation (should show numeric indices like "0", "1", not names)
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | grep -A10 '"categories"'

# Metadata check
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | grep -A20 '"metadata"'

# Full response with formatting (if jq available)
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | jq '.'
```

### 📊 Performance Monitoring

```bash
# Response time check
time curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" > /dev/null

# Response size check
curl -s "http://localhost:3000/api/datasets/DATASET_ID/data" | wc -c

# Memory usage (run with Node.js --inspect)
# Check Chrome DevTools Memory tab while processing large datasets
```

### 🔍 Debugging Workflow

1. **Enable Development Logging**
   ```bash
   NODE_ENV=development npm start
   ```

2. **Check Configuration Matching**
   ```javascript
   console.log('Dataset ID:', datasetId);
   console.log('Has Processor:', DataProcessingService.DATASET_PROCESSORS[datasetId]);
   console.log('Excluded from 2D:', DataProcessingService.EXCLUDE_FROM_TWO_DIM.has(datasetId));
   ```

3. **Verify Year Processing**
   ```javascript
   const testYear = this._parseYear('0', 0, yearLabels, datasetId);
   console.log('Parsed year:', testYear);
   ```

4. **Check Data Structure**
   ```javascript
   console.log('Dimensions:', dataset.id);
   console.log('Year dimension:', yearDimId);
   console.log('Other dimensions:', otherDims);
   console.log('Years:', years);
   ```

### 📝 Documentation Standards

- **Method documentation**: Include purpose, parameters, return value, and maintenance notes
- **Configuration documentation**: Explain when and why to add entries
- **Error scenarios**: Document common issues and solutions
- **Examples**: Provide working code templates
- **Testing**: Include verification commands

### 🔄 Version Control Best Practices

- **Commit message format**: `feat(dataprocessing): add support for new-dataset with numeric indices`
- **Test before commit**: Run test commands for affected datasets
- **Update documentation**: Keep this guide current with changes
- **Code review**: Have another developer verify new dataset processors

---

**Last Updated**: October 15, 2025  
**Maintainer**: Development Team  
**File Location**: `/src/services/dataProcessingService.js`