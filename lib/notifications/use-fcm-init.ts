"use client";

import { useEffect, useRef } from "react";

import { authApi } from "@/lib/api/auth";
import { hasClientSession } from "@/lib/auth/auth-token";
import { getFirebaseConfig } from "@/lib/config/firebase-config";
import { useNotificationStore, type QuestionnaireUpdate } from "@/lib/store/notification-store";

/**
 * Utility to track devices matching the old Angular `generateDeviceId`.
 * Stored in LocalStorage directly.
 */
function getDeviceId(): string {
  const key = "fcm_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `web_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/** Helper to parse notification payload and set global state */
function processNotification(
  payload: any,
  setLatestUpdate: (update: QuestionnaireUpdate) => void,
) {
  const data = payload?.data;
  if (data?.type && data?.questionnaire_id) {
    setLatestUpdate({
      questionnaireId: data.questionnaire_id,
      title: data.questionnaire_title || "Questionnaire",
      questionCount: parseInt(data.question_count || "0", 10),
      type: data.type as any,
      error: data.error,
    });
  }
}

/** Triggers a browser native notification */
function showBrowserNotification(payload: any) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const title = payload?.notification?.title || "New Notification";
  new Notification(title, {
    body: payload?.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: payload?.data?.questionnaire_id || "notification",
    requireInteraction: false,
    silent: false,
  });
}

/**
 * Next.js equivalent of Angular's NotificationService constructor logic.
 * Declaratively initializes when a session exists (`token` in localStorage), so it
 * still runs after a full page refresh (Zustand `user` is not rehydrated).
 * Session = access or refresh token in localStorage.
 */
export function useFcmInit() {
  const setLatestUpdate = useNotificationStore((s) => s.setLatestUpdate);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasClientSession()) {
      isInitialized.current = false;
      return;
    }
    if (isInitialized.current) return;

    const initFirebase = async () => {
      try {
        isInitialized.current = true;

        // 1. Dynamic imports to avoid loading heavy Firebase SDK for unauthenticated users
        const { initializeApp, getApps } = await import("firebase/app");
        const { getMessaging, getToken, onMessage } = await import("firebase/messaging");

        const config = getFirebaseConfig();
        const apps = getApps();
        const app = apps.length === 0 ? initializeApp(config) : apps[0];

        // Ensure ServiceWorker is supported before trying to request messaging
        if (!("serviceWorker" in navigator)) return;

        const messaging = getMessaging(app);

        // 2. Request Notification Permissions & Register Token
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, { vapidKey: config.vapidKey });
          if (token) {
            await authApi.registerFCMToken(token, getDeviceId()).catch(console.error);
          }
        }

        // 3. Foreground Messages
        onMessage(messaging, (payload) => {
          console.log("[useFcmInit] Foreground message:", payload);
          processNotification(payload, setLatestUpdate);
          showBrowserNotification(payload);
        });

        // 4. Background Messages (Service Worker 'postMessage')
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "BACKGROUND_NOTIFICATION") {
            processNotification(event.data.payload, setLatestUpdate);
          }
        });

        // 5. Background Messages (BroadcastChannel approach)
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("fcm-notifications");
          bc.onmessage = (event) => {
            if (event.data?.type === "BACKGROUND_NOTIFICATION") {
              processNotification(event.data.payload, setLatestUpdate);
            }
          };
        }

        // 6. Drain pending-notifications cache when tab becomes visible
        async function drainPendingNotifications() {
          if (!("caches" in window)) return;
          try {
            const cache = await caches.open("pending-notifications");
            const keys = await cache.keys();
            for (const request of keys) {
              const response = await cache.match(request);
              if (response) {
                const data = await response.json();
                if (data?.payload) processNotification(data.payload, setLatestUpdate);
                await cache.delete(request);
              }
            }
          } catch { /* ignore */ }
        }

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") drainPendingNotifications();
        });
      } catch (error) {
        console.error("[useFcmInit] Error initializing FCM:", error);
        isInitialized.current = false; // Allow retrying on failure
      }
    };

    initFirebase();
  }, [setLatestUpdate]);
}
