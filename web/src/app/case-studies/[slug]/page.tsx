import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BackLink } from "@/components/features/BackLink";
import { caseStudyComponents } from "@/components/features/CaseStudyMdx";
import { WorkCover } from "@/components/features/WorkCover";
import { getAllWorks, getCaseStudyBody, getWorkBySlug } from "@/lib/case-studies";
import type { KpiIcon, Work, WorkKpi } from "@/types";

export function generateStaticParams() {
  return getAllWorks().map((work) => ({ slug: work.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: work.name,
    description: work.description,
    alternates: { canonical: `/case-studies/${work.slug}` },
    openGraph: { title: work.name, description: work.description, images: [{ url: work.cover.hero, alt: work.cover.alt }] },
  };
}

const metaLabel = "font-mono text-[11px] uppercase tracking-[.14em] text-muted-2";

function WorkMeta({ work }: { work: Work }) {
  const items: { label: string; content: React.ReactNode }[] = [];
  if (work.role) items.push({ label: "Role", content: work.role });
  items.push({ label: "Year", content: work.year });
  if (work.links?.length) {
    items.push({
      label: "Links",
      content: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {work.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              {link.label} ↗
            </a>
          ))}
        </span>
      ),
    });
  }

  return (
    <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5">
          <dt className={metaLabel}>{item.label}</dt>
          <dd className="m-0 text-[15px] leading-[1.5] text-ink-2">{item.content}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Strokes of each KPI icon, drawn on a 32×32 grid */
const kpiIconPaths: Record<KpiIcon, string[]> = {
  graduation: ["M3 10 L16 4 L29 10 L16 16 Z", "M9 13 V20 C9 22 12 24 16 24 C20 24 23 22 23 20 V13"],
  growth: ["M5 5 V27 H27", "M9 21 L14 15 L18 18 L26 9", "M21 9 H26 V14"],
};

function KpiPanel({ kpis, icon = "growth" }: { kpis: [WorkKpi, WorkKpi]; icon?: KpiIcon }) {
  return (
    <div className="mt-7 grid items-stretch gap-[18px] rounded-3xl border border-line bg-white p-7 md:grid-cols-[1fr_auto_1fr]">
      {kpis.map((kpi, index) => (
        <div
          key={kpi.caption}
          className={`flex min-h-40 flex-col items-center justify-center rounded-[18px] border border-line-soft bg-paper-3 p-7 text-center ${
            index === 1 ? "md:order-3" : ""
          }`}
        >
          <div className="font-serif text-[clamp(44px,5vw,68px)] font-light leading-none tracking-[-0.03em]">
            {kpi.value}
          </div>
          <div className="mt-2 text-[12.5px] tracking-[.04em] text-muted">{kpi.caption}</div>
        </div>
      ))}
      <div
        aria-hidden="true"
        className="flex size-[84px] items-center justify-center self-center justify-self-center rounded-[18px] border border-line bg-white shadow-[0_6px_14px_rgba(0,0,0,.05)] md:order-2"
      >
        <svg
          viewBox="0 0 32 32"
          width="36"
          height="36"
          fill="none"
          stroke="#1F4FE0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {kpiIconPaths[icon].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default async function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const body = getCaseStudyBody(slug);
  if (body === undefined) notFound();

  return (
    <article className="mx-auto min-h-screen max-w-[1240px] px-7 pb-24 pt-[120px]">
      <BackLink href="/case-studies" label="Selected work" />

      <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
        {work.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-white px-[11px] py-[5px] text-[10.5px] font-semibold uppercase tracking-[.1em]"
          >
            {tag}
          </span>
        ))}
        <span className="rounded-full border border-line px-[11px] py-[5px] text-[10.5px] font-semibold uppercase tracking-[.1em] text-muted">
          {work.year}
        </span>
      </div>
      <h1 className="mt-3.5 font-serif text-[clamp(48px,7vw,96px)] font-extrabold italic leading-none tracking-[-0.03em]">
        {work.name}
      </h1>
      <p className="mt-[18px] max-w-[680px] text-lg leading-[1.55] text-muted">{work.description}</p>
      <WorkMeta work={work} />

      <div className="relative mb-10 mt-8 aspect-[16/8] w-full overflow-hidden rounded-3xl border border-line-soft bg-paper-2">
        <WorkCover cover={work.cover} variant="hero" sizes="(max-width: 1240px) 100vw, 1184px" priority />
      </div>

      <MDXRemote source={body} components={caseStudyComponents} />

      {work.kpis && (
        <section>
          <KpiPanel kpis={work.kpis} icon={work.kpiIcon} />
        </section>
      )}
    </article>
  );
}
