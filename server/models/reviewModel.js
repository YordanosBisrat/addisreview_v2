const db = require('../config/db');

/**
 * Paginated reviews for a business, newest first.
 * Returns { reviews, total } so the controller can build pagination metadata.
 */
function getByBusinessId(businessId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const reviews = db
    .prepare(
      `SELECT id, business_id, user_id, author_name, rating, comment, created_at
       FROM reviews
       WHERE business_id = ?
       ORDER BY datetime(created_at) DESC
       LIMIT ? OFFSET ?`
    )
    .all(businessId, limit, offset);

  const { total } = db
    .prepare('SELECT COUNT(*) AS total FROM reviews WHERE business_id = ?')
    .get(businessId);

  return { reviews, total };
}

/**
 * Creates a review tied to an authenticated user. `authorName` is a
 * denormalized snapshot of the user's display name at review time -
 * authorship itself is enforced by the `userId` foreign key, which is
 * only ever set from `req.user` (never from client-supplied input).
 */
function create({ businessId, userId, authorName, rating, comment }) {
  const info = db
    .prepare(
      `INSERT INTO reviews (business_id, user_id, author_name, rating, comment)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(businessId, userId, authorName, rating, comment);

  return db
    .prepare(
      'SELECT id, business_id, user_id, author_name, rating, comment, created_at FROM reviews WHERE id = ?'
    )
    .get(info.lastInsertRowid);
}

module.exports = {
  getByBusinessId,
  create,
};
