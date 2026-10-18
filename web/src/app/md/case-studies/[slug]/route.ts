import { getAllCaseStudies } from "@/lib/case-studies";
import { caseStudyToMarkdown, caseStudyUrl } from "@/lib/caseStudyMarkdown";

/**
 * Markdown twin of a case study page. Served at /case-studies/<slug>.md, and at /case-studies/<slug> when the
 * request asks for text/markdown (rewrites in next.config.ts).
 */
export function generateStaticParams() {
  return getAllCaseStudies().map(({ work }) => ({ slug: work.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/md/case-studies/[slug]">) {
  const { slug } = await params;
  const caseStudy = getAllCaseStudies().find(({ work }) => work.slug === slug);
  if (!caseStudy) return new Response("Not found", { status: 404 });
  return new Response(caseStudyToMarkdown(caseStudy), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Search engines credit the HTML page, agents still get the Markdown
      Link: `<${caseStudyUrl(slug)}>; rel="canonical"`,
      Vary: "Accept",
    },
  });
}
