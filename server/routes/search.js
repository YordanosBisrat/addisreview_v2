const express = require('express');
const router = express.Router();
const { searchBusinesses } = require('../controllers/searchController');

// GET /api/search?q=
router.get('/', searchBusinesses);

module.exports = router;
