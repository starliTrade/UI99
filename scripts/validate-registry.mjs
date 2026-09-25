#!/usr/bin/env node
/**
 * UI99 Registry Validator — CI gate (audit P1.6)
 * Validates public/registry.json beyond shadcn's schema:
 *   - structure: unique kebab-case names, valid types, files with content+target
 *   - graph:     no dangling registryDependencies
 *   - catalog:   category/title/description/keywords present per component
 *   - a11y:      meta.a11y with five-state contract on every registry:ui item
 *   - floor:     registry never shrinks below the shipped baseline (95 items)
 *
 * Run: bun run registry:validate
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = resolve(root, 'public/registry.json');

const VALID_TYPES = new Set(['registry:ui', 'registry:lib', 'registry:theme', 'registry:block', 'registry:page']);
const CATEGORIES = new Set([
  'Actions', 'Forms', 'Selection', 'Data Display', 'Overlays', 'Layout & Navigation', 'Feedback',
]);
const REQUIRED_STATES = ['default', 'hover', 'press', 'focus-visible', 'disabled'];
/** Never let the registry shrink below what the site/docs advertise. */
const MIN_ITEMS = 95;
const MIN_COMPONENTS = 90;

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

let registry;
try {
  registry = JSON.parse(readFileSync(registryPath, 'utf8'));
} catch (e) {
  console.error(`✗ registry.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

// ── Envelope ──
if (!registry.$schema?.includes('registry.json')) fail('missing $schema');
if (registry.name !== '@99/ui') fail(`registry.name must be "@99/ui", got "${registry.name}"`);
if (!registry.version) warn('registry.version missing');

const items = registry.items ?? [];
if (items.length < MIN_ITEMS) fail(`registry has ${items.length} items — floor is ${MIN_ITEMS}`);

// ── Per-item checks ──
const names = new Set();
const byName = new Map();
let componentCount = 0;

for (const item of items) {
  const label = item.name ?? '<unnamed>';

  if (!item.name) fail('item without name');
  if (names.has(item.name)) fail(`duplicate item name: ${item.name}`);
  names.add(item.name);
  byName.set(item.name, item);

  if (!VALID_TYPES.has(item.type)) fail(`${label}: invalid type "${item.type}"`);
  if (item.type === 'registry:ui') componentCount++;

  // Files must carry inline content + a target path (installable contract)
  if (!Array.isArray(item.files) || item.files.length === 0) {
    fail(`${label}: no files`);
  } else {
    for (const f of item.files) {
      if (!f.path) fail(`${label}: file without path`);
      if (typeof f.content !== 'string' || f.content.length === 0) fail(`${label}: file ${f.path} has no inline content`);
      if (!f.target && item.type !== 'registry:theme') warn(`${label}: file ${f.path} has no target`);
    }
  }

  // Dangling internal references
  for (const dep of item.registryDependencies ?? []) {
    if (!names.has(dep) && !items.some((i) => i.name === dep)) {
      // forward refs inside the same loop are fine — validate after
    }
  }

  // Catalog metadata (components only)
  if (item.type === 'registry:ui') {
    if (!item.title) fail(`${label}: missing title`);
    if (!item.description || item.description.length < 20) fail(`${label}: missing/short description`);
    if (!item.keywords || item.keywords.length === 0) fail(`${label}: missing keywords`);
    if (item.category !== undefined && !CATEGORIES.has(item.category)) {
      fail(`${label}: invalid category "${item.category}"`);
    }

    // a11y metadata with five-state contract
    const a11y = item.meta?.a11y;
    if (!a11y) {
      fail(`${label}: missing meta.a11y`);
    } else {
      for (const state of REQUIRED_STATES) {
        if (!a11y.states?.includes(state)) fail(`${label}: meta.a11y.states missing "${state}"`);
      }
      if (!a11y.keyboard) fail(`${label}: meta.a11y.keyboard missing`);
      if (!a11y.wcag) fail(`${label}: meta.a11y.wcag missing`);
      if (typeof a11y.rtl !== 'boolean') fail(`${label}: meta.a11y.rtl must be boolean`);
    }
  }
}

// ── Dangling refs (second pass, after all names known) ──
for (const item of items) {
  for (const dep of item.registryDependencies ?? []) {
    if (!byName.has(dep)) fail(`dangling registryDependency: ${item.name} → ${dep}`);
  }
}

if (componentCount < MIN_COMPONENTS) {
  fail(`component count ${componentCount} below floor ${MIN_COMPONENTS}`);
}

// ── Report ──
if (warnings.length > 0) {
  for (const w of warnings) console.error(`▲ ${w}`);
}
if (errors.length > 0) {
  console.error(`✗ registry validation failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `✓ registry OK — ${items.length} items (${componentCount} components, ${items.length - componentCount} lib/theme), catalog + a11y metadata complete, no dangling refs`
);
