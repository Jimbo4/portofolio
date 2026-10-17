import { CaseStudyCardSkeleton, Skeleton, SkeletonPage } from "@/components/features/Skeleton";

const sectionPad = "py-[clamp(64px,9vw,128px)]";
const container = "mx-auto max-w-[1240px] px-7";
const sectionTitle = "mb-10 h-[clamp(53px,7.6vw,122px)] w-[min(440px,70%)] rounded-2xl";

/** Home skeleton: hero, philosophy pillars and the first projects. */
export default function HomeLoading() {
  return (
    <SkeletonPage className="overflow-hidden">
      <section className={`hero-glow pt-[140px] ${sectionPad}`}>
        <div className={`${container} flex flex-col items-center`}>
          <Skeleton className="h-4 w-56 rounded-full" />
          <div className="mt-7 flex w-full flex-col items-center gap-[clamp(8px,1vw,14px)]">
            <Skeleton className="h-[clamp(40px,7.6vw,114px)] w-[min(880px,92%)] rounded-2xl" />
            <Skeleton className="h-[clamp(40px,7.6vw,114px)] w-[min(760px,80%)] rounded-2xl" />
          </div>
        </div>
      </section>

      <section className={sectionPad}>
        <div className={container}>
          <Skeleton className={sectionTitle} />
          <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex shrink-0 basis-[78%] flex-col gap-3.5 md:basis-auto">
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="mt-1 h-6 w-2/3 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-full" />
                <Skeleton className="h-3.5 w-4/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionPad}>
        <div className={`${container} flex justify-end`}>
          <Skeleton className={sectionTitle} />
        </div>
        <div className="flex gap-6 px-7 pb-7 pt-2">
          {Array.from({ length: 4 }, (_, index) => (
            <CaseStudyCardSkeleton key={index} aspect="aspect-[4/5]" className="w-[min(400px,80vw)] shrink-0" />
          ))}
        </div>
      </section>
    </SkeletonPage>
  );
}
