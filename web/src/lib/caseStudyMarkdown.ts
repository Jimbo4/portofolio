import type { CaseStudyFile } from "@/lib/case-studies";
import { pillars, profile, tools } from "@/lib/config";
import type { PillarId, Work } from "@/types";

/** Absolute URL on the canonical domain. */
export function absoluteUrl(path: string): string {
  return new URL(path, profile.siteUrl).toString();
}

export function caseStudyUrl(slug: string): string {
  return absoluteUrl(`/case-studies/${slug}`);
}

export function caseStudyMarkdownUrl(slug: string): string {
  return absoluteUrl(`/case-studies/${slug}.md`);
}

/** JPG twin of the hero written by scripts/render-og.sh, the image shared in link previews. */
export function shareImagePath(work: Work): string {
  return work.cover.hero.replace(/\.webp$/, ".jpg");
}

export function pillarTitle(pillar: PillarId): string {
  return pillars.find((item) => item.id === pillar)?.title ?? pillar;
}

/** A whole-line MDX tag: `<Name a="b">`, `<Name a="b" />` or `</Name>`. Every prop is a plain string. */
const mdxTagPattern = /^<(\/?)([A-Z][A-Za-z]*)\b(.*?)(\/?)>$/;

function parseProps(source: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const match of source.matchAll(/(\w+)="([^"]*)"/g)) props[match[1]] = match[2];
  return props;
}

interface MdxTag {
  name: string;
  props: Record<string, string>;
  isClosing: boolean;
  isSelfClosing: boolean;
}

function parseTag(line: string): MdxTag | undefined {
  const match = mdxTagPattern.exec(line);
  if (!match) return undefined;
  return { name: match[2], props: parseProps(match[3]), isClosing: match[1] === "/", isSelfClosing: match[4] === "/" };
}

/** Lines that stand in for an opening (or self-closing) MDX block. Wrappers render nothing. */
function renderTag({ name, props }: MdxTag, stepNumber: number): string[] {
  switch (name) {
    case "Figure":
      return [`![${props.alt ?? ""}](${absoluteUrl(props.src)})`, ...(props.caption ? ["", `*${props.caption}*`] : []), ""];
    case "Discipline":
    case "Principle":
      return [`### ${props.label}`, ""];
    case "Step":
      return [`### ${stepNumber}. ${props.label}`, ""];
    case "TokenSlider":
      return [`### ${props.label}`, ""];
    case "Token":
      return [
        `#### ${props.name}`,
        "",
        `- Language: ${props.language}`,
        `- Color: ${props.color}`,
        `- Bars: ${props.bars}`,
        "",
        `![${props.alt}](${absoluteUrl(props.src)})`,
        "",
      ];
    case "Law":
      return [
        `#### ${props.name}`,
        "",
        `- Module: ${props.module}`,
        `- Source: ${props.source}`,
        `- Use it for: ${props.use}`,
        "",
        `![${props.alt}](${absoluteUrl(props.src)})`,
        "",
      ];
    case "VideoFeature":
      return [`### ${props.title}`, "", `[Video: ${props.label}](${absoluteUrl(props.src)})`, ""];
    default:
      return [];
  }
}

/** Turns a case study MDX body into plain Markdown: blocks become headings, images, lists and links. */
function mdxToMarkdown(body: string): string {
  const output: string[] = [];
  let depth = 0;
  let stepNumber = 0;
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    const tag = parseTag(trimmed);
    if (!tag) {
      // Text inside blocks is indented in MDX, which Markdown would read as code
      output.push((depth > 0 ? trimmed : line).replace(/\]\(\//g, `](${profile.siteUrl}/`));
      continue;
    }
    if (tag.isClosing) {
      depth = Math.max(0, depth - 1);
      output.push("");
      continue;
    }
    if (tag.name === "Steps") stepNumber = 0;
    if (tag.name === "Step") stepNumber += 1;
    output.push(...renderTag(tag, stepNumber));
    if (!tag.isSelfClosing) depth += 1;
  }
  return output.join("\n");
}

function collapseBlankLines(markdown: string): string {
  return `${markdown.replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

/** A case study as a standalone Markdown document for AI agents. */
export function caseStudyToMarkdown({ work, body }: CaseStudyFile): string {
  const facts = [
    `- Author: [${profile.name}](${profile.siteUrl}), ${profile.roles.join(" & ")}`,
    `- Role: ${work.role}`,
    `- Year: ${work.year}`,
    `- Area: ${pillarTitle(work.pillar)}`,
    `- Tags: ${work.tags.join(", ")}`,
    ...(work.links?.length ? [`- Links: ${work.links.map((link) => `[${link.label}](${link.href})`).join(", ")}`] : []),
    `- Web page: ${caseStudyUrl(work.slug)}`,
  ];
  const kpis = work.kpis
    ? ["## Key numbers", "", ...work.kpis.map((kpi) => `- **${kpi.value}** ${kpi.caption}`)]
    : [];
  return collapseBlankLines(
    [
      `# ${work.name}`,
      "",
      `> ${work.description}`,
      "",
      ...facts,
      "",
      `![${work.cover.alt}](${absoluteUrl(shareImagePath(work))})`,
      "",
      mdxToMarkdown(body),
      "",
      ...kpis,
    ].join("\n"),
  );
}

