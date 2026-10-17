import { Skeleton, SkeletonPage } from "@/components/features/Skeleton";

/** Case study skeleton: tags, title, intro, meta row, hero cover and the first body section. */
export default function CaseStudyLoading() {
  return (
    <SkeletonPage className="mx-auto min-h-screen max-w-[1240px] px-7 pb-24 pt-[120px]">
      <Skeleton className="h-[38px] w-[156px] rounded-full" />

      <div className="mt-[18px] flex flex-wrap gap-2.5">
        {["w-24", "w-28", "w-20", "w-14"].map((width) => (
          <Skeleton key={width} className={`h-[26px] rounded-full ${width}`} />
        ))}
      </div>
      <Skeleton className="mt-3.5 h-[clamp(48px,7vw,96px)] w-[min(760px,90%)] rounded-2xl" />
      <div className="mt-[18px] flex max-w-[680px] flex-col gap-2.5">
        <Skeleton className="h-[18px] w-full rounded-full" />
        <Skeleton className="h-[18px] w-3/4 rounded-full" />
      </div>

      <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2.5">
            <Skeleton className="h-3 w-12 rounded-full" />
            <Skeleton className="h-4 w-36 rounded-full" />
          </div>
        ))}
      </div>

      <Skeleton className="mb-10 mt-8 aspect-[16/8] w-full rounded-3xl" />

      <Skeleton className="mt-20 h-9 w-56 rounded-xl" />
      <div className="mt-[18px] flex max-w-[760px] flex-col gap-3">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-2/3 rounded-full" />
      </div>
    </SkeletonPage>
  );
}
