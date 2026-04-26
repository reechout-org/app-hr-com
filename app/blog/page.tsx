import type { Metadata } from "next";

import { BlogHero, BlogSearch } from "@/app/blog/components";
import { HomeCtaSection } from "@/components/home/home-cta-section";
import {
  HomePageMotionSection,
  HomePageNavMotion,
} from "@/components/home-page-motion";
import { PageAmbientBackground } from "@/components/page-ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { PAGE_SHELL_CLASS } from "@/lib/site/page-layout";
import {
  BLOG_CTA,
  BLOG_HERO,
  BLOG_METADATA,
  blogCanonical,
  getAllPostsSorted,
  getPostCardFields,
} from "@/app/blog/content";
import { MARKETING_OG_IMAGE } from "@/lib/site/marketing-site";

export const metadata: Metadata = {
  title: BLOG_METADATA.title,
  description: BLOG_METADATA.description,
  keywords: BLOG_METADATA.keywords,
  authors: [{ name: BLOG_METADATA.author }],
  robots: BLOG_METADATA.robots,
  alternates: {
    canonical: blogCanonical,
  },
  openGraph: {
    title: BLOG_METADATA.title,
    description: BLOG_METADATA.description,
    type: "website",
    url: blogCanonical,
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_METADATA.title,
    description: BLOG_METADATA.description,
    images: [MARKETING_OG_IMAGE],
  },
  other: {
    language: BLOG_METADATA.language,
  },
};

export default function BlogPage() {
  const posts = getAllPostsSorted().map(getPostCardFields);

  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <BlogHero
              title={BLOG_HERO.title}
              subtitle={BLOG_HERO.subtitle}
            />
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <section
              className="pb-[clamp(3rem,8vw,5rem)]"
              aria-label="Articles"
            >
              <div className={PAGE_SHELL_CLASS}>
                <BlogSearch posts={posts} />
              </div>
            </section>
          </HomePageMotionSection>
          <HomePageMotionSection index={2}>
            <HomeCtaSection cta={BLOG_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={3}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
