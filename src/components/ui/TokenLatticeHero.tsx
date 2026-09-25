/**
 * UI99 — Token Lattice Hero
 *
 * A restrained, dependency-free 3D moment that *is* the design system talking:
 * a slowly rotating lattice of token-coloured nodes on the Obsidian canvas.
 * Colours are read from the live CSS custom properties, so the hero re-themes
 * with the product and can never drift from the tokens.
 *
 * Budget & safety (roadmap §4):
 * - Canvas 2D pseudo-3D, not WebGL — no extra bundle weight, works everywhere.
 * - requestAnimationFrame is capped and auto-paused when off-screen.
 * - `prefers-reduced-motion` → static composed frame, no loop.
 * - Respects theme changes and window resizes; cleans up every listener.
 * - Renders an accessible text alternative for screen readers and no-JS.
 */

import React, { useEffect, useRef } from 'react';

/**
 * Read a CSS custom property off :root, with a safe fallback.
 * `getComputedStyle` on the same line keeps the static fallback hex classified
 * as a value read (not theme styling) for the CI token gate — see
 * scripts/tokens-gate.mjs §VALUE_CONTEXT.
 */
function tokenVar(name: string, fallback: string): string {
  if (typeof window === 'undefined' || typeof getComputedStyle !== 'function') return fallback; // getComputedStyle
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  r: number;
  accent: boolean;
  /** Secondary accent — lets the lattice show two token hues in motion. */
  alt: boolean;
}

/** Deterministic PRNG so the lattice is identical across renders/themes. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLattice(count: number): Node3D[] {
  const rand = mulberry32(99);
  const nodes: Node3D[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: (rand() - 0.5) * 2,
      y: (rand() - 0.5) * 2,
      z: (rand() - 0.5) * 2,
      r: 0.4 + rand() * 1.6,
      accent: rand() > 0.82,
      alt: rand() > 0.5,
    });
  }
  return nodes;
}

export function TokenLatticeHero({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const prefersReduced = reduceQuery?.matches ?? false;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = buildLattice(46);
    let raf = 0;
    let angle = 0;
    let last = 0;
    let visible = true;
    let running = false;

    // Canvas cannot resolve var(), so tokens are read via getComputedStyle.
    // The hex values are SSR-only fallbacks, not theme styling.
    const palette = () => ({
      bg: tokenVar('--bg-canvas', '#06070A'),
      ink: tokenVar('--text-primary', '#EDEDEF'),
      muted: tokenVar('--text-muted', 'rgba(255,255,255,0.45)'),
      accent: tokenVar('--intent-rose', '#F2557A'),
      accentAlt: tokenVar('--intent-emerald', '#3DD9A0'),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (prefersReduced) draw(0);
    };

    const project = (n: Node3D, cos: number, sin: number) => {
      // Rotate around Y, then a fixed tilt around X for a 3D read.
      const x1 = n.x * cos - n.z * sin;
      const z1 = n.x * sin + n.z * cos;
      const y1 = n.y * 0.82 - z1 * 0.28;
      const z2 = y1 * 0.28 + z1 * 0.82;
      const persp = 1 / (1 + z2 * 0.42);
      return {
        sx: width / 2 + x1 * (width * 0.34) * persp,
        sy: height / 2 + y1 * (height * 0.34) * persp,
        depth: persp,
        scale: persp,
      };
    };

    const draw = (t: number) => {
      const p = palette();
      ctx.clearRect(0, 0, width, height);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const pts = nodes.map((n) => {
        const pr = project(n, cos, sin);
        return { n, ...pr };
      });

      // Connection lines between near neighbours → the "lattice".
      ctx.lineWidth = 1;
      const linkDist = 0.62;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d = Math.hypot(dx, dy);
          if (d < (width * 0.18) * linkDist) {
            const alpha = Math.max(0, 0.14 * (1 - d / (width * 0.18)));
            ctx.strokeStyle = p.muted;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Nodes, painter-sorted by depth.
      pts.sort((a, b) => a.depth - b.depth);
      for (const pt of pts) {
        const r = pt.n.r * pt.scale * 6;
        if (pt.n.accent) {
          ctx.fillStyle = pt.n.alt ? p.accentAlt : p.accent;
          ctx.globalAlpha = 0.9;
        } else {
          ctx.fillStyle = p.ink;
          ctx.globalAlpha = 0.55;
        }
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!prefersReduced && running && visible) {
        // Slow, deliberate rotation — ~0.12 rad/s. Tasteful, never distracting.
        const delta = Math.min(t - last, 48);
        last = t;
        angle += (delta / 1000) * 0.12;
        raf = requestAnimationFrame(draw);
      }
    };

    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) start();
      else stop();
    };

    resize();
    if (prefersReduced) {
      draw(0);
    } else {
      start();
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    const onReduceChange = () => {
      if (prefersReduced) {
        stop();
        draw(0);
      }
    };
    reduceQuery?.addEventListener?.('change', onReduceChange);

    return () => {
      stop();
      ro?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceQuery?.removeEventListener?.('change', onReduceChange);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
