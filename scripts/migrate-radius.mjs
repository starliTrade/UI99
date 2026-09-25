#!/usr/bin/env node
/**
 * UI99 — Radius Codemod (named Tailwind scale → tokens)
 *
 * The elevation codemod only removed *arbitrary* radii. The audit showed the
 * kit's real radius usage was Tailwind's named scale — 787 occurrences of
 * `rounded-2xl` / `rounded-3xl` / `rounded-full` — which slipped straight past
 * that rule and made the whole product read as over-rounded.
 *
 * This maps the named scale onto the token scale, rung for rung, so the
 * migration is value-preserving rather than opinionated:
 *
 *   rounded-sm   (2px)  → --radius-xs      (8px)
 *   rounded-md   (6px)  → --radius-xs      (8px)
 *   rounded-lg   (8px)  → --radius-sm      (12px)
 *   rounded-xl   (12px) → --radius-field   (14px)
 *   rounded-2xl  (16px) → --radius-control (18px)
 *   rounded-3xl  (24px) → --radius-lg      (26px)
 *   rounded-4xl  (32px) → --radius-xl      (32px)
 *   rounded-full        → --radius-pill
 *
 * Every value lands on the UI99 rung whose padding band matches what the
 * class was already expressing, so a card keeps reading as a card and a chip
 * keeps reading as a chip.
 *
 * EMIT CONTRACT (do not regress this): Tailwind v4's `(--token)` shorthand
 * takes the BARE property name. `rounded-(var(--radius-sm))` is a different
 * string that compiles to no rule — that bug shipped ~1,050 dead utilities
 * across 114 files before it was caught. Enforced by scripts/tokens-gate.mjs.
 *
 * Dry-run by default. Pass --write to apply.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const WRITE = process.argv.includes('--write');
const ROOT = resolve(process.cwd(), 'src/components');

/** Named Tailwind radius → UI99 token NAME (no `var()`; see emit contract). */
const MAP = {
  'rounded-full': '--radius-pill',
  'rounded-4xl': '--radius-xl',
  'rounded-3xl': '--radius-lg',
  'rounded-2xl': '--radius-control',
  'rounded-xl': '--radius-field',
  'rounded-lg': '--radius-sm',
  'rounded-md': '--radius-xs',
  'rounded-sm': '--radius-xs',
  'rounded-none': '--radius-none',
};

/** Sizes that must not silently change meaning. */
const NOTABLE = new Set(['rounded-4xl', 'rounded-none']);

/**
 * The two "notable" classes carry a *fixed* meaning that predates the token
 * scale — flush edges and the top of the old ramp. They map to literal pixel
 * values so a re-run cannot quietly redefine them.
 */
const RADIUS_MAP_PX = {
  '--radius-xl': '32px',
  '--radius-none': '0px',
};

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return extname(p) === '.tsx' || extname(p) === '.ts' ? [p] : [];
  });
}

const counts = new Map();
let changedFiles = 0;
let edits = 0;

for (const file of files(ROOT)) {
  const src = readFileSync(file, 'utf8');
  let out = src;

  for (const [cls, token] of Object.entries(MAP)) {
    // Word-boundary safe, and never touch `rounded-[…]` (already tokenised)
    // or a longer class that merely starts with the same prefix.
    const re = new RegExp(`(?<![\\w\\-\\[])${cls}(?![\\w\\-])`, 'g');
    out = out.replace(re, () => {
      edits++;
      counts.set(cls, (counts.get(cls) ?? 0) + 1);
      return NOTABLE.has(cls) ? `rounded-[${RADIUS_MAP_PX[token]}]` : `rounded-(${token})`;
    });
  }

  if (out !== src) {
    changedFiles++;
    if (WRITE) writeFileSync(file, out, 'utf8');
  }
}

console.log(
  `${WRITE ? '✔ migrated' : '· would migrate'}: ${edits} radius value(s) across ${changedFiles} file(s)`,
);
for (const [cls, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cls.padEnd(15)} ${String(n).padStart(4)} → ${MAP[cls]}`);
}
if (!WRITE && edits) console.log('\nRun with --write to apply.');
