/**
 * Health Controller
 * Handles health check and system status endpoints
 */
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
}

export default new HealthController();
