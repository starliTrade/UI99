/**
 * The control formula (§2.6) — locked on the numbers, not on taste.
 *
 * The bug this exists to prevent was arithmetic wearing a designer's coat.
 * `--state-hover` (0.045) sits BELOW `--bg-control` (0.050), so every control
 * that hovered to it got darker, and `--bg-raised` (0.060) moved it 2 levels out
 * of 255 — a hover nobody could see. Both shipped, and both looked fine in
 * review because nobody diffed the alphas.
 *
 * So this test does the one thing a review cannot: it parses the two values
 * and asserts the step between them is real. If someone edits a token to make
 * a component look right, this fails unless the arithmetic still holds.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const sheet = readFileSync(resolve(process.cwd(), 'src/styles/ui99.css'), 'utf8');

/** Every `--token: value;` the stylesheet declares, keyed by token name. */
function tokens(css: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of css.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    if (!out.has(m[1])) out.set(m[1], m[2].trim());
  }
  return out;
}

/** The white-ink alpha of a `rgba(255,255,255,a)` / `rgba(0,0,0,a)` value. */
function inkAlpha(value: string): number {
  const m = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
  if (!m) throw new Error(`not an rgba token: ${value}`);
  return Number(m[4]);
}

const t = tokens(sheet);
const alpha = (name: string) => inkAlpha(t.get(name)!);

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(join(dir, e.name))
      : e.name.endsWith('.tsx')
        ? [join(dir, e.name)]
        : [],
  );

describe('§2.6 — the control formula', () => {
  it('declares a control resting fill and a control hover fill', () => {
    expect(t.has('--bg-control')).toBe(true);
    expect(t.has('--bg-control-hover')).toBe(true);
  });

  it('makes the hover step point UP, not down', () => {
    // The inversion that shipped: a control resting at 0.05 and hovering to
    // 0.045 got darker on hover. A hover must always be the larger alpha.
    expect(alpha('--bg-control-hover')).toBeGreaterThan(alpha('--bg-control'));
    expect(alpha('--bg-control-hover')).toBeGreaterThan(alpha('--state-hover'));
  });

  it('makes the hover step visible — not 2 levels out of 255', () => {
    // 4% of white on an obsidian canvas is ~10 levels of 255, which reads.
    // The old 1% step was 2 levels, which does not.
    const step = alpha('--bg-control-hover') - alpha('--bg-control');
    expect(step).toBeGreaterThanOrEqual(0.03);
    expect(step * 255).toBeGreaterThan(5);
  });

  it('keeps the resting fill above the canvas and off the floor', () => {
    // §2.6: a control sits 2-3 levels off the background, never below it.
    expect(alpha('--bg-control')).toBeGreaterThan(0);
    expect(alpha('--bg-control')).toBeLessThan(0.1);
  });

  it('never lets a control rest on a STATE token', () => {
    // A resting fill is a surface. `--state-hover` is a step. Using a step as
    // a resting fill is the category error LivingHero shipped.
    expect(alpha('--state-hover')).toBeLessThan(alpha('--bg-control'));
  });
});

describe('§2.6 — the formula is applied, not just declared', () => {
  it('gives the hero CTA row the formula, on both buttons and the CLI box', () => {
    const home = readFileSync(
      resolve(process.cwd(), 'src/components/views/DesignSystemHomeView.tsx'),
      'utf8',
    );
    const rows = [...home.matchAll(/bg-\(--bg-control\)\s+hover:bg-\(--bg-control-hover\)/g)];
    // two buttons + the CLI box
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it('leaves no theme fork on a control in the whole of src', () => {
    // A `dark:` fork on a CONTROL means that control only works on one parent.
    // Cards and panels are a different role and may fork legitimately — the
    // solid ladder is what makes them wrong on the canvas, not a branch.
    // So this walks the same interactive-tag logic the gate uses rather than
    // grepping every className, which flagged 101 legitimate panel forks.
    const forked: string[] = [];
    for (const file of walk(resolve(process.cwd(), 'src'))) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const cn = m[1] ?? m[2] ?? '';
        const head = src.slice(0, m.index);
        const tags = [...head.matchAll(/<(button|a|input|select|textarea)\b/g)];
        if (!tags.length) continue;
        const tag = tags[tags.length - 1][1];
        if (head.slice(tags[tags.length - 1].index).includes('</')) continue;
        if (tag !== 'button' && tag !== 'a') continue; // a field is a field

        const rest = /(?<![\w:-])bg-\(--([a-z-]+)\)/.exec(cn);
        if (!rest || rest[1] === 'ink-fill') continue;
        const dark = /dark:bg-\(--([a-z-]+)\)/.exec(cn);
        if (dark && dark[1] !== rest[1]) {
          forked.push(`${file}:${head.split('\n').length} <${tag}> bg-(--${rest[1]}) dark:bg-(--${dark[1]})`);
        }
      }
    }
    expect(forked).toEqual([]);
  });
});
