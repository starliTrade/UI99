/**
 * UI99 Kit CSS Generator — Phase 2.2
 * Extracts kit-consumable CSS custom properties from src/core/tokens/index.ts
 * into three importable stylesheets (base / dark / light).
 * Run as part of `bun run lib:build`.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'dist');
mkdirSync(outDir, { recursive: true });

/** Recursively flatten the tokens object: leaf values become CSS custom props. */
function flatten(obj, prefix, out) {
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}--${key}`;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, name, out);
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
      out[name] = String(value);
  }
}

function renderSection(title, entries, comment) {
  const lines = [`/* ${title} */`, comment ? `/* ${comment} */` : null].filter(Boolean);
  for (const [name, value] of entries) lines.push(`  ${name}: ${value};`);
  return lines.join('\n');
}

function renderSheet(scope, sections, footer) {
  const body = sections.filter(Boolean).join('\n\n');
  return `/*!\n * UI99 (@99/ui) — ${scope} tokens stylesheet\n * Auto-generated from src/core/tokens/index.ts — DO NOT EDIT BY HAND.\n * Regenerate: bun run lib:build\n */\n:root${scope === 'dark' ? '.dark' : ''} {\n${body}\n${footer ? `\n${footer}\n` : ''}}\n`;
}

const { tokens } = await import(resolve(root, 'src/core/tokens/index.ts'));
const out = {};
flatten(tokens, '', out);

// ---- Classify entries by scope ----
const base = {};
const dark = {};
const light = {};
const NODE = {};
for (const [name, value] of Object.entries(out)) {
  if (/-(dark|hover|press|selected|drag)$/.test(name)) {
    NODE[name] = value; // node groups carry -dark/-light/states under distinct keys
  } else {
    base[name] = value;
  }
}

console.warn('Note: run the packaged version instead — see lib:tokens script.');
console.warn(`Flattened ${Object.keys(out).length} token leaves.`);
console.warn(`Base candidates: ${Object.keys(base).length}, node-grouped: ${Object.keys(NODE).length}`);
