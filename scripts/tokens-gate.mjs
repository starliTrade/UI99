/**
 * UI99 — Token Adherence Gate
 *
 * Three rules, all enforced in CI:
 *
 *   A. NO surface/ink hexes in kit classes. These belong to the token system
 *      (src/styles/ui99.css); hardcoding them is what forced the `!important`
 *      light-mode hack and desyncs .obsidian/.porcelain.
 *
 *   B. NO arbitrary structural utilities. `shadow-[…]`, `rounded-[Npx]` and
 *      `blur-[Npx]` mean elevation/radius/blur were decided at the call site.
 *      The elevation audit found 145 unique hand-written shadows across 64
 *      files — elevation had been decided 145 times and never compared.
 *      Now they must be tokens (`shadow-(--elevation-3)`, `rounded-(--radius-md)`).
 *
 *   C. Every token referenced by a component must actually be DECLARED in
 *      src/styles/ui99*.css. A typo'd var() silently resolves to nothing and
 *      drops the shadow entirely — invisible in review, obvious in production.
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
const VALUE_ONLY_FILES = new Set(['ColorPicker.tsx', 'TokenLatticeHero.tsx']);

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

/* ══════════════════ RULE B — no arbitrary structural utilities ══════════════════
 *
 * `shadow-[…]` / `rounded-[Npx]` / `blur-[Npx]` place a design decision at the
 * call site. The elevation audit found 266 of them. They are now tokens, and
 * this rule stops them creeping back.
 */
const structuralViolations = [];
const STRUCTURAL = [
  { re: /shadow-\[[^\]]+\]/g, label: 'shadow', hint: 'shadow-(--elevation-3)' },
  { re: /rounded-\[[0-9.]+px\]/g, label: 'radius', hint: 'rounded-(--radius-md)' },
  { re: /blur-\[[0-9.]+px\]/g, label: 'blur', hint: 'blur-(--blur-md)' },
  // The audit's most important finding: the named Tailwind scale bypassed the
  // token system entirely — 787 `rounded-2xl/3xl/full` in the kit. A rule that
  // only greps for brackets lets the whole named scale through, so it is
  // matched explicitly here.
  {
    re: /(?<![\w\-\[])rounded-(?:sm|md|lg|xl|2xl|3xl|4xl|full)(?![\w\-])/g,
    label: 'radius (named scale)',
    hint: 'rounded-(--radius-control) / rounded-(--radius-pill)',
  },
  // Type: the raw scale bypasses --type-* just as radius did — but type is
  // deliberately NOT gated yet. Migrating ~900 sizes is a per-call-site
  // judgement (is this text-xs a caption, or genuinely micro?), and a blind
  // codemod would silently restyle the entire kit. Tracked as P0-A in
  // docs/PARITY-AUDIT.md. Enable this rule once the migration has landed.
  //
  // {
  //   re: /(?<![\w\-\[])(?:sm:|md:|lg:|xl:|2xl:)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(?![\w\-])/g,
  //   label: 'type size (raw scale)',
  //   hint: 'type-body / type-title / type-heading',
  // },
];

for (const f of files) {
  if (VALUE_ONLY_FILES.has(f)) continue;
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const rule of STRUCTURAL) {
      for (const m of line.matchAll(rule.re)) {
        structuralViolations.push(
          `${f}:${i + 1}: arbitrary ${rule.label} — "${m[0].slice(0, 60)}" → ${rule.hint}`,
        );
      }
    }
  });
}

if (structuralViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${structuralViolations.length} arbitrary structural value(s) — elevation/radius/blur must be tokens:\n`,
  );
  for (const v of structuralViolations) console.error('  ' + v);
  console.error(
    '\nCodemods: node scripts/migrate-elevation.mjs --write · node scripts/migrate-radius.mjs --write\nScale: src/styles/ui99-elevation.css · ui99-glow.css · ui99-type.css\n',
  );
  process.exit(1);
}

/* ══════════════════ RULE C — referenced tokens must exist ══════════════════
 *
 * A typo'd var() resolves to nothing and silently drops the shadow. Cheap to
 * check, expensive to debug visually.
 */
const tokenSources = ['ui99.css', 'ui99-elevation.css', 'ui99-glow.css', 'porcelain.css']
  .map((f) => readFileSync(resolve(root, 'src/styles', f), 'utf8'))
  .join('\n');
const declared = new Set(
  [...tokenSources.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
);

const undeclared = new Map();
for (const f of files) {
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  for (const m of src.matchAll(/var\((--(?:elevation|rim|shadow|glow|radius|space|blur|z)-[a-z0-9-]+)\)/g)) {
    if (!declared.has(m[1])) {
      if (!undeclared.has(m[1])) undeclared.set(m[1], new Set());
      undeclared.get(m[1]).add(f);
    }
  }
}

if (undeclared.size) {
  console.error(`\n✗ tokens-gate: ${undeclared.size} undeclared token reference(s):\n`);
  for (const [token, where] of undeclared) {
    console.error(`  ${token} — used in ${[...where].join(', ')}`);
  }
  console.error('\nDeclare it in src/styles/ui99-elevation.css or ui99-glow.css.\n');
  process.exit(1);
}

console.log(
  `✓ tokens-gate: ${files.length} kit files clean — zero hardcoded hexes, zero arbitrary elevation/radius/blur, all ${declared.size} tokens declared`,
);
