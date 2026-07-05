const jwt = require('jsonwebtoken');

// In a real deployment this MUST come from a secret environment variable.
// The fallback here only exists so the app still runs out of the box for
// a local demo/interview without requiring extra setup.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const JWT_EXPIRES_IN = '7d';

function signToken(user) {
  return jwt.sign({ sub: user.id, name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
