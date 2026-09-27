#!/usr/bin/env node
/**
 * UI99 — stylesheet gate
 *
 * The gates that existed all read CSS as TEXT. That is why a broken stylesheet
 * shipped green: `tsc` never parses CSS, `vitest` mounts components in jsdom
 * without the real stylesheet, and `tokens-gate` greps for forbidden values.
 * A `str_replace` had replaced the `@utility font-code {` header with a
 * comment, leaving its declarations at top level and a dangling brace —
 * "Missing opening {" from Tailwind — and the whole page rendered unstyled
 * while every one of those gates said the project was clean.
 *
 * So this gate does the one thing text-matching cannot: it runs the REAL
 * Tailwind compiler over the real entry stylesheet and fails on any parse
 * error. `@tailwindcss/cli` is not a dependency of this repo, so it drives
 * `tailwindcss`'s own `compile()` export with a resolver for the stylesheets
 * the entry imports, and then builds the utilities the font law depends on.
 *
 * It is the slowest gate in the repo, which is exactly why it did not exist:
 * every other gate is fast enough that nobody notices they are all looking at
 * the wrong layer.
 *
 * Run: node scripts/stylesheet-gate.mjs
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Braces must balance AFTER comments and strings are removed. */
function structural(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

/**
 * Walks the file tracking brace depth and reports:
 *  - a declaration sitting at depth 0 (a property with no selector), and
 *  - a `}` that closes nothing.
 *
 * Depth is what separates the two failures. A line like `--bg-control: #0b0c11;`
 * is only a bug at depth 0; the same line inside `:root { … }` is the theme.
 * The previous version of this gate flagged both and cried wolf on two
 * perfectly healthy declarations.
 */
function structuralWalk(body) {
  const lines = body.split('\n');
  let depth = 0;
  const orphans = [];
  const strays = [];

  lines.forEach((raw, i) => {
    const opens = (raw.match(/\{/g) ?? []).length;
    const closes = (raw.match(/\}/g) ?? []).length;
    // Everything after the last `{` on the line is a declaration body, so a
    // declaration on that tail is inside the rule the line just opened.
    const tail = raw.slice(raw.lastIndexOf('{') + 1);
    const isDecl = (s) => /^[-@\w\s(].*:\s*[^;{]*;\s*$/.test(s.trim()) && s.trim().length > 0;

    if (depth === 0 && isDecl(tail) && !/^@/.test(tail.trim())) {
      orphans.push({ line: i + 1, text: tail.trim() });
    }

    depth += opens - closes;
    if (depth < 0) {
      strays.push(i + 1);
      depth = 0;
    }
  });

  return { orphans, strays, endDepth: depth };
}

const sheets = ['src/index.css', 'src/styles/ui99.css', 'src/styles/ui99-elevation.css'];
const problems = [];

for (const rel of sheets) {
  const abs = resolve(root, rel);
  if (!existsSync(abs)) continue;
  const body = structural(readFileSync(abs, 'utf8'));
  const open = (body.match(/\{/g) ?? []).length;
  const close = (body.match(/\}/g) ?? []).length;
  if (open !== close) {
    problems.push(
      `${rel}: ${open} "{" but ${close} "}" — a rule lost its header and its declarations are now top-level`,
    );
  }

  const walk = structuralWalk(body);
  for (const o of walk.orphans) {
    problems.push(`${rel}:${o.line}: a declaration with no selector — "${o.text.slice(0, 60)}"`);
  }
  for (const line of walk.strays) {
    problems.push(`${rel}:${line}: a "}" that closes nothing — a rule body was left open`);
  }
  if (walk.endDepth > 0) {
    problems.push(`${rel}: file ends ${walk.endDepth} brace(s) deep — an unclosed rule`);
  }
}

// An `@utility` block whose header was replaced by a comment leaves its
// declarations orphaned AND its closing brace dangling. Catch it by name: a
// utility referenced anywhere in src must have a real `@utility` definition.
const index = readFileSync(resolve(root, 'src/index.css'), 'utf8');
for (const name of ['font-ui', 'font-persian', 'font-code', 'focus-ui99']) {
  if (!new RegExp(`@utility ${name}\\s*\\{`).test(index)) {
    problems.push(
      `src/index.css: @utility ${name} is referenced but not defined — a missing @utility produces markup pointing at nothing, silently`,
    );
  }
}

// The font law, read off the source: every font stack must carry the Persian
// face or Persian text falls back to the system font exactly as it did.
for (const [, prop, value] of index.matchAll(/(--font-[a-z-]+):\s*([^;]+);/g)) {
  if (!/Vazirmatn/.test(value)) {
    problems.push(`src/index.css: ${prop} has no Vazirmatn — Persian text on this stack renders in the fallback face`);
  }
}

// ---------------------------------------------------------------------------
// The compiler itself, over the real entry stylesheet.
// ---------------------------------------------------------------------------

/** Resolve a bare specifier the way Node would: walk up looking in node_modules. */
function findPackageDir(id, base) {
  let dir = base;
  for (let i = 0; i < 40; i += 1) {
    const p = resolve(dir, 'node_modules', id);
    if (existsSync(p)) return p;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
  return null;
}

function resolveStylesheet(id, base) {
  if (id.startsWith('.')) {
    const raw = resolve(base, id);
    for (const cand of [raw, `${raw}.css`, resolve(raw, 'index.css')]) {
      if (existsSync(cand) && statSync(cand).isFile()) return cand;
    }
    return null;
  }
  const dir = findPackageDir(id, base);
  if (!dir) return null;
  if (statSync(dir).isFile()) return dir;
  // Packages expose their stylesheet through `style`, `exports["."].style`, or
  // `main` — `tw-animate-css` has no index.css at all, so a naive resolver
  // reports a healthy import as missing.
  const pkgPath = resolve(dir, 'package.json');
  let style = null;
  if (existsSync(pkgPath)) {
    const manifest = JSON.parse(readFileSync(pkgPath, 'utf8'));
    style = manifest.style ?? manifest.exports?.['.']?.style ?? manifest.main ?? null;
  }
  return resolve(dir, style ?? 'index.css');
}

try {
  const { compile } = await import('tailwindcss');
  const entry = resolve(root, 'src/index.css');
  const compiler = await compile(readFileSync(entry, 'utf8'), {
    base: dirname(entry),
    from: entry,
    loadStylesheet: async (id, base) => {
      const path = resolveStylesheet(id, base);
      if (!path || !existsSync(path)) throw new Error(`cannot resolve "${id}" from ${base}`);
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });

  const built = compiler.build([
    'font-sans',
    'font-mono',
    'font-ui',
    'font-persian',
    'font-code',
    'bg-(--bg-control)',
  ]);

  if (built.length < 10_000) {
    problems.push(`compiled output is only ${built.length} bytes — the utility layer did not build`);
  }
  if (!built.includes('Vazirmatn')) {
    problems.push('compiled output carries no Vazirmatn at all — the Persian face is not reaching the browser');
  }
  // The exact regression: the utility layer's `font-family` beating the base
  // layer's RTL family. A `.font-mono` without Vazirmatn means the browser
  // walks the whole stack to the system fallback and Persian labels lose their
  // face even though the text is Persian.
  const mono = built.match(/\.font-mono\s*\{[^}]*\}/);
  if (!mono) problems.push('compiled output has no .font-mono rule — font-mono is not reaching the browser');
  else if (!mono[0].includes('Vazirmatn')) {
    problems.push('compiled .font-mono has no Vazirmatn — it outranks the base layer and Persian code spans lose their face');
  }
  for (const u of ['.font-ui', '.font-persian', '.font-code']) {
    if (!built.includes(u)) problems.push(`compiled output has no ${u} rule — @utility ${u.slice(1)} is not reaching the browser`);
  }
} catch (e) {
  const msg = (e?.message || String(e)).split('\n').slice(0, 4).join(' ').trim();
  problems.push(`Tailwind refused to compile src/index.css — ${msg}`);
}

if (problems.length) {
  console.error(`\n✗ stylesheet-gate: ${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}

console.log(
  '✓ stylesheet-gate: src/index.css compiles under the real Tailwind compiler, braces balance, ' +
    'no orphaned declaration, every referenced @utility is defined, and Vazirmatn reaches the output',
);
