import Image from "next/image";
import type { MDXComponents } from "mdx/types";

/*
 * Building blocks available inside content/case-studies/*.mdx.
 * MDX runs with JavaScript expressions blocked, so every prop is a plain string.
 */

export const caseStudySectionTitle = "mb-[18px] mt-20 font-serif text-[32px] font-semibold tracking-[-0.02em]";
export const caseStudyBodyText = "max-w-[760px] text-base leading-[1.7] text-ink-2";

interface FigureProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  caption?: string;
  /** Media query hint for next/image */
  sizes?: string;
}

/** Image with optional caption. Width and height are the source file's pixels. */
export function Figure({ src, alt, width, height, caption, sizes = "(max-width: 768px) 100vw, 1184px" }: FigureProps) {
  return (
    <figure className="m-0 mt-8 flex flex-col gap-2.5">
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        sizes={sizes}
        className="h-auto w-full rounded-2xl border border-line-soft"
      />
      {caption && <figcaption className="text-[13px] leading-[1.5] text-muted">{caption}</figcaption>}
    </figure>
  );
}

const screensLayout = {
  /** Two large screens side by side */
  pair: "max-w-[760px] grid-cols-2 gap-6",
  /** Two columns on mobile, five on desktop */
  row: "grid-cols-2 gap-4 md:grid-cols-5",
};

/** Phone screens in a grid. */
export function Screens({ layout = "row", children }: { layout?: keyof typeof screensLayout; children: React.ReactNode }) {
  return (
    <div className={`mt-10 grid [&_img]:rounded-[22px] [&>figure]:mt-0 ${screensLayout[layout] ?? screensLayout.row}`}>{children}</div>
  );
}

/** Grid of square-ish visuals such as social posts. */
export function Gallery({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 [&>figure]:mt-0">{children}</div>;
}

/** Discipline-by-discipline breakdown of the work, inspired by agency case studies. */
export function Disciplines({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 grid gap-4 md:grid-cols-2">{children}</div>;
}

export function Discipline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white p-6">
      <h3 className="font-serif text-lg font-semibold">{label}</h3>
      <div className="text-[14.5px] leading-[1.6] text-muted [&_p]:m-0 [&_p]:max-w-none [&_p]:text-[14.5px] [&_p]:leading-[1.6] [&_p]:text-muted">
        {children}
      </div>
    </div>
  );
}

/** Plain-text child paragraphs inherit the block's own type style instead of the body text style. */
const inheritParagraphs =
  "[&_p]:m-0 [&_p]:max-w-none [&_p]:[font-size:inherit] [&_p]:[line-height:inherit] [&_p]:[color:inherit]";

/** Numbered rows for a process: number, step name and description side by side. */
export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="mt-8 flex list-none flex-col border-b border-line p-0 [counter-reset:step]">{children}</ol>;
}

export function Step({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-3 border-t border-line py-7 [counter-increment:step] md:grid-cols-[72px_240px_1fr] md:gap-8">
      <span
        aria-hidden="true"
        className="font-mono text-[13px] tracking-[.14em] text-accent before:content-[counter(step,decimal-leading-zero)]"
      />
      <h3 className="font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.01em]">{label}</h3>
      <div className={`text-base leading-[1.7] text-ink-2 ${inheritParagraphs}`}>{children}</div>
    </li>
  );
}

/** Open three-column grid of named principles, headed by a heavy rule instead of a card. */
export function Principles({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Principle({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t-2 border-ink pt-5">
      <h3 className="font-serif text-[30px] font-extrabold italic leading-[1.05] tracking-[-0.02em]">{label}</h3>
      <div className={`text-[14.5px] leading-[1.6] text-muted ${inheritParagraphs}`}>{children}</div>
    </div>
  );
}

interface VideoFeatureProps {
  title: string;
  src: string;
  poster: string;
  /** Accessible description of what the video shows */
  label: string;
  children: React.ReactNode;
}

/** Vertical video next to its story. */
export function VideoFeature({ title, src, poster, label, children }: VideoFeatureProps) {
  return (
    <div className="mt-20 grid items-center gap-10 rounded-3xl border border-line bg-white p-7 md:grid-cols-[1fr_auto] md:p-10">
      <div>
        <h2 className="mb-[18px] font-serif text-[32px] font-semibold tracking-[-0.02em]">{title}</h2>
        <div className="flex flex-col gap-3.5 [&_p]:mt-0">{children}</div>
      </div>
      <video
        src={src}
        poster={poster}
        aria-label={label}
        controls
        playsInline
        preload="metadata"
        className="mx-auto aspect-[9/16] w-[min(320px,100%)] rounded-[28px] bg-ink object-cover"
      />
    </div>
  );
}

export const caseStudyComponents: MDXComponents = {
  h2: ({ children }) => <h2 className={caseStudySectionTitle}>{children}</h2>,
  p: ({ children }) => <p className={`${caseStudyBodyText} mt-3.5`}>{children}</p>,
  ul: ({ children }) => <ul className="mt-5 flex max-w-[760px] flex-col gap-3 p-0">{children}</ul>,
  li: ({ children }) => (
    <li className="flex gap-3 text-base leading-[1.6] text-ink-2">
      <span aria-hidden="true" className="mt-[3px] text-accent">
        →
      </span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
      {children}
    </a>
  ),
  Figure,
  Screens,
  Gallery,
  Disciplines,
  Discipline,
  Steps,
  Step,
  Principles,
  Principle,
  VideoFeature,
};
