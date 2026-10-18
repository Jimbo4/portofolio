import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { absoluteUrl, caseStudyUrl, getCaseStudyMedia } from "@/lib/caseStudyMarkdown";
import { profile } from "@/lib/config";

/**
 * Pages with their images and videos. No lastModified: content files carry no edit date, and a build date that
 * changes on every deploy would teach crawlers to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getAllCaseStudies();
  return [
    { url: profile.siteUrl, images: [absoluteUrl("/opengraph-image.png")] },
    { url: absoluteUrl("/case-studies"), images: [absoluteUrl("/og-projects.jpg")] },
    ...caseStudies.map((caseStudy) => {
      const { images, videos } = getCaseStudyMedia(caseStudy);
      return { url: caseStudyUrl(caseStudy.work.slug), images, ...(videos.length ? { videos } : {}) };
    }),
  ];
}
