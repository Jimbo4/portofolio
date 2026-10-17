# Portfolio – Web

## Overview

Personal portfolio website for Jacopo Marcolini, Design Lead & Product Owner.
Static Next.js site — no backend, no authentication, no API client needed.
Repo: github.com/Jimbo4/portofolio, work happens on `main`.

## Stack

| Tech         | Version | Notes                                                                    |
| ------------ | ------- | ------------------------------------------------------------------------ |
| Next.js      | 16.4    | App Router, Turbopack, `cacheComponents` on, every page prerendered      |
| React        | 19      | Server Components by default, Client Components only for interaction     |
| Tailwind CSS | 4       | Tokens and `@utility` classes in `src/app/globals.css` (no config file)  |
| TypeScript   | 5       | Strict mode                                                              |
| MDX          | —       | Case studies: `gray-matter` + `next-mdx-remote/rsc`                      |

shadcn/ui is not installed. Ask before adding it or any other dependency.

## Getting Started

```bash
npm install
npm run dev     # Dev server on :3000 (the user's own, may serve stale CSS after globals.css edits)
npm run build   # Production build, must pass before every commit
npm run lint    # ESLint, must pass before every commit
npm run start   # Serve the production build
```

Preview for verification: `.claude/launch.json` has `web-prod` (`next start -p 3100`). Run `npm run build` first and
restart `web-prod` after every build, otherwise it serves the previous build.

## Architecture

```
web/
├── content/case-studies/           # One .mdx per real case study (slug = file name)
├── public/
│   ├── images/case-studies/<slug>/ # hero.webp, card.webp, body images
│   └── videos/case-studies/<slug>/ # optional videos
├── scripts/                        # Visual tooling, not part of the build: visuals/<slug>.html, render-visual.sh,
│                                   # pdf-contact-sheet.py, case-study-cover.html (old abstract covers)
└── src/
    ├── app/
    │   ├── page.tsx                  # Home: hero, philosophy pillars, projects carousel, skills, tools, contact
    │   ├── case-studies/page.tsx     # Works grouped by pillar, anchors #design #lead #ai #grow
    │   ├── case-studies/[slug]/      # Detail page: header, meta, cover, MDX body (or placeholder template)
    │   ├── layout.tsx                # Fonts (Fraunces, Inter, JetBrains Mono), nav, footer
    │   ├── **/loading.tsx            # Route skeletons (home, case studies, case study), mirror each page's layout
    │   └── globals.css               # Design tokens + utilities
    ├── components/features/
    │   ├── CaseStudyCard.tsx         # Card for carousel ("slide") and grid ("masonry")
    │   ├── CaseStudyMdx.tsx          # Blocks available inside case study MDX
    │   ├── PlaceholderCaseStudy.tsx  # Generic body for placeholder works (delete when none remain)
    │   ├── Skeleton.tsx              # Skeleton block, SkeletonPage wrapper, CaseStudyCardSkeleton
    │   ├── WorkCover.tsx             # Image cover or generated WorkArt
    │   └── WorksCarousel.tsx         # Infinite free-scrolling carousel (renders works ×3)
    ├── lib/
    │   ├── case-studies.ts           # Loader: MDX works + placeholders, sorted newest first
    │   ├── works.ts                  # Remaining design-file placeholders
    │   ├── config.ts                 # Personal data, pillars, tools (the only place for personal data)
    │   ├── shimmer.ts                # Animated next/image placeholder, removed once the image loads
    │   └── pillarTheme.ts            # Theme classes per pillar
    └── types/index.ts                # Work, CaseStudyFrontmatter, PillarId, …
```

Pillars (`PillarId`): `design` Product Design (blue), `lead` Team Leadership (orange), `ai` AI Enablement (purple),
`grow` Business & Growth (yellow).

## Adding a case study

Each project is meant to be done in its own chat. Everything needed is in this section; read it all before starting.

### Content rules (non-negotiable)

- **No client or employer-client names**, in copy or in images. Use generic phrasing ("a major European bank", "a
  mobile app publisher"). App or brand names visible in screenshots must be covered or removed (only exception so far:
  "Quazara" in the paywall screenshots, allowed by the user). Titles describe the project, they don't name the company.
- **Never invent metrics, KPIs or testimonials.** KPIs only when the user gives real numbers; otherwise omit `kpis`.
- **Use cv_master to fill gaps**: `C:\Users\JacopoMarcolini\Desktop\workspace\202608_curvit\curvit\cv_master.md`.
  Cross-check every relevant bullet for the project or role; ask before adding anything it doesn't support.
- **Portfolio, not CV**: the year is a single year ("2026"), never a period like "2026 – present".
- **Copy in English**, first person, plain and concrete. Product taglines may stay in their original language.
  Keep a plain portfolio tone without marketing phrasing, and avoid "X, not Y" or "not X, but Y" constructions.
- **Vary the layout between sections**: never use the same block for two sections of one page (see blocks below).
  Reuse layouts that already exist in the portfolio first; create a new one only occasionally, when it is clearly more
  engaging.
- Each new real project replaces a placeholder: ask the user which one to remove from `src/lib/works.ts`.

