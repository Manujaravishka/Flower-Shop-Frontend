/**
 * Centralized environment configuration.
 *
 * All environment variables must be read from this module so that:
 *   - The fallback is defined in one place.
 *   - Vite's `import.meta.env` access is not scattered across the codebase.
 *   - TypeScript always sees the variable (we also extend ImportMetaEnv in vite-env.d.ts).
 */

const FALLBACK_API_URL = "https://flower-shop-backend-rosy.vercel.app/api/v1";

function normalizeBaseUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return FALLBACK_API_URL;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_URL),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;
