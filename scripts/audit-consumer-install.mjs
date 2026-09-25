#!/usr/bin/env node
/**
 * UI99 — Consumer Install Audit
 *
 * The registry's real contract is not "the JSON is valid". It is:
 *
 *     a stranger runs `npx @99/ui add <x>` in an empty project, and it works.
 *
 * Every check that runs *inside* this repo passes while the shipped artefact can
 * still be broken, because this repo already has the dependencies and the
 * `@/` aliases a consumer does not. Three separate bugs reached a user-shaped
 * failure that no in-repo check could see:
 *
 *   1. `Card` imported `../../core/tokens` — fine here, TS2307 in a consumer.
 *   2. Dependencies were unpinned bare names, so `add top-header` pulled
 *      lucide-react@1.x, which removed the `Github` icon the file imports.
 *   3. `CodeBlock` imported `prismjs` (via side-effect imports the original
 *      scanner never matched) and declared nothing, so the package was simply
 *      absent from the consumer's node_modules.
 *
 * This script reproduces the stranger's experience exactly: empty project, real
 * `add`, real `tsc`. It is slower and networked, so it is NOT part of `vitest`
 * or `tokens:gate` — it is a release gate, run deliberately.
 *
 * Usage:  node scripts/audit-consumer-install.mjs [itemName ...]
 *         (no args = every registry:ui item)
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(resolve(root, 'public/registry.json'), 'utf8'));

const requested = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const all = registry.items.filter((i) => i.type === 'registry:ui');
const items = requested.length
  ? all.filter((i) => requested.includes(i.name))
  : all;

if (items.length === 0) {
  console.error(`✗ no matching registry:ui items for: ${requested.join(', ')}`);
  process.exit(1);
}

const TSCONFIG = {
  compilerOptions: {
    target: 'ES2020',
    lib: ['ES2020', 'DOM'],
    jsx: 'react-jsx',
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    baseUrl: '.',
    paths: { '@/*': ['./src/*'] },
  },
  include: ['src'],
};

const devTools = [
  'typescript@5',
  '@types/react@18',
  '@types/react-dom@18',
];

let dir;
try {
  dir = mkdtempSync(join(tmpdir(), 'ui99-consumer-'));
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'ui99-consumer-audit', private: true, version: '1.0.0' }, null, 2));
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify(TSCONFIG, null, 2));

  console.log(`[audit] empty project → npx @99/ui add ${items.map((i) => i.name).join(' ')}`);

  // Real install through the real CLI, from this repo's registry.
  execFileSync('node', [resolve(root, 'scripts/cli.mjs'), 'add', ...items.map((i) => i.name)], {
    cwd: dir,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  execFileSync('npm', ['i', '-D', ...devTools], { cwd: dir, stdio: ['ignore', 'pipe', 'inherit'] });

  console.log('[audit] typechecking the consumer project…');
  try {
    execFileSync('npx', ['tsc', '--noEmit'], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    const out = `${e.stdout ?? ''}${e.stderr ?? ''}`.trim();
    console.error(`✗ consumer install audit FAILED — ${items.length} item(s) do not compile standalone:\n${out}`);
    process.exitCode = 1;
  }

  if (!process.exitCode) {
    console.log(`✓ consumer install audit passed — ${items.length} registry:ui item(s) install and typecheck in an empty project`);
  }
} finally {
  if (dir) rmSync(dir, { recursive: true, force: true });
}
