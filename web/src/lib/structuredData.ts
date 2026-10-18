import { absoluteUrl, caseStudyMarkdownUrl, caseStudyUrl, pillarTitle, shareImagePath } from "@/lib/caseStudyMarkdown";
import { pillars, profile } from "@/lib/config";
import type { Work } from "@/types";

/** One schema.org node of the page's JSON-LD graph. */
export type StructuredDataNode = Record<string, unknown>;

const personId = `${profile.siteUrl}/#person`;
const websiteId = `${profile.siteUrl}/#website`;
const personRef = { "@id": personId };
const websiteRef = { "@id": websiteId };

/** WebSite and Person, repeated on every page so each graph is complete on its own. */
export function siteNodes(): StructuredDataNode[] {
  return [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: profile.siteUrl,
      name: profile.name,
      description: profile.description,
      inLanguage: "en",
      author: personRef,
      publisher: personRef,
    },
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      url: profile.siteUrl,
      image: absoluteUrl("/icon-512.png"),
      jobTitle: [...profile.roles],
      description: profile.description,
      email: `mailto:${profile.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.city,
        addressCountry: profile.location.country,
      },
      knowsAbout: [...new Set(pillars.flatMap((pillar) => [pillar.title, ...pillar.skills]))],
      knowsLanguage: profile.languages.map((language) => ({
        "@type": "Language",
        name: language.name,
        alternateName: language.code,
      })),
      sameAs: [profile.linkedin, profile.github],
    },
  ];
}

interface Crumb {
  name: string;
  path: string;
}

function breadcrumbNode(id: string, crumbs: Crumb[]): StructuredDataNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

const homeCrumb: Crumb = { name: "Home", path: "/" };
const projectsCrumb: Crumb = { name: "Projects", path: "/case-studies" };

export function homeNodes(title: string): StructuredDataNode[] {
  return [
    {
      "@type": "ProfilePage",
      "@id": `${profile.siteUrl}/#profilepage`,
      url: profile.siteUrl,
      name: title,
      description: profile.description,
      inLanguage: "en",
      isPartOf: websiteRef,
      mainEntity: personRef,
      about: personRef,
    },
  ];
}

export function projectsNodes(works: Work[], description: string): StructuredDataNode[] {
  const url = absoluteUrl("/case-studies");
  return [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name: "Projects",
      description,
      inLanguage: "en",
      isPartOf: websiteRef,
      author: personRef,
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: works.length,
        itemListElement: works.map((work, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: caseStudyUrl(work.slug),
          name: work.name,
        })),
      },
    },
    breadcrumbNode(`${url}#breadcrumb`, [homeCrumb, projectsCrumb]),
  ];
}

export function caseStudyNodes(work: Work): StructuredDataNode[] {
  const url = caseStudyUrl(work.slug);
  return [
    {
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      url,
      mainEntityOfPage: url,
      name: work.name,
      headline: work.seoTitle ?? work.name,
      description: work.description,
      abstract: work.blurb,
      image: [absoluteUrl(shareImagePath(work)), absoluteUrl(work.cover.card)],
      dateCreated: work.date,
      inLanguage: "en",
      genre: pillarTitle(work.pillar),
      keywords: work.tags.join(", "),
      author: personRef,
      creator: personRef,
      isPartOf: websiteRef,
      breadcrumb: { "@id": `${url}#breadcrumb` },
      encoding: { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: caseStudyMarkdownUrl(work.slug) },
      ...(work.links?.length ? { sameAs: work.links.map((link) => link.href) } : {}),
    },
    breadcrumbNode(`${url}#breadcrumb`, [homeCrumb, projectsCrumb, { name: work.name, path: `/case-studies/${work.slug}` }]),
  ];
}

/** JSON for a script tag: `<` is escaped so content can never close the tag early. */
export function serializeGraph(nodes: StructuredDataNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [...siteNodes(), ...nodes] }).replace(
    /</g,
    "\\u003c",
  );
}
