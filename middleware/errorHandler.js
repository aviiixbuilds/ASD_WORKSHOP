/**
 * Error Handling & 404 Middleware
 *
 * Provides consistent JSON error responses for unknown routes,
 * malformed JSON payloads, and unexpected server errors.
 */

/**
 * 404 Handler for unmatched routes.
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

/**
 * Global error handling middleware.
 */
function errorHandler(err, req, res, next) {
  // Handle malformed JSON errors thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload in request body.'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
