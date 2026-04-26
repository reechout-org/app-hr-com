import type { Metadata } from "next";

import { ContactPageView } from "@/app/contact/components";
import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { CONTACT_METADATA, contactCanonical } from "@/app/contact/content";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";

export const metadata: Metadata = {
  title: CONTACT_METADATA.title,
  description: CONTACT_METADATA.description,
  keywords: CONTACT_METADATA.keywords,
  authors: [{ name: CONTACT_METADATA.author }],
  robots: CONTACT_METADATA.robots,
  alternates: {
    canonical: contactCanonical,
  },
  openGraph: {
    title: CONTACT_METADATA.title,
    description: CONTACT_METADATA.description,
    type: "website",
    url: contactCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTACT_METADATA.title,
    description: CONTACT_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: CONTACT_METADATA.language,
  },
};

export default function ContactPage() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <ContactPageView />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={1}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
