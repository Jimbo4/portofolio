"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/types";
import { CaseStudyCard } from "./CaseStudyCard";

/** Three copies of the list: the user always scrolls inside the middle one. */
const COPIES = 3;
const DRAG_THRESHOLD_PX = 6;

export function WorksCarousel({ works }: { works: Work[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDown: false, startX: 0, startScroll: 0, didDrag: false });
  const [isDragging, setIsDragging] = useState(false);

  /** Distance between the same card in two consecutive copies. */
  const getLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const firstOfNextCopy = track.children[works.length] as HTMLElement | undefined;
    if (!first || !firstOfNextCopy) return 0;
    return firstOfNextCopy.offsetLeft - first.offsetLeft;
  }, [works.length]);

  // Start in the middle copy, and stay there when the viewport resizes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const centerOnMiddleCopy = () => {
      track.scrollLeft = getLoopWidth();
    };
    centerOnMiddleCopy();
    const observer = new ResizeObserver(centerOnMiddleCopy);
    observer.observe(track);
    return () => observer.disconnect();
  }, [getLoopWidth]);

  // Teleport by one copy when drifting into the outer copies → seamless loop
  const handleScroll = () => {
    const track = trackRef.current;
    const loopWidth = getLoopWidth();
    if (!track || loopWidth === 0) return;

    let shift = 0;
    if (track.scrollLeft < loopWidth * 0.5) shift = loopWidth;
    else if (track.scrollLeft > loopWidth * 1.5) shift = -loopWidth;
    if (shift === 0) return;

    track.scrollLeft += shift;
    // Keep an in-progress mouse drag consistent with the jump
    dragRef.current.startScroll += shift;
  };

  // Mouse drag-to-scroll (touch and trackpads scroll natively)
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !trackRef.current) return;
    dragRef.current = {
      isDown: true,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
      didDrag: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.isDown || !track) return;
    const delta = event.clientX - drag.startX;
    if (!drag.didDrag && Math.abs(delta) > DRAG_THRESHOLD_PX) {
      drag.didDrag = true;
      setIsDragging(true);
    }
    if (drag.didDrag) track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = () => {
    dragRef.current.isDown = false;
    setIsDragging(false);
  };

  // Swallow the click that ends a drag so cards don't navigate
  const handleClickCapture = (event: React.MouseEvent) => {
    if (dragRef.current.didDrag) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.didDrag = false;
    }
  };

  const slides = Array.from({ length: COPIES }, (_, copy) =>
    works.map((work) => ({ work, copy, key: `${copy}-${work.slug}` })),
  ).flat();

  return (
    <div
      ref={trackRef}
      role="region"
      aria-label="Selected works, drag or scroll horizontally"
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={handleClickCapture}
      className={`no-scrollbar relative flex gap-6 overflow-x-auto px-7 pb-7 pt-2 ${
        isDragging ? "cursor-grabbing select-none snap-none" : "cursor-grab snap-x snap-mandatory"
      }`}
    >
      {slides.map(({ work, copy, key }) => (
        <CaseStudyCard key={key} work={work} variant="slide" isClone={copy !== 1} />
      ))}
    </div>
  );
}
