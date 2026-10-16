"use client";

import { useEffect, useRef } from "react";

/** Canvas renders at 1/PIXEL_SCALE resolution and is upscaled crisply. Set to 1 for smooth shapes. */
const PIXEL_SCALE = 3;
const SIZE = { min: 30, max: 46 };
const LIFE_MS = { min: 1800, max: 2600 };
const POP_MS = 220;

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
  path: Path2D;
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

/** Each click spawns a random pastel base form that drifts, spins slowly and fades. Off for reduced motion. */
export function ClickBurstFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const paths = SHAPES.map((d) => new Path2D(d));
    const floaters: Floater[] = [];
    let frameId = 0;
    let lastT = performance.now();

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / PIXEL_SCALE);
      canvas.height = Math.ceil(window.innerHeight / PIXEL_SCALE);
      // Draw in CSS pixels; the low-res backing store gives the pixel look
      ctx.setTransform(1 / PIXEL_SCALE, 0, 0, 1 / PIXEL_SCALE, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      const now = performance.now();
      const heading = random(0, Math.PI * 2);
      const speed = random(14, 34);
      floaters.push({
        path: paths[Math.floor(Math.random() * paths.length)],
        color: pastel(),
        x,
        y,
        vx: Math.cos(heading) * speed,
        // Gentle upward bias, like a released balloon
        vy: Math.sin(heading) * speed - 22,
        angle: random(-0.5, 0.5),
        spin: random(-0.7, 0.7),
        size: random(SIZE.min, SIZE.max),
        bornAt: now,
        life: random(LIFE_MS.min, LIFE_MS.max),
      });
      if (!frameId) {
        lastT = now;
        frameId = requestAnimationFrame(frame);
      }
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
        ctx.translate(-32, -32);
        ctx.fillStyle = f.color;
        ctx.fill(f.path);
        ctx.restore();
        floaters[alive++] = f;
      }
      floaters.length = alive;
      frameId = alive > 0 ? requestAnimationFrame(frame) : 0;
    };

    const onClick = (event: MouseEvent) => spawn(event.clientX, event.clientY);

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
