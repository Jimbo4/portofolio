import { profile } from "@/lib/config";

/** On every page, so the same contacts sit next to all content (also read by search engines and AI agents) */
const footerLinks = [
  { label: profile.email, href: `mailto:${profile.email}`, isExternal: false },
  { label: "LinkedIn", href: profile.linkedin, isExternal: true },
  { label: "GitHub", href: profile.github, isExternal: true },
];

/** Cached at build time so the page stays fully static. */
async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCopyrightYear();
  return (
    <footer className="mt-20 flex flex-col items-center gap-3 border-t border-line-soft py-12 text-[13px] text-muted">
      <ul aria-label="Contacts" className="flex flex-wrap justify-center gap-x-6 gap-y-1 p-0">
        {footerLinks.map((link) => (
          <li key={link.label} className="list-none">
            <a
              href={link.href}
              {...(link.isExternal ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
              className="inline-flex min-h-6 items-center text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <span>© {year} {profile.name}</span>
    </footer>
  );
}
