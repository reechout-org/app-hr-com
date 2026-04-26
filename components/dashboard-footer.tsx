"use client";

import { cn } from "@/lib/ui/cn";

export function DashboardFooter({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "mt-auto w-full px-4 sm:px-6 lg:px-8 sm:pb-2",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1400px] rounded-t-[var(--radius-md)] rounded-b-none border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] py-3.5 text-center text-sm text-[var(--text-secondary)] sm:py-4",
          "px-[clamp(0.875rem,2.5vw,1.125rem)] sm:px-[clamp(1.125rem,3.5vw,1.5rem)] lg:px-[clamp(1.25rem,4vw,2rem)]"
        )}
      >
        © {currentYear} Copyright ReechOut Ltd. All Rights Reserved
      </div>
    </footer>
  );
}
