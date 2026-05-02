"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { PageAmbientBackground } from "@/components/page-ambient-background";

/**
 * Root shell for auth routes — same gradient + ambient layer as the marketing hero
 * so the canvas behind the form reads as the same product.
 */
export function AuthPageRoot({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh w-full items-stretch bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      {children}
    </div>
  );
}

/**
 * Right column wrapper. Decoration is provided by `AuthPageRoot`'s ambient layer;
 * this stays transparent so the gradient/aurora bleeds through behind the form card.
 */
export function AuthRightColumn({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] flex min-h-dvh w-full min-w-0 flex-1 flex-col bg-transparent pt-[clamp(1rem,4vh,2.25rem)] pb-[clamp(1rem,4vh,4rem)] max-lg:pl-[clamp(1.25rem,5.5vw,2.5rem)] max-lg:pr-[6%] max-md:px-[5%] max-md:pl-[clamp(1rem,5vw,1.75rem)] lg:px-8">
      {children}
    </div>
  );
}

export function AuthFormStack({ children }: { children: ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="relative z-[1] mx-auto flex w-full max-w-[460px] flex-col gap-[clamp(14px,2.4vh,22px)] max-md:w-[92%]"
    >
      {children}
    </motion.div>
  );
}

export function AuthMobileLogoRow({ children }: { children: ReactNode }) {
  return (
    <div className="hidden w-full max-lg:flex max-lg:justify-start max-lg:pl-[clamp(8px,2.5vw,20px)]">
      {children}
    </div>
  );
}

export function AuthFooterSlot({ children }: { children: ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative z-[2] mt-auto pt-6 pb-4 text-center"
    >
      {children}
    </motion.div>
  );
}

/** Centers the form card stack vertically in the remaining space above the footer. */
export function AuthRightMain({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] flex w-full flex-1 flex-col items-center justify-center px-1 py-[clamp(12px,3vh,40px)]">
      {children}
    </div>
  );
}
