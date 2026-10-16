import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/features/BackLink";
import { WorkArt, workArtBackground } from "@/components/features/WorkArt";
import { getWorkBySlug, works } from "@/lib/works";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: work.name,
    description: work.description,
    alternates: { canonical: `/case-studies/${work.slug}` },
  };
}

const sectionTitle = "mb-[18px] font-serif text-[32px] font-semibold tracking-[-0.02em]";
const bodyText = "max-w-[760px] text-base leading-[1.7] text-ink-2";

const processSteps = [
  {
    label: "RESEARCH",
    title: "01 — Research",
    text: "15 user interviews, 4 stakeholder sessions, competitive teardown across 12 products.",
  },
  {
    label: "SYNTHESIS",
    title: "02 — Synthesis",
    text: "Mapped the journey end-to-end, surfaced the three friction points worth solving first.",
  },
  {
    label: "SHIP",
    title: "03 — Ship",
    text: "Two-week prototyping sprints with engineering, validated weekly with 5 testers each round.",
  },
];

function MockRow({ className = "h-9 bg-paper-2" }: { className?: string }) {
  return <div className={`rounded-lg ${className}`} />;
}

function MockLabel({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 font-mono text-[11px] uppercase tracking-[.1em] text-muted-2">{children}</div>;
}

export default async function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const [kpiA, kpiB] = work.kpis;

  return (
    <article className="mx-auto min-h-screen max-w-[1240px] px-7 pt-[120px]">
      <BackLink href="/case-studies" label="All case studies" />

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

      <div
        className={`relative mb-10 mt-6 aspect-[16/8] w-full overflow-hidden rounded-3xl border border-line-soft ${workArtBackground(work.art)}`}
      >
        <WorkArt art={work.art} />
      </div>

      <section className="mt-20">
        <h2 className={sectionTitle}>The Challenge</h2>
        <p className={bodyText}>
          Onboarding new users into a complex domain meant balancing trust, simplicity and depth. The existing flow
          optimized for power users, leaving newcomers with too many decisions before they understood what they were
          buying into.
        </p>
        <p className={`${bodyText} mt-3.5`}>
          We needed a structure that progressively revealed complexity — letting confident users move quickly while
          giving everyone else clear scaffolding, sensible defaults and a path back if they got lost.
        </p>
      </section>

      <section className="mt-20">
        <h2 className={sectionTitle}>Design Process</h2>
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.label} className="flex flex-col gap-3.5">
              <div className="striped-placeholder flex aspect-square w-full items-center justify-center rounded-[18px] border border-line-soft font-mono text-[11px] tracking-[.18em] text-muted-2">
                {step.label}
              </div>
              <h3 className="mt-1 font-serif text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-[1.55] text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className={sectionTitle}>Reducing Friction</h2>
        <p className={bodyText}>
          The experience was structured to clearly communicate value, from landing page to checkout. Pricing, feature
          positioning, and trial flows were simplified to reduce decision fatigue and support informed commitment.
        </p>
        <div aria-hidden="true" className="mt-7 grid gap-6 rounded-3xl border border-line bg-white p-7 md:grid-cols-2">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-line-soft bg-paper-3 p-[18px]">
            <MockLabel>Express checkout</MockLabel>
            <div className="grid grid-cols-2 gap-2">
              <MockRow className="h-[42px] bg-ink" />
              <MockRow className="h-[42px] bg-[#1F4FE0]" />
            </div>
            <MockLabel>Card number</MockLabel>
            <MockRow className="h-[46px] bg-paper-2" />
            <div className="grid grid-cols-2 gap-2">
              <MockRow className="h-[46px] bg-paper-2" />
              <MockRow className="h-[46px] bg-paper-2" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MockRow className="h-[46px] bg-paper-2" />
              <MockRow className="h-[46px] bg-paper-2" />
            </div>
            <MockRow className="mt-1.5 h-[46px] bg-[#1F4FE0]" />
          </div>
          <div className="flex flex-col gap-2.5 rounded-2xl border border-line-soft bg-paper-3 p-[18px]">
            <MockLabel>Order summary</MockLabel>
            <MockRow className="h-[46px] bg-paper-2" />
            <MockRow />
            <MockRow />
            <div className="mt-2">
              <MockLabel>Why customers love it</MockLabel>
            </div>
            <MockRow />
            <MockRow />
            <MockRow />
            <MockRow />
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className={sectionTitle}>Outcome</h2>
        <p className={bodyText}>
          {work.name} reached {kpiA.value} {kpiA.caption.toLowerCase()} and {kpiB.value}{" "}
          {kpiB.caption.toLowerCase()} within the first year.
        </p>
        <div className="mt-7 grid items-stretch gap-[18px] rounded-3xl border border-line bg-white p-7 md:grid-cols-[1fr_auto_1fr]">
          {[kpiA, kpiB].map((kpi, index) => (
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
            <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#1F4FE0" strokeWidth="2">
              <path d="M3 10 L16 4 L29 10 L16 16 Z" />
              <path d="M9 13 V20 C9 22 12 24 16 24 C20 24 23 22 23 20 V13" />
            </svg>
          </div>
        </div>
      </section>
    </article>
  );
}
