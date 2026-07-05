const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = userModel.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'An account with that email already exists');
  }

  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const user = userModel.create({ name, email, passwordHash });
  const token = signToken(user);

  res.status(201).json({ success: true, data: { user, token } });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userRow = userModel.findByEmail(email);
  if (!userRow) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = bcrypt.compareSync(password, userRow.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const user = { id: userRow.id, name: userRow.name, email: userRow.email };
  const token = signToken(user);

  res.status(200).json({ success: true, data: { user, token } });
});

/**
 * GET /api/auth/me
 * Requires requireAuth middleware to have already run.
 */
const me = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, me };
