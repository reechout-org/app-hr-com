/**
 * Human-readable labels for API snake_case statuses (interviews, candidates, etc.).
 */
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In progress",
  invited: "Invited",
  accepted: "Accepted",
  rescheduled: "Rescheduled",
  declined: "Declined",
  completed: "Completed",
  no_show: "No-show",
  screening_passed: "Screening passed",
  screening_rejected: "Screening rejected",
  processing: "Processing",
  scheduled: "Scheduled",
  failed: "Failed",
};

function titleCaseWords(slug: string): string {
  return slug
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** @param fallback — when status is empty (default `"Pending"`). */
export function formatStatusLabel(
  status: string | undefined | null,
  fallback = "Pending",
): string {
  if (status === undefined || status === null || !String(status).trim()) {
    return fallback;
  }
  const key = String(status).trim().toLowerCase();
  if (STATUS_LABELS[key]) return STATUS_LABELS[key];
  return titleCaseWords(key);
}
