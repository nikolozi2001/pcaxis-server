/**
 * Health Controller
 * Handles health check and system status endpoints
 */
import performanceMonitor from '../middleware/performanceMonitor.js';
import redisService from '../services/redisService.js';

export class HealthController {
  /**
   * Health check endpoint
   * @param {Request} req 
   * @param {Response} res 
   */
  async healthCheck(req, res) {
    try {
      const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        environment: process.env.NODE_ENV || 'development'
      };

      res.json({
        success: true,
        data: healthData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Health check failed',
        message: error.message
      });
    }
  }

  /**
   * System status endpoint with more detailed information
   * @param {Request} req 
   * @param {Response} res 
   */
  async systemStatus(req, res) {
    try {
      const statusData = {
        server: {
          status: 'running',
          uptime: {
            seconds: process.uptime(),
            human: this._formatUptime(process.uptime())
          },
          timestamp: new Date().toISOString()
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          environment: process.env.NODE_ENV || 'development'
        },
        memory: {
          ...process.memoryUsage(),
          formatted: {
            rss: this._formatBytes(process.memoryUsage().rss),
            heapUsed: this._formatBytes(process.memoryUsage().heapUsed),
            heapTotal: this._formatBytes(process.memoryUsage().heapTotal)
          }
        },
        api: {
          version: '1.0.0',
          endpoints: [
            'GET /api/datasets',
            'GET /api/datasets/:id/metadata',
            'GET /api/datasets/:id/data',
            'GET /api/datasets/:id/jsonstat',
            'GET /health',
            'GET /status'
          ]
        }
      };

      res.json({
        success: true,
        data: statusData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Status check failed',
        message: error.message
      });
    }
  }

  /**
   * Format uptime in human readable format
   * @param {number} seconds 
   * @returns {string}
   */
  _formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Format bytes in human readable format
   * @param {number} bytes 
   * @returns {string}
   */
  _formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * ENHANCED: Advanced health check with performance monitoring
   */
  async advancedHealth(req, res) {
    try {
      // Basic system health
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: {
          seconds: Math.floor(process.uptime()),
          human: this._formatUptime(process.uptime())
        },
        memory: {
          used: this._formatBytes(process.memoryUsage().heapUsed),
          total: this._formatBytes(process.memoryUsage().heapTotal),
          external: this._formatBytes(process.memoryUsage().external),
          percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
        },
        
        // Performance indicators (real data from performanceMonitor)
        performance: performanceMonitor.getSummary(),

        // Service dependencies
        services: {
          dataProcessing: { status: 'healthy' },
          pxwebApi: { status: 'healthy' },
          redis: { connected: redisService.isConnected(), status: redisService.isConnected() ? 'healthy' : 'unavailable' }
        },
        
        // System resources
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          cpuUsage: process.cpuUsage(),
          environment: process.env.NODE_ENV || 'development'
        }
      };

      // Health status determination
      // Redis is optional (graceful fallback) — its absence is a warning, not a failure
      const memoryUsageHigh = healthData.memory.percentage > 90;
      const criticalServicesDown = [healthData.services.dataProcessing, healthData.services.pxwebApi]
        .some(s => s.status !== 'healthy');

      if (memoryUsageHigh || criticalServicesDown || !redisService.isConnected()) {
        healthData.status = memoryUsageHigh || criticalServicesDown ? 'degraded' : 'healthy';
        healthData.warnings = [];
        if (memoryUsageHigh) healthData.warnings.push('High memory usage');
        if (criticalServicesDown) healthData.warnings.push('Some services degraded');
        if (!redisService.isConnected()) healthData.warnings.push('Redis unavailable — caching disabled');
      }

      // Only return 503 when truly degraded (not just Redis missing)
      const statusCode = (memoryUsageHigh || criticalServicesDown) ? 503 : 200;
      res.status(statusCode).json({
        success: !memoryUsageHigh && !criticalServicesDown,
        data: healthData
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async clearCache(req, res) {
    try {
      const deleted = await redisService.flushByPattern('*');
      res.json({
        success: true,
        message: `Cache cleared`,
        keysDeleted: deleted,
        redisConnected: redisService.isConnected()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new HealthController();
