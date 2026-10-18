import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ClickBurstFx } from "@/components/features/ClickBurstFx";
import { HashScroll } from "@/components/features/HashScroll";
import { SiteFooter } from "@/components/features/SiteFooter";
import { SiteNav } from "@/components/features/SiteNav";
import { pillars, profile, siteTitle } from "@/lib/config";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: siteTitle, template: `%s — ${profile.name}` },
  description: profile.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [profile.name, ...profile.roles, ...pillars.map((pillar) => pillar.title), "Portfolio", "Case studies", profile.location.city],
  category: "portfolio",
  // Large previews and full snippets. Index and follow are the default, and setting them here would clash with the
  // noindex Next.js adds to the 404 page
  robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { email: false, address: false, telephone: false },
  // Each page sets its own canonical: one here would leak into pages that don't, like the 404
  // The shared images come from opengraph-image.png and twitter-image.png (scripts/render-brand.sh)
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    title: siteTitle,
    description: profile.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: profile.description,
  },
  other: {
    "geo.region": "IT-MI",
    "geo.placename": profile.location.label,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <ClickBurstFx />
        <HashScroll />
      </body>
    </html>
  );
}
