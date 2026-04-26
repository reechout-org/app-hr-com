"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Landing when an interview has no screening step (matches Angular redirect target
 * `/interview/share/:id` which was not wired to a component in Angular routes).
 * Candidates must open the personalized link from their email (`/interview/share/:id/candidate/:candidateId?token=...`).
 */
export default function InterviewShareInterviewOnlyPage() {
  const { id: interviewId } = useParams() as { id: string };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[300px] bg-gradient-to-b from-[var(--primary-color)]/5 to-transparent" />
      <div className="relative z-10 w-full max-w-lg rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] p-8 shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.08)] backdrop-blur-xl sm:p-10">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--warning-color)]/10">
          <AlertCircle className="h-8 w-8 text-[var(--warning-color)]" />
        </div>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Use your email link
        </h1>
        <p className="mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          This interview does not use the public screening form, or you need the <strong>personal</strong> link from your invitation email
          (it includes your candidate ID and access token).
        </p>
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[var(--header-floating-border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-secondary)]">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-color)]" />
          <span>
            Interview reference: <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">{interviewId}</code>
          </span>
        </div>
        <Button asChild className="w-full rounded-xl" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
