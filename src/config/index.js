/**
 * Application Configuration
 */
export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development'
  },

  // PXWeb API Configuration
  pxweb: {
    baseUrl: process.env.PXWEB_BASE_URL || 'https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database',
    timeout: process.env.PXWEB_TIMEOUT || 30000
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Rate Limiting (if needed in future)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

export default config;
