/** Shimmering block that stands in for a piece of content while it loads. Size and radius come from `className`. */
export function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

/** Wraps a route's loading skeleton and announces the loading state to assistive tech. */
export function SkeletonPage({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}

/** Stand-in for a CaseStudyCard: cover frame, title and two blurb lines. */
export function CaseStudyCardSkeleton({ aspect, className = "" }: { aspect: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <Skeleton className={`w-full rounded-card ${aspect}`} />
      <div className="flex flex-col gap-2 pt-1.5">
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-3.5 w-4/5 rounded-full" />
        <Skeleton className="h-3.5 w-3/5 rounded-full" />
      </div>
    </div>
  );
}
