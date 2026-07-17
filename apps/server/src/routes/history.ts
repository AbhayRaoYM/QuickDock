import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getDb } from '../db/database';

/**
 * Share History routes
 *
 * GET  /api/history         — paginated list
 * GET  /api/history/:id     — single record
 * DELETE /api/history       — clear all history
 *
 * Phase 1: Stubbed CRUD foundation; no real share logic yet.
 */
export async function historyRoutes(fastify: FastifyInstance): Promise<void> {
  const db = getDb();

  // ── GET /api/history ───────────────────────────────────────────────────
  fastify.get(
    '/api/history',
    async (req: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>, reply) => {
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '20', 10)));
      const offset = (page - 1) * limit;

      const rows = db
        .prepare(
          `SELECT * FROM share_history ORDER BY created_at DESC LIMIT ? OFFSET ?`
        )
        .all(limit, offset);

      const total = (
        db.prepare('SELECT COUNT(*) as count FROM share_history').get() as { count: number }
      ).count;

      return reply.send({
        data: rows,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  );

  // ── GET /api/history/:id ───────────────────────────────────────────────
  fastify.get(
    '/api/history/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const row = db
        .prepare('SELECT * FROM share_history WHERE id = ?')
        .get(parseInt(req.params.id, 10));

      if (!row) return reply.status(404).send({ error: 'Not found' });
      return reply.send({ data: row });
    }
  );

  // ── DELETE /api/history ────────────────────────────────────────────────
  fastify.delete('/api/history', async (_req, reply) => {
    db.prepare('DELETE FROM share_history').run();
    return reply.send({ success: true });
  });
}
