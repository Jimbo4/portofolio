---
name: seo-meta-audit
description: Audit the portfolio for SEO and Open Graph meta tags. Checks page titles, descriptions, OG image, canonical URLs, structured data, and robots config. Use before deploy or when adding new pages. Critical for portfolio discoverability by recruiters and clients.
---

# SEO & Meta Audit

Audit the Next.js portfolio for SEO completeness. Target audience: recruiters and clients finding Jacopo via Google or LinkedIn shares. Every page needs proper meta or it's invisible.

## Stack context

- Next.js 14 App Router — use `metadata` export or `generateMetadata()`, not `<Head>`
- Static site on Vercel — sitemap and robots.txt served as static files or via `next-sitemap`
- MDX case studies have frontmatter (title, description) that should feed into metadata

## Checks to perform

### 1. Page titles

Each page needs a unique, descriptive `<title>`:

| Page | Expected pattern |
|------|-----------------|
| `/` | "Jacopo Marcolini — Design Lead & Product Owner" |
| `/about` | "About — Jacopo Marcolini" |
| `/case-studies` | "Case Studies — Jacopo Marcolini" |
| `/case-studies/[slug]` | "[Case Study Title] — Jacopo Marcolini" |

### 2. Meta descriptions

- Every page has `description` in metadata export
- 120–160 characters, written for humans (not keyword-stuffed)
- Case study pages pull description from MDX frontmatter

### 3. Open Graph tags

Required on every page:
- `og:title`
- `og:description`
- `og:image` — 1200×630px, hosted in `/public/images/og/`
- `og:url` — canonical absolute URL
- `og:type` — `website` for home/about, `article` for case studies

Case study pages additionally:
- `og:article:published_time` from frontmatter `date`
- `og:article:tag` from frontmatter `tags`

### 4. Twitter / X Card

- `twitter:card`: `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image`

### 5. Canonical URL

- `alternates.canonical` set in metadata export for each page
- No duplicate content from trailing slashes

### 6. Robots

- `public/robots.txt` exists and allows all crawlers (or uses `next-sitemap`)
- No accidental `noindex` in metadata exports

### 7. Sitemap

- `public/sitemap.xml` exists OR `next-sitemap` package configured
- All public routes included: `/`, `/about`, `/case-studies`, each `/case-studies/[slug]`

### 8. Structured data (JSON-LD)

Nice-to-have for a portfolio:
- `Person` schema on `/about` with name, jobTitle, email, sameAs (LinkedIn, GitHub)
- `Article` or `CreativeWork` schema on case study pages

### 9. Next.js metadata implementation

Verify correct API usage (App Router):
```typescript
// Static page
export const metadata: Metadata = {
  title: '...',
  description: '...',
  openGraph: { ... },
  twitter: { ... },
  alternates: { canonical: 'https://...' },
};

// Dynamic page (case studies)
export async function generateMetadata({ params }): Promise<Metadata> {
  const study = getCaseStudyBySlug(params.slug);
  return { title: study.title, ... };
}
```

## Audit process

1. Read `src/app/layout.tsx` — check root metadata export (site-wide defaults)
2. Read each `page.tsx` — check individual metadata exports
3. Read `src/app/case-studies/[slug]/page.tsx` — check `generateMetadata` uses MDX frontmatter
4. Check `public/` for `robots.txt` and `sitemap.xml`
5. Grep for `og:image` paths — verify files exist in `public/images/og/`
6. Grep for `noindex` — flag any accidental use

## Output format

```
## SEO & Meta Audit Report

### Missing (page not findable / unfurl broken)
- [page] Missing og:image — LinkedIn/Slack shares will show no preview
- [page] No meta description — Google will auto-generate (poor quality)

### Warnings (suboptimal)
- [page] og:image not 1200×630 — may crop on some platforms

### Passing
- Page titles: ✓ unique per page
- Robots.txt: ✓
- ...

### Priority fixes
1. [Highest impact fix]
2. [Second fix]
```

After reporting, offer to:
- Generate missing metadata exports for each page
- Create an OG image template component (static or dynamic via `@vercel/og`)
- Generate `robots.txt` and `sitemap.xml` if missing
