/**
 * JWT storage aligned with `app_hr_com/src/app/services/auth/auth.service.ts`.
 * - Access JWT is stored as `token` (see `login.component.ts`: `localStorage.setItem('token', response.data.access)`).
 * - Refresh is also persisted for the Next.js axios refresh interceptor (`auth/login/refresh/`); Angular does not
 *   store `refresh` in localStorage, only types it on the login response.
 */

const ACCESS_KEY = "token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
}

export function clearRefreshToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFRESH_KEY);
}

export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}

/** True if either JWT is in localStorage (client only). */
export function hasClientSession(): boolean {
  if (typeof window === "undefined") return false;
  return !!(getAccessToken() || getRefreshToken());
}
