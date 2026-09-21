/**
 * UI99 — Token Migration Codemod (Phase 6: Light-theme equality)
 * Rewrites exact dual-literal Tailwind class pairs to safa.css token
 * utilities (Tailwind v4 `bg-(--token)` syntax). Exact-literal mapping only;
 * occurrences NOT in the map are left untouched and reported, so the next
 * iteration can classify them (semantic-equivalent vs intentional).
 *
 * Run: node scripts/tokenize-kit-classes.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const uiDir = resolve(root, 'src/components/ui');
const DRY = process.argv.includes('--dry');

/** Exact literal class-pair → token utility (Tailwind v4 var shorthand). */
const EXACT = new Map(Object.entries({
  // — Text: primary
  'text-zinc-950 dark:text-[#EDEDEF]': 'text-(--text-primary)',
  'text-zinc-900 dark:text-[#EDEDEF]': 'text-(--text-primary)',
  'text-zinc-800 dark:text-[#D4D4D8]': 'text-(--text-primary)',
  'text-zinc-800 dark:text-[#C6C6CE]': 'text-(--text-primary)',
  'text-zinc-700 dark:text-[#C6C6CE]': 'text-(--text-primary)',
  // — Text: secondary
  'text-zinc-500 dark:text-[#8E8E98]': 'text-(--text-secondary)',
  'text-zinc-500 dark:text-[#92929B]': 'text-(--text-secondary)',
  'text-zinc-600 dark:text-[#92929B]': 'text-(--text-secondary)',
  'text-zinc-600 dark:text-[#8E8E98]': 'text-(--text-secondary)',
  'text-zinc-400 dark:text-[#71717A]': 'text-(--text-muted)',
  'text-zinc-400 dark:text-[#5C5C68]': 'text-(--text-muted)',
  // — Text: inverse (on-fill)
  'text-white dark:text-[#0C0C0E]': 'text-(--text-on-fill)',
  // — Surfaces: card
  'bg-white dark:bg-[#0B0C11]': 'bg-(--bg-card)',
  'bg-white dark:bg-[#0E0E14]': 'bg-(--bg-card)',
  'bg-white dark:bg-[#0E0E13]': 'bg-(--bg-card)',
  'bg-white dark:bg-[#0B0C12]': 'bg-(--bg-card)',
  // — Surfaces: elevated
  'bg-white dark:bg-[#131318]': 'bg-(--bg-elevated)',
  'bg-white dark:bg-[#131317]': 'bg-(--bg-elevated)',
  // — Surfaces: sunken/canvas-inset
  'bg-zinc-50 dark:bg-[#0E0E13]': 'bg-(--bg-sunken)',
  'bg-zinc-50/70 dark:bg-[#0B0C11]': 'bg-(--bg-sunken)',
  'bg-zinc-100 dark:bg-[#0E0E14]': 'bg-(--bg-sunken)',
  // — Borders
  'border-black/[0.03] dark:border-white/[0.025]': 'border-(--border-hairline)',
  'border-black/[0.04] dark:border-white/[0.03]': 'border-(--border-hairline)',
  'border-black/[0.05] dark:border-white/[0.03]': 'border-(--border-hairline)',
  'border-black/[0.05] dark:border-white/[0.035]': 'border-(--border-hairline)',
  'border-black/[0.045] dark:border-white/[0.035]': 'border-(--border-subtle)',
  'border-black/[0.06] dark:border-white/[0.04]': 'border-(--border-subtle)',
  'border-black/[0.07] dark:border-white/[0.07]': 'border-(--border-strong)',
  'border-black/[0.09] dark:border-white/[0.09]': 'border-(--border-strong)',
  'border-black/[0.12] dark:border-white/[0.12]': 'border-(--border-strong)',
  // — State layers (hover)
  'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]': 'hover:bg-(--state-hover)',
  'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]': 'hover:bg-(--state-hover)',
  'hover:bg-black/[0.02] dark:hover:bg-white/[0.04]': 'hover:bg-(--state-hover)',
}));

const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx'));
let totalReplaced = 0;
const leftovers = new Map();

for (const file of files) {
  const path = join(uiDir, file);
  let src = readFileSync(path, 'utf8');
  let count = 0;

  for (const [pair, token] of EXACT) {
    while (src.includes(pair)) {
      src = src.replace(pair, token);
      count += 1;
    }
  }

  // Report remaining dual-literal pairs for the next iteration
  const remaining = src.match(/(?:bg|text|border|ring)-[a-z]+-\d+[^ '"`]*\s+dark:(?:bg|text|border)-\[[#a-zA-Z0-9./]+\]/g);
  if (remaining) leftovers.set(file, remaining.length);

  if (count > 0 && !DRY) writeFileSync(path, src);
  totalReplaced += count;
}

console.log(`[tokenize] ${totalReplaced} class pairs → token utilities${DRY ? ' (dry)' : ''}`);
for (const [file, n] of [...leftovers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`[tokenize] leftover pairs in ${file}: ${n}`);
}
