"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, profile } from "@/lib/config";
import { scrollToSection } from "@/lib/scrollToSection";

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /** On the home page, scroll to the section directly: Next.js skips the scroll when the hash is already in the URL. */
  const onSectionLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    const [path, id] = href.split("#");
    if (pathname !== (path || "/") || !id || !scrollToSection(id)) return;
    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-250 ${
        isSolid
          ? "border-line-soft bg-[rgba(245,242,238,.72)] backdrop-blur-[14px] backdrop-saturate-[1.4]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-7">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-[-0.01em] text-ink"
          onClick={() => setIsMenuOpen(false)}
        >
          {profile.name}
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => onSectionLinkClick(event, link.href)}
              className="rounded-full px-3.5 py-2 text-sm text-ink-2 transition-colors hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-line md:hidden"
        >
          <span
            className={`relative block h-[1.5px] w-[18px] bg-ink transition-colors before:absolute before:left-0 before:h-[1.5px] before:w-[18px] before:bg-ink before:transition-transform after:absolute after:left-0 after:h-[1.5px] after:w-[18px] after:bg-ink after:transition-transform ${
              isMenuOpen
                ? "bg-transparent before:top-0 before:rotate-45 after:top-0 after:-rotate-45"
                : "before:-top-1.5 after:top-1.5"
            }`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-line-soft px-7 pb-6 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => onSectionLinkClick(event, link.href)}
              className="block border-b border-line-soft py-4 font-serif text-2xl text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
