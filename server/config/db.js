/**
 * Database connection module.
 *
 * Uses better-sqlite3: a real native SQLite binding, not an in-memory
 * WASM database. This directly addresses a concurrency weakness from
 * the previous version of this project (which used sql.js and had to
 * export the whole DB to a buffer and overwrite the file after every
 * write — two near-simultaneous writes could race and one could
 * silently clobber the other).
 *
 * better-sqlite3 writes straight to disk through SQLite's own locking,
 * and we turn on WAL (Write-Ahead Logging) mode below, which lets
 * reads proceed concurrently with a write instead of blocking on it.
 * It's also fully synchronous, which keeps controller code simple —
 * no async/await needed for query calls.
 */

const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, '..', process.env.DB_PATH)
  : path.resolve(__dirname, '..', 'database', 'adisreview.db');

const db = new Database(DB_PATH);

// Enforce foreign key constraints (off by default in SQLite)
db.pragma('foreign_keys = ON');

// Write-Ahead Logging: readers don't block writers and vice versa,
// which is the practical fix for the single-writer race condition
// that the old sql.js-based version of this project had.
db.pragma('journal_mode = WAL');

module.exports = db;
