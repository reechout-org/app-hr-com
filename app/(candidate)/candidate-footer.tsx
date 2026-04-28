import Link from "next/link";
import { PAGE_SHELL_CLASS } from "@/lib/site/page-layout";
import { cn } from "@/lib/ui/cn";

export function CandidateFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border-color-light)] bg-transparent py-8 dark:border-white/[0.08]">
      <div className={cn(PAGE_SHELL_CLASS, "flex flex-col items-center justify-between gap-4 md:flex-row")}>
        <p className="text-sm text-[var(--text-secondary)]">
          © {year} ReechOut. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-[var(--text-muted)]">
          <Link href="/privacy-policy" className="hover:text-[var(--primary-color)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-[var(--primary-color)] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
