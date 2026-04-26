import { apiClient } from "./client";
import { AUTH_API_PATHS } from "./auth-endpoints";
import type {
  ApiEnvelope,
  LoginApiResponse,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/auth/types";
import { clearAccessToken } from "@/lib/auth/auth-token";

function assertLoginData(
  data: LoginApiResponse["data"] | null | undefined,
  message: string,
): asserts data is LoginApiResponse["data"] {
  if (!data?.access || !data?.refresh) {
    throw new Error(message);
  }
}

function normalizeLoginPayload(
  emailOrPayload: string | LoginPayload,
  password?: string,
): LoginPayload {
  if (typeof emailOrPayload === "string") {
    return { email: emailOrPayload, password: password ?? "" };
  }
  return emailOrPayload;
}

function normalizeSignupPayload(
  firstOrPayload: string | SignupPayload,
  last_name?: string,
  email?: string,
  password?: string,
): SignupPayload {
  if (typeof firstOrPayload === "string") {
    return {
      first_name: firstOrPayload,
      last_name: last_name ?? "",
      email: email ?? "",
      password: password ?? "",
    };
  }
  return firstOrPayload;
}

/**
 * Mirrors `app_hr_com/src/app/services/auth/auth.service.ts` — same URLs, bodies, and
 * response shapes the Angular `HttpClient` sees.
 */
export const authApi = {
  /**
   * `POST ${apiUrl}/auth/login` with `{ email, password }`.
   * Same as `AuthService.login(email, password)`.
   */
  login: async (
    emailOrPayload: string | LoginPayload,
    password?: string,
  ): Promise<LoginApiResponse> => {
    const body = normalizeLoginPayload(emailOrPayload, password);
    const { data } = await apiClient.post<LoginApiResponse>(AUTH_API_PATHS.login, body);
    assertLoginData(data.data, data.message || "Login failed");
    return data;
  },

  /**
   * `POST ${apiUrl}/auth/signup` with `{ first_name, last_name, email, password }`.
   * Same as `AuthService.signup(first_name, last_name, email, password)`.
   */
  signup: async (
    firstOrPayload: string | SignupPayload,
    last_name?: string,
    email?: string,
    password?: string,
  ): Promise<ApiEnvelope<unknown>> => {
    const body = normalizeSignupPayload(firstOrPayload, last_name, email, password);
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(AUTH_API_PATHS.signup, body);
    return data;
  },

  /**
   * `POST ${apiUrl}/auth/forgot-password` with `{ email }`.
   * Same as `AuthService.forgotPassword(email)`.
   */
  forgotPassword: async (email: string): Promise<ApiEnvelope<null>> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(AUTH_API_PATHS.forgotPassword, {
      email,
    });
    return data;
  },

  /**
   * `POST ${apiUrl}/auth/reset-password` with `{ token, password }`.
   * Same as `AuthService.resetPassword(token, password)`.
   */
  resetPassword: async (token: string, password: string): Promise<ApiEnvelope<unknown>> => {
    const body: ResetPasswordPayload = { token, password };
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      AUTH_API_PATHS.resetPassword,
      body,
    );
    return data;
  },

  /**
   * `POST ${apiUrl}/auth/fcm-token` with `{ token, device_id, device_type }`.
   * Matches Angular `NotificationService.registerFCMToken` (`device_type: 'web'`).
   */
  registerFCMToken: async (token: string, deviceId: string): Promise<ApiEnvelope<unknown>> => {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(AUTH_API_PATHS.registerFCMToken, {
      token,
      device_id: deviceId,
      device_type: "web",
    });
    return data;
  },
};

/**
 * Same as `AuthService.logout()` — removes only `localStorage` key `token`.
 * (Angular does not remove a separate refresh key; the SPA also stores only `access` as `token`.)
 * Prefer `useAuthStore.getState().clearAuth()` when signing out of Next.js (clears refresh + cache).
 */
export function authLogoutLocal(): void {
  clearAccessToken();
}
