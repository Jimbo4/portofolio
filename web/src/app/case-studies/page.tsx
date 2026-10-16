import type { Metadata } from "next";
import { BackLink } from "@/components/features/BackLink";
import { CaseStudyCard } from "@/components/features/CaseStudyCard";
import { PillLabel } from "@/components/features/PillLabel";
import { PillarIcon } from "@/components/features/PillarIcon";
import { pillars } from "@/lib/config";
import { getWorksByPillar } from "@/lib/works";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected work across product design, team leadership, AI enablement and business growth.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[1240px] px-7 pt-[120px]">
      <BackLink href="/" label="Back" />

      <div className="mb-14 mt-6 flex flex-col items-start gap-[18px]">
        <PillLabel>Case Studies</PillLabel>
        <h1 className="mt-2 font-serif text-[clamp(48px,7vw,104px)] font-extrabold italic leading-[.96] tracking-[-0.03em]">
          Selected work
        </h1>
      </div>

      {pillars.map((pillar) => {
        const pillarWorks = getWorksByPillar(pillar.id);
        if (pillarWorks.length === 0) return null;
        return (
          <section key={pillar.id} id={pillar.id} aria-labelledby={`${pillar.id}-h`} className="pb-20">
            <div className="mb-10 flex items-center gap-5">
              <PillarIcon pillar={pillar.id} size="sm" />
              <div>
                <h2
                  id={`${pillar.id}-h`}
                  className="font-serif text-[clamp(32px,4vw,52px)] font-extrabold italic leading-none tracking-[-0.03em]"
                >
                  {pillar.title}
                </h2>
                <p className="mt-2 max-w-[560px] text-base leading-[1.55] text-muted">{pillar.tagline}</p>
              </div>
            </div>
            <div className="columns-1 gap-7 md:columns-2">
              {pillarWorks.map((work, index) => (
                <CaseStudyCard key={work.slug} work={work} variant="masonry" isTall={index % 2 === 0} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
