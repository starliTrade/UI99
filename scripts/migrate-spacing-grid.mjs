#!/usr/bin/env node
/**
 * UI99 — spacing quantiser (4px grid, bias-to-canvas)
 *
 * The spacing law in docs/standards.md §3 says every gap is a multiple of 4px
 * with exactly two exceptions: the 1px hairline and the 2px half-step
 * (`p-0.5`) that tight icon-to-text pairs need. The kit had drifted off that
 * grid: `gap-1.5` (136 sites), `py-1.5` (57), `px-2.5` (57), `gap-2.5` (49),
 * `p-3.5` (18) and ~40 more off-grid rungs, spread across 100+ files.
 *
 * A 6px gap is not a design decision, it is 4px plus a leftover. Two costs:
 *   1. Off-grid spacing is what makes a dense UI read as UNSOUND — every
 *      half-step is a place where two components disagree by 2px about how
 *      much air a thing gets, and the eye finds that long before the eye can
 *      name it.
 *   2. Half-steps overflow their own boxes. A 32px control with `py-1.5` and
 *      a 14px/1.6 line is 34.4px of content in a 32px box: the padding wins
 *      and the label gets shaved, or the line-height wins and the padding is
 *      ignored. The label silently loses, because nothing here is a hard
 *      overflow — it is just 2px of breathing room the designer thought they
 *      had.
 *
 * This rounds every off-grid spacing rung DOWN to the 4px grid. Down, not to
 * nearest: §2.4's bias-to-canvas law is the general form of the same decision,
 * and the request that produced this script was "less air, closer to the
 * background". 2.5→2 and 3.5→3 both shrink by 2px; 1.5→1 is the only step
 * where rounding to nearest (2px) would have kept the space.
 *
 * `p-0.5` is the documented 2px exception and is left alone. Width/height are
 * NOT spacing — `w-3.5` is a 14px icon, not a gap, and rounding it would
 * squashed glyphs. Only the margin/padding/gap family is touched.
 *
 * Idempotent: a second run finds nothing to do.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['src'];
const EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.css']);

/** The spacing family. Deliberately excludes w / h / min-* / max-* / text-*. */
const SPACING = [
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'ps', 'pe',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'ms', 'me',
];

/** 2px — the one sanctioned off-grid rung (icon-to-text tight pairs). */
const KEEP = new Set(['0.5']);

const re = new RegExp(
  String.raw`(?<![\w-])((?:[a-z0-9\[\]&#>:/.-]+:)*)(` +
    SPACING.join('|') +
    String.raw`)-(\d+)\.(\d)(?![\w.\d])`,
  'g',
);

const roundDown = (whole, frac) => (frac === 5 && whole === 0 ? 0 : Number(whole));

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(p))) yield p;
  }
}

let changedFiles = 0;
let changedClasses = 0;
const histogram = new Map();

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const src = readFileSync(file, 'utf8');
    if (!re.test(src)) {
      re.lastIndex = 0;
      continue;
    }
    re.lastIndex = 0;

    const out = src.replace(re, (m, variants, prop, whole) => {
      if (KEEP.has(`${whole}.5`)) return m;
      const to = roundDown(whole, 5);
      if (to === 0 && `${whole}.5` === '0.5') return m;
      const key = `${prop}-${whole}.5 → ${prop}-${to}`;
      histogram.set(key, (histogram.get(key) ?? 0) + 1);
      changedClasses += 1;
      return `${variants}${prop}-${to}`;
    });

    if (out !== src) {
      writeFileSync(file, out);
      changedFiles += 1;
    }
  }
}

console.log(`spacing grid: ${changedClasses} classes across ${changedFiles} files`);
for (const [k, v] of [...histogram].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`);
}
