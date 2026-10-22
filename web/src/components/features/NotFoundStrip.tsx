"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Enough copies for half the strip to cover a wide screen; the loop shifts the strip by -50% */
const COPIES = 4;
/** Time for the loop to travel two copies */
const LOOP_MS = 50_000;
/** Space between the link and the right edge when the strip comes in, same as the page gutter (px-7) */
const GUTTER_PX = 28;

/**
 * The 404 strip. It starts with the way home near the right edge, so it can be clicked right away, then slides left at
 * the loop's own speed and keeps looping, so a visitor who waits reads the whole line. Before it is measured it sits
 * where the CSS estimate puts the link (inside an `@container` parent). Only the first copy is focusable and read aloud; the strip stops on hover, on
 * focus and for reduced motion.
 */
export function NotFoundStrip() {
  const stripRef = useRef<HTMLUListElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let isCancelled = false;
    // Measure with the real fonts, or the link width is off
    document.fonts.ready.then(() => {
      const strip = stripRef.current;
      const link = linkRef.current;
      const viewport = strip?.parentElement?.clientWidth;
      if (isCancelled || !strip || !link || !viewport) return;
      const enterX = Math.max(GUTTER_PX, viewport - link.offsetWidth - GUTTER_PX);
      const loopWidth = strip.offsetWidth / 2;
      strip.style.setProperty("--enter-x", `${enterX}px`);
      strip.style.setProperty("--enter-ms", `${Math.round((enterX / loopWidth) * LOOP_MS)}ms`);
      strip.style.setProperty("--loop-ms", `${LOOP_MS}ms`);
      setIsMoving(true);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <ul
      ref={stripRef}
      className={`flex w-max items-center p-0 font-serif text-[clamp(32px,5vw,76px)] [transform:translateX(var(--enter-x,max(28px,calc(100cqw-10em-28px))))] focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-reduce:[transform:none] ${
        isMoving ? "strip-enter" : ""
      }`}
    >
      {Array.from({ length: COPIES }, (_, index) => (
        <li
          key={index}
          aria-hidden={index > 0 || undefined}
          className="flex shrink-0 list-none items-center gap-[.5em] whitespace-nowrap pr-[.9em] font-light leading-[1.15] tracking-[-0.03em] text-ink"
        >
          <Link
            ref={index === 0 ? linkRef : undefined}
            href="/"
            tabIndex={index > 0 ? -1 : undefined}
            className="group inline-flex items-center gap-[.28em] rounded-full font-extrabold italic text-accent transition-colors hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[.72em] shrink-0 transition-transform duration-200 group-hover:-translate-x-[.08em] motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 12H7.5M11.5 8l-4 4 4 4" />
            </svg>
            Take me back home.
          </Link>
          <span>Exploration is part of my process too, but you&apos;re lost.</span>
        </li>
      ))}
    </ul>
  );
}
