import * as simpleIcons from "simple-icons";
import { customIcons } from "@/lib/customIcons";
import type { CustomIcon, Tool } from "@/types";

type SimpleIcon = { title: string; path: string };

function getIcon(name: string): CustomIcon | undefined {
  if (name in customIcons) return customIcons[name];
  if (!(name in simpleIcons)) return undefined;
  const icon = simpleIcons[name as keyof typeof simpleIcons] as SimpleIcon;
  return { viewBox: "0 0 24 24", path: icon.path };
}

function ToolTile({ tool, isClone }: { tool: Tool; isClone: boolean }) {
  const icon = getIcon(tool.icon);
  if (!icon) return null;
  return (
    <li
      aria-hidden={isClone || undefined}
      title={tool.name}
      className={`relative flex size-14 shrink-0 items-center justify-center rounded-[14px] shadow-[0_6px_14px_rgba(0,0,0,.18)] ${tool.tileClass}`}
    >
      <svg role="img" viewBox={icon.viewBox} className="size-[26px]" aria-label={isClone ? undefined : tool.name}>
        <path fillRule={icon.isEvenOdd ? "evenodd" : undefined} d={icon.path} />
      </svg>
    </li>
  );
}

/** Infinite tools strip: the list is rendered twice and shifted by -50%. It holds still under the mouse. */
export function ToolsMarquee({ tools }: { tools: Tool[] }) {
  return (
    <div className="marquee-fade mt-10 overflow-hidden">
      <ul aria-label="Tools and software" className="flex w-max animate-marquee gap-3.5 py-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[false, true].map((isClone) =>
          tools.map((tool) => <ToolTile key={`${isClone}-${tool.name}`} tool={tool} isClone={isClone} />),
        )}
      </ul>
    </div>
  );
}
