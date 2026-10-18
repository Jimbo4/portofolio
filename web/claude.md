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
│                                   # render-og.sh (JPG link previews of the heroes), render-brand.sh (site icons and
│                                   # default link preview from visuals/brand.html), pdf-contact-sheet.py,
│                                   # case-study-cover.html (old abstract covers)
└── src/
    ├── app/
    │   ├── page.tsx                  # Home: hero, philosophy pillars, projects carousel, skills, tools, contact
    │   ├── case-studies/page.tsx     # Works grouped by pillar, anchors #design #lead #ai #grow
    │   ├── case-studies/[slug]/      # Detail page: header, meta, cover, MDX body
    │   ├── layout.tsx                # Fonts (Fraunces, Inter, JetBrains Mono), nav, footer
    │   ├── **/loading.tsx            # Route skeletons (home, case studies, case study), mirror each page's layout
    │   └── globals.css               # Design tokens + utilities
    ├── components/features/
    │   ├── CaseStudyCard.tsx         # Card for carousel ("slide") and grid ("masonry")
    │   ├── CaseStudyMdx.tsx          # Blocks available inside case study MDX
    │   ├── Skeleton.tsx              # Skeleton block, SkeletonPage wrapper, CaseStudyCardSkeleton
    │   ├── WorkCover.tsx             # Cover image (card 4:5 or hero 2:1)
    │   └── WorksCarousel.tsx         # Infinite free-scrolling carousel (renders works ×3), drifts when idle, holds on hover
    ├── lib/
    │   ├── case-studies.ts           # Loader: MDX case studies, sorted newest first
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
- **Treat every project name as its real name.** Never write that a name is invented or "the name I use here", and
  never say in captions or alt text that screens are rebuilt, recreated or fictional. Invented names and fictional data
  are recorded only in this file and in `internalRef`.
- **Portfolio, not CV**: the year is a single year ("2026"), never a period like "2026 – present".
- **Copy in English**, first person, plain and concrete. Product taglines may stay in their original language.
  Keep a plain portfolio tone without marketing phrasing, and avoid "X, not Y" or "not X, but Y" constructions.
