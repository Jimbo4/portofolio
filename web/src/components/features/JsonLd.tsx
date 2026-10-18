import { serializeGraph, type StructuredDataNode } from "@/lib/structuredData";

/** The page's schema.org graph: WebSite and Person plus the page's own nodes. */
export function JsonLd({ nodes = [] }: { nodes?: StructuredDataNode[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGraph(nodes) }} />;
}
