import type { PillarId } from "@/types";

/** Visual identity per pillar, shared by Philosophy, Skills and case studies. */
export const pillarTheme: Record<PillarId, { icon: string; pill: string }> = {
  design: { icon: "icon-blue", pill: "bg-[rgba(37,99,235,.10)] text-[#1E3FB0]" },
  lead: { icon: "icon-orange", pill: "bg-[rgba(232,75,42,.10)] text-[#B8341A]" },
  ai: { icon: "icon-purple", pill: "bg-[rgba(109,63,214,.10)] text-[#5223B0]" },
  grow: { icon: "icon-green", pill: "bg-[rgba(91,168,46,.12)] text-[#2E5E1F]" },
};
