#!/usr/bin/env node
/**
 * UI99 CLI v2 — plug-able multi-registry installer
 *
 *   npx @99/ui init                  → components.json (resolvedPaths + registry)
 *   npx @99/ui add <item…>           → install from the active registry
 *   npx @99/ui list [--json]         → list / filter registry items
 *   npx @99/ui search <term>         → search items by name/keyword/category
 *
 * Registry resolution order (first hit wins):
 *   1. --registry <url|path> flag
 *   2. components.json → registry field
 *   3. UI99_REGISTRY_URL env var
 *   4. Local dev registry (repo checkout: public/registry.json)
 *   5. Bundled snapshot (ships inside the npm package — offline-capable)
 *   6. Published GitHub raw URL (last-resort public fallback)
 *
 * Zero runtime dependencies (node stdlib only) so the published kit stays lean.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COLORS = { dim: '\x1b[2m', green: '\x1b[32m', red: '\x1b[31m', cyan: '\x1b[36m', yellow: '\x1b[33m', reset: '\x1b[0m' };
const log = (msg) => console.log(msg);
const ok = (msg) => log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
const err = (msg) => log(`${COLORS.red}✗${COLORS.reset} ${msg}`);
const info = (msg) => log(`${COLORS.dim}${msg}${COLORS.reset}`);
const warn = (msg) => log(`${COLORS.yellow}▲${COLORS.reset} ${msg}`);

const REGISTRY_SOURCES = [
  {
    id: 'flag',
    resolve: (flags) => flags.registry ?? null,
    label: (v) => v,
  },
  {
    id: 'components-json',
    resolve: () => {
      const cfg = readComponentsJson();
      return cfg?.registry ?? null;
    },
    label: (v) => `${v} (components.json)`,
  },
  {
    id: 'env',
    resolve: () => process.env.UI99_REGISTRY_URL ?? null,
    label: (v) => `${v} (UI99_REGISTRY_URL)`,
  },
  {
    id: 'local-repo',
    resolve: () => {
      // Repo checkout: dev runs hit the scanned source of truth directly.
      const local = resolve(__dirname, '../public/registry.json');
      return existsSync(local) ? `file://${local}` : null;
    },
    label: (v) => `file:${v.split('/').slice(-2).join('/')} (repo checkout)`,
  },
  {
    id: 'bundled',
    resolve: () => {
      // Published package ships an offline snapshot next to cli.js.
      try {
        const require = createRequire(import.meta.url);
        const bundled = require.resolve('@99/ui/registry.json');
        return `file://${bundled}`;
      } catch {
        const sibling = resolve(__dirname, 'registry.json');
        return existsSync(sibling) ? `file://${sibling}` : null;
      }
    },
    label: (v) => `file:${v.split('/').slice(-2).join('/')} (bundled snapshot)`,
  },
  {
    id: 'published',
    resolve: () => 'https://raw.githubusercontent.com/starliTrade/UI99/main/public/registry.json',
    label: () => 'https://raw.githubusercontent.com/starliTrade/UI99/main/public/registry.json',
  },
];

const COMPONENTS_JSON_SCHEMA = 'https://ui.shadcn.com/schema/components-json.json';

function readComponentsJson() {
  const p = resolve(process.cwd(), 'components.json');
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    warn(`components.json is not valid JSON (${e.message}) — ignoring it.`);
    return null;
  }
}

/** components.json aliases → real filesystem targets, like shadcn's resolvedPaths. */
function resolvePaths(cfg) {
  const aliases = cfg?.aliases ?? {};
  const cwd = process.cwd();
  const fromAlias = (alias, fallback) => {
    const value = alias ?? fallback;
    if (!value) return fallback;
    return value.startsWith('@/')
      ? resolve(cwd, 'src', value.slice(2))
      : resolve(cwd, value);
  };
  return {
    components: fromAlias(aliases.components, join(cwd, 'src/components')),
    ui: fromAlias(aliases.ui, join(cwd, 'src/components/ui')),
    lib: fromAlias(aliases.lib, join(cwd, 'src/lib')),
    styles: cfg?.tailwind?.css ? resolve(cwd, cfg.tailwind.css) : join(cwd, 'src/index.css'),
  };
}

function pickRegistrySource(flags) {
  for (const source of REGISTRY_SOURCES) {
    const value = source.resolve(flags);
    if (value) return { source, value };
  }
  throw new Error('no registry source resolved — pass --registry <url-or-path>');
}

async function fetchRegistry(flags) {
  const { source, value } = pickRegistrySource(flags);
  info(`registry: ${source.label(value)}`);
  const url = new URL(value);
  if (url.protocol === 'file:') {
    return { registry: JSON.parse(readFileSync(url.pathname, 'utf8')), origin: source.id };
  }
  const res = await fetch(value);
  if (!res.ok) throw new Error(`registry fetch failed: ${res.status} ${value}`);
  return { registry: await res.json(), origin: source.id };
}

