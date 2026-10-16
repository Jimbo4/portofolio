interface SectionTitleProps {
  id: string;
  children: React.ReactNode;
  align: "left" | "right";
}

/** Oversized italic section heading, alternating left / right down the page. */
export function SectionTitle({ id, children, align }: SectionTitleProps) {
  return (
    <div className={`mb-10 flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <h2
        id={id}
        className="font-serif text-[clamp(56px,8vw,128px)] font-extrabold italic leading-[.95] tracking-[-0.04em] text-ink"
      >
        {children}
      </h2>
    </div>
  );
}
