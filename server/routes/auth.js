const express = require('express');
const router = express.Router();

const { register, login, me } = require('../controllers/authController');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validateRegisterInput, register);

// POST /api/auth/login
router.post('/login', validateLoginInput, login);

// GET /api/auth/me
router.get('/me', requireAuth, me);

module.exports = router;
