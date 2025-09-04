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
    
    // Handle categorical dimensions (like Gender)
    const catDimId = otherDims[0];
    const catIds = catDimId ? dataset.Dimension(catDimId).id : [];
    const catLabels = this._getCategoryLabels(dataset, catDimId);
    
    const rows = this._buildDataRows(dataset, years, yearDimId, catIds, catDimId, catLabels);
    
    return {
      title: dataset.label || 'Dataset',
      dimensions: dimIds,
      categories: catIds.map(id => catLabels[id] || id),
      data: rows,
      metadata: {
        totalRecords: rows.length,
        hasCategories: catIds.length > 0,
        yearRange: years.length > 0 ? {
          start: Math.min(...years.map(y => Number(y) || 0)),
          end: Math.max(...years.map(y => Number(y) || 0))
        } : null
      }
    };
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
   * Build data rows for the processed dataset
   * @param {Object} dataset 
   * @param {Array} years 
   * @param {string} yearDimId 
   * @param {Array} catIds 
   * @param {string} catDimId 
   * @param {Object} catLabels 
   * @returns {Array}
   */
  _buildDataRows(dataset, years, yearDimId, catIds, catDimId, catLabels) {
    return years.map(year => {
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
