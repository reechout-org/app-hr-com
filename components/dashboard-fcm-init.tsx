"use client";

import { useFcmInit } from "@/lib/notifications/use-fcm-init";

/**
 * Mount once under the dashboard layout so FCM matches Angular post-login
 * `NotificationService.initializeNotifications`.
 */
export function DashboardFcmInit() {
  useFcmInit();
  return null;
}
