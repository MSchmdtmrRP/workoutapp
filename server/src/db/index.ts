import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { migrations } from './migrations';

export type Db = DatabaseSync;

/** Opens (or creates) the SQLite file and brings the schema up to date. */
export function openDb(path: string): Db {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON');
  migrate(db);
  return db;
}

function migrate(db: Db) {
  const { user_version: current } = db.prepare('PRAGMA user_version').get() as { user_version: number };
  for (let version = current; version < migrations.length; version++) {
    db.exec('BEGIN');
    try {
      db.exec(migrations[version]!);
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
}

/** True if `err` is a SQLite UNIQUE constraint violation. */
export function isUniqueViolation(err: unknown): boolean {
  const SQLITE_CONSTRAINT_UNIQUE = 2067;
  return (err as { errcode?: number } | null)?.errcode === SQLITE_CONSTRAINT_UNIQUE;
}
