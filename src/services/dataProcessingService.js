/**
 * Data Processing Service
 * Handles data transformation and formatting for PXWeb datasets
 * 
 * ================================================================================
 * COMPREHENSIVE MAINTENANCE DOCUMENTATION
 * ================================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. Architecture Overview
 * 2. Configuration Management
 * 3. Adding New Datasets
 * 4. Troubleshooting Guide
 * 5. Testing Procedures
 * 6. Common Patterns
 * 7. Performance Considerations
 * 8. Error Handling
 * 
 * ================================================================================
 * 1. ARCHITECTURE OVERVIEW
 * ================================================================================
 * 
 * SIMPLIFIED PROCESSING FLOW:
 * ---------------------------
 * Client Request → processForChart() → _routeToProcessor() → Specific Processor
 *                                   ↓
 *                              Helper Methods + Configurations
 * 
 * KEY DESIGN PRINCIPLES:
 * - Configuration-driven routing (no hardcoded conditionals)
 * - Reusable helper methods for common operations
 * - Consistent data structure transformations
 * - Extensible for new datasets without code duplication
 * 
 * ================================================================================
 * 2. CONFIGURATION MANAGEMENT
 * ================================================================================
 * 
 * CONFIGURATION OBJECTS (Static Properties):
 * ------------------------------------------
 * 
 * A) DATASET_PROCESSORS:
 *    Purpose: Maps dataset IDs to their specific processor methods
 *    Format: { 'dataset-id': '_methodName' }
 *    Example: { 'forest-fires': '_processForestFiresSpecial' }
 * 
 * B) EXCLUDE_FROM_TWO_DIM:
 *    Purpose: Datasets that need multi-dimensional processing even with 2 dimensions
 *    Reason: Usually because they need numeric indices instead of category names
 *    Format: Set(['dataset-id1', 'dataset-id2'])
 * 
 * C) DATASET_YEAR_MAPPINGS:
 *    Purpose: Custom year mappings for datasets using index-based years
 *    Format: { 'dataset-id': { 'index': actualYear } }
 *    Example: { 'forest-fires': { '0': 2017, '1': 2018 } }
 * 
 * D) FOREST_FIRES_REGION_MAPPINGS:
 *    Purpose: Example of dataset-specific mappings (extend pattern for other datasets)
 *    Structure: { indexToId: {...}, indexToCode: {...} }
 * 
 * ================================================================================
 * 3. ADDING NEW DATASETS - STEP-BY-STEP GUIDE
 * ================================================================================
 * 
 * SCENARIO A: Dataset needs numeric indices instead of category names
 * ------------------------------------------------------------------
 * 1. Add to DATASET_PROCESSORS: { 'new-dataset': '_processNewDatasetSpecial' }
 * 2. Add to EXCLUDE_FROM_TWO_DIM: 'new-dataset'
 * 3. Create processor method following template in section 6
 * 4. Test with: curl "http://localhost:3000/api/datasets/new-dataset/data"
 * 
 * SCENARIO B: Dataset has custom year mappings
 * --------------------------------------------
 * 1. Follow steps from Scenario A
 * 2. Add to DATASET_YEAR_MAPPINGS: { 'new-dataset': { '0': 2020, '1': 2021 } }
 * 3. Use _parseYear(year, yearIndex, yearLabels, 'new-dataset') in processor
 * 
 * SCENARIO C: Dataset has region/location mappings
 * ------------------------------------------------
 * 1. Follow steps from previous scenarios
 * 2. Create NEW_DATASET_REGION_MAPPINGS static configuration
 * 3. Use configuration in processor instead of hardcoded mappings
 * 
 * ================================================================================
 * 4. TROUBLESHOOTING GUIDE
 * ================================================================================
 * 
 * PROBLEM: Dataset returns category names instead of numeric indices
 * SOLUTION: Add dataset to DATASET_PROCESSORS and EXCLUDE_FROM_TWO_DIM
 * 
 * PROBLEM: Years appear as indices (0, 1, 2) instead of actual years
 * SOLUTION: Add year mapping to DATASET_YEAR_MAPPINGS or check _parseYear logic
 * 
 * PROBLEM: New dataset not using special processor
 * SOLUTION: Verify dataset ID matches exactly in DATASET_PROCESSORS
 * 
 * PROBLEM: API returns empty data
 * SOLUTION: Check _logProcessing output in development mode
 * 
 * DEBUGGING COMMANDS:
 * - Check dataset structure: curl "http://localhost:3000/api/datasets/DATASET/data" | head -100
 * - View years only: curl "http://localhost:3000/api/datasets/DATASET/data" | grep -o '"year":[0-9]*'
 * - Check categories: curl "http://localhost:3000/api/datasets/DATASET/data" | grep -o '"categories":\[[^]]*\]'
 * 
 * ================================================================================
 * 5. TESTING PROCEDURES
 * ================================================================================
 * 
 * REQUIRED TESTS FOR NEW DATASETS:
 * --------------------------------
 * 1. Verify numeric indices: Should return "0", "1", "2" not category names
 * 2. Check actual years: Should return 2017, 2018, etc. not 0, 1, 2
 * 3. Validate data structure: Ensure region mappings work correctly
 * 4. Test metadata: Verify yearRange, categoryMapping, dimensionCount
 * 
 * TEST COMMANDS TEMPLATE:
 * ----------------------
 * # Basic structure test
 * curl -s "http://localhost:3000/api/datasets/DATASET/data" | head -50
 * 
 * # Year validation
 * curl -s "http://localhost:3000/api/datasets/DATASET/data" | grep -o '"year":[0-9]*' | sort -u
 * 
 * # Category validation  
 * curl -s "http://localhost:3000/api/datasets/DATASET/data" | grep -A5 '"categories"'
 * 
 * ================================================================================
 * 6. COMMON PATTERNS - PROCESSOR METHOD TEMPLATES
 * ================================================================================
 * 
 * TEMPLATE A: Basic numeric indices processor
 * ------------------------------------------
 * _processNewDatasetSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
 *   const validYears = years.filter(year => year && year.toString().trim() !== '');
 *   const yearLabels = this._getCategoryLabels(dataset, yearDimId);
 *   const categoryDim = otherDims[0];
 *   const categoryValues = dataset.Dimension(categoryDim).id;
 *   const categoryLabels = this._getCategoryLabels(dataset, categoryDim);
 *   
 *   const data = [];
 *   validYears.forEach((year, yearIndex) => {
 *     const actualYear = this._parseYear(year, yearIndex, yearLabels, 'new-dataset');
 *     const row = { year: actualYear };
 *     categoryValues.forEach((categoryId, categoryIndex) => {
 *       const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
 *       const cell = dataset.Data(queryObj);
 *       row[categoryIndex.toString()] = cell ? Number(cell.value) : null;
 *     });
 *     data.push(row);
 *   });
 *   
 *   return {
 *     title: dataset.label || 'Dataset Title',
 *     dimensions: [yearDimId, categoryDim],
 *     categories: categoryValues.map((_, index) => index.toString()),
 *     data: data,
 *     metadata: {
 *       totalRecords: data.length,
 *       hasCategories: true,
 *       yearRange: this._getYearRange(data.map(row => row.year)),
 *       categoryMapping: this._createNumericCategoryMapping(categoryValues, categoryLabels, 'new-dataset')
 *     }
 *   };
 * }
 * 
 * ================================================================================
 * 7. PERFORMANCE CONSIDERATIONS
 * ================================================================================
 * 
 * OPTIMIZATION GUIDELINES:
 * -----------------------
 * - Use configuration lookups instead of repeated conditionals
 * - Cache category labels using _getCategoryLabels() once per dimension
 * - Filter empty years early to reduce processing
 * - Use helper methods to avoid code duplication
 * - Minimize object creation in loops
 * 
 * MONITORING:
 * ----------
 * - Use _logProcessing() for development debugging
 * - Monitor response times for large datasets
 * - Check memory usage with complex multi-dimensional data
 * 
 * ================================================================================
 * 8. ERROR HANDLING & LOGGING
 * ================================================================================
 * 
 * ERROR PATTERNS:
 * --------------
 * - Always validate dataset dimensions exist before accessing
 * - Use fallback values for missing labels/mappings  
 * - Handle null/undefined data gracefully
 * - Provide meaningful error messages in logs
 * 
 * LOGGING STRATEGY:
 * ----------------
 * - Use _logProcessing() for dataset-specific information
 * - Log configuration mismatches in development
 * - Include dataset ID and operation context in logs
 * - Avoid logging in production unless critical errors
 */
export class DataProcessingService {
  
  /**
   * PERFORMANCE OPTIMIZATION: Instance caches and optimizations
   * ===========================================================
   */
  constructor() {
    // Cache for expensive operations
    this._dimensionCache = new Map();
    this._categoryLabelsCache = new Map();
    this._yearCache = new Map();
    
    // Optimize Set operations by converting to Map for faster lookups
    this._excludeFromTwoDimMap = new Map();
    DataProcessingService.EXCLUDE_FROM_TWO_DIM.forEach(id => this._excludeFromTwoDimMap.set(id, true));
    
    // Pre-compile regex for year dimension finding
    this._yearDimensionRegex = /year|წელი|vuosi|anio|time|dato/i;
  }
  
  /**
   * CONFIGURATION: Dataset-specific processors
   * ------------------------------------------
   * Maps dataset IDs to their special processor methods.
   * 
   * MAINTENANCE: When adding a new dataset that needs special processing:
   * 1. Add entry: 'dataset-id': '_processDatasetIdSpecial'
   * 2. Create the corresponding method following naming convention
   * 3. Test with curl command to verify correct processing
   */
  static DATASET_PROCESSORS = {
    'water-use-households': '_processWaterUseHouseholdsSpecial',
    'sewerage-network-population': '_processSewerageNetworkPopulationSpecial',
    'water-abstraction': '_processWaterAbstractionSpecial',
    'material-flow-indicators': '_processMaterialFlowIndicatorsSpecial',
    'felled-timber-volume': '_processFelledTimberVolumeSpecial',
    'illegal-logging': '_processIllegalLoggingSpecial',
    'forest-planting-recovery': '_processForestPlantingRecoverySpecial',
    'municipal-waste': '_processMunicipalWasteSpecial',
    'fertilizer-use': '_processFertilizerUseSpecial',
    'geological-phenomena': '_processGeologicalPhenomenaSpecial',
    'final-energy-consumption': '_processFinalEnergyConsumptionSpecial',
    'primary-energy-supply': '_processPrimaryEnergySupplySpecial',
    'energy-intensity': '_processEnergyIntensitySpecial',
    'protected-areas-mammals': '_processProtectedAreasMammalsSpecial',
    'protected-areas-categories': '_processProtectedAreasCategoriesSpecial',
    'protected-areas-birds': '_processProtectedAreasBirdsSpecial',
    'timber-by-cutting-purpose': '_processTimberByCuttingPurposeSpecial',
    'forest-fires': '_processForestFiresSpecial'
  };

