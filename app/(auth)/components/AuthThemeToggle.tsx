"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { THEME_KEY } from "@/lib/ui/theme";

export function AuthThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    if (initial === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    requestAnimationFrame(() => {
      setDarkMode(root.classList.contains("dark"));
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    const next = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    setDarkMode(next === "dark");
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={toggleTheme}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-[var(--header-floating-border)] bg-transparent text-[var(--text-on-purple)] transition-[border-color,background-color,color] duration-200 hover:border-[var(--accent-purple)] hover:bg-white/[0.05] hover:text-[var(--accent-purple)] dark:hover:bg-white/[0.08]"
      >
        {darkMode ? (
          <Sun className="h-5 w-5" aria-hidden strokeWidth={2} />
        ) : (
          <Moon className="h-5 w-5" aria-hidden strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
