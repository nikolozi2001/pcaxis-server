/**
 * Data Processing Service
 * Handles data transformation and formatting
 */
export class DataProcessingService {
  /**
   * Process dataset into chart-friendly format
   * @param {Object} dataset - JSON-Stat dataset
   * @returns {Object} - Processed data for charts
   */
  processForChart(dataset) {
    const dimIds = dataset.id;
    const yearDimId = this._findYearDimension(dimIds);
    const otherDims = dimIds.filter(d => d !== yearDimId);
    
    const years = dataset.Dimension(yearDimId).id;
    
    // Handle different data structures
    if (otherDims.length === 0) {
      // Single dimension (only years)
      return this._processSingleDimension(dataset, years, yearDimId);
    } else if (otherDims.length === 1) {
      // Two dimensions (years + one category)
      return this._processTwoDimensions(dataset, years, yearDimId, otherDims[0]);
    } else {
      // Three or more dimensions (complex multi-dimensional data)
      return this._processMultiDimensions(dataset, years, yearDimId, otherDims);
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
    
    const rows = years.map(year => {
      const row = { year: Number(year) || year };
      
      catIds.forEach(catId => {
        const cell = dataset.Data({ [yearDimId]: year, [catDimId]: catId });
        const label = catLabels[catId] || catId;
        row[label] = cell ? Number(cell.value) : null;
      });
      
      return row;
    });

    return {
      title: dataset.label || 'Dataset',
      dimensions: [yearDimId, catDimId],
      categories: catIds.map(id => catLabels[id] || id),
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: true,
        yearRange: this._getYearRange(years)
      }
    };
  }

  /**
   * Process multi-dimensional data (3+ dimensions)
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} otherDims 
   * @returns {Object}
   */
  _processMultiDimensions(dataset, years, yearDimId, otherDims) {
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
      variables: metadata.variables?.map(v => ({
        code: v.code,
        text: v.text,
        values: v.values,
        valueTexts: v.valueTexts,
        time: v.time || false
      })) || [],
      updated: metadata.updated || null,
      source: metadata.source || null,
      note: metadata.note || null
    };
  }
}

export default new DataProcessingService();