/** Images and videos referenced by a case study, for the image and video sitemaps. */
export function getCaseStudyMedia({ work, body }: CaseStudyFile) {
  const images = new Set([absoluteUrl(work.cover.hero), absoluteUrl(work.cover.card)]);
  const videos: { title: string; description: string; thumbnail_loc: string; content_loc: string }[] = [];
  for (const line of body.split(/\r?\n/)) {
    const tag = parseTag(line.trim());
    if (!tag || tag.isClosing) continue;
    if (tag.props.src && tag.name !== "VideoFeature") images.add(absoluteUrl(tag.props.src));
    if (tag.name === "VideoFeature") {
      videos.push({
        title: tag.props.title,
        description: tag.props.label,
        thumbnail_loc: absoluteUrl(tag.props.poster),
        content_loc: absoluteUrl(tag.props.src),
      });
    }
  }
  return { images: [...images], videos };
}

/** Who Jacopo is, in Markdown: the opening of llms.txt and llms-full.txt. */
function profileMarkdown(): string[] {
  const skills = pillars.map((pillar) => `- **${pillar.title}**: ${pillar.description} Skills: ${pillar.skills.join(", ")}.`);
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.description}`,
    "",
    `Based in ${profile.location.label}, ${profile.availability.toLowerCase()}. This site is the portfolio of ${profile.name}, with case ` +
      `studies across ${pillars.map((pillar) => pillar.title).join(", ")}.`,
    "",
    "## Contact",
    "",
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    `- Website: ${profile.siteUrl}`,
    `- Location: ${profile.location.label}, ${profile.availability.toLowerCase()}`,
    `- Languages: ${profile.languages.map((language) => language.name).join(", ")}`,
    "",
    "## Areas of work",
    "",
    ...skills,
    "",
    `Tools: ${tools.map((tool) => tool.name).join(", ")}.`,
  ];
}

/** /llms.txt, following llmstxt.org: who, contacts, and one link per case study in Markdown. */
export function llmsTxt(caseStudies: CaseStudyFile[]): string {
  const entries = caseStudies.map(
    ({ work }) =>
      `- [${work.name}](${caseStudyMarkdownUrl(work.slug)}): ${work.blurb} ${pillarTitle(work.pillar)}, ${work.year}, role: ${work.role}.`,
  );
  return collapseBlankLines(
    [
      ...profileMarkdown(),
      "",
      "## Case studies",
      "",
      ...entries,
      "",
      "## Optional",
      "",
      `- [Full text of every case study](${absoluteUrl("/llms-full.txt")})`,
      `- [Home page](${profile.siteUrl})`,
      `- [All projects](${absoluteUrl("/case-studies")})`,
    ].join("\n"),
  );
}

/** /llms-full.txt: the profile followed by every case study in full. */
export function llmsFullTxt(caseStudies: CaseStudyFile[]): string {
  // One level down, so each case study is a ## section of the same document
  const documents = caseStudies.map((caseStudy) => caseStudyToMarkdown(caseStudy).replace(/^(#+) /gm, "#$1 "));
  return collapseBlankLines([...profileMarkdown(), "", "---", "", documents.join("\n---\n\n")].join("\n"));
}
