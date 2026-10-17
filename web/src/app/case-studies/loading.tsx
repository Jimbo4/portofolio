import { CaseStudyCardSkeleton, Skeleton, SkeletonPage } from "@/components/features/Skeleton";

/** Case studies skeleton: page title, one pillar header and a masonry of cards. */
export default function CaseStudiesLoading() {
  return (
    <SkeletonPage className="mx-auto min-h-screen max-w-[1240px] px-7 pt-[120px]">
      <Skeleton className="h-[38px] w-[92px] rounded-full" />
      <Skeleton className="mb-14 mt-8 h-[clamp(46px,6.7vw,100px)] w-[min(620px,90%)] rounded-2xl" />

      <div className="mb-10 flex items-center gap-5">
        <Skeleton className="size-16 shrink-0 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-[clamp(32px,4vw,52px)] w-[min(360px,80%)] rounded-xl" />
          <Skeleton className="h-4 w-[min(480px,90%)] rounded-full" />
        </div>
      </div>
      <div className="columns-1 gap-7 pb-20 md:columns-2">
        {["aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]"].map((aspect, index) => (
          <CaseStudyCardSkeleton key={index} aspect={aspect} className="mb-7 break-inside-avoid" />
        ))}
      </div>
    </SkeletonPage>
  );
}
