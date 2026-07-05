/**
 * Centralized error-handling middleware.
 * Any error passed to next(err) anywhere in the app ends up here,
 * so we have exactly one place that decides how errors look on the wire.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
