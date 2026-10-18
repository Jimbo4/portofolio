import Link from "next/link";
import type { Work } from "@/types";
import { ArrowCircle } from "./ArrowCircle";
import { CardPendingOverlay } from "./CardPendingOverlay";
import { WorkCover } from "./WorkCover";

interface CaseStudyCardProps {
  work: Work;
  /** "slide" = carousel card, "masonry" = case studies grid card */
  variant: "slide" | "masonry";
  /** Masonry only: alternate tall / short covers */
  isTall?: boolean;
  /** Carousel clones are hidden from assistive tech and the tab order */
  isClone?: boolean;
}

export function CaseStudyCard({ work, variant, isTall = false, isClone = false }: CaseStudyCardProps) {
  const isSlide = variant === "slide";
  const aspect = isSlide ? "aspect-[4/5]" : isTall ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <Link
      href={`/case-studies/${work.slug}`}
      // Case study pages are static: prefetch the whole page, not only the shared route shell, so a click opens it at once
      prefetch={true}
      draggable={false}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : undefined}
      aria-label={isClone ? undefined : `${work.name}, ${work.blurb}`}
      className={`group flex flex-col gap-3.5 transition-transform duration-300 hover:-translate-y-1 ${
        isSlide ? "w-[min(400px,80vw)] shrink-0" : "mb-7 break-inside-avoid"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-card border border-line-soft ${aspect} bg-paper-2`}
      >
        {/* No backdrop blur in the carousel: one per card, times three copies, is too heavy for phones */}
        <span
          className={`absolute left-3.5 top-3.5 z-10 rounded-full px-2.5 py-[5px] font-mono text-[11px] text-ink ${
            isSlide ? "bg-white/90" : "bg-white/85 backdrop-blur-[6px]"
          }`}
        >
          {work.year}
        </span>
        <WorkCover
          cover={work.cover}
          variant="card"
          sizes={isSlide ? "(max-width: 500px) 80vw, 400px" : "(max-width: 768px) 100vw, 600px"}
        />
        <div className="absolute bottom-3.5 left-3.5 z-10 flex flex-wrap gap-1.5">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-[11px] py-[5px] text-[10.5px] font-semibold uppercase tracking-[.1em] text-ink"
            >
              {tag}
            </span>
          ))}
        </div>
        {!isSlide && (
          <div className="absolute inset-0 z-20 flex items-end justify-end bg-gradient-to-b from-transparent from-50% to-black/55 p-[18px] opacity-0 transition-opacity duration-250 group-hover:opacity-100">
            <span className="text-sm font-medium text-white">View Project →</span>
          </div>
        )}
        <CardPendingOverlay />
      </div>

      <div className="flex items-start justify-between gap-3.5 pt-1.5">
        <div>
          <h3 translate="no" className="m-0 font-serif text-[22px] font-bold tracking-[-0.01em]">
            {work.name}
          </h3>
          <p className="mt-1 max-w-[340px] text-[13.5px] leading-[1.45] text-muted">{work.blurb}</p>
        </div>
        {isSlide && <ArrowCircle />}
      </div>
    </Link>
  );
}
