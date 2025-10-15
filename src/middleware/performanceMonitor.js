/**
 * Performance Monitoring Middleware
 * Tracks API response times and performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.slowQueryThreshold = 1000; // 1 second
  }

  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      const originalSend = res.send;
      
      res.send = function(data) {
        const duration = Date.now() - startTime;
        const endpoint = `${req.method} ${req.route?.path || req.path}`;
        
        // Log performance metrics
        console.log(`⚡ ${endpoint} - ${duration}ms`);
        
        // Track slow queries
        if (duration > this.slowQueryThreshold) {
          console.warn(`🐌 SLOW QUERY: ${endpoint} took ${duration}ms`);
        }
        
        // Store metrics for analysis
        const key = `${req.params?.id || 'general'}-${req.query?.lang || 'ka'}`;
        if (!this.metrics.has(key)) {
          this.metrics.set(key, []);
        }
        this.metrics.get(key).push({
          endpoint,
          duration,
          timestamp: new Date().toISOString(),
          cached: res.getHeader('X-Cache-Hit') === 'true'
        });
        
        // Add performance headers
        res.setHeader('X-Response-Time', `${duration}ms`);
        res.setHeader('X-Performance-Optimized', 'true');
        
        return originalSend.call(this, data);
      }.bind(this);
      
      next();
    };
  }

  getMetrics(datasetId = null) {
    if (datasetId) {
      return this.metrics.get(datasetId) || [];
    }
    return Object.fromEntries(this.metrics);
  }

  getAverageResponseTime(datasetId) {
    const metrics = this.metrics.get(datasetId) || [];
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return Math.round(total / metrics.length);
  }
}

export default new PerformanceMonitor();