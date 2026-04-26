"use client";

import Image from "next/image";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";

import { cn } from "@/lib/ui/cn";
import { SITE_LOGO } from "@/lib/site/marketing-site";

export interface FloatingBtnProps extends ComponentPropsWithoutRef<"button"> {
  /**
   * The text to display when the action expands (pointer hover / focus).
   */
  text?: string;
}

export function FloatingBtn({
  text = "New Resource",
  className,
  onClick: onClickProp,
  ...props
}: FloatingBtnProps) {
  const [allowExpand, setAllowExpand] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only expand on hover for devices that support fine pointers
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => setAllowExpand(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const expanded = allowExpand && isHovered;

  const navLike =
    "border-[var(--header-floating-border)] bg-[var(--header-floating-bg)] shadow-[0_4px_32px_rgba(var(--shadow-rgb),0.09),0_1px_4px_rgba(var(--shadow-rgb),0.05)]";

  return (
    // UX Positioning: Bottom-right is kept but spacing is increased (bottom-8/right-8)
    // to give it a premium feel and avoid overlapping with scrollbars or future chat widgets.
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      <button
        {...props}
        type="button"
        aria-label={text}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn(
          "group relative flex flex-row-reverse items-center rounded-full p-1.5",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", // Spring-like easing
          "border outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          expanded ? cn("scale-105", navLike) : cn("scale-100", navLike),
          "active:scale-95",
          className
        )}
        onClick={onClickProp}
      >
        {/* Logo inner disc — circular, matches classic FAB */}
        <div
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background transition-all duration-300",
            expanded ? "shadow-sm scale-95" : "shadow-none scale-100"
          )}
        >
          <Image
            src={SITE_LOGO}
            alt="App Logo"
            width={40}
            height={40}
            className={cn(
              "h-8 w-8 object-contain transition-transform duration-700 ease-in-out",
              expanded ? "rotate-[360deg]" : "rotate-0"
            )}
          />
        </div>

        {/* Expanding Text Rail (expands to the left because of flex-row-reverse) */}
        <div
          className={cn(
            "flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            expanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
          )}
        >
          <span className="whitespace-nowrap pl-4 pr-3 font-semibold tracking-wide text-[var(--text-primary)] text-sm md:text-base">
            {text}
          </span>
        </div>
      </button>
    </div>
  );
}
