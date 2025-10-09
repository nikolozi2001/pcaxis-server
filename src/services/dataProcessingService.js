/**
 * Data Processing Service
 * Handles data transformation and formatting
 */
export class DataProcessingService {
  /**
   * Process dataset into chart-friendly format
   * @param {Object} dataset - JSON-Stat dataset
   * @param {string} datasetId - Dataset identifier for special handling
   * @returns {Object} - Processed data for charts
   */
  processForChart(dataset, datasetId = null) {
    const dimIds = dataset.id;
    const yearDimId = this._findYearDimension(dimIds);
    const otherDims = dimIds.filter(d => d !== yearDimId);
    
    const years = dataset.Dimension(yearDimId).id;
    
    // Handle different data structures
    if (otherDims.length === 0) {
      // Single dimension (only years)
      return this._processSingleDimension(dataset, years, yearDimId);
    } else if (datasetId === 'water-use-households') {
      // Special handling for water-use-households to use actual years
      return this._processWaterUseHouseholdsSpecial(dataset, years, yearDimId, otherDims);
    } else if (datasetId === 'sewerage-network-population') {
      // Special handling for sewerage-network-population to use actual years
      return this._processSewerageNetworkPopulationSpecial(dataset, years, yearDimId, otherDims);
    } else if (otherDims.length === 1 && datasetId !== 'water-abstraction' && datasetId !== 'material-flow-indicators' && datasetId !== 'felled-timber-volume' && datasetId !== 'illegal-logging' && datasetId !== 'forest-planting-recovery' && datasetId !== 'municipal-waste' && datasetId !== 'geological-phenomena') {
      // Two dimensions (years + one category) - except for special datasets that need numeric indices
      return this._processTwoDimensions(dataset, years, yearDimId, otherDims[0]);
    } else {
      // Three or more dimensions (complex multi-dimensional data) OR datasets requiring numeric indices
      return this._processMultiDimensions(dataset, years, yearDimId, otherDims, datasetId);
    }
  }

