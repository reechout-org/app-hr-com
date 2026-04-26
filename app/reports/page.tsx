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
  REPORTS_APPLICATION_HEADER,
  REPORTS_APPLICATION_STEPS,
  REPORTS_BENEFIT_ITEMS,
  REPORTS_BENEFIT_VISUAL_STATS,
  REPORTS_BENEFITS_HEADER,
  REPORTS_CTA,
  REPORTS_FEATURES,
  REPORTS_FEATURES_HEADER,
  REPORTS_HERO,
  REPORTS_METADATA,
  reportsCanonical,
} from "@/app/reports/content";

export const metadata: Metadata = {
  title: REPORTS_METADATA.title,
  description: REPORTS_METADATA.description,
  keywords: REPORTS_METADATA.keywords,
  authors: [{ name: REPORTS_METADATA.author }],
  robots: REPORTS_METADATA.robots,
  alternates: {
    canonical: reportsCanonical,
  },
  openGraph: {
    title: REPORTS_METADATA.title,
    description: REPORTS_METADATA.description,
    type: "website",
    url: reportsCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: REPORTS_METADATA.title,
    description: REPORTS_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: REPORTS_METADATA.language,
  },
};

export default function ReportsPage() {
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
              hero={REPORTS_HERO}
              screenshot={getHomeProductScreenshot("reports")}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <SolutionFeaturesSection
              header={REPORTS_FEATURES_HEADER}
              features={REPORTS_FEATURES}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={2}>
            <ApplicationStepsSection
              header={REPORTS_APPLICATION_HEADER}
              steps={REPORTS_APPLICATION_STEPS}
              sectionId="reports-how-it-works"
              ariaLabel="How it works"
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={3}>
            <SolutionBenefitsSection
              header={REPORTS_BENEFITS_HEADER}
              items={REPORTS_BENEFIT_ITEMS}
              visualStats={REPORTS_BENEFIT_VISUAL_STATS}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={4}>
            <HomeCtaSection cta={REPORTS_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={5}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
