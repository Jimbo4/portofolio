"use client";

import { useLinkStatus } from "next/link";

/**
 * Covers a card's image while the click on its parent <Link> is still loading the case study.
 * Always rendered and toggled with opacity, so it never shifts the layout; it fades in after a short delay,
 * which keeps it hidden on navigations that are already instant.
 * Blur and spinner only run while pending: every carousel card renders an overlay, and dozens of idle backdrop
 * filters and animations exhaust GPU memory on phones, which blanks the whole page while scrolling.
 */
export function CardPendingOverlay() {
  const { pending } = useLinkStatus();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-ink/25 transition-opacity duration-200 ${
        pending ? "opacity-100 backdrop-blur-[2px] delay-100" : "opacity-0"
      }`}
    >
      <span
        className={`flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[.1em] text-ink shadow-[0_6px_14px_rgba(0,0,0,.08)] ${
          pending ? "backdrop-blur-[6px]" : ""
        }`}
      >
        <span
          className={`size-3 rounded-full border-[1.5px] border-ink/20 border-t-ink ${
            pending ? "animate-spin motion-reduce:animate-none" : ""
          }`}
        />
        Opening
      </span>
    </div>
  );
}
