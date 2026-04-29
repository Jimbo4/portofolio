# Portfolio – PRD

## Executive Summary

**Owner:** Jacopo Marcolini — Design Lead & Product Owner

**Problem:** No centralized, professional presence to showcase design and product work to potential clients, employers, and collaborators.

**Solution:** A personal portfolio website that presents Jacopo's professional identity, case studies, CV, and contact information in a clean, design-forward format.

**Value:** Establish a strong professional online presence that communicates both design craft and product thinking.

---

## Goals & Success Metrics

### Goals

- Present professional identity clearly and memorably
- Showcase design and product case studies with context and depth
- Make it easy for visitors to contact Jacopo or download his CV
- Reflect Jacopo's own design sensibility in the site's look and feel

### KPIs

| Metric                  | Target                  |
| ----------------------- | ----------------------- |
| Time to find contact    | < 2 clicks from home    |
| CV accessible           | One click from About    |
| Case study readability  | Clear on mobile + desktop |
| Lighthouse score        | > 90 performance, > 95 accessibility |

---

## User Personas

### Recruiter / Hiring Manager

- Lands on the site, wants a quick read of who Jacopo is and what he's done
- Needs: Clear title, short bio, link to CV, portfolio highlights
- Behavior: Skims quickly, downloads CV, may dig into one case study

### Potential Client / Collaborator

- Wants to understand Jacopo's process and outcomes, not just visuals
- Needs: Case studies with context — problem, role, decisions, results
- Behavior: Reads 1–2 case studies in depth, then contacts

### Conference / Community Peer

- Knows the field, wants to see taste and point of view
- Needs: Strong visual presentation, clear POV
- Behavior: Quick scroll, follows on social or saves for later

---

## Sections

### Home (`/`)

- Hero: Name, title ("Design Lead & Product Owner"), one-line positioning statement
- Brief intro (2–3 sentences)
- CTA: View case studies / Get in touch

### About (`/about`)

- Bio: Professional background, focus areas, approach to design and product
- CV: Downloadable PDF
- Contact: Email link, LinkedIn, and any other relevant links

### Case Studies (`/case-studies`)

- Grid or list of case study cards
- Each card: project title, brief description, tags (e.g., UX, Product Strategy, Design System)
- Clicking opens the full case study

### Case Study (`/case-studies/[slug]`)

- Structured narrative: Context → Problem → Role → Process → Outcome
- Mix of text and visuals (images, diagrams)
- Tags, timeline, tools used
- Navigation to next/previous case study

---

## Functional Requirements

### Must-Have (MVP)

- [ ] **Home page:** Hero + intro + CTAs
- [ ] **About page:** Bio + CV download + contact links
- [ ] **Case studies list page:** Cards with title, description, tags
- [ ] **Case study detail page:** Full narrative with images
- [ ] **Responsive layout:** Works on mobile, tablet, desktop
- [ ] **Static content system:** MDX or JSON files for case studies (no CMS needed at MVP)

### Should-Have (Post-MVP)

- [ ] **Animations / transitions:** Subtle motion to elevate feel
- [ ] **Dark mode:** Optional toggle
- [ ] **Contact form:** In-page form (with a service like Resend or Formspree)
- [ ] **OG meta tags:** Social preview images per page
- [ ] **Analytics:** Lightweight (Plausible or Vercel Analytics)

### Won't-Have (Out of Scope)

- ❌ Backend / database
- ❌ Authentication or admin panel
- ❌ Blog (may revisit later)
- ❌ CMS integration at MVP

---

## Non-Functional Requirements

### Performance
- Pages load in < 2 seconds on standard broadband
- Images optimized via Next.js `<Image>` component

### Accessibility
- Semantic HTML, ARIA labels where needed
- Keyboard navigable
- Color contrast meets WCAG AA

### Maintainability
- Case studies added via MDX or JSON files — no code changes needed for new content
- Clear folder structure, named components

---

## Content Strategy

Case studies are written and owned by Jacopo. Structure per case study:

```
/content/case-studies/
└── project-slug.mdx    ← frontmatter (title, description, tags, date, cover image) + body
```

Frontmatter shape:

```yaml
---
title: "Project Title"
description: "One-line summary"
tags: ["UX", "Product Strategy"]
date: "2024-03"
coverImage: "/images/case-studies/project-slug/cover.jpg"
---
```

---

*Document created: 2026-04-29*
*Version: 1.0*
