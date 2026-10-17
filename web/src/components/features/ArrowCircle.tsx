/** Round arrow that turns up-right and fills in when its parent `group` is hovered. */
export function ArrowCircle() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-[background-color,color,transform] duration-200 group-hover:-rotate-45 group-hover:bg-ink group-hover:text-white"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </span>
  );
}
