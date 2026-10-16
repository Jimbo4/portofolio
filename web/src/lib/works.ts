import type { PillarId, Work } from "@/types";

/**
 * Placeholder works carried over from the design file.
 * Replace with real case studies (MDX in content/case-studies/) when ready.
 */
export const works: Work[] = [
  {
    slug: "klever-wallet",
    name: "Klever Wallet",
    tags: ["Crypto", "App"],
    year: "2024",
    blurb: "Reducing friction without compromising security.",
    description:
      "A self-custody wallet rebuilt around a single principle: the safe path should also be the obvious path.",
    art: "klever",
    pillar: "design",
    kpis: [
      { value: "+38%", caption: "Activation" },
      { value: "−52%", caption: "Drop-off at KYC" },
    ],
  },
  {
    slug: "metrix",
    name: "Metrix",
    tags: ["Web", "SaaS"],
    year: "2025",
    blurb: "A system behind complex program creation.",
    description:
      "A program-builder for ops teams running multi-stage incentive campaigns across regions.",
    art: "metrix",
    pillar: "grow",
    kpis: [
      { value: "100K+", caption: "Total Users" },
      { value: "50K+", caption: "Monthly Visitors" },
    ],
  },
  {
    slug: "vox-swap",
    name: "Vox Swap",
    tags: ["Web", "DeFi", "Web3"],
    year: "2023",
    blurb: "From internal tool to a platform used by partners.",
    description:
      "Productized an internal liquidity tool into a partner platform with role-aware permissions.",
    art: "vox",
    pillar: "design",
    kpis: [
      { value: "12", caption: "Partner Integrations" },
      { value: "$420M", caption: "Volume Routed" },
    ],
  },
  {
    slug: "forma-studio",
    name: "Forma Studio",
    tags: ["Platform", "B2B"],
    year: "2024",
    blurb: "One delivery system for ten parallel client projects.",
    description:
      "A shared delivery framework that let one team run ten client projects a year with consistent quality.",
    art: "forma",
    pillar: "lead",
    kpis: [
      { value: "10", caption: "Projects per Year" },
      { value: "−24%", caption: "Delivery Cost" },
    ],
  },
  {
    slug: "flow-os",
    name: "FlowOS",
    tags: ["AI", "Productivity"],
    year: "2025",
    blurb: "An AI workspace for async teams.",
    description:
      "Async-first workspace with AI agents for reviews, decision logs and lightweight planning in a single canvas.",
    art: "flow",
    pillar: "ai",
    kpis: [
      { value: "4×", caption: "Faster Reviews" },
      { value: "92", caption: "NPS" },
    ],
  },
  {
    slug: "northwind",
    name: "Northwind",
    tags: ["Web", "SaaS"],
    year: "2022",
    blurb: "Replatforming a 12-year-old logistics dashboard.",
    description:
      "A six-month replatform that consolidated 14 internal tools into a single operations console.",
    art: "vox",
    pillar: "lead",
    kpis: [
      { value: "−61%", caption: "Time to Resolve" },
      { value: "3,200", caption: "Daily Operators" },
    ],
  },
  {
    slug: "prompt-lab",
    name: "Prompt Lab",
    tags: ["AI", "Training"],
    year: "2026",
    blurb: "An enablement program that turned into a partnership.",
    description:
      "A hands-on generative AI program for corporate teams, from prompt basics to production agents.",
    art: "metrix",
    pillar: "ai",
    kpis: [
      { value: "400+", caption: "Training Hours" },
      { value: "600+", caption: "People Trained" },
    ],
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function getWorksByPillar(pillar: PillarId): Work[] {
  return works.filter((work) => work.pillar === pillar);
}
