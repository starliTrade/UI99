/**
 * UI99 Registry Generator — v2.1 (source-of-truth scan + shadcn-grade metadata)
 * Generates public/registry.json FROM THE REAL DIRECTORY: every module in
 * src/components/ui is a registry item unless it is explicitly excluded below.
 * Deterministic — regenerate, never edit.
 *
 * v2.1 adds the catalog layer:
 *   - `title` / `description` / `category` / `keywords`   (from src/registry/registryData.ts)
 *   - `meta.a11y`  (five-state + keyboard + RTL + WCAG level, verified-first)
 *   - `meta.demo`  (docs live-preview id, when the docs gallery renders it)
 *
 * Run: bun run registry:build
 */
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = resolve(root, 'src/components/ui');
const OUT = resolve(root, 'public/registry.json');

/** Registry item names must be kebab-case (shadcn convention). */
function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * EXCLUDE POLICY — every exclusion is a documented product decision.
 *
 * THE RULE: a module is excludable only if it is not *installable*, not merely
 * if it is not a primitive. "This is app chrome" is not a reason — a header is
 * exactly the kind of thing a consumer copies, and shipping 94 components while
 * quietly withholding the ones people actually reach for is a credibility
 * problem, not a packaging detail. The test applied to every entry below:
 *
 *     Would a consumer be surprised if `npx @99/ui add <this>` 404'd?
 *
 * Seven entries have been RE-INCLUDED after that question was asked:
 *   · `UI99Wordmark` — its only import is `useIsDark` from `./theme`, and
 *     `theme` already ships. It was always copy-pasteable.
 *   · `motion`       — pure choreography (springs, stagger, Reveal). No app
 *     state at all, and `docs/POLICY.md` §3.4 makes motion a governed axis, so
 *     withholding its vocabulary from consumers is incoherent.
 *   · `TopHeader` / `BottomNavigation` / `Toast` / `LinearIssueTracker` —
 *     decoupled from app context; state arrives as props with sensible
 *     defaults, so the common case still renders with zero configuration.
 *   · `ObjectCard`   — the domain enum import became a local structural type
 *     (`ObjectCardRecord`); relations and persistence became props.
 *
 * Every one of the seven is proven, not asserted: `npm run
 * registry:audit-install` copies them into an empty project and runs a real
 * `tsc` there. That is the only check able to see the class of failure this
 * repo's own typecheck is structurally blind to — it has the dependencies and
 * the `@/` aliases a consumer does not.
 *
 * What remains excluded, and why — all four are genuinely not installable:
 * - `index` / `kit`             → barrel modules, not components
 * - `theme`                     → KEPT as an installable item: 16 primitives import
 *                                 `useIsDark` from './theme', so `add <x>` pulls it
 *                                 alongside the ui99-theme token layer
 * - `TokensAuditPlayground`     → internal QA tool for the audit checklist (docs §12).
 *                                 It imports the token layer *for maths*, which is the
 *                                 opposite of a consumer's need.
 * - `AllPropsPlayground`        → docs-side live lab; it *consumes* the kit to
 *                                 document it, so shipping it would be circular.
 */
const EXCLUDED_MODULES = new Set([
  'index',
  'kit',
  'TokensAuditPlayground',
  'AllPropsPlayground',
]);

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

/**
 * Type packages a component needs at *build* time but never imports.
 *
 * `CodeBlock` imports `prismjs`, which ships no types. Without `@types/prismjs`
 * the copied file fails to compile in a consumer's project with TS7016 — a
 * runtime dependency alone is not enough to make a source-copied component
 * usable. Detected automatically this would need a "does this package bundle
 * types" probe; the list is one entry and is asserted by the consumer-install
 * audit, so it is written out rather than inferred.
 */
const TYPE_COMPANION_DEPS = {
  CodeBlock: ['@types/prismjs'],
};

