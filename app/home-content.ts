import type { SolutionHeroScreenshot } from "@/components/solution/solution-page-model";
import { SITE_BASE_URL } from "@/lib/site/marketing-site";

/** Canonical home URL and SEO text — must match [components/hero-section.tsx] h1 + first hero paragraph. */
export const homeCanonical = `${SITE_BASE_URL}/`;

export const HOME_SEO = {
  title: "Resumes Don't Reflect Real Capability | ReechOut",
  description:
    "ReechOut is the AI-powered recruitment platform that conducts structured, conversational phone interviews. Eliminate bias, reduce time-to-hire, and make data-driven hiring decisions based on real candidate capabilities—not just polished resumes.",
  keywords:
    "ReechOut, AI phone interviews, recruitment platform, hiring automation, phone screening, structured interviews, HR tech, candidate evaluation",
  author: "ReechOut",
  robots: "index, follow",
  language: "English",
} as const;

export type WhyChooseUiType =
  | "interview"
  | "team"
  | "alerts"
  | "reports"
  | "scores"
  | "risk"
  | "partner";

/** Bento-style benefits — mirrors RegulateIQ “Why Choose CGM?” structure. */
export const HOME_WHY_CHOOSE_CARDS = [
  {
    title: "AI Phone Interview Automation",
    description:
      "Conduct structured, conversational AI phone screens that evaluate real reasoning and communication skills. Eliminate early-stage bias and identify top talent faster.",
    icon: "thunderbolt" as const,
    span: "default" as const,
    uiType: "interview" as const satisfies WhyChooseUiType,
  },
  {
    title: "Scale Hiring Without Increasing Headcount",
    description:
      "Whether you're a fast-growing startup or a lean talent acquisition team, our recruitment automation platform handles top-of-funnel screening so you can focus on closing candidates.",
    icon: "team" as const,
    span: "default" as const,
    uiType: "team" as const satisfies WhyChooseUiType,
  },
  {
    title: "High-Signal Candidate Evaluation",
    description:
      "Stop relying on keyword-stuffed resumes. We convert live conversations into standardized, objective hiring signals with actionable insights and recruiter alerts.",
    icon: "bell" as const,
    span: "default" as const,
    uiType: "alerts" as const satisfies WhyChooseUiType,
  },
  {
    title: "Secure Interview Transcripts & Scorecards",
    description:
      "Automatically generate and store detailed interview transcripts and ATS-ready scorecards in one secure, compliant dashboard. Perfect for hiring manager debriefs.",
    icon: "folder" as const,
    span: "default" as const,
    uiType: "reports" as const satisfies WhyChooseUiType,
  },
  {
    title: "Stakeholder Alignment & Reporting",
    description:
      "Share data-driven candidate reports with leadership to build immediate consensus. Make defensible hiring decisions backed by empirical interview data.",
    icon: "chart" as const,
    span: "default" as const,
    uiType: "scores" as const satisfies WhyChooseUiType,
  },
  {
    title: "Predictive Fit & Retention Risk Analytics",
    description:
      "Identify red flags and behavioral patterns early. Move beyond intuition to data-backed hiring, reducing bad hires and improving long-term employee retention.",
    icon: "shield" as const,
    span: "default" as const,
    uiType: "risk" as const satisfies WhyChooseUiType,
  },
  {
    title: "Your Enterprise-Grade HR Tech Partner",
    description:
      "More than just an AI interview tool. ReechOut integrates directly into your existing talent acquisition workflow, continuously optimizing your screening process as your hiring volume scales.",
    icon: "handshake" as const,
    span: "full" as const,
    uiType: "partner" as const satisfies WhyChooseUiType,
  },
] as const;

export const HOME_APPLICATION_STEPS = [
  {
    number: "01",
    title: "Design Structured Questionnaires",
    description:
      "Create role-specific, competency-based screening criteria that go far beyond static resumes and generic application forms.",
    icon: "edit" as const,
  },
  {
    number: "02",
    title: "Automate the Phone Screen",
    description:
      "Our AI autonomously conducts conversational interviews, analyzing how candidates communicate, reason, and solve problems in real-time.",
    icon: "phone" as const,
  },
  {
    number: "03",
    title: "Hire 10x Faster with Confidence",
    description:
      "Recruiters receive instant, objective scorecards and actionable insights, drastically reducing time-to-hire and interview scheduling fatigue.",
    icon: "file-pdf" as const,
  },
] as const;

