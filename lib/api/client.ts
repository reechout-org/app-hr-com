import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/auth/auth-token";
import type { ApiEnvelope, TokenPair } from "@/lib/auth/types";
import { getPublicApiBaseUrl } from "@/lib/config/env";
import { AUTH_API_PATHS } from "@/lib/api/auth-endpoints";
import { queryClient } from "@/lib/query/query-client";
import { useLoaderStore } from "@/stores/loader-store";

/** Same as Angular `skip-loading` header on HttpRequest. */
export const SKIP_LOADING_HEADER = "skip-loading";

function shouldSkipLoading(config: InternalAxiosRequestConfig): boolean {
  const headers = config.headers;
  if (!headers) return false;
  const v = headers.get?.(SKIP_LOADING_HEADER) ?? headers[SKIP_LOADING_HEADER];
  return v === "true" || v === true;
}

function onClient(fn: () => void) {
  if (typeof window !== "undefined") fn();
}

/**
 * Bare client for refresh only — avoids going through interceptors / refresh loop.
 */
const refreshHttp = axios.create({
  baseURL: getPublicApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

async function redirectToLogin() {
  queryClient.clear();
  const { useAuthStore } = await import("@/lib/store/auth.store");
  useAuthStore.getState().clearAuth();
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (!path.startsWith("/login")) {
      window.location.assign("/login");
    }
  }
}

function isAuthLoginUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("auth/login") && !url.includes("refresh");
}

function isRefreshUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("auth/login/refresh");
}

/** Single in-flight refresh so parallel 401s share one token rotation. */
let refreshPromise: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    const p = (async () => {
      const refresh = getRefreshToken();
      if (!refresh) {
        throw new Error("No refresh token");
      }
      const { data: envelope } = await refreshHttp.post<ApiEnvelope<TokenPair>>(
        AUTH_API_PATHS.loginRefresh,
        { refresh },
        { headers: { [SKIP_LOADING_HEADER]: "true" } },
      );
      const tokens = envelope?.data;
      if (!tokens?.access) {
        throw new Error(envelope?.message || "Session expired");
      }
      setAccessToken(tokens.access);
      if (tokens.refresh) {
        setRefreshToken(tokens.refresh);
      }
    })();
    refreshPromise = p.finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Shared Axios instance: Bearer token, loader overlay, 401 + refresh (RegulateIQ-style),
 * aligned with ReechOut Django `/auth/*` and `CustomResponse` errors.
 */
export const apiClient = axios.create({
  baseURL: getPublicApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!shouldSkipLoading(config)) {
      onClient(() => useLoaderStore.getState().show());
    }

    return config;
  },
  (error) => {
    onClient(() => useLoaderStore.getState().hide());
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config;
    if (!shouldSkipLoading(config)) {
      onClient(() => useLoaderStore.getState().hide());
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (config && !shouldSkipLoading(config)) {
      onClient(() => useLoaderStore.getState().hide());
    }

    if (!error.response || error.response.status !== 401 || !config) {
      return Promise.reject(error);
    }

    const url = config.url ?? "";
    if (isAuthLoginUrl(url) || isRefreshUrl(url)) {
      return Promise.reject(error);
    }

    if (config._retry) {
      await redirectToLogin();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      await refreshAccessToken();
    } catch {
      await redirectToLogin();
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return apiClient(config);
  },
);

export function parseApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "An unexpected error occurred.";
  }

  const raw = error.response?.data as
    | ApiEnvelope<unknown>
    | { detail?: string | { message?: string } }
    | undefined;

  if (raw && typeof raw === "object" && "detail" in raw) {
    const d = raw.detail;
    if (typeof d === "string") {
      return d;
    }
    if (d && typeof d === "object" && "message" in d && typeof (d as { message: string }).message === "string") {
      return (d as { message: string }).message;
    }
  }

  const body = error.response?.data as ApiEnvelope<unknown> | undefined;
  if (body?.message) {
    return body.message;
  }

  const err = body?.error;
  if (typeof err === "string") {
    return err;
  }
  if (err && typeof err === "object" && "detail" in err) {
    const d = (err as { detail?: unknown }).detail;
    if (typeof d === "string") {
      return d;
    }
    if (Array.isArray(d) && d[0] && typeof d[0] === "object" && "message" in (d[0] as object)) {
      return String((d[0] as { message: string }).message);
    }
  }

  return error.message || "An unexpected error occurred.";
}

export function parseFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {};
  const body = error.response?.data as ApiEnvelope<unknown> | undefined;
  const err = body?.error;
  if (!err || typeof err !== "object" || Array.isArray(err)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(err as Record<string, unknown>)) {
    if (k === "detail") continue;
    if (Array.isArray(v) && v[0] != null) {
      out[k] = String(v[0]);
    } else if (typeof v === "string") {
      out[k] = v;
    }
  }
  return out;
}
