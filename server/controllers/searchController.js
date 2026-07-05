const businessModel = require('../models/businessModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/search?q=<term>&page=1&limit=12
 * Searches business name and category name.
 */
const searchBusinesses = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    throw new ApiError(400, 'Query parameter "q" is required');
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

  const { businesses, total } = businessModel.search(q.trim(), { page, limit });

  res.status(200).json({
    success: true,
    count: businesses.length,
    data: businesses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

module.exports = { searchBusinesses };
