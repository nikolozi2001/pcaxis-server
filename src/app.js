/**
 * Express Application Setup
 */
import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

/**
 * Create and configure Express application
 * @returns {Express} Configured Express app
 */
export function createApp() {
  const app = express();

  // Trust proxy (if behind reverse proxy)
  app.set('trust proxy', 1);

  // Middleware
  app.use(requestLogger);
  app.use(cors(config.cors));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Security headers
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    });
    next();
  });

  // Routes
  app.use('/api', routes);
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'PXWeb API Server',
      version: '1.0.0',
      environment: config.server.env,
      api: '/api',
      health: '/health',
      documentation: {
        'Available datasets': 'GET /api/datasets',
        'Dataset metadata': 'GET /api/datasets/:id/metadata',
        'Dataset data': 'GET /api/datasets/:id/data',
        'Raw JSON-Stat': 'GET /api/datasets/:id/jsonstat',
        'Health check': 'GET /health',
        'System status': 'GET /health/status'
      }
    });
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
