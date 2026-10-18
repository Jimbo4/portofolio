import { getAllCaseStudies } from "@/lib/case-studies";
import { llmsFullTxt } from "@/lib/caseStudyMarkdown";

/** /llms-full.txt: every case study in one Markdown file, for agents that read the whole site at once. */
export function GET() {
  return new Response(llmsFullTxt(getAllCaseStudies()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Duplicates the pages, so search engines keep indexing the HTML instead
      "X-Robots-Tag": "noindex",
    },
  });
}
