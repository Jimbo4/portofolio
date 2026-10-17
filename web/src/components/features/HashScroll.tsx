"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToSection } from "@/lib/scrollToSection";

const RETRY_MS = 100;
const GIVE_UP_MS = 3000;

/**
 * After a client-side navigation to a URL with a hash (e.g. /#skills from a case study), scrolls to that section
 * once it is in the DOM. Next.js skips the scroll when the page streams in behind its loading skeleton.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const startedAt = Date.now();
    let timer = 0;
    const attempt = () => {
      if (scrollToSection(id, "auto") || Date.now() - startedAt > GIVE_UP_MS) return;
      timer = window.setTimeout(attempt, RETRY_MS);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
