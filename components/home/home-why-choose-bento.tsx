"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bell, Zap } from "lucide-react";

import type { WhyChooseUiType } from "@/app/home-content";
import { HOME_WHY_CHOOSE_CARDS } from "@/app/home-content";
import { cn } from "@/lib/ui/cn";
import { IconCheckCircle, WhyChooseIcon } from "./home-icons";
import { SectionHeader } from "./section-header";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICON_WELL: Record<
  (typeof HOME_WHY_CHOOSE_CARDS)[number]["icon"],
  { color: string; bg: string }
> = {
  thunderbolt: {
    color: "var(--primary-color)",
    bg: "rgba(var(--primary-color-rgb),0.12)",
  },
  team: {
    color: "rgb(var(--accent-violet-rgb))",
    bg: "rgba(var(--accent-violet-rgb),0.12)",
  },
  bell: {
    color: "rgb(var(--brand-blue-modern-rgb))",
    bg: "rgba(var(--brand-blue-modern-rgb),0.1)",
  },
  folder: {
    color: "var(--success-emerald)",
    bg: "rgba(var(--success-emerald-rgb),0.1)",
  },
  chart: {
    color: "var(--accent-pink)",
    bg: "rgba(var(--accent-pink-rgb),0.1)",
  },
  shield: {
    color: "var(--warning-color)",
    bg: "rgba(var(--warning-color-rgb),0.12)",
  },
  handshake: {
    color: "rgb(var(--brand-blue-modern-rgb))",
    bg: "rgba(var(--brand-blue-modern-rgb),0.1)",
  },
};

function MiniInterview() {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--surface-2)] p-4 dark:border-white/[0.08] dark:bg-white/[0.04]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-violet)] text-[10px] font-extrabold text-white">
              AI
            </div>
            <span className="text-[13px] font-extrabold text-[var(--text-heading)]">
              Interview engine
            </span>
          </div>
          <span className="rounded-full bg-[rgba(var(--success-emerald-rgb),0.15)] px-2 py-0.5 text-[10px] font-bold text-[var(--success-emerald)]">
            Live
          </span>
        </div>
        <div className="mb-2 flex justify-between text-[11px] text-[var(--text-muted)]">
          <span>Signal quality</span>
          <span className="font-bold text-[var(--text-heading)]">Strong</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border-color-light)] dark:bg-white/10">
          <div
            className="h-full w-[88%] rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-violet)]"
            aria-hidden
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
          <span className="font-bold text-[var(--accent-violet)]">Insight:</span>{" "}
          Responses show structured reasoning vs. keyword stuffing.
        </p>
      </div>
    </div>
  );
}

