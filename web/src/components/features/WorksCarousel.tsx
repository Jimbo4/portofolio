"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/types";
import { CaseStudyCard } from "./CaseStudyCard";

/** Three copies of the list: the user always scrolls inside the middle one. */
const COPIES = 3;
const DRAG_THRESHOLD_PX = 6;
/** Velocity kept per 16ms frame while gliding after a drag */
const FRICTION = 0.95;
/** Below this speed (px/ms) the glide stops */
const MIN_VELOCITY = 0.02;
/** Idle drift: one card every 10 seconds */
const MS_PER_CARD = 10_000;
/** The drift waits this long after the last touch, drag, wheel or key press */
const RESUME_DELAY_MS = 5000;
/** After a pause the drift eases back to full speed over this time */
const EASE_IN_MS = 2500;
/** A scroll position further than this from the drift's own means the user moved the track */
const USER_SCROLL_TOLERANCE_PX = 2;

export function WorksCarousel({ works }: { works: Work[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDown: false, startX: 0, startScroll: 0, didDrag: false, lastX: 0, lastT: 0, velocity: 0 });
  const glideFrameRef = useRef(0);
  // Fractional drift position, card pitch in px, the time of the last user interaction and whether a mouse is over the track
  const autoRef = useRef({ pos: 0, pitch: 0, lastInteraction: -Infinity, isVisible: false, isHovered: false });
  const [isDragging, setIsDragging] = useState(false);

  const markInteraction = () => {
    autoRef.current.lastInteraction = performance.now();
    trackRef.current?.style.setProperty("--drift", "0px");
  };

  /** Distance between the same card in two consecutive copies. */
  const getLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const firstOfNextCopy = track.children[works.length] as HTMLElement | undefined;
    if (!first || !firstOfNextCopy) return 0;
    return firstOfNextCopy.offsetLeft - first.offsetLeft;
  }, [works.length]);

  const stopGlide = () => {
    cancelAnimationFrame(glideFrameRef.current);
    glideFrameRef.current = 0;
  };

  // Start in the middle copy, and keep the same card in view when the card width changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let lastLoopWidth = 0;
    const centerOnMiddleCopy = () => {
      const loopWidth = getLoopWidth();
      // Height-only changes (fonts loading, mobile address bar) must not move the track
      if (loopWidth === 0 || loopWidth === lastLoopWidth) return;
      const offsetInLoop = lastLoopWidth ? ((track.scrollLeft % lastLoopWidth) / lastLoopWidth) * loopWidth : 0;
      lastLoopWidth = loopWidth;
      track.scrollLeft = loopWidth + offsetInLoop;
      autoRef.current.pos = track.scrollLeft;
      autoRef.current.pitch = loopWidth / works.length;
    };
    centerOnMiddleCopy();
    const observer = new ResizeObserver(centerOnMiddleCopy);
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(glideFrameRef.current);
    };
  }, [getLoopWidth, works.length]);

  // Idle drift: advance very slowly while the track is on screen and nobody has touched it for a while.
  // scrollLeft only takes whole pixels, so the fraction moves the track with a GPU transform instead.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visibility = new IntersectionObserver(([entry]) => {
      autoRef.current.isVisible = entry.isIntersecting;
    });
    visibility.observe(track);

    let frame = 0;
    let lastT = performance.now();
    const step = (now: number) => {
      const auto = autoRef.current;
      const dt = Math.min(now - lastT, 50); // no jump after a background tab
      lastT = now;
      const sinceResume = now - auto.lastInteraction - RESUME_DELAY_MS;
      const isIdle =
        auto.isVisible &&
        !auto.isHovered && // a mouse over the cards holds them still
        sinceResume > 0 &&
        auto.pitch > 0 &&
        !dragRef.current.isDown &&
        glideFrameRef.current === 0 &&
        !track.querySelector(":focus-visible"); // keyboard users keep the focused card in place
      if (isIdle) {
        const t = Math.min(1, sinceResume / EASE_IN_MS);
        const ease = t * t * (3 - 2 * t);
        auto.pos += (auto.pitch / MS_PER_CARD) * ease * dt;
        const whole = Math.floor(auto.pos);
        if (track.scrollLeft !== whole) track.scrollLeft = whole;
        track.style.setProperty("--drift", `${(whole - auto.pos).toFixed(3)}px`);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
    };
  }, []);

  // Teleport by one copy when drifting into the outer copies → seamless loop
  const handleScroll = () => {
    const track = trackRef.current;
    const loopWidth = getLoopWidth();
    if (!track || loopWidth === 0) return;
    const auto = autoRef.current;

    // Native scrolling (touch, trackpad, momentum) moved the track: pause the drift and follow it
    if (Math.abs(track.scrollLeft - Math.floor(auto.pos)) > USER_SCROLL_TOLERANCE_PX) {
      markInteraction();
      auto.pos = track.scrollLeft;
    }

    let shift = 0;
    if (track.scrollLeft < loopWidth * 0.5) shift = loopWidth;
    else if (track.scrollLeft > loopWidth * 1.5) shift = -loopWidth;
    if (shift === 0) return;

    track.scrollLeft += shift;
    auto.pos += shift;
    // Keep an in-progress mouse drag consistent with the jump
    dragRef.current.startScroll += shift;
  };

  // Mouse drag-to-scroll with momentum (touch and trackpads scroll natively)
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    markInteraction();
    if (event.pointerType !== "mouse" || !trackRef.current) return;
    stopGlide();
    dragRef.current = {
      isDown: true,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
      didDrag: false,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
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
    if (!drag.didDrag) return;
    track.scrollLeft = drag.startScroll - delta;

    // Smoothed pointer velocity in px/ms, scroll direction
    const dt = event.timeStamp - drag.lastT;
    if (dt > 0) {
      const instant = -(event.clientX - drag.lastX) / dt;
      drag.velocity = drag.velocity * 0.6 + instant * 0.4;
    }
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;
  };

  const glide = (velocity: number) => {
    let v = velocity;
    let lastT = performance.now();
    const step = (now: number) => {
      const track = trackRef.current;
      if (!track) return;
      const dt = now - lastT;
      lastT = now;
      track.scrollLeft += v * dt;
      v *= Math.pow(FRICTION, dt / 16);
      if (Math.abs(v) > MIN_VELOCITY) {
        glideFrameRef.current = requestAnimationFrame(step);
      } else {
        glideFrameRef.current = 0;
        markInteraction(); // the 5 second pause starts when the glide settles
      }
    };
    glideFrameRef.current = requestAnimationFrame(step);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.isDown) return;
    drag.isDown = false;
    setIsDragging(false);
    markInteraction();
    // A pause before release means the user stopped: no glide
    const isFresh = event.timeStamp - drag.lastT < 80;
    if (drag.didDrag && isFresh && Math.abs(drag.velocity) > MIN_VELOCITY) glide(drag.velocity);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") autoRef.current.isHovered = true;
  };

  // Leaving with the mouse ends a drag and lets the drift ease back in right away
  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event);
    const auto = autoRef.current;
    if (event.pointerType !== "mouse" || !auto.isHovered) return;
    auto.isHovered = false;
    auto.lastInteraction = Math.min(auto.lastInteraction, performance.now() - RESUME_DELAY_MS);
  };

  const handleWheel = () => {
    stopGlide();
    markInteraction();
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      onTouchStart={markInteraction}
      onKeyDown={markInteraction}
      onClickCapture={handleClickCapture}
      className={`no-scrollbar relative flex gap-6 overflow-x-auto px-7 pb-7 pt-2 [transform:translate3d(var(--drift,0px),0,0)] will-change-transform ${
        isDragging ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      {slides.map(({ work, copy, key }) => (
        <CaseStudyCard key={key} work={work} variant="slide" isClone={copy !== 1} />
      ))}
    </div>
  );
}
