import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. The way back home is one click away.",
};

/** Enough copies for half the strip to cover a wide screen; the strip shifts by -50% (animate-marquee) */
const copies = 4;
/** The copy whose link starts in view: the only one focusable and read aloud */
const mainCopy = 1;

/**
 * 404: a giant italic "404" behind a strip of text that drifts sideways, with the way home in accent italic, like
 * "good" in the contact section. The strip starts with the second copy's link against the right gutter (its width is
 * about 10em) and the end of the first copy's line on its left, so the link can be clicked right away and a visitor
 * who waits reads the whole line. It stops on hover, on focus and for reduced motion.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-h" className="relative flex min-h-svh items-center overflow-hidden">
      <h1 id="not-found-h" className="sr-only">
        Page not found
      </h1>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-serif text-[90vw] font-extrabold italic leading-none tracking-[-0.06em] text-ink/[.08] [font-variation-settings:'opsz'_144] md:text-[min(56vw,88svh)]"
      >
        404
      </div>
      <div className="@container relative w-full overflow-hidden py-6">
        <ul className="flex w-max animate-marquee items-center p-0 font-serif text-[clamp(32px,5vw,76px)] [animation-duration:40s] [translate:calc(max(28px,100cqw-10em-28px)-25%)] focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-reduce:animate-none">
          {Array.from({ length: copies }, (_, index) => (
            <li
              key={index}
              aria-hidden={index !== mainCopy || undefined}
              className="flex shrink-0 list-none items-center gap-[.5em] whitespace-nowrap pr-[.9em] font-light leading-[1.15] tracking-[-0.03em] text-ink"
            >
              <Link
                href="/"
                tabIndex={index !== mainCopy ? -1 : undefined}
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
      </div>
    </section>
  );
}
