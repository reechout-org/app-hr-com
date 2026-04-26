import type { Metadata } from "next";

import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { PrivacyPolicyView } from "@/components/legal";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  PRIVACY_POLICY_METADATA,
  privacyPolicyCanonical,
} from "@/app/privacy-policy/content";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";

export const metadata: Metadata = {
  title: PRIVACY_POLICY_METADATA.title,
  description: PRIVACY_POLICY_METADATA.description,
  keywords: PRIVACY_POLICY_METADATA.keywords,
  authors: [{ name: PRIVACY_POLICY_METADATA.author }],
  robots: PRIVACY_POLICY_METADATA.robots,
  alternates: {
    canonical: privacyPolicyCanonical,
  },
  openGraph: {
    title: PRIVACY_POLICY_METADATA.title,
    description: PRIVACY_POLICY_METADATA.description,
    type: "website",
    url: privacyPolicyCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PRIVACY_POLICY_METADATA.title,
    description: PRIVACY_POLICY_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: PRIVACY_POLICY_METADATA.language,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <PrivacyPolicyView />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={1}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
