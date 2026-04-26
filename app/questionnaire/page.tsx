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
  QUESTIONNAIRE_APPLICATION_HEADER,
  QUESTIONNAIRE_APPLICATION_STEPS,
  QUESTIONNAIRE_BENEFIT_ITEMS,
  QUESTIONNAIRE_BENEFIT_VISUAL_STATS,
  QUESTIONNAIRE_BENEFITS_HEADER,
  QUESTIONNAIRE_CTA,
  QUESTIONNAIRE_FEATURES,
  QUESTIONNAIRE_FEATURES_HEADER,
  QUESTIONNAIRE_HERO,
  QUESTIONNAIRE_METADATA,
  questionnaireCanonical,
} from "@/app/questionnaire/content";

export const metadata: Metadata = {
  title: QUESTIONNAIRE_METADATA.title,
  description: QUESTIONNAIRE_METADATA.description,
  keywords: QUESTIONNAIRE_METADATA.keywords,
  authors: [{ name: QUESTIONNAIRE_METADATA.author }],
  robots: QUESTIONNAIRE_METADATA.robots,
  alternates: {
    canonical: questionnaireCanonical,
  },
  openGraph: {
    title: QUESTIONNAIRE_METADATA.title,
    description: QUESTIONNAIRE_METADATA.description,
    type: "website",
    url: questionnaireCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: QUESTIONNAIRE_METADATA.title,
    description: QUESTIONNAIRE_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: QUESTIONNAIRE_METADATA.language,
  },
};

export default function QuestionnairePage() {
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
              hero={QUESTIONNAIRE_HERO}
              screenshot={getHomeProductScreenshot("questionnaire")}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <SolutionFeaturesSection
              header={QUESTIONNAIRE_FEATURES_HEADER}
              features={QUESTIONNAIRE_FEATURES}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={2}>
            <ApplicationStepsSection
              header={QUESTIONNAIRE_APPLICATION_HEADER}
              steps={QUESTIONNAIRE_APPLICATION_STEPS}
              sectionId="questionnaire-how-it-works"
              ariaLabel="How it works"
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={3}>
            <SolutionBenefitsSection
              header={QUESTIONNAIRE_BENEFITS_HEADER}
              items={QUESTIONNAIRE_BENEFIT_ITEMS}
              visualStats={QUESTIONNAIRE_BENEFIT_VISUAL_STATS}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={4}>
            <HomeCtaSection cta={QUESTIONNAIRE_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={5}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
