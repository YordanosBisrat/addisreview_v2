/**
 * Custom error class that carries an HTTP status code alongside the
 * message, so the centralized error handler can respond with the
 * correct status instead of always defaulting to 500.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
