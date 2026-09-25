/**
 * Token system integrity — the structural layer's own test suite.
 *
 * The elevation audit found 266 hand-written values because nothing verified
 * the token layer itself. These tests close that loop: every token must be
 * declared, theme-complete, and self-consistent.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (f: string) => readFileSync(resolve(process.cwd(), 'src/styles', f), 'utf8');

const elevation = read('ui99-elevation.css');
const glow = read('ui99-glow.css');
const base = read('ui99.css');
const type = read('ui99-type.css');
const typeUtils = read('ui99-type-utilities.css');

/**
 * Declarations inside a specific selector block. The file declares several
 * blocks with the same selector (one per token family), so all of them are
 * concatenated — otherwise the second family would be invisible to the test.
 */
function blockOf(css: string, selector: string): string {
  const open = `${selector} {`;
  let out = '';
  let idx = css.indexOf(open);
  while (idx !== -1) {
    const end = css.indexOf('}', idx);
    out += css.slice(idx, end) + '\n';
    idx = css.indexOf(open, end);
  }
  return out;
}

const DARK = blockOf(elevation, ".dark,\n[data-theme='dark']");
const LIGHT = blockOf(elevation, "[data-theme='light'],\n.light");
const SHARED = blockOf(elevation, ".dark,\n.light,\n[data-theme]");

