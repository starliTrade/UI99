#!/usr/bin/env node
/**
 * UI99 Publish-Readiness Audit — CI gate (audit P0.1)
 * Fails the build when dist-kit/package.json loses any field required for a
 * credible npm publish (the "package.json checklist" from the audit):
 *   files whitelist · exports map · peerDependencies · sideEffects ·
 *   types · bin · repository/bugs/homepage · dependency parity with
 *   scripts/kit-deps.mjs · porcelain.css actually shipped.
 *
 * Run: node scripts/audit-package.mjs   (after bun run lib:build)
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_RUNTIME_DEPS } from './kit-deps.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, 'dist-kit/package.json');

const errors = [];

function fail(msg) {
  errors.push(msg);
}

if (!existsSync(manifestPath)) {
  console.error('✗ dist-kit/package.json not found — run `bun run lib:build` first');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(manifestPath, 'utf8'));

// ── Identity ──
if (pkg.name !== '@99/ui') fail(`name must be "@99/ui", got "${pkg.name}"`);
if (!pkg.version) fail('version missing');
if (pkg.license !== 'MIT') fail('license must be MIT');
if (pkg.type !== 'module') fail('type must be "module"');

// ── Entry points & exports map ──
for (const field of ['main', 'module', 'types', 'bin']) {
  if (!pkg[field]) fail(`missing "${field}"`);
}
for (const key of ['.', './styles.css', './dark.css', './light.css', './porcelain.css', './tailwind.css', './registry.json', './package.json']) {
  if (!pkg.exports?.[key]) fail(`exports map missing "${key}"`);
}

// ── Publish hygiene ──
if (!pkg.files || pkg.files.length === 0) fail('files whitelist missing');
else {
  for (const f of ['index.js', 'index.cjs', 'ui99.css', 'types', 'cli.js', 'registry.json', 'porcelain.css']) {
    if (!pkg.files.includes(f)) fail(`files whitelist missing "${f}"`);
  }
}
if (!pkg.sideEffects || pkg.sideEffects === true) {
  fail('sideEffects must be ["**/*.css"] (or equivalent) so the JS bundle tree-shakes');
}
if (!pkg.peerDependencies?.react) fail('peerDependencies.react missing');
if (!pkg.peerDependencies?.['react-dom']) fail('peerDependencies["react-dom"] missing');
if (!pkg.repository?.url) fail('repository.url missing');
if (!pkg.bugs?.url) fail('bugs.url missing');
if (!pkg.homepage) fail('homepage missing');
if (!Array.isArray(pkg.keywords) || pkg.keywords.length < 5) fail('keywords too sparse');

// ── Dependency parity with the shared source of truth ──
const deps = pkg.dependencies ?? {};
const missing = KIT_RUNTIME_DEPS.filter((d) => !deps[d]);
if (missing.length > 0) fail(`dependencies missing: ${missing.join(', ')}`);
const extra = Object.keys(deps).filter((d) => !KIT_RUNTIME_DEPS.includes(d));
if (extra.length > 0) fail(`dependencies not in KIT_RUNTIME_DEPS (drift): ${extra.join(', ')}`);
const unpinned = KIT_RUNTIME_DEPS.filter((d) => deps[d] && !deps[d].startsWith('^'));
if (unpinned.length > 0) fail(`dependencies not caret-ranged: ${unpinned.join(', ')}`);

// ── Shipped artifacts actually exist on disk ──
const distKit = resolve(root, 'dist-kit');
for (const artifact of ['index.js', 'index.cjs', 'ui99.css', 'dark.css', 'light.css', 'porcelain.css', 'tailwind.css', 'cli.js', 'registry.json']) {
  if (!existsSync(resolve(distKit, artifact))) fail(`dist-kit/${artifact} missing on disk`);
}
const typesEntry = resolve(distKit, 'types/components/ui/kit.d.ts');
if (!existsSync(typesEntry)) fail('dist-kit/types/components/ui/kit.d.ts missing (lib:types)');

if (errors.length > 0) {
  console.error(`✗ publish-readiness audit failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `✓ publish-ready — ${pkg.name}@${pkg.version}: exports map (${Object.keys(pkg.exports).length} paths), files whitelist (${pkg.files.length}), ${Object.keys(deps).length} runtime deps, peerDeps react/react-dom, tree-shakeable`
);
