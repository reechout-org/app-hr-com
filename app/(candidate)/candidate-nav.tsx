"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { THEME_KEY } from "@/lib/ui/theme";
import { SITE_LOGO } from "@/lib/site/marketing-site";
import { Button } from "@/components/ui/button";

export function CandidateNav() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";

    if (initial === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    setTimeout(() => setDarkMode(root.classList.contains("dark")), 0);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    const next = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    setDarkMode(next === "dark");
  }, []);

  return (
    <header className="sticky top-2 z-40 flex w-full flex-col items-stretch px-4 sm:top-4 sm:px-6 lg:px-8 mb-2 sm:mb-4">
      <div className="mx-auto flex w-full max-w-[1400px] min-h-[52px] shrink-0 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] py-3 px-[clamp(0.875rem,2.5vw,1.125rem)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09),0_1px_4px_rgba(var(--shadow-rgb),0.05)] sm:px-[clamp(1.125rem,3.5vw,1.5rem)] lg:px-[clamp(1.25rem,4vw,2rem)]">
        {/* Left: Logo & Product Name */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5 outline-none rounded-md">
          <Image
            src={SITE_LOGO}
            alt="ReechOut Logo"
            width={40}
            height={40}
            className="h-8 w-auto max-w-full object-contain md:h-10"
          />
          <span className="ml-0.5 flex items-baseline gap-0 text-lg font-extrabold tracking-tight md:text-xl">
            <span className="text-[var(--product-name-color)]">Reech</span>
            <span className="text-[var(--primary-color)] brightness-[1.05]">
              Out
            </span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="h-8 w-8 shrink-0 bg-transparent md:h-10 md:w-10"
          >
            {darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} /> : <Moon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
