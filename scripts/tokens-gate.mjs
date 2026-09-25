/**
 * UI99 — Token Adherence Gate
 *
 * Four rules, all enforced in CI:
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
  // Directional radii (rounded-t-, rounded-bl-, …) are the same decision and
  // used to slip straight through: the bracket rule above only matched the
  // bare `rounded-[…]` form. Modal.tsx carried an untokenised
  // `rounded-t-[28px]` for exactly this reason.
  {
    re: /rounded-[trblexyse]{0,2}-\[[0-9.]+px\]/g,
    label: 'radius (directional)',
    hint: 'rounded-t-(--radius-lg)',
  },
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
  // Directional variants of the named scale — `rounded-b-3xl` was sitting in
  // Sheet.tsx and matched neither the bracket rule nor the bare named rule.
  {
    re: /(?<![\w\-\[])rounded-[trblexyse]{1,2}-(?:sm|md|lg|xl|2xl|3xl|4xl|full)(?![\w\-])/g,
    label: 'radius (named scale, directional)',
    hint: 'rounded-b-(--radius-lg)',
  },
  // Type: the raw scale bypassed --type-* exactly as the radius scale did, so
  // it is now gated too. The migration landed first (1,277 `type-*` call sites,
  // zero raw sizes, zero arbitrary `text-[Npx]`), and this rule is what keeps
  // it landed. It was deliberately left disabled while the migration was in
  // flight — a rule you cannot pass yet only teaches people to bypass it.
  {
    re: /(?<![\w\-\[])(?:sm:|md:|lg:|xl:|2xl:)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(?![\w\-])/g,
    label: 'type size (raw scale)',
    hint: 'type-body / type-title / type-heading',
  },
  // Arbitrary type sizes are the same decision made by hand, and they bypass
  // the ramp entirely — a size with no leading and no tracking.
  {
    re: /(?<![\w\-\[])text-\[[0-9.]+px\]/g,
    label: 'type size (arbitrary)',
    hint: 'type-caption / type-body',
  },
  // Icon size: the optical scale (12/14/16/20/24) plus the two dot sizes. The
  // original 4-rung scale skipped 16px — the single most common icon size in
  // the kit — so 351 call sites had no token to reach for and went raw. The
  // scale was widened to five, the migration landed (472 icon sites + 15 dots
  // across 74 files), and this rule is what keeps it landed.
  //
  // Scoped to the JSX-tag form `<Tag className="w-4 h-4">` so that a layout
  // box — a 16px divider, an 18px checkbox, a 64px column — is never mistaken
  // for an icon. An icon token on a non-icon is worse than a raw number,
  // because it looks governed while silently changing meaning.
  {
    re: /<[A-Z][A-Za-z0-9]*\b[^>]*?className=(?:"[^"]*"|\{`[^`]*`\}|\{'[^']*'\})/g,
    label: 'icon size (raw w/h pair on a component)',
    hint: 'icon-xs/sm/md/lg/xl · icon-dot for status dots',
    // Only fire when the element carries a *matched* w-N h-N pair, so single-
    // axis sizing and non-icon boxes pass through untouched.
    filter: (match) => {
      // Pull the class LIST, not the whole `className="…"` attribute — the
      // leading `className="` would defeat a `^\s` anchor and the rule would
      // silently never fire.
      const cls = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/.exec(match);
      const list = cls?.[1] ?? cls?.[2] ?? cls?.[3] ?? '';
      const w = /(?:^|\s)w-(3|3\.5|4|5|6)(?=\s|$)/.exec(list);
      const h = /(?:^|\s)h-(3|3\.5|4|5|6)(?=\s|$)/.exec(list);
      return Boolean(w && h && w[1] === h[1]);
    },
  },
  // Status dots: the same reasoning, one scale down. A `rounded-pill` mark at
  // 8/10px is a presence dot, not a glyph, and deserves its own name. Unlike
  // icons, dots are usually a plain `<span>`/`<div>`, so the tag is not
  // capitalised and cannot be the signal — `rounded-pill` at 8/10px is.
  {
    re: /<[A-Za-z][A-Za-z0-9]*\b[^>]*?className=(?:"[^"]*"|\{`[^`]*`\}|\{'[^']*'\})/g,
    label: 'status dot (raw w/h pair)',
    hint: 'icon-dot / icon-dot-lg',
    filter: (match) => {
      const cls = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/.exec(match);
      const list = cls?.[1] ?? cls?.[2] ?? cls?.[3] ?? '';
      if (!list.includes('rounded-(--radius-pill)')) return false;
      return /(?:^|\s)w-2(\.5)?(\s)h-2(\.5)?(?=\s|$)/.test(list);
    },
  },
  // Motion duration: the raw Tailwind scale bypassed --duration-* exactly as
  // the radius and type scales did. The declared ramp had 75/120/180/280/400
  // while the code used 75/100/150/200/300/500/700 — so 150ms, the single most
  // common transition in the kit (23 sites), had no token to reach for. The
  // ramp was rebuilt from the measured distribution (every step millisecond-
  // identical, so the migration changed no timing) and this rule keeps it.
  {
    re: /(?<![\w\-\[])(?:sm:|md:|lg:|xl:|motion-safe:|motion-reduce:)?duration-(\d+)(?![\w\-\[])/g,
    label: 'motion duration (raw scale)',
    hint: 'dur-instant / dur-fast / dur-quick / dur-base / dur-slow / dur-deliberate / dur-progress',
  },
  // Focus visibility (WCAG 2.4.7 / 2.4.11). Suppressing the UA outline with no
  // replacement is not a style choice, it is the removal of a keyboard user's
  // only indication of where they are. 19 elements did exactly this; they now
  // carry `focus-ui99`.
  {
    re: /className=(?:"[^"]*"|\{`[^`]*`\}|\{'[^']*'\})/g,
    label: 'focus ring removed without replacement',
    hint: 'focus-ui99 (or focus-ui99-inset)',
    filter: (match) => {
      const cls = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/.exec(match);
      const list = cls?.[1] ?? cls?.[2] ?? cls?.[3] ?? '';
      if (!/outline-none/.test(list)) return false;
      // A ring counts as a replacement even when variant-prefixed
      // (`focus-visible:ring-2`) — which is the form most of the kit uses.
      return !/(?:^|\s)(?:[a-z-]+:)*ring-\d/.test(list) && !/focus-ui99|focus-safa/.test(list);
    },
  },
  // Light-mode contrast (WCAG 1.4.3). Raw zinc is a DARK-theme idiom: measured
  // against this kit's own surfaces, text-zinc-400 is 2.56:1 on white and
  // 2.33:1 on the light canvas, where AA needs 4.5. A base (unprefixed) zinc
  // text colour with no `dark:` companion is therefore invisible in one theme.
  // The semantic tokens carry the right value per theme and are already covered
  // by src/test/contrast.test.ts.
  {
    re: /className=(?:"[^"]*"|\{`[^`]*`\}|\{'[^']*'\})/g,
    label: 'text colour legible only in one theme',
    hint: 'text-(--text-secondary) / text-(--text-muted)',
    filter: (match) => {
      const cls = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/.exec(match);
      const list = cls?.[1] ?? cls?.[2] ?? cls?.[3] ?? '';
      if (/dark:/.test(list)) return false; // paired — the idiom is fine
      return /(?:^|\s)text-zinc-(?:300|400|500)(?=\s|$)/.test(list);
    },
  },
];

for (const f of files) {
  if (VALUE_ONLY_FILES.has(f)) continue;
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const rule of STRUCTURAL) {
      for (const m of line.matchAll(rule.re)) {
        // Some rules match a whole JSX element and then narrow it — a matched
        // w/h pair means an icon box, a lone w-4 means a layout box we leave
        // alone. Without this, gating icons would flag every divider.
        if (rule.filter && !rule.filter(m[0])) continue;
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
 *
 * CRITICAL: this must match BOTH reference forms.
 *   var(--radius-md)  — plain CSS / multi-token contexts
 *   (--radius-md)     — Tailwind v4's utility shorthand
 * Rule C originally only matched the first, so the moment the kit moved to the
 * shorthand this rule checked nothing at all — which is precisely how a
 * misspelled token could have shipped unnoticed.
 */
