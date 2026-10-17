import Image from "next/image";
import { shimmerPlaceholder } from "@/lib/shimmer";
import type { WorkCover as WorkCoverData } from "@/types";

interface WorkCoverProps {
  cover: WorkCoverData;
  /** "card" = 4:5 card image, "hero" = 2:1 case study hero */
  variant: "card" | "hero";
  sizes: string;
  priority?: boolean;
}

/** Fills a relatively positioned frame with the work's cover image. */
export function WorkCover({ cover, variant, sizes, priority = false }: WorkCoverProps) {
  return (
    <Image
      src={variant === "card" ? cover.card : cover.hero}
      alt={cover.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={shimmerPlaceholder}
      draggable={false}
      // Card images carry the title at the top, so shorter frames crop from the bottom
      className={variant === "card" ? "object-cover object-top" : "object-cover"}
    />
  );
}
