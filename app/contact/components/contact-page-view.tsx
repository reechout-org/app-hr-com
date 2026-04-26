"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Headphones,
  Mail,
  MessageSquare,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";

import { PrimaryCtaAnchor } from "@/components/home/primary-cta-link";
import {
  CONTACT_CARDS,
  CONTACT_FORM,
  CONTACT_HERO,
  CONTACT_SIDEBAR,
  CONTACT_TRUST_ITEMS,
  type ContactCardIcon,
} from "@/app/contact/content";
import { REECHOUT_CONNECT_URL } from "@/lib/site/marketing-site";
import { PAGE_SHELL_CLASS } from "@/components/page-shell";
import { cn } from "@/lib/ui/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CARD_ICONS: Record<ContactCardIcon, typeof Mail> = {
  mail: Mail,
  calendar: Calendar,
  clock: Clock,
};

const TRUST_ICONS = {
  zap: Zap,
  shield: Shield,
  headphones: Headphones,
  users: Users,
} as const;

const inputClass =
  "w-full rounded-[10px] border border-[var(--border-color-light)] bg-[var(--background-color)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[rgba(var(--primary-color-rgb),0.2)] dark:border-white/[0.12] dark:bg-[var(--surface-2)]";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-[var(--text-heading)]";

export function ContactPageView() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    work_email?: string;
  }>({});

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (String(fd.get("website") ?? "").trim() !== "") {
      setSubmitted(true);
      return;
    }

    const name = String(fd.get("name") ?? "").trim();
    const work_email = String(fd.get("work_email") ?? "").trim().toLowerCase();
    const nextErrors: { name?: string; work_email?: string } = {};
    if (!name) nextErrors.name = "Please enter your name.";
    if (!work_email) nextErrors.work_email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(work_email)) {
      nextErrors.work_email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.slice(0, 200),
          work_email: work_email.slice(0, 254),
          company: String(fd.get("company") ?? "").trim().slice(0, 200),
          role: String(fd.get("role") ?? "").trim().slice(0, 200),
          details: String(fd.get("details") ?? "").trim().slice(0, 2000),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setServerError(
          json.message ?? "Something went wrong. Please try again later.",
        );
        return;
      }
      setSubmitted(true);
      form.reset();
    } catch {
      setServerError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const h = CONTACT_HERO;

  return (
    <>
      <section
        className="relative w-full overflow-hidden pt-[calc(var(--site-nav-height)+clamp(2rem,5vw,3.5rem))] pb-[clamp(2.5rem,6vw,4rem)]"
        aria-label="Contact"
      >
        <div className={`relative z-[2] ${PAGE_SHELL_CLASS}`}>
          <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--primary-color-rgb),0.22)] bg-[rgba(var(--primary-color-rgb),0.08)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--primary-color)] dark:border-[rgba(var(--accent-violet-rgb),0.35)] dark:bg-[rgba(var(--primary-color-rgb),0.12)] dark:text-[var(--accent-violet)]"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 animate-[roBadgePulse_2s_ease-in-out_infinite] rounded-full bg-[var(--primary-color)]"
                aria-hidden
              />
              <span>{h.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
              className="mb-4 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-[var(--text-heading)] md:mb-5"
            >
              <span className="block">{h.titleBeforeHighlight}</span>
              <span className="mt-1 block">
                <span className="relative inline-block bg-[length:200%_auto] bg-gradient-to-br from-[var(--primary-color)] via-[var(--accent-violet)] to-[var(--accent-pink)] bg-clip-text text-transparent animate-[hero-gradient-shift_3s_ease_infinite]">
                  {h.titleHighlight}
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
              className="mb-8 max-w-[36rem] text-[clamp(0.95rem,1.4vw,1.0625rem)] leading-[1.65] text-[var(--text-secondary)]"
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
            >
              <PrimaryCtaAnchor
                href={REECHOUT_CONNECT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule a call
              </PrimaryCtaAnchor>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="relative z-[1] -mt-2 pb-[clamp(3rem,8vw,5rem)]"
        aria-label="Contact form"
      >
        <div className={PAGE_SHELL_CLASS}>
          <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
              className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-color-light)] bg-[var(--background-color)] p-[clamp(1.5rem,4vw,2.75rem)] shadow-[var(--shadow-light)] dark:border-white/[0.09] dark:bg-[var(--surface-1)]"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(var(--primary-color-rgb),0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(var(--accent-violet-rgb),0.14)_0%,transparent_70%)]"
                aria-hidden
              />

              {submitted ? (
                <div className="relative py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 14 }}
                    className="mb-6 flex justify-center"
                  >
                    <CheckCircle2
                      className="h-16 w-16 text-[var(--success-emerald)]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </motion.div>
                  <h2 className="mb-2 text-xl font-extrabold text-[var(--text-heading)]">
                    {CONTACT_FORM.successTitle}
                  </h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                    {CONTACT_FORM.successDescription}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="mb-7 flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border border-[var(--border-color-light)] bg-[var(--surface-2)] text-[var(--primary-color)] dark:border-white/[0.1] dark:bg-[var(--surface-2)]">
                      <MessageSquare className="h-5 w-5" aria-hidden strokeWidth={2} />
                    </div>
                    <div className="min-w-0 text-left">
                      <h2 className="text-lg font-extrabold text-[var(--text-heading)] md:text-xl">
                        {CONTACT_FORM.title}
                      </h2>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {CONTACT_FORM.subtitle}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="text-left" noValidate>
                    <input
                      type="text"
                      name="website"
                      className="sr-only"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                    />

                    <div className="mb-4">
                      <label htmlFor="contact-name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        className={inputClass}
                        placeholder="Your name"
                        maxLength={200}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "contact-name-err" : undefined
                        }
                      />
                      {errors.name ? (
                        <p
                          id="contact-name-err"
                          className="mt-1 text-xs text-[var(--error-color)]"
                        >
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="contact-email" className={labelClass}>
                        Work email
                      </label>
                      <input
                        id="contact-email"
                        name="work_email"
                        type="email"
                        className={inputClass}
                        placeholder="you@company.com"
                        maxLength={254}
                        autoComplete="email"
                        aria-invalid={!!errors.work_email}
                        aria-describedby={
                          errors.work_email ? "contact-email-err" : undefined
                        }
                      />
                      {errors.work_email ? (
                        <p
                          id="contact-email-err"
                          className="mt-1 text-xs text-[var(--error-color)]"
                        >
                          {errors.work_email}
                        </p>
                      ) : null}
                    </div>

                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-company" className={labelClass}>
                          Company{" "}
                          <span className="font-normal text-[var(--text-muted)]">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="contact-company"
                          name="company"
                          className={inputClass}
                          placeholder="Your company"
                          maxLength={200}
                          autoComplete="organization"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-role" className={labelClass}>
                          Role / title{" "}
                          <span className="font-normal text-[var(--text-muted)]">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="contact-role"
                          name="role"
                          className={inputClass}
                          placeholder="e.g. HR Manager"
                          maxLength={200}
                          autoComplete="organization-title"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="contact-details" className={labelClass}>
                        Details{" "}
                        <span className="font-normal text-[var(--text-muted)]">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="contact-details"
                        name="details"
                        className={cn(inputClass, "min-h-[100px] resize-y")}
                        placeholder="Tell us about your hiring needs or questions…"
                        maxLength={2000}
                        rows={4}
                      />
                    </div>

                    {serverError ? (
                      <div
                        className="mb-4 rounded-[10px] border border-[rgba(var(--error-color-rgb),0.25)] bg-[rgba(var(--error-color-rgb),0.08)] px-3.5 py-2.5 text-sm text-[var(--error-color)]"
                        role="alert"
                      >
                        {serverError}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full min-h-[50px] items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-hover)] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(var(--primary-color-rgb),0.35),inset_0_1px_0_rgba(255,255,255,0.15),0_4px_16px_rgba(var(--primary-color-rgb),0.28)] transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {loading ? CONTACT_FORM.submittingLabel : CONTACT_FORM.submitLabel}
                      {!loading ? (
                        <ArrowRight className="h-[18px] w-[18px]" aria-hidden strokeWidth={2} />
                      ) : null}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.28 }}
              className="flex flex-col gap-5"
            >
              <div>
                <h3 className="mb-1.5 text-[15px] font-bold tracking-tight text-[var(--text-heading)]">
                  {CONTACT_SIDEBAR.directHeading}
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {CONTACT_SIDEBAR.directDescription}
                </p>
              </div>

              {CONTACT_CARDS.map((card, i) => {
                const Icon = CARD_ICONS[card.icon];
                const inner = (
                  <>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color-light)] bg-[var(--surface-2)] text-[var(--primary-color)] dark:border-white/[0.1]">
                      <Icon className="h-5 w-5" aria-hidden strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {card.title}
                      </p>
                      {card.href ? (
                        <a
                          href={card.href}
                          target={card.href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            card.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="block text-[15px] font-bold text-[var(--text-heading)] underline-offset-2 hover:text-[var(--primary-color)] hover:underline"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p className="text-[15px] font-bold text-[var(--text-heading)]">
                          {card.value}
                        </p>
                      )}
                      <p className="mt-0.5 text-[12.5px] text-[var(--text-secondary)]">
                        {card.description}
                      </p>
                    </div>
                  </>
                );

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.32 + i * 0.06 }}
                    className="flex gap-4 rounded-[18px] border border-[var(--border-color-light)] bg-[var(--background-color)] p-5 shadow-[var(--shadow-light)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)] dark:border-white/[0.09] dark:bg-[var(--surface-1)]"
                  >
                    {inner}
                  </motion.div>
                );
              })}

              <div className="rounded-[18px] border border-[var(--border-color-light)] bg-[var(--background-color)] p-5 dark:border-white/[0.09] dark:bg-[var(--surface-1)]">
                <div className="mb-3 flex items-center gap-2.5">
                  <Clock
                    className="h-[18px] w-[18px] shrink-0 text-[var(--primary-color)]"
                    aria-hidden
                    strokeWidth={2}
                  />
                  <h4 className="text-[15px] font-bold text-[var(--text-heading)]">
                    {CONTACT_SIDEBAR.supportHoursHeading}
                  </h4>
                </div>
                <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                  {CONTACT_SIDEBAR.supportHoursDescription}
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section
        className="relative z-[1] pb-[clamp(4rem,10vw,6rem)]"
        aria-label="Trust"
      >
        <div className={PAGE_SHELL_CLASS}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-wrap justify-center gap-3"
          >
            {CONTACT_TRUST_ITEMS.map((item) => {
              const Icon = TRUST_ICONS[item.icon];
              return (
                <div
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color-light)] bg-[var(--background-color)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] shadow-[var(--shadow-light)] dark:border-white/[0.1] dark:bg-[var(--surface-1)]"
                >
                  <Icon
                    className="h-[18px] w-[18px] shrink-0 text-[var(--primary-color)] dark:text-[var(--accent-violet)]"
                    aria-hidden
                    strokeWidth={2}
                  />
                  <span className="whitespace-nowrap">{item.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
