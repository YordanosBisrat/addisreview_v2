const categoryModel = require('../models/categoryModel');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = categoryModel.getAll();
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

module.exports = { getAllCategories };
