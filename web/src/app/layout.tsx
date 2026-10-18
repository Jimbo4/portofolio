import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ClickBurstFx } from "@/components/features/ClickBurstFx";
import { HashScroll } from "@/components/features/HashScroll";
import { SiteFooter } from "@/components/features/SiteFooter";
import { SiteNav } from "@/components/features/SiteNav";
import { profile } from "@/lib/config";
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

const title = `${profile.name} — ${profile.roles.join(" & ")}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: profile.description,
  alternates: { canonical: "/" },
  // The shared images come from opengraph-image.png and twitter-image.png (scripts/render-brand.sh)
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    title,
    description: profile.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.roles[0],
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location.city,
    addressCountry: profile.location.country,
  },
  sameAs: [profile.linkedin, profile.github],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
