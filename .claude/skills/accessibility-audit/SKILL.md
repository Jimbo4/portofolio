---
name: accessibility-audit
description: Audit the portfolio for WCAG 2.1 AA compliance. Checks color contrast, ARIA attributes, keyboard navigation, semantic HTML, focus management, and alt text. Use before deploy or after UI changes. Target: Lighthouse accessibility > 95.
---

# Accessibility Audit

Audit the portfolio (Next.js + Tailwind + shadcn/ui) for WCAG 2.1 AA compliance. Target score: Lighthouse accessibility > 95 as required by production checklist.

## Scope

Run against all pages: `/`, `/about`, `/case-studies`, `/case-studies/[slug]`.

## Checks to perform

### 1. Semantic HTML

- Headings use correct hierarchy (`h1` → `h2` → `h3`, no skips)
- `<nav>`, `<main>`, `<header>`, `<footer>` landmarks present
- Lists use `<ul>`/`<ol>` not `<div>` sequences
- Buttons use `<button>`, links use `<a href>` (not `<div onClick>`)

### 2. Color contrast

- Text on background: minimum 4.5:1 (normal text), 3:1 (large text / bold 18px+)
- Interactive elements (links, buttons): 3:1 against adjacent colors
- Check Tailwind design tokens in `globals.css` — verify contrast ratios for each color pair used

### 3. Images and media

- Every `<Image>` has a meaningful `alt` attribute (not empty, not "image")
- Decorative images use `alt=""` with `role="presentation"`
- Case study cover images: alt describes the project context, not just the file name

### 4. Interactive elements

- All interactive elements reachable via keyboard (`Tab`, `Shift+Tab`)
- Focus ring visible — Tailwind's `focus:ring` or `focus-visible:ring` applied
- No `outline: none` without a visible focus replacement
- Modal/drawer (if any) traps focus correctly and returns on close
- `CvDownloadButton` has accessible label (not just icon)

### 5. ARIA

- `aria-label` on icon-only buttons (e.g., LinkedIn, email icons in `ContactLinks`)
- `aria-current="page"` on active nav link
- No redundant ARIA (don't use `role="button"` on `<button>`)
- `aria-hidden="true"` on decorative SVG icons

### 6. Forms and links

- No bare "click here" or "read more" link text — links are self-describing
- External links have `target="_blank"` + `rel="noopener noreferrer"`
- External links indicate they open in new tab (`aria-label` or visible text)

### 7. Motion and animation

- `prefers-reduced-motion` respected — no auto-playing animations without this media query check

### 8. Language

- `<html lang="en">` set in `layout.tsx`

## Audit process

1. Read `src/app/layout.tsx` — check lang, landmarks, global nav structure
2. Read each page component (`page.tsx`) — check heading hierarchy and landmarks
3. Read `globals.css` — extract color tokens, calculate contrast ratios
4. Grep for `<Image` — verify alt attributes
5. Read `ContactLinks.tsx`, `CvDownloadButton.tsx` — check aria-labels
6. Grep for `onClick` on non-interactive elements
7. Grep for `outline-none` — flag if no focus replacement

## Output format

Report issues grouped by severity:

```
## Accessibility Audit Report

### Critical (blocks WCAG AA)
- [file:line] Description — Rule: WCAG 1.4.3 (Contrast)

### Warnings (degrades experience)
- [file:line] Description — Rule: WCAG 2.4.7 (Focus Visible)

### Passing
- Heading hierarchy: ✓
- Alt text: ✓
- ...

### Estimated Lighthouse Score Impact
[estimate based on issues found]
```

After reporting, offer to fix each critical issue inline.
