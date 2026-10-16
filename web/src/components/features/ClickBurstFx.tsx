"use client";

import { useEffect, useRef } from "react";

/** Canvas renders at 1/PIXEL_SCALE resolution and is upscaled crisply. Set to 1 for smooth shapes. */
const PIXEL_SCALE = 3;
/** Mostly small shapes, with a 1-in-4 chance of a big one */
const SIZE = { small: [20, 70], big: [110, 260], bigChance: 0.25 } as const;
const LIFE_MS = { min: 1800, max: 2600 };
const POP_MS = 220;
/** More than this many clicks inside the window shows the easter egg */
const RAPID_CLICKS = { count: 10, windowMs: 3000, message: "Slow down, cowboy!" };

/** Base forms in a 64×64 box centered on (32, 32). */
const SHAPES = [
  "M32 8 L58 54 L6 54 Z", // triangle
  "M10 10 H54 V54 H10 Z", // square
  "M6 32 A26 26 0 1 0 58 32 A26 26 0 1 0 6 32 Z", // circle
  "M20 10 L48 32 L33 35 L40 50 L34 53 L27 38 L18 44 Z", // mouse cursor
  "M32 7 L53.65 19.5 L53.65 44.5 L32 57 L10.35 44.5 L10.35 19.5 Z", // hexagon
  "M32 6 C33.6 21.5 42.5 30.4 58 32 C42.5 33.6 33.6 42.5 32 58 C30.4 42.5 21.5 33.6 6 32 C21.5 30.4 30.4 21.5 32 6 Z", // AI sparkle
  "M34 8 L18 36 L30 36 L26 56 L46 28 L34 28 Z", // lightning bolt
  "M32 4 L58 32 L32 60 L6 32 Z", // diamond
  "M32 6 L38.5 24 L58 24.5 L42.5 36.5 L48 55 L32 44 L16 55 L21.5 36.5 L6 24.5 L25.5 24 Z", // star
  "M32 56 C10 40 4 28 12 18 C20 9 30 13 32 22 C34 13 44 9 52 18 C60 28 54 40 32 56 Z", // heart
  "M24 8 H40 V24 H56 V40 H40 V56 H24 V40 H8 V24 H24 Z", // plus
];

interface Floater {
  /** A base form, or a line of text for the rapid-click message */
  shape: { kind: "path"; path: Path2D } | { kind: "text"; text: string; font: string };
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  bornAt: number;
  life: number;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
/** easeOutBack: quick pop with a small overshoot */
const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const pastel = () => `hsl(${Math.round(random(0, 360))}, ${Math.round(random(70, 90))}%, ${Math.round(random(74, 82))}%)`;

/**
 * Each click spawns a random pastel base form of random size that drifts in any
 * direction, spins slowly and fades. Rapid clicking shows a message. Off for reduced motion.
 */
export function ClickBurstFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const paths = SHAPES.map((d) => new Path2D(d));
    const floaters: Floater[] = [];
    const serifFont = getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() || "Georgia";
    let clickTimes: number[] = [];
    let frameId = 0;
    let lastT = performance.now();

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / PIXEL_SCALE);
      canvas.height = Math.ceil(window.innerHeight / PIXEL_SCALE);
      // Draw in CSS pixels; the low-res backing store gives the pixel look
      ctx.setTransform(1 / PIXEL_SCALE, 0, 0, 1 / PIXEL_SCALE, 0, 0);
    };

    const startLoop = (now: number) => {
      if (frameId) return;
      lastT = now;
      frameId = requestAnimationFrame(frame);
    };

    /** Even drift in any direction; big shapes move and spin slower. */
    const drift = (size: number) => {
      const heading = random(0, Math.PI * 2);
      const speed = random(18, 48) * (size > 100 ? 0.6 : 1);
      return { vx: Math.cos(heading) * speed, vy: Math.sin(heading) * speed };
    };

    const spawnShape = (x: number, y: number, now: number) => {
      const [min, max] = Math.random() < SIZE.bigChance ? SIZE.big : SIZE.small;
      const size = random(min, max);
      floaters.push({
        shape: { kind: "path", path: paths[Math.floor(Math.random() * paths.length)] },
        color: pastel(),
        x,
        y,
        ...drift(size),
        angle: random(-0.5, 0.5),
        spin: random(-0.7, 0.7) * (size > 100 ? 0.5 : 1),
        size,
        bornAt: now,
        life: random(LIFE_MS.min, LIFE_MS.max) * (size > 100 ? 1.3 : 1),
      });
    };

    const spawnMessage = (x: number, y: number, now: number) => {
      const font = `italic 800 40px ${serifFont}, Georgia, serif`;
      ctx.font = font;
      // Keep the whole line on screen, even when clicking near an edge
      const half = ctx.measureText(RAPID_CLICKS.message).width / 2 + 16;
      const clampedX = Math.min(Math.max(x, half), Math.max(half, window.innerWidth - half));
      floaters.push({
        shape: { kind: "text", text: RAPID_CLICKS.message, font },
        color: "#E84B2A",
        x: clampedX,
        y: Math.max(48, y - 40),
        ...drift(0),
        angle: random(-0.12, 0.12),
        spin: random(-0.08, 0.08),
        size: 64,
        bornAt: now,
        life: 2600,
      });
    };

    const handleClick = (x: number, y: number) => {
      const now = performance.now();
      spawnShape(x, y, now);
      clickTimes = clickTimes.filter((t) => now - t < RAPID_CLICKS.windowMs);
      clickTimes.push(now);
      if (clickTimes.length > RAPID_CLICKS.count) {
        spawnMessage(x, y, now);
        clickTimes = [];
      }
      startLoop(now);
    };

    // Runs only while shapes are alive
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let alive = 0;
      for (const f of floaters) {
        const age = now - f.bornAt;
        const t = age / f.life;
        if (t >= 1) continue;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.angle += f.spin * dt;

        const pop = easeOutBack(Math.min(1, age / POP_MS));
        const scale = (f.size / 64) * pop * (1 - 0.25 * t);
        ctx.save();
        ctx.globalAlpha = t < 0.35 ? 1 : 1 - (t - 0.35) / 0.65;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.scale(scale, scale);
        ctx.fillStyle = f.color;
        if (f.shape.kind === "path") {
          ctx.translate(-32, -32);
          ctx.fill(f.shape.path);
        } else {
          ctx.font = f.shape.font;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(f.shape.text, 0, 0);
        }
        ctx.restore();
        floaters[alive++] = f;
      }
      floaters.length = alive;
      frameId = alive > 0 ? requestAnimationFrame(frame) : 0;
    };

    const onClick = (event: MouseEvent) => handleClick(event.clientX, event.clientY);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-screen w-screen [image-rendering:pixelated]"
    />
  );
}
