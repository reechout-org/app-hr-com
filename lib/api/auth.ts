import { apiClient } from "./client";
import { AUTH_API_PATHS } from "./auth-endpoints";
import type {
  ApiEnvelope,
  AuthEnvelopeData,
  AuthMeUser,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/lib/auth/types";

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
  recaptcha_token?: string,
): SignupPayload {
  if (typeof firstOrPayload === "string") {
    return {
      first_name: firstOrPayload,
      last_name: last_name ?? "",
      email: email ?? "",
      password: password ?? "",
      recaptcha_token: recaptcha_token ?? "",
    };
  }
  return firstOrPayload;
}

/**
 * Auth endpoints — tokens live in httpOnly cookies; the body carries only the
 * current user profile. `withCredentials: true` is set on the shared client.
 */
export const authApi = {
  login: async (
    emailOrPayload: string | LoginPayload,
    password?: string,
  ): Promise<ApiEnvelope<AuthEnvelopeData>> => {
    const body = normalizeLoginPayload(emailOrPayload, password);
    const { data } = await apiClient.post<ApiEnvelope<AuthEnvelopeData>>(AUTH_API_PATHS.login, body);
    return data;
  },

  signup: async (
    firstOrPayload: string | SignupPayload,
    last_name?: string,
    email?: string,
    password?: string,
    recaptcha_token?: string,
  ): Promise<ApiEnvelope<AuthEnvelopeData>> => {
    const body = normalizeSignupPayload(
      firstOrPayload,
      last_name,
      email,
      password,
      recaptcha_token,
    );
    const { data } = await apiClient.post<ApiEnvelope<AuthEnvelopeData>>(AUTH_API_PATHS.signup, body);
    return data;
  },

  /** Clears server-side refresh row + clears cookies. Safe to call even if already signed out. */
  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_API_PATHS.logout, null);
  },

  forgotPassword: async (email: string): Promise<ApiEnvelope<null>> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(AUTH_API_PATHS.forgotPassword, {
      email,
    });
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiEnvelope<unknown>> => {
    const body: ResetPasswordPayload = { token, password };
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      AUTH_API_PATHS.resetPassword,
      body,
    );
    return data;
  },

  registerFCMToken: async (token: string, deviceId: string): Promise<ApiEnvelope<unknown>> => {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(AUTH_API_PATHS.registerFCMToken, {
      token,
      device_id: deviceId,
      device_type: "web",
    });
    return data;
  },

  getMe: async (): Promise<ApiEnvelope<AuthMeUser>> => {
    const { data } = await apiClient.get<ApiEnvelope<AuthMeUser>>(AUTH_API_PATHS.me);
    return data;
  },

  verifyEmail: async (code: string): Promise<ApiEnvelope<AuthMeUser>> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthMeUser>>(AUTH_API_PATHS.verifyEmail, { code });
    return data;
  },

  resendVerification: async (): Promise<ApiEnvelope<null>> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(AUTH_API_PATHS.resendVerification, {});
    return data;
  },

  completeCompanyProfile: async (payload: {
    company_name: string;
    company_email: string;
    company_website: string;
    intended_use: string;
  }): Promise<ApiEnvelope<AuthMeUser>> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthMeUser>>(
      AUTH_API_PATHS.completeCompanyProfile,
      payload,
    );
    return data;
  },

  updateProfile: async (payload: {
    first_name: string;
    last_name: string;
  }): Promise<ApiEnvelope<AuthMeUser>> => {
    const { data } = await apiClient.patch<ApiEnvelope<AuthMeUser>>(
      AUTH_API_PATHS.updateMe,
      payload,
    );
    return data;
  },

  uploadAvatar: async (file: File): Promise<ApiEnvelope<AuthMeUser>> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<AuthMeUser>>(
      AUTH_API_PATHS.uploadAvatar,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  changePassword: async (payload: {
    current_password: string;
    new_password: string;
  }): Promise<ApiEnvelope<null>> => {
    const { data } = await apiClient.post<ApiEnvelope<null>>(
      AUTH_API_PATHS.changePassword,
      payload,
    );
    return data;
  },
};
