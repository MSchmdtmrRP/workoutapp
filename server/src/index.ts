import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildApp } from './app';
import { openDb } from './db';

const rootDir = resolve(import.meta.dirname, '../..');
// Not `PORT`: dev tooling often sets that for the frontend server. The Vite proxy expects 3001.
const port = Number(process.env.API_PORT ?? 3001);
const dbPath = process.env.DB_PATH ?? resolve(rootDir, 'data/workoutapp.db');
const clientDir = resolve(rootDir, 'client/dist');
const serveClient = process.argv.includes('--serve-client');

if (serveClient && !existsSync(clientDir)) {
  console.error('client/dist fehlt – bitte zuerst `npm run build` ausführen.');
  process.exit(1);
}

const app = buildApp({
  db: openDb(dbPath),
  clientDir: serveClient ? clientDir : undefined,
  logger: { level: 'warn' },
});

await app.listen({ port, host: '127.0.0.1' });
console.log(`API läuft auf http://localhost:${port}  (DB: ${dbPath})`);
if (serveClient) console.log(`App öffnen: http://localhost:${port}`);