### Intake questions

Ask these in one message, proposing a default for each so the user only corrects what's wrong:

1. Title (descriptive, no company name) and slug
2. Pillar (`design` | `lead` | `ai` | `grow`)
3. Date as `YYYY-MM` (used for ordering, newest first)
4. Client described generically, and what the product is
5. Scope: how many products/apps, which categories, which platforms
6. Role: solo or with a team, who they worked with
7. Process and decisions worth telling (offer assumptions read from the images or materials)
8. Principles or methods to highlight (Laws of UX, lawsofux.com, is a good source)
9. Real numbers, if any
10. Visuals available: screenshots, video, codebase or brand kit to generate assets from; links that can be published

### Page structure

Modeled on glueglue.com/it/works case studies. Each `##` heading in MDX is a section:

1. **Intro**: what the product is, in two short paragraphs
2. **Challenge**: the context and a bullet list of what the work had to achieve (bold lead-in per bullet)
3. **Media** between text sections (screens, gallery, video)
4. **Process**: how it came together, broken down by discipline or step
5. **Principles / decisions** (optional): why the design works
6. **Outcome**: what now exists, no invented results

### Frontmatter (`CaseStudyFrontmatter`)

```yaml
---
name: Paywall Design System
pillar: design
date: "2025-04"
tags: ["Mobile App", "Monetization", "Design System"]
role: Product Designer
blurb: One subscription page, designed to convert across a family of freemium apps.   # card text
description: >-                                                                         # detail page intro
  A reusable paywall system for …
cover:
  card: /images/case-studies/<slug>/card.webp   # 4:5, 960×1200
  hero: /images/case-studies/<slug>/hero.webp   # 2:1, 2400×1200, also the OpenGraph image
  alt: Describe what the hero shows
links:                     # optional, only links the user approved
  - label: example.com
    href: https://example.com
kpis:                      # optional, exactly 2, real numbers only
  - { value: "<number>", caption: "<what it measures>" }
  - { value: "<number>", caption: "<what it measures>" }
kpiIcon: growth            # optional, icon between the KPIs: growth (default, rising line chart) | graduation
---
```

The loader validates the frontmatter and fails the build on missing or malformed fields. There is no `status` field.

### MDX blocks (`src/components/features/CaseStudyMdx.tsx`)

MDX runs with JavaScript expressions blocked: **every prop is a plain string** (`width="750"`, never `width={750}`).
Markdown `##`, paragraphs, bullet lists, `**bold**` and links are styled automatically.

| Block | Use for | Look |
| --- | --- | --- |
| `<Figure src alt width height caption? sizes?>` | Any image; width/height are the file's pixels | Rounded image + caption, top margin when standalone |
| `<Screens layout="row">` | Up to 5 phone screens | 2 cols mobile, 5 desktop |
| `<Screens layout="pair">` | Two large screens | 2 cols, max 760px |
| `<Screens layout="trio">` | Three visuals, e.g. exercise sheets | 1 col mobile, 3 from 640px |
| `<Gallery>` | Social posts, 4:5 visuals | 2 cols mobile, 4 desktop |
| `<Disciplines><Discipline label>` | Work broken down by discipline | Boxed white cards, 2 cols |
| `<Steps><Step label>` | A process in order | Numbered rows 01, 02… with dividers |
| `<Principles><Principle label>` | Named principles, laws, decisions | Open 3-col grid, heavy top rule, italic names |
| `<VideoFeature title src poster label>` | A vertical video next to its story | White panel, text + 9:16 player |

Text inside `Discipline`, `Step`, `Principle` and `VideoFeature` goes on its own indented lines. If no block fits a
new section, add a new layout to `CaseStudyMdx.tsx` (and register it in `caseStudyComponents`) instead of repeating one.

### Assets

