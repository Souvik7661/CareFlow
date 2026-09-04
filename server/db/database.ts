import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../../hospital.db');
const SCHEMA_PATH = path.resolve(__dirname, 'schema.sql');

console.log(`[DB] Connecting to SQLite database at: ${DB_PATH}`);
export const db = new DatabaseSync(DB_PATH);

// Enable Foreign Keys and WAL mode
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Safe column migrations for existing tables
try {
  db.exec('ALTER TABLE doctors ADD COLUMN hospital_id TEXT;');
} catch (e) {}
try {
  db.exec('ALTER TABLE doctors ADD COLUMN total_reviews INTEGER DEFAULT 320;');
} catch (e) {}

// Initialize schema
if (fs.existsSync(SCHEMA_PATH)) {
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schemaSql);
  console.log('[DB] Schema initialized successfully');
} else {
  console.warn('[DB] schema.sql not found at', SCHEMA_PATH);
}

/**
 * Type-safe query helpers
 */
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | undefined {
  const stmt = db.prepare(sql);
  const results = stmt.all(...params);
  return (results[0] as T) || undefined;
}

export function execute(sql: string, params: any[] = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

let inTransactionDepth = 0;

export function transaction<T>(callback: () => T): T {
  const isOuter = inTransactionDepth === 0;
  if (isOuter) {
    db.exec('BEGIN TRANSACTION;');
  } else {
    db.exec(`SAVEPOINT sp_${inTransactionDepth};`);
  }
  inTransactionDepth++;

  try {
    const result = callback();
    inTransactionDepth--;
    if (isOuter) {
      db.exec('COMMIT;');
    } else {
      db.exec(`RELEASE SAVEPOINT sp_${inTransactionDepth};`);
    }
    return result;
  } catch (err) {
    inTransactionDepth--;
    if (isOuter) {
      db.exec('ROLLBACK;');
    } else {
      db.exec(`ROLLBACK TO SAVEPOINT sp_${inTransactionDepth};`);
    }
    throw err;
  }
}
