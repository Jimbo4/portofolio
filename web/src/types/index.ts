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
