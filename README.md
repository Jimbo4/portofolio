# Jacopo Marcolini – Portfolio

Personal portfolio website for Jacopo Marcolini, Design Lead & Product Owner.

Built with Next.js 14, Tailwind CSS, and shadcn/ui. Content managed via MDX files.

---

## Stack

| Layer    | Technology           | Version |
| -------- | -------------------- | ------- |
| Frontend | Next.js (App Router) | 14+     |
| UI       | Tailwind + shadcn/ui | Latest  |
| Content  | MDX                  | —       |
| Deploy   | Vercel               | —       |

---

## Project Structure

```
portfolio/
└── web/                        # Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx         # Home / Hero
    │   │   ├── about/
    │   │   │   └── page.tsx     # About + CV + contact
    │   │   └── case-studies/
    │   │       ├── page.tsx     # Case studies list
    │   │       └── [slug]/
    │   │           └── page.tsx # Case study detail
    │   ├── components/
    │   └── lib/
    ├── content/
    │   └── case-studies/        # MDX files — one per project
    └── public/
        └── images/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

### Running

```bash
npm run dev      # Dev server with hot reload
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint + type checking
```

---

## Adding a Case Study

Create a new `.mdx` file in `web/content/case-studies/`:

```bash
web/content/case-studies/project-name.mdx
```

Required frontmatter:

```yaml
---
title: "Project Title"
description: "One-line summary shown on the card"
tags: ["UX", "Product Strategy"]
date: "2024-03"
coverImage: "/images/case-studies/project-name/cover.jpg"
---
```

Then write the case study body in MDX below the frontmatter.

---

## Sections

| Page         | Route                  |
| ------------ | ---------------------- |
| Home         | `/`                    |
| About        | `/about`               |
| Case Studies | `/case-studies`        |
| Case Study   | `/case-studies/[slug]` |