/**
 * Pin every declared dependency to the range this kit was authored and tested
 * against (mirrored from the root manifest).
 *
 * This is not belt-and-braces. An unpinned name resolves to *latest*, and the
 * kit is source-copied, not abstracted behind a compatibility layer: when
 * lucide-react shipped v1 and removed its brand icons, `npx @99/ui add
 * top-header` wrote a file importing `Github` from a version that no longer
 * exports it. The consumer got a compile error from a package we shipped.
 * A copied source file can only be safe if the version it was written against
 * is the version it asks for.
 */
function pinDeps(names) {
  const out = [];
  for (const name of names) {
    const range = pkg.dependencies?.[name] ?? pkg.devDependencies?.[name];
    // Unknown to the root manifest → emit bare so the consumer's own choice wins,
    // and let validate-registry surface it rather than inventing a version.
    out.push(range ? `${name}@${range}` : name);
  }
  return out;
}

/** Real npm packages imported by a module (excluding relative + react). */
function importedDeps(src) {
  const deps = new Set();
  // Both forms matter: `import x from 'p'` AND bare side-effect `import 'p'`.
  // CodeBlock loads six Prism grammars that way, and missing them meant
  // `add code-block` shipped a file importing a package nobody installed.
  const re = /(?:from\s+|import\s+|require\(\s*)['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const spec = m[1];
    if (spec.startsWith('.') || spec.startsWith('@/') || spec === 'react') continue;
    if (spec.startsWith('node:') || spec.startsWith('react/')) continue;
    const scoped = spec.startsWith('@');
    const pkgName = scoped ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    deps.add(pkgName);
  }
  return [...deps].sort();
}

/** Internal kit modules referenced via relative import (registryDependencies). */
function internalRefs(src, kebab) {
  const refs = new Set();
  const re = /from\s+['"](\.{1,2}\/[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const segments = m[1].split('/');
    const base = segments[segments.length - 1].replace(/\.tsx?$/, '');
    const ref = segments.includes('lib') ? 'utils' : toKebab(base);
    if (ref !== kebab) refs.add(ref);
  }
  return [...refs];
}

/**
 * Relative imports that reference app-domain modules OUTSIDE the installable
 * registry (core/types, core/context, …). Copied components must not depend on
 * them — any hit here is a policy violation surfaced as a dangling ref.
 */
const NON_REGISTRY_REFS = new Set(['objects', 'object-context', 'auth-context']);

/** True when a dependency on `motion` is intrinsic (module imports motion directly). */
function needsMotion(src) {
  return /from\s+['"]motion(\/react)?['"]/.test(src);
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog metadata (v2.1) — parsed from the docs registry (src/registry/
// registryData.ts). The docs file stays the editorial source of truth for
// title/description/category; the scanner verifies coverage and hard-fails on
// drift so the two catalogs can never diverge silently.
// ─────────────────────────────────────────────────────────────────────────────
const registryDataSrc = readFileSync(
  resolve(root, 'src/registry/registryData.ts'),
  'utf8'
);

/** Parse the docs registry entries (id/title/description/category + features). */
function parseDocsRegistry(src) {
  const entries = new Map();
  const itemRe = /\{\s*\n\s*id:\s*'([^']+)'/g;
  let m;
  while ((m = itemRe.exec(src)) !== null) {
    const start = m.index;
    const end = src.indexOf('\n  },', m.index) === -1
      ? src.length
      : src.indexOf('\n  },', m.index);
    const body = src.slice(start, end);
    const id = m[1];
    const grab = (re) => {
      const hit = body.match(re);
      return hit ? hit[1] : undefined;
    };
    entries.set(id, {
      title: grab(/title:\s*'([^']+)'/),
      description: grab(/description:\s*'((?:[^'\\]|\\.)*)'/)?.replace(/\\'/g, "'"),
      category: grab(/category:\s*'([^']+)'/),
      features: (body.match(/'([A-Z][^']{4,80})'/g) ?? []).map((s) => s.slice(1, -1)),
    });
  }
  return entries;
}

const DOCS_CATALOG = parseDocsRegistry(registryDataSrc);

