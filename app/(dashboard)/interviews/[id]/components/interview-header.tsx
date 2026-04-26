"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  Users,
} from "lucide-react";

import type { Interview } from "@/lib/api/interviews";
import { cn } from "@/lib/ui/cn";
import { formatStatusLabel } from "@/lib/ui/format-status-label";
import { Button } from "@/components/ui/button";

interface InterviewDetailHeaderProps {
  interview: Interview;
  onShareLink: () => void;
}

export function InterviewDetailHeader({
  interview,
  onShareLink,
}: InterviewDetailHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "border-[rgba(var(--success-color-rgb),0.15)] bg-gradient-to-br from-[rgba(var(--success-color-rgb),0.08)] to-[rgba(var(--success-color-rgb),0.04)] text-[var(--success-color)]";
      case "processing":
      case "scheduled":
      case "in_progress":
        return "border-[rgba(var(--brand-blue-modern-rgb),0.15)] bg-gradient-to-br from-[rgba(var(--brand-blue-modern-rgb),0.08)] to-[rgba(var(--brand-blue-modern-rgb),0.04)] text-[var(--brand-blue-modern)]";
      case "failed":
        return "border-[rgba(var(--error-color-rgb),0.15)] bg-gradient-to-br from-[rgba(var(--error-color-rgb),0.08)] to-[rgba(var(--error-color-rgb),0.04)] text-[var(--error-color)]";
      default:
        return "border-[rgba(var(--warning-color-rgb),0.15)] bg-gradient-to-br from-[rgba(var(--warning-color-rgb),0.08)] to-[rgba(var(--warning-color-rgb),0.04)] text-[var(--warning-color)]";
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-6 rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-5 sm:p-6 shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09)] transition-all hover:shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.08)] hover:border-[rgba(var(--primary-color-rgb),0.28)] md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {interview.questionnaire_title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-xl border px-2.5 py-1 text-xs font-bold capitalize tracking-wide shadow-sm",
              getStatusColor(interview.status || 'pending')
            )}
          >
            {formatStatusLabel(interview.status)}
          </span>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Calendar className="h-4 w-4" />
            <span>
              {interview.scheduled_date
                ? format(new Date(interview.scheduled_date), "MMM d, yyyy h:mm a")
                : "No date set"}
            </span>
          </div>
          {interview.deadline && (
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Clock className="h-4 w-4" />
              <span>
                Deadline: {format(new Date(interview.deadline), "MMM d, yyyy")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Users className="h-4 w-4" />
            <span>
              {interview.candidates?.length || 0} Candidate
              {interview.candidates?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 mt-2 md:mt-0">
        <Button
          variant="outline"
          className="h-10 rounded-xl border-[var(--header-floating-border)] bg-background text-[var(--text-primary)] hover:bg-[var(--surface-2)] shadow-sm"
          onClick={onShareLink}
        >
          <LinkIcon className="mr-2 h-4 w-4 text-[var(--text-muted)]" />
          Invite by Link
        </Button>
      </div>
    </div>
  );
}
