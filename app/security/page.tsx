import type { Metadata } from "next";

import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { SecurityPageView } from "@/components/legal";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";
import {
  SECURITY_PAGE_METADATA,
  securityPageCanonical,
} from "@/app/security/content";

export const metadata: Metadata = {
  title: SECURITY_PAGE_METADATA.title,
  description: SECURITY_PAGE_METADATA.description,
  keywords: SECURITY_PAGE_METADATA.keywords,
  authors: [{ name: SECURITY_PAGE_METADATA.author }],
  robots: SECURITY_PAGE_METADATA.robots,
  alternates: {
    canonical: securityPageCanonical,
  },
  openGraph: {
    title: SECURITY_PAGE_METADATA.title,
    description: SECURITY_PAGE_METADATA.description,
    type: "website",
    url: securityPageCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SECURITY_PAGE_METADATA.title,
    description: SECURITY_PAGE_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: SECURITY_PAGE_METADATA.language,
  },
};

export default function SecurityPage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <SecurityPageView />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={1}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
