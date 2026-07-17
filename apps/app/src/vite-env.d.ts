/// <reference types="vite/client" />

/**
 * Type declarations for Vite environment variables.
 * All VITE_ prefixed variables are surfaced here.
 */
interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_API_PORT: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
