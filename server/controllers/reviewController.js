const reviewModel = require('../models/reviewModel');
const businessModel = require('../models/businessModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/businesses/:id/reviews
 * Optional query params: ?page=1&limit=10
 */
const getReviewsForBusiness = asyncHandler(async (req, res) => {
  const businessId = Number(req.params.id);
  if (Number.isNaN(businessId)) {
    throw new ApiError(400, 'Business id must be a number');
  }

  if (!businessModel.exists(businessId)) {
    throw new ApiError(404, `Business with id ${businessId} not found`);
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const { reviews, total } = reviewModel.getByBusinessId(businessId, { page, limit });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

/**
 * POST /api/businesses/:id/reviews
 * Requires authentication (requireAuth middleware runs first).
 * Body: { rating, comment } — the author is always the logged-in user,
 * never a client-supplied name, which is what fixes the "anyone can
 * post as anyone" gap from the earlier version of this project.
 */
const createReview = asyncHandler(async (req, res) => {
  const businessId = Number(req.params.id);
  if (Number.isNaN(businessId)) {
    throw new ApiError(400, 'Business id must be a number');
  }

  if (!businessModel.exists(businessId)) {
    throw new ApiError(404, `Business with id ${businessId} not found`);
  }

  const { rating, comment } = req.body;
  const review = reviewModel.create({
    businessId,
    userId: req.user.id,
    authorName: req.user.name,
    rating,
    comment,
  });

  res.status(201).json({ success: true, data: review });
});

module.exports = { getReviewsForBusiness, createReview };
