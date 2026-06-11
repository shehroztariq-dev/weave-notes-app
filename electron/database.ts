import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "thoughtweave.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT DEFAULT '',
      content TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      parent_branch_id TEXT,
      branch_order INTEGER DEFAULT 0,
      is_branch_root INTEGER DEFAULT 0,
      FOREIGN KEY (parent_branch_id) REFERENCES branches(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      root_note_id TEXT,
      parent_branch_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (root_note_id) REFERENCES notes(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_branch_id) REFERENCES branches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS note_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_note_id TEXT NOT NULL,
      target_note_id TEXT NOT NULL,
      link_text TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (source_note_id) REFERENCES notes(id) ON DELETE CASCADE,
      FOREIGN KEY (target_note_id) REFERENCES notes(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_parent_branch ON notes(parent_branch_id);
    CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at);
    CREATE INDEX IF NOT EXISTS idx_links_source ON note_links(source_note_id);
    CREATE INDEX IF NOT EXISTS idx_links_target ON note_links(target_note_id);
  `);
}

export default db;
