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
      <span>© {year} {profile.name}</span>
    </footer>
  );
}
