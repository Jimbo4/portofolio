"use client";

import { useEffect, useRef } from "react";

/** Defaults tuned in the Claude Design tweaks panel. */
const FX = {
  color: "#E84B2A",
  pixelSize: 8,
  particleCount: 60,
  spread: 180,
  lifeMs: 700,
  gravity: 0.25,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  life: number;
  color: string;
  size: number;
}

/** Light, base and dark shades of a hex color for pixel-art variety. */
function shadeVariants(hex: string): string[] {
  const value = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  const mix = (target: number, t: number) =>
    "#" + rgb.map((c) => Math.round(c + (target - c) * t).toString(16).padStart(2, "0")).join("");
  return [mix(255, 0.35), hex, mix(0, 0.35)];
}

/** Pixelated particle burst on every click. Disabled for reduced motion. */
export function PixelClickFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const palette = shadeVariants(FX.color);
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

    const spawn = (x: number, y: number) => {
      const now = performance.now();
      const jitter = FX.pixelSize * 0.5;
      for (let i = 0; i < FX.particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.3 + Math.random() * 0.7) * FX.spread;
        particles.push({
          x: x + (Math.random() * 2 - 1) * jitter,
          y: y + (Math.random() * 2 - 1) * jitter,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          bornAt: now,
          life: FX.lifeMs * (0.7 + Math.random() * 0.6),
          color: palette[Math.floor(Math.random() * palette.length)],
          size: FX.pixelSize * (Math.random() < 0.2 ? 0.5 : 1),
        });
      }
      if (!frameId) {
        lastT = now;
        frameId = requestAnimationFrame(frame);
      }
    };

    // Runs only while particles are alive
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const gravity = FX.gravity * 600;
      let alive = 0;
      for (const p of particles) {
        const age = now - p.bornAt;
        if (age >= p.life) continue;
        p.vy += gravity * dt;
        p.vx *= 1 - 0.9 * dt;
        p.vy *= 1 - 0.4 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.max(0, 1 - age / p.life);
        ctx.fillStyle = p.color;
        // Snap to the pixel grid for a chunky look
        ctx.fillRect(
          Math.round(p.x / FX.pixelSize) * FX.pixelSize,
          Math.round(p.y / FX.pixelSize) * FX.pixelSize,
          p.size,
          p.size,
        );
        particles[alive++] = p;
      }
      particles.length = alive;
      ctx.globalAlpha = 1;
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
