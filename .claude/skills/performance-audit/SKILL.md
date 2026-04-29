---
name: performance-audit
description: Audit the portfolio for Lighthouse performance score > 90. Checks image optimization, bundle size, Core Web Vitals, Next.js SSG usage, and font loading. Use before deploy or after adding new pages/images.
---

# Performance Audit

Audit the Next.js portfolio for Lighthouse performance > 90 as required by the production checklist. Focus on the highest-impact issues for a static, image-heavy site.

## Stack context

- Next.js 14 App Router, SSG (all pages static)
- Tailwind CSS (purged in production)
- MDX case study content with cover images
- Deployed on Vercel

## Checks to perform

### 1. Images (highest impact)

- Every image uses Next.js `<Image>` — never `<img>`
- `width` and `height` explicitly set (prevents layout shift → CLS)
- `priority` prop on above-the-fold images (hero, case study cover at top)
- `sizes` prop set correctly for responsive images
- Cover images in `public/images/case-studies/` — check if WebP/AVIF format (not PNG/JPEG)
- No unoptimized images (`unoptimized` prop should not be present unless necessary)

### 2. Fonts

- Fonts loaded via `next/font` (not `<link>` or `@import`) — eliminates render-blocking
- `display: 'swap'` set on font config
- Variable fonts preferred over multiple weight files
- No more than 2 font families loaded

### 3. JavaScript bundle

- Check `next.config.js` — bundle analyzer or `NEXT_ANALYZE=true` build available?
- Client Components (`"use client"`) used only for interactive elements — not whole pages
- No large client-side libraries imported in Server Components
- Dynamic imports (`next/dynamic` with `{ ssr: false }`) for heavy client-only components

### 4. Static generation

- All case study pages use `generateStaticParams` (no server-side rendering at request time)
- `revalidate` not set unless intentional (ISR adds complexity; prefer pure SSG for this portfolio)

### 5. Third-party scripts

- No Google Analytics / GTM / Intercom without `next/script` with `strategy="lazyOnload"`
- No blocking `<script>` tags in `layout.tsx`

### 6. CSS

- Tailwind purging active in production (default in Next.js + Tailwind setup)
- No `@import` in `globals.css` that blocks rendering
- No large unused CSS frameworks loaded alongside Tailwind

### 7. Core Web Vitals targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID / INP | < 200ms |
| TTFB | < 600ms (Vercel CDN edge) |

## Audit process

1. Read `next.config.js` — check image domains, bundle config, experimental flags
2. Read `src/app/layout.tsx` — check font loading, scripts
3. Grep for `<img` (not `<Image`) — flag all instances
4. Grep for `<Image` — check each for `priority`, `width`, `height`, `sizes`
5. Grep for `"use client"` — list all client components, assess if necessary
6. Check `public/images/` file list — flag large files or non-WebP formats
7. Read `src/app/case-studies/[slug]/page.tsx` — verify `generateStaticParams`

## Output format

```
## Performance Audit Report

### Critical (significant score drop)
- [file:line] Description — Impact: LCP / CLS / Bundle

### Warnings (moderate impact)
- [file:line] Description — Impact: minor

### Passing
- SSG: ✓ all pages static
- Font loading: ✓ next/font
- ...

### Estimated Lighthouse Performance Score
Current estimate: [range based on issues]
Target: > 90
```

After reporting, offer to fix each critical issue inline. For image format conversion (PNG → WebP), flag it but note it requires manual intervention or a build script.
