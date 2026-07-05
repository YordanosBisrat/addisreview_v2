/**
 * Business model.
 * All raw SQL for the `businesses` table lives here so controllers stay
 * free of query strings and can focus on request/response logic.
 *
 * Average rating and review count are computed on the fly via SQL
 * aggregate functions (AVG, COUNT) rather than stored as columns,
 * so they can never drift out of sync with the reviews table.
 */

const db = require('../config/db');

const BASE_SELECT = `
  SELECT
    b.id,
    b.name,
    b.description,
    b.address,
    b.city,
    b.latitude,
    b.longitude,
    b.image_url,
    b.price_range,
    b.category_id,
    c.name AS category_name,
    c.icon AS category_icon,
    ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
    COUNT(r.id) AS review_count
  FROM businesses b
  JOIN categories c ON c.id = b.category_id
  LEFT JOIN reviews r ON r.business_id = b.id
`;

function getAll({ categoryId, page = 1, limit = 12 } = {}) {
  const params = [];
  let where = '';

  if (categoryId) {
    where = ' WHERE b.category_id = ? ';
    params.push(categoryId);
  }

  const offset = (page - 1) * limit;
  const query = `${BASE_SELECT} ${where} GROUP BY b.id ORDER BY b.name ASC LIMIT ? OFFSET ?`;
  const businesses = db.prepare(query).all(...params, limit, offset);

  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM businesses b ${where}`)
    .get(...params);

  return { businesses, total };
}

function getById(id) {
  const query = `${BASE_SELECT} WHERE b.id = ? GROUP BY b.id`;
  return db.prepare(query).get(id);
}

function search(term, { page = 1, limit = 12 } = {}) {
  const like = `%${term}%`;
  const offset = (page - 1) * limit;

  const query = `
    ${BASE_SELECT}
    WHERE b.name LIKE ? OR c.name LIKE ?
    GROUP BY b.id
    ORDER BY b.name ASC
    LIMIT ? OFFSET ?
  `;
  const businesses = db.prepare(query).all(like, like, limit, offset);

  const { total } = db
    .prepare(
      `SELECT COUNT(*) AS total FROM businesses b JOIN categories c ON c.id = b.category_id
       WHERE b.name LIKE ? OR c.name LIKE ?`
    )
    .get(like, like);

  return { businesses, total };
}

function getRatingDistribution(businessId) {
  const rows = db
    .prepare(
      `SELECT rating, COUNT(*) as count
       FROM reviews
       WHERE business_id = ?
       GROUP BY rating`
    )
    .all(businessId);

  // Ensure all 5 buckets exist even if count is 0
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  rows.forEach((row) => {
    distribution[row.rating] = row.count;
  });
  return distribution;
}

function exists(id) {
  const row = db.prepare('SELECT id FROM businesses WHERE id = ?').get(id);
  return !!row;
}

module.exports = {
  getAll,
  getById,
  search,
  getRatingDistribution,
  exists,
};
