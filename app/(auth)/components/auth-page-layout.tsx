"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Root shell for auth routes: animated orbs + flex row for left marketing panel + right form.
 */
export function AuthPageRoot({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      <div
        className="pointer-events-none absolute -right-[150px] -top-[150px] z-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(var(--primary-color-rgb),0.14)_0%,rgba(var(--accent-violet-rgb),0.07)_45%,transparent_70%)] blur-[80px] motion-reduce:animate-none [animation:authOrb1_18s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[150px] -left-[100px] z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(var(--primary-color-rgb),0.1)_0%,rgba(var(--accent-violet-rgb),0.05)_45%,transparent_70%)] blur-[90px] motion-reduce:animate-none [animation:authOrb2_24s_ease-in-out_infinite_reverse] [animation-delay:-8s]"
        aria-hidden
      />
      {children}
    </div>
  );
}

/**
 * Right column: grid overlay + glow. Pass a main flex area + `AuthFooterSlot` as siblings.
 */
export function AuthRightColumn({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] flex min-h-screen min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-transparent pt-9 max-lg:pl-[clamp(1.25rem,5.5vw,2.5rem)] max-lg:pr-[6%] max-lg:pt-[4vh] max-md:px-[5%] max-md:pb-4 max-md:pl-[clamp(1rem,5vw,1.75rem)] max-md:pt-[5vh] lg:px-5 lg:pb-16 lg:pl-7 lg:pr-5">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(var(--color-primary-rgb),0.12)_0%,rgba(var(--color-primary-rgb),0.04)_50%,transparent_70%)] bg-[length:64px_64px,64px_64px,100%_100%] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(var(--color-primary-rgb),0.14)_0%,rgba(var(--color-primary-rgb),0.05)_50%,transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-120px] right-[-120px] z-0 h-[560px] w-[560px] rounded-full bg-[rgba(var(--color-primary-rgb),0.07)] blur-[100px]"
        aria-hidden
      />
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
      className="relative z-[1] flex w-full max-w-[460px] flex-col gap-[22px] max-lg:w-[85%] max-lg:max-w-full max-md:w-[92%]"
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
      className="absolute bottom-6 left-0 right-0 z-[2] text-center max-md:relative max-md:mt-6 max-md:pb-4"
    >
      {children}
    </motion.div>
  );
}

/** Centers the form card stack vertically in the remaining space above the footer. */
export function AuthRightMain({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] flex w-full flex-1 flex-col items-center justify-center px-1 py-6 lg:py-10">
      {children}
    </div>
  );
}
