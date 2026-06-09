/**
 * Authentication-related TypeScript types.
 *
 * The backend's response shape is wrapped by the service layer so consumers
 * never need to know whether the API returns `{ data }`, `{ user }`, etc.
 */

export type UserRole = "admin" | "superadmin" | "customer";

export const ADMIN_ROLES: ReadonlyArray<UserRole> = ["admin", "superadmin"];

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role !== null && role !== undefined && ADMIN_ROLES.includes(role);
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType?: "user" | "customer";
}

export interface LoginPayload {
  email: string;
  password: string;
  accountType?: "user" | "customer";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  address?: string;
  accountType?: "user" | "customer";
}

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthErrorPayload {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
}
