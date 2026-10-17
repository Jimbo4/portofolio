import type { Metadata } from "next";
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
  openGraph: {
    type: "website",
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
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        <ClickBurstFx />
        <HashScroll />
      </body>
    </html>
  );
}
