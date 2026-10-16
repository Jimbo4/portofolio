import type { WorkArt as WorkArtId } from "@/types";

/** Abstract device mock per placeholder project. */
const mocks: Record<WorkArtId, React.ReactNode> = {
  klever: (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid meet">
      <rect x="56" y="34" width="88" height="200" rx="16" fill="#151515" stroke="#3a3a3a" />
      <rect x="64" y="44" width="72" height="120" rx="8" fill="#1a1a1a" />
      <rect x="72" y="56" width="20" height="20" rx="4" fill="#E84B2A" />
      <rect x="72" y="86" width="56" height="6" rx="3" fill="#3a3a3a" />
      <rect x="72" y="98" width="40" height="6" rx="3" fill="#3a3a3a" />
      <rect x="64" y="174" width="72" height="48" rx="8" fill="#0F0F0F" />
      <circle cx="76" cy="198" r="6" fill="#E84B2A" />
      <circle cx="100" cy="198" r="6" fill="#3a3a3a" />
      <circle cx="124" cy="198" r="6" fill="#3a3a3a" />
    </svg>
  ),
  metrix: (
    <svg viewBox="0 0 220 280">
      <rect x="10" y="40" width="200" height="160" rx="14" fill="#fff" />
      <rect x="20" y="52" width="60" height="10" rx="4" fill="#E5E0D8" />
      <rect x="20" y="70" width="40" height="20" rx="4" fill="#1A1A18" />
      <path
        d="M20 150 L60 130 L100 140 L140 110 L180 120 L200 100"
        stroke="#E84B2A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="180" cy="170" r="20" fill="#FAF3EE" stroke="#E5E0D8" />
      <circle cx="180" cy="170" r="20" fill="none" stroke="#E84B2A" strokeWidth="3" strokeDasharray="80 100" />
      <rect x="20" y="170" width="40" height="6" rx="3" fill="#E5E0D8" />
      <rect x="20" y="182" width="60" height="6" rx="3" fill="#E5E0D8" />
    </svg>
  ),
  vox: (
    <svg viewBox="0 0 200 280">
      <rect x="44" y="40" width="112" height="200" rx="20" fill="#0B1746" stroke="#1F2F6B" />
      <rect x="52" y="56" width="96" height="48" rx="10" fill="#11225A" />
      <rect x="60" y="68" width="40" height="6" rx="3" fill="#5AA9FF" />
      <rect x="60" y="82" width="60" height="10" rx="3" fill="#fff" />
      <rect x="52" y="116" width="96" height="48" rx="10" fill="#11225A" />
      <rect x="60" y="128" width="40" height="6" rx="3" fill="#5AA9FF" />
      <rect x="60" y="142" width="60" height="10" rx="3" fill="#fff" />
      <rect x="52" y="180" width="96" height="40" rx="10" fill="#9DFB6D" />
      <rect x="76" y="196" width="48" height="8" rx="3" fill="#0B1746" />
    </svg>
  ),
  forma: (
    <svg viewBox="0 0 220 280">
      <g transform="translate(30,40)">
        <path d="M0 80 L80 40 L160 80 L160 180 L80 220 L0 180 Z" fill="#fff" fillOpacity=".95" />
        <path d="M0 80 L80 120 L160 80" stroke="#063C36" strokeWidth="2" fill="none" />
        <path d="M80 120 L80 220" stroke="#063C36" strokeWidth="2" />
        <rect x="20" y="100" width="40" height="30" fill="#119A8A" />
        <rect x="100" y="100" width="40" height="30" fill="#0F7E70" />
      </g>
    </svg>
  ),
  flow: (
    <svg viewBox="0 0 220 280">
      <rect x="10" y="40" width="200" height="160" rx="14" fill="#171717" stroke="#2a2a2a" />
      <circle cx="40" cy="60" r="4" fill="#3a3a3a" />
      <circle cx="52" cy="60" r="4" fill="#3a3a3a" />
      <circle cx="64" cy="60" r="4" fill="#3a3a3a" />
      <rect x="20" y="80" width="80" height="40" rx="6" fill="#252525" />
      <rect x="110" y="80" width="90" height="40" rx="6" fill="#252525" />
      <rect x="20" y="130" width="180" height="60" rx="6" fill="#222" />
      <rect x="30" y="142" width="50" height="6" rx="3" fill="#3a3a3a" />
      <rect x="30" y="156" width="120" height="6" rx="3" fill="#3a3a3a" />
      <rect x="30" y="170" width="80" height="6" rx="3" fill="#3a3a3a" />
    </svg>
  ),
};

const backgrounds: Record<WorkArtId, string> = {
  klever: "art-klever",
  metrix: "art-metrix",
  vox: "art-vox",
  forma: "art-forma",
  flow: "art-flow",
};

export function workArtBackground(art: WorkArtId): string {
  return backgrounds[art];
}

export function WorkArt({ art }: { art: WorkArtId }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center [&_svg]:h-auto [&_svg]:w-[62%] [&_svg]:drop-shadow-[0_20px_30px_rgba(0,0,0,.35)]"
    >
      {mocks[art]}
    </div>
  );
}
