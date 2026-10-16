import type { PillarId } from "@/types";
import { pillarTheme } from "@/lib/pillarTheme";

/** Line glyphs: white outline with a translucent fill, drawn in a 64×64 box. */
const glyphs: Record<PillarId, React.ReactNode> = {
  // Mouse pointer with click rays
  design: (
    <>
      <path d="M24 20 L47 38 L35.5 40.5 L41.5 51.5 L36 54.5 L30 43 L22 49.5 Z" fill="rgba(255,255,255,.3)" />
      <path d="M17 21 L11 19.5 M20.5 15 L18.5 9 M26 14 L29 8.5" />
    </>
  ),
  // Isometric cube
  lead: (
    <>
      <path d="M32 9 L52 20.5 L32 32 L12 20.5 Z" fill="rgba(255,255,255,.42)" />
      <path d="M12 20.5 V43.5 L32 55 V32 Z M52 20.5 V43.5 L32 55 V32 Z" fill="rgba(255,255,255,.18)" />
    </>
  ),
  // Large and small AI sparkles
  ai: (
    <>
      <path
        d="M28 12 C29.4 25.4 36.6 32.6 50 34 C36.6 35.4 29.4 42.6 28 56 C26.6 42.6 19.4 35.4 6 34 C19.4 32.6 26.6 25.4 28 12 Z"
        fill="rgba(255,255,255,.3)"
      />
      <path d="M48 6 C48.6 11.6 51.4 14.4 57 15 C51.4 15.6 48.6 18.4 48 24 C47.4 18.4 44.6 15.6 39 15 C44.6 14.4 47.4 11.6 48 6 Z" fill="#fff" />
    </>
  ),
  // Lightning bolt
  grow: <path d="M36 8 L19 36 L31 36 L27 56 L46 27 L34 27 Z" fill="rgba(255,255,255,.3)" />,
};

interface WaveLayer {
  d: string;
  tone: "light" | "deep";
  width: number;
  opacity: number;
}

/** Soft stroked ribbons over the pillar gradient, a different motif per pillar (100×100 box). */
const waves: Record<PillarId, { light: string; deep: string; blur: number; layers: WaveLayer[] }> = {
  // Diagonal ribbons
  design: {
    light: "#9fe7ff",
    deep: "#0e1660",
    blur: 4.5,
    layers: [
      { d: "M70 -14 C 46 14, 26 30, -14 48", tone: "light", width: 16, opacity: 0.6 },
      { d: "M118 0 C 78 34, 52 56, -6 106", tone: "deep", width: 26, opacity: 0.7 },
      { d: "M124 38 C 92 64, 70 82, 30 118", tone: "light", width: 20, opacity: 0.65 },
      { d: "M130 84 C 112 96, 100 104, 82 120", tone: "deep", width: 16, opacity: 0.5 },
    ],
  },
  // Layered dunes
  lead: {
    light: "#ffbf73",
    deep: "#a8290a",
    blur: 4,
    layers: [
      { d: "M-12 18 C 22 2, 54 30, 112 6", tone: "deep", width: 14, opacity: 0.45 },
      { d: "M-12 46 C 24 26, 56 60, 112 34", tone: "light", width: 20, opacity: 0.6 },
      { d: "M-12 78 C 26 58, 58 92, 112 64", tone: "deep", width: 26, opacity: 0.6 },
      { d: "M-12 108 C 30 90, 60 118, 112 96", tone: "light", width: 18, opacity: 0.5 },
    ],
  },
  // Ripples from a corner
  ai: {
    light: "#e6d6ff",
    deep: "#1d0b52",
    blur: 4,
    layers: [
      { d: "M104 70 A 34 34 0 0 0 70 104", tone: "light", width: 16, opacity: 0.55 },
      { d: "M104 38 A 66 66 0 0 0 38 104", tone: "deep", width: 22, opacity: 0.6 },
      { d: "M104 4 A 100 100 0 0 0 4 104", tone: "light", width: 16, opacity: 0.5 },
      { d: "M-8 34 A 42 42 0 0 0 34 -8", tone: "deep", width: 16, opacity: 0.45 },
    ],
  },
  // Fine diagonal stripes
  grow: {
    light: "#fff6b8",
    deep: "#b87400",
    blur: 2,
    layers: [8, 34, 60, 86, 112, 138].map((y, i) => ({
      d: `M-10 ${y} C 26 ${y - 18}, 58 ${y - 6}, 110 ${y - 42}`,
      tone: i % 2 === 0 ? ("light" as const) : ("deep" as const),
      width: 11,
      opacity: i % 2 === 0 ? 0.6 : 0.4,
    })),
  },
};

interface PillarIconProps {
  pillar: PillarId;
  size: "lg" | "sm";
}

export function PillarIcon({ pillar, size }: PillarIconProps) {
  const frame =
    size === "lg"
      ? "aspect-square w-full rounded-3xl shadow-[0_6px_14px_rgba(0,0,0,.06),inset_0_1px_0_rgba(255,255,255,.25)] [&_.glyph]:h-[52%] [&_.glyph]:w-[52%] [&_.glyph]:drop-shadow-[0_2px_6px_rgba(0,0,0,.14)]"
      : "size-16 shrink-0 rounded-2xl shadow-[0_8px_18px_rgba(0,0,0,.06)] [&_.glyph]:h-[56%] [&_.glyph]:w-[56%] [&_.glyph]:drop-shadow-[0_2px_4px_rgba(0,0,0,.18)]";
  const wave = waves[pillar];
  const blurId = `pillar-wave-blur-${pillar}-${size}`;

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${pillarTheme[pillar].icon} ${frame}`}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none">
        <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={wave.blur} />
        </filter>
        <g filter={`url(#${blurId})`} strokeLinecap="round">
          {wave.layers.map((layer) => (
            <path
              key={layer.d}
              d={layer.d}
              stroke={layer.tone === "light" ? wave.light : wave.deep}
              strokeWidth={layer.width}
              strokeOpacity={layer.opacity}
            />
          ))}
        </g>
      </svg>
      <span className="icon-gloss pointer-events-none absolute inset-0" />
      <span className="icon-grain pointer-events-none absolute inset-0" />
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="glyph relative z-10"
      >
        {glyphs[pillar]}
      </svg>
    </div>
  );
}
