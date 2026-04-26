import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

import { BlogBody } from "@/app/blog/components";
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
  BLOG_METADATA,
  getAllSlugs,
  getPostBySlug,
} from "@/app/blog/content";
import { MARKETING_OG_IMAGE, SITE_BASE_URL } from "@/lib/site/marketing-site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params: paramsPromise,
}: PageProps): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article | ReechOut" };
  }

  const title = `${post.title} | ReechOut`;
  const description = post.excerpt;
  const url = `${SITE_BASE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImageUrl ?? MARKETING_OG_IMAGE;

  return {
    title,
    description,
    keywords: BLOG_METADATA.keywords,
    authors: [{ name: post.author }],
    robots: BLOG_METADATA.robots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "ReechOut",
      publishedTime: post.publishedAt,
      locale: "en_US",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params: paramsPromise }: PageProps) {
  const { slug } = await paramsPromise;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_BASE_URL}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ReechOut",
      logo: {
        "@type": "ImageObject",
        url: MARKETING_OG_IMAGE,
      },
    },
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };

  return (
    <div className="relative bg-gradient-to-b from-[var(--hero-bg-tint)] via-[var(--primary-lighter)] to-[var(--background-color)] dark:from-[#0a0612] dark:via-[#120a18] dark:to-[var(--background-color)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PageAmbientBackground />
      <div className="relative z-[1] flex min-h-screen flex-col text-[var(--text-primary)]">
        <HomePageNavMotion>
          <SiteNav mode="scroll" />
        </HomePageNavMotion>
        <main className="flex flex-1 flex-col">
          <HomePageMotionSection index={0}>
            <article className="w-full">
              <div
                className={`${PAGE_SHELL_CLASS} pt-[calc(var(--site-nav-height)+clamp(1.5rem,4vw,2.5rem))] pb-10`}
              >
                <Link
                  href="/blog"
                  className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-color)] transition-colors hover:text-[var(--accent-violet)]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to blog
                </Link>

                <header className="mx-auto max-w-3xl">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-[rgba(var(--primary-color-rgb),0.2)] bg-[rgba(var(--primary-color-rgb),0.06)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--primary-color)] dark:border-[rgba(var(--accent-violet-rgb),0.35)] dark:text-[var(--accent-violet)]">
                      {post.category}
                    </span>
                    <time
                      className="text-sm text-[var(--text-secondary)]"
                      dateTime={post.publishedAt}
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <h1 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--text-heading)]">
                    {post.title}
                  </h1>
                  <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <User className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    <span>{post.author}</span>
                  </div>
                </header>

                {post.coverImageUrl ? (
                  <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border-color-light)] shadow-[var(--shadow-medium)] dark:border-white/[0.08]">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 768px"
                        priority
                      />
                    </div>
                  </div>
                ) : null}

                <div className="mx-auto mt-12 max-w-3xl border-t border-[var(--border-color-light)] pt-10 dark:border-white/[0.08]">
                  <BlogBody blocks={post.body} />
                </div>
              </div>
            </article>
          </HomePageMotionSection>
          <HomePageMotionSection index={1}>
            <HomeCtaSection cta={BLOG_CTA} />
          </HomePageMotionSection>
        </main>
        <HomePageMotionSection index={2}>
          <SiteFooter />
        </HomePageMotionSection>
      </div>
    </div>
  );
}
