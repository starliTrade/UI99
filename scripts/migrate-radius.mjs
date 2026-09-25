#!/usr/bin/env node
/**
 * UI99 — Radius Codemod (named Tailwind scale → tokens)
 *
 * The elevation codemod only removed *arbitrary* radii. The audit showed the
 * kit's real radius usage was Tailwind's named scale — 787 occurrences of
 * `rounded-2xl` / `rounded-3xl` / `rounded-full` — which slipped straight past
 * that rule and made the whole product read as over-rounded.
 *
 * This maps the named scale onto the token scale, with a deliberate DOWNWARD
 * bias on containers:
 *
 *   rounded-md   (6px)  → --radius-xs
 *   rounded-lg   (8px)  → --radius-sm
 *   rounded-xl   (12px) → --radius-field
 *   rounded-2xl  (16px) → --radius-control   (was over-used 222×)
 *   rounded-3xl  (24px) → --radius-lg
 *   rounded-full        → --radius-pill
 *
 * The important one is `rounded-2xl` → `--radius-control`. A control radius on
 * a card is what flattens hierarchy: when the container and its contents share
 * a radius, the nesting is invisible. Material's rule is outer = inner +
 * padding; giving cards `--radius-lg` instead of `--radius-control` restores it.
 *
 * Dry-run by default. Pass --write to apply.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const WRITE = process.argv.includes('--write');
const ROOT = resolve(process.cwd(), 'src/components');

/** Named Tailwind radius → UI99 token. Order matters: longest first. */
const MAP = {
  'rounded-full': 'var(--radius-pill)',
  'rounded-4xl': 'var(--radius-sheet)',
  'rounded-3xl': 'var(--radius-lg)',
  'rounded-2xl': 'var(--radius-control)',
  'rounded-xl': 'var(--radius-field)',
  'rounded-lg': 'var(--radius-sm)',
  'rounded-md': 'var(--radius-xs)',
  'rounded-sm': 'var(--radius-xs)',
  'rounded-none': 'var(--radius-none)',
};

/** Sizes that must not silently change meaning. */
const NOTABLE = new Set(['rounded-4xl', 'rounded-none']);

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
      return NOTABLE.has(cls) ? token : `rounded-(${token})`;
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
