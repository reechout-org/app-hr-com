import type { Metadata } from "next";
import { Montserrat, Roboto_Mono } from "next/font/google";

import { LenisProvider } from "@/components/lenis-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { MARKETING_OG_IMAGE, SITE_BASE_URL } from "@/lib/site/marketing-site";

import "./globals.css";
import "lenis/dist/lenis.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: "ReechOut",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "ReechOut",
    locale: "en_US",
    images: [{ url: MARKETING_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <LenisProvider>{children}</LenisProvider>
        </AppProviders>
      </body>
    </html>
  );
}
