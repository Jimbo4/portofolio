# Portfolio – Jacopo Marcolini

## Objective

Personal portfolio website for Jacopo Marcolini, Design Lead & Product Owner.
Showcases professional identity, case studies, CV, and contact information.

## Project Structure

```
portfolio/
└── web/          # Next.js Frontend — the entire project
```

No backend. All content is static or MDX/JSON file-based.
ALWAYS read `web/claude.md` before working in the `web/` folder.

## Stack

| Layer   | Tech                 | Version |
| ------- | -------------------- | ------- |
| Frontend | Next.js             | 14+     |
| UI      | Tailwind + shadcn/ui | Latest  |
| Content | MDX / JSON files     | —       |
| Deploy  | Vercel               | —       |

## Sections

| Section      | Route                    | Description                          |
| ------------ | ------------------------ | ------------------------------------ |
| Home         | `/`                      | Hero + brief intro                   |
| About        | `/about`                 | Bio, CV download, contact info       |
| Case Studies | `/case-studies`          | Grid of design/product case studies  |
| Case Study   | `/case-studies/[slug]`   | Single case study detail             |

## Global Conventions

- Package manager: `npm` (never yarn or pnpm)
- Function naming: `camelCase`
- Class/component naming: `PascalCase`
- Code language: English
- Comment language: English

## Global Boundaries

- ✅ **Always:** Follow naming conventions, write in English
- ⚠️ **Ask first:** Add new sections or change information architecture
- 🚫 **Never:** Add a backend, commit secrets, install different package managers

## Agent Workflow

When the user explicitly asks to "start with the implementation" or "implement the PRP doc":

1. **Step 1: Plan with PRP Orchestrator**
   - Call the `prp-orchestrator` agent first.
   - Do NOT implement directly.

2. **Step 2: Delegate to Specialist Agents**
   - Call `frontend-developer` or `ui-designer` per task defined in the PRP.

3. **Step 3: Review & iterate**
   - Verify output and integration after subagents complete work.

4. **Step 4: Final Report**
   - Return a comprehensive final report listing all tasks completed from the PRP.
