export type PillarId = "design" | "lead" | "ai" | "grow";

export interface Pillar {
  id: PillarId;
  title: string;
  description: string;
  /** Subtitle shown on the case studies page for this pillar */
  tagline: string;
  skills: string[];
}

export interface Tool {
  name: string;
  /** simple-icons export name, e.g. "siFigma". Omit to render a letter tile. */
  icon?: string;
  /** Fallback letters when no brand icon is available */
  letters?: string;
  /** Tailwind classes for the tile background and icon/letter color */
  tileClass: string;
}

export type WorkArt = "klever" | "metrix" | "vox" | "forma" | "flow";

export interface WorkKpi {
  value: string;
  caption: string;
}

export interface Work {
  slug: string;
  name: string;
  tags: string[];
  year: string;
  blurb: string;
  description: string;
  art: WorkArt;
  pillar: PillarId;
  kpis: [WorkKpi, WorkKpi];
}
