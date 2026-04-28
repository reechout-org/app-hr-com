import Link from "next/link";

export function CandidateFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full flex-col items-stretch px-4 sm:px-6 lg:px-8 mt-auto mb-2 sm:mb-4 pt-4 sm:pt-8">
      <div className="mx-auto flex w-full max-w-[1400px] min-h-[52px] items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] py-3 px-[clamp(0.875rem,2.5vw,1.125rem)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09),0_1px_4px_rgba(var(--shadow-rgb),0.05)] sm:px-[clamp(1.125rem,3.5vw,1.5rem)] lg:px-[clamp(1.25rem,4vw,2rem)] flex-col sm:flex-row">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          © {year} ReechOut. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-[var(--text-secondary)]">
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