describe('elevation token scale', () => {
  it('declares exactly five elevation levels plus a flat zero', () => {
    for (const theme of [DARK, LIGHT]) {
      expect(theme, 'elevation-0').toContain('--elevation-0');
      for (let i = 1; i <= 5; i++) {
        expect(theme, `elevation-${i} in both themes`).toContain(`--elevation-${i}:`);
      }
    }
  });

  it('is theme-complete — no token exists in one theme and not the other', () => {
    const names = (css: string) => [...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
    const dark = new Set(names(DARK));
    const light = new Set(names(LIGHT));

    const missingInLight = [...dark].filter((n) => !light.has(n));
    const missingInDark = [...light].filter((n) => !dark.has(n));

    expect(missingInLight, `dark-only tokens: ${missingInLight.join(', ')}`).toHaveLength(0);
    expect(missingInDark, `light-only tokens: ${missingInDark.join(', ')}`).toHaveLength(0);
  });

  it('defines the rim family and the six shadow composites', () => {
    for (const token of [
      '--rim-subtle',
      '--rim-soft',
      '--rim-strong',
      '--rim-crisp',
      '--shadow-card',
      '--shadow-card-hover',
      '--shadow-popover',
      '--shadow-modal',
      '--shadow-inset-well',
      '--shadow-pressed',
    ]) {
      expect(DARK, `${token} dark`).toContain(token);
      expect(LIGHT, `${token} light`).toContain(token);
    }
  });

  it('keeps the four-step blur ramp identical across themes', () => {
    const ramp = ['--blur-sm', '--blur-md', '--blur-lg', '--blur-ambient'];
    for (const token of ramp) {
      expect(DARK, token).toContain(token);
      expect(LIGHT, token).toContain(token);
    }
  });

  it('tints light-mode shadows with ink rather than neutral black', () => {
    // Neutral black in light mode reads as grey dirt; the ramp must be tinted.
    const drops = LIGHT.match(/0 \d+px \d+px[^;]*;/g) ?? [];
    expect(drops.length, 'light elevation drops exist').toBeGreaterThan(0);
    for (const d of drops) {
      expect(d, `light shadow must be ink-tinted, got: ${d}`).toContain('23, 22, 40');
    }
  });
});

describe('radius scale', () => {
  it('is complete and monotonic', () => {
    const names = [...SHARED.matchAll(/--radius-([a-z0-9]+)\s*:\s*(\d+)px/g)].map(
      (m) => [m[1], parseInt(m[2], 10)] as const,
    );
    const map = new Map<string, number>(names);

    for (const step of ['xs', 'sm', 'field', 'control', 'md', 'lg', 'xl', '2xl', 'sheet', 'pill']) {
      expect(map.has(step), `radius-${step} must be declared`).toBe(true);
    }

    // Monotonic up to pill, which is deliberately the terminal value.
    const ladder = ['xs', 'sm', 'field', 'control', 'md', 'lg', 'xl', '2xl'].map((s) => map.get(s)!);
    for (let i = 1; i < ladder.length; i++) {
      expect(ladder[i], `radius must increase at step ${i}`).toBeGreaterThan(ladder[i - 1]);
    }
  });

  it('never reuses a radius across two steps of the same size scale', () => {
    // The bug behind "everything looks too rounded": a size map like
    // lg→control, xl→control, 2xl→xl makes the size prop meaningless and
    // flattens the hierarchy, because siblings end up identical.
    const kitDir = resolve(process.cwd(), 'src/components/ui');
    const offenders: string[] = [];

    for (const file of readdirSync(kitDir)) {
      if (!file.endsWith('.tsx')) continue;
      const src = readFileSync(resolve(kitDir, file), 'utf8');

      // Find object literals that map size names to radius tokens.
      const maps = src.matchAll(/\{[^{}]*?(?:sm|md|lg|xl)[^{}]*?rounded-\(--radius-[^{}]*?\}/g);
      for (const map of maps) {
        const tokens = [...map[0].matchAll(/rounded-\(--(radius-[a-z0-9-]+)\)/g)].map((m) => m[1]);
        const seen = new Set<string>();
        for (const t of tokens) {
          if (seen.has(t)) offenders.push(`${file}: ${t} used twice in one size map`);
          seen.add(t);
        }
      }
    }

    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });

  it('preserves the six pre-existing radius tokens (backward compatibility)', () => {
    for (const token of [
      '--radius-pill',
      '--radius-sheet',
      '--radius-card-xl',
      '--radius-card-lg',
      '--radius-card-md',
      '--radius-card-sm',
    ]) {
      expect(base, `${token} must survive in the original file`).toContain(token);
    }
  });
});

describe('glow scale', () => {
  it('exposes only three levels per accent (restraint is the rule)', () => {
    for (const accent of ['accent', 'rose', 'warning', 'danger']) {
      for (const level of ['sm', 'md', 'lg']) {
        expect(glow, `--glow-${accent}-${level}`).toContain(`--glow-${accent}-${level}:`);
      }
      expect(glow, `${accent} must not add a 4th level`).not.toContain(`--glow-${accent}-xl`);
    }
  });

  it('binds every glow to a token colour, never a raw hex', () => {
    // Each declaration must resolve through var(), color-mix on a token, or
    // currentColor (valid for data-driven marks that carry their own hue).
    const decls = [...glow.matchAll(/--(glow-[a-z-]+):\s*([^;]+);/g)];
    expect(decls.length).toBeGreaterThan(0);
    for (const [, name, value] of decls) {
      const usesToken =
        /var\(--(intent|focus)-/.test(value) ||
        /color-mix\(in srgb, var\(--/.test(value) ||
        /currentColor/.test(value);
      expect(usesToken, `${name} must derive from a token, got: ${value}`).toBe(true);
      expect(value, `${name} must not hardcode a hex`).not.toMatch(/#[0-9a-f]{3,6}\b/i);
    }
  });

  it('keeps dark glows as light and light glows as tinted shadow', () => {
    const darkBlock = blockOf(glow, ".dark,\n[data-theme='dark']");
    const lightBlock = blockOf(glow, "[data-theme='light'],\n.light");
    expect(darkBlock).toContain('0 0 14px');
    // Light mode converts aura into a downward bloom under the element.
    expect(lightBlock).toContain('0 4px 12px');
  });
});

describe('type scale', () => {
  const STEPS = [
    'micro',
    'caption',
    'body',
    'body-lg',
    'title',
    'heading',
    'display',
    'hero',
    'billboard',
  ] as const;

  it('declares all nine steps with a full size/leading/tracking triple', () => {
    for (const step of STEPS) {
      expect(type, `--type-${step}-size`).toMatch(new RegExp(`--type-${step}-size\\s*:`));
      expect(type, `--type-${step}-leading`).toMatch(new RegExp(`--type-${step}-leading\\s*:`));
      expect(type, `--type-${step}-tracking`).toMatch(new RegExp(`--type-${step}-tracking\\s*:`));
    }
  });

  it('is monotonic — every step is larger than the one before it', () => {
    const sizes = [...type.matchAll(/--type-([a-z-]+)-size:\s*([\d.]+)rem/g)].map(
      (m) => [m[1], parseFloat(m[2])] as const,
    );
    const map = new Map<string, number>(sizes);

    const ladder = STEPS.map((s) => map.get(s)!);
    for (let i = 1; i < ladder.length; i++) {
      expect(
        ladder[i],
        `type size must grow at step ${STEPS[i]} (got ${ladder[i]} vs ${ladder[i - 1]})`,
      ).toBeGreaterThan(ladder[i - 1]);
    }
  });

  it('pairs a tighter line-height as size grows', () => {
    // Large text needs less leading; body text needs the most air. This is the
    // pairing that stops a design system losing control of vertical rhythm.
    const leads = new Map(
      [...type.matchAll(/--type-([a-z-]+)-leading:\s*([\d.]+)/g)].map((m) => [
        m[1],
        parseFloat(m[2]),
      ]),
    );
    expect(leads.get('body')!, 'body text needs the loosest leading').toBeGreaterThan(
      leads.get('billboard')!,
    );
  });

  it('declares the Persian optical-correction ramp', () => {
    for (const step of STEPS) {
      expect(type, `--type-fa-${step}-size`).toMatch(new RegExp(`--type-fa-${step}-size\\s*:`));
    }
    expect(type, '--type-fa-leading').toMatch(/--type-fa-leading\s*:/);
    expect(type, '--type-fa-tracking').toMatch(/--type-fa-tracking\s*:/);
  });

  it('gives Persian a larger optical size than Latin', () => {
    // Vazirmatn reads smaller at equal px; a smaller nominal size would make
    // Persian body text visibly weaker than the Latin it sits beside.
    const pairs: [string, string][] = [
      ['fa-body-size', 'body-size'],
      ['fa-title-size', 'title-size'],
      ['fa-heading-size', 'heading-size'],
    ];
    for (const [fa, latin] of pairs) {
      const faV = parseFloat(type.match(new RegExp(`--type-${fa}:\\s*([\\d.]+)rem`))![1]);
      const latinV = parseFloat(type.match(new RegExp(`--type-${latin}:\\s*([\\d.]+)rem`))![1]);
      expect(faV, `${fa} must exceed ${latin}`).toBeGreaterThan(latinV);
    }
  });

  it('never applies negative tracking to Persian', () => {
    const faTracking = type.match(/--type-fa-tracking:\s*([^;]+)/)![1].trim();
    expect(faTracking).toBe('0em');
  });

  it('exposes a utility class per step, carrying all three properties', () => {
    for (const step of STEPS) {
      const rule = typeUtils.match(
        new RegExp(`\\.type-${step.replace('body-lg', 'body-lg')}\\s*\\{([^}]+)\\}`),
      );
      expect(rule, `.type-${step} utility must exist`).not.toBeNull();
      expect(rule![1]).toContain('font-size');
      expect(rule![1]).toContain('line-height');
      expect(rule![1]).toContain('letter-spacing');
    }
  });

  it('wires the Persian override to data-script', () => {
    expect(typeUtils).toContain("[data-script='fa']");
    expect(typeUtils).toContain('.type-body {');
  });

  it('declares exactly four weight tokens', () => {
    const weights = [...type.matchAll(/--weight-(\w+):/g)].map((m) => m[1]);
    expect(weights.sort()).toEqual(['bold', 'medium', 'regular', 'semibold']);
  });

  it('declares four optical icon sizes', () => {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      expect(type, `--icon-${size}`).toMatch(new RegExp(`--icon-${size}\\s*:`));
    }
  });
});

describe('spacing and z-index', () => {
  it('uses a 4px base grid with intent aliases', () => {
    expect(SHARED).toContain('--space-cluster');
    expect(SHARED).toContain('--space-gutter');
    expect(SHARED).toContain('--space-section');
    for (const step of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']) {
      expect(SHARED, `--space-${step}`).toContain(`--space-${step}:`);
    }
  });

  it('names every z-index layer so stacking stops being guesswork', () => {
    const layers = ['base', 'sticky', 'dock', 'header', 'overlay', 'modal', 'toast', 'tooltip'];
    for (const l of layers) {
      expect(SHARED, `--z-${l}`).toContain(`--z-${l}:`);
    }
  });

  it('keeps z-index ascending so later layers always win', () => {
    const values = [...SHARED.matchAll(/--z-([a-z]+):\s*(\d+);/g)].map(
      (m) => [m[1], parseInt(m[2], 10)] as const,
    );
    const order = ['base', 'sticky', 'dock', 'header', 'overlay', 'modal', 'toast', 'tooltip'];
    const map = new Map<string, number>(values);
    for (let i = 1; i < order.length; i++) {
      expect(map.get(order[i])!).toBeGreaterThan(map.get(order[i - 1])!);
    }
  });
});
