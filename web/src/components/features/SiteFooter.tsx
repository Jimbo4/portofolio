import { profile } from "@/lib/config";

/** Cached at build time so the page stays fully static. */
async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCopyrightYear();
  return (
    <footer className="mt-20 flex flex-col items-center gap-2 border-t border-line-soft py-12 text-[13px] text-muted">
      <div className="flex flex-wrap justify-center gap-6">
        <span>© {year} {profile.name}</span>
        <a href={`mailto:${profile.email}`} className="hover:text-ink">
          {profile.email}
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          GitHub
        </a>
      </div>
    </footer>
  );
}