function MiniTeam() {
  const people = [
    { initials: "HR", bg: "bg-[var(--primary-color)]" },
    { initials: "AM", bg: "bg-[var(--accent-violet)]" },
    { initials: "JD", bg: "bg-[var(--success-emerald)]" },
  ];
  return (
    <div className="mt-3 space-y-2.5">
      {people.map((p) => (
        <div
          key={p.initials}
          className="flex items-center gap-3 rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-2)] px-3 py-2.5 dark:border-white/[0.08]"
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white",
              p.bg,
            )}
          >
            {p.initials}
          </div>
          <div className="min-w-0 flex-1 text-[12px] font-bold text-[var(--text-heading)]">
            Hiring team
          </div>
          <span className="rounded-full bg-[rgba(var(--primary-color-rgb),0.12)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary-color)]">
            Reviewer
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniAlerts() {
  return (
    <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--surface-2)] p-4 dark:border-white/[0.08]">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-[rgba(var(--brand-blue-modern-rgb),0.12)] p-1.5 text-[var(--brand-blue-modern)]">
          <Bell className="h-4 w-4" aria-hidden strokeWidth={2} />
        </div>
        <div>
          <div className="text-[13px] font-extrabold text-[var(--text-heading)]">
            Review window
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            3 signals need attention
          </div>
        </div>
      </div>
      <div className="space-y-2 rounded-xl bg-[var(--background-color)] p-3 dark:bg-black/25">
        {[
          { t: "Follow-up on communication clarity", done: true },
          { t: "Compare with role rubric", done: false },
          { t: "Share with hiring manager", done: false },
        ].map(({ t, done }) => (
          <div key={t} className="flex items-start gap-2.5">
            <div
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                done
                  ? "border-[var(--success-emerald)] bg-[var(--success-emerald)] text-white"
                  : "border-[var(--border-color-light)]",
              )}
            >
              {done ? (
                <IconCheckCircle className="h-2.5 w-2.5 text-white" />
              ) : null}
            </div>
            <span
              className={cn(
                "text-[12px] leading-snug",
                done
                  ? "text-[var(--text-muted)] line-through"
                  : "font-semibold text-[var(--text-heading)]",
              )}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniReports() {
  const rows = [
    ["📄", "Interview transcript"],
    ["📋", "Score breakdown"],
    ["📁", "Questionnaire"],
    ["📊", "Hiring summary"],
  ];
  return (
    <div className="riq-mini-docs mt-3 grid grid-cols-2 gap-2">
      {rows.map(([icon, name]) => (
        <div
          key={String(name)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border-color-light)] bg-[var(--surface-2)] px-2.5 py-2 text-[11px] font-semibold text-[var(--text-heading)] dark:border-white/[0.08]"
        >
          <span aria-hidden>{icon}</span>
          <span className="truncate">{name}</span>
        </div>
      ))}
    </div>
  );
}

function MiniScores() {
  const rows = [
    { label: "Role fit", w: "92%", c: "bg-[var(--success-emerald)]" },
    { label: "Communication", w: "78%", c: "bg-[var(--brand-blue-modern)]" },
    { label: "Depth", w: "64%", c: "bg-[var(--warning-color)]" },
  ];
  return (
    <div className="mt-3 space-y-3 rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--surface-2)] p-4 dark:border-white/[0.08]">
      <div className="flex items-center justify-between text-[12px] font-extrabold text-[var(--text-heading)]">
        <span>Signal snapshot</span>
        <span className="text-[var(--primary-color)]">Updated</span>
      </div>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>{r.label}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--border-color-light)] dark:bg-white/10">
            <div
              className={cn("h-full rounded-full", r.c)}
              style={{ width: r.w }}
              aria-hidden
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniRisk() {
  const items = [
    { t: "Narrow answers on scenarios", sub: "Medium · review", c: "bg-[var(--warning-color)]" },
    { t: "Strong alignment to rubric", sub: "Low risk", c: "bg-[var(--success-emerald)]" },
  ];
  return (
    <div className="mt-3 space-y-2">
      {items.map(({ t, sub, c }) => (
        <div
          key={t}
          className="flex items-center gap-3 rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-2)] px-3 py-2.5 dark:border-white/[0.08]"
        >
          <div
            className={cn("h-2 w-2 shrink-0 rounded-full ring-2 ring-black/5", c)}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold text-[var(--text-heading)]">{t}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniPartner() {
  return (
    <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--surface-2)] p-4 dark:border-white/[0.08]">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-violet)] text-[11px] font-extrabold text-white">
            RO
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface-2)] bg-[var(--success-emerald)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[13px] font-extrabold text-[var(--text-heading)]">
              ReechOut success
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">Now</span>
          </div>
          <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
            We added{" "}
            <strong className="text-[var(--text-heading)]">bulk export</strong> for
            your team—try it from Reports.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--primary-color)] px-3 py-1 text-[11px] font-bold text-white">
              What&apos;s new
            </span>
            <span className="rounded-full border border-[var(--border-color-light)] px-3 py-1 text-[11px] font-bold text-[var(--text-heading)]">
              Book time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniUi({ type }: { type: WhyChooseUiType }) {
  switch (type) {
    case "interview":
      return <MiniInterview />;
    case "team":
      return <MiniTeam />;
    case "alerts":
      return <MiniAlerts />;
    case "reports":
      return <MiniReports />;
    case "scores":
      return <MiniScores />;
    case "risk":
      return <MiniRisk />;
    case "partner":
      return <MiniPartner />;
    default:
      return null;
  }
}

const headerMotion = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

const gridMotion = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

export function HomeWhyChooseBento() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        variants={reduceMotion ? undefined : headerMotion}
      >
        <SectionHeader
          kickerLeading="bolt"
          kicker="Why Choose ReechOut?"
          title="Everything You Need to Hire with Confidence"
          description="ReechOut is the structured interview and reporting layer that turns conversations into hiring signal—so your team can focus on decisions, not resume noise."
          titleClassName="max-w-[900px] text-[clamp(1.875rem,4.5vw,3.25rem)]"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-50px" }}
        variants={reduceMotion ? undefined : gridMotion}
      >
        {HOME_WHY_CHOOSE_CARDS.map((card, i) => {
          const well = ICON_WELL[card.icon];
          return (
            <motion.article
              key={card.title}
              variants={reduceMotion ? undefined : cardMotion}
              className={cn(
                "ro-bento-card group relative flex min-h-[380px] flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--background-color)] outline-none transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-color)] hover:-translate-y-1 hover:border-[rgba(var(--primary-color-rgb),0.28)] hover:shadow-[0_20px_40px_rgba(var(--shadow-rgb),0.08)] dark:border-white/[0.09] dark:hover:border-[rgba(var(--accent-violet-rgb),0.35)]",
                card.span === "full" && "md:col-span-2 lg:col-span-3",
              )}
              tabIndex={0}
              aria-labelledby={`why-card-${i}-title`}
            >
              <div className="ro-bento-front flex h-full min-h-[380px] flex-col p-8">
                <div
                  className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                  style={{ background: well.bg, color: well.color }}
                >
                  <WhyChooseIcon name={card.icon} className="h-7 w-7" />
                </div>
                <h3
                  id={`why-card-${i}-title`}
                  className="mb-1 text-[20px] font-extrabold leading-snug tracking-[-0.02em] text-[var(--text-heading)]"
                >
                  {card.title}
                </h3>
                <MiniUi type={card.uiType} />
                <div className="ro-bento-read-hint mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-bold text-[var(--primary-color)] opacity-50 transition-opacity duration-200 group-hover:opacity-100">
                  Hover to read details
                  <Zap className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
                </div>
              </div>

              <div className="ro-bento-drawer flex flex-col justify-center bg-[var(--background-color)] p-8 dark:bg-[var(--background-color)]">
                <div
                  className="ro-bento-drawer-icon mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: well.bg, color: well.color }}
                >
                  <WhyChooseIcon name={card.icon} className="h-5 w-5" />
                </div>
                <h3 className="ro-bento-drawer-heading mb-4 text-lg font-extrabold leading-snug tracking-[-0.02em] text-[var(--text-heading)]">
                  {card.title}
                </h3>
                <div className="ro-bento-drawer-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                  <p className="text-[15px] leading-[1.7] text-[var(--text-secondary)]">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </>
  );
}
