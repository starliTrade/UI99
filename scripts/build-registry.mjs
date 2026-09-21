/**
 * UI99 Registry Generator — Phase 3.1
 * Generates public/registry.json (shadcn registry schema) FROM SOURCE:
 * scans the kit entry's components, parses real package imports for
 * `dependencies`, and emits registry:ui items + a registry:theme item
 * carrying the safa.css token layer. Deterministic — regenerate, never edit.
 *
 * Run: bun run registry:build
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = resolve(root, 'src/components/ui');
const OUT = resolve(root, 'public/registry.json');

/** Modules reachable from the kit entry = registry items. */
const KIT_COMPONENTS = [
  'Button', 'Card', 'Input', 'Switch', 'Checkbox', 'Dropdown', 'Slider',
  'SegmentedControl', 'Breadcrumb', 'Badge', 'Kbd', 'Progress', 'Skeleton',
  'Tooltip', 'Accordion', 'Feedback', 'Modal', 'Dialog', 'Popover', 'Sheet',
  'DropdownMenu', 'Command', 'Tabs', 'SafaBrandLogo', 'theme',
  // Wave A
  'Separator', 'Label', 'Toggle', 'ToggleGroup', 'HoverCard', 'Collapsible',
  'ScrollArea', 'AspectRatio', 'Field', 'Alert',
  // Wave B
  'AlertDialog', 'RadioGroup', 'Table', 'Pagination',
];

/** npm deps the kit requires at runtime (mirrors dist-kit manifest). */
const KIT_RUNTIME_DEPS = [
  'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react',
  '@radix-ui/react-accordion', '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover',
  '@radix-ui/react-slider', '@radix-ui/react-switch', '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip', 'cmdk', 'motion',
];

/** Dependencies declared by the published package (the set CLI users already have). */
const PUBLISHED_DEPS = new Set(KIT_RUNTIME_DEPS);

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

function sourceOf(baseName) {
  const file = resolve(uiDir, `${baseName}.tsx`);
  try {
    statSync(file);
    return readFileSync(file, 'utf8');
  } catch {
    return readFileSync(resolve(uiDir, `${baseName}.ts`), 'utf8');
  }
}

/** Real npm packages imported by a module (excluding relative + react). */
function importedDeps(src) {
  const deps = new Set();
  const re = /from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const spec = m[1];
    if (spec.startsWith('.') || spec.startsWith('@/') || spec === 'react') continue;
    const scoped = spec.startsWith('@');
    const pkgName = scoped
      ? spec.split('/').slice(0, 2).join('/')
      : spec.split('/')[0];
    if (PUBLISHED_DEPS.has(pkgName)) deps.add(pkgName);
  }
  return [...deps].sort();
}

/** Internal kit modules referenced via relative import (registryDependencies). */
function internalRefs(src, name) {
  const refs = new Set();
  // Matches any relative import: './X', '../../lib/utils', '../core/foo'
  const re = /from\s+['"](\.{1,2}\/[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const segments = m[1].split('/');
    const base = segments[segments.length - 1];
    // lib/utils (at any depth) maps to the registry:lib `utils` item
    const ref = segments.includes('lib') ? 'utils' : base;
    if ((KIT_COMPONENTS.includes(ref) || ref === 'utils') && ref !== name)
      refs.add(ref);
  }
  return [...refs];
}

const registryVersion = pkg.version ?? '1.0.0';
const items = [];

for (const name of KIT_COMPONENTS) {
  let src;
  let ext;
  try {
    statSync(resolve(uiDir, `${name}.tsx`));
    ext = '.tsx';
    src = readFileSync(resolve(uiDir, `${name}.tsx`), 'utf8');
  } catch {
    try {
      ext = '.ts';
      src = readFileSync(resolve(uiDir, `${name}.ts`), 'utf8');
    } catch {
      continue; // component file not present — skip deterministically
    }
  }
  const deps = importedDeps(src).filter((d) => d !== 'motion' || name !== 'theme');
  // shadcn convention: kebab-case item names (segmented-control, dropdown-menu…)
  const kebab = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  items.push({
    name: kebab,
    type: 'registry:ui',
    dependencies: deps,
    registryDependencies: internalRefs(src, name)
      .filter((r) => r !== name)
      .map((r) =>
        r.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
      ),
    files: [
      {
        path: `ui/${name.toLowerCase()}${ext}`,
        type: 'registry:ui',
        content: src,
        target: `src/components/ui/${name}${ext}`,
      },
    ],
    docs: `Copy-and-paste primitive. Pairs with '@99/ui/styles.css' tokens; theme class on <html> drives .dark/.light.`,
  });
}

// ---- registry:lib item: the `cn` util every copied component imports ----
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

// ---- Theme item: the safa.css token layer as an installable registry item ----
const safaCss = readFileSync(resolve(root, 'src/styles/safa.css'), 'utf8');
items.push({
  name: 'safa-theme',
  type: 'registry:theme',
  cssVars: {},
  files: [
    {
      path: 'theme/safa.css',
      type: 'registry:theme',
      content: safaCss,
      target: 'src/styles/safa.css',
    },
  ],
  docs: 'Obsidian Dark + Porcelain Light token layer (state layers, focus rings, motion). Import once; toggle .dark/.light on <html>.',
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
