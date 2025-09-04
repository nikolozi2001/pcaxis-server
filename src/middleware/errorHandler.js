/**
 * Error Handling Middleware
 */

/**
 * Global error handler middleware
 * @param {Error} err 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong'
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = {
      success: false,
      error: 'Invalid ID format',
      message: 'Resource not found'
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      success: false,
      error: 'Validation Error',
      message
    };
  }

  // Fetch errors
  if (err.name === 'FetchError' || err.message.includes('fetch')) {
    error = {
      success: false,
      error: 'External API Error',
      message: 'Failed to fetch data from external service'
    };
  }

  // Timeout errors
  if (err.name === 'AbortError' || err.message.includes('timeout')) {
    error = {
      success: false,
      error: 'Request Timeout',
      message: 'Request took too long to complete'
    };
  }

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(err.statusCode || 500).json(error);
};

/**
 * Handle 404 errors
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async error wrapper to catch async errors
 * @param {Function} fn 
 * @returns {Function}
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