  /**
   * CONFIGURATION: Two-dimensional processing exclusions
   * ---------------------------------------------------
   * Datasets that should use multi-dimensional processing even with only 2 dimensions.
   * Usually because they need numeric indices instead of category names.
   * 
   * MAINTENANCE: Add dataset ID here if it should bypass simple 2D processing.
   */
  static EXCLUDE_FROM_TWO_DIM = new Set([
    'water-abstraction', 'material-flow-indicators', 'felled-timber-volume',
    'illegal-logging', 'forest-planting-recovery', 'municipal-waste',
    'fertilizer-use', 'geological-phenomena', 'final-energy-consumption',
    'primary-energy-supply', 'energy-intensity', 'protected-areas-mammals',
    'protected-areas-categories', 'protected-areas-birds', 'timber-by-cutting-purpose',
    'atmospheric-precipitation'
  ]);

  /**
   * CONFIGURATION: Dataset-specific year mappings
   * ---------------------------------------------
   * For datasets that use index-based years (0, 1, 2) instead of actual years.
   * 
   * MAINTENANCE: Add mapping when dataset has non-standard year indexing.
   * Format: { 'dataset-id': { 'yearIndex': actualYear } }
   */
  static DATASET_YEAR_MAPPINGS = {
    'forest-fires': {
      '0': 2017, '1': 2018, '2': 2019, '3': 2020, 
      '4': 2021, '5': 2022, '6': 2023
    }
    // TEMPLATE for new dataset:
    // 'new-dataset': {
    //   '0': 2020, '1': 2021, '2': 2022
    // }
  };

  /**
   * CONFIGURATION: Forest-fires region mappings
   * -------------------------------------------
   * Example of dataset-specific region/location mappings.
   * Extend this pattern for other datasets with similar needs.
   * 
   * MAINTENANCE: Create similar mappings for other geographic datasets.
   * Pattern: [DATASET_NAME]_REGION_MAPPINGS = { indexToId: {...}, indexToCode: {...} }
   */
  static FOREST_FIRES_REGION_MAPPINGS = {
    indexToId: {
      "0": 1, "1": -2, "2": 2, "3": 3, "4": 4, "5": 5,
      "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "11": 11, "12": 12
    },
    indexToCode: {
      "0": "GE-TB", "1": "GE-AB", "2": "GE-AJ", "3": "GE-GU", 
      "4": "GE-IM", "5": "GE-KA", "6": "GE-MM", "7": "GE-RL",
      "8": "GE-SZ", "9": "GE-SJ", "10": "GE-KK", "11": "GE-SK", "12": "UNKNOWN"
    }
  };
  /**
   * MAIN ENTRY POINT: Process dataset into chart-friendly format
   * ============================================================
   * 
   * This is the primary method called by controllers to transform PXWeb data.
   * It identifies the dataset structure and routes to appropriate processor.
   * 
   * MAINTENANCE NOTES:
   * - This method should remain simple and delegate to _routeToProcessor
   * - All dataset-specific logic should be in configuration or special processors
   * - Changes here affect ALL datasets, so test thoroughly
   * 
   * @param {Object} dataset - JSON-Stat dataset from PXWeb API
   * @param {string} datasetId - Dataset identifier for routing to special processors
   * @param {string} lang - Language code ('ka' for Georgian, 'en' for English)
   * @returns {Object} - Standardized data structure for frontend consumption
   */
  processForChart(dataset, datasetId = null, lang = 'ka') {
    // Extract basic dataset structure information
    const dimIds = dataset.id;
    const yearDimId = this._findYearDimension(dimIds);
    const otherDims = dimIds.filter(d => d !== yearDimId);
    const years = dataset.Dimension(yearDimId).id;
    
    // Delegate to routing logic
    return this._routeToProcessor(dataset, datasetId, years, yearDimId, otherDims, lang);
  }

  /**
   * ROUTING LOGIC: Determine appropriate processor for dataset
   * =========================================================
   * 
   * This method implements the configuration-driven routing system.
   * It replaces the old complex conditional logic with clean configuration lookups.
   * 
   * ROUTING PRIORITY:
   * 1. Special processor (if configured in DATASET_PROCESSORS)
   * 2. Single dimension → _processSingleDimension
   * 3. Two dimensions (not excluded) → _processTwoDimensions  
   * 4. Multi-dimensional or excluded → _processMultiDimensions
   * 
   * MAINTENANCE NOTES:
   * - Add new datasets to configurations, not this method
   * - This logic should remain stable and configuration-driven
   * - Test routing with: console.log('Routing to:', processorMethod)
   * 
   * @param {Object} dataset - JSON-Stat dataset
   * @param {string} datasetId - Dataset identifier for configuration lookup
   * @param {Array} years - Year dimension data
   * @param {string} yearDimId - Year dimension identifier
   * @param {Array} otherDims - Non-year dimensions
   * @param {string} lang - Language code
   * @returns {Object} - Processed data from appropriate processor
   */
  _routeToProcessor(dataset, datasetId, years, yearDimId, otherDims, lang) {
    // STEP 1: Check for dataset-specific processor
    if (datasetId && DataProcessingService.DATASET_PROCESSORS[datasetId]) {
      const processorMethod = DataProcessingService.DATASET_PROCESSORS[datasetId];
      this._logProcessing(datasetId, `Routing to special processor: ${processorMethod}`);
      return this[processorMethod](dataset, years, yearDimId, otherDims, lang);
    }

    // STEP 2: Route based on dimension structure (optimized lookups)
    if (otherDims.length === 0) {
      // Only year dimension - simple time series
      this._logProcessing(datasetId, 'Routing to single dimension processor');
      return this._processSingleDimension(dataset, years, yearDimId);
    } else if (otherDims.length === 1 && !this._excludeFromTwoDimMap.has(datasetId)) {
      // Two dimensions and not excluded - use simple 2D processor (optimized Map lookup)
      this._logProcessing(datasetId, 'Routing to two dimension processor');
      return this._processTwoDimensions(dataset, years, yearDimId, otherDims[0]);
    } else {
      // Multi-dimensional or excluded from 2D - use complex processor
      this._logProcessing(datasetId, 'Routing to multi-dimensional processor');
      return this._processMultiDimensions(dataset, years, yearDimId, otherDims, datasetId, lang);
    }
  }

  /**
   * OPTIMIZED: Find the year/time dimension with caching
   * ====================================================
   * Uses pre-compiled regex and caches results for repeated calls.
   * 
   * @param {Array} dimIds - Array of dimension IDs
   * @returns {string} - Year dimension ID
   */
  _findYearDimension(dimIds) {
    // Create cache key from dimension IDs
    const cacheKey = dimIds.join('|');
    
    // Check cache first
    if (this._dimensionCache.has(cacheKey)) {
      return this._dimensionCache.get(cacheKey);
    }
    
    // Find year dimension using optimized regex
    const yearDim = dimIds.find(d => this._yearDimensionRegex.test(d)) || dimIds[0];
    
    // Cache the result
    this._dimensionCache.set(cacheKey, yearDim);
    
    return yearDim;
  }

