/**
 * PXWeb API Server
 * Entry point for the application
 */
import { createApp } from './src/app.js';
import { config } from './src/config/index.js';

// Create Express application
const app = createApp();

// Start server
const server = app.listen(config.server.port, config.server.host, () => {
  console.log('🚀 PXWeb API Server Started');
  console.log('=' .repeat(50));
  console.log(`📍 Environment: ${config.server.env}`);
  console.log(`🌐 Server: http://${config.server.host}:${config.server.port}`);
  console.log(`🏠 Local: http://localhost:${config.server.port}`);
  console.log(`🌍 Network: http://192.168.1.27:${config.server.port}`);
  console.log('=' .repeat(50));
  console.log('📊 API Endpoints:');
  console.log(`   🔍 GET  /api                      - API information`);
  console.log(`   📋 GET  /api/datasets             - List datasets`);
  console.log(`   📄 GET  /api/datasets/:id/metadata - Dataset metadata`);
  console.log(`   📊 GET  /api/datasets/:id/data     - Chart-ready data`);
  console.log(`   🔢 GET  /api/datasets/:id/jsonstat - Raw JSON-Stat`);
  console.log(`   ❤️  GET  /health                   - Health check`);
  console.log(`   🔧 GET  /health/status            - System status`);
  console.log('=' .repeat(50));
  console.log('📝 Example URLs:');
  console.log(`   http://localhost:${config.server.port}/api/datasets`);
  console.log(`   http://localhost:${config.server.port}/api/datasets/air-pollution-regions/data`);
  console.log(`   http://192.168.1.27:${config.server.port}/api/datasets/air-pollution-regions/data`);
  console.log('=' .repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
