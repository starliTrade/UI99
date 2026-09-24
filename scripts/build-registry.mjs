/**
 * UI99 Registry Generator — v2 (source-of-truth scan)
 * Generates public/registry.json (shadcn registry schema) FROM THE REAL
 * DIRECTORY: every module in src/components/ui is a registry item unless it
 * is explicitly excluded below. Deterministic — regenerate, never edit.
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
 * EXCLUDE POLICY — every exclusion is a documented product decision:
 * - `index` / `kit`             → barrel modules, not installable components
 * - `motion`                    → choreography module; nothing in the kit imports it
 *                                 (components import 'motion/react' from npm directly)
 * - `theme`                     → KEPT as an installable item: 16 primitives import
 *                                 `useIsDark` from './theme', so `add <x>` pulls it
 *                                 alongside the ui99-theme token layer
 * - `TopHeader`, `BottomNavigation`, `UI99Wordmark` → app chrome, not kit primitives
 * - `TokensAuditPlayground`     → internal QA tool for the audit checklist (docs §12)
 * - `Toast`                     → context-bound (AppContext); context-free siblings
 *                                 (EmptyState/LoadingState) live in the same file and are
 *                                 installed via the `feedback` item
 * - `LinearIssueTracker`        → context-bound domain composite (demo of Blocks, not a primitive)
 * - `ObjectCard`                → context-bound (imports ObjectContext/AuthContext); the kit ships
 *                                 context-free composites (MetricCard, StatTile, DataTable, …)
 */
const EXCLUDED_MODULES = new Set([
  'index',
  'kit',
  'motion',
  'TopHeader',
  'BottomNavigation',
  'UI99Wordmark',
  'TokensAuditPlayground',
  'AllPropsPlayground', // docs-side live lab (consumes kit; not a primitive)
  'Toast',
  'LinearIssueTracker',
  'ObjectCard',
]);

/** npm deps the published package already carries at runtime (manifest mirror). */
const KIT_RUNTIME_DEPS = [
  'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react', 'motion',
  '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio', '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible', '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card',
  '@radix-ui/react-label', '@radix-ui/react-menubar',
  '@radix-ui/react-navigation-menu', '@radix-ui/react-popover',
  '@radix-ui/react-progress', '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area', '@radix-ui/react-separator',
  '@radix-ui/react-slider', '@radix-ui/react-switch', '@radix-ui/react-tabs',
  '@radix-ui/react-toggle', '@radix-ui/react-toggle-group',
  '@radix-ui/react-tooltip', 'cmdk',
];

const PUBLISHED_DEPS = new Set(KIT_RUNTIME_DEPS);

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

/** Real npm packages imported by a module (excluding relative + react). */
function importedDeps(src) {
  const deps = new Set();
  const re = /from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const spec = m[1];
    if (spec.startsWith('.') || spec.startsWith('@/') || spec === 'react') continue;
    const scoped = spec.startsWith('@');
    const pkgName = scoped ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    if (PUBLISHED_DEPS.has(pkgName)) deps.add(pkgName);
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

const registryVersion = pkg.version ?? '1.0.0';
const items = [];

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
  items.push({
    name: kebab,
    type: 'registry:ui',
    dependencies: deps,
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
  });
}

// ---- 2. registry:lib item: the `cn` util every copied component imports ----
const utilsSrc = readFileSync(resolve(root, 'src/lib/utils.ts'), 'utf8');
items.push({
  name: 'utils',
  type: 'registry:lib',
  dependencies: ['clsx', 'tailwind-merge'],
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
  `[registry] components: ${items.filter((i) => i.type === 'registry:ui').length}, lib: ${items.filter((i) => i.type === 'registry:lib').length}, theme: ${items.filter((i) => i.type === 'registry:theme').length}`,
);

// ---- 4. Generated kit-count module — the ONLY source of the headline number ----
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
