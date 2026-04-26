"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useNotificationStore } from "@/lib/store/notification-store";

const TERMINAL_TYPES = new Set([
  "questionnaire_completed",
  "questionnaire_regenerated",
  "questionnaire_failed",
  "completed",
  "regenerated",
  "failed",
]);

/**
 * When FCM reports a questionnaire finished (or failed), refresh the paginated list.
 * Aligns with legacy in-app list updates; uses React Query invalidation.
 */
export function useQuestionnaireListFcmInvalidation() {
  const queryClient = useQueryClient();
  const latestUpdate = useNotificationStore((s) => s.latestUpdate);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!latestUpdate) return;
    const raw = String(latestUpdate.type);
    const shouldRefresh =
      TERMINAL_TYPES.has(raw) ||
      /questionnaire_(completed|regenerated|failed)$/.test(raw);

    if (!shouldRefresh) return;

    const dedupeKey = `${latestUpdate.questionnaireId}-${raw}`;
    if (lastKey.current === dedupeKey) return;
    lastKey.current = dedupeKey;

    queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
  }, [latestUpdate, queryClient]);
}
