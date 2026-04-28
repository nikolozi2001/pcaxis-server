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
      
      const monitor = this;
      res.send = function(data) {
        const duration = Date.now() - startTime;
        const endpoint = `${req.method} ${req.route?.path || req.path}`;

        console.log(`⚡ ${endpoint} - ${duration}ms`);

        if (duration > monitor.slowQueryThreshold) {
          console.warn(`🐌 SLOW QUERY: ${endpoint} took ${duration}ms`);
        }

        const key = `${req.params?.id || 'general'}-${req.query?.lang || 'ka'}`;
        if (!monitor.metrics.has(key)) {
          monitor.metrics.set(key, []);
        }
        monitor.metrics.get(key).push({
          endpoint,
          duration,
          timestamp: new Date().toISOString(),
          cached: res.getHeader('X-Cache-Hit') === 'true'
        });

        res.setHeader('X-Response-Time', `${duration}ms`);
        res.setHeader('X-Performance-Optimized', 'true');

        return originalSend.call(this, data);
      };
      
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
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return Math.round(total / metrics.length);
  }

  getSummary() {
    let totalDuration = 0;
    let totalRequests = 0;
    let slowRequests = 0;
    const oneMinuteAgo = Date.now() - 60_000;
    let requestsLastMinute = 0;

    for (const entries of this.metrics.values()) {
      for (const m of entries) {
        totalDuration += m.duration;
        totalRequests++;
        if (m.duration > this.slowQueryThreshold) slowRequests++;
        if (new Date(m.timestamp).getTime() > oneMinuteAgo) requestsLastMinute++;
      }
    }

    const avg = totalRequests > 0 ? Math.round(totalDuration / totalRequests) : null;

    return {
      averageResponseTime: avg !== null ? `${avg}ms` : '—',
      totalRequests,
      requestsPerMinute: requestsLastMinute,
      slowRequests,
      trackedEndpoints: this.metrics.size
    };
  }
}

export default new PerformanceMonitor();