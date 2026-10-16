import type { Work } from "@/types";

/**
 * Placeholder works carried over from the design file.
 * Each one is removed when a real case study (MDX in content/case-studies/) replaces it.
 */
export const placeholderWorks: Work[] = [
  {
    slug: "metrix",
    name: "Metrix",
    tags: ["Web", "SaaS"],
    date: "2025-01",
    year: "2025",
    blurb: "A system behind complex program creation.",
    description:
      "A program-builder for ops teams running multi-stage incentive campaigns across regions.",
    cover: { kind: "art", art: "metrix" },
    pillar: "grow",
    isPlaceholder: true,
    kpis: [
      { value: "100K+", caption: "Total Users" },
      { value: "50K+", caption: "Monthly Visitors" },
    ],
  },
  {
    slug: "forma-studio",
    name: "Forma Studio",
    tags: ["Platform", "B2B"],
    date: "2024-01",
    year: "2024",
    blurb: "One delivery system for ten parallel client projects.",
    description:
      "A shared delivery framework that let one team run ten client projects a year with consistent quality.",
    cover: { kind: "art", art: "forma" },
    pillar: "lead",
    isPlaceholder: true,
    kpis: [
      { value: "10", caption: "Projects per Year" },
      { value: "−24%", caption: "Delivery Cost" },
    ],
  },
  {
    slug: "flow-os",
    name: "FlowOS",
    tags: ["AI", "Productivity"],
    date: "2025-01",
    year: "2025",
    blurb: "An AI workspace for async teams.",
    description:
      "Async-first workspace with AI agents for reviews, decision logs and lightweight planning in a single canvas.",
    cover: { kind: "art", art: "flow" },
    pillar: "ai",
    isPlaceholder: true,
    kpis: [
      { value: "4×", caption: "Faster Reviews" },
      { value: "92", caption: "NPS" },
    ],
  },
  {
    slug: "northwind",
    name: "Northwind",
    tags: ["Web", "SaaS"],
    date: "2022-01",
    year: "2022",
    blurb: "Replatforming a 12-year-old logistics dashboard.",
    description:
      "A six-month replatform that consolidated 14 internal tools into a single operations console.",
    cover: { kind: "art", art: "vox" },
    pillar: "lead",
    isPlaceholder: true,
    kpis: [
      { value: "−61%", caption: "Time to Resolve" },
      { value: "3,200", caption: "Daily Operators" },
    ],
  },
  {
    slug: "prompt-lab",
    name: "Prompt Lab",
    tags: ["AI", "Training"],
    date: "2026-01",
    year: "2026",
    blurb: "An enablement program that turned into a partnership.",
    description:
      "A hands-on generative AI program for corporate teams, from prompt basics to production agents.",
    cover: { kind: "art", art: "metrix" },
    pillar: "ai",
    isPlaceholder: true,
    kpis: [
      { value: "400+", caption: "Training Hours" },
      { value: "600+", caption: "People Trained" },
    ],
  },
];
