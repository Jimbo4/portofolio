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
];
