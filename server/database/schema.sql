-- ============================================================
-- አዲስReview Database Schema
-- Normalized to 3NF:
--   - categories are stored once and referenced by id (no repeated
--     category strings on every business row)
--   - reviews reference businesses AND users via foreign keys rather
--     than duplicating business info or accepting free-text authorship
--   - average rating is DERIVED (computed with SQL AVG()) rather than
--     stored redundantly on the businesses table, so it can never
--     go out of sync with the underlying reviews
-- ============================================================

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL,        -- react-icon key, e.g. "FaUtensils"
  description TEXT
);

CREATE TABLE businesses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL DEFAULT 'Addis Ababa',
  latitude    REAL,
  longitude   REAL,
  image_url   TEXT NOT NULL,
  price_range TEXT,                 -- e.g. "$", "$$", "$$$"
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Reviews are now tied to a real user account (user_id) rather than a
-- free-text name typed into the form. `author_name` is kept as a
-- denormalized snapshot of the user's display name *at review time*,
-- so a review's byline doesn't retroactively change if the user later
-- renames their account — but authorship itself is enforced by the
-- foreign key + the requireAuth middleware on the API side.
CREATE TABLE reviews (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id  INTEGER NOT NULL,
  user_id      INTEGER NOT NULL,
  author_name  TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_businesses_name ON businesses(name);
