export type PillarId = "design" | "lead" | "ai" | "grow";

export interface Pillar {
  id: PillarId;
  title: string;
  description: string;
  /** Subtitle shown on the case studies page for this pillar */
  tagline: string;
  skills: string[];
}

export interface CustomIcon {
  viewBox: string;
  path: string;
  /** Path relies on the evenodd fill rule for its cut-outs */
  isEvenOdd?: boolean;
}

export interface Tool {
  name: string;
  /** simple-icons export name (e.g. "siFigma") or a key of lib/customIcons */
  icon: string;
  /** Tailwind classes for the tile background and icon fill */
  tileClass: string;
}

export interface WorkKpi {
  value: string;
  caption: string;
}

/** Icon between the two KPIs on the case study page */
export type KpiIcon = "graduation" | "growth";

export interface WorkLink {
  label: string;
  href: string;
}

/** Cover shown on cards and on the case study hero */
export interface WorkCover {
  /** 4:5 image for carousel and grid cards */
  card: string;
  /** 2:1 image for the case study hero */
  hero: string;
  alt: string;
}

export interface Work {
  slug: string;
  name: string;
  tags: string[];
  /** "YYYY-MM", used to sort works newest first */
  date: string;
  year: string;
  role?: string;
  blurb: string;
  description: string;
  cover: WorkCover;
  pillar: PillarId;
  kpis?: [WorkKpi, WorkKpi];
  /** Defaults to "growth" */
  kpiIcon?: KpiIcon;
  links?: WorkLink[];
}

/**
 * Frontmatter of content/case-studies/<slug>.mdx.
 * The slug comes from the file name, the year from `date`.
 */
export interface CaseStudyFrontmatter {
  name: string;
  /** Internal note naming the real client or project, for searching the repo. Never rendered. */
  internalRef?: string;
  pillar: PillarId;
  date: string;
  tags: string[];
  role: string;
  blurb: string;
  description: string;
  cover: WorkCover;
  kpis?: [WorkKpi, WorkKpi];
  /** Defaults to "growth" */
  kpiIcon?: KpiIcon;
  links?: WorkLink[];
}
