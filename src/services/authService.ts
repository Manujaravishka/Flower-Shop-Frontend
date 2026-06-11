import { apiClient, clearAuthStorage } from "@/lib/axios";
import { env } from "@/lib/env";
import { extractApiErrorMessage } from "@/lib/apiError";
import type {
  AuthTokens,
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "@/types/auth";

/**
 * Auth data shape returned inside the `data` field of auth endpoints.
 * Mirrors the backend:
 *   { user, role, accessToken, refreshToken }   (login / register)
 *   { accessToken, refreshToken }              (refresh-token)
 */
export interface AuthDataPayload {
  user?: AuthUser;
  role?: AuthUser["role"];
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Backend response envelope used by every auth endpoint.
 *
 * Standard shape (preferred):
 *   { success: true, message: string, data: { user, role, accessToken, refreshToken } }
 *
 * Legacy/flat shapes are also accepted so older servers keep working.
 */
export interface AuthResponseShape {
  success?: boolean;
  message?: string;
  data?: AuthDataPayload | AuthUser;
  user?: AuthUser;
  role?: AuthUser["role"];
  accessToken?: string;
  refreshToken?: string;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate._id === "string") return true;
  if (typeof candidate.id === "string" && typeof candidate.email === "string") {
    return true;
  }
  return false;
}

function readString(
  source: Record<string, unknown> | null | undefined,
  key: string
): string | undefined {
  if (!source) return undefined;
  const value = source[key];
  return typeof value === "string" ? value : undefined;
}

function readNestedData(
  payload: AuthResponseShape
): Record<string, unknown> | null {
  const data = payload.data;
  if (!data || typeof data !== "object") return null;
  if (isAuthUser(data)) return null;
  return data as unknown as Record<string, unknown>;
}

function extractTokens(payload: AuthResponseShape | undefined): AuthTokens | null {
  if (!payload) return null;

  const tryRead = (source: Record<string, unknown> | null | undefined, key: string): string | undefined => {
    return readString(source, key);
  };

  const nested = readNestedData(payload);
  const data = payload.data as Record<string, unknown> | undefined;

  // Try sources in order: nested data > data directly > payload top-level > data.tokens > payload.tokens
  let accessToken = tryRead(nested, "accessToken");
  let refreshToken = tryRead(nested, "refreshToken");

  if (!accessToken || !refreshToken) {
    accessToken = accessToken ?? tryRead(data, "accessToken");
    refreshToken = refreshToken ?? tryRead(data, "refreshToken");
  }

  if (!accessToken || !refreshToken) {
    accessToken = accessToken ?? tryRead(payload as never, "accessToken");
    refreshToken = refreshToken ?? tryRead(payload as never, "refreshToken");
  }

  // Try tokens wrapper object
  if (!accessToken || !refreshToken) {
    const dataTokens = data?.tokens as Record<string, unknown> | undefined;
    const payloadTokens = (payload as never as Record<string, unknown>)?.tokens as Record<string, unknown> | undefined;
    const tokensObj = dataTokens ?? payloadTokens;
    if (tokensObj) {
      accessToken = accessToken ?? tryRead(tokensObj, "accessToken");
      refreshToken = refreshToken ?? tryRead(tokensObj, "refreshToken");
    }
  }

  // Try response data at the top level of axios response (response.data itself has tokens)
  if (!accessToken || !refreshToken) {
    const payloadAny = payload as never as Record<string, unknown>;
    const responseData = payloadAny?.data as Record<string, unknown> | undefined;
    if (responseData && typeof responseData === "object" && responseData !== data) {
      accessToken = accessToken ?? tryRead(responseData, "accessToken");
      refreshToken = refreshToken ?? tryRead(responseData, "refreshToken");
    }
  }

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return null;
  }
  return { accessToken, refreshToken };
}

function persistAuthTokens(tokens: AuthTokens): void {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}

export const getGoogleAuthUrl = (redirectTo = "/account/orders"): string => {
  return `${env.apiBaseUrl}/auth/google?redirectTo=${encodeURIComponent(
    redirectTo
  )}`;
};

/**
 * Pulls the AuthUser out of a backend response.
 *
 * Accepts:
 *   { success, data: { user: <AuthUser> } }    preferred
 *   { success, data: <AuthUser> }              data is the user directly
 *   { user: <AuthUser> }                       legacy/flat
 */
function unwrapUser(payload: AuthResponseShape | undefined): AuthUser {
  if (!payload) {
    throw new Error("Empty response from server");
  }

  const nested = readNestedData(payload);
  if (nested) {
    const nestedUser = nested.user;
    if (isAuthUser(nestedUser)) return nestedUser as AuthUser;
  }

  if (isAuthUser(payload.data)) {
    return payload.data;
  }

  if (isAuthUser(payload.user)) {
    return payload.user;
  }

  throw new Error("Server response did not include a user object");
}

/**
 * Authentication service. The single place that talks to /auth endpoints.
 *
 * Functions throw on failure with a normalized Error whose `.message` is
 * safe to display to end users.
 */
export const authService = {
  async register(payload: RegisterPayload): Promise<AuthUser> {
    try {
      const { data } = await apiClient.post<AuthResponseShape>(
        "/auth/register",
        payload
      );
      const tokens = extractTokens(data);
      if (tokens) persistAuthTokens(tokens);
      try {
        return unwrapUser(data);
      } catch {
        return { _id: "", name: payload.name, email: payload.email };
      }
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Registration failed"));
    }
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<AuthResponseShape>(
        "/auth/login",
        payload
      );
      const data = response.data;
      const tokens = extractTokens(data);
      if (!tokens) {
        console.error("[authService] Login response did not include tokens. Full response:", JSON.stringify(data));
        throw new Error("Login response did not include authentication tokens");
      }
      persistAuthTokens(tokens);
      return tokens;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Login failed"));
    }
  },

  async getProfile(): Promise<AuthUser> {
    try {
      const { data } = await apiClient.get<AuthResponseShape>("/auth/me");
      return unwrapUser(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Failed to load profile"));
    }
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    try {
      const { data } = await apiClient.put<AuthResponseShape>(
        "/auth/update",
        payload
      );
      return unwrapUser(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Failed to update profile"));
    }
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      await apiClient.post("/auth/change-password", payload);
    } catch (error) {
      throw new Error(
        extractApiErrorMessage(error, "Failed to change password")
      );
    }
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthResponseShape>(
      "/auth/refresh-token",
      { refreshToken }
    );
    const tokens = extractTokens(data);
    if (!tokens) {
      throw new Error("Refresh response did not include an access token");
    }
    return tokens;
  },

  async getCustomerProfile(): Promise<AuthUser> {
    try {
      const { data } = await apiClient.get<AuthResponseShape>("/customer/me");
      return unwrapUser(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Failed to load profile"));
    }
  },

  async updateCustomerProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    try {
      const { data } = await apiClient.put<AuthResponseShape>(
        "/customer/me",
        payload
      );
      return unwrapUser(data);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Failed to update profile"));
    }
  },

  getGoogleAuthUrl(redirectTo = "/account/orders"): string {
    return `${env.apiBaseUrl}/auth/google?redirectTo=${encodeURIComponent(
      redirectTo
    )}`;
  },

  logout(): void {
    clearAuthStorage();
  },
};
