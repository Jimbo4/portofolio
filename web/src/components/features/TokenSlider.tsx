"use client";

import { Children, isValidElement, useRef, useState } from "react";
import Image from "next/image";
import { shimmerPlaceholder } from "@/lib/shimmer";

/*
 * Slider for case study MDX, of collectibles (Token) or principles (Law): one large item per slide, on a dark panel,
 * with dots, a counter and previous/next buttons. Every prop is a plain string because MDX runs with JavaScript
 * expressions blocked.
 */

/** Plain-text child paragraphs inherit the slide's own type style instead of the body text style. */
const inheritParagraphs =
  "[&_p]:m-0 [&_p]:max-w-none [&_p]:[font-size:inherit] [&_p]:[line-height:inherit] [&_p]:[color:inherit]";

interface TokenProps {
  name: string;
  language: string;
  /** Hex color shown as text, e.g. "#6d13e6" */
  color: string;
  /** Number of bars in the image */
  bars: string;
  src: string;
  alt: string;
  children: React.ReactNode;
}

/** One slide: the token image next to its name, story and traits. */
export function Token({ name, language, color, bars, src, alt, children }: TokenProps) {
  const traits = [
    { label: "Language", value: language },
    { label: "Color", value: color },
    { label: "Bars", value: bars },
  ];
  return <Slide name={name} src={src} alt={alt} traits={traits}>{children}</Slide>;
}

interface LawProps {
  name: string;
  /** Course module the principle belongs to */
  module: string;
  /** Author and year, e.g. "Köhler, 1929" */
  source: string;
  /** Where it applies in reports and dashboards */
  use: string;
  src: string;
  alt: string;
  children: React.ReactNode;
}

/** One slide: a named principle or law, with the module that teaches it, its source and where it applies. */
export function Law({ name, module, source, use, src, alt, children }: LawProps) {
  const traits = [
    { label: "Module", value: module },
    { label: "Source", value: source },
    { label: "Use it for", value: use },
  ];
  return <Slide name={name} src={src} alt={alt} traits={traits}>{children}</Slide>;
}

interface SlideProps {
  name: string;
  src: string;
  alt: string;
  traits: { label: string; value: string }[];
  children: React.ReactNode;
}

function Slide({ name, src, alt, traits, children }: SlideProps) {
  return (
    <div className="grid h-full items-center gap-7 p-6 md:grid-cols-[minmax(0,400px)_1fr] md:gap-14 md:p-10">
      <Image
        src={src}
        alt={alt}
        width={840}
        height={840}
        sizes="(max-width: 768px) 90vw, 400px"
        placeholder={shimmerPlaceholder}
        className="h-auto w-full rounded-xl ring-1 ring-white/10"
      />
      <div>
        <h3 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[44px]">{name}</h3>
        <div className={`mt-4 max-w-[460px] text-[15px] leading-[1.65] text-white/70 ${inheritParagraphs}`}>{children}</div>
        <dl className="mt-8 grid max-w-[460px] grid-cols-3 gap-4 border-t border-white/15 pt-5 font-mono">
          {traits.map((trait) => (
            <div key={trait.label}>
              <dt className="text-[11px] uppercase tracking-[.16em] text-white/45">{trait.label}</dt>
              <dd className="m-0 mt-1.5 text-[14px] text-white">{trait.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const twoDigits = (n: number) => String(n).padStart(2, "0");

export function TokenSlider({ label, children }: { label: string; children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /*
   * Slide a smooth scroll is heading to, so quick repeated clicks step from there instead of from mid-animation.
   * It is cleared once the track arrives, after a timeout, or when the user scrolls by hand: relying on `scrollend`
   * alone left it stale (no event when the scroll is a no-op or the browser lacks it), and the arrows then stepped
   * from the wrong slide.
   */
  const pendingRef = useRef<{ index: number; timer: number } | null>(null);
  const slides = Children.toArray(children).filter(isValidElement);
  const count = slides.length;

  const clearPending = () => {
    if (pendingRef.current) window.clearTimeout(pendingRef.current.timer);
    pendingRef.current = null;
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + count) % count;
    clearPending();
    pendingRef.current = { index: target, timer: window.setTimeout(clearPending, 900) };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const syncActive = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
    const pending = pendingRef.current;
    if (pending && Math.abs(track.scrollLeft - pending.index * track.clientWidth) < 2) clearPending();
  };

  const step = (delta: number) => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    // Step from the slide a scroll is heading to, or else from where the track actually is
    goTo((pendingRef.current?.index ?? Math.round(track.scrollLeft / track.clientWidth)) + delta);
  };

  const slideName = (index: number) => {
    const props = slides[index]?.props as { name?: string } | undefined;
    return props?.name ?? `slide ${index + 1}`;
  };

  const arrowButton =
    "grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section aria-roledescription="carousel" aria-label={label} className="mt-10 overflow-hidden rounded-3xl bg-[#0d1117] text-white">
      <div
        ref={trackRef}
        onScroll={syncActive}
        onPointerDown={clearPending}
        onWheel={clearPending}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-full shrink-0 snap-start"
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:px-10">
        <div className="flex gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${slideName(i)}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${i === active ? "w-7 bg-white" : "w-2 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="mr-1 whitespace-nowrap font-mono text-[13px] tracking-[.12em] text-white/60" aria-live="polite">
            {twoDigits(active + 1)} / {twoDigits(count)}
          </span>
          <button type="button" onClick={() => step(-1)} aria-label="Previous" className={arrowButton}>
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next" className={arrowButton}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
