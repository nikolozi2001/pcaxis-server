/**
 * Express Application Setup
 */
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import performanceMonitor from './middleware/performanceMonitor.js';

/**
 * Create and configure Express application
 * @returns {Express} Configured Express app
 */
export function createApp() {
  const app = express();

  // Trust proxy (if behind reverse proxy)
  app.set('trust proxy', 1);

  // Middleware
  app.use(compression());
  app.use(requestLogger);
  app.use(performanceMonitor.middleware());
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

  // Serve static dashboard assets from public/
  app.use(express.static('./public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.set('Content-Type', 'text/html');
      }
    }
  }));

  // Routes
  app.use('/api', routes);

  // Dashboard route
  app.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', { root: './public' });
  });
  
  // Root → dashboard redirect
  app.get('/', (req, res) => {
    res.redirect('/dashboard');
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
