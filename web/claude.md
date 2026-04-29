# Portfolio – Web

## Overview

Personal portfolio website for Jacopo Marcolini, Design Lead & Product Owner.
Static Next.js site — no backend, no authentication, no API client needed.

## Stack

| Tech         | Version | Notes                                                                |
| ------------ | ------- | -------------------------------------------------------------------- |
| Next.js      | 14+     | App Router, SSG preferred for all pages                              |
| React        | 18+     | Server Components by default, Client Components only for interaction |
| Tailwind CSS | 3+      | Utility-first, mobile-first                                          |
| shadcn/ui    | Latest  | Headless components + Radix UI                                       |
| TypeScript   | 5+      | Strict mode enabled                                                  |
| MDX          | —       | Case study content files                                             |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
npm run dev   # Port 3000
```

### Running

```bash
npm run dev          # Dev server with hot reload (port 3000)
npm run build        # Optimized production build
npm run start        # Serve production build
npm run lint         # ESLint + type checking
npm run lint:fix     # Auto-fix linting issues
npx shadcn-ui add [component]  # Add shadcn components
```

## Architecture

```
web/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── page.tsx                  # Home: hero + intro + CTAs
│   │   ├── about/
│   │   │   └── page.tsx              # About: bio, CV download, contact
│   │   ├── case-studies/
│   │   │   ├── page.tsx              # Case studies grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Single case study detail
│   │   ├── layout.tsx                # Root layout (nav, footer, fonts)
│   │   └── globals.css               # Tailwind imports + design tokens
│   ├── components/
│   │   ├── ui/                       # shadcn components (auto-generated)
│   │   └── features/                 # Portfolio-specific components
│   │       ├── CaseStudyCard.tsx     # Card on list page
│   │       ├── CaseStudyNav.tsx      # Prev/next navigation
│   │       ├── ContactLinks.tsx      # Email + LinkedIn + etc.
│   │       └── CvDownloadButton.tsx  # CV PDF download CTA
│   ├── lib/
│   │   ├── case-studies.ts           # MDX content loader utilities
│   │   └── utils.ts                  # Helper functions (cn, etc.)
│   └── types/
│       └── index.ts                  # CaseStudy, Tag, etc.
├── content/
│   └── case-studies/                 # One .mdx file per case study
│       └── project-slug.mdx
└── public/
    ├── cv/                           # CV PDF
    └── images/
        └── case-studies/             # Cover + body images per project
```

## Pages & Routes

| Route                    | Type             | Description                        |
| ------------------------ | ---------------- | ---------------------------------- |
| `/`                      | Server Component | Hero + intro + CTAs                |
| `/about`                 | Server Component | Bio + CV download + contact links  |
| `/case-studies`          | Server Component | Grid of case study cards           |
| `/case-studies/[slug]`   | Server Component | Full case study (MDX rendered)     |

No authentication. No protected routes. All pages are public.

## Content: Case Studies

Case studies live in `content/case-studies/` as MDX files.

### Frontmatter shape

```yaml
---
title: "Project Title"
description: "One-line summary shown on the card"
tags: ["UX", "Product Strategy", "Design System"]
date: "2024-03"
coverImage: "/images/case-studies/project-slug/cover.jpg"
---
```

### Content loader pattern

```typescript
// lib/case-studies.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/case-studies');

export function getAllCaseStudies(): CaseStudy[] {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8');
      const { data } = matter(raw);
      return { slug, ...data } as CaseStudy;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getCaseStudyBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return matter(raw);
}
```

## Key Components

| Component           | Path                                    | Description                              |
| ------------------- | --------------------------------------- | ---------------------------------------- |
| `CaseStudyCard`     | `components/features/CaseStudyCard`     | Card with title, description, tags, cover |
| `CaseStudyNav`      | `components/features/CaseStudyNav`      | Previous / next case study links         |
| `ContactLinks`      | `components/features/ContactLinks`      | Email, LinkedIn, other social links      |
| `CvDownloadButton`  | `components/features/CvDownloadButton`  | Button linking to `/cv/jacopo-cv.pdf`    |

## Conventions

### File & Component Naming

- **Components:** PascalCase → `CaseStudyCard.tsx`
- **Hooks:** camelCase with `use` prefix → `useCaseStudies.ts`
- **Utils:** camelCase → `formatDate.ts`
- **Types:** PascalCase interfaces → `export interface CaseStudy { ... }`
- **Pages:** kebab-case folders → `app/case-studies/[slug]/page.tsx`
- **Content files:** kebab-case slugs → `design-system-overhaul.mdx`

### React Best Practices

- **Server Components by default:** `"use client"` only for interactive components
- **Static generation:** All case study pages statically generated at build time via `generateStaticParams`
- **Images:** Always use Next.js `<Image>` with explicit width/height
- **Error boundaries:** `error.tsx` in route folders that load external content

### TypeScript

- **Strict mode:** Always enabled, no `any`
- **Content types:** Keep `CaseStudy` type aligned with MDX frontmatter shape

### Styling

- **Tailwind only:** No CSS modules, no styled-components, no inline styles
- **Custom design tokens:** In `globals.css` only (colors, typography scale)
- **Responsive:** Mobile-first, use Tailwind breakpoints (`sm:`, `md:`, `lg:`)

## Boundaries

### ✅ Always (do autonomously)

- Use TypeScript strict mode, no `any`
- shadcn components for standard UI
- Tailwind for all styling
- Server Components for data-loading pages
- Next.js `<Image>` for all images
- Mobile-first responsive layout

### ⚠️ Ask First

- Add new npm dependencies
- Add new sections or routes
- Modify Tailwind config (colors, spacing scale)
- Change content file format (MDX → something else)

### 🚫 Never

- Add a backend, API routes that hit a database, or authentication
- Inline CSS or styled-components
- `any` type in TypeScript
- Hardcode personal data in components — keep in content files or a single `lib/config.ts`

## Production Checklist

Before deploy:

- [ ] All images optimized, using `<Image>` with correct dimensions
- [ ] CV PDF in `public/cv/` and download link correct
- [ ] OG meta tags set per page
- [ ] Lighthouse score > 90 performance, > 95 accessibility
- [ ] Test on mobile (Chrome DevTools device mode)
- [ ] Vercel environment set up, domain configured

## Resources

- [Next.js 14 Docs](https://nextjs.org/docs) - App Router reference
- [shadcn/ui Docs](https://ui.shadcn.com) - Component library
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility classes
- [MDX Docs](https://mdxjs.com) - Content authoring
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
