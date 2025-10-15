/**
 * Smart Error Recovery System
 * Handles failures gracefully with automatic retry and fallback mechanisms
 */

class ErrorRecoveryService {
  constructor() {
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2
    };
    
    this.fallbackData = new Map();
    this.errorStats = new Map();
  }

  /**
   * Execute operation with intelligent retry logic
   */
  async executeWithRetry(operation, context = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Reset error count on success
        if (this.errorStats.has(context.datasetId)) {
          this.errorStats.delete(context.datasetId);
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        this.recordError(context.datasetId, error, attempt);
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          break;
        }
        
        // Don't retry on last attempt
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
          this.retryConfig.maxDelay
        );
        
        console.warn(`⚠️  Attempt ${attempt} failed for ${context.datasetId || 'unknown'}, retrying in ${delay}ms...`);
        await this.sleep(delay);
      }
    }
    
    // All retries failed, try fallback
    return this.handleFallback(context, lastError);
  }

  /**
   * Store fallback data for datasets
   */
  storeFallbackData(datasetId, data) {
    this.fallbackData.set(datasetId, {
      data: data,
      timestamp: Date.now(),
      version: '1.0'
    });
    console.log(`💾 Stored fallback data for ${datasetId}`);
  }

  /**
   * Handle fallback when all retries fail
   */
  async handleFallback(context, originalError) {
    const { datasetId } = context;
    
    // Try cached/fallback data
    if (this.fallbackData.has(datasetId)) {
      const fallback = this.fallbackData.get(datasetId);
      const age = Date.now() - fallback.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (age < maxAge) {
        console.log(`📦 Using fallback data for ${datasetId} (age: ${Math.round(age / 60000)}min)`);
        return {
          ...fallback.data,
          metadata: {
            ...fallback.data.metadata,
            isFallback: true,
            fallbackAge: age,
            originalError: originalError.message
          }
        };
      }
    }
    
    // Generate synthetic response for critical datasets
    if (this.isCriticalDataset(datasetId)) {
      return this.generateEmergencyResponse(datasetId, originalError);
    }
    
    // Re-throw the original error
    throw originalError;
  }

  /**
   * Generate emergency response for critical datasets
   */
  generateEmergencyResponse(datasetId, error) {
    console.warn(`🚨 Generating emergency response for critical dataset: ${datasetId}`);
    
    return {
      title: `${datasetId} (Service Temporarily Unavailable)`,
      categories: [],
      data: [],
      metadata: {
        totalRecords: 0,
        hasCategories: false,
        isEmergencyResponse: true,
        error: error.message,
        message: 'This dataset is temporarily unavailable. Please try again later.',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Check if error should not be retried
   */
  isNonRetryableError(error) {
    const nonRetryablePatterns = [
      /404/i,                    // Not Found
      /401/i,                    // Unauthorized  
      /403/i,                    // Forbidden
      /invalid.*dataset/i,       // Invalid dataset
      /malformed.*request/i      // Malformed request
    ];
    
    return nonRetryablePatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.code)
    );
  }

  /**
   * Check if dataset is critical and needs emergency response
   */
  isCriticalDataset(datasetId) {
    const criticalDatasets = [
      'air-quality-tbilisi',
      'air-quality-batumi', 
      'air-quality-kutaisi',
      'forest-fires'
    ];
    return criticalDatasets.includes(datasetId);
  }

  /**
   * Record error statistics
   */
  recordError(datasetId, error, attempt) {
    if (!datasetId) return;
    
    if (!this.errorStats.has(datasetId)) {
      this.errorStats.set(datasetId, []);
    }
    
    this.errorStats.get(datasetId).push({
      error: error.message,
      attempt: attempt,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
    
    // Keep only last 10 errors per dataset
    const errors = this.errorStats.get(datasetId);
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }
  }

  /**
   * Get error statistics for monitoring
   */
  getErrorStats(datasetId = null) {
    if (datasetId) {
      return this.errorStats.get(datasetId) || [];
    }
    return Object.fromEntries(this.errorStats);
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ErrorRecoveryService();