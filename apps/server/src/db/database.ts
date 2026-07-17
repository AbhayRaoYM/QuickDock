/**
 * Database module
 *
 * Wraps better-sqlite3 in a thin singleton.
 * All migrations are run on startup to keep the schema in sync.
 *
 * Phase 1: Creates the initial share_history table.
 * Phase 2: Add accounts, destinations, settings tables.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ── Database path ──────────────────────────────────────────────────────────
// In production this will live in the Tauri app data directory.
// In development we use a local .db file for convenience.
const DB_DIR = process.env.QUICKDOCK_DB_DIR ?? path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'quickdock.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// ── Singleton ──────────────────────────────────────────────────────────────
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    // Enable WAL mode for better concurrent read performance
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    runMigrations(_db);
  }
  return _db;
}

// ── Migrations ─────────────────────────────────────────────────────────────
function runMigrations(db: Database.Database): void {
  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL UNIQUE,
      applied_at TEXT   NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Migration 001: share_history ────────────────────────────────────────
  applyMigration(db, '001_share_history', `
    CREATE TABLE IF NOT EXISTS share_history (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name   TEXT    NOT NULL,
      file_path   TEXT    NOT NULL,
      file_size   INTEGER NOT NULL,
      destination TEXT    NOT NULL,
      recipient   TEXT    NOT NULL,
      status      TEXT    NOT NULL CHECK(status IN ('pending','uploading','sent','failed')),
      error_msg   TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Migration 002: accounts ─────────────────────────────────────────────
  applyMigration(db, '002_accounts', `
    CREATE TABLE IF NOT EXISTS accounts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      destination   TEXT    NOT NULL,
      display_name  TEXT    NOT NULL,
      access_token  TEXT,
      refresh_token TEXT,
      token_expiry  TEXT,
      metadata      TEXT,   -- JSON blob for provider-specific data
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Migration 003: settings ─────────────────────────────────────────────
  applyMigration(db, '003_settings', `
    CREATE TABLE IF NOT EXISTS settings (
      key         TEXT    PRIMARY KEY,
      value       TEXT    NOT NULL,
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function applyMigration(db: Database.Database, name: string, sql: string): void {
  const already = db.prepare('SELECT id FROM _migrations WHERE name = ?').get(name);
  if (already) return;
  db.exec(sql);
  db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(name);
}
