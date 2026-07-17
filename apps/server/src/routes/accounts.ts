import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getDb } from '../db/database';

/**
 * Accounts routes
 *
 * GET    /api/accounts          — list all connected accounts
 * GET    /api/accounts/:id      — single account
 * DELETE /api/accounts/:id      — disconnect an account
 *
 * Phase 1: Schema + stub endpoints.
 * Phase 2: OAuth flows per destination (Slack, Gmail, etc.)
 */
export async function accountsRoutes(fastify: FastifyInstance): Promise<void> {
  const db = getDb();

  // ── GET /api/accounts ──────────────────────────────────────────────────
  fastify.get('/api/accounts', async (_req, reply) => {
    // Never expose tokens over the wire — strip them from the response
    const rows = db
      .prepare(
        `SELECT id, destination, display_name, metadata, created_at, updated_at
         FROM accounts ORDER BY created_at DESC`
      )
      .all();

    return reply.send({ data: rows });
  });

  // ── GET /api/accounts/:id ──────────────────────────────────────────────
  fastify.get(
    '/api/accounts/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const row = db
        .prepare(
          `SELECT id, destination, display_name, metadata, created_at, updated_at
           FROM accounts WHERE id = ?`
        )
        .get(parseInt(req.params.id, 10));

      if (!row) return reply.status(404).send({ error: 'Not found' });
      return reply.send({ data: row });
    }
  );

  // ── DELETE /api/accounts/:id ───────────────────────────────────────────
  fastify.delete(
    '/api/accounts/:id',
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const info = db
        .prepare('DELETE FROM accounts WHERE id = ?')
        .run(parseInt(req.params.id, 10));

      if (info.changes === 0) return reply.status(404).send({ error: 'Not found' });
      return reply.send({ success: true });
    }
  );
}
