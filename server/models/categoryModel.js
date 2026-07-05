const db = require('../config/db');

/**
 * Returns all categories along with a live count of how many
 * businesses belong to each one (used for the Home page category cards).
 */
function getAll() {
  return db
    .prepare(
      `SELECT
         c.id,
         c.name,
         c.icon,
         c.description,
         COUNT(b.id) AS business_count
       FROM categories c
       LEFT JOIN businesses b ON b.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`
    )
    .all();
}

function getById(id) {
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

module.exports = {
  getAll,
  getById,
};
