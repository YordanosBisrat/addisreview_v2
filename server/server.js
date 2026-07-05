require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');
const seed = require('./database/seed');
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/businesses');
const categoryRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------
// If the database hasn't been seeded yet, seed it automatically so the
// app works right after `npm install` with no extra manual step.
// (better-sqlite3 creates an empty file the moment it's opened, so we
// detect "first run" by checking whether our tables exist yet, not by
// checking for the file itself.)
// ------------------------------------------------------------------
const hasTables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'categories'")
  .get();

if (!hasTables) {
  console.log('No existing data found - seeding the database...');
  seed();
}

// ------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves anything dropped into server/uploads at /uploads/<filename>.
// Not wired to a real upload endpoint yet (see README "Known Limitations"),
// but this is the hook a future image-upload feature would plug into
// instead of hotlinking to an external image CDN.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple request logger (kept lightweight - no extra dependency needed)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------------------------------------------------
// Health check
// ------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'አዲስReview API is running' });
});

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);

// ------------------------------------------------------------------
// 404 + centralized error handling (must be registered last)
// ------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 አዲስReview server running on http://localhost:${PORT}`);
});
