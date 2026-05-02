"use client";

import { FileChartColumn, Mic, Users } from "lucide-react";
import { motion } from "framer-motion";

import { AuthWordmark } from "./AuthWordmark";

const FEATURES = [
  {
    title: "Structured interviews",
    desc: "Surface how candidates reason and communicate—so you evaluate real capability, not polished keywords.",
    icon: Mic,
  },
  {
    title: "Built for lean teams",
    desc: "Structured evaluation without enterprise bloat—whether you are pre-seed, scaling fast, or running a focused HR team.",
    icon: Users,
  },
  {
    title: "Interview-ready reports",
    desc: "Turn conversations into review-ready signals—transcripts and reports in one place with a clear audit trail.",
    icon: FileChartColumn,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function AuthLeftPanel() {
  return (
    <div className="relative z-[1] hidden min-h-dvh w-full flex-1 flex-col bg-transparent lg:flex lg:max-w-[min(800px,45vw)]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-0 top-0 z-20 pt-[clamp(12px,2vh,18px)] pr-[clamp(14px,2.5vw,22px)] pb-[clamp(12px,2vh,18px)] pl-[clamp(28px,6vw,48px)]"
      >
        <AuthWordmark href="/" />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 xl:py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-[min(520px,100%)]"
        >
          <motion.div
            variants={itemVariants}
            className="mb-[clamp(18px,3vh,26px)] flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--primary-color-rgb),0.22)] bg-[rgba(var(--primary-color-rgb),0.08)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--primary-color)] dark:border-[rgba(var(--accent-violet-rgb),0.3)] dark:bg-[rgba(var(--primary-color-rgb),0.12)] dark:text-[var(--accent-violet)]">
              <span
                className="h-1.5 w-1.5 shrink-0 animate-[roBadgePulse_2s_ease-in-out_infinite] rounded-full bg-[var(--primary-color)] dark:bg-[#c4b5fd]"
                aria-hidden
              />
              Structured hiring intelligence
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-[clamp(14px,2vh,20px)] text-center text-[clamp(2rem,3.5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)]"
          >
            <span className="block">Hiring</span>
            <span className="mt-1 block">
              <span className="relative inline-block bg-[length:200%_auto] bg-gradient-to-br from-[var(--primary-color)] via-[var(--accent-violet)] to-[var(--accent-pink)] bg-clip-text text-transparent animate-[hero-gradient-shift_3s_ease_infinite] after:absolute after:bottom-1 after:left-0 after:right-0 after:h-1 after:rounded-sm after:bg-gradient-to-r after:from-[var(--primary-color)] after:via-[var(--accent-violet)] after:to-[var(--accent-pink)] after:opacity-30 after:content-['']">
                signal
              </span>
              <span className="text-[var(--text-primary)] opacity-90">
                , not resume noise
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-[clamp(20px,3vh,30px)] text-center text-[clamp(0.95rem,1.4vw,1.05rem)] leading-[1.65] text-[var(--text-secondary)]"
          >
            <span className="font-extrabold text-[var(--primary-color)] dark:text-[var(--accent-violet)]">
              ReechOut
            </span>{" "}
            is the structured interview and reporting layer that turns
            conversations into hiring signal—so your team focuses on decisions,
            not noise.
          </motion.p>

          <div className="flex flex-col gap-3 xl:gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex cursor-default items-start gap-3 rounded-xl border border-[var(--border-color-light)] bg-[var(--background-color)] px-4 py-4 shadow-[var(--shadow-light)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[rgba(var(--primary-color-rgb),0.28)] hover:shadow-[var(--shadow-medium)] dark:border-white/[0.08] xl:px-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(var(--primary-color-rgb),0.22)] bg-[rgba(var(--primary-color-rgb),0.08)] text-[var(--primary-color)] dark:border-[rgba(var(--accent-violet-rgb),0.35)] dark:bg-[rgba(var(--primary-color-rgb),0.12)] dark:text-[var(--accent-violet)]">
                    <Icon className="h-[22px] w-[22px]" aria-hidden />
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5">
                    <span className="text-[15px] font-bold tracking-tight text-[var(--text-heading)]">
                      {f.title}
                    </span>
                    <span className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                      {f.desc}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