- Folders: `public/images/case-studies/<slug>/` and `public/videos/case-studies/<slug>/`. Use kebab-case file names.
- Tools: ffmpeg is installed via winget (`Gyan.FFmpeg`), binary at
  `C:/Users/JacopoMarcolini/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/`.
  Headless Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe` renders HTML compositions to PNG.
- Images: convert to WebP, `ffmpeg -i in.png -vf "scale=720:-1:flags=lanczos" -c:v libwebp -quality 82 out.webp`
  (720 wide for posts, 660 for phone screens; keep source size when already ≤ 750 wide).
- Video: 720p H.264, `-vf scale=720:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k`,
  plus a JPG poster. Check music licenses in the source project before publishing.
- **Hero and card** follow the Matcha model (look at `public/images/case-studies/matcha/` first):
  - Each project gets its own visual identity (fonts, palette, shapes), used **only in its images**; the rest of the
    page stays in the portfolio identity. If the project has a brand kit, use it; otherwise invent one that fits.
  - The only text is the project title, large. The hero may add one short payoff, only if needed. No fake UI cards,
    labels, dates or captions.
  - Hero (2400×1200): title plus the identity's shapes or a semi-transparent 3D render (three.js runs in headless
    Chrome). Card (1200×1500, exported at 960×1200): title on top plus real screens or the same 3D render or shapes.
  - Compose them as HTML in `scripts/visuals/<slug>.html` (one `<section id>` per image, picked with `?v=`) and render
    with `scripts/render-visual.sh <html> <view> <W>x<H> <out.webp> [output width]`. The case study's body images can
    live in the same file.
  - When replacing an image that has already been published, give it a new file name (`hero-v2.webp`): next/image
    caches by URL.
  - `scripts/case-study-cover.html` (abstract pillar gradients) is the old approach, kept only as a fallback.
- **Reading source decks**: `pdftotext -layout` (ships with Git for Windows) for text; `scripts/pdf-contact-sheet.py`
  renders every page into one PNG to study the style (needs PyMuPDF in a throwaway venv, see its header). Never show
  company logos, photos of people, or names of colleagues and participants.
- Never copy secrets, `.env` files or legal documents from source projects.

### Verify and ship

1. `npm run lint` and `npm run build` in `web/`
2. Restart `web-prod`, open `/case-studies/<slug>`, `/case-studies` and the home carousel; check mobile (375px) for
   horizontal overflow. If the browser pane is hidden, screenshots after scrolling can come out blank: enlarge the
   viewport with `resize_window` instead of scrolling.
3. Show the result to the user, then commit only with their go-ahead; push only when asked. Commit messages end with
   the attribution line given in the session.

## Published case studies

| Slug | Year | Pillar | Notes |
| --- | --- | --- | --- |
| `matcha` | 2026-03 | design | Personal project (co-founder, CXO & CMO). Source: `C:\Users\JacopoMarcolini\Desktop\workspace\202606_matcha` (trailer, b2c posts, matcha-codebase, deliverables). No KPIs. Only the public price (€10 per person, drink included), never the venue split. Links: matchadating.it, Instagram @matchadating_it. Hero composed in the Play Store feature graphic style. |
| `paywall-design-system` | 2025-04 | design | Solo design work for a mobile app publisher's freemium apps (fashion resale, cloud gaming), iOS + Android. No KPIs. Only two screenshots exist. Covers in `scripts/visuals/paywall-design-system.html`: black liquid chrome with silver reflections from a WebGL fragment shader, Leckerli One script title in white with a silver sheen, no icons. |
| `ai-training-program` | 2026-01 | ai | All generative AI training programs told as one activity (no program or client named; the two universities are named with the user's ok). Sources: hub proposal, a client workshop deck and a university talk in OneDrive `bid/202604_prevendita` (16, 18, 20). KPIs from cv_master (400+ hours, 600+ people); 25+ companies and 90+ validated use cases from the proposal, in prose. No phase durations or agenda details: it is a generalization. Solo or leading a team of tutors. Visuals in `scripts/visuals/ai-training-program.html`: navy, blue-violet-pink-orange gradient, Poppins, three.js glass sparkles on hero and card; the `slides` view is a tilted collage of 20 rebuilt training slides with generic content (render with `SWIFTSHADER=0`). No logos, people or client survey data. |
| `spendscape` | 2025-12 | lead | Three payment-data dashboards (cross-border tourism, domestic tourism, merchant payment performance) for "one of the world's largest payment networks", never named. Spendscape is an invented name. Sources: screenshots and two codebases in the user's Downloads. KPIs 500+ users, 30+ markets; €2M+ budget, weekly releases and a 10+ person team in prose. Visuals in `scripts/visuals/spendscape.html`: every screen rebuilt in HTML with fictional brand, user and data (d3 + world-atlas map, Voronoi cells as regions); the client's orange/red palette and a Mark-like geometric font (DM Sans) are allowed, its overlapping circles and name never. Covers tilt the screens in iframes (`BUDGET=20000` when rendering). |

Remaining placeholders in `src/lib/works.ts`: Metrix, Forma Studio, FlowOS.

## Conventions

- **Components:** PascalCase → `CaseStudyCard.tsx`
- **Utils / functions:** camelCase
- **Content files:** kebab-case slugs → `paywall-design-system.mdx`
- **Images:** always Next.js `<Image>` with explicit width/height (or `fill` inside a sized frame), and
  `placeholder={shimmerPlaceholder}` so a slow image shows a shimmer instead of an empty box
- **Loading states:** a new route gets a `loading.tsx` built from `Skeleton` that mirrors its layout; a slow element
  without its own placeholder (e.g. a video) sits in a `skeleton` frame
- **Tailwind only:** no CSS modules, no inline styles; tokens only in `globals.css`
- **Mobile-first**, no horizontal page scroll
- **No `any`** in TypeScript

## Boundaries

### ✅ Always

- TypeScript strict, Tailwind only, Server Components for data-loading pages
- Next.js `<Image>` for all images
- Mobile-first responsive layout

### ⚠️ Ask First

- Add new npm dependencies
- Add new sections or routes
- Change tokens in `globals.css` (colors, spacing scale)
- Change content file format (MDX → something else)

### 🚫 Never

- Add a backend, API routes that hit a database, or authentication
- Inline CSS or styled-components
- `any` type in TypeScript
- Hardcode personal data in components — keep it in content files or `lib/config.ts`
- Name clients, or publish metrics the user didn't provide