  /**
   * Find the year/time dimension
   * @param {Array} dimIds 
   * @returns {string}
   */
  _findYearDimension(dimIds) {
    return dimIds.find(d => /year|წელი|vuosi|anio|time|dato/i.test(d)) || dimIds[0];
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
  _processMultiDimensions(dataset, years, yearDimId, otherDims, datasetId = null) {
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
      return this._processMaterialFlowIndicatorsSpecial(dataset, years, yearDimId, otherDims);
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
      return this._processMunicipalWasteSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for forest-fires dataset (treat as multi-dimensional)
    if (datasetId === 'forest-fires') {
      return this._processForestFiresSpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for forest-planting-recovery dataset (treat as multi-dimensional)
    if (datasetId === 'forest-planting-recovery') {
      return this._processForestPlantingRecoverySpecial(dataset, years, yearDimId, otherDims);
    }

    // Special handling for geological-phenomena dataset (treat as multi-dimensional)
    if (datasetId === 'geological-phenomena') {
      return this._processGeologicalPhenomenaSpecial(dataset, years, yearDimId, otherDims);
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
    
    const data = [];

    // Create a row for each valid year with numeric indices
    validYears.forEach((year, yearIndex) => {
      const row = { year: yearIndex.toString() }; // Convert year to numeric index
      
      categoryValues.forEach((categoryId, categoryIndex) => {
        const queryObj = { [yearDimId]: year, [categoryDim]: categoryId };
        const cell = dataset.Data(queryObj);
        row[categoryIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for categories
      });
      
      data.push(row);
    });

    return {
      title: dataset.label || 'წყლის რესურსების დაცვა და გამოყენება',
      dimensions: [yearDimId, categoryDim],
      categories: categoryValues.map((catId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(validYears),
        dimensionCount: otherDims.length + 1,
        seriesCount: categoryValues.length,
        yearMapping: validYears.map((year, index) => ({ index: index.toString(), value: year })), // Provide year mapping
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
  _processMaterialFlowIndicatorsSpecial(dataset, years, yearDimId, otherDims) {
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

    return {
      title: dataset.label || 'მატერიალური ნაკადების ძირითადი მაჩვენებლები',
      dimensions: [yearDimId, indicatorDim],
      categories: indicatorValues.map((indId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: indicatorValues.length,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: indicatorValues.map((indId, index) => ({
          index: index.toString(),
          label: indicatorLabels[indId] || indId
        })) // Provide indicator mapping
      }
    };
  }

  /**
   * Special processing for municipal-waste dataset with actual years
   */
  _processMunicipalWasteSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // Get the waste categories dimension
    const wasteDim = otherDims[0];
    const wasteValues = dataset.Dimension(wasteDim).id;
    const wasteLabels = this._getCategoryLabels(dataset, wasteDim);

    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Municipal waste years mapping: 0->2015, 1->2016, 2->2017, 3->2018, 4->2019, 5->2020, 6->2021, 7->2022
      const yearMappings = {
        '0': 2015, '1': 2016, '2': 2017, '3': 2018, 
        '4': 2019, '5': 2020, '6': 2021, '7': 2022
      };
      
      let actualYear = yearMappings[year] || year;
      
      const row = { year: actualYear }; // Use actual year instead of numeric index

      wasteValues.forEach((wasteId, wasteIndex) => {
        const queryObj = { [yearDimId]: year, [wasteDim]: wasteId };
        const cell = dataset.Data(queryObj);
        row[wasteIndex.toString()] = cell ? Number(cell.value) : null; // Use numeric indices for waste categories
      });

      data.push(row);
    });

    // Collect actual years for metadata using the same mapping
    const actualYears = validYears.map(year => {
      const yearMappings = {
        '0': 2015, '1': 2016, '2': 2017, '3': 2018, 
        '4': 2019, '5': 2020, '6': 2021, '7': 2022
      };
      return yearMappings[year] || year;
    });

    return {
      title: dataset.label || 'ნაგავსაყრელებზე განთავსებული მუნიციპალური ნარჩენები',
      dimensions: [yearDimId, wasteDim],
      categories: wasteValues.map((wasteId, index) => index.toString()), // Use numeric indices
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: wasteValues.length,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: wasteValues.map((wasteId, index) => ({
          index: index.toString(),
          label: wasteLabels[wasteId] || wasteId
        })) // Provide waste category mapping
      }
    };
  }

  /**
   * Special processing for forest-fires dataset with actual years
   */
  _processForestFiresSpecial(dataset, years, yearDimId, otherDims) {
    // Filter out empty years first
    const validYears = years.filter(year => year && year.toString().trim() !== '');

    // This dataset has 3 dimensions: Year, Regions, and Category
    const regionDim = otherDims.find(dim => dim.toLowerCase().includes('region')) || otherDims[0];
    const categoryDim = otherDims.find(dim => dim.toLowerCase().includes('category')) || otherDims[1];
    
    const regionValues = dataset.Dimension(regionDim).id;
    const regionLabels = this._getCategoryLabels(dataset, regionDim);
    const categoryValues = dataset.Dimension(categoryDim).id;
    const categoryLabels = this._getCategoryLabels(dataset, categoryDim);

    const data = [];

    // Create a row for each valid year with actual years
    validYears.forEach((year, yearIndex) => {
      // Forest fires years mapping: 0->2017, 1->2018, 2->2019, 3->2020, 4->2021, 5->2022, 6->2023
      const yearMappings = {
        '0': 2017, '1': 2018, '2': 2019, '3': 2020, 
        '4': 2021, '5': 2022, '6': 2023
      };
      
      let actualYear = yearMappings[year] || year;
      const row = { year: actualYear }; // Use actual year instead of numeric index
      let hasData = false;

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
          const value = cell ? Number(cell.value) : null;
          
          // Create combined label for region-category combination
          const regionLabel = regionLabels[regionId] || regionId;
          const categoryLabel = categoryLabels[categoryId] || categoryId;
          row[`${seriesIndex} - ${categoryId}`] = value;
          
          if (value !== null && value !== undefined) {
            hasData = true;
          }
          seriesIndex++;
        });
      });

      // Only include years that have at least some non-null data
      if (hasData) {
        data.push(row);
      }
    });

    // Collect actual years for metadata using the same mapping (only for years with data)
    const yearMappings = {
      '0': 2017, '1': 2018, '2': 2019, '3': 2020, 
      '4': 2021, '5': 2022, '6': 2023
    };
    const actualYears = data.map(row => row.year);

    // Create combined labels for regions and categories
    const combinedLabels = [];
    regionValues.forEach((regionId) => {
      categoryValues.forEach((categoryId) => {
        const regionLabel = regionLabels[regionId] || regionId;
        const categoryLabel = categoryLabels[categoryId] || categoryId;
        combinedLabels.push(`${regionId} - ${categoryId}`);
      });
    });

    return {
      title: dataset.label || 'ტყისა და ველის ხანძრები რეგიონების მიხედვით',
      dimensions: [yearDimId, regionDim, categoryDim],
      categories: combinedLabels,
      data: data,
      metadata: {
        totalRecords: data.length,
        hasCategories: true,
        yearRange: this._getYearRange(actualYears), // Use actual years for range
        dimensionCount: otherDims.length + 1,
        seriesCount: combinedLabels.length,
        yearMapping: actualYears.map((actualYear, index) => ({ index: index.toString(), value: actualYear })), // Use actual years in mapping
        categoryMapping: combinedLabels.map((label, index) => ({
          index: index.toString(),
          label: label
        })) // Provide category mapping
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
   * Get category labels for a dimension
   * @param {Object} dataset 
   * @param {string} catDimId 
   * @returns {Object}
   */
  _getCategoryLabels(dataset, catDimId) {
    if (!catDimId) return {};
    
    const category = dataset.Dimension(catDimId).Category();
    return category?.label || {};
  }

  /**
   * Process metadata for API response
   * @param {Object} metadata 
   * @returns {Object}
   */
  processMetadata(metadata) {
    return {
      title: metadata.title || 'Unknown Dataset',
      variables: metadata.variables?.map(v => {
        // For protected areas datasets, keep the original valueTexts (which should be in the correct language)
        const originalValues = v.values || [];
        return {
          code: v.code,
          text: v.text,
          values: originalValues.map((_, index) => index.toString()), // Convert to string indices
          valueTexts: v.valueTexts || [], // Keep original valueTexts from PXWeb API
          time: v.time || false
        };
      }) || [],
      updated: metadata.updated || null,
      source: metadata.source || null,
      note: metadata.note || null,
      language: metadata.language || 'ka'
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
}

export default new DataProcessingService();
