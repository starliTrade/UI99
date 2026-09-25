#!/usr/bin/env node
/**
 * UI99 — Elevation/Radius Codemod
 *
 * Migrates hand-written arbitrary `shadow-[…]` / `rounded-[Npx]` / `blur-[Npx]`
 * utilities onto the structural token scale introduced in
 * `src/styles/ui99-elevation.css`.
 *
 * Why: 145 unique shadow values across 64 files meant elevation had been
 * decided 145 times and never compared. Tokens make the decision once, per
 * level, and the CI gate keeps it that way.
 *
 * Safety: dry-run by default. Pass --write to apply. Never touches
 * src/styles/** or the token source of truth.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const WRITE = process.argv.includes('--write');
const ROOT = resolve(process.cwd(), 'src/components');

/**
 * Shadow vocabulary. `inset ...` + drop shadow pairs are classified by the
 * drop shadow's blur/spread so the mapping stays principled rather than
 * eyeballed. Rim-only (inset, no drop) maps to the rim family directly.
 */
const SHADOW_RULES = [
  // ── Self-tinting glow (chart marks, status dots) ──
  { test: /^0 0 8px currentColor$/, to: 'var(--glow-current-sm)' },
  { test: /^0 0 1[0-9]px currentColor$/, to: 'var(--glow-current-md)' },
  { test: /^0 0 2[0-9]px currentColor$/, to: 'var(--glow-current-lg)' },

  // ── Accent bar (status rail on a row edge) ──
  { test: /^inset 2px 0 0 0 #10B981$/, to: 'var(--accent-bar)' },
  { test: /^inset 2px 0 0 0 #F43F5E$/, to: 'var(--accent-bar-rose)' },
  { test: /^inset 2px 0 0 0 #F59E0B$/, to: 'var(--accent-bar-warning)' },
  { test: /^inset 0 2px 0 0 #10B981$/, to: 'var(--accent-bar-top)' },

  // ── Accent glows (0 0 Npx rgba(...)) — these are aura, not elevation ──
  { test: /inset.*\b0 0 \d+px/, to: null },
  { test: /^0 0 \d+px rgba\((\d+),(\d+),(\d+)/, to: 'GLOW' },
  { test: /(^|,)0 0 \d+px rgba\((\d+),(\d+),(\d+)/, to: 'GLOW' },

  // ── Rim-only shadows (no drop shadow) → rim family ──
  { test: /^inset 0 1px 0 0 rgba\(255, ?255, ?255, ?1\)$/, to: 'var(--rim-soft)' },
  { test: /^inset 0 1px 1px 0 rgba\(0, ?0, ?0, ?0?\.0?4\)$/, to: 'var(--rim-subtle)' },
  { test: /^inset 0 1px 0 0 rgba\(255, ?255, ?255, ?0?\.0?5\)$/, to: 'var(--rim-soft)' },
  {
    test: /^inset 0 1px 0 0 rgba\(255, ?255, ?255, ?0?\.0?8\)$/,
    to: 'var(--rim-strong)',
  },
  {
    test: /^inset 0 1px 0\.5px 0 rgba\(255, ?255, ?255, ?0?\.04\)$/,
    to: 'var(--rim-soft)',
  },
  // rim + elevation composites
  {
    test: /inset 0 1px 0 0 rgba\(255, ?255, ?255, ?0?\.(0[2-9])\).*0_(1[0-9]|[2-9])px/,
    to: 'var(--shadow-card)',
  },
  {
    test: /inset 0 1px 0 0 rgba\(255, ?255, ?255, ?0?\.(0[5-9])\).*0_[2-4][0-9]px/,
    to: 'var(--shadow-card-hover)',
  },
  {
    test: /inset.*0_(2[0-9]|[3-9][0-9])px_?[0-9]*px/,
    to: 'var(--shadow-popover)',
  },
  // bare drop shadows by blur magnitude
  { test: /^0 [1-4]px [0-9]+px rgba\(0, ?0, ?0, ?0?\.[0-9]+\)$/, to: 'var(--elevation-1)' },
  { test: /^0 [4-9]px [0-9]+px rgba\(0, ?0, ?0, ?0?\.[0-9]+\)$/, to: 'var(--elevation-2)' },
  {
    test: /^0 1[0-9]px [0-9]+px rgba\(0, ?0, ?0, ?0?\.[0-9]+\)/,
    to: 'var(--elevation-3)',
  },
  {
    test: /^0 [2-4][0-9]px [0-9]+px rgba\(0, ?0, ?0, ?0?\.[0-9]+/,
    to: 'var(--elevation-4)',
  },
  {
    test: /0 [3-9][0-9]px [0-9]+px rgba\(0, ?0, ?0, ?0?\.[0-9]+/,
    to: 'var(--elevation-5)',
  },
  // light-theme ink-tinted shadows
  { test: /rgba\(23, ?22, ?40/, to: null }, // handled per-theme below
];

/**
 * Composite shadows (a coloured aura riding on a dark drop shadow, or a rim
 * riding on a lift) decompose into TWO tokens. Tailwind v4 accepts multiple
 * `shadow-()` values, so the replacement is a comma-joined token list.
 */
const COMPOSITE_RULES = [
  // glow + lift, e.g. "0 20px 48px rgba(16,185,129,0.15)"
  { test: /0 [\d]+px [\d]+px(?: -\d+px)? rgba\(\d+,\d+,\d+/, to: 'ELEVATION_THEN_GLOW' },
  // lift + rim, e.g. "0 24px 60px rgba(0,0,0,.85), inset 0 1px 0 0 rgba(255,..)"
  { test: /inset 0 1px 0 0 rgba\(255, ?255, ?255, ?0?\.\d+\),? ?$/, to: 'LIFT' },
  // white highlight layers (used on light buttons/inputs)
  { test: /0 2px 10px rgba\(255, ?255, ?255/, to: 'LIFT' },
  // ANY pure-black drop shadow, with or without a negative spread
  { test: /0 \d+px \d+px(?: -?\d+px)? ?rgba\(0, ?0, ?0, ?0?\.\d+\)$/, to: 'LIFT' },
  { test: /0 \d+px \d+px(?: -?\d+px)? ?rgba\(0, ?0, ?0, ?0?\.\d+\),? ?0 \d+px \d+px(?: -?\d+px)? ?rgba\(0, ?0, ?0, ?0?\.\d+\)$/, to: 'LIFT' },
  // dark shadows that are not pure black (rgba(0,0,0,…) is covered above)
  { test: /0 \d+px \d+px(?: -?\d+px)? ?rgba\(\d+, ?\d+, ?\d+, ?0?\.\d+\)$/, to: 'LIFT' },
];

/** Map a pure black/ink drop shadow to its elevation level by radius. */
function elevationToken(normalized) {
  // The first non-inset shadow is the lift.
  const lift = normalized.split(',').find((s) => /^\s*0 /.test(s)) ?? normalized;
  const blur = lift.match(/0 \d+px (\d+)px/);
  const y = lift.match(/0 (\d+)px/);
  const yOff = y ? +y[1] : 0;
  const blurPx = blur ? +blur[1] : 0;

  if (blurPx <= 3) return 'var(--elevation-1)';
  if (yOff <= 8) return 'var(--elevation-2)';
  if (blurPx <= 40) return 'var(--elevation-3)';
  if (blurPx <= 60) return 'var(--elevation-4)';
  return 'var(--elevation-5)';
}

/** True when the value carries an inset rim. */
function hasRim(normalized) {
  return /inset 0 1px 0 0 rgba\(255/.test(normalized);
}

/** Radius values that have no token today → nearest named step. */
const RADIUS_MAP = {
  '3px': 'var(--radius-xs)',
  '7px': 'var(--radius-xs)',
  '10px': 'var(--radius-sm)',
  '20px': 'var(--radius-control)',
  '22px': 'var(--radius-control)',
  '26px': 'var(--radius-xl)',
  '30px': 'var(--radius-2xl)',
  '32px': 'var(--radius-sheet)',
  '34px': 'var(--radius-2xl)',
  '28px': 'var(--radius-xl)',
  '24px': 'var(--radius-lg)',
  '18px': 'var(--radius-md)',
  '12px': 'var(--radius-sm)',
};

/** Blur values → the 4-step ramp. */const BLUR_MAP = {
  '2px': 'var(--blur-sm)',
  '8px': 'var(--blur-sm)',
  '16px': 'var(--blur-lg)',
  '20px': 'var(--blur-lg)',
  '40px': 'var(--blur-lg)',
  '90px': 'var(--blur-ambient)',
  '100px': 'var(--blur-ambient)',
  '150px': 'var(--blur-ambient)',
  '160px': 'var(--blur-ambient)',
  '180px': 'var(--blur-ambient)',
  '200px': 'var(--blur-ambient)',
};

/**
 * Map a coloured glow onto the closest token. The audit found 18 raw hues for
 * what should be 5 semantic accents, so hues are bucketed by proximity rather
 * than enumerated — new hexes land in a sensible bucket automatically.
 */
const GLOW_HUES = {  emerald: [16, 185, 129],
  rose: [244, 63, 94],
  warning: [245, 158, 11],
  orange: [249, 115, 22],
  cyan: [34, 211, 238],
  violet: [168, 85, 247],
  blue: [59, 130, 246],
  lime: [163, 230, 53],
  indigo: [129, 140, 248],
  pink: [236, 72, 153],
  fuchsia: [217, 70, 239],
  purple: [192, 132, 252],
};

/** Which semantic token each raw hue collapses to. */
const GLOW_ALIAS = {
  emerald: 'accent',
  rose: 'rose',
  warning: 'warning',
  orange: 'warning',
  cyan: 'accent',
  violet: 'accent',
  blue: 'accent',
  lime: 'accent',
  indigo: 'accent',
  pink: 'rose',
  fuchsia: 'rose',
  purple: 'accent',
};

function nearestHue(rgb) {
  let best = null;
  let bestDist = Infinity;
  for (const [name, ref] of Object.entries(GLOW_HUES)) {
    const d =
      (rgb[0] - ref[0]) ** 2 + (rgb[1] - ref[1]) ** 2 + (rgb[2] - ref[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = name;
    }
  }
  return best;
}

/** Extract the first rgb triple and pick a level — only for true zero-blur auras. */
function glowToken(normalized) {
  // Strip inset fragments; then require the REMAINDER to be a bare `0 0 Npx`.
  const parts = normalized
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter((s) => !s.startsWith('inset'));
  if (parts.length !== 1) return null;

  const only = parts[0];
  const shape = only.match(/^0 0 (\d+)px\s+(.+)$/);
  if (!shape) return null;

  const m = shape[2].match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;

  // Near-white / near-grey / pure black are NOT accent hues — a white
  // highlight shadow stays an elevation, never a coloured glow.
  const rgb = [+m[1], +m[2], +m[3]];
  const max = Math.max(...rgb);
  const min = Math.min(...rgb);
  if (max < 30) return null; // pure black
  if (min > 240) return null; // white
  if (max - min < 20) return null; // near-grey

  const hue = nearestHue(rgb);
  const alias = GLOW_ALIAS[hue] ?? 'accent';
  const radius = +shape[1];
  const level = radius <= 8 ? 'sm' : radius <= 12 ? 'md' : 'lg';
  return `var(--glow-${alias}-${level})`;
}

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return extname(p) === '.tsx' || extname(p) === '.ts' ? [p] : [];
  });
}

let changedFiles = 0;
let totalEdits = 0;
const unmapped = new Set();

for (const file of files(ROOT)) {
  const src = readFileSync(file, 'utf8');
  let out = src;
  let edits = 0;

  // shadow-[…] → shadow-(--token)
  out = out.replace(/shadow-\[([^\]]+)\]/g, (full, body) => {
    const normalized = body.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    for (const rule of SHADOW_RULES) {
      if (rule.to === null || rule.to === 'GLOW') continue;
      if (!rule.test.test(normalized)) continue;
      edits++;
      return `shadow-(${rule.to})`;
    }

    // Glow is a resolver, not a regex: a value only counts as an aura when it
    // is entirely `0 0 Npx rgba(…)` with a saturated hue. Anything with an
    // offset or blur falls through to the composite/elevation handling.
    const glow = glowToken(normalized);
    if (glow) {
      edits++;
      return `shadow-(${glow})`;
    }
    // composite: decompose into a token list
    for (const rule of COMPOSITE_RULES) {
      if (!rule.test.test(normalized)) continue;

      if (rule.to === 'LIFT') {
        const parts = [];
        if (hasRim(normalized)) parts.push('var(--rim-soft)');
        parts.push(elevationToken(normalized));
        edits++;
        return `shadow-(${parts.join(', ')})`;
      }

      if (rule.to === 'ELEVATION_THEN_GLOW') {
        const g = glowToken(normalized);
        const lift = elevationToken(normalized);
        if (g && lift) {
          edits++;
          return `shadow-(${lift}, ${g})`;
        }
        continue;
      }
    }

    unmapped.add(normalized.slice(0, 70));
    return full;
  });

  // rounded-[Npx] → rounded-(--token)
  out = out.replace(/rounded-\[(\d+(?:\.\d+)?px)\]/g, (full, val) => {
    const token = RADIUS_MAP[val];
    if (token) {
      edits++;
      return `rounded-(${token})`;
    }
    unmapped.add(`rounded:${val}`);
    return full;
  });

  // blur-[Npx] → blur-(--token)
  out = out.replace(/blur-\[(\d+(?:\.\d+)?px)\]/g, (full, val) => {
    const token = BLUR_MAP[val];
    if (token) {
      edits++;
      return `blur-(${token})`;
    }
    unmapped.add(`blur:${val}`);
    return full;
  });

  if (out !== src) {
    changedFiles++;
    totalEdits += edits;
    if (WRITE) writeFileSync(file, out, 'utf8');
  }
}

console.log(
  `${WRITE ? '✔ migrated' : '· would migrate'}: ${totalEdits} value(s) across ${changedFiles} file(s)`,
);
if (unmapped.size) {
  console.log(`\n⚠ ${unmapped.size} value(s) need a human decision (left untouched):`);
  for (const v of [...unmapped].sort()) console.log(`  - ${v}`);
}
if (!WRITE && totalEdits) {
  console.log('\nRun with --write to apply.');
}