export const HOME_TESTIMONIALS = [
  {
    content:
      "ReechOut has transformed our hiring process. The automated interviews save us so much time and the reports help us make better decisions.",
    author: "Muhammad Hadi",
    position: "CEO",
    company: "Razzaq Consulting",
    avatar:
      "https://storage.googleapis.com/images.reechout.com/review_1.webp",
  },
  {
    content:
      "Simple to use and very effective. We can now handle multiple interviews at once without any hassle.",
    author: "Hassam Shah",
    position: "Director",
    company: "Rawaan Pakistan",
    avatar:
      "https://storage.googleapis.com/images.reechout.com/review_2.webp",
  },
  {
    content:
      "Great platform! The AI interviews are smooth and the detailed reports are exactly what we need.",
    author: "Sanan Pervaiz",
    position: "COO",
    company: "TPI",
    avatar:
      "https://storage.googleapis.com/images.reechout.com/review_3.webp",
  },
  {
    content:
      "The automated interview system has streamlined our recruitment process significantly. We can now screen more candidates efficiently and focus on the most qualified ones.",
    author: "Salman Shafi",
    position: "Founder",
    company: "JustKonvert",
    avatar:
      "https://storage.googleapis.com/images.reechout.com/review_5.webp",
  },
  {
    content:
      "ReechOut has been a game-changer for our team. The AI-powered interviews provide consistent, objective candidate evaluation, and the detailed reports help us make informed hiring decisions faster.",
    author: "Rasheed ahmed",
    position: "Recruitment head",
    company: "Trackmyuni",
    avatar:
      "https://storage.googleapis.com/images.reechout.com/review_4.webp",
  },
] as const;

/** RegulateIQ `ProductScreenshots` block — assets in `/public` (light + dark per tab). */
export const HOME_IN_ACTION_HEADLINE = {
  sectionTag: "Product Features",
  title: "The Ultimate AI Recruitment Platform",
  description:
    "Explore how ReechOut replaces manual phone screens with an intelligent, automated interview workflow designed for modern talent acquisition teams.",
} as const;

export const HOME_IN_ACTION_ITEMS = [
  {
    id: "interviews",
    label: "AI Interviews",
    description:
      "Deploy intelligent, structured phone interviews. Review comprehensive transcripts and automated scoring instantly.",
    imageLight: "/interview.png",
    imageDark: "/interview-dark.png",
  },
  {
    id: "questionnaire",
    label: "Smart Screening",
    description:
      "Build dynamic, role-relevant screening questionnaires to qualify candidates before scheduling live technical rounds.",
    imageLight: "/questionnaire.png",
    imageDark: "/questionnaire-dark.png",
  },
  {
    id: "reports",
    label: "Hiring Reports",
    description:
      "Generate stakeholder-ready candidate scorecards packed with clear, objective hiring signals and competency analytics.",
    imageLight: "/report.png",
    imageDark: "/report-dark.png",
  },
  {
    id: "personas",
    label: "Candidate Personas",
    description:
      "Define candidate personas and evaluation rubrics to ensure your entire hiring committee is aligned on what 'good' looks like.",
    imageLight: "/persona.png",
    imageDark: "/persona-dark.png",
  },
] as const;

export type HomeProductScreenshotId = "interviews" | "questionnaire" | "reports";

/** Solution-page hero image — same light/dark assets as the home product section. */
export function getHomeProductScreenshot(
  id: HomeProductScreenshotId,
): SolutionHeroScreenshot {
  const item = HOME_IN_ACTION_ITEMS.find((i) => i.id === id);
  if (!item) {
    throw new Error(`Unknown product screenshot id: ${id}`);
  }
  const chromeLabelById: Record<HomeProductScreenshotId, string> = {
    interviews: "app.reechout.com/interviews",
    questionnaire: "app.reechout.com/questionnaires",
    reports: "app.reechout.com/reports",
  };
  return {
    imageLight: item.imageLight,
    imageDark: item.imageDark,
    alt: `ReechOut AI Recruitment Software — ${item.label}`,
    chromeLabel: chromeLabelById[id],
  };
}

const REECHOUT_CONNECT_URL =
  process.env.NEXT_PUBLIC_REECHOUT_CONNECT_URL ??
  "https://cal.com/reechout-founders/connect";

/** Shared shape for `HomeCtaSection` (home + solution pages). */
export type MarketingCta = {
  heading: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/** RegulateIQ `HomeCTA` / `CallToActionClient` — copy + links for the dark CTA band. */
export const HOME_CTA = {
  heading: `Hire Smarter,\nNot Harder`,
  description:
    "Don't let manual phone screens slow down your talent pipeline. Partner with ReechOut to automate initial interviews and unlock objective, data-driven hiring signals.",
  primaryLabel: "Book a Demo",
  primaryHref: "/contact",
  secondaryLabel: "Start For Free",
  secondaryHref: REECHOUT_CONNECT_URL,
} as const satisfies MarketingCta;

export const HOME_PRICING_FEATURES = [
  "Unlimited AI Interviews",
  "Dedicated Account Manager",
  "ATS & Slack Integrations",
  "Custom Evaluation Rubrics",
  "Enterprise SLA Guarantee",
] as const;

/** Same shell as `HOME_CTA` — pricing card copy. */
export const HOME_PRICING = {
  title: "Enterprise Hiring Automation",
  description:
    "Get a tailored HR tech solution engineered for high-volume recruiting. Connect with our team to discuss your specific talent acquisition workflow.",
  badge: "Enterprise",
  priceLabel: "Custom",
  priceSubtitle: "Tailored to your hiring volume",
  ctaLabel: "Contact Sales",
  ctaHref: "/contact",
} as const;
