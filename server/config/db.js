
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
