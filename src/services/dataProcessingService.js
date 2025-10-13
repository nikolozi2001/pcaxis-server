/**
 * Data Processing Service
 * Handles data transformation and formatting
 */
export class DataProcessingService {
  /**
   * Process dataset into chart-friendly format
   * @param {Object} dataset - JSON-Stat dataset
   * @param {string} datasetId - Dataset identifier for special handling
   * @param {string} lang - Language code ('ka' or 'en')
   * @returns {Object} - Processed data for charts
   */
  processForChart(dataset, datasetId = null, lang = 'ka') {
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
    } else if (otherDims.length === 1 && datasetId !== 'water-abstraction' && datasetId !== 'material-flow-indicators' && datasetId !== 'felled-timber-volume' && datasetId !== 'illegal-logging' && datasetId !== 'forest-planting-recovery' && datasetId !== 'municipal-waste' && datasetId !== 'geological-phenomena' && datasetId !== 'final-energy-consumption' && datasetId !== 'primary-energy-supply' && datasetId !== 'energy-intensity') {
      // Two dimensions (years + one category) - except for special datasets that need numeric indices
      return this._processTwoDimensions(dataset, years, yearDimId, otherDims[0]);
    } else {
      // Three or more dimensions (complex multi-dimensional data) OR datasets requiring numeric indices
      return this._processMultiDimensions(dataset, years, yearDimId, otherDims, datasetId, lang);
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

    // Get year labels to convert indices to actual years
    const yearLabels = this._getCategoryLabels(dataset, yearDimId);
    
    const data = [];

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

    // Collect actual years for metadata using the same mapping
    const actualYears = validYears.map(year => {
      const yearMappings = {
        '0': 2015, '1': 2016, '2': 2017, '3': 2018, 
        '4': 2019, '5': 2020, '6': 2021, '7': 2022
      };
      return yearMappings[year] || year;
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
}

export default new DataProcessingService();