- **Vary the layout between sections**: never use the same block for two sections of one page (see blocks below).
  Reuse layouts that already exist in the portfolio first; create a new one only occasionally, when it is clearly more
  engaging.

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
internalRef: Bending Spoons # internal only, never rendered: the real client or project, for future searches
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
`internalRef` is required by convention on every case study (ask the user for it) but never read by the site.

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
| `<VideoFeature title src poster label captions? captionsLang? captionsLabel?>` | A vertical video next to its story | White panel, text + 9:16 player; stacked below the text until 1024px; `captions` is a WebVTT file of the spoken audio |
| `<TokenSlider label><Token name language color bars src alt>` | A collection shown one item at a time (NFTs) | Dark panel slider: 840px square image + name, story, three traits; dots, counter, arrows |
| `<TokenSlider label><Law name module source use src alt>` | Named principles or laws shown one at a time | Same slider; traits are Module, Source and Use it for |

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
  plus a JPG poster. Check music licenses in the source project before publishing. A video with speech ships with a
  WebVTT captions file next to it (`trailer.it.vtt`), passed to `VideoFeature` as `captions`.
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
  - Compositions of many screens (isometric grids, fans) never repeat a screen within one image. Build more unique
    screens from the source code (one per page, tab or state) and raise the scale until the visible slots fit the pool;
    `spendscape.html` culls off-canvas slots and reports `data-slots` / `data-overflow` via `--dump-dom`.
  - When replacing an image that has already been published, give it a new file name (`hero-v2.webp`): next/image
    caches by URL.
  - After adding or replacing a hero, run `scripts/render-og.sh`: it writes the 1200x600 JPG twin (`hero-v2.jpg`)
    that the page uses as its link preview image (LinkedIn and some chat apps don't show WebP).
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
| `paywall-design-system` | 2024-08 | design | Solo design work for a mobile app publisher's freemium apps (fashion resale, cloud gaming), iOS + Android. No KPIs. Only two screenshots exist. Covers in `scripts/visuals/paywall-design-system.html`: black liquid chrome with silver reflections from a WebGL fragment shader, Leckerli One script title in white with a silver sheen, no icons. |
| `ai-training-program` | 2026-01 | ai | All generative AI training programs told as one activity (no program or client named; the two universities are named with the user's ok). Sources: hub proposal, a client workshop deck and a university talk in OneDrive `bid/202604_prevendita` (16, 18, 20). KPIs from cv_master (400+ hours, 600+ people); 25+ companies and 90+ validated use cases from the proposal, in prose. No phase durations or agenda details: it is a generalization. Solo or leading a team of tutors. Visuals in `scripts/visuals/ai-training-program.html`: navy, blue-violet-pink-orange gradient, Poppins, three.js glass sparkles on hero and card; the `slides` view is a tilted collage of 20 rebuilt training slides with generic content (render with `SWIFTSHADER=0`). No logos, people or client survey data. |
| `spendscape` | 2025-12 | lead | Three payment-data dashboards (cross-border tourism, domestic tourism, merchant payment performance) for "one of the world's largest payment networks", never named. Spendscape is an invented name. Sources: screenshots and two codebases in the user's Downloads. KPIs 500+ users, 30+ markets; €2M+ budget, weekly releases and a 10+ person team in prose. Visuals in `scripts/visuals/spendscape.html`: every screen rebuilt in HTML with fictional brand, user and data (d3 + world-atlas map, Voronoi cells as regions); the client's orange/red palette and a Mark-like geometric font (DM Sans) are allowed, its overlapping circles and name never. 21 rebuilt screens (pages, tabs and states of the three products); hero, card and showcase each use a screen at most once, unused slots off-canvas are culled. Covers tilt the screens in iframes (`BUDGET=25000` when rendering). Images are `-v2` after the first showcase repeated screens. The source codebases are no longer in Downloads. |
| `marquee` | 2025-04 | lead | A production ERP for the commercials division and a creative AI studio (book scouting, moodboards, document chat) for "one of Italy's leading film and TV production companies", never named. Marquee is an invented name. Sources: two codebases in the user's Downloads (ERP and AI platform). No KPIs, no principles section (the user asked to skip it). Visuals in `scripts/visuals/marquee.html`: every screen rebuilt in HTML with Italian UI and fictional brand, projects, people and books; painted SVG stills and a pencil storyboard stand in for photos and generated images. Identity: red on red, after the user's Twin Peaks reference. The title is Anton in brick red (`--brick`, #d0412f) with a dark drop shadow, the payoff white Inter in wide caps; the light-bulb title was dropped because the user disliked it. Hero and card sit on closed red velvet curtains painted per pixel on a canvas (`drawCurtains`, modelled on a curtain photo the user shared, which is not shipped), the showcase on the same cloth turned into a horizontal silk veil (`data-mode="veil"`); film grain. The wordmark inside the rebuilt screens is the same brick-red Anton. The showcase places each of the 14 rebuilt screens once, never repeated. Covers are `-v3` and body images `-v2` because earlier versions were cached. Hero and card fan the screens out in 3D iframes (`BUDGET=20000`), showcase is an isometric grid (`BUDGET=40000`); render single screens with `SWIFTSHADER=0 BUDGET=15000`, shorter budgets can drop the fonts. |
| `bloom` | 2021-03 | design | Moved from grow to design at the user's request. A white-label, multi-tenant employee engagement platform (feed, rewards, growth challenges with checkpoints, surveys and suggestions, OKRs, wiki with AI assistant, HR analytics with organisational network, surveys and manager reviews) for client companies, told as one platform: the user asked not to split it into its legacy and newer versions, and to cite every technology. Bloom is an invented name; never name the product, its owner, the agency that first designed it, the vendor or any tenant. Role: Fullstack Developer & Client Lead (single point of contact for the client companies). Sources: five codebases in the user's Downloads (`beyou-*`) and a public agency case study used only for content and style cues. No KPIs. Visuals in `scripts/visuals/bloom.html`: 20 desktop and 8 mobile screens rebuilt in HTML (Sen font) with fictional workspaces to show the white label (Vireo teal, Halden navy, Corvia in the orange of the Bloom mark, Lumina purple, Alder green; the five phones in the body each belong to a different one, and the card pairs Halden, Vireo and Corvia), fictional people and data, no photos. Identity: cream background, flat petal flowers on stems in the palette orange, yellow, teal, sky and mint, Bricolage Grotesque title whose two o's open into flowers. Hero: tablet + phone in 3D; card: three phones; `showcase` isometric grid places each desktop screen once (`BUDGET=45000 SWIFTSHADER=0`); `white-label` pairs the workspace setup with phones in two other workspaces. Phones render crisp with `?v=m-<id>&z=2` at 780x1688. |
| `domus` | 2022-06 | grow | An all-in-one hospitality platform for serviced apartments: guest app (doors, lights, climate, services, orders), smart TV homepage (concierge contacts, services, channels in the guest's language, cast page with wifi QR) and a front desk web panel (stays, guests, invites, multilingual service catalogue, activation per structure, booking history with CSV, structures, apartments, TV channels, users). Domus is an invented name; never name the client, its brand or its city (the user asked not to mention it). Role: Fullstack Developer & Client Lead, in a team of developers, single point of contact for the B2B clients. Sources: three codebases in the user's Downloads (`domya-app-main` Flutter, `domya-tv-master` Tizen web app, `domya-website-main` React panel) and the client's public site, used only for content and style cues; the TV code holds a hardcoded API credential, never copy it. No KPIs, no principles section (the user asked to skip it). Visuals in `scripts/visuals/domus.html`: 15 panel, 9 mobile and 4 TV screens rebuilt in HTML (Jost UI, Bodoni Moda headings) with fictional properties (Casa Ortensia, Palazzo Aurelia, Residenza Olmo), suites, guests, staff and channels; flat SVG interiors and arch-niche service tiles stand in for photos; the decorative QR encodes nothing. Identity: terracotta `#d4553f`, cream, oxblood, receding round-headed arches (a doorway mark with keystone), Bodoni Moda title at `opsz` 26 so its hairlines survive at card size; headings inside screens are Bodoni Moda 600 at `opsz` 18 (the user found the thin ones hard to read). No payoff and no floor band on the covers: the arches stand on the bottom edge (both removed at the user's request). The phone screens follow the original app: flat cream, no cards, uppercase titles, divided lists, the automation menu as three round buttons over a suite wifi notice, the door as one large round button. The body has no front desk showcase grid (the user removed it; the `showcase` view still exists). Hero, card and `one-stay` are flat lays seen from above, after a device mockup the user shared: an open laptop with keyboard (`.lap`), a thin-bezel TV panel (`.tvflat`) and phones lying on the arches, with box shadows (a `filter: drop-shadow` on the laptop rendered blank rectangles when it crossed the canvas edge). Each cover shows a phone, a computer and a TV to make the multi-device scope clear (the user rejected three phones and a floating monitor). Hero: TV home, front desk stays, phone suite (`BUDGET=25000`); card: TV cast page, apartment editor, phone climate; `one-stay`: laptop stay, TV service, two phones (`BUDGET=30000`). TV screens render at 1920x1080. Covers and `one-stay` are `-v3`, the other body images `-v2`. |
| `algorithmic-tokens` | 2022-04 | grow | A real name: an NFT collection on Ethereum (OpenSea collection `algorithmic-tokens`, 7 tokens, April 2022, 3% creator fee) with one token per famous algorithm (Hello World, Bubble Sort, Recursive Fibonacci, AdaBoost, AlexNet, GoogleNet, ResNet), drawn by a Python script from the code: bar count = log of code length, bar width against 80 characters per line, color = first 6 hex digits of keccak256(code). Made for the AI consultancy the user worked at (BID, never named; its logo is on the OpenSea banner and in the tokens' corner, so no OpenSea link and the rebuilt tokens leave the logo out). Role: Blockchain Developer & Product Owner, solo. The user wrote a custom ERC-1155 prototype in Solidity, deployed on a testnet, then moved to OpenSea's shared storefront (that is the mainnet contract). Goals include taking part in the Metaverse Summit in Milan 2022. No KPIs (sales and volume are zero, never shown). Sources: the 7 token PNGs from the user's Downloads (bar widths and colors measured and stored in `TOKENS` in the visuals file) and the OpenSea page. Visuals in `scripts/visuals/algorithmic-tokens.html`: identity is deep space black `#05070b` around the tokens' `#0d1117`, an anti-aliased cyan shader grid fading into the horizon, the seven token colors as only accents, a spectrum mark of seven bars, Unbounded title and JetBrains Mono labels. Hero, card and `collection` are three.js with bloom (`BUDGET=15000`): tokens as thin slabs with colored rims, halos and light pools; `anatomy` and `t-<id>` (flat tokens, 1050 → 840) render with `SWIFTSHADER=0`. The body uses the `TokenSlider` block, made for this page. |
| `design-journey` | 2023-11 | design | A real name: the design course (cognitive ergonomics, cognition and language, aesthetic design, data visualization, plus the hands-on stage Walk the talk; four modules of 4h + hands-on; a short format called Design Pills) for "one of Italy's largest banking groups" (BPER, never named; the user wrote "the largest", copy says "one of the largest"). Role: Design Lead & Trainer, delivered with a designer from the team (never name her). Sources: OneDrive `bid/202311_bper_uiux/2_corso_design` (decks, Walk the talk restyles and design-process sheets). Decks use copyrighted photos and the restyles hold client data: nothing is shown as is. No payoff, no KPIs, no links (the user asked not to cite Laws of UX explicitly). Carousel sources checked online: Takete and Maluma is "Köhler, 1929 and 1947" (maluma is the 1947 word), proximity Wertheimer 1923, pre-attentive Treisman & Gelade 1980. Visuals in `scripts/visuals/design-journey.html`: identity is near-black forest `#07140d`, neon green `#3dff74` (asked by the user, darker `#0b9e45` for text on light), coral `#ff5b3a` (Takete), electric blue `#2f6bff` (Maluma) and cream, Archivo wide and heavy for titles, IBM Plex Mono labels; the symbol is Takete & Maluma in three.js: a faceted burst of coral pyramids (approved, keeps its own warm env map) and a blue Maluma made of metaballs (`MarchingCubes`, a core plus a chain of balls per finger, after a reference with seven rounded lobes). The flat marks follow the same reference (`malumaRadii` builds the Maluma outline). The roadmap line is straight and horizontal; in `law-contrast` the squares and bar share one fill; the before pie paints slices back to front. Hero, card and `law-takete-maluma` need WebGL (`BUDGET=25000`, the law card may need 40000); the other `law-*` cards (840 square, flat SVG on colored fields), `journey`, `slide-*` (1280x720 playground slides, English, generic content) and `restyle` (before/after of a sector page with invented sectors and numbers) render with `SWIFTSHADER=0`. The body uses `TokenSlider` with the `Law` slide, made for this page. |

All placeholders from the design file have been removed: every project on the site is an MDX case study.

## Icons and link previews

- Monogram "JM" in Fraunces black italic on an ink tile (`scripts/visuals/brand.html`). `scripts/render-brand.sh`
  renders `src/app/favicon.ico` (16/32/48), `icon.png`, `apple-icon.png`, `public/icon-192.png` / `icon-512.png`
  (used by `src/app/manifest.ts`) and `src/app/opengraph-image.png` / `twitter-image.png`, the default link preview
  (the home hero). Next.js adds the `<head>` tags from these files.
- Case study pages share their hero's JPG twin instead (`generateMetadata` in `case-studies/[slug]/page.tsx`).
- Canonical domain is `jacopomarcolini.com` (`profile.siteUrl`); `.app`, `.dev` and `.me` redirect to it in Vercel.

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
- **Accessibility:** text meets WCAG AA contrast (`muted-2` is the lightest grey allowed for text), icon-only buttons
  have an `aria-label` and SVG icons instead of arrow characters, touch targets are at least 24px (enlarge with a
  pseudo-element when the visual must stay small), motion stops for reduced motion and on hover
- **Scroll:** never leave a hash in the URL after scrolling to a section (`HashScroll` and `SiteNav` remove it), or the
  back button jumps there again
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
