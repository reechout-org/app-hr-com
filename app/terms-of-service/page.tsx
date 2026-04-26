import type { Metadata } from "next";

import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { TermsOfServiceView } from "@/components/legal";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";
import {
  TERMS_OF_SERVICE_METADATA,
  termsOfServiceCanonical,
} from "@/app/terms-of-service/content";

export const metadata: Metadata = {
  title: TERMS_OF_SERVICE_METADATA.title,
  description: TERMS_OF_SERVICE_METADATA.description,
  keywords: TERMS_OF_SERVICE_METADATA.keywords,
  authors: [{ name: TERMS_OF_SERVICE_METADATA.author }],
  robots: TERMS_OF_SERVICE_METADATA.robots,
  alternates: {
    canonical: termsOfServiceCanonical,
  },
  openGraph: {
    title: TERMS_OF_SERVICE_METADATA.title,
    description: TERMS_OF_SERVICE_METADATA.description,
    type: "website",
    url: termsOfServiceCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TERMS_OF_SERVICE_METADATA.title,
    description: TERMS_OF_SERVICE_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: TERMS_OF_SERVICE_METADATA.language,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <TermsOfServiceView />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={1}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
