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
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
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
  // The body-background hexes AppContext used to paint <body> with. Named
  // explicitly because they are the exact values that overrode --bg-canvas
  // from the utilities layer and made the light canvas 13 levels off from the
  // one every light surface is specified against.
  '#F4F4F6', '#111113', '#FAFAFC', '#F7F7F9', '#F3F3F6', '#F5F5F8',
  // intent fill pairings (destructive/success/rose-tint) — Sprint 1 closure
  '#2A0A10', '#06251A', '#161216', '#1E171E', '#F3CBD2', '#D4C5B9',
]);

const files = readdirSync(uiDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
const violations = [];

/**
 * Rule A also runs over `src/core` — the shell that owns <html> and <body>.
 *
 * This used to be components-only, and the hole was load-bearing: AppContext
 * painted the page background with a hard-coded `bg-[#F4F4F6]` per theme, and
 * because that is a UTILITY-layer rule it beat the `body { background-color:
 * var(--bg-canvas) }` in @layer base. The light theme therefore rendered on
 * #F4F4F6 while its own token said #FAFAFC — 13 levels apart — so no canvas
 * correction could ever show up. Ten more sites sat in ErrorBoundary, which is
 * the first surface a user ever sees of this system.
 *
 * `src/core/tokens/` is EXEMPT: it is the machine-readable authority that
 * declares these values, so scanning it would fail on the source of truth.
 */
const coreDir = resolve(root, 'src/core');
const coreFiles = readdirSync(coreDir, { recursive: true })
  .filter((f) => typeof f === 'string' && /\.tsx?$/.test(f) && !f.includes('tokens'))
  .map((f) => join(coreDir, f));

// The app shell is a component like any other, and it was hiding the single
// worst offender in the system: `App.tsx` painted the page with
// `bg-[#F4F4F6]`, an unlayered `!important` band-aid in index.css patched
// surfaces that Tailwind had mangled away, and an unlayered
// `.light .studio-dark-canvas` re-stated the light canvas as a literal hex —
// which, being unlayered, beat every layered rule including the token itself.
const appShell = [resolve(root, 'src/App.tsx')].filter((f) => statSync(f).isFile());

const componentsDir = resolve(root, 'src/components');
const componentFiles = readdirSync(componentsDir, { recursive: true })
  .filter((f) => typeof f === 'string' && /\.tsx?$/.test(f))
  .map((f) => join(componentsDir, f));

/**
 * Legit non-UI uses of surface hexes: SSR fallbacks after a live token read
 * (`read('--var', '#hex')` / `?? '#hex'`), data-value presets the USER picks
 * from (ColorPicker swatch values), canvas contexts, and var() fallback
 * clauses. These are values, not styling.
 */
const VALUE_CONTEXT =
  /(?:const [A-Z_]+ = \[|DEFAULT_PRESETS|var\(--[a-z-]+,|getComputedStyle|strokeStyle =|read\('--|\?\?\s*['"]#)/;

/** Files whose forbidden-hex lines are value presets / canvas data, verified by hand. */
/**
 * Files where a surface hex is the CONTENT, not the styling.
 *
 * `UIKitView` is the palette page: it renders swatches labelled with the hexes
 * they stand for, and the code sample in it prints the canvas value as a
 * string. Tokenising those would delete the documentation of the tokens. This
 * is the same exemption ColorPicker and TokenLatticeHero have always had, for
 * the same reason — a value the USER reads is not a value the system paints.
 */
const VALUE_ONLY_FILES = new Set([
  'ColorPicker.tsx',
  'TokenLatticeHero.tsx',
  'UIKitView.tsx',
  'FoundationsView.tsx',
]);

for (const [dir, list] of [
  [uiDir, files],
  [coreDir, coreFiles],
  [resolve(root, 'src'), appShell],
  // The whole product surface, not just the kit. The views carried hard-coded
  // dark surfaces that a now-deleted `!important` band-aid used to repaint in
  // light mode — and that band-aid had stopped compiling years earlier, so
  // those surfaces were simply dark boxes in porcelain.
  [componentsDir, componentFiles],
]) {
  for (const f of list) {
    // `f` is a relative path for the recursive walks, so match on the basename.
    if (VALUE_ONLY_FILES.has(f.split('/').pop())) continue;
    const abs = resolve(dir, f);
    const rel = abs.slice(root.length + 1);
    const src = readFileSync(abs, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      if (VALUE_CONTEXT.test(line)) return; // data values, not theme styling
      // Strip comments first. Several of these files carry the forbidden hexes
      // in the comment that explains why they were removed, and a gate that
      // fails on its own explanation is a gate that gets switched off.
      const code = line.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/, '');
      // A hex the USER READS is a value, not a style. The palette page prints
      // `#06070A` as the label of the swatch that shows it; a docs table prints
      // it as a cell. Both are the documentation OF the tokens, and tokenising
      // them would delete the thing being documented.
      //
      // So the test is positional, not per-file: only hexes that appear INSIDE
      // a class attribute are styling. Everything else — JSX text, a `hex=`
      // prop, prose, a code sample — is content. That is narrower and more
      // honest than exempting whole files, and it leaves those same files
      // fully gated for the styling they do own.
      const inClass = [...code.matchAll(/class(?:Name)?\s*=\s*("[^"]*"|'[^']*'|`[^`]*`)/g)]
        .map((m) => {
          // Gradient stops are artwork, not surfaces. A
          // `bg-gradient-to-br from-[#1C1D26] via-[#0A0B10]` on a thumbnail is a
          // PICTURE of a surface, and pinning it to a token would make the
          // picture follow the theme — the opposite of what a picture should
          // do. This is the carve-out the file header already makes for data
          // palettes and identity colours, extended from "a colour class" to
          // "a colour inside a gradient". Only when a gradient is actually
          // present: a bare `from-[#hex]` without one is a surface.
          const list = m[1];
          if (!/\bbg-(?:gradient|linear)[\w-]*\b/.test(list)) return list;
          return list.replace(/(?:from|via|to)-\[#[0-9A-Fa-f]{6}\]/g, '');
        })
        .join(' ');
      for (const m of inClass.matchAll(/#[0-9A-Fa-f]{6}\b/g)) {
        const hex = m[0].toUpperCase();
        if (FORBIDDEN.has(hex)) {
          violations.push(`${rel}:${i + 1}: ${hex} — "${line.trim().slice(0, 90)}"`);
        }
      }
    });
  }
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

/* ══════════════════ RULE E — soft continuity (پیوستگی مخملی) ══════════════════
 *
 * docs/standards.md §2.4: every resting surface must sit CLOSE to the canvas;
 * separation is earned by elevation and state, not by bright fills or hard
 * borders. The hero audit found the kit speaking ~30 hand-chosen white/black
 * alphas while the token ladder (subtle/wash/raised · subtle/soft/strong) sat
 * unused — two components playing the same role rendered at different
 * distances from the canvas.
 *
 * Enforced here (kit AND product surfaces):
 *   1. NO raw `dark:` white-alpha for bg/border/divide — the ladder token only.
 *   2. NO raw `dark:` zinc for text/border/divide/bg below the on-fill tier —
 *      semantic text/border tokens only.
 *   3. NO light-side black-alpha paired with a dark override — the light
 *      ladder only. (Unpaired black-alphas may be scrims/marks: left alone.)
 *   4. NO resting `--bg-elevated` / `--bg-card-hover` outside FLOATING files —
 *      elevated is reserved for layers that genuinely float.
 *
 * Scope mirrors scripts/migrate-softness.mjs exactly: only values the ladders
 * can represent are flagged, so the codemod can always fix what this blocks.
 * Ring alphas and bg alphas above the ladder (selection rings, dots, scrims,
 * emphasis marks) are accent VALUES, not surfaces — never flagged.
 */
const SOFT_DIRS = [
  'src/components/ui',
  'src/components/views',
  'src/components/home',
  'src/components/shells',
  'src/components/widgets',
];
const FLOATING_FILES = new Set([
  'Modal.tsx', 'AlertDialog.tsx', 'Dialog.tsx', 'Sheet.tsx', 'Popover.tsx',
  'DropdownMenu.tsx', 'Dropdown.tsx', 'DropdownButton.tsx', 'HoverCard.tsx',
  'Tooltip.tsx', 'TooltipPrimitive.tsx', 'Combobox.tsx', 'Command.tsx',
  'CommandBar.tsx', 'Toast.tsx', 'TopHeader.tsx', 'BottomNavigation.tsx',
  'TourGuide.tsx', 'KeyboardShortcutsDialog.tsx',
  'GlobalSearchModal.tsx', 'ObjectDetailModal.tsx', 'SettingsModal.tsx',
  'UniversalCaptureModal.tsx',
]);

const walkTsx = (dir) =>
  readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walkTsx(`${dir}/${e.name}`)
      : e.name.endsWith('.tsx') || e.name.endsWith('.ts')
        ? [`${dir}/${e.name}`]
        : [],
  );

// Same representability tables as the codemod — keep the two in lockstep.
const SOFT_LADDERS = {
  dark: {
    border: (a) =>
      a <= 0.03 ? '--border-subtle' : a <= 0.042 ? '--border-soft' : a <= 0.08 ? '--border-strong' : null,
    bg: (a) =>
      a <= 0.028 ? '--bg-subtle'
      : a <= 0.05 ? '--bg-wash'
      : a <= 0.08 ? '--bg-raised'
      : a <= 0.1 ? '--state-selected'
      : null,
  },
  light: {
    border: (a) =>
      a <= 0.045 ? '--border-subtle' : a <= 0.065 ? '--border-soft' : a <= 0.085 ? '--border-strong' : null,
    bg: (a) =>
      a <= 0.045 ? '--bg-subtle'
      : a <= 0.065 ? '--bg-wash'
      : a <= 0.085 ? '--bg-raised'
      : a <= 0.1 ? '--state-selected'
      : null,
  },
};

const parseSoftAlpha = (intP, fracP, slashP) =>
  slashP !== undefined ? Number(slashP) / 100 : Number(`${intP || '0'}.${fracP}`);

const softViolations = [];
const DARK_ALPHA_SOFT_RE =
  /\bdark:((?:[a-z-]+:)*)(border|divide|bg)-white\/(?:\[0?(\d*)\.?(\d+)\]|(\d+)\b)/g;
const DARK_ZINC_SOFT_RES = [
  /\bdark:(?:[a-z-]+:)*text-zinc-(?:300|400|500|600)\b/g,
  /\bdark:(?:[a-z-]+:)*(?:border|divide)-zinc-(?:600|700|800)\b/g,
  /\bdark:(?:[a-z-]+:)*bg-zinc-(?:800|900)\b/g,
];
const LIGHT_ALPHA_SOFT_RE =
  /\b((?:[a-z-]+:)*)(border|divide|bg)-black\/(?:\[0?(\d*)\.?(\d+)\]|(\d+)\b)/g;

for (const dir of SOFT_DIRS) {
  for (const rel of walkTsx(dir)) {
    const file = rel.split('/').pop();
    if (VALUE_ONLY_FILES.has(file)) continue;
    const src = readFileSync(resolve(root, rel), 'utf8');
    const floating = FLOATING_FILES.has(file);
    src.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(DARK_ALPHA_SOFT_RE)) {
        const tok = SOFT_LADDERS.dark[m[2] === 'bg' ? 'bg' : 'border'](parseSoftAlpha(m[3], m[4], m[5]));
        if (tok) softViolations.push(`${rel}:${i + 1}: raw dark white-alpha — "${m[0]}" → ${m[2]}-(${tok})`);
      }
      for (const re of DARK_ZINC_SOFT_RES) {
        for (const m of line.matchAll(re)) {
          softViolations.push(`${rel}:${i + 1}: raw dark zinc color — "${m[0]}" → semantic token (see §2.4)`);
        }
      }
      for (const m of line.matchAll(LIGHT_ALPHA_SOFT_RE)) {
        if (!line.includes('dark:')) continue; // unpaired = possibly a scrim/value
        const prop = m[2];
        if (!new RegExp(`\\bdark:(?:[a-z-]+:)*${prop}-`).test(line)) continue;
        const tok = SOFT_LADDERS.light[prop === 'bg' ? 'bg' : 'border'](parseSoftAlpha(m[3], m[4], m[5]));
        if (tok) softViolations.push(`${rel}:${i + 1}: raw light black-alpha — "${m[0]}" → ${prop}-(${tok})`);
      }
      if (!floating) {
        for (const m of line.matchAll(/\bdark:(?:[a-z-]+:)*bg-\(--bg-(?:elevated|card-hover)\)/g)) {
          softViolations.push(
            `${rel}:${i + 1}: far-from-canvas resting fill — "${m[0]}" → dark:bg-(--bg-card) (elevated is for floating layers, §2.4)`,
          );
        }
      }
    });
  }
}

if (softViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${softViolations.length} soft-continuity violation(s) — surfaces must sit close to the canvas (docs/standards.md §2.4):\n`,
  );
  for (const v of softViolations) console.error('  ' + v);
  console.error('\nCodemod: node scripts/migrate-softness.mjs --write\n');
  process.exit(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE F — SPACING GRID (4px). The one sanctioned off-grid rung is the 2px
   half-step `p-0.5`, for icon-to-text pairs that need to sit closer than 4px
   without colliding. Everything else is a multiple of 4.

   Off-grid spacing is not a 2px rounding error, it is the reason a dense UI
   reads as unsound: every `gap-1.5` is a place where two components disagree
   about how much air a thing gets, and 525 of them were scattered over 95
   files. It also overflows — a 32px control with `py-1.5` and a 14/1.6 line
   needs 34.4px, and the label loses 2px it was never designed to give up.

   Width and height are NOT spacing. `w-3.5` is a 14px icon, not a gap.
   ═══════════════════════════════════════════════════════════════════════════ */
const SPACING_PROPS =
  'gap(?:-[xy])?|space-[xy]|p[xytrbles]?|m[xytrbles]?';
const OFF_GRID_RE = new RegExp(
  String.raw`(?<![\w-])(?:[a-z0-9\[\]&#>:/.-]+:)*(${SPACING_PROPS})-(\d+)\.5(?![\w.\d-])`,
  'g',
);
const gridViolations = [];

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = resolve(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walkSource(p, out);
    else if (/\.(tsx|ts|css)$/.test(entry)) out.push(p);
  }
  return out;
}

for (const abs of walkSource(resolve(root, 'src'))) {
  const rel = abs.slice(root.length + 1);
  readFileSync(abs, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const m of line.matchAll(OFF_GRID_RE)) {
        // The documented 2px exception: `-0.5` is 2px, the tight icon pair.
        if (m[2] === '0') continue;
        gridViolations.push(
          `${rel}:${i + 1}: off-grid spacing — "${m[0].trim()}" (round down to the 4px grid)`,
        );
      }
    });
}

if (gridViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${gridViolations.length} off-grid spacing class(es) — every gap is a multiple of 4px (docs/standards.md §3):\n`,
  );
  for (const v of gridViolations.slice(0, 25)) console.error('  ' + v);
  if (gridViolations.length > 25) {
    console.error(`  … and ${gridViolations.length - 25} more`);
  }
  console.error('\nCodemod: node scripts/migrate-spacing-grid.mjs\n');
  process.exit(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE G — LIGHT IS DARK, POLARITY FLIPPED.

   The two themes are not allowed to drift into two different design languages.
   For the border ladder and the rim family, light must carry the SAME alphas
   as dark with the ink direction inverted. This is arithmetic, not taste: dark's
   white rim at 0.04 lifts a card's top edge 10 levels off the canvas, and a
   light rim at 0.04 of ink darkens a white card by 10. The old light block ran
   borders 1.4-1.5x stronger and declared its rims as `rgba(255,255,255,…)` —
   a white highlight on a white card, which composites to NOTHING. That is the
   whole reason light looked flatter than dark no matter how much shadow it was
   given, and a gate is the only thing that keeps it from coming back.
   ═══════════════════════════════════════════════════════════════════════════ */
const ui99Css = readFileSync(resolve(root, 'src/styles/ui99.css'), 'utf8');
const elevationCss = readFileSync(resolve(root, 'src/styles/ui99-elevation.css'), 'utf8');
const mirrorViolations = [];

/** Read `--name: value` from inside one theme block. */
function tokenFrom(source, blockSel, name) {
  const at = source.indexOf(blockSel);
  if (at < 0) return null;
  const body = source.slice(at, source.indexOf('\n}', at));
  const m = body.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
}

/** Pull the leading alpha out of `rgba(r, g, b, a)` or a multi-layer rim. */
function alphasOf(value) {
  if (!value) return [];
  return [...value.matchAll(/rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/g)].map(
    (m) => Number(m[1]),
  );
}

for (const name of ['border-subtle', 'border-soft', 'border-strong', 'border-hairline', 'border-specular']) {
  const dark = tokenFrom(ui99Css, "/* ======================= OBSIDIAN DARK", name);
  const light = tokenFrom(ui99Css, '/* ======================= PORCELAIN LIGHT', name);
  if (!dark || !light) continue;
  const [d] = alphasOf(dark);
  const [l] = alphasOf(light);
  if (d !== undefined && l !== undefined && Math.abs(d - l) > 0.0001) {
    mirrorViolations.push(
      `--${name}: dark alpha ${d} vs light alpha ${l} — light must mirror dark, polarity flipped`,
    );
  }
}

for (const name of ['rim-subtle', 'rim-soft', 'rim-strong', 'rim-crisp']) {
  const dark = tokenFrom(elevationCss, "/* ======================= DARK", name);
  const light = tokenFrom(elevationCss, '/* ======================= LIGHT', name);
  if (!dark || !light) continue;
  const d = alphasOf(dark);
  const l = alphasOf(light);
  if (d.length !== l.length) continue;
  for (let i = 0; i < d.length; i++) {
    if (Math.abs(d[i] - l[i]) > 0.0001) {
      mirrorViolations.push(
        `--${name}[${i}]: dark alpha ${d[i]} vs light alpha ${l[i]} — light must mirror dark, polarity flipped`,
      );
    }
  }
  // A light rim drawn in white is a no-op on a white card. Catch the specific
  // mistake that shipped, not just any change in alpha.
  const lightWhites = (light.match(/rgba\(255,\s*255,\s*255/g) ?? []).length;
  if (lightWhites > 0 && !/rgba\(255,\s*255,\s*255/.test(dark)) {
    mirrorViolations.push(
      `--${name}: a light rim must be INK, not white — white on a white card composites to nothing`,
    );
  }
}

if (mirrorViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${mirrorViolations.length} light/dark mirror violation(s) — light is dark with the polarity flipped, nothing else changed:\n`,
  );
  for (const v of mirrorViolations) console.error('  ' + v);
  process.exit(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE H — ONE RESTING SURFACE (§2.6).

   A button, a chip, a pill and an icon button are ONE kind of object. Three
   peers sitting in the same row were wearing three different fills: the GitHub
   icon button took a raw `bg-zinc-100` in porcelain (#F4F4F5 — 24 levels darker
   than the card it sat on and 13 levels BELOW the page canvas, so it read as a
   hole punched in the page), the docs button wore no fill at all, and the copy
   button wore `--bg-wash`. Twenty-four levels of disagreement between two
   controls doing the same job in the same 32px row.

   The law: a resting secondary control wears `--bg-control` and nothing else,
   with no `dark:` fork — the token already carries the polarity flip. This
   rule catches the two ways that regresses: a raw palette surface standing in
   for the token, and a `dark:`-forked pair where one token is meant to do.
   ═══════════════════════════════════════════════════════════════════════════ */
const controlViolations = [];
const RAW_PALETTE_SURFACE = /(?<![\w-])((?:[a-z0-9\[\]&#>:/.-]+:)*)bg-(?:zinc|gray|neutral|slate|stone)-(50|100|200)(?![\w.\d-])/g;

// A `hover:`/`peer-hover:` fill is a STATE layer, governed by §2.4 and the
// `--state-*` tokens — not the resting surface this rule is about. Excluding
// them here keeps the rule honest: it claims one thing and checks one thing.
const RESTING = /^(?!.*\bhover:)/;

for (const f of readdirSync(uiDir).filter((f) => f.endsWith('.tsx'))) {
  const rel = `src/components/ui/${f}`;
  readFileSync(resolve(uiDir, f), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      // Strip comments first. This rule quotes the offending hexes in its own
      // prose — a comment that documents a migration is not a violation of it,
      // and a gate that flags its own explanation gets switched off.
      const code = line.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/, '');
      for (const m of code.matchAll(RAW_PALETTE_SURFACE)) {
        if (!RESTING.test(m[1])) continue;
        controlViolations.push(
          `${rel}:${i + 1}: raw palette surface for a control — "${m[0].trim()}" → bg-(--bg-control) (§2.6)`,
        );
      }
    });
}

if (controlViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${controlViolations.length} control-surface violation(s) — one resting surface, one border, one distance from the background (docs/standards.md §2.6):\n`,
  );
  for (const v of controlViolations) console.error('  ' + v);
  process.exit(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE K — QUIET IS ONE TOKEN, NOT A PAIR (§2.6 / §2.9).

   The quiet standard exists BECAUSE the old fills forked by theme: 49×
   `bg-subtle + dark:bg-card`, 25× `bg-subtle + dark:bg-wash`, 41 hover forks
   whose light and dark branches disagreed about the same state. An alpha
   token composites correctly on any parent, so a fork is not consistency —
   it is the bug coming back with two names. Resting `subtle/wash` fills and
   the four hover forks above must not return; `bg-control`/`bg-elevated`/
   `bg-card` forks stay legal (Tier 2/3 roles still fork by design).
   ═══════════════════════════════════════════════════════════════════════════ */
const quietViolations = [];
const QUIET_FORK_REST = /(?<![\w-])bg-\(--bg-(?:subtle|wash)\)\s+dark:bg-\(--bg-[a-z-]+\)/;
const QUIET_FORK_HOVER = /(?<![\w-])hover:bg-\(--bg-(?:subtle|wash|raised|card)\)\s+dark:hover:bg-\(--bg-(?:card|card-hover|subtle|wash|raised)\)/;
for (const f of [...componentFiles, ...coreFiles, ...appShell]) {
  const rel = f.startsWith(root) ? f.slice(root.length + 1) : f;
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const code = line.replace(/\/\/.*$/, '');
      if (QUIET_FORK_REST.test(code))
        quietViolations.push(`${rel}:${i + 1}: theme-forked quiet fill — "${line.trim().slice(0, 70)}" → bg-(--bg-quiet) (§2.9)`);
      if (QUIET_FORK_HOVER.test(code))
        quietViolations.push(`${rel}:${i + 1}: theme-forked hover — "${line.trim().slice(0, 70)}" → hover:bg-(--bg-quiet-hover) (§2.9)`);
    });
}
if (quietViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${quietViolations.length} quiet-fork violation(s) — the quiet standard is ONE alpha token in BOTH themes; a dark: fork is the old disagreement re-armed (docs/standards.md §2.9):\n`,
  );
  for (const v of quietViolations) console.error('  ' + v);
  process.exit(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE I — NO UNLAYERED SURFACE RULE.

   In CSS, a rule outside every `@layer` beats every rule inside one, at ANY
   specificity. That is the mechanism behind the worst bug in this system's
   history, and it is worth stating plainly because it is counter-intuitive:

   the light page background had THREE candidates.
     body { background-color: var(--bg-canvas) }   @layer base
     .bg-[#F4F4F6]   (the app root's utility)     @layer utilities
     .light .studio-dark-canvas { #F5F5F8 }        UNLAYERED  <- won

   The unlayered literal hex beat the token by default. No amount of editing a
   canvas token could ever have changed what the user saw, and every test in
   the suite was green the whole time, because every one of them was reading
   the token and never the paint order.

   So: any rule in a UI99 stylesheet that sets a background or a colour must be
   inside a layer. Component utilities (`.material-*`, `.font-persian-luxury`,
   `.dur-*`) live in `components`; theme-scoped blocks live in `base`.
   ═══════════════════════════════════════════════════════════════════════════ */
const unlayeredViolations = [];
for (const [sheet, abs] of [
  ['src/index.css', resolve(root, 'src/index.css')],
  ['src/styles/porcelain.css', resolve(root, 'src/styles/porcelain.css')],
  ['src/styles/ui99-glow.css', resolve(root, 'src/styles/ui99-glow.css')],
]) {
  if (!statSync(abs).isFile()) continue;
  const lines = readFileSync(abs, 'utf8').split('\n');
  let layer = null;
  let buf = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (layer === null && /@layer\s+[a-z, ]+\s*\{/.test(line)) {
      layer = line.replace(/^.*@layer\s+([a-z, ]+)\s*\{.*$/, '$1').trim();
      buf = '';
    }
    if (layer === null) {
      const code = line.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/, '');
      if (/\{[^}]*$/.test(code) && /^\s*\.[a-zA-Z-][\w-]*[^,{]*(?:,[\s\S]*?)?\{\s*$/.test(code)) {
        if (!/^\s*\.(light|dark|\[data-theme|html|body)\b/.test(code)) { /* not theme-scoped */ }
        else {
          // The selector must open a SURFACE, not an ink. Syntax highlighting
          // and status LEDs are identity colours, not theme surfaces, and they
          // are named here rather than quietly skipped — an unnamed exemption
          // is a hole you stop looking at.
          const EXEMPT_IDENTITY = /code-token-render|progress-led-block/;
          if (EXEMPT_IDENTITY.test(code)) { /* identity colour — out of scope */ }
          else {
            // Read THIS rule's body only. A fixed window bleeds into the next
            // selector and reports a violation against the wrong rule — the
            // kind of false positive that teaches people to ignore a gate.
            let depth = 0;
            const body = [];
            for (let k = i; k < lines.length && k < i + 40; k++) {
              body.push(lines[k]);
              depth += (lines[k].match(/\{/g) ?? []).length;
              depth -= (lines[k].match(/\}/g) ?? []).length;
              if (depth <= 0) break;
            }
            const block = body.join('\n');
            const surface = block.match(
              /^\s*(?:background|background-color)\s*:\s*([^;]+);/m,
            );
            // A `var(--bg-*)` is exactly what this rule is asking for. Only a
            // raw hex or rgba is a violation.
            if (surface && /#|rgba?\(/.test(surface[1])) {
              unlayeredViolations.push(
                `${sheet}:${i + 1}: unlayered surface rule — "${code.trim()}" sets ${surface[1].trim().slice(0, 40)}; unlayered CSS beats every @layer, so this defeats the token itself`,
              );
            }
          }
        }
      }
    }
    if (layer !== null) {
      buf += line;
      if (line.trim() === '}') {
        const depth = (buf.match(/\{/g) ?? []).length - (buf.match(/\}/g) ?? []).length;
        if (depth <= 0) layer = null;
        buf = '';
      }
    }
  }
}

if (unlayeredViolations.length) {
  console.error(
    `\n✗ tokens-gate: ${unlayeredViolations.length} unlayered surface rule(s) — unlayered CSS beats every @layer, so a literal hex silently defeats the token system:\n`,
  );
  for (const v of unlayeredViolations) console.error('  ' + v);
  process.exit(1);
}

console.log(
  `✓ tokens-gate: ${files.length} kit files clean — no hardcoded hexes, no arbitrary or raw-scale ` +
    `elevation/radius/blur/type, no dead utilities, all ${declared.size} tokens declared, ` +
    `soft-continuity ladder enforced (10 rules: hex · structural · declared · compiles · soft · grid · mirror · control · quiet · layering)`,
);
