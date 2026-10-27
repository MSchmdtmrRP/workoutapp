import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyServerOptions } from 'fastify';
import type { Db } from './db';
import { exerciseRoutes } from './routes/exercises';

export interface AppOptions {
  db: Db;
  /** Built frontend (client/dist) to serve next to the API; omitted in dev, where Vite serves it. */
  clientDir?: string;
  logger?: FastifyServerOptions['logger'];
}

export function buildApp({ db, clientDir, logger = false }: AppOptions) {
  const app = Fastify({ logger });

  app.get('/api/health', async () => ({ ok: true }));
  app.register(exerciseRoutes, { prefix: '/api/exercises', db });

  if (clientDir) {
    app.register(fastifyStatic, { root: clientDir });
  }

  app.setNotFoundHandler((req, reply) => {
    // Unknown non-API paths are client-side routes: hand them to the SPA.
    if (clientDir && req.method === 'GET' && !req.url.startsWith('/api/')) {
      return reply.sendFile('index.html');
    }
    return reply.code(404).send({ error: 'Nicht gefunden' });
  });

  return app;
}
