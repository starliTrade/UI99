/**
 * UI99 — Token Adherence Gate (Sprint 1 quality gate)
 *
 * FORBIDDEN: surface/ink hexes in kit classes. These values belong to the
 * token system (src/styles/ui99.css); hardcoding them in components is what
 * forced the `!important` light-mode hack and desyncs .obsidian/.porcelain.
 *
 * ALLOWED: data palettes (charts, heatmaps, color pickers, confetti) and
 * documented accent tints — identity colors, not theme surfaces.
 *
 * Run: node scripts/tokens-gate.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = resolve(root, 'src/components/ui');

/**
 * Surface/ink hexes that must never appear in component classes.
 * Keep in sync with scripts/migrate-tokens.mjs HEX_MAP keys.
 */
const FORBIDDEN = new Set([
  // canvas / surface / card / elevated / sunken ladder
  '#060709', '#06070A', '#07080B', '#07080C', '#090A0E', '#0A0B10',
  '#0B0C11', '#0C0D12', '#0E0E14', '#0E0F14', '#101117', '#111117',
  '#111218', '#131318', '#16161B', '#18181D', '#111116', '#1E1E24',
  '#1C1C22', '#1E1E26', '#18181F', '#1A1A20', '#20202A', '#0B0B0D',
  '#111114', '#12131C', '#141418', '#181820', '#0E0F16', '#171822',
  '#181924', '#14141E', '#0E0E13', '#12131A', '#131317', '#15151B',
  '#15151C', '#0E0F15', '#0E0E13', '#131314', '#0A0A0F', '#0D0D12',
  // ink / text ladder
  '#EDEDEF', '#EBEBEF', '#E2E2E8', '#F2F2F5', '#F5F5F8', '#FFFFFF',
  '#0C0C0E', '#92929B', '#8E8E98', '#9E9EA8', '#A1A1AA', '#D4D4D8',
  '#6E6E78', '#5C5C66', '#60606B', '#71717A', '#85858F',
  // intent fill pairings (destructive/success/rose-tint) — Sprint 1 closure
  '#2A0A10', '#06251A', '#161216', '#1E171E', '#F3CBD2', '#D4C5B9',
]);

const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
const violations = [];

/**
 * Legit non-UI uses of surface hexes: SSR fallbacks after a live token read
 * (`read('--var', '#hex')` / `?? '#hex'`), data-value presets the USER picks
 * from (ColorPicker swatch values), canvas contexts, and var() fallback
 * clauses. These are values, not styling.
 */
const VALUE_CONTEXT =
  /(?:const [A-Z_]+ = \[|DEFAULT_PRESETS|var\(--[a-z-]+,|getComputedStyle|strokeStyle =|read\('--|\?\?\s*['"]#)/;

/** Files whose forbidden-hex lines are value presets / canvas data, verified by hand. */
const VALUE_ONLY_FILES = new Set(['ColorPicker.tsx']);

for (const f of files) {
  if (VALUE_ONLY_FILES.has(f)) continue;
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    if (VALUE_CONTEXT.test(line)) return; // data values, not theme styling
    for (const m of line.matchAll(/#[0-9A-Fa-f]{6}\b/g)) {
      const hex = m[0].toUpperCase();
      if (FORBIDDEN.has(hex)) {
        violations.push(`${f}:${i + 1}: ${hex} — "${line.trim().slice(0, 90)}"`);
      }
    }
  });
}

if (violations.length) {
  console.error(`\n✗ tokens-gate: ${violations.length} forbidden surface/ink hex(es) in kit classes:\n`);
  for (const v of violations) console.error('  ' + v);
  console.error('\nUse the token system instead: bg-(--bg-card), text-(--text-primary), etc.');
  console.error('Map: src/styles/ui99.css · Codemod: node scripts/migrate-tokens.mjs --write\n');
  process.exit(1);
}

console.log(`✓ tokens-gate: ${files.length} kit files clean — zero hardcoded surface/ink hexes`);
