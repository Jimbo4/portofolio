import { getAllCaseStudies } from "@/lib/case-studies";
import { llmsTxt } from "@/lib/caseStudyMarkdown";

/** /llms.txt (llmstxt.org): a Markdown map of the site for AI agents, prerendered at build time. */
export function GET() {
  return new Response(llmsTxt(getAllCaseStudies()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