function resolveTransitive(registry, names) {
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const ordered = [];
  const seen = new Set();
  const missing = [];
  const visit = (name, chain = []) => {
    if (seen.has(name)) return;
    const item = byName.get(name);
    if (!item) {
      if (!missing.includes(name)) missing.push(name);
      return;
    }
    seen.add(name);
    for (const dep of item.registryDependencies ?? []) visit(dep, [...chain, name]);
    ordered.push(item);
  };
  for (const n of names) visit(n);
  return { ordered, missing };
}

function detectPackageManager() {
  if (process.env.npm_config_user_agent) {
    const ua = process.env.npm_config_user_agent;
    if (ua.startsWith('bun')) return 'bun';
    if (ua.startsWith('pnpm')) return 'pnpm';
    if (ua.startsWith('yarn')) return 'yarn';
    if (ua.startsWith('npm')) return 'npm';
  }
  if (existsSync(resolve(process.cwd(), 'bun.lockb'))) return 'bun';
  if (existsSync(resolve(process.cwd(), 'bun.lock'))) return 'bun';
  if (existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(process.cwd(), 'yarn.lock'))) return 'yarn';
  return 'npm';
}

/** Rewrite relative imports in copied kit files to the host alias layout. */
function remapImports(content, filePath, paths) {
  const depth = filePath.split('/').length - 1;
  let out = content;
  if (filePath.startsWith('ui/')) {
    out = out.replace(/from\s+['"]\.\.\/\.\.\/lib\/utils['"]/g, `from '${aliasFor(paths.lib)}/utils'`);
  }
  return out;
}

/** Best-effort alias prefix for a resolved target dir (shadcn-style '@/' if src-rooted). */
function aliasFor(resolvedPath) {
  const cwd = process.cwd();
  const rel = resolvedPath.replace(cwd + '/', '');
  if (rel.startsWith('src/')) return `@/${rel.slice(4)}`;
  return rel;
}

async function cmdInit(flags) {
  const target = resolve(process.cwd(), 'components.json');
  if (existsSync(target) && !flags.force) {
    info('components.json already exists — leaving it untouched (use --force to overwrite).');
    return;
  }
  let registryUrl;
  try {
    registryUrl = pickRegistrySource(flags).value;
  } catch {
    registryUrl = 'https://raw.githubusercontent.com/starliTrade/UI99/main/public/registry.json';
  }
  const isFileUrl = registryUrl.startsWith('file:');
  const cfg = {
    $schema: COMPONENTS_JSON_SCHEMA,
    style: 'ui99',
    tailwind: { config: '', css: 'src/index.css', baseColor: 'obsidian', cssVariables: true },
    aliases: { components: '@/components', ui: '@/components/ui', lib: '@/lib' },
    iconLibrary: 'lucide',
    registry: isFileUrl ? 'https://raw.githubusercontent.com/starliTrade/UI99/main/public/registry.json' : registryUrl,
  };
  writeFileSync(target, JSON.stringify(cfg, null, 2) + '\n');
  ok('wrote components.json (style: ui99, registry: @99/ui)');
  const paths = resolvePaths(cfg);
  info(`resolvedPaths → ui: ${paths.ui}`);
  info('Import the token layer once:');
  info("  import '@99/ui/styles.css'   // or '@99/ui/dark.css' / light.css");
  info('Toggle the theme with .dark / .light on <html>.');
}

async function cmdAdd(names, flags, dryRun = false) {
  if (names.length === 0) {
    err('nothing to add — usage: npx @99/ui add button card [--dry-run]');
    process.exitCode = 1;
    return;
  }
  const { registry, origin } = await fetchRegistry(flags);
  const { ordered, missing } = resolveTransitive(registry, names);
  if (missing.length > 0) {
    err(`unknown registry item(s): ${missing.join(', ')}`);
    info('run `npx @99/ui list` to see available items');
    process.exitCode = 1;
    return;
  }

  const cfg = readComponentsJson();
  const paths = resolvePaths(cfg);
  const pm = detectPackageManager();
  const allDeps = new Set();
  const allDevDeps = new Set();

  if (dryRun) {
    info(`--dry-run: would write ${ordered.length} item(s):`);
    for (const item of ordered) {
      for (const file of item.files) {
        info(`  ${mapTarget(file, paths)}`);
      }
    }
  }

  let written = 0;
  for (const item of ordered) {
    for (const dep of item.dependencies ?? []) allDeps.add(dep);
    for (const dep of item.devDependencies ?? []) allDevDeps.add(dep);
    for (const file of item.files) {
      if (!dryRun) {
        const targetPath = resolve(process.cwd(), mapTarget(file, paths));
        mkdirSync(dirname(targetPath), { recursive: true });
        const content = remapImports(file.content, file.path, paths);
        writeFileSync(targetPath, content);
        ok(`wrote ${join('.', mapTarget(file, paths))}`);
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

  // Type packages are build-time only, so they belong in devDependencies —
  // installing them as runtime deps would ship types into production bundles.
  if (allDevDeps.size > 0 && !dryRun) {
    const devDeps = [...allDevDeps];
    ok(`installing ${devDeps.length} type/dev dependencies via ${pm}…`);
    const devCmd = {
      bun: `bun add -d ${devDeps.join(' ')}`,
      npm: `npm i -D ${devDeps.join(' ')}`,
      pnpm: `pnpm add -D ${devDeps.join(' ')}`,
      yarn: `yarn add -D ${devDeps.join(' ')}`,
    }[pm];
    execSync(devCmd, { stdio: 'inherit' });
  } else if (allDevDeps.size > 0) {
    info(`--dry-run: would install (dev) ${[...allDevDeps].join(', ')}`);
  }

  if (origin === 'bundled') {
    warn('served from the bundled snapshot — for the freshest registry use --registry <url>');
  }
  log('');
  ok(`done — ${ordered.length} item(s), ${written} file(s). You own the code.`);
}

/** File target honoring resolvedPaths (ui/ → aliases.ui, lib/ → aliases.lib). */
function mapTarget(file, paths) {
  if (file.target) return file.target;
  if (file.path.startsWith('ui/')) return join(paths.ui, file.path.slice(3));
  if (file.path.startsWith('lib/')) return join(paths.lib, file.path.slice(4));
  return file.path;
}

async function cmdList(flags) {
  const { registry } = await fetchRegistry(flags);
  if (flags.json) {
    log(JSON.stringify(registry, null, 2));
    return;
  }
  info(`${registry.name}@${registry.version ?? ''} — ${registry.items.length} items`);
  const grouped = new Map();
  for (const item of registry.items) {
    const cat = item.category ?? 'core';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(item);
  }
  for (const [cat, items] of [...grouped.entries()].sort()) {
    log(`  ${COLORS.cyan}${cat}${COLORS.reset}`);
    for (const item of items) {
      const kind = item.type === 'registry:ui' ? '' : ` ${COLORS.dim}(${item.type})${COLORS.reset}`;
      const desc = item.description ? ` — ${item.description.split('.')[0]}` : '';
      log(`    ${item.name.padEnd(24)}${kind}${COLORS.dim}${desc}${COLORS.reset}`);
    }
  }
}

async function cmdSearch(term, flags) {
  const { registry } = await fetchRegistry(flags);
  const q = term.toLowerCase();
  const hits = registry.items.filter(
    (i) =>
      i.name.includes(q) ||
      (i.title ?? '').toLowerCase().includes(q) ||
      (i.category ?? '').toLowerCase().includes(q) ||
      (i.keywords ?? []).some((k) => k.includes(q))
  );
  if (hits.length === 0) {
    info(`no results for "${term}"`);
    return;
  }
  info(`${hits.length} result(s) for "${term}":`);
  for (const item of hits) {
    log(`  ${COLORS.cyan}${item.name.padEnd(24)}${COLORS.reset} ${item.category ?? 'core'}${COLORS.dim} — ${item.description?.split('.')[0] ?? ''}${COLORS.reset}`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const flags = { registry: null, force: false, json: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') continue;
    if (a === '--force' || a === '-f') { flags.force = true; continue; }
    if (a === '--json') { flags.json = true; continue; }
    if (a === '--registry' || a === '-r') { flags.registry = argv[++i] ?? null; continue; }
    if (a.startsWith('--registry=')) { flags.registry = a.split('=').slice(1).join('='); continue; }
    positional.push(a);
  }

  const dryRun = argv.includes('--dry-run');
  const [cmd, ...args] = positional;
  log(`${COLORS.dim}▲ UI99 (@99/ui) — velvet-obsidian kit${COLORS.reset}`);
  try {
    if (cmd === 'init') await cmdInit(flags);
    else if (cmd === 'add') await cmdAdd(args, flags, dryRun);
    else if (cmd === 'list') await cmdList(flags);
    else if (cmd === 'search') await cmdSearch(args[0] ?? '', flags);
    else {
      log('Usage:');
      log('  npx @99/ui init                  configure components.json');
      log('  npx @99/ui add <item>…           install components (owns the code)');
      log('  npx @99/ui list [--json]         show registry items');
      log('  npx @99/ui search <term>         search by name/keyword/category');
      log('');
      log('Flags:');
      log('  --registry, -r <url|path>        override registry source');
      log('  --dry-run                        preview files + deps without writing');
      log('  --force                          overwrite existing components.json');
      if (cmd) process.exitCode = 1;
    }
  } catch (e) {
    err(e.message);
    process.exitCode = 1;
  }
}

main();
