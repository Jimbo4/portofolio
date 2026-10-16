import type { PillarId } from "@/types";
import { pillarTheme } from "@/lib/pillarTheme";

const glyphs: Record<PillarId, React.ReactNode> = {
  // Cursor with sparkle lines
  design: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M22 12 L48 32 L33 35 L40 50 L34 53 L27 38 L18 44 Z" fill="#fff" />
      <path
        d="M14 6 L20 6 M11 9 L15 11 M9 14 L14 14"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  // Isometric box
  lead: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 8 L56 20 L56 44 L32 56 L8 44 L8 20 Z" fill="#fff" fillOpacity=".95" />
      <path d="M32 8 L56 20 L32 32 L8 20 Z" fill="#fff" fillOpacity=".75" />
      <path d="M32 32 L56 20 L56 44 L32 56 Z" fill="#fff" fillOpacity=".55" />
    </svg>
  ),
  // Lightning bolt
  ai: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M34 8 L18 36 L30 36 L26 56 L46 28 L34 28 Z" fill="#fff" />
    </svg>
  ),
  // Target with arrow
  grow: (
    <svg viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="3">
      <circle cx="30" cy="34" r="20" />
      <circle cx="30" cy="34" r="12" />
      <circle cx="30" cy="34" r="4" fill="#fff" />
      <path d="M30 34 L52 12" strokeLinecap="round" />
      <path d="M44 12 L52 12 L52 20" strokeLinecap="round" strokeLinejoin="round" />
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
