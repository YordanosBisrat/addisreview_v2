const businessModel = require('../models/businessModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/businesses
 * Optional query params: ?category=<categoryId>&page=1&limit=12
 */
const getAllBusinesses = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const categoryId = category ? Number(category) : undefined;

  if (category && Number.isNaN(categoryId)) {
    throw new ApiError(400, 'category must be a valid numeric id');
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

  const { businesses, total } = businessModel.getAll({ categoryId, page, limit });

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

/**
 * GET /api/businesses/:id
 */
const getBusinessById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new ApiError(400, 'Business id must be a number');
  }

  const business = businessModel.getById(id);
  if (!business) {
    throw new ApiError(404, `Business with id ${id} not found`);
  }

  const ratingDistribution = businessModel.getRatingDistribution(id);

  res.status(200).json({
    success: true,
    data: { ...business, rating_distribution: ratingDistribution },
  });
});

module.exports = { getAllBusinesses, getBusinessById };