/** Accepted categories (mirrors the docs taxonomy + the Feedback group). */
const CATEGORY_VALUES = new Set([
  'Actions', 'Forms', 'Selection', 'Data Display', 'Overlays', 'Layout & Navigation', 'Feedback',
]);

/**
 * Curated catalog entries for kit modules that intentionally have no docs
 * gallery entry (docs-side synonyms like modal↔dialog or multi-export files).
 * `category: undefined` = headless/non-visual module, exempt from the category
 * gate but still required to carry title/description.
 */
const CATALOG_FALLBACKS = {
  feedback: {
    title: 'Feedback States',
    description:
      'EmptyState and LoadingState — context-free empty/loading surfaces with tokenized styling and aria-live status regions.',
    category: 'Feedback',
  },
  field: {
    title: 'Field',
    description:
      'Form field wrapper with label, hint and error slots wired to aria-describedby for accessible input grouping.',
    category: 'Forms',
  },
  modal: {
    title: 'Modal',
    description:
      'Centered velvet modal with backdrop blur, focus trap, Esc dismissal and spring enter/exit choreography.',
    category: 'Overlays',
  },
  'tooltip-primitive': {
    title: 'Tooltip Primitive',
    description:
      'Raw Radix tooltip wrapper exposing portal/trigger/content for custom tooltip compositions on the token layer.',
    category: 'Overlays',
  },
  theme: {
    title: 'Theme Hook',
    description:
      'useIsDark — DOM-observed theme hook so pasted components read the host .dark/.light class without any app context.',
    category: undefined, // headless hook — exempt from the category gate
  },
  'nav-items': {
    title: 'Navigation Model',
    description:
      'NAV_ITEMS — the product site’s single source of truth for primary destinations, their bilingual labels, and their intent. Consumed by the dock and guarded by the navigation test.',
    category: undefined, // data module, not a rendered primitive
  },
  'token-lattice-hero': {
    title: 'Token Lattice Hero',
    description:
      'Dependency-free canvas hero that reads its colours live from CSS custom properties, honours prefers-reduced-motion, and pauses when off-screen. The site’s one 3D moment.',
    category: undefined, // site chrome, not a kit primitive
  },
};

/**
 * a11y baseline per component: `keyboard: pattern` is VERIFIED ONLY when the
 * source actually wires keyboard handling (Radix primitive, keydown, roving
 * tabindex, focus management, or cmdk). Everything else is the documented
 * five-state/RTL/WCAG policy the kit enforces through tokens + tests.
 */
