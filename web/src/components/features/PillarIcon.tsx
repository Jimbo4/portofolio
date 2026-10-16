import type { PillarId } from "@/types";
import { pillarTheme } from "@/lib/pillarTheme";

const glyphs: Record<PillarId, React.ReactNode> = {
  // Mouse pointer
  design: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M20 10 L48 32 L33 35 L40 50 L34 53 L27 38 L18 44 Z" fill="#fff" />
    </svg>
  ),
  // Regular hexagon
  lead: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 7 L53.65 19.5 L53.65 44.5 L32 57 L10.35 44.5 L10.35 19.5 Z" fill="#fff" strokeLinejoin="round" />
    </svg>
  ),
  // Four-point AI sparkle
  ai: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 6 C33.6 21.5 42.5 30.4 58 32 C42.5 33.6 33.6 42.5 32 58 C30.4 42.5 21.5 33.6 6 32 C21.5 30.4 30.4 21.5 32 6 Z" fill="#fff" />
    </svg>
  ),
  // Lightning bolt
  grow: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M34 8 L18 36 L30 36 L26 56 L46 28 L34 28 Z" fill="#fff" />
    </svg>
  ),
};

interface PillarIconProps {
  pillar: PillarId;
  size: "lg" | "sm";
}

export function PillarIcon({ pillar, size }: PillarIconProps) {
  const frame =
    size === "lg"
      ? "aspect-square w-full rounded-3xl shadow-[0_6px_14px_rgba(0,0,0,.06),inset_0_1px_0_rgba(255,255,255,.25)] [&_svg]:h-[42%] [&_svg]:w-[42%] [&_svg]:drop-shadow-[0_2px_5px_rgba(0,0,0,.12)]"
      : "size-16 shrink-0 rounded-2xl shadow-[0_8px_18px_rgba(0,0,0,.06)] [&_svg]:h-[48%] [&_svg]:w-[48%] [&_svg]:drop-shadow-[0_3px_6px_rgba(0,0,0,.2)]";

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${pillarTheme[pillar].icon} ${frame} [&_svg]:relative [&_svg]:z-10`}
    >
      <span className="icon-gloss pointer-events-none absolute inset-0" />
      {glyphs[pillar]}
    </div>
  );
}
