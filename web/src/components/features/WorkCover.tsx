import Image from "next/image";
import type { WorkCover as WorkCoverData } from "@/types";
import { WorkArt, workArtBackground } from "./WorkArt";

/** Background classes for the frame that holds a cover. */
export function workCoverBackground(cover: WorkCoverData): string {
  return cover.kind === "art" ? workArtBackground(cover.art) : "bg-paper-2";
}

interface WorkCoverProps {
  cover: WorkCoverData;
  /** "card" = 4:5 card image, "hero" = 2:1 case study hero */
  variant: "card" | "hero";
  sizes: string;
  priority?: boolean;
}

/** Fills a relatively positioned frame with the work's image or generated art. */
export function WorkCover({ cover, variant, sizes, priority = false }: WorkCoverProps) {
  if (cover.kind === "art") return <WorkArt art={cover.art} />;
  return (
    <Image
      src={variant === "card" ? cover.card : cover.hero}
      alt={cover.alt}
      fill
      sizes={sizes}
      priority={priority}
      draggable={false}
      className="object-cover"
    />
  );
}
