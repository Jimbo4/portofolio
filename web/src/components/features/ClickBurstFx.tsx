"use client";

import { useEffect, useRef } from "react";

/** Grid size: every shape snaps to it for a chunky pixel-art look. */
const PX = 6;
const BASE_COLOR = "#E84B2A";
const HIGHLIGHT = "#F5B841";

const RINGS = [
  { delayMs: 0, radius: 54, lifeMs: 520 },
  { delayMs: 110, radius: 30, lifeMs: 420 },
];
const STARS = { count: 6, minSpeed: 150, maxSpeed: 280, lifeMs: 900 };
const DEBRIS = { count: 22, minSpeed: 60, maxSpeed: 220, lifeMs: 650 };
const GRAVITY = 260;

interface Particle {
  kind: "star" | "debris";
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  life: number;
  color: string;
}

interface Burst {
  x: number;
  y: number;
  bornAt: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const random = (min: number, max: number) => min + Math.random() * (max - min);
const snap = (value: number) => Math.round(value / PX) * PX;

/** Light, base and dark shades of a hex color. */
function shadeVariants(hex: string): string[] {
  const value = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  const mix = (target: number, t: number) =>
    "#" + rgb.map((c) => Math.round(c + (target - c) * t).toString(16).padStart(2, "0")).join("");
  return [mix(255, 0.35), hex, mix(0, 0.3)];
}

/**
 * Pixel-art click burst: a dithered shockwave ring, twinkling "+" sparkles
 * and falling debris, all snapped to a pixel grid. Off for reduced motion.
 */
export function ClickBurstFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const shades = shadeVariants(BASE_COLOR);
    const bursts: Burst[] = [];
    const particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frameId = 0;
    let lastT = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const addParticles = (kind: Particle["kind"], x: number, y: number, now: number) => {
      const config = kind === "star" ? STARS : DEBRIS;
      for (let i = 0; i < config.count; i++) {
        const angle = kind === "star" ? (i / config.count) * Math.PI * 2 + random(-0.3, 0.3) : random(0, Math.PI * 2);
        const speed = random(config.minSpeed, config.maxSpeed);
        particles.push({
          kind,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (kind === "star" ? 40 : 0),
          bornAt: now,
          life: config.lifeMs * random(0.75, 1.15),
          color: kind === "star" ? (Math.random() < 0.5 ? HIGHLIGHT : shades[0]) : shades[Math.floor(Math.random() * 3)],
        });
      }
    };

    const spawn = (x: number, y: number) => {
      const now = performance.now();
      bursts.push({ x, y, bornAt: now });
      addParticles("star", x, y, now);
      addParticles("debris", x, y, now);
      if (!frameId) {
        lastT = now;
        frameId = requestAnimationFrame(frame);
      }
    };

    /** Ring of grid cells; fades out with an ordered (checkerboard) dither. */
    const drawRing = (burst: Burst, now: number): boolean => {
      let isAlive = false;
      for (const ring of RINGS) {
        const t = (now - burst.bornAt - ring.delayMs) / ring.lifeMs;
        if (t < 0) {
          isAlive = true;
          continue;
        }
        if (t >= 1) continue;
        isAlive = true;
        const radius = PX + ring.radius * easeOutCubic(t);
        const steps = Math.max(12, Math.ceil((Math.PI * 2 * radius) / PX));
        const seen = new Set<string>();
        ctx.fillStyle = t < 0.35 ? shades[0] : BASE_COLOR;
        for (let i = 0; i < steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const gx = Math.round((burst.x + Math.cos(angle) * radius) / PX);
          const gy = Math.round((burst.y + Math.sin(angle) * radius) / PX);
          const key = `${gx},${gy}`;
          if (seen.has(key)) continue;
          seen.add(key);
          // Second half of life: drop every other cell for a retro dissolve
          if (t > 0.55 && (gx + gy) % 2 === 0) continue;
          ctx.fillRect(gx * PX, gy * PX, PX, PX);
        }
      }
      return isAlive;
    };

    /** Pixel "+" sparkle whose arms shrink and flicker over its life. */
    const drawStar = (p: Particle, t: number, age: number) => {
      const cx = snap(p.x);
      const cy = snap(p.y);
      const flicker = Math.floor(age / 70) % 2;
      const arm = Math.max(0, Math.round(2 * (1 - t)) + (t < 0.6 ? flicker : 0));
      ctx.fillStyle = p.color;
      ctx.fillRect(cx, cy, PX, PX);
      for (let k = 1; k <= arm; k++) {
        ctx.fillRect(cx + k * PX, cy, PX, PX);
        ctx.fillRect(cx - k * PX, cy, PX, PX);
        ctx.fillRect(cx, cy + k * PX, PX, PX);
        ctx.fillRect(cx, cy - k * PX, PX, PX);
      }
    };

    // Runs only while something is alive
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalAlpha = 1;
      let aliveBursts = 0;
      for (const burst of bursts) {
        if (drawRing(burst, now)) bursts[aliveBursts++] = burst;
      }
      bursts.length = aliveBursts;

      let aliveParticles = 0;
      for (const p of particles) {
        const age = now - p.bornAt;
        const t = age / p.life;
        if (t >= 1) continue;
        const drag = p.kind === "star" ? 3 : 1.2;
        p.vx *= 1 - drag * dt;
        p.vy = p.vy * (1 - drag * dt) + GRAVITY * dt * (p.kind === "star" ? 0.4 : 1);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        if (p.kind === "star") {
          drawStar(p, t, age);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(snap(p.x), snap(p.y), PX, PX);
        }
        particles[aliveParticles++] = p;
      }
      particles.length = aliveParticles;
      ctx.globalAlpha = 1;

      frameId = aliveBursts > 0 || aliveParticles > 0 ? requestAnimationFrame(frame) : 0;
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
