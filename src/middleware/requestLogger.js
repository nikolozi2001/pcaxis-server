/**
 * Request Logger Middleware
 */

/**
 * Simple request logger
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode < 400 ? '\x1b[32m' : '\x1b[31m'; // Green for success, red for error
    const resetColor = '\x1b[0m';
    
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.url} - ` +
      `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });
  
  next();
};

/**
 * CORS configuration middleware
 * @param {Object} corsOptions 
 * @returns {Function}
 */
export const corsConfig = (corsOptions) => (req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', corsOptions.origin || '*');
  res.header('Access-Control-Allow-Methods', corsOptions.methods?.join(', ') || 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders?.join(', ') || 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};
