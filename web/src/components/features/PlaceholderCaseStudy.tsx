import { caseStudyBodyText, caseStudySectionTitle } from "./CaseStudyMdx";

/*
 * Generic body carried over from the design file, shown only for placeholder works.
 * Delete this component once every placeholder has been replaced by an MDX case study.
 */

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

export function PlaceholderCaseStudy() {
  return (
    <>
      <section>
        <h2 className={caseStudySectionTitle}>The Challenge</h2>
        <p className={caseStudyBodyText}>
          Onboarding new users into a complex domain meant balancing trust, simplicity and depth. The existing flow
          optimized for power users, leaving newcomers with too many decisions before they understood what they were
          buying into.
        </p>
        <p className={`${caseStudyBodyText} mt-3.5`}>
          We needed a structure that progressively revealed complexity — letting confident users move quickly while
          giving everyone else clear scaffolding, sensible defaults and a path back if they got lost.
        </p>
      </section>

      <section>
        <h2 className={caseStudySectionTitle}>Design Process</h2>
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

      <section>
        <h2 className={caseStudySectionTitle}>Reducing Friction</h2>
        <p className={caseStudyBodyText}>
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
    </>
  );
}
