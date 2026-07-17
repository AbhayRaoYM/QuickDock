import type { FastifyInstance } from 'fastify';
import { getDb } from '../db/database';

/**
 * Health route
 *
 * GET /health — lightweight ping used by the Tauri app to confirm
 * the sidecar process is running before making API calls.
 */
export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (_req, reply) => {
    // Verify DB is accessible
    const db = getDb();
    const row = db.prepare('SELECT 1 AS ok').get() as { ok: number };

    return reply.send({
      status: 'ok',
      db: row.ok === 1 ? 'ok' : 'error',
      pid: process.pid,
      uptime: process.uptime(),
      version: process.env.npm_package_version ?? '0.1.0',
    });
  });
}
