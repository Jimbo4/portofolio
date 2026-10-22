import type { Metadata } from "next";
import { NotFoundStrip } from "@/components/features/NotFoundStrip";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. The way back home is one click away.",
};

/**
 * 404: a giant italic "404" behind a strip of text that drifts sideways, with the way home in accent italic, like
 * "good" in the contact section (see NotFoundStrip).
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
        <NotFoundStrip />
      </div>
    </section>
  );
}
