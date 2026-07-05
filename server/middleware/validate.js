const ApiError = require('../utils/ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the body of POST /api/businesses/:id/reviews.
 * Note: authorName is no longer accepted from the client - it's derived
 * server-side from the authenticated user (see requireAuth middleware).
 */
function validateReviewInput(req, res, next) {
  const { rating, comment } = req.body;
  const errors = [];

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    errors.push('rating must be an integer between 1 and 5');
  }

  if (!comment || typeof comment !== 'string' || !comment.trim()) {
    errors.push('comment is required');
  } else if (comment.trim().length > 1000) {
    errors.push('comment must be 1000 characters or fewer');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  req.body.comment = comment.trim();
  req.body.rating = numericRating;

  next();
}

/** Validates POST /api/auth/register */
function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('name is required');
  } else if (name.trim().length > 80) {
    errors.push('name must be 80 characters or fewer');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('a valid email is required');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('password must be at least 8 characters');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
}

/** Validates POST /api/auth/login */
function validateLoginInput(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('a valid email is required');
  }
  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('; ')));
  }

  req.body.email = email.trim().toLowerCase();

  next();
}

module.exports = { validateReviewInput, validateRegisterInput, validateLoginInput };
