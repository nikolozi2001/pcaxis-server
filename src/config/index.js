/**
 * Application Configuration
 */
export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
    env: process.env.NODE_ENV || "development",
  },

  // PXWeb API Configuration
  pxweb: {
    baseUrl:
      process.env.PXWEB_BASE_URL ||
      "https://pc-axis.geostat.ge/PXWeb/api/v1/ka/Database",
    timeout: process.env.PXWEB_TIMEOUT || 30000,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

export default config;
