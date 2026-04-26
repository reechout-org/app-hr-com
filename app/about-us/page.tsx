import type { Metadata } from "next";

import {
  AboutUsFoundersSection,
  AboutUsHeroSection,
  AboutUsJourneySection,
  AboutUsMissionSection,
  AboutUsPrinciplesSection,
} from "@/app/about-us/components";
import { HomeCtaSection } from "@/components/home/home-cta-section";
import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  ABOUT_US_CTA,
  ABOUT_US_METADATA,
  aboutUsCanonical,
} from "@/app/about-us/content";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";

export const metadata: Metadata = {
  title: ABOUT_US_METADATA.title,
  description: ABOUT_US_METADATA.description,
  keywords: ABOUT_US_METADATA.keywords,
  authors: [{ name: ABOUT_US_METADATA.author }],
  robots: ABOUT_US_METADATA.robots,
  alternates: {
    canonical: aboutUsCanonical,
  },
  openGraph: {
    title: ABOUT_US_METADATA.title,
    description: ABOUT_US_METADATA.description,
    type: "website",
    url: aboutUsCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_US_METADATA.title,
    description: ABOUT_US_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: ABOUT_US_METADATA.language,
  },
};

export default function AboutUsPage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <AboutUsHeroSection />
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <AboutUsJourneySection />
          </HomePageMotionSection>
          <HomePageMotionSection index={2}>
            <AboutUsFoundersSection />
          </HomePageMotionSection>
          <HomePageMotionSection index={3}>
            <AboutUsPrinciplesSection />
          </HomePageMotionSection>
          <HomePageMotionSection index={4}>
            <AboutUsMissionSection />
          </HomePageMotionSection>
          <HomePageMotionSection index={5}>
            <HomeCtaSection cta={ABOUT_US_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={6}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
