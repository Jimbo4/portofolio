import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { CaseStudyFrontmatter, KpiIcon, PillarId, Work } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content/case-studies");
const PILLAR_IDS: PillarId[] = ["design", "lead", "ai", "grow"];
const KPI_ICONS: KpiIcon[] = ["graduation", "growth"];

interface CaseStudyFile {
  work: Work;
  /** MDX body without frontmatter */
  body: string;
}

/** Fails the build on malformed frontmatter instead of rendering a broken page. */
function assertFrontmatter(data: Record<string, unknown>, file: string): asserts data is Record<string, unknown> &
  CaseStudyFrontmatter {
  const requiredStrings = ["name", "date", "role", "blurb", "description"] as const;
  for (const key of requiredStrings) {
    if (typeof data[key] !== "string" || data[key] === "") throw new Error(`${file}: "${key}" must be a string`);
  }
  if (!/^\d{4}-\d{2}$/.test(data.date as string)) throw new Error(`${file}: "date" must be YYYY-MM`);
  if (!PILLAR_IDS.includes(data.pillar as PillarId)) throw new Error(`${file}: unknown pillar "${String(data.pillar)}"`);
  if (!Array.isArray(data.tags)) throw new Error(`${file}: "tags" must be a list`);
  const cover = data.cover as Record<string, unknown> | undefined;
  if (!cover || typeof cover.card !== "string" || typeof cover.hero !== "string" || typeof cover.alt !== "string") {
    throw new Error(`${file}: "cover" needs card, hero and alt`);
  }
  if (data.kpis !== undefined && (!Array.isArray(data.kpis) || data.kpis.length !== 2)) {
    throw new Error(`${file}: "kpis" must list exactly 2 entries`);
  }
  if (data.kpiIcon !== undefined && !KPI_ICONS.includes(data.kpiIcon as KpiIcon)) {
    throw new Error(`${file}: unknown kpiIcon "${String(data.kpiIcon)}"`);
  }
}

function readCaseStudyFile(fileName: string): CaseStudyFile {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf-8");
  const { data, content } = matter(raw);
  assertFrontmatter(data, fileName);
  const work: Work = {
    slug: fileName.replace(/\.mdx$/, ""),
    name: data.name,
    tags: data.tags,
    date: data.date,
    year: data.date.slice(0, 4),
    role: data.role,
    blurb: data.blurb,
    description: data.description,
    cover: data.cover,
    pillar: data.pillar,
    kpis: data.kpis,
    kpiIcon: data.kpiIcon,
    links: data.links,
  };
  return { work, body: content };
}

function readAllCaseStudyFiles(): CaseStudyFile[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readCaseStudyFile);
}

/** All case studies, newest first. */
export function getAllWorks(): Work[] {
  return readAllCaseStudyFiles()
    .map((file) => file.work)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getWorkBySlug(slug: string): Work | undefined {
  return getAllWorks().find((work) => work.slug === slug);
}

export function getWorksByPillar(pillar: PillarId): Work[] {
  return getAllWorks().filter((work) => work.pillar === pillar);
}

/** MDX body of a case study, or undefined for an unknown slug. */
export function getCaseStudyBody(slug: string): string | undefined {
  return readAllCaseStudyFiles().find((file) => file.work.slug === slug)?.body;
}
