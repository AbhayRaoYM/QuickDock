/**
 * api.ts — Typed API client for the QuickDock sidecar.
 *
 * Wraps fetch() with base URL resolution and typed response helpers.
 * Phase 1: Utility only — not yet wired to any component.
 * Phase 2: Used by TanStack Query hooks.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3579';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  /** Ping the sidecar to check it's alive */
  health: () =>
    request<{ status: string; db: string; pid: number; uptime: number }>('/health'),

  /** Fetch paginated share history */
  getHistory: (page = 1, limit = 20) =>
    request<{
      data: unknown[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/history?page=${page}&limit=${limit}`),

  /** Clear all share history */
  clearHistory: () =>
    request<{ success: boolean }>('/api/history', { method: 'DELETE' }),

  /** Fetch all connected accounts */
  getAccounts: () =>
    request<{ data: unknown[] }>('/api/accounts'),

  /** Disconnect an account by ID */
  deleteAccount: (id: number) =>
    request<{ success: boolean }>(`/api/accounts/${id}`, { method: 'DELETE' }),
};
