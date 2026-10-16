export function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/50 px-4 py-[7px] text-[13px] text-ink-2">
      {children}
    </span>
  );
}
