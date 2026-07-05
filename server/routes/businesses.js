const express = require('express');
const router = express.Router();

const { getAllBusinesses, getBusinessById } = require('../controllers/businessController');
const { getReviewsForBusiness, createReview } = require('../controllers/reviewController');
const { validateReviewInput } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

// GET /api/businesses
router.get('/', getAllBusinesses);

// GET /api/businesses/:id
router.get('/:id', getBusinessById);

// GET /api/businesses/:id/reviews
router.get('/:id/reviews', getReviewsForBusiness);

// POST /api/businesses/:id/reviews (requires login)
router.post('/:id/reviews', requireAuth, validateReviewInput, createReview);

module.exports = router;
