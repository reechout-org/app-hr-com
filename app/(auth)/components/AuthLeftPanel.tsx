"use client";

import { FileChartColumn, Mic, Users } from "lucide-react";
import { useRef } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const { left, top, width, height } = panelRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    panelRef.current.style.setProperty("--mouse-x", `${x}%`);
    panelRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div
      ref={panelRef}
      className="group relative hidden h-screen min-h-0 flex-1 flex-col overflow-hidden bg-[var(--bg-base)] lg:flex"
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--primary)_15%,transparent)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,color-mix(in_srgb,var(--accent-light)_10%,transparent)_0%,transparent_40%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -left-[10%] -top-[20%] z-0 h-[65%] w-[65%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_20%,transparent)_0%,transparent_70%)] blur-[120px] motion-reduce:animate-none [animation:authAurora1_25s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] z-0 h-[58%] w-[58%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-light)_15%,transparent)_0%,transparent_70%)] blur-[140px] motion-reduce:animate-none [animation:authAurora2_30s_ease-in-out_infinite]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black_0%,transparent_90%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_90%)] [background-image:linear-gradient(var(--auth-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--auth-grid-line)_1px,transparent_1px)] [background-size:60px_60px]"
        aria-hidden
      />

      <div className="hero-noise absolute inset-0 z-[1] opacity-[0.02]" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 50%)",
        }}
        aria-hidden
      />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-0 top-0 z-20 pt-[clamp(12px,2vh,18px)] pr-[clamp(14px,2.5vw,22px)] pb-[clamp(12px,2vh,18px)] pl-[clamp(28px,6vw,48px)]"
      >
        <AuthWordmark href="/" />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-[clamp(18px,3vh,36px)] sm:px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-[min(440px,100%)]"
        >
          <motion.div variants={itemVariants} className="mb-[clamp(14px,2.5vh,22px)] flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_12%,transparent)] to-[color-mix(in_srgb,var(--primary)_4%,transparent)] shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--primary)_25%,transparent),inset_0_2px_4px_color-mix(in_srgb,#fff_15%,transparent)] backdrop-blur-[8px]">
              <Mic
                className="h-[22px] w-[22px] text-[var(--primary)] [filter:drop-shadow(0_2px_4px_color-mix(in_srgb,var(--primary)_30%,transparent))]"
                aria-hidden
              />
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="mb-[clamp(10px,1.5vh,16px)] text-center text-[clamp(22px,2.1vw,30px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-[var(--text-heading)]">
            Hiring signal,
            <br />
            not resume noise
          </motion.h1>

          <motion.p variants={itemVariants} className="mb-[clamp(18px,3vh,28px)] text-center text-[15px] leading-normal text-[var(--text-muted)]">
            <span className="relative font-extrabold text-[var(--primary)]">ReechOut</span> is
            the structured interview and reporting layer that turns conversations into hiring
            signal—so your team focuses on decisions, not noise.
          </motion.p>

          <div className="flex flex-col gap-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex cursor-default items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_6%,transparent)] bg-[color-mix(in_srgb,var(--bg-card)_40%,transparent)] px-4 py-3.5 backdrop-blur-[12px] transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg-card)_90%,transparent)] hover:shadow-[0_8px_20px_-10px_color-mix(in_srgb,var(--primary)_15%,transparent)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5">
                    <span className="text-[14px] font-bold tracking-tight text-[var(--text-heading)]">
                      {f.title}
                    </span>
                    <span className="text-[13px] leading-snug text-[var(--text-muted)]">{f.desc}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="relative z-10 px-6 pb-9 pt-0 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-3.5 py-1.5 text-[13px] font-bold text-[var(--primary)] backdrop-blur-[8px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]">
          Structured hiring intelligence
        </div>
      </motion.div>
    </div>
  );
}
