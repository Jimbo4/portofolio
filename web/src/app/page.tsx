import Link from "next/link";
import { ArrowCircle } from "@/components/features/ArrowCircle";
import { PillarIcon } from "@/components/features/PillarIcon";
import { SectionTitle } from "@/components/features/SectionTitle";
import { ToolsMarquee } from "@/components/features/ToolsMarquee";
import { WorksCarousel } from "@/components/features/WorksCarousel";
import { pillars, profile, tools } from "@/lib/config";
import { pillarTheme } from "@/lib/pillarTheme";
import { getAllWorks } from "@/lib/case-studies";

const contactLinks = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
];

const sectionPad = "py-[clamp(64px,9vw,128px)]";
const container = "mx-auto max-w-[1240px] px-7";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-headline" className={`hero-glow relative pt-[140px] text-center ${sectionPad}`}>
        <div className={container}>
          <p className="text-sm text-ink-2">
            {profile.roles[0]} <span className="mx-1.5 text-muted-2">|</span> {profile.roles[1]}
          </p>
          <h1
            id="hero-headline"
            className="mx-auto mt-7 max-w-[1180px] text-balance font-serif text-[clamp(44px,8.2vw,124px)] font-light leading-[1.02] tracking-[-0.025em] text-muted"
          >
            I design{" "}
            <span className="font-mono text-[.82em] font-medium tracking-[-0.04em] text-ink">digital</span>{" "}
            products
            <br />
            and{" "}
            <span className="font-extrabold italic text-ink [font-variation-settings:'opsz'_144]">amazing</span>{" "}
            experiences.
          </h1>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" aria-labelledby="philosophy-h" className={sectionPad}>
        <div className={container}>
          <SectionTitle id="philosophy-h" align="left">
            philosophy
          </SectionTitle>
          <div className="no-scrollbar -mx-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-7 pb-6 pt-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:p-0 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={`/case-studies#${pillar.id}`}
                aria-label={`Open ${pillar.title} projects`}
                className="flex shrink-0 basis-[78%] snap-center flex-col gap-3.5 transition-transform duration-250 hover:-translate-y-1 md:basis-auto"
              >
                <PillarIcon pillar={pillar.id} size="lg" />
                <h3 className="mt-1 font-serif text-lg font-semibold tracking-[-0.015em]">{pillar.title}</h3>
                <p className="text-[13px] leading-normal text-muted">{pillar.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-end md:mt-12">
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-3.5 font-serif text-lg font-semibold tracking-[-0.015em]"
            >
              Selected work
              <ArrowCircle />
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" aria-labelledby="projects-h" className={sectionPad}>
        <div className={container}>
          <SectionTitle id="projects-h" align="right">
            projects
          </SectionTitle>
        </div>
        <WorksCarousel works={getAllWorks()} />
        <p className="mt-8 text-center font-mono text-[11px] tracking-[.32em] text-muted-2">
          [ &nbsp; DRAG TO EXPLORE &nbsp; ]
        </p>
      </section>

      {/* SKILLS */}
      <section id="skills" aria-labelledby="skills-h" className={sectionPad}>
        <div className={container}>
          <SectionTitle id="skills-h" align="left">
            skills
          </SectionTitle>

          <ul className="flex flex-col gap-3.5">
            {pillars.map((pillar) => (
              <li
                key={pillar.id}
                className="flex flex-col gap-4 rounded-[22px] border border-line bg-card px-[22px] py-[18px] sm:flex-row sm:items-center sm:gap-[22px]"
              >
                <div className="flex items-center gap-4 sm:contents">
                  <PillarIcon pillar={pillar.id} size="sm" />
                  <h3 className="font-serif text-lg font-semibold tracking-[-0.015em] sm:w-40 sm:shrink-0">
                    {pillar.title}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${pillar.title} skills`}>
                  {pillar.skills.map((skill) => (
                    <li
                      key={skill}
                      className={`rounded-full px-[13px] py-1.5 text-[13px] font-medium ${pillarTheme[pillar.id].pill}`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <ToolsMarquee tools={tools} />

          <p className="mt-12 text-center font-serif text-[clamp(28px,3.6vw,44px)] font-semibold tracking-[-0.02em]">
            <span className="text-accent">{profile.yearsOfExperience} years</span> of experience in the industry.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" aria-labelledby="contact-h" className={sectionPad}>
        <div className={container}>
          <SectionTitle id="contact-h" align="right">
            contact
          </SectionTitle>
          <div className="flex flex-col items-end text-right">
            <p className="font-serif text-[clamp(32px,4.5vw,64px)] font-light leading-[1.05] tracking-[-0.03em]">
              Let&apos;s build something <em className="font-extrabold italic text-accent">good</em>.
            </p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-[22px] py-3.5 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(26,26,24,.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(26,26,24,.24)]"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                </svg>
                {profile.email}
              </a>
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-[22px] py-3.5 text-[15px] font-medium text-ink transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-paper-3"
                >
                  {link.label}
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">Based in {profile.location.label} · Open to travel and relocation</p>
          </div>
        </div>
      </section>
    </>
  );
}
