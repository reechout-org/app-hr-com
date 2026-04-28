"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { THEME_KEY } from "@/lib/ui/theme";
import { SITE_LOGO } from "@/lib/site/marketing-site";
import { PAGE_SHELL_CLASS } from "@/lib/site/page-layout";
import { cn } from "@/lib/ui/cn";

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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color-light)] bg-background/80 backdrop-blur-md dark:border-white/[0.08]">
      <div className={cn(PAGE_SHELL_CLASS, "flex h-16 items-center justify-between")}>
        <div className="flex items-center gap-2">
          <Image
            src={SITE_LOGO}
            alt="ReechOut Logo"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
          <span className="flex items-baseline text-lg font-extrabold tracking-tight">
            <span className="text-[var(--product-name-color)]">Reech</span>
            <span className="text-[var(--primary-color)] brightness-[1.05]">Out</span>
          </span>
        </div>
        
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color-light)] bg-transparent text-[var(--text-secondary)] transition-colors hover:bg-black/5 hover:text-[var(--text-primary)] dark:border-white/[0.08] dark:hover:bg-white/10 dark:hover:text-white"
        >
          {darkMode ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>
    </header>
  );
}