const tokenSources = [
  'ui99.css',
  'ui99-elevation.css',
  'ui99-glow.css',
  'ui99-type.css',
  'porcelain.css',
]
  .map((f) => readFileSync(resolve(root, 'src/styles', f), 'utf8'))
  .join('\n');
const declared = new Set(
  [...tokenSources.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
);

const TOKEN_REF = /var\((--(?:elevation|rim|shadow|glow|radius|space|blur|z|type|weight|icon)-[a-z0-9-]+)\)|\(--((?:elevation|rim|shadow|glow|radius|space|blur|z|type|weight|icon)-[a-z0-9-]+)\)/g;

const undeclared = new Map();
for (const f of files) {
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  for (const m of src.matchAll(TOKEN_REF)) {
    const token = m[1] ?? `--${m[2]}`;
    if (!declared.has(token)) {
      if (!undeclared.has(token)) undeclared.set(token, new Set());
      undeclared.get(token).add(f);
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

/* ══════════════════ RULE D — utilities must actually compile ══════════════════
 *
 * THE rule that was missing, and the reason ~1,050 dead classes shipped once.
 *
 * Tailwind v4's `(--token)` shorthand takes the BARE property name. Both of
 * the following look correct, pass a grep for "did we use the token?", and
 * are completely different strings to Tailwind:
 *
 *     rounded-(--radius-sm)    ✓ compiles
 *     rounded-(var(--radius-sm))  ✗ compiles to nothing at all
 *
 * Same for a multi-token shadow: `shadow-(--a, --b)` is not a value Tailwind
 * can parse, so it emits no rule. A multi-layer shadow must be a NAMED
 * composite (`shadow-(--shadow-card)`) from ui99-elevation.css.
 *
 * Neither mistake throws, fails typecheck, or fails a snapshot. The only way
 * to catch it is to refuse to let the syntax into the repo.
 */
const deadUtilityViolations = [];
const DEAD_UTILITY = [
  {
    re: /(?<![\w-])[a-z-]+-\(var\(--[a-z0-9-]+\)\)/g,
    label: 'wrapped token (compiles to nothing)',
    hint: 'rounded-(--radius-sm) — drop the var() wrapper',
  },
  {
    re: /(?<![\w-])[a-z-]+-\((?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+),\s*(?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+)\)/g,
    label: 'multi-token utility (compiles to nothing)',
    hint: 'shadow-(--shadow-card) — name the composite in ui99-elevation.css',
  },
  {
    // A stray `)` from an over-greedy codemod leaves `shadow-(--shadow-card))`.
    // The lookahead keeps it from firing on a legitimate `)` that closes a
    // surrounding expression.
    re: /(?<![\w-])[a-z-]+-\([^()\n]*\)\)(?=[\s'"`}]|$)/g,
    label: 'stray closing paren (compiles to nothing)',
    hint: 'rounded-(--radius-lg) — drop the extra ")"',
  },
];

// ── CSS must actually parse ──────────────────────────────────────────────────
// tsc, vitest and this gate all read the token files as TEXT, so an orphaned
// declaration or a half-deleted rule passed every one of them and still broke
// the production build with "Missing opening {". A gate that cannot tell
// well-formed CSS from a fragment is not a gate.
{
  const cssFiles = readdirSync(resolve(root, 'src/styles')).filter((f) => f.endsWith('.css'));
  const broken = [];
  for (const f of cssFiles) {
    const src = readFileSync(resolve(root, 'src/styles', f), 'utf8')
      // Strip comments and string literals so braces inside them don't count.
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
    let depth = 0;
    for (const ch of src) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      if (depth < 0) break;
    }
    if (depth !== 0) {
      broken.push(`${f}: ${depth > 0 ? `${depth} unclosed block(s)` : 'unbalanced close'}`);
    }
  }
  if (broken.length) {
    console.error(`\n✗ tokens-gate: malformed CSS — the production build will fail:\n  ${broken.join('\n  ')}\n`);
    process.exit(1);
  }
}

for (const f of files) {
  if (VALUE_ONLY_FILES.has(f)) continue;
  const src = readFileSync(resolve(uiDir, f), 'utf8');
  src.split('\n').forEach((line, i) => {
    for (const rule of DEAD_UTILITY) {
      for (const m of line.matchAll(rule.re)) {
        deadUtilityViolations.push(
          `${f}:${i + 1}: ${rule.label} — "${m[0].slice(0, 70)}" → ${rule.hint}`,
        );
      }
    }
  });
}

if (deadUtilityViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${deadUtilityViolations.length} utility class(es) that Tailwind cannot compile:\n`,
  );
  for (const v of deadUtilityViolations) console.error('  ' + v);
  console.error(
    '\nThese render as NO border-radius / NO shadow. See §5c of docs/standards.md.\n',
  );
  process.exit(1);
}

console.log(
  `✓ tokens-gate: ${files.length} kit files clean — no hardcoded hexes, no arbitrary or raw-scale ` +
    `elevation/radius/blur/type, no dead utilities, all ${declared.size} tokens declared ` +
    `(4 rules: hex · structural · declared · compiles)`,
);
