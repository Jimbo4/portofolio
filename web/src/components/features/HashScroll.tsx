"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToSection } from "@/lib/scrollToSection";

const RETRY_MS = 100;
const GIVE_UP_MS = 3000;

/** Drops the hash from the URL, keeping the history entry. */
function clearHash() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

/**
 * After a navigation to a URL with a hash (e.g. /#skills from a case study), scrolls to that section once it is in
 * the DOM: Next.js skips the scroll when the page streams in behind its loading skeleton. Then the hash is removed,
 * otherwise coming back to this page with the back button would jump to that section again instead of where the
 * visitor had scrolled to.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const startedAt = Date.now();
    let timer = 0;
    const attempt = () => {
      if (scrollToSection(id, "auto") || Date.now() - startedAt > GIVE_UP_MS) {
        clearHash();
        return;
      }
      timer = window.setTimeout(attempt, RETRY_MS);
    };
    attempt();
    // Scrolling by hand while the section is still loading cancels the jump
    const cancel = () => {
      if (!timer) return;
      window.clearTimeout(timer);
      clearHash();
    };
    window.addEventListener("wheel", cancel, { once: true, passive: true });
    window.addEventListener("touchmove", cancel, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
    };
  }, [pathname]);

  return null;
}
