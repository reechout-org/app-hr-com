import type { Metadata } from "next";

import { ApplicationStepsSection } from "@/components/home/application-steps-section";
import { HomeCtaSection } from "@/components/home/home-cta-section";
import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import {
  SolutionBenefitsSection,
  SolutionFeaturesSection,
  SolutionHeroSection,
} from "@/components/solution";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getHomeProductScreenshot } from "@/app/home-content";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";
import {
  INTERVIEW_APPLICATION_HEADER,
  INTERVIEW_APPLICATION_STEPS,
  INTERVIEW_BENEFIT_ITEMS,
  INTERVIEW_BENEFIT_VISUAL_STATS,
  INTERVIEW_BENEFITS_HEADER,
  INTERVIEW_CTA,
  INTERVIEW_FEATURES,
  INTERVIEW_FEATURES_HEADER,
  INTERVIEW_HERO,
  INTERVIEW_METADATA,
  interviewCanonical,
} from "@/app/interview/content";

export const metadata: Metadata = {
  title: INTERVIEW_METADATA.title,
  description: INTERVIEW_METADATA.description,
  keywords: INTERVIEW_METADATA.keywords,
  authors: [{ name: INTERVIEW_METADATA.author }],
  robots: INTERVIEW_METADATA.robots,
  alternates: {
    canonical: interviewCanonical,
  },
  openGraph: {
    title: INTERVIEW_METADATA.title,
    description: INTERVIEW_METADATA.description,
    type: "website",
    url: interviewCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: INTERVIEW_METADATA.title,
    description: INTERVIEW_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: INTERVIEW_METADATA.language,
  },
};

export default function InterviewMarketingPage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <SolutionHeroSection
              hero={INTERVIEW_HERO}
              screenshot={getHomeProductScreenshot("interviews")}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <SolutionFeaturesSection
              header={INTERVIEW_FEATURES_HEADER}
              features={INTERVIEW_FEATURES}
              ariaLabel="Features"
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={2}>
            <ApplicationStepsSection
              header={INTERVIEW_APPLICATION_HEADER}
              steps={INTERVIEW_APPLICATION_STEPS}
              sectionId="interview-how-it-works"
              ariaLabel="How it works"
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={3}>
            <SolutionBenefitsSection
              header={INTERVIEW_BENEFITS_HEADER}
              items={INTERVIEW_BENEFIT_ITEMS}
              visualStats={INTERVIEW_BENEFIT_VISUAL_STATS}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={4}>
            <HomeCtaSection cta={INTERVIEW_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={5}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