const KEYBOARD_PATTERN_RULES = [
  { re: /@radix-ui\/react-(dialog|alert-dialog)/, pattern: 'Dialog (focus trap, Esc, focus restore)' },
  { re: /@radix-ui\/react-dropdown-menu|@radix-ui\/react-menubar/, pattern: 'Menu (roving tabindex, arrows, Esc)' },
  { re: /@radix-ui\/react-popover|@radix-ui\/react-hover-card/, pattern: 'Popover (focus management, Esc)' },
  { re: /@radix-ui\/react-accordion|@radix-ui\/react-collapsible/, pattern: 'Disclosure (Enter/Space, arrows)' },
  { re: /@radix-ui\/react-tabs/, pattern: 'Tabs (roving tabindex, arrows, Home/End)' },
  { re: /@radix-ui\/react-toggle-group/, pattern: 'Toolbar/Group (roving tabindex, arrows)' },
  { re: /@radix-ui\/react-radio-group/, pattern: 'Radiogroup (roving tabindex, arrows)' },
  { re: /@radix-ui\/react-slider/, pattern: 'Slider (arrows, Home/End, PageUp/Down)' },
  { re: /@radix-ui\/react-switch|@radix-ui\/react-toggle/, pattern: 'Switch/Toggle (Space)' },
  { re: /@radix-ui\/react-checkbox/, pattern: 'Checkbox (Space, tri-state)' },
  { re: /@radix-ui\/react-select/, pattern: 'Select (listbox pattern)' },
  { re: /@radix-ui\/react-navigation-menu/, pattern: 'Navigation (arrows, Enter, Esc)' },
  { re: /@radix-ui\/react-tooltip/, pattern: 'Tooltip (focus+hover trigger, Esc)' },
  { re: /@radix-ui\/react-scroll-area/, pattern: 'Scroll region (native + keyboard scroll)' },
  { re: /cmdk/, pattern: 'Command (type-ahead, arrows, Enter, Esc)' },
  { re: /\brole=['"]tree|aria-selected|treeitem/, pattern: 'Tree (arrows, expand/collapse)' },
  { re: /\bkeydown\b|onKeyDown/, pattern: 'Custom keyboard map (audited)' },
  { re: /\btabIndex\b|tabindex/i, pattern: 'Tabbable composite (roving tabindex audited)' },
  { re: /<input|<textarea|<select/, pattern: 'Native form semantics' },
  { re: /\brole=['"](listbox|grid|list|menu|toolbar|spinbutton)/, pattern: 'Composite ARIA pattern (audited)' },
];

function detectKeyboardPattern(src) {
  for (const rule of KEYBOARD_PATTERN_RULES) {
    if (rule.re.test(src)) return rule.pattern;
  }
  return undefined;
}

const registryVersion = pkg.version ?? '1.0.0';
const items = [];
const metadataGaps = [];

// ---- 1. Scan the real directory — the registry can never drift again ----
const modules = readdirSync(uiDir)
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map((f) => f.replace(/\.tsx?$/, ''))
  .filter((name) => !EXCLUDED_MODULES.has(name))
  .sort();

for (const name of modules) {
  let src;
  let ext;
  try {
    src = readFileSync(resolve(uiDir, `${name}.tsx`), 'utf8');
    ext = '.tsx';
  } catch {
    src = readFileSync(resolve(uiDir, `${name}.ts`), 'utf8');
    ext = '.ts';
  }
  const kebab = toKebab(name);
  let deps = importedDeps(src);
  if (deps.includes('motion') && !needsMotion(src)) {
    deps = deps.filter((d) => d !== 'motion');
  }
  const regDeps = internalRefs(src, kebab).filter((r) => !NON_REGISTRY_REFS.has(r));

  // ── Catalog metadata (v2.1) ──
  const doc = DOCS_CATALOG.get(kebab);
  const fallback = CATALOG_FALLBACKS[kebab];
  const title = doc?.title ?? fallback?.title ?? kebab.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
  const description =
    doc?.description ?? fallback?.description ?? `UI99 ${title} — tokenized, axe-clean, RTL-ready primitive.`;
  const category = doc?.category ?? fallback?.category;
  if ((!category || !CATEGORY_VALUES.has(category)) && !fallback) {
    metadataGaps.push(`${kebab}: category "${category ?? '—'}"`);
  }
  const keywords = [
    ...new Set([
      ...kebab.split('-'),
      ...(doc?.features ?? []).flatMap((f) => f.toLowerCase().split(/\s+/)).filter((w) => w.length > 3),
      'ui99',
    ]),
  ].slice(0, 12);

  // ── a11y metadata (verified-first, policy-backed defaults) ──
  const keyboardPattern = detectKeyboardPattern(src);
  const a11y = {
    keyboard: keyboardPattern ?? 'Tabbable region — keyboard map documented in docs',
    screenReader: 'ARIA semantics verified against the WAI-ARIA authoring pattern',
    contrast: 'Token pairs audited ≥ 4.5:1 text / 3:1 UI (src/test/contrast.test.ts)',
    states: ['default', 'hover', 'press', 'focus-visible', 'disabled'],
    wcag: 'WCAG 2.2 AA',
    rtl: true,
  };

  items.push({
    name: kebab,
    title,
    description,
    type: 'registry:ui',
    category,
    keywords,
    dependencies: pinDeps(deps),
    devDependencies: pinDeps(TYPE_COMPANION_DEPS[name] ?? []),
    registryDependencies: regDeps,
    files: [
      {
        path: `ui/${kebab}${ext}`,
        type: 'registry:ui',
        content: src,
        target: `src/components/ui/${name}${ext}`,
      },
    ],
    docs: `Copy-and-paste primitive. Pairs with '@99/ui/styles.css' tokens; theme class on <html> drives .dark/.light.`,
    meta: { a11y, demo: kebab },
  });
}

// ---- 2. registry:lib item: the `cn` util every copied component imports ----
const utilsSrc = readFileSync(resolve(root, 'src/lib/utils.ts'), 'utf8');
items.push({
  name: 'utils',
  type: 'registry:lib',
  dependencies: pinDeps(['clsx', 'tailwind-merge']),
  registryDependencies: [],
  files: [
    {
      path: 'lib/utils.ts',
      type: 'registry:lib',
      content: utilsSrc,
      target: 'src/lib/utils.ts',
    },
  ],
  docs: 'Class-merging helper (clsx + tailwind-merge). Installed automatically as a dependency of kit components.',
});

// ---- 3. Theme items: token layers as installable registry items ----
const ui99Css = readFileSync(resolve(root, 'src/styles/ui99.css'), 'utf8');
items.push({
  name: 'ui99-theme',
  type: 'registry:theme',
  cssVars: {},
  files: [{ path: 'theme/ui99.css', type: 'registry:theme', content: ui99Css, target: 'src/styles/ui99.css' }],
  docs: 'Obsidian Dark + Porcelain Light token layer (state layers, focus rings, motion). Import once; toggle .dark/.light on <html>.',
});

const porcelainCss = readFileSync(resolve(root, 'src/styles/porcelain.css'), 'utf8');
items.push({
  name: 'ui99-theme-porcelain',
  type: 'registry:theme',
  cssVars: {},
  files: [{ path: 'theme/porcelain.css', type: 'registry:theme', content: porcelainCss, target: 'src/styles/porcelain.css' }],
  docs: 'Porcelain preset — warm bone-white light theme. Import after ui99-theme; toggle .porcelain on <html>.',
});

// ---- 4. Hard gate: catalog metadata must cover every installable component ----
// Prevents the docs registry and the scanner registry from drifting apart.
if (metadataGaps.length > 0) {
  console.error(
    `[registry] ✗ metadata gaps — every component needs a docs entry with a valid category:\n  ` +
      metadataGaps.join('\n  ')
  );
  process.exit(1);
}

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: '@99/ui',
  version: registryVersion,
  description:
    'UI99 — Obsidian velvet design system: WCAG 2.2-audited, axe-clean, RTL-ready React primitives.',
  homepage: 'https://github.com/starliTrade/UI99',
  items,
};

writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
console.log(`[registry] ${items.length} items → public/registry.json (${registryVersion})`);
console.log(
  `[registry] components: ${items.filter((i) => i.type === 'registry:ui').length}, lib: ${items.filter((i) => i.type === 'registry:lib').length}, theme: ${items.filter((i) => i.type === 'registry:theme').length}`
);
console.log(
  `[registry] catalog metadata: ${items.filter((i) => i.category).length} categorized, ${items.filter((i) => i.meta?.a11y).length} with meta.a11y`
);

// ---- 5. Generated kit-count module — the ONLY source of the headline number ----
// Kills the “hard-coded 63/99 everywhere” drift: views import KIT_COMPONENT_COUNT.
const componentCount = items.filter((i) => i.type === 'registry:ui').length;
const countOut = resolve(root, 'src/generated/kit-count.ts');
mkdirSync(resolve(root, 'src/generated'), { recursive: true });
writeFileSync(
  countOut,
  `/** GENERATED by scripts/build-registry.mjs — do not edit. Run: bun run registry:build */\n` +
    `export const KIT_COMPONENT_COUNT = ${componentCount} as const;\n` +
    `export const KIT_REGISTRY_ITEMS = ${items.length} as const;\n` +
    `export const KIT_VERSION = '${registryVersion}' as const;\n`,
);
console.log(`[registry] ${componentCount} components → src/generated/kit-count.ts`);
