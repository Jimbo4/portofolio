/**
 * Scrolls to a home page section by id, leaving room for the fixed header.
 * Returns false when the section is not in the DOM (yet).
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth"): boolean {
  const section = document.getElementById(id);
  if (!section) return false;
  // The bar only: the mobile menu is still open (and taller) at the moment its link is tapped
  const headerHeight = document.querySelector("header > div")?.getBoundingClientRect().height ?? 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: section.getBoundingClientRect().top + window.scrollY - headerHeight,
    behavior: reduceMotion ? "auto" : behavior,
  });
  return true;
}
