"use client";

import Image from "next/image";
import { Fragment } from "react";
import { motion } from "framer-motion";

import { HOME_HERO_BADGE, HOME_HERO_TIP } from "@/app/home-content";
import { PAGE_SHELL_CLASS } from "@/components/page-shell";
import { PrimaryCtaLink } from "./home/primary-cta-link";
import { HeroParticleBackground } from "./hero-particle-background";

const STATS = [
  { v: "1.5K+", l: "Phone interviews conducted" },
  { v: "1.25K+", l: "HR hours saved" },
  { v: "96%", l: "Interview accuracy" },
] as const;

/** Cubic-bezier tuple — `as const` so Framer Motion types `ease` as `Easing`, not `number[]`. */
const HERO_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: HERO_EASE,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: HERO_EASE,
      delay: 0.6,
    },
  },
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden pt-[calc(var(--site-nav-height)+clamp(2rem,5vw,3.5rem))] pb-[clamp(3rem,8vw,5rem)]"
      aria-label="Hero Section"
    >
      <HeroParticleBackground />
      
      <motion.div 
        className={`relative z-[2] ${PAGE_SHELL_CLASS}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <motion.div
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[rgba(var(--primary-color-rgb),0.22)] bg-[rgba(var(--primary-color-rgb),0.08)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--primary-color)] dark:border-[rgba(var(--accent-violet-rgb),0.3)] dark:bg-[rgba(var(--primary-color-rgb),0.12)] dark:text-[var(--accent-violet)]"
            variants={itemVariants}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 animate-[roBadgePulse_2s_ease-in-out_infinite] rounded-full bg-[var(--primary-color)] dark:bg-[#c4b5fd]"
              aria-hidden
            />
            {HOME_HERO_BADGE}
          </motion.div>

          <motion.h1 
            className="mb-4 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--text-heading)] md:mb-6"
            variants={itemVariants}
          >
            <span className="block">Too many applicants.</span>
            <span className="mt-1 block">
              Still not sure{" "}
              <span className="relative inline-block bg-[length:200%_auto] bg-gradient-to-br from-[var(--primary-color)] via-[var(--accent-violet)] to-[var(--accent-pink)] bg-clip-text text-transparent animate-[hero-gradient-shift_3s_ease_infinite] after:absolute after:bottom-1 after:left-0 after:right-0 after:h-1 after:rounded-sm after:bg-gradient-to-r after:from-[var(--primary-color)] after:via-[var(--accent-violet)] after:to-[var(--accent-pink)] after:opacity-30 after:content-['']">
                who to hire
              </span>
              ?
            </span>
          </motion.h1>

          <motion.p 
            className="mb-5 max-w-[42rem] text-[clamp(0.95rem,1.5vw,1.125rem)] leading-[1.65] text-[var(--text-secondary)] md:mb-6"
            variants={itemVariants}
          >
            Resumes are AI-written. Everyone looks qualified. ReechOut shows you
            how candidates actually think so you know who to move forward with.
          </motion.p>

          <motion.div 
            className="mb-6 flex flex-wrap items-center justify-center gap-4 md:mb-8 md:gap-6"
            variants={itemVariants}
          >
            {STATS.map((s, i) => (
              <Fragment key={s.l}>
                {i > 0 && (
                  <div
                    className="h-8 w-px bg-gradient-to-b from-transparent via-[rgba(var(--primary-color-rgb),0.22)] to-transparent md:h-10"
                    aria-hidden
                  />
                )}
                <div>
                  <div className="text-[clamp(1.375rem,2vw,1.75rem)] font-extrabold leading-none text-[var(--primary-color)]">
                    {s.v}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-[var(--text-secondary)] md:text-[13px]">
                    {s.l}
                  </div>
                </div>
              </Fragment>
            ))}
          </motion.div>

          <motion.div 
            className="mb-3 w-full md:mb-4"
            variants={itemVariants}
          >
            <PrimaryCtaLink href="/signup">
              <span>Start Free Trial</span>
            </PrimaryCtaLink>
          </motion.div>

          <motion.p
            className="mb-10 max-w-[36rem] text-[13px] leading-relaxed text-[var(--text-muted)] opacity-[0.85] dark:text-white/40 dark:opacity-100 md:mb-12"
            variants={itemVariants}
          >
            {HOME_HERO_TIP}
          </motion.p>
        </div>

        <motion.div 
          className="relative mx-auto max-w-[1060px]"
          variants={imageVariants}
        >
          <figure className="relative overflow-hidden rounded-t-2xl border border-b-0 border-[var(--border-color-light)] shadow-[0_-8px_48px_rgba(var(--primary-color-rgb),0.08),0_0_0_1px_rgba(var(--shadow-rgb),0.06)] dark:border-white/[0.09] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2.5 border-b border-[var(--border-color-light)] bg-[var(--surface-2)] px-4 py-2.5 dark:border-white/[0.07] dark:bg-[rgba(12,10,20,0.98)]">
              <div className="flex shrink-0 gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex min-w-0 flex-1 justify-center">
                <div className="max-w-full truncate whitespace-nowrap rounded-md border border-[var(--border-color-light)] bg-[var(--background-color)] px-5 py-1 text-[11px] tracking-wide text-[var(--text-muted)] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/35">
                  app.reechout.com/dashboard
                </div>
              </div>
            </div>
            <div className="bg-[var(--background-color)] p-1 sm:p-2">
              <Image
                src="/dashboard.png"
                alt="ReechOut dashboard — interviews and questionnaires"
                width={3456}
                height={1994}
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="block h-auto w-full rounded-lg object-cover object-top dark:hidden sm:rounded-[10px]"
              />
              <Image
                src="/dashboard-dark.png"
                alt="ReechOut dashboard — interviews and questionnaires"
                width={3456}
                height={1994}
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="hidden h-auto w-full rounded-lg object-cover object-top dark:block sm:rounded-[10px]"
              />
            </div>
          </figure>
        </motion.div>
      </motion.div>
    </section>
  );
}
