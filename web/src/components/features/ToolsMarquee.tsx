import * as simpleIcons from "simple-icons";
import type { Tool } from "@/types";

type SimpleIcon = { title: string; path: string };

function getBrandIcon(name: string | undefined): SimpleIcon | undefined {
  if (!name || !(name in simpleIcons)) return undefined;
  return simpleIcons[name as keyof typeof simpleIcons] as SimpleIcon;
}

function ToolTile({ tool, isClone }: { tool: Tool; isClone: boolean }) {
  const brandIcon = getBrandIcon(tool.icon);
  return (
    <li
      aria-hidden={isClone || undefined}
      title={tool.name}
      className={`relative flex size-14 shrink-0 items-center justify-center rounded-[14px] shadow-[0_6px_14px_rgba(0,0,0,.18)] ${tool.tileClass}`}
    >
      {brandIcon ? (
        <svg role="img" viewBox="0 0 24 24" className="size-[26px]" aria-label={isClone ? undefined : tool.name}>
          <path d={brandIcon.path} />
        </svg>
      ) : (
        <span className="font-serif text-xl font-bold tracking-[-0.04em]">
          <span className="sr-only">{tool.name}</span>
          <span aria-hidden="true">{tool.letters}</span>
        </span>
      )}
    </li>
  );
}

/** Infinite tools strip: the list is rendered twice and shifted by -50%. */
export function ToolsMarquee({ tools }: { tools: Tool[] }) {
  return (
    <div className="marquee-fade mt-10 overflow-hidden" aria-label="Tools and software">
      <ul className="flex w-max animate-marquee gap-3.5 py-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[false, true].map((isClone) =>
          tools.map((tool) => <ToolTile key={`${isClone}-${tool.name}`} tool={tool} isClone={isClone} />),
        )}
      </ul>
    </div>
  );
}
