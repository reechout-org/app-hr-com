import type { MarketingCta } from "@/app/home-content";
import { SITE_BASE_URL } from "@/lib/site/marketing-site";
import type { SolutionHeroModel } from "@/components/solution/solution-page-model";

export const INTERVIEW_PAGE_PATH = "/interview";

/** Matches Angular `PhoneInterviewsComponent` SEO (title / description / keywords). */
export const INTERVIEW_METADATA = {
  title: "Voice interviews that screen fast | Structured first-round interviews | ReechOut",
  description:
    "Run structured voice interviews automatically. See how candidates think before you spend time with them. Save time and shortlist with confidence.",
  keywords:
    "AI voice interviews, phone screening, structured interviews, first round interviews, candidate screening, hiring automation, ReechOut, recruitment interviews",
  author: "ReechOut",
  robots: "index, follow",
  language: "English",
} as const;

export const INTERVIEW_HERO = {
  badge: "AI Voice Interviews",
  titleLine1: "Screen candidates fast.",
  titleLine2Prefix: "Talk to the ",
  titleHighlight: "right ones",
  titleLine2Suffix: ".",
  description:
    "Run structured interviews automatically and see how candidates actually think before you spend time with them.",
  stats: [
    { value: "24/7", label: "availability" },
    { value: "10x", label: "faster screening" },
    { value: "High", label: "volume hiring" },
  ] as const,
  ctaLabel: "Start Free Trial",
  ctaHref: "/signup",
} as const satisfies SolutionHeroModel;

export const INTERVIEW_FEATURES_HEADER = {
  kicker: "The Complete Voice Interview Platform",
  title: "Everything you need to screen candidates properly",
  description:
    "You don't need more interviews—you need better first-round screening. ReechOut runs structured interviews automatically and evaluates how candidates think, communicate, and solve problems. You focus on the candidates that matter.",
} as const;

export const INTERVIEW_FEATURES = [
  {
    title: "Never miss a strong candidate",
    description:
      "Candidates can interview anytime. No scheduling, no back-and-forth, no delays. Move faster without losing good candidates.",
    icon: "clock" as const,
  },
  {
    title: "Go beyond scripted answers",
    description:
      "Structured interviews that go deeper than basic questions. See how candidates approach problems and explain their thinking.",
    icon: "volume" as const,
  },
  {
    title: "Know who to move forward with",
    description:
      "Get structured insights after every interview. Understand strengths, gaps, and overall fit quickly.",
    icon: "file-pdf" as const,
  },
] as const;

export const INTERVIEW_APPLICATION_HEADER = {
  kicker: "How It Works",
  title: "From candidate list to shortlist",
  description: "Invite, interview, and shortlist in a few clear steps",
} as const;

export const INTERVIEW_APPLICATION_STEPS = [
  {
    number: "01",
    title: "Invite candidates",
    description: "Send a link or upload applicants. Candidates can start immediately.",
    icon: "file-add" as const,
  },
  {
    number: "02",
    title: "Structured interviews",
    description: "Candidates go through role-specific interviews automatically.",
    icon: "phone" as const,
  },
  {
    number: "03",
    title: "Review results",
    description: "See who stands out and move forward with confidence.",
    icon: "check-circle" as const,
  },
] as const;

export const INTERVIEW_BENEFITS_HEADER = {
  kicker: "Benefits",
  title: "Why teams use ReechOut interviews",
  description: "Save time, get clearer signal, and make faster decisions",
} as const;

export const INTERVIEW_BENEFIT_ITEMS = [
  {
    title: "Save time",
    description: "Run many interviews automatically instead of manual screening",
  },
  {
    title: "Stay consistent",
    description: "Every candidate is evaluated the same way",
  },
  {
    title: "Improve signal",
    description: "Identify candidates who actually understand the role",
  },
  {
    title: "Move faster",
    description: "Reduce delays and speed up hiring decisions",
  },
] as const;

export const INTERVIEW_BENEFIT_VISUAL_STATS = [
  { value: "50+", label: "interviews per day" },
  { value: "24/7", label: "availability" },
] as const;

export const INTERVIEW_CTA: MarketingCta = {
  heading: "Stop doing first-round interviews manually",
  description:
    "Focus your time on the candidates that matter. Let the system handle the rest.",
  primaryLabel: "Start Free Trial",
  primaryHref: "/signup",
};

export const interviewCanonical = `${SITE_BASE_URL}${INTERVIEW_PAGE_PATH}`;
