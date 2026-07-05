/**
 * Wraps an async Express route handler so that any thrown error (or
 * rejected promise) is automatically forwarded to next(), which routes
 * it to our centralized error-handling middleware instead of requiring
 * a try/catch block in every single controller function.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
