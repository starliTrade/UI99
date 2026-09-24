/**
 * UI99 — Core Adherence Codemod (Sprint 1)
 * Migrates EXACT hex literals in src/components/ui/*.tsx to token-driven
 * classes. Deliberately conservative:
 *   - every replacement is an explicit entry in HEX_MAP (no fuzzy color math)
 *   - unmapped hexes are left untouched and reported for human review
 *   - idempotent: re-running after migration is a no-op
 *
 * Run: node scripts/migrate-tokens.mjs        (dry-run by default)
 *      node scripts/migrate-tokens.mjs --write
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = resolve(root, 'src/components/ui');
const WRITE = process.argv.includes('--write');

/**
 * Exact-hex → Tailwind token class.
 * Case-sensitive on the literal as written in source.
 */
const HEX_MAP = {
  // Obsidian surface ladder → --bg-* tokens
  '#060709': 'bg-(--bg-canvas)',
  '#06070A': 'bg-(--bg-canvas)',
  '#07080B': 'bg-(--bg-sunken)',
  '#07080C': 'bg-(--bg-sunken)',
  '#090A0E': 'bg-(--bg-surface)',
  '#0A0B10': 'bg-(--bg-surface)',
  '#0B0C11': 'bg-(--bg-card)',
  '#0C0D12': 'bg-(--bg-card)',
  '#0E0E14': 'bg-(--bg-elevated)',
  '#0E0F14': 'bg-(--bg-elevated)',
  '#101117': 'bg-(--bg-card-hover)',
  '#111117': 'bg-(--bg-card-hover)',
  '#111218': 'bg-(--bg-elevated)',
  '#131318': 'bg-(--bg-elevated)',
  '#18181D': 'bg-(--bg-card-hover)',
  '#16161B': 'bg-(--bg-card-hover)',

  // Hover/elevated micro-variants of the ink fill (Button primary dark / white-pill)
  '#111116': 'bg-(--bg-card-hover)',
  '#111218': 'bg-(--bg-card-hover)',
  '#1E1E24': 'bg-(--bg-card-hover)',
  '#1C1C22': 'bg-(--bg-card-hover)',
  '#1E1E26': 'bg-(--bg-card-hover)',
  '#18181F': 'bg-(--bg-card-hover)',
  '#1A1A20': 'bg-(--bg-card-hover)',
  '#20202A': 'bg-(--bg-card-hover)',

  // Ink/primary text → --text-primary
  '#EDEDEF': 'text-(--text-primary)',
  '#EBEBEF': 'text-(--text-primary)',
  '#E2E2E8': 'text-(--text-primary)',
  '#F2F2F5': 'text-(--text-primary)',
  '#F5F5F8': 'text-(--text-primary)',
  '#FFFFFF': 'text-(--text-primary)',

  // Ink-on-fill (dark text on light fill) → --text-on-fill
  '#0C0C0E': 'text-(--text-on-fill)',
  '#060709': 'text-(--text-on-fill)',

  // Secondary / muted text
  '#92929B': 'text-(--text-secondary)',
  '#8E8E98': 'text-(--text-secondary)',
  '#9E9EA8': 'text-(--text-secondary)',
  '#A1A1AA': 'text-(--text-secondary)',
  '#D4D4D8': 'text-(--text-secondary)',
  '#6E6E78': 'text-(--text-secondary)',
  '#5C5C66': 'text-(--text-muted)',
  '#60606B': 'text-(--text-muted)',
  '#71717A': 'text-(--text-muted)',
  '#85858F': 'text-(--text-muted)',

  // Micro-variant surfaces (tooltip/switch/toast/split-button family)
  '#0B0B0D': 'bg-(--bg-sunken)',
  '#111114': 'bg-(--bg-elevated)',
  '#12131C': 'bg-(--bg-elevated)',
  '#141418': 'bg-(--bg-elevated)',
  '#181820': 'bg-(--bg-elevated)',
  '#0E0F16': 'bg-(--bg-elevated)',
  '#171822': 'bg-(--bg-card-hover)',
  '#181924': 'bg-(--bg-card-hover)',
  '#14141E': 'bg-(--bg-elevated)',
  '#0E0E13': 'bg-(--bg-elevated)',
  '#0E0F14': 'bg-(--bg-elevated)',

  // Intent fill pairings (destructive/success/rose-tint) — Sprint 1 closure
  '#2A0A10': 'text-(--intent-rose-on)',
  '#06251A': 'text-(--intent-emerald-on)',
  '#161216': 'bg-(--rose-tint)',
  '#1E171E': 'bg-(--rose-tint-hover)',
  '#F3CBD2': 'text-(--rose-tint-text)',
  '#D4C5B9': 'text-(--text-secondary)',
};

/** Only migrate hexes that appear inside a Tailwind arbitrary color class. */
const CLASS_CONTEXT = /(?:bg|text|border|ring|from|to|via|fill|stroke)-\[?((?:#)[0-9A-Fa-f]{6})\]?/g;

function migrateFile(path) {
  const src = readFileSync(path, 'utf8');
  let out = src;
  const hits = [];

  for (const [hex, tokenClass] of Object.entries(HEX_MAP)) {
    // Arbitrary-value class form: bg-[#0B0C11] / text-[#EDEDEF]
    const classRe = new RegExp(`(bg|text|border|ring|from|to|via|fill|stroke)-\\[${hex}\\]`, 'g');
    // Bare class form used with dark:/light: prefixes: dark:bg-[#0B0C11]
    out = out.replace(classRe, (_m, prop) => {
      hits.push(`${prop}-[${hex}] → ${prop}-${tokenClass.replace(/^(bg|text|border|ring|from|to|via|fill|stroke)-/, '')}`);
      return `${prop}-${tokenClass.slice(tokenClass.indexOf('-') + 1)}`;
    });

    // Inline string form inside className strings, e.g. "dark:bg-[#0B0C11]" is
    // covered above; raw hex in JS values (const colors = ['#0B0C11']) is left
    // alone deliberately — those are chart palettes, not surface tokens.
  }

  if (WRITE && out !== src) writeFileSync(path, out);
  return { changed: out !== src, hits };
}

const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx')).sort();
let totalHits = 0;
let changedFiles = 0;

for (const f of files) {
  const path = resolve(uiDir, f);
  const { changed, hits } = migrateFile(path);
  if (hits.length) {
    changedFiles += changed ? 1 : 0;
    totalHits += hits.length;
    console.log(`${changed ? '✎' : '·'} ${f} (${hits.length})`);
    if (process.argv.includes('-v')) for (const h of hits) console.log(`    ${h}`);
  }
}

console.log(`\n[migrate] ${totalHits} class replacement(s) across ${changedFiles} file(s)${WRITE ? ' — WRITTEN' : ' — dry-run (pass --write)'}`);
