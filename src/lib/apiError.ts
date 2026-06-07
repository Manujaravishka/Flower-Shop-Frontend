import { AxiosError } from "axios";
import type { AuthErrorPayload } from "@/types/auth";

/**
 * Pulls a human-readable message out of an unknown error.
 *
 * - For axios errors with a JSON body, it prefers `message`, then aggregates any
 *   field-level validation messages from `errors`, and finally falls back to the
 *   provided `fallback` string.
 * - For everything else (network failures, etc.) it returns the fallback.
 */
export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  if (error instanceof AxiosError) {
    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }

    const data = error.response.data as AuthErrorPayload | string | undefined;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      if (data.message && typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
      if (data.error && typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
      if (data.errors) {
        const flattened = flattenFieldErrors(data.errors);
        if (flattened) return flattened;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function flattenFieldErrors(errors: AuthErrorPayload["errors"]): string {
  if (!errors) return "";
  const parts: string[] = [];
  for (const [field, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      if (value.length) parts.push(`${field}: ${value.join(", ")}`);
    } else if (typeof value === "string" && value) {
      parts.push(`${field}: ${value}`);
    }
  }
  return parts.join("\n");
}
