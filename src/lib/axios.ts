import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "./env";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Endpoint paths that should NOT receive the Authorization header.
 * Matched as a substring against the request URL.
 */
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/gift/all",
  "/gift/new-arrivals",
  "/customer/create",
  // "/customer/orders",  // requires auth — handled by interceptor
  "/library/getAll",
  "/cart/get",
  "/cart/add",
  "/cart/update",
  "/cart/remove",
  "/cart/clear",
  "/ai/generate",
  // "/order/create",   // requires auth
  // "/payment/process", // requires auth
];

function isPublicRequest(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

function readRefreshedTokens(
  data: RefreshResponse | undefined
): { accessToken: string; refreshToken?: string } | null {
  if (!data) return null;
  const nested = data.data;
  const accessToken =
    (typeof nested?.accessToken === "string" ? nested.accessToken : undefined) ??
    (typeof data.accessToken === "string" ? data.accessToken : undefined);
  if (!accessToken) return null;
  const refreshToken =
    (typeof nested?.refreshToken === "string" ? nested.refreshToken : undefined) ??
    (typeof data.refreshToken === "string" ? data.refreshToken : undefined);
  return { accessToken, refreshToken };
}

/**
 * Singleton refresh promise. While a refresh is in flight, every other
 * 401-retry waits for it instead of firing its own /auth/refresh-token call.
 * This prevents a thundering herd when many requests fail at once.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${env.apiBaseUrl}/auth/refresh-token`,
        { refreshToken }
      );
      const tokens = readRefreshedTokens(data);
      if (!tokens) {
        throw new Error("Refresh did not return an access token");
      }
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      return tokens.accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function redirectAfterForbidden(currentPath: string): void {
  if (typeof window === "undefined") return;

  if (currentPath.startsWith("/admin")) {
    window.location.replace("/account/orders");
    return;
  }
  if (currentPath.startsWith("/account")) {
    window.location.replace("/");
    return;
  }
  if (currentPath !== "/login") {
    window.location.replace("/login?reason=forbidden");
  }
}

/**
 * The single shared axios instance used by every service in the app.
 *
 * - baseURL is read from VITE_API_URL (via env.ts) and never hardcoded.
 * - The access token is attached to every request except public auth/library endpoints.
 * - 401 responses on protected endpoints are retried once after refreshing the token.
 * - 403 responses on protected areas redirect the user to a safe landing page.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && !isPublicRequest(config.url)) {
    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else if (config.headers && typeof config.headers === "object") {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && !isPublicRequest(originalRequest?.url)) {
      clearAuthStorage();
      redirectAfterForbidden(currentPath);
    }

    return Promise.reject(error);
  }
);

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export { refreshAccessToken };
