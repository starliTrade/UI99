/**
 * UI99 (@99/ui) — dist-kit package manifest generator (Phase 2.2)
 * Reads the root package.json (name/version) and emits a publish-ready
 * package.json + README.md into dist-kit/.
 * Run: bun run lib:manifest   (invoked by lib:build)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'dist-kit');
mkdirSync(outDir, { recursive: true });

const rootPkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const pkg = {
  name: '@99/ui',
  version: rootPkg.version ?? '0.1.0',
  description:
    'UI99 — a velvet-obsidian, WCAG 2.2-audited React component kit. shadcn-grade DX: copy-anywhere primitives, dual theme (Obsidian Dark / Porcelain Light), axe-clean.',
  license: 'MIT',
  type: 'module',
  sideEffects: ['**/*.css'],
  main: './index.cjs',
  module: './index.js',
  types: './types/components/ui/kit.d.ts',
  bin: { ui99: './cli.js' },
  exports: {
    '.': {
      types: './types/components/ui/kit.d.ts',
      import: './index.js',
      require: './index.cjs',
    },
    './styles.css': './safa.css',
    './dark.css': './dark.css',
    './light.css': './light.css',
    './registry.json': './registry.json',
    './package.json': './package.json',
  },
  files: ['index.js', 'index.cjs', 'safa.css', 'dark.css', 'light.css', 'types', 'cli.js', 'registry.json'],
  keywords: [
    'react',
    'ui',
    'design-system',
    'tailwindcss',
    'tailwind-v4',
    'dark-mode',
    'glassmorphism',
    'accessibility',
    'wcag',
    'rtl',
  ],
  peerDependencies: {
    react: '^18.0.0 || ^19.0.0',
    'react-dom': '^18.0.0 || ^19.0.0',
  },
  dependencies: {
    '@radix-ui/react-accordion': rootPkg.dependencies['@radix-ui/react-accordion'],
    '@radix-ui/react-dialog': rootPkg.dependencies['@radix-ui/react-dialog'],
    '@radix-ui/react-dropdown-menu': rootPkg.dependencies['@radix-ui/react-dropdown-menu'],
    '@radix-ui/react-popover': rootPkg.dependencies['@radix-ui/react-popover'],
    '@radix-ui/react-slider': rootPkg.dependencies['@radix-ui/react-slider'],
    '@radix-ui/react-switch': rootPkg.dependencies['@radix-ui/react-switch'],
    '@radix-ui/react-tabs': rootPkg.dependencies['@radix-ui/react-tabs'],
    '@radix-ui/react-tooltip': rootPkg.dependencies['@radix-ui/react-tooltip'],
    'class-variance-authority': rootPkg.dependencies['class-variance-authority'],
    clsx: rootPkg.dependencies.clsx,
    cmdk: rootPkg.dependencies.cmdk,
    'lucide-react': rootPkg.dependencies['lucide-react'],
    motion: rootPkg.dependencies.motion,
    'tailwind-merge': rootPkg.dependencies['tailwind-merge'],
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/starliTrade/UI99.git',
  },
  bugs: { url: 'https://github.com/starliTrade/UI99/issues' },
  homepage: 'https://github.com/starliTrade/UI99#readme',
};

writeFileSync(resolve(outDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

const readmePath = resolve(root, 'KIT_README.md');
const defaultReadmeLines = [
  '# @99/ui — UI99 Kit',
  '',
  'Velvet-obsidian React component kit (WCAG 2.2-audited, axe-clean, RTL-ready).',
  '',
  '## Install',
  '',
  '```bash',
  'bun add @99/ui',
  '```',
  '',
  '## Usage',
  '',
  '```tsx',
  "import { Button, Switch, SegmentedControl } from '@99/ui';",
  "import '@99/ui/styles.css'; // tokens (or dark.css / light.css for no-JS default)",
  '```',
  '',
  'Theme protocol: toggle `.dark` / `.light` on `<html>` (default: dark).',
  '',
];
const readme = existsSync(readmePath)
  ? readFileSync(readmePath, 'utf8')
  : defaultReadmeLines.join('\n');
writeFileSync(resolve(outDir, 'README.md'), readme);

// CLI ships inside the package (npx @99/ui add button)
copyFileSync(resolve(root, 'scripts/cli.mjs'), resolve(outDir, 'cli.js'));
// Registry snapshot ships inside the package (offline-capable CLI)
copyFileSync(resolve(root, 'public/registry.json'), resolve(outDir, 'registry.json'));

console.log('[kit-manifest] package.json + README.md written to dist-kit/');
console.log(
  `[kit-manifest] ${pkg.name}@${pkg.version} — ${Object.keys(pkg.exports).length - 1} export paths`,
);
