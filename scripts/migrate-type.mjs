#!/usr/bin/env node
/**
 * UI99 — Typography Codemod (raw Tailwind type scale → the 9-step ramp)
 *
 * WHY THIS EXISTS
 *
 * The ramp in `ui99-type.css` existed and was almost entirely unused: 1 real
 * `.type-*` call site against 1,282 raw ones. A 9-step scale that 99% of the
 * kit bypasses is a comment, not a system — and it is exactly why the kit
 * drifted into 14 different arbitrary pixel sizes.
 *
 * THE MAPPING IS NEAREST-RUNG, NOT A LOOKUP TABLE
 *
 * Each raw value is snapped to the closest rung on the ramp, ties resolving
 * downward. The interesting consequence is that the middle of the scale is a
 * perfect 1:1 — `text-xs`→caption (12), `text-sm`→body (14), `text-base`→
 * body-lg (16), `text-xl`→title (20), `text-2xl`→heading (24) are all
 * pixel-identical, so the migration is visually a no-op there and the ramp
 * simply becomes legible.
 *
 * The tails collapse, on purpose:
 *   18px → body-lg   30px → display   48px → hero    60/72/76px → billboard
 * 14 arbitrary values (8–13.5px) fold into `micro` and `caption`.
 *
 * Collapsing is the point. Nine rungs that everything obeys beat sixteen sizes
 * that nothing agrees on.
 *
 * WHY THE USEFUL ONES ARE NOT NUMBERS
 *
 * `--space-*` is NOT applied to every `p-4` in the kit. Tailwind's spacing
 * scale is already a 4px grid with a 0.25rem base — mechanically replacing
 * 1,757 `p-4`s with `p-(--space-md)` would render identically while making
 * every call site longer and less readable. shadcn, Radix and Material all
 * keep the native numerals for component padding for this reason.
 *
 * What IS worth tokenising is *intent* — `gap-gutter`, `gap-section`,
 * `gap-cluster` — because a numeral cannot say why a gap exists. That is a
 * deliberate call-site decision, not a mechanical rewrite, so it is not here.
 *
 * EMIT CONTRACT: `.type-*` is a plain class, not a `(--token)` utility, so
 * there is no `var()`-wrapping hazard. Both forms are rejected if found, in
 * case a previous codemod introduced one.
 *
 * Dry-run by default. Pass --write to apply.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const WRITE = process.argv.includes('--write');
const ROOT = resolve(process.cwd(), 'src/components');

/* ── the ramp, in px, read straight from ui99-type.css ────────────────────── */
const RAMP = [
  ['micro', 10],
  ['caption', 12],
  ['body', 14],
  ['body-lg', 16],
  ['title', 20],
  ['heading', 24],
  ['display', 32],
  ['hero', 44],
  ['billboard', 64],
];

/** Nearest rung; ties resolve DOWNWARD so the scale never inflates. */
function rungFor(px) {
  let best = RAMP[0];
  let bestD = Infinity;
  for (const r of RAMP) {
    const d = Math.abs(r[1] - px);
    // strict `<` keeps the lower rung on a tie
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  }
  return best[0];
}

/** Tailwind's named scale, in px. */
const NAMED = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
  '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48,
  '6xl': 60, '7xl': 72,
};

// A size class: optional breakpoint prefixes, optional theme variant, then
// `text-<name>` or `text-[Npx]`. Anchored so `text-zinc-500` is never touched.
const SIZE_RE =
  /(?<![\w\-\[])((?:(?:sm|md|lg|xl|2xl):)*)((?:dark:|light:)*)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|\[[0-9.]+px\])(?![\w\-\[])/g;

/** The two ways a previous codemod could have left a dead type class behind. */
const DEAD = [
  { re: /(?<![\w-])type-[a-z-]*\(var\(--type-[a-z-]+\)\)/g, label: 'wrapped token' },
  {
    re: /(?<![\w-])[a-z-]+-\((?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+),\s*(?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+)\)/g,
    label: 'multi-token utility',
  },
];

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return extname(p) === '.tsx' || extname(p) === '.ts' ? [p] : [];
  });
}

const counts = new Map();
const dead = [];
let changedFiles = 0;
let edits = 0;

for (const file of files(ROOT)) {
  const src = readFileSync(file, 'utf8');
  let out = src;

  for (const rule of DEAD) {
    for (const m of src.matchAll(rule.re)) dead.push(`${file}: ${rule.label} — ${m[0]}`);
  }

  out = out.replace(SIZE_RE, (full, bp, variant, size) => {
    const px = size.startsWith('[') ? parseFloat(size.slice(1, -3)) : NAMED[size];
    if (!Number.isFinite(px)) return full;
    const rung = rungFor(px);
    edits++;
    counts.set(`${size} → .type-${rung}`, (counts.get(`${size} → .type-${rung}`) ?? 0) + 1);
    // The ramp owns leading and tracking, so a raw size with none of its own
    // gets the class. Breakpoint and theme prefixes are preserved as-is.
    return `${bp}${variant}type-${rung}`;
  });

  if (out !== src) {
    changedFiles++;
    if (WRITE) writeFileSync(file, out, 'utf8');
  }
}

console.log(
  `${WRITE ? '✔ migrated' : '· would migrate'}: ${edits} type size(s) across ${changedFiles} file(s)`,
);
for (const [k, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(34)} ${String(n).padStart(5)}`);
}

if (dead.length) {
  console.error(`\n✗ ${dead.length} dead type utility class(es) — these compile to nothing:`);
  for (const d of dead) console.error('  ' + d);
  process.exit(1);
}

if (!WRITE && edits) console.log('\nRun with --write to apply.');
