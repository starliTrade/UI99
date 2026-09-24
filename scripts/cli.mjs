#!/usr/bin/env node
/**
 * UI99 CLI — Phase 3.2
 * `npx @99/ui init`   → writes components.json into the host project
 * `npx @99/ui add …`  → installs components from the registry (transitive
 *                       registryDependencies resolved, files written to target
 *                       paths, npm deps installed with the detected PM)
 * `npx @99/ui list`   → prints available registry items
 *
 * Zero runtime dependencies (node stdlib only) so the published kit stays lean.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const REGISTRY_URL =
  process.env.UI99_REGISTRY_URL ??
  'https://raw.githubusercontent.com/starliTrade/UI99/main/public/registry.json';

const COLORS = { dim: '\x1b[2m', green: '\x1b[32m', red: '\x1b[31m', cyan: '\x1b[36m', reset: '\x1b[0m' };
const log = (msg) => console.log(msg);
const ok = (msg) => log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
const err = (msg) => log(`${COLORS.red}✗${COLORS.reset} ${msg}`);
const info = (msg) => log(`${COLORS.dim}${msg}${COLORS.reset}`);

const COMPONENTS_JSON_SCHEMA =
  'https://ui.shadcn.com/schema/components-json.json';

const DEFAULT_COMPONENTS_JSON = {
  $schema: COMPONENTS_JSON_SCHEMA,
  style: 'ui99',
  tailwind: { config: '', css: 'src/index.css', baseColor: 'obsidian', cssVariables: true },
  aliases: { components: '@/components', ui: '@/components/ui', lib: '@/lib' },
  iconLibrary: 'lucide',
  registry: REGISTRY_URL,
};

function detectPackageManager() {
  if (process.env.npm_config_user_agent) {
    const ua = process.env.npm_config_user_agent;
    if (ua.startsWith('bun')) return 'bun';
    if (ua.startsWith('pnpm')) return 'pnpm';
    if (ua.startsWith('yarn')) return 'yarn';
    if (ua.startsWith('npm')) return 'npm';
  }
  if (existsSync(resolve(process.cwd(), 'bun.lockb'))) return 'bun';
  if (existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(process.cwd(), 'yarn.lock'))) return 'yarn';
  return 'npm';
}

async function fetchRegistry() {
  const url = new URL(REGISTRY_URL);
  if (url.protocol === 'file:') return JSON.parse(readFileSync(url.pathname, 'utf8'));
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) throw new Error(`registry fetch failed: ${res.status} ${REGISTRY_URL}`);
  return res.json();
}

function resolveTransitive(registry, names) {
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const ordered = [];
  const seen = new Set();
  const visit = (name) => {
    if (seen.has(name)) return;
    const item = byName.get(name);
    if (!item) {
      err(`unknown registry item "${name}"`);
      process.exitCode = 1;
      return;
    }
    seen.add(name);
    for (const dep of item.registryDependencies ?? []) visit(dep);
    ordered.push(item);
  };
  for (const n of names) visit(n);
  return ordered;
}

async function cmdInit() {
  const target = resolve(process.cwd(), 'components.json');
  if (existsSync(target)) {
    info('components.json already exists — leaving it untouched.');
    return;
  }
  writeFileSync(target, JSON.stringify(DEFAULT_COMPONENTS_JSON, null, 2) + '\n');
  ok('wrote components.json (style: ui99, registry: @99/ui)');
  info('Import the token layer once:');
  info("  import '@99/ui/styles.css'   // or '@99/ui/dark.css'");
  info('Toggle the theme with .dark / .light on <html>.');
}

async function cmdAdd(names, dryRun = false) {
  if (names.length === 0) {
    err('nothing to add — usage: npx @99/ui add button card [--dry-run]');
    process.exitCode = 1;
    return;
  }
  info(`fetching registry: ${REGISTRY_URL}`);
  const registry = await fetchRegistry();
  const items = resolveTransitive(registry, names);
  const pm = detectPackageManager();
  const allDeps = new Set();
  if (dryRun) {
    info(`--dry-run: would write ${items.length} item(s):`);
    for (const item of items) {
      for (const file of item.files) {
        info(`  ${file.target ?? file.path}`);
      }
    }
  }

  let written = 0;
  for (const item of items) {
    for (const dep of item.dependencies ?? []) allDeps.add(dep);
    for (const file of item.files) {
      if (!dryRun) {
        const targetPath = resolve(process.cwd(), file.target ?? file.path);
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, file.content);
        ok(`wrote ${join('.', file.target ?? file.path)}`);
      }
      written++;
    }
  }

  if (allDeps.size > 0 && !dryRun) {
    const deps = [...allDeps];
    ok(`installing ${deps.length} dependencies via ${pm}…`);
    const installCmd = {
      bun: `bun add ${deps.join(' ')}`,
      npm: `npm i ${deps.join(' ')}`,
      pnpm: `pnpm add ${deps.join(' ')}`,
      yarn: `yarn add ${deps.join(' ')}`,
    }[pm];
    execSync(installCmd, { stdio: 'inherit' });
  } else if (allDeps.size > 0) {
    info(`--dry-run: would install ${[...allDeps].join(', ')}`);
  } else {
    info('--dry-run: nothing to install.');
  }

  log('');
  ok(`done — ${items.length} item(s), ${written} file(s). You own the code.`);
}

async function cmdList() {
  const registry = await fetchRegistry();
  info(`${registry.name}@${registry.version ?? ''} — ${registry.items.length} items`);
  for (const item of registry.items) {
    log(`  ${COLORS.cyan}${item.name.padEnd(20)}${COLORS.reset} ${item.type}`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const [cmd, ...args] = argv.filter((a) => a !== '--dry-run');
  log(`${COLORS.dim}▲ UI99 (@99/ui) — velvet-obsidian kit${COLORS.reset}`);
  try {
    if (cmd === 'init') await cmdInit();
    else if (cmd === 'add') await cmdAdd(args, dryRun);
    else if (cmd === 'list') await cmdList();
    else {
      log('Usage:');
      log('  npx @99/ui init          configure components.json');
      log('  npx @99/ui add <item>…   install components (owns the code)');
      log('  npx @99/ui list          show registry items');
      if (cmd) process.exitCode = 1;
    }
  } catch (e) {
    err(e.message);
    process.exitCode = 1;
  }
}

main();
