/**
 * QuickDock Sidecar Server
 *
 * A local Fastify HTTP server spawned by Tauri as a sidecar process.
 * It handles:
 *   - SQLite persistence (share history, accounts, settings)
 *   - File-share orchestration (Phase 2)
 *   - OAuth token management (Phase 2)
 *
 * Listens on 127.0.0.1 only — never exposed to the network.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { healthRoutes } from './routes/health';
import { historyRoutes } from './routes/history';
import { accountsRoutes } from './routes/accounts';

// ── Config ─────────────────────────────────────────────────────────────────
const HOST = process.env.QUICKDOCK_HOST ?? '127.0.0.1';
const PORT = parseInt(process.env.QUICKDOCK_PORT ?? '3579', 10);
const IS_DEV = process.env.NODE_ENV !== 'production';

// ── Build app ──────────────────────────────────────────────────────────────
const server = Fastify({
  logger: IS_DEV
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }
    : true,
  disableRequestLogging: !IS_DEV,
});

// ── Plugins ────────────────────────────────────────────────────────────────

// Helmet — security headers
await server.register(helmet, { global: true });

// CORS — only allow the Tauri webview origin
await server.register(cors, {
  origin: [
    'tauri://localhost',      // macOS / Linux
    'https://tauri.localhost', // Windows
    'http://localhost:1420',   // Vite dev server
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: false,
});

// Sensible — adds reply helpers like .notFound(), .badRequest()
await server.register(sensible);

// ── Routes ─────────────────────────────────────────────────────────────────
await server.register(healthRoutes);
await server.register(historyRoutes);
await server.register(accountsRoutes);

// ── 404 fallback ───────────────────────────────────────────────────────────
server.setNotFoundHandler((_req, reply) => {
  return reply.status(404).send({ error: 'Route not found' });
});

// ── Start ──────────────────────────────────────────────────────────────────
try {
  await server.listen({ port: PORT, host: HOST });
  server.log.info(`QuickDock sidecar running at http://${HOST}:${PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
