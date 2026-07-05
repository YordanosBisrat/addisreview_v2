const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/userModel');
const ApiError = require('../utils/ApiError');

/**
 * Protects a route: requires a valid `Authorization: Bearer <token>` header.
 * On success, attaches the authenticated user to req.user so downstream
 * controllers never have to trust anything the client claims about who
 * they are (e.g. a review's author name is derived from req.user, not
 * from the request body).
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'You must be logged in to do that.'));
  }

  try {
    const payload = verifyToken(token);
    const user = userModel.findById(payload.sub);

    if (!user) {
      return next(new ApiError(401, 'Your session is no longer valid. Please log in again.'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Your session has expired. Please log in again.'));
  }
}

module.exports = { requireAuth };