  /**
   * Process single dimension data (only years)
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @returns {Object}
   */
  _processSingleDimension(dataset, years, yearDimId) {
    const rows = years.map(year => {
      const cell = dataset.Data({ [yearDimId]: year });
      return {
        year: Number(year) || year,
        value: cell ? Number(cell.value) : null
      };
    });

    return {
      title: dataset.label || 'Dataset',
      dimensions: [yearDimId],
      categories: [],
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: false,
        yearRange: this._getYearRange(years)
      }
    };
  }

  /**
   * Process two dimension data (years + one category)
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {string} catDimId 
   * @returns {Object}
   */
  _processTwoDimensions(dataset, years, yearDimId, catDimId) {
    const catIds = dataset.Dimension(catDimId).id;
    const catLabels = this._getCategoryLabels(dataset, catDimId);
    
    // Get year labels using the same method as _getCategoryLabels
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);
    
    const rows = years.map((year, index) => {
      // Get the actual year value from the labels
      let actualYear = Number(year) || year;
      
      // Try to get the actual year from the year labels
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear };
      
      catIds.forEach(catId => {
        const cell = dataset.Data({ [yearDimId]: year, [catDimId]: catId });
        const label = catLabels[catId] || catId;
        row[label] = cell ? Number(cell.value) : null;
      });
      
      return row;
    });

    // Calculate actual years for yearRange
    const actualYears = years.map(year => {
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          return parsedYear;
        }
      }
      return Number(year) || year;
    });

    return {
      title: dataset.label || 'Dataset',
      dimensions: [yearDimId, catDimId],
      categories: catIds.map(id => catLabels[id] || id),
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears)
      }
    };
  }

  /**
   * Process multi-dimensional data (3+ dimensions)
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @param {string} datasetId - Dataset identifier for special handling
   * @returns {Object}
   */
  _processMultiDimensions(dataset, years, yearDimId, otherDims, datasetId = null, lang = 'ka') {
    // Special handling for stationary-source-pollution dataset
    if (datasetId === 'stationary-source-pollution') {
      return this._processStationarySourcePollution(dataset, years, yearDimId, otherDims);
    }

    // Special handling for water-abstraction dataset (treat as multi-dimensional)
    if (datasetId === 'water-abstraction') {
      return this._processWaterAbstractionSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for material-flow-indicators dataset (treat as multi-dimensional)
    if (datasetId === 'material-flow-indicators') {
      return this._processMaterialFlowIndicatorsSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for felled-timber-volume dataset (treat as multi-dimensional)
    if (datasetId === 'felled-timber-volume') {
      return this._processFelledTimberVolumeSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for illegal-logging dataset (treat as multi-dimensional)
    if (datasetId === 'illegal-logging') {
      return this._processIllegalLoggingSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for municipal-waste dataset (treat as multi-dimensional)
    if (datasetId === 'municipal-waste') {
      return this._processMunicipalWasteSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for fertilizer-use dataset (treat as multi-dimensional)
    if (datasetId === 'fertilizer-use') {
      return this._processFertilizerUseSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for forest-fires dataset (treat as multi-dimensional)
    if (datasetId === 'forest-fires') {
      return this._processForestFiresSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for forest-planting-recovery dataset (treat as multi-dimensional)
    if (datasetId === 'forest-planting-recovery') {
      return this._processForestPlantingRecoverySpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for energy-intensity dataset (treat as multi-dimensional)
    if (datasetId === 'energy-intensity') {
      return this._processEnergyIntensitySpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for primary-energy-supply dataset (treat as multi-dimensional)
    if (datasetId === 'primary-energy-supply') {
      return this._processPrimaryEnergySupplySpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for final-energy-consumption dataset (treat as multi-dimensional)
    if (datasetId === 'final-energy-consumption') {
      return this._processFinalEnergyConsumptionSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for geological-phenomena dataset (treat as multi-dimensional)
    if (datasetId === 'geological-phenomena') {
      return this._processGeologicalPhenomenaSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for protected-areas-mammals dataset (treat as multi-dimensional with numeric indices)
    if (datasetId === 'protected-areas-mammals') {
      return this._processProtectedAreasMammalsSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for protected-areas-categories dataset (treat as multi-dimensional with numeric indices)
    if (datasetId === 'protected-areas-categories') {
      return this._processProtectedAreasCategoriesSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for protected-areas-birds dataset (treat as multi-dimensional with numeric indices)
    if (datasetId === 'protected-areas-birds') {
      return this._processProtectedAreasBirdsSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for timber-by-cutting-purpose dataset (treat as multi-dimensional with numeric indices)
    if (datasetId === 'timber-by-cutting-purpose') {
      return this._processTimberByCuttingPurposeSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Special handling for atmospheric-precipitation dataset (treat as multi-dimensional with numeric indices)
    if (datasetId === 'atmospheric-precipitation') {
      return this._processAtmosphericPrecipitationSpecial(dataset, years, yearDimId, otherDims, lang);
    }

    // Default processing for other datasets
    // For 3D data, we'll flatten it by creating separate series for each combination
    const allCombinations = this._getAllDimensionCombinations(dataset, otherDims);
    const data = [];

    // Create a row for each year
    years.forEach(year => {
      const row = { year: Number(year) || year };
      
      allCombinations.forEach((combo, index) => {
        const queryObj = { [yearDimId]: year, ...combo.values };
        const cell = dataset.Data(queryObj);
        row[combo.label] = cell ? Number(cell.value) : null;
      });
      
      data.push(row);
    });

    return {
      title: dataset.label || 'Dataset',
      dimensions: [yearDimId, ...otherDims],
      categories: allCombinations.map(combo => combo.label),
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(years),
        dimensionCount: otherDims.length + 1,
        seriesCount: allCombinations.length
      }
    };
  }

  /**
   * Special processing for stationary-source-pollution dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @returns {Object}
   */
  _processStationarySourcePollution(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');
    
    // For 3D data, create separate series for each combination
    const allCombinations = this._getAllDimensionCombinations(dataset, otherDims);
    
    // Filter to keep only "გაფრქვეული" (emitted) combinations
    const emittedCombinations = allCombinations.filter(combo => 
      combo.label.includes('გაფრქვეული')
    );
    
    const data = [];

    // Create a row for each valid year with numeric indices
    validYears.forEach((year, yearIndex) => {
      const row = { year: yearIndex.toString() }; // Convert to numeric index
      
      emittedCombinations.forEach((combo, comboIndex) => {
        const queryObj = { [yearDimId]: year, ...combo.values };
        const cell = dataset.Data(queryObj);
        row[comboIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices
      });
      
      data.push(row);
    });

    return {
      title: dataset.label || 'Dataset',
      dimensions: [yearDimId, ...otherDims],
      categories: emittedCombinations.map((combo, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(validYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: emittedCombinations.length,
        yearMapping: validYears.map((year, index) => ({ index: index.toString(), value: year })), // Provide year mapping
        categoryMapping: emittedCombinations.map((combo, index) => ({ index: index.toString(), label: combo.label })) // Provide category mapping
      }
    };
  }

  /**
   * Special processing for water-abstraction dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @returns {Object}
   */
  _processWaterAbstractionSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');
    
    // Get the categories dimension
    const categoryDim = otherDims.find(dim => dim === 'Categories') || otherDims[0];
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);
    
    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);
    
    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index
      
      categoryValues.forEach((categoryId, categoryIndex) => {
        const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
        const cell = dataset.Data(queryObj);
        row[categoryIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for categories
      });
      
      data.push(row);
    });

    // Calculate actual years for metadata
    const actualYears = validYears.map((year, yearIndex) => {
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    return {
      title: dataset.label || 'წყლის რესურსების დაცვა და გამოყენება',
      dimensions: [yearDimId, categoryDim],
      categories: categoryValues.map((catId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: categoryValues.length,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: categoryValues.map((catId, index) => ({ 
          index: index.toString(), 
          label: categoryLabels[catId] || catId 
        })) // Provide category mapping
      }
    };
  }

  /**
   * Special processing for material-flow-indicators dataset with numeric indices
   */
  _processMaterialFlowIndicatorsSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the indicators dimension
    const indicatorDim = otherDims.find(dim => dim === 'Indicators') || otherDims[0];
    const indicatorValues = dataset.Dimension(indicatorDim).id;
    const indicatorLabels = this._getCategoryLabels(dataset, indicatorDim);

    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      indicatorValues.forEach((indicatorId, indicatorIndex) => {
        const queryObj = { [yearDimId]: year, [indicatorDim]: indicatorId };
        const cell = dataset.Data(queryObj);
        row[indicatorIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for indicators
      });

      // Add calculated field: "სხვა მოპოვება" = "ადგილობრივი მოპოვება" (index 0) - "ბიომასა" (index 1)
      const domesticExtraction = row['0'] || 0;
      const biomass = row['1'] || 0;
      const calculatedIndex = indicatorValues.length; // Next available index
      row[calculatedIndex.toString()] = domesticExtraction - biomass;

      data.push(row);
    });

    // Collect actual years for metadata
    const actualYears = validYears.map(year => {
      let actualYear = Number(year) || year;
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    // Create categories including the calculated field
    const allCategories = indicatorValues.map((indId, index) => index.toString());
    allCategories.push(indicatorValues.length.toString()); // Add calculated field index

    // Create category mapping including the calculated field
    const categoryMapping = indicatorValues.map((indId, index) => ({
      index: index.toString(),
      label: indicatorLabels[indId] || indId
    }));
    
    // Add the calculated field to category mapping with language support
    const calculatedFieldLabel = lang === 'en' 
      ? 'Other extraction (minerals, fossil fuels)'
      : 'სხვა მოპოვება (მინერალები, წიაღისეული საწვავი)';
    
    categoryMapping.push({
      index: indicatorValues.length.toString(),
      label: calculatedFieldLabel
    });

    return {
      title: dataset.label || 'მატერიალური ნაკადების ძირითადი მაჩვენებლები',
      dimensions: [yearDimId, indicatorDim],
      categories: allCategories, // Include calculated field
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: indicatorValues.length + 1, // Include calculated field
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: categoryMapping // Include calculated field mapping
      }
    };
  }

  /**
   * Special processing for municipal-waste dataset with actual years
   */
  _processMunicipalWasteSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the waste categories dimension
    const wasteDim = otherDims[0];
    const wasteValues = dataset.Dimension(wasteDim).id;
    const wasteLabels = this._getCategoryLabels(dataset, wasteDim);

    // Get year values to convert indices to actual years dynamically
    const yearValues = this._getCategoryValues(dataset, yearDimId);
    
    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year values array (dynamic approach)
      let actualYear = Number(year) || year;
      
      // First try dynamic approach
      if (yearValues && yearValues.length > 0 && yearValues[yearIndex]) {
        const yearValue = yearValues[yearIndex];
        const parsedYear = parseInt(yearValue);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      } else {
        // Fallback: Use known municipal waste year range (2015-2022 for indices 0-7)
        // This handles the case where dynamic mapping fails
        const municipalWasteYearStart = 2015;
        if (yearIndex !== undefined && yearIndex >= 0) {
          actualYear = municipalWasteYearStart + yearIndex;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      wasteValues.forEach((wasteId, wasteIndex) => {
        const queryObj = { [yearDimId]: year, [wasteDim]: wasteId };
        const cell = dataset.Data(queryObj);
        row[wasteIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for waste categories
      });

      // Calculate annual growth for "მუნიციპალური ნარჩენი, ათასი ტონა" (index 0)
      const currentMunicipalWaste = row['0'];
      let annualGrowth = null;

      // Only calculate if we have current value and this is not the first year
      if (currentMunicipalWaste !== null && yearIndex > 0) {
        // Get the previous year's value
        const previousYearIndex = validYears[yearIndex - 1];
        const previousQueryObj = { [yearDimId]: previousYearIndex, [wasteDim]: wasteValues[0] };
        const previousCell = dataset.Data(previousQueryObj);
        const previousValue = previousCell ? Number(previousCell.value) : null;

        if (previousValue !== null && previousValue !== 0) {
          // Formula: ((current / previous) * 100) - 100
          annualGrowth = ((currentMunicipalWaste / previousValue) * 100) - 100;
        }
      }

      const calculatedIndex = wasteValues.length; // Next available index
      row[calculatedIndex.toString()] = annualGrowth;

      data.push(row);
    });

    // Collect actual years for metadata using dynamic mapping
    const actualYears = validYears.map((year, yearIndex) => {
      if (yearValues && yearValues[yearIndex]) {
        const yearValue = yearValues[yearIndex];
        const parsedYear = parseInt(yearValue);
        if (!isNaN(parsedYear)) {
          return parsedYear;
        }
      }
      return Number(year) || year;
    });

    // Add calculated field labels
    const annualGrowthLabels = {
      ka: 'ნარჩენების ჯამური რაოდენობის წლიური ზრდა (%)',
      en: 'Annual growth in total waste (%)'
    };

    // Build extended category mapping including calculated field
    const extendedCategoryMapping = wasteValues.map((wasteId, index) => ({
      index: index.toString(),
      label: wasteLabels[wasteId] || wasteId
    }));

    // Add calculated field to category mapping
    const calculatedIndex = wasteValues.length;
    extendedCategoryMapping.push({
      index: calculatedIndex.toString(),
      label: annualGrowthLabels
    });

    // Build extended categories array including calculated field
    const extendedCategories = wasteValues.map((wasteId, index) => index.toString());
    extendedCategories.push(calculatedIndex.toString());

    return {
      title: dataset.label || 'ნაგავსაყრელებზე განთავსებული მუნიციპალური ნარჩენები',
      dimensions: [yearDimId, wasteDim],
      categories: extendedCategories, // Include calculated field
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: wasteValues.length + 1, // Include calculated field
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: extendedCategoryMapping // Include calculated field mapping
      }
    };
  }

  /**
   * Special processing for fertilizer-use dataset with calculated total fertilizer intensity
   */
  _processFertilizerUseSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the fertilizer consumption dimension
    const fertilizerDim = otherDims[0];
    const fertilizerValues = dataset.Dimension(fertilizerDim).id;
    const fertilizerLabels = this._getCategoryLabels(dataset, fertilizerDim);

    // Get year values to convert indices to actual years dynamically
    const yearValues = this._getCategoryValues(dataset, yearDimId);
    
    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year values array (dynamic approach)
      let actualYear = Number(year) || year;
      
      if (yearValues && yearValues[yearIndex]) {
        const yearValue = yearValues[yearIndex];
        const parsedYear = parseInt(yearValue);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      } else {
        // For fertilizer use, if dynamic approach fails, use known mapping (2006-2024)
        actualYear = 2006 + yearIndex;
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      fertilizerValues.forEach((fertilizerId, fertilizerIndex) => {
        const queryObj = { [yearDimId]: year, [fertilizerDim]: fertilizerId };
        const cell = dataset.Data(queryObj);
        row[fertilizerIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for fertilizer categories
      });

      // Calculate total fertilizer intensity using the formula:
      // (Total mineral fertilizers + Total organic fertilizers) / Agricultural area
      const totalMineralFertilizers = row['9']; // "Total consumption of mineral fertilizers, 1000 tons"
      const totalOrganicFertilizers = row['15']; // "Total consumption of organic fertilizers, 1000 tons"
      const agriculturalArea = row['0']; // "Agricultural area, million hectares"
      
      let totalFertilizerIntensity = null;

      // Only calculate if we have all required values
      if (totalMineralFertilizers !== null && totalOrganicFertilizers !== null && 
          agriculturalArea !== null && agriculturalArea !== 0) {
        // Convert agricultural area from million hectares to thousand hectares for consistent units
        // Formula: (mineral + organic fertilizers in 1000 tons) / (agricultural area in million hectares)
        // Result: tons per hectare (since 1000 tons / (million hectares * 1000) = tons/hectare)
        totalFertilizerIntensity = (totalMineralFertilizers + totalOrganicFertilizers) / agriculturalArea;
      }

      const calculatedIndex = fertilizerValues.length; // Next available index
      row[calculatedIndex.toString()] = totalFertilizerIntensity;

      data.push(row);
    });

    // Collect actual years for metadata using dynamic mapping
    const actualYears = validYears.map((year, yearIndex) => {
      if (yearValues && yearValues[yearIndex]) {
        const yearValue = yearValues[yearIndex];
        const parsedYear = parseInt(yearValue);
        if (!isNaN(parsedYear)) {
          return parsedYear;
        }
      }
      return Number(year) || year;
    });

    // Add calculated field labels
    const totalIntensityLabels = {
      ka: 'სასუქების ჯამური ინტენსივობა (ათასი ტონა/კგ ჰექტარი)',
      en: 'Total fertilizer intensity (thousand tons/kg hectares)'
    };

    // Build extended category mapping including calculated field
    const extendedCategoryMapping = fertilizerValues.map((fertilizerId, index) => ({
      index: index.toString(),
      label: fertilizerLabels[fertilizerId] || fertilizerId
    }));

    // Add calculated field to category mapping
    const calculatedIndex = fertilizerValues.length;
    extendedCategoryMapping.push({
      index: calculatedIndex.toString(),
      label: totalIntensityLabels
    });

    // Build extended categories array including calculated field
    const extendedCategories = fertilizerValues.map((fertilizerId, index) => index.toString());
    extendedCategories.push(calculatedIndex.toString());

    return {
      title: dataset.label || 'F-2. სასუქების გამოყენება',
      dimensions: [yearDimId, fertilizerDim],
      categories: extendedCategories, // Include calculated field
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: fertilizerValues.length + 1, // Include calculated field
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: extendedCategoryMapping // Include calculated field mapping
      }
    };
  }

  /**
   * OPTIMIZED: Special processing for forest-fires dataset with actual years
   * ========================================================================
   * Performance optimizations:
   * - Pre-compute region mappings and category combinations
   * - Reduce nested loops and object creation
   * - Cache frequently accessed values
   */
  _processForestFiresSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first (optimized)
    const validYears = years.filter(year => year && String(year).trim() !== '');

    // Pre-compute all required mappings and labels (cached)
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);
    const regionIndexToIdMapping = DataProcessingService.FOREST_FIRES_REGION_MAPPINGS.indexToId;
    const regionCodeMapping = DataProcessingService.FOREST_FIRES_REGION_MAPPINGS.indexToCode;

    // Find dimensions (optimized with early return)
    const regionDim = otherDims.find(dim => dim.toLowerCase().includes('region')) || otherDims[0];
    const categoryDim = otherDims.find(dim => dim.toLowerCase().includes('category')) || otherDims[1];
    
    // Get dimension data once
    const regionValues = dataset.Dimension(regionDim).id;
    const regionLabels = this._getCategoryLabels(dataset, regionDim);
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);

    // Pre-compute region-category key combinations to avoid repeated string concatenation
    const keyCombinations = [];
    const regionMappings = [];
    
    regionValues.forEach((regionId) => {
      const regionMappedId = regionIndexToIdMapping[regionId] || regionId;
      categoryValues.forEach((categoryId) => {
        keyCombinations.push(`${regionMappedId}_${categoryId}`);
        regionMappings.push({ regionId, categoryId, key: `${regionMappedId}_${categoryId}` });
      });
    });

    const data = [];
    const actualYears = []; // Collect years as we process

    // Process each year (optimized loop)
    for (let yearIndex = 0; yearIndex < validYears.length; yearIndex++) {
      const year = validYears[yearIndex];
      const actualYear = this._parseYear(year, yearIndex, yearLabels, 'forest-fires');
      actualYears.push(actualYear);
      
      const row = { year: actualYear };
      let hasData = false;

      // Use pre-computed mappings to reduce nested loops
      for (let i = 0; i < regionMappings.length; i++) {
        const mapping = regionMappings[i];
        const queryObj = { 
          [yearDimId]: year, 
          [regionDim]: mapping.regionId, 
          [categoryDim]: mapping.categoryId 
        };
        
        const cell = dataset.Data(queryObj);
        const value = cell ? Number(cell.value) : null;
        row[mapping.key] = value;
        
        if (value !== null && value !== undefined) {
          hasData = true;
        }
      }

      // Only include years with actual data
      if (hasData) {
        data.push(row);
      }
    }

    // Build final categories and mapping using pre-computed mapping data
    const categories = [];
    
    regionMappings.forEach(mapping => {
      categories.push(mapping.key);
      // Add label information to the mapping
      const regionLabel = regionLabels[mapping.regionId] || mapping.regionId;
      const categoryLabel = categoryLabels[mapping.categoryId] || mapping.categoryId;
      const regionCode = regionCodeMapping[mapping.regionId] || mapping.regionId;
      
      mapping.regionLabel = regionLabel;
      mapping.categoryLabel = categoryLabel;
      mapping.regionCode = regionCode;
      mapping.label = `${regionCode} - ${categoryLabel}`;
    });

    const totalSeries = regionValues.length * categoryValues.length;

    return {
      title: dataset.label || 'ტყისა და ველის ხანძრები რეგიონების მიხედვით',
      dimensions: [yearDimId, regionDim, categoryDim],
      categories: categories, // Use region ID with category suffix as keys
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: totalSeries,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: regionMappings, // Provide detailed category mapping with region IDs
        regionIndexToIdMapping: regionIndexToIdMapping, // Include the region index to ID mapping
        regionCodeMapping: regionCodeMapping // Include the region code mapping for reference
      }
    };
  }

  /**
   * Special processing for felled-timber-volume dataset with numeric indices
   */
  _processFelledTimberVolumeSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the categories dimension (regions, timber types, etc.)
    const categoryDim = otherDims[0]; // Use the first non-year dimension
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);
    
    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels or use hardcoded mapping
      let actualYear = 2010 + yearIndex; // Default mapping starting from 2010
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      categoryValues.forEach((categoryId, categoryIndex) => {
        const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
        const cell = dataset.Data(queryObj);
        row[categoryIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for categories
      });

      data.push(row);
    });

    return {
      title: dataset.label || 'ტყის ჭრით მიღებული ხე-ტყის მოცულობა',
      dimensions: [yearDimId, categoryDim],
      categories: categoryValues.map((catId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(validYears.map((year, index) => {
          // Calculate actual years for yearRange
          let actualYear = 2010 + index;
          if (yearLabels && yearLabels[year]) {
            const yearLabel = yearLabels[year];
            const parsedYear = parseInt(yearLabel);
            if (!isNaN(parsedYear)) {
              actualYear = parsedYear;
            }
          }
          return actualYear;
        })),
        dimensionCount: otherDims.length + 1,
        seriesCount: categoryValues.length,
        yearMapping: validYears.map((year, index) => {
          // Get actual year from labels or use hardcoded mapping
          let actualYear = 2010 + index; // Default mapping starting from 2010
          if (yearLabels && yearLabels[year]) {
            const yearLabel = yearLabels[year];
            const parsedYear = parseInt(yearLabel);
            if (!isNaN(parsedYear)) {
              actualYear = parsedYear;
            }
          }
          return { index: index.toString(), value: actualYear };
        }), // Provide year mapping
        categoryMapping: categoryValues.map((catId, index) => ({
          index: index.toString(),
          label: categoryLabels[catId] || catId
        })) // Provide category mapping
      }
    };
  }

  /**
   * Special processing for illegal-logging dataset with numeric indices
   */
  _processIllegalLoggingSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the categories dimension (regions, violation types, etc.)
    const categoryDim = otherDims[0]; // Use the first non-year dimension
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);
    
    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      categoryValues.forEach((categoryId, categoryIndex) => {
        const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
        const cell = dataset.Data(queryObj);
        row[categoryIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for categories
      });

      data.push(row);
    });

    return {
      title: dataset.label || 'ტყის უკანონო ჭრა',
      dimensions: [yearDimId, categoryDim],
      categories: categoryValues.map((catId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(validYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: categoryValues.length,
        yearMapping: validYears.map((year, index) => {
          // Get actual year from labels
          let actualYear = year;
          if (yearLabels && yearLabels[year]) {
            const yearLabel = yearLabels[year];
            const parsedYear = parseInt(yearLabel);
            if (!isNaN(parsedYear)) {
              actualYear = parsedYear;
            }
          }
          return { index: index.toString(), value: actualYear };
        }), // Provide year mapping
        categoryMapping: categoryValues.map((catId, index) => ({
          index: index.toString(),
          label: categoryLabels[catId] || catId
        })) // Provide category mapping
      }
    };
  }

  /**
   * Special processing for forest-planting-recovery dataset with numeric indices
   */
  _processForestPlantingRecoverySpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // This dataset has 3 dimensions: Regions, Year, and Category
    // We need to handle all dimensions properly
    const regionDim = otherDims.find(dim => dim.toLowerCase().includes('region')) || otherDims[0];
    const categoryDim = otherDims.find(dim => dim.toLowerCase().includes('category')) || otherDims[1];
    
    const regionValues = dataset.Dimension(regionDim).id;
    const regionLabels = this._getCategoryLabels(dataset, regionDim);
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);

    const data = [];
    
    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      let seriesIndex = 0;
      // Combine regions and categories to create series
      regionValues.forEach((regionId) => {
        categoryValues.forEach((categoryId) => {
          const queryObj = { 
            [yearDimId]: year, 
            [regionDim]: regionId, 
            [categoryDim]: categoryId 
          };
          const cell = dataset.Data(queryObj);
          row[seriesIndex.toString()] = cell ? Number(cell.value) : null;
          seriesIndex++;
        });
      });

      data.push(row);
    });

    // Create combined labels for regions and categories
    const combinedLabels = [];
    regionValues.forEach((regionId) => {
      categoryValues.forEach((categoryId) => {
        const regionLabel = regionLabels[regionId] || regionId;
        const categoryLabel = categoryLabels[categoryId] || categoryId;
        combinedLabels.push(`${regionLabel} - ${categoryLabel}`);
      });
    });

    const totalSeries = regionValues.length * categoryValues.length;

    return {
      title: dataset.label || 'ტყის თესვა/დარგვა და ბუნებრივი განახლებისთვის ხელშეწყობა',
      dimensions: [yearDimId, regionDim, categoryDim],
      categories: Array.from({length: totalSeries}, (_, i) => i.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(validYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: totalSeries,
        yearMapping: validYears.map((year, index) => {
          // Get actual year from labels
          let actualYear = year;
          if (yearLabels && yearLabels[year]) {
            const yearLabel = yearLabels[year];
            const parsedYear = parseInt(yearLabel);
            if (!isNaN(parsedYear)) {
              actualYear = parsedYear;
            }
          }
          return { index: index.toString(), value: actualYear };
        }), // Provide year mapping
        categoryMapping: combinedLabels.map((label, index) => ({
          index: index.toString(),
          label: label
        })) // Provide category mapping with combined region-category labels
      }
    };
  }

  /**
   * Process water-use-households dataset with actual years
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @returns {Object}
   */
  _processWaterUseHouseholdsSpecial(dataset, years, yearDimId, otherDims) {
    const catDimId = otherDims[0];
    const catIds = dataset.Dimension(catDimId).id;
    const catLabels = this._getCategoryLabels(dataset, catDimId);
    
    // Directly get the year values from dataset metadata
    // Since years are ["0", "1", "2", ...] and we need [2015, 2016, 2017, ...]
    const yearValueTexts = dataset.Dimension(yearDimId).Category().label;
    
    const rows = years.map((year, index) => {
      // Get the actual year from the valueTexts
      let actualYear = 2015 + index; // Start from 2015 as per metadata
      
      // If we have year labels, try to extract the actual year
      if (yearValueTexts && yearValueTexts[year]) {
        const yearText = yearValueTexts[year];
        const parsedYear = parseInt(yearText);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear };
      
      catIds.forEach(catId => {
        const cell = dataset.Data({ [yearDimId]: year, [catDimId]: catId });
        const label = catLabels[catId] || catId;
        row[label] = cell ? Number(cell.value) : null;
      });
      
      return row;
    });

    // Calculate actual years for yearRange
    const actualYears = years.map((year, index) => {
      if (yearValueTexts && yearValueTexts[year]) {
        const yearText = yearValueTexts[year];
        const parsedYear = parseInt(yearText);
        if (!isNaN(parsedYear)) {
          return parsedYear;
        }
      }
      return 2015 + index; // Default mapping
    });

    return {
      title: dataset.label || 'წყლის გამოყენება შინამეურნეობებში ერთ სულ მოსახლეზე',
      dimensions: [yearDimId, catDimId],
      categories: catIds.map(id => catLabels[id] || id),
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears)
      }
    };
  }

  /**
   * Process sewerage-network-population dataset with actual years
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @returns {Object}
   */
  _processSewerageNetworkPopulationSpecial(dataset, years, yearDimId, otherDims) {
    const catDimId = otherDims[0];
    const catIds = dataset.Dimension(catDimId).id;
    const catLabels = this._getCategoryLabels(dataset, catDimId);
    
    // Directly get the year values from dataset metadata
    // Since years are ["0", "1", "2", ...] and we need [2015, 2016, 2017, ...]
    const yearValueTexts = dataset.Dimension(yearDimId).Category().label;
    
    const rows = years.map((year, index) => {
      // Get the actual year from the valueTexts
      let actualYear = 2015 + index; // Start from 2015 as per metadata
      
      // If we have year labels, try to extract the actual year
      if (yearValueTexts && yearValueTexts[year]) {
        const yearText = yearValueTexts[year];
        const parsedYear = parseInt(yearText);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      
      const row = { year: actualYear };
      
      catIds.forEach(catId => {
        const cell = dataset.Data({ [yearDimId]: year, [catDimId]: catId });
        const label = catLabels[catId] || catId;
        row[label] = cell ? Number(cell.value) : null;
      });
      
      return row;
    });

    // Calculate actual years for yearRange
    const actualYears = years.map((year, index) => {
      if (yearValueTexts && yearValueTexts[year]) {
        const yearText = yearValueTexts[year];
        const parsedYear = parseInt(yearText);
        if (!isNaN(parsedYear)) {
          return parsedYear;
        }
      }
      return 2015 + index; // Default mapping
    });

    // Create year mapping
    const yearMapping = {};
    years.forEach((year, index) => {
      let actualYear = 2015 + index;
      if (yearValueTexts && yearValueTexts[year]) {
        const yearText = yearValueTexts[year];
        const parsedYear = parseInt(yearText);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      yearMapping[year] = actualYear;
    });

    return {
      title: dataset.label || 'წყალარინების ქსელზე მიერთებული მოსახლეობა',
      dimensions: [yearDimId, catDimId],
      categories: catIds.map(id => catLabels[id] || id),
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        yearMapping: yearMapping
      }
    };
  }

  /**
   * Get all combinations of non-year dimensions
   * @param {Object} dataset 
   * @param {Array} otherDims 
   * @returns {Array}
   */
  _getAllDimensionCombinations(dataset, otherDims) {
    const combinations = [];
    
    // Get the dimension data
    const dimData = otherDims.map(dimId => ({
      id: dimId,
      values: dataset.Dimension(dimId).id,
      labels: this._getCategoryLabels(dataset, dimId)
    }));

    // Generate all combinations
    const generateCombos = (index, currentCombo, currentLabel) => {
      if (index === dimData.length) {
        combinations.push({
          values: { ...currentCombo },
          label: currentLabel
        });
        return;
      }

      const currentDim = dimData[index];
      currentDim.values.forEach(valueId => {
        const valueLabel = currentDim.labels[valueId] || valueId;
        const newLabel = currentLabel ? `${currentLabel} - ${valueLabel}` : valueLabel;
        
        generateCombos(index + 1, {
          ...currentCombo,
          [currentDim.id]: valueId
        }, newLabel);
      });
    };

    generateCombos(0, {}, '');
    return combinations;
  }

  /**
   * Get year range from years array
   * @param {Array} years 
   * @returns {Object|null}
   */
  _getYearRange(years) {
    if (years.length === 0) return null;
    const numericYears = years.map(y => Number(y)).filter(y => !isNaN(y));
    if (numericYears.length === 0) return null;
    
    return {
      start: Math.min(...numericYears),
      end: Math.max(...numericYears)
    };
  }

  /**
   * OPTIMIZED: Get category labels for a dimension with caching
   * ==========================================================
   * This method is called frequently, so we cache results to avoid repeated processing.
   * 
   * @param {Object} dataset - JSON-Stat dataset
   * @param {string} catDimId - Category dimension ID
   * @returns {Object} - Category labels mapping
   */
  _getCategoryLabels(dataset, catDimId) {
    if (!catDimId) return {};
    
    // Create cache key from dataset and dimension
    const cacheKey = `${dataset?.label || 'unknown'}_${catDimId}`;
    
    // Check cache first
    if (this._categoryLabelsCache.has(cacheKey)) {
      return this._categoryLabelsCache.get(cacheKey);
    }
    
    // Get labels from dataset
    const category = dataset.Dimension(catDimId).Category();
    const labels = category?.label || {};
    
    // Cache the result (limit cache size to prevent memory issues)
    if (this._categoryLabelsCache.size < 100) {
      this._categoryLabelsCache.set(cacheKey, labels);
    }
    
    return labels;
  }

  /**
   * Get category values (valueTexts) for dynamic year mapping
   * @param {Object} dataset 
   * @param {string} catDimId 
   * @returns {Array}
   */
  _getCategoryValues(dataset, catDimId) {
    if (!catDimId) return [];
    
    try {
      const dimension = dataset.Dimension(catDimId);
      const category = dimension.Category();
      
      // Try multiple approaches to get the actual year values
      if (category?.valueTexts && Array.isArray(category.valueTexts)) {
        return category.valueTexts;
      }
      
      // Fallback: try to get from the dimension itself
      if (dimension?.label && Array.isArray(dimension.label)) {
        return Object.values(dimension.label);
      }
      
      // Another fallback: try category.label values
      if (category?.label && typeof category.label === 'object') {
        return Object.values(category.label);
      }
      
      return [];
    } catch (error) {
      console.log(`Error getting category values for ${catDimId}:`, error);
      return [];
    }
  }

  /**
   * Process metadata for API response
   * @param {Object} metadata 
   * @returns {Object}
   */
  processMetadata(metadata, datasetId = null, lang = 'ka') {
    return {
      title: metadata.title || 'Unknown Dataset',
      variables: metadata.variables?.map(v => {
        // For protected areas datasets, keep the original valueTexts (which should be in the correct language)
        const originalValues = v.values || [];
        let valueTexts = v.valueTexts || [];
        
        // Special handling for material-flow-indicators dataset to add calculated field
        if (datasetId === 'material-flow-indicators' && v.code === 'Indicators') {
          // Add the calculated field to valueTexts based on language
          const calculatedFieldText = lang === 'en' 
            ? 'Other extraction (minerals, fossil fuels)'
            : 'სხვა მოპოვება (მინერალები, წიაღისეული საწვავი)';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }
        
        // Special handling for energy-intensity dataset to add calculated field
        if (datasetId === 'energy-intensity' && v.code === 'Energy intensity') {
          // Add the calculated field to valueTexts based on language
          const calculatedFieldText = lang === 'en' 
            ? 'Annual change, %'
            : 'წლიური ცვლილება, %';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }

        // Special handling for primary-energy-supply dataset to add calculated fields
        if (datasetId === 'primary-energy-supply' && v.code === 'Primary Energy Supply') {
          // Add the first calculated field (renewable energy) to valueTexts based on language
          const renewableFieldText = lang === 'en' 
            ? 'Renewable energy'
            : 'განახლებადი ენერგია';
          
          // Add the second calculated field (other) to valueTexts based on language
          const otherFieldText = lang === 'en' 
            ? 'Other'
            : 'სხვა';
          
          valueTexts = [...valueTexts, renewableFieldText, otherFieldText];
          // Add corresponding values indices
          originalValues.push(originalValues.length.toString());
          originalValues.push(originalValues.length.toString());
        }

        // Special handling for final-energy-consumption dataset to add calculated field
        if (datasetId === 'final-energy-consumption' && v.code === 'Final energy consumption') {
          // Add the calculated field to valueTexts based on language
          const calculatedFieldText = lang === 'en' 
            ? 'Agriculture and other'
            : 'სოფ.მეურნეობა და სხვა';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }

        // Special handling for municipal-waste dataset to add calculated field
        if (datasetId === 'municipal-waste' && v.code === 'Waste') {
          // Add the calculated field to valueTexts based on language
          const calculatedFieldText = lang === 'en' 
            ? 'Annual growth in total waste (%)'
            : 'ნარჩენების ჯამური რაოდენობის წლიური ზრდა (%)';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }

        // Special handling for fertilizer-use dataset to add calculated field
        if (datasetId === 'fertilizer-use' && v.code === 'Fertilizer consumption') {
          // Add the calculated field to valueTexts based on language
          const calculatedFieldText = lang === 'en' 
            ? 'Total fertilizer intensity (thousand tons/Kg hectares)'
            : 'სასუქების ჯამური ინტენსივობა (ათასი ტონა/კგ ჰექტარი)';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }

        // Special handling for atmospheric-precipitation dataset to add calculated field
        if (datasetId === 'atmospheric-precipitation' && v.code === 'Precipitation categories') {
          // Add the calculated field "გადახრა" to valueTexts
          const calculatedFieldText = 'გადახრა';
          
          valueTexts = [...valueTexts, calculatedFieldText];
          // Add corresponding values index
          originalValues.push(originalValues.length.toString());
        }
        
        return {
          code: v.code,
          text: v.text,
          values: originalValues.map((_, index) => index.toString()), // Convert to string indices
          valueTexts: valueTexts, // Include modified valueTexts for material-flow-indicators
          time: v.time || false
        };
      }) || [],
      updated: metadata.updated || null,
      source: metadata.source || null,
      note: metadata.note || null,
      language: metadata.language || lang
    };
  }

  _processGeologicalPhenomenaSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the geological phenomena dimension
    const phenomenaDim = otherDims[0]; // Should be "Geological phenomena"
    const phenomenaValues = dataset.Dimension(phenomenaDim).id;
    const phenomenaLabels = this._getCategoryLabels(dataset, phenomenaDim);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Geological phenomena years mapping: 0->1995, 1->1996, ..., 28->2023
      const actualYear = 1995 + parseInt(year);
      const row = { year: actualYear }; // Use actual year instead of numeric index
      let hasData = false;

      // For each geological phenomenon type, get the data
      phenomenaValues.forEach((phenomenaId) => {
        const queryObj = { 
          [yearDimId]: year, 
          [phenomenaDim]: phenomenaId
        };
        const cell = dataset.Data(queryObj);
        const value = cell ? Number(cell.value) : null;
        
        // Use the phenomenon label as the key
        const phenomenaLabel = phenomenaLabels[phenomenaId] || phenomenaId;
        row[phenomenaLabel] = value;
        
        if (value !== null && value !== undefined) {
          hasData = true;
        }
      });

      // Only include years that have at least some non-null data
      if (hasData) {
        data.push(row);
      }
    });

    // Create series information for the chart
    const series = phenomenaValues.map(value => ({
      key: phenomenaLabels[value] || value,
      name: phenomenaLabels[value] || value,
      dataKey: phenomenaLabels[value] || value
    }));

    return {
      data,
      series,
      xAxisKey: 'year',
      title: dataset.title || 'Geological Phenomena Data'
    };
  }

  /**
   * Special processing for protected-areas-mammals dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @param {string} lang - Language code
   * @returns {Object}
   */
  _processProtectedAreasMammalsSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the mammal species dimension
    const speciesDim = otherDims[0]; // Should be the mammal species dimension
    const speciesValues = dataset.Dimension(speciesDim).id;
    const speciesLabels = this._getCategoryLabels(dataset, speciesDim);

    const data = [];

    // Create a row for each valid year
    validYears.forEach((year, yearIndex) => {
      const row = { year: Number(year) || year }; // Use the year as provided

      // For each mammal species, get the data using numeric indices
      speciesValues.forEach((speciesId, speciesIndex) => {
        const queryObj = { 
          [yearDimId]: year, 
          [speciesDim]: speciesId 
        };
        const cell = dataset.Data(queryObj);
        const value = cell ? Number(cell.value) : null;
        
        // Use numeric index as the key instead of species name
        row[speciesIndex.toString()] = value;
      });

      data.push(row);
    });

    // Calculate actual years for metadata
    const actualYears = validYears.map(year => Number(year) || year);

    return {
      title: dataset.label || 'Protected Areas Mammals',
      dimensions: [yearDimId, speciesDim],
      categories: speciesValues.map((_, index) => index.toString()), // Use numeric indices as categories
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: speciesValues.length,
        categoryMapping: speciesValues.map((speciesId, index) => ({ 
          index: index.toString(), 
          id: speciesId,
          label: speciesLabels[speciesId] || speciesId 
        })) // Provide category mapping for metadata API
      }
    };
  }

  /**
   * Special processing for protected-areas-categories dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @param {string} lang - Language code
   * @returns {Object}
   */
  _processProtectedAreasCategoriesSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the categories dimension
    const categoriesDim = otherDims[0]; // Should be the categories dimension
    const categoriesValues = dataset.Dimension(categoriesDim).id;
    const categoriesLabels = this._getCategoryLabels(dataset, categoriesDim);

    const data = [];

    // Create a row for each valid year
    validYears.forEach((year, yearIndex) => {
      const row = { year: Number(year) || year }; // Use the year as provided

      // For each category, get the data using numeric indices
      categoriesValues.forEach((categoryId, categoryIndex) => {
        const queryObj = { 
          [yearDimId]: year, 
          [categoriesDim]: categoryId 
        };
        const cell = dataset.Data(queryObj);
        const value = cell ? Number(cell.value) : null;
        
        // Use numeric index as the key instead of category name
        row[categoryIndex.toString()] = value;
      });

      data.push(row);
    });

    // Calculate actual years for metadata
    const actualYears = validYears.map(year => Number(year) || year);

    return {
      title: dataset.label || 'Protected Areas Categories',
      dimensions: [yearDimId, categoriesDim],
      categories: categoriesValues.map((_, index) => index.toString()), // Use numeric indices as categories
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: categoriesValues.length,
        categoryMapping: categoriesValues.map((categoryId, index) => ({ 
          index: index.toString(), 
          id: categoryId,
          label: categoriesLabels[categoryId] || categoryId 
        })) // Provide category mapping for metadata API
      }
    };
  }

  /**
   * Special processing for protected-areas-birds dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @param {string} lang - Language code
   * @returns {Object}
   */
  _processProtectedAreasBirdsSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the bird species dimension
    const speciesDim = otherDims[0]; // Should be the bird species dimension
    const speciesValues = dataset.Dimension(speciesDim).id;
    const speciesLabels = this._getCategoryLabels(dataset, speciesDim);

    const data = [];

    // Create a row for each valid year
    validYears.forEach((year, yearIndex) => {
      const row = { year: Number(year) || year }; // Use the year as provided

      // For each bird species, get the data using numeric indices
      speciesValues.forEach((speciesId, speciesIndex) => {
        const queryObj = { 
          [yearDimId]: year, 
          [speciesDim]: speciesId 
        };
        const cell = dataset.Data(queryObj);
        const value = cell ? Number(cell.value) : null;
        
        // Use numeric index as the key instead of species name
        row[speciesIndex.toString()] = value;
      });

      data.push(row);
    });

    // Calculate actual years for metadata
    const actualYears = validYears.map(year => Number(year) || year);

    return {
      title: dataset.label || 'Protected Areas Birds',
      dimensions: [yearDimId, speciesDim],
      categories: speciesValues.map((_, index) => index.toString()), // Use numeric indices as categories
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: speciesValues.length,
        categoryMapping: speciesValues.map((speciesId, index) => ({ 
          index: index.toString(), 
          id: speciesId,
          label: speciesLabels[speciesId] || speciesId 
        })) // Provide category mapping for metadata API
      }
    };
  }

  /**
   * Special processing for timber-by-cutting-purpose dataset with numeric indices
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @param {string} lang - Language code
   * @returns {Object}
   */
  _processTimberByCuttingPurposeSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // This dataset has 3 dimensions: Cutting purpose, Year, Forest Type
    const purposeDim = otherDims.find(dim => dim === 'Cutting purpose') || otherDims[0];
    const forestTypeDim = otherDims.find(dim => dim === 'Forest Type') || otherDims[1];
    
    const purposeValues = dataset.Dimension(purposeDim).id;
    const purposeLabels = this._getCategoryLabels(dataset, purposeDim);
    const forestTypeValues = dataset.Dimension(forestTypeDim).id;
    const forestTypeLabels = this._getCategoryLabels(dataset, forestTypeDim);

    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    const data = [];

    // Create a row for each valid year
    validYears.forEach((year, yearIndex) => {
      // Get the actual year from the year labels
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }

      const row = { year: actualYear }; // Use actual year

      let seriesIndex = 0;
      // Combine cutting purpose and forest type to create series
      purposeValues.forEach((purposeId) => {
        forestTypeValues.forEach((forestTypeId) => {
          const queryObj = { 
            [yearDimId]: year, 
            [purposeDim]: purposeId,
            [forestTypeDim]: forestTypeId
          };
          const cell = dataset.Data(queryObj);
          const value = cell ? Number(cell.value) : null;
          
          // Use numeric index as the key
          row[seriesIndex.toString()] = value;
          seriesIndex++;
        });
      });

      data.push(row);
    });

    // Calculate actual years for metadata
    const actualYears = validYears.map((year, yearIndex) => {
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    // Create combined labels for purpose and forest type
    const combinedLabels = [];
    purposeValues.forEach((purposeId) => {
      forestTypeValues.forEach((forestTypeId) => {
        const purposeLabel = purposeLabels[purposeId] || purposeId;
        const forestTypeLabel = forestTypeLabels[forestTypeId] || forestTypeId;
        combinedLabels.push(`${purposeLabel} - ${forestTypeLabel}`);
      });
    });

    const totalSeries = purposeValues.length * forestTypeValues.length;

    return {
      title: dataset.label || 'Timber by Cutting Purpose',
      dimensions: [yearDimId, purposeDim, forestTypeDim],
      categories: Array.from({length: totalSeries}, (_, i) => i.toString()), // Use numeric indices as categories
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: totalSeries,
        categoryMapping: combinedLabels.map((label, index) => ({ 
          index: index.toString(), 
          label: label 
        })) // Provide category mapping for metadata API
      }
    };
  }

  /**
   * Special processing for atmospheric-precipitation dataset with numeric indices
   * 
   * This dataset has 3 dimensions:
   * - Locations (GEO, TBILISI, SAMEGRELO, KVEMO_KARTLI)
   * - Years (1990-2014)  
   * - Precipitation categories (HISTORICAL_AVG, ANNUAL, DEVIATION, MAX_MONTHLY, MIN_MONTHLY)
   * 
   * Returns numeric indices "0", "1", "2"... instead of category names like "GEO - HISTORICAL_AVG"
   */
  _processAtmosphericPrecipitationSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get dimensions - should be Locations and Precipitation categories
    const locationDim = otherDims.find(dim => dim.toLowerCase().includes('location')) || otherDims[0];
    const precipitationDim = otherDims.find(dim => dim.toLowerCase().includes('precipitation')) || otherDims[1];
    
    const locationValues = dataset.Dimension(locationDim).id;
    const locationLabels = this._getCategoryLabels(dataset, locationDim);
    const precipitationValues = dataset.Dimension(precipitationDim).id;
    const precipitationLabels = this._getCategoryLabels(dataset, precipitationDim);

    const data = [];
    const combinedLabels = [];
    
    // Build combined categories (Location - Precipitation Category)
    let categoryIndex = 0;
    locationValues.forEach(locationId => {
      precipitationValues.forEach(precipitationId => {
        const locationLabel = locationLabels[locationId] || locationId;
        const precipitationLabel = precipitationLabels[precipitationId] || precipitationId;
        combinedLabels.push(`${locationLabel} - ${precipitationLabel}`);
        categoryIndex++;
      });
    });

    // Add "გადახრა" categories for each location
    locationValues.forEach(locationId => {
      const locationLabel = locationLabels[locationId] || locationId;
      combinedLabels.push(`${locationLabel} - გადახრა`);
      categoryIndex++;
    });

    // Get year labels to convert indices to actual years  
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Parse year to get actual year value
      let actualYear = this._parseYear(year, yearIndex, yearLabels, 'atmospheric-precipitation');
      
      const row = { year: actualYear };
      let hasData = false;
      
      // Create data for each location-precipitation combination with numeric indices
      let comboIndex = 0;
      const deviationValues = []; // Store deviation values for calculating "გადახრა"
      
      locationValues.forEach(locationId => {
        precipitationValues.forEach((precipitationId, precipitationIndex) => {
          const queryObj = { 
            [yearDimId]: year, 
            [locationDim]: locationId, 
            [precipitationDim]: precipitationId 
          };
          const cell = dataset.Data(queryObj);
          const value = cell ? Number(cell.value) : null;
          
          // Use numeric index as key instead of combined label
          row[comboIndex.toString()] = value;
          
          // Store deviation values (index 2 = "ნალექის წლიური გადახრა...")
          if (precipitationIndex === 2 && value !== null && value !== undefined) {
            deviationValues.push(value);
          }
          
          if (value !== null && value !== undefined) {
            hasData = true;
          }
          
          comboIndex++;
        });
      });
      
      // Add calculated "გადახრა" values (deviation values minus 1, multiplied by 100, formatted to 2 decimal places)
      deviationValues.forEach(deviationValue => {
        const calculatedValue = (deviationValue - 1) * 100;
        // Format to 2 decimal places and convert back to number
        // const formattedValue = parseFloat(calculatedValue.toFixed(1));
        const formattedValue = Number(calculatedValue.toFixed(1)); // Same as parseFloat()
        row[comboIndex.toString()] = formattedValue;
        comboIndex++;
        hasData = true;
      });
      
      // Only include years with actual data
      if (hasData) {
        data.push(row);
      }
    });

    const actualYears = data.map(row => row.year);
    const totalSeries = (locationValues.length * precipitationValues.length) + locationValues.length; // Original series + გადახრა series

    return {
      title: dataset.label || 'Atmospheric Precipitation',
      dimensions: [yearDimId, locationDim, precipitationDim],
      categories: Array.from({length: totalSeries}, (_, i) => i.toString()), // Use numeric indices as categories
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: totalSeries,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: combinedLabels.map((label, index) => ({ 
          index: index.toString(), 
          label: label 
        })) // Provide category mapping for metadata API
      }
    };
  }

  _processEnergyIntensitySpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the intensity dimension
    const intensityDim = otherDims[0]; // Should be "Energy intensity"
    const intensityValues = dataset.Dimension(intensityDim).id;
    const intensityLabels = this._getCategoryLabels(dataset, intensityDim);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get year labels to convert indices to actual years
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }

      const row = { year: actualYear }; // Use actual year instead of numeric index

      intensityValues.forEach((intensityId, intensityIndex) => {
        const queryObj = { [yearDimId]: year, [intensityDim]: intensityId };
        const cell = dataset.Data(queryObj);
        row[intensityIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices
      });

      // Calculate annual change for "ენერგოინტენსიურობა პირველადი ენერგიის მთლიან მიწოდებაში, ტნე/მლნ. საერ. დოლარი" (index 4)
      const currentValue = row['4'];
      let annualChange = null;

      // Only calculate if we have current value and this is not the first year
      if (currentValue !== null && yearIndex > 0) {
        // Get the previous year's value
        const previousYearIndex = validYears[yearIndex - 1];
        const previousQueryObj = { [yearDimId]: previousYearIndex, [intensityDim]: intensityValues[4] };
        const previousCell = dataset.Data(previousQueryObj);
        const previousValue = previousCell ? Number(previousCell.value) : null;

        if (previousValue !== null && previousValue !== 0) {
          // Formula: ((current / previous) * 100) - 100
          annualChange = ((currentValue / previousValue) * 100) - 100;
        }
      }

      const calculatedIndex = intensityValues.length; // Next available index
      row[calculatedIndex.toString()] = annualChange;

      data.push(row);
    });

    // Collect actual years for metadata
    const actualYears = validYears.map(year => {
      let actualYear = Number(year) || year;
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    // Create categories including the calculated field
    const allCategories = intensityValues.map((intId, index) => index.toString());
    allCategories.push(intensityValues.length.toString()); // Add annual change field index

    // Create category mapping including the calculated field
    const categoryMapping = intensityValues.map((intId, index) => ({
      index: index.toString(),
      label: intensityLabels[intId] || intId
    }));
    
    // Add the calculated field to category mapping with language support
    const calculatedFieldLabel = lang === 'en' 
      ? 'Annual change, %'
      : 'წლიური ცვლილება, %';

    categoryMapping.push({
      index: intensityValues.length.toString(),
      label: calculatedFieldLabel
    });

    return {
      title: dataset.label || 'ენერგოინტენსიურობა',
      dimensions: [yearDimId, intensityDim],
      categories: allCategories, // Include calculated field
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: intensityValues.length + 1, // Include calculated field
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: categoryMapping // Include calculated field mapping
      }
    };
  }

  _processPrimaryEnergySupplySpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the supply dimension
    const supplyDim = otherDims[0]; // Should be "Primary Energy Supply"
    const supplyValues = dataset.Dimension(supplyDim).id;
    const supplyLabels = this._getCategoryLabels(dataset, supplyDim);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get year labels to convert indices to actual years
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }

      const row = { year: actualYear }; // Use actual year instead of numeric index

      supplyValues.forEach((supplyId, supplyIndex) => {
        const queryObj = { [yearDimId]: year, [supplyDim]: supplyId };
        const cell = dataset.Data(queryObj);
        row[supplyIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices
      });

      // Add calculated field 1: "განახლებადი ენერგია" = index 11 + index 12 + index 14
      // Index 11: "ჰიდროენერგიის მიწოდება, 1000 ტნე"
      // Index 12: "გეოთერმული, მზის და სხვა ენერგიის მიწოდება, 1000 ტნე"
      // Index 14: "ბიოსაწვავისა და ნარჩენების მიწოდება, 1000 ტნე"
      const hydro = row['11'] || 0;
      const geothermal = row['12'] || 0;
      const biofuel = row['14'] || 0;
      const renewableIndex = supplyValues.length; // Next available index
      row[renewableIndex.toString()] = hydro + geothermal + biofuel;

      // Add calculated field 2: "სხვა" = index 7 + index 13
      // Index 7: "ნედლი ნავთობის მიწოდება, 1000 ტნე"
      // Index 13: "ელექტროენერგიის მიწოდება, 1000 ტნე"
      const crudeOil = row['7'] || 0;
      const electricity = row['13'] || 0;
      const otherIndex = supplyValues.length + 1; // Next available index after renewable
      row[otherIndex.toString()] = crudeOil + electricity;

      data.push(row);
    });

    // Collect actual years for metadata
    const actualYears = validYears.map(year => {
      let actualYear = Number(year) || year;
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    // Create categories including the calculated fields
    const allCategories = supplyValues.map((supId, index) => index.toString());
    allCategories.push(supplyValues.length.toString()); // Add renewable energy field index
    allCategories.push((supplyValues.length + 1).toString()); // Add other field index

    // Create category mapping including the calculated fields
    const categoryMapping = supplyValues.map((supId, index) => ({
      index: index.toString(),
      label: supplyLabels[supId] || supId
    }));
    
    // Add the first calculated field to category mapping with language support
    const renewableFieldLabel = lang === 'en' 
      ? 'Renewable energy'
      : 'განახლებადი ენერგია';
    
    categoryMapping.push({
      index: supplyValues.length.toString(),
      label: renewableFieldLabel
    });

    // Add the second calculated field to category mapping with language support
    const otherFieldLabel = lang === 'en' 
      ? 'Other'
      : 'სხვა';
    
    categoryMapping.push({
      index: (supplyValues.length + 1).toString(),
      label: otherFieldLabel
    });

    return {
      title: dataset.label || 'პირველადი ენერგიის ჯამური მიწოდება',
      dimensions: [yearDimId, supplyDim],
      categories: allCategories, // Include calculated fields
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: supplyValues.length + 2, // Include both calculated fields
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: categoryMapping // Include calculated fields mapping
      }
    };
  }

  _processFinalEnergyConsumptionSpecial(dataset, years, yearDimId, otherDims, lang = 'ka') {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the consumption dimension
    const consumptionDim = otherDims[0]; // Should be "Final energy consumption"
    const consumptionValues = dataset.Dimension(consumptionDim).id;
    const consumptionLabels = this._getCategoryLabels(dataset, consumptionDim);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Get year labels to convert indices to actual years
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      let actualYear = Number(year) || year;
      
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }

      const row = { year: actualYear }; // Use actual year instead of numeric index

      consumptionValues.forEach((consumptionId, consumptionIndex) => {
        const queryObj = { [yearDimId]: year, [consumptionDim]: consumptionId };
        const cell = dataset.Data(queryObj);
        row[consumptionIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices
      });

      // Add calculated field: "სოფ.მეურნეობა და სხვა" = index 9 + index 11
      // Index 9: "სოფლის მეურნეობა, სატყეო მეურნეობა და თევზჭერა, ათასი ტნე"
      // Index 11: "სხვა, ათასი ტნე"
      const agriculture = row['9'] || 0;
      const other = row['11'] || 0;
      const calculatedIndex = consumptionValues.length; // Next available index
      row[calculatedIndex.toString()] = agriculture + other;

      data.push(row);
    });

    // Collect actual years for metadata
    const actualYears = validYears.map(year => {
      let actualYear = Number(year) || year;
      const yearLabels = this._getCategoryLabels(dataset, yearDimId);
      if (yearLabels && yearLabels[year]) {
        const yearLabel = yearLabels[year];
        const parsedYear = parseInt(yearLabel);
        if (!isNaN(parsedYear)) {
          actualYear = parsedYear;
        }
      }
      return actualYear;
    });

    // Create categories including the calculated field
    const allCategories = consumptionValues.map((consId, index) => index.toString());
    allCategories.push(consumptionValues.length.toString()); // Add calculated field index

    // Create category mapping including the calculated field
    const categoryMapping = consumptionValues.map((consId, index) => ({
      index: index.toString(),
      label: consumptionLabels[consId] || consId
    }));
    
    // Add the calculated field to category mapping with language support
    const calculatedFieldLabel = lang === 'en' 
      ? 'Agriculture and other'
      : 'სოფ.მეურნეობა და სხვა';
    
    categoryMapping.push({
      index: consumptionValues.length.toString(),
      label: calculatedFieldLabel
    });

    return {
      title: dataset.label || 'ენერგიის საბოლოო მოხმარება',
      dimensions: [yearDimId, consumptionDim],
      categories: allCategories, // Include calculated field
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: consumptionValues.length + 1, // Include calculated field
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: categoryMapping // Include calculated field mapping
      }
    };
  }

  /**
   * HELPER METHOD: Universal year parsing with 4-tier fallback strategy
   * ===================================================================
   * 
   * This method centralizes all year parsing logic to ensure consistency across datasets.
   * It tries multiple strategies in order of reliability to extract actual years.
   * 
   * STRATEGY BREAKDOWN:
   * 1. Direct conversion: "2023" → 2023 (most reliable)
   * 2. Label parsing: yearLabels["0"] = "2023" → 2023 (dataset-provided)
   * 3. Configuration mapping: DATASET_YEAR_MAPPINGS["forest-fires"]["0"] = 2017 (configured)
   * 4. Sequential fallback: 2017 + index (last resort)
   * 
   * MAINTENANCE NOTES:
   * - Add new datasets to DATASET_YEAR_MAPPINGS instead of modifying this method
   * - Update fallback start year (2017) only if globally appropriate
   * - Test with: console.log('Parsed year:', result, 'from input:', year)
   * 
   * USAGE EXAMPLES:
   * - _parseYear("2023", 0, {}, null) → 2023 (direct)
   * - _parseYear("0", 0, {"0": "2023"}, null) → 2023 (label)
   * - _parseYear("0", 0, {}, "forest-fires") → 2017 (config)
   * - _parseYear("abc", 5, {}, null) → 2022 (fallback: 2017 + 5)
   * 
   * @param {string|number} year - Year identifier from dataset (could be index or actual year)
   * @param {number} yearIndex - Sequential position of this year in the dataset (0-based)
   * @param {Object} yearLabels - Year labels from dataset (yearId → yearText mapping)
   * @param {string} datasetId - Dataset identifier for configuration lookup
   * @returns {number} - Actual year as integer (e.g., 2023)
   */
  _parseYear(year, yearIndex, yearLabels = {}, datasetId = null) {
    // Create cache key for this specific year parsing request
    const cacheKey = `${year}_${yearIndex}_${datasetId || 'none'}`;
    
    // Check cache first
    if (this._yearCache.has(cacheKey)) {
      return this._yearCache.get(cacheKey);
    }
    
    let result;
    
    // STRATEGY 1: Try direct number conversion (e.g., "2023" → 2023) - fastest path
    const directYear = Number(year);
    if (this._isValidYear(directYear)) {
      result = directYear;
    }
    // STRATEGY 2: Try year labels from dataset (e.g., yearLabels["0"] = "2023")
    else if (yearLabels?.[year]) {
      const labelYear = parseInt(yearLabels[year]);
      if (this._isValidYear(labelYear)) {
        result = labelYear;
      }
    }
    // STRATEGY 3: Dataset-specific mapping from configuration (pre-check for faster access)
    else if (datasetId && DataProcessingService.DATASET_YEAR_MAPPINGS[datasetId]?.[year]) {
      result = DataProcessingService.DATASET_YEAR_MAPPINGS[datasetId][year];
    }
    // STRATEGY 4: Sequential fallback (last resort)
    else {
      result = 2017 + yearIndex;
    }
    
    // Cache the result (limit cache size)
    if (this._yearCache.size < 200) {
      this._yearCache.set(cacheKey, result);
    }
    
    return result;
  }

  /**
   * HELPER METHOD: Year validation utility
   * =====================================
   * 
   * Validates if a parsed number represents a reasonable year.
   * Prevents invalid years from being used in processing.
   * 
   * VALIDATION RANGE: 1900-3000 (adjustable for future datasets)
   * 
   * @param {number} year - Year to validate
   * @returns {boolean} - True if year is valid and reasonable
   */
  _isValidYear(year) {
    return !isNaN(year) && year > 1900 && year < 3000;
  }

  /**
   * HELPER METHOD: Standardized category mapping creation
   * ====================================================
   * 
   * Creates consistent category mapping structure for datasets that use numeric indices.
   * This ensures all datasets return the same metadata format for frontend consumption.
   * 
   * OUTPUT FORMAT:
   * [
   *   { index: "0", id: "originalId", label: "Original Label" },
   *   { index: "1", id: "anotherId", label: "Another Label" }
   * ]
   * 
   * MAINTENANCE NOTES:
   * - Use this method instead of creating mappings manually
   * - Consistent structure helps frontend handle all datasets uniformly
   * - Add logging parameter if debugging category issues
   * 
   * @param {Array} categoryIds - Original category IDs from dataset
   * @param {Object} categoryLabels - Category labels mapping (id → label)
   * @param {string} datasetId - Dataset identifier for logging/debugging
   * @returns {Array} - Standardized category mapping array
   */
  _createNumericCategoryMapping(categoryIds, categoryLabels, datasetId) {
    const mapping = categoryIds.map((categoryId, index) => ({
      index: index.toString(),
      id: categoryId,
      label: categoryLabels[categoryId] || categoryId
    }));
    
    this._logProcessing(datasetId, `Created category mapping for ${categoryIds.length} categories`);
    return mapping;
  }

  /**
   * HELPER METHOD: Development logging utility
   * =========================================
   * 
   * Provides consistent logging for debugging dataset processing issues.
   * Only active in development environment to avoid production noise.
   * 
   * LOG FORMAT: [DataProcessing:dataset-id] message {data}
   * 
   * USAGE:
   * - Processor routing decisions
   * - Year parsing outcomes  
   * - Configuration lookups
   * - Error conditions
   * 
   * MAINTENANCE NOTES:
   * - Use this instead of console.log directly
   * - Include datasetId and meaningful message
   * - Add relevant data object for complex debugging
   * 
   * @param {string} datasetId - Dataset identifier for context
   * @param {string} message - Descriptive log message
   * @param {Object} data - Additional data to include in log
   */
  _logProcessing(datasetId, message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logPrefix = `[DataProcessing:${datasetId || 'unknown'}]`;
      const hasData = Object.keys(data).length > 0;
      console.log(`${logPrefix} ${message}${hasData ? '' : ''}`, hasData ? data : '');
    }
  }
}

export default new DataProcessingService();
