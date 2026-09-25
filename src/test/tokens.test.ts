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
import { rounded } from '../core/tokens';

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

describe('radius scale — the rounded standard', () => {
  const LADDER = [
    'none', 'xs', 'sm', 'field', 'control', 'md',
    'lg', 'xl', '2xl', 'sheet', '3xl', '4xl', 'pill',
  ] as const;

  const cssPx = new Map(
    [...SHARED.matchAll(/--radius-([a-z0-9]+)\s*:\s*(\d+)px/g)].map(
      (m) => [m[1], parseInt(m[2], 10)] as const,
    ),
  );

  it('declares every rung of the ladder, in the CSS', () => {
    for (const rung of LADDER) {
      expect(cssPx.has(rung), `--radius-${rung} must be declared in ui99-elevation.css`).toBe(true);
    }
  });

  it('is strictly monotonic — no two neighbours share a corner', () => {
    // A flat step is invisible: the size prop stops meaning anything and the
    // hierarchy between a chip and a card quietly disappears.
    for (let i = 1; i < LADDER.length; i++) {
      const prev = cssPx.get(LADDER[i - 1])!;
      const cur = cssPx.get(LADDER[i])!;
      expect(cur, `--radius-${LADDER[i]} must exceed --radius-${LADDER[i - 1]}`).toBeGreaterThan(prev);
    }
  });

  it('mirrors the TypeScript law exactly — CSS and code cannot drift', () => {
    // src/core/tokens/index.ts is what components read; the CSS block is what
    // the browser reads. If they disagree, half the kit renders a corner the
    // other half never asked for.
    expect([...rounded.ladder]).toEqual([...LADDER]);
    for (const rung of LADDER) {
      expect(rounded.px[rung], `--radius-${rung} value must match tokens/index.ts`).toBe(cssPx.get(rung));
    }
  });

  it('honours the law: a rung is never tighter than the padding it wraps', () => {
    // outer = inner + padding means the radius must be at least as large as
    // the padding inside it, or the corner "pinches" and the inset highlight
    // has nowhere to sit.
    for (const rung of LADDER) {
      if (rung === 'none' || rung === 'pill') continue;
      const [lo] = rounded.paddingBand[rung];
      expect(cssPx.get(rung)!, `--radius-${rung} must be >= its own padding band`).toBeGreaterThanOrEqual(lo);
    }
  });

  it('derives a card corner from its padding, not from its name', () => {
    // The whole point of the standard: bigger padding => bigger corner, always.
    const steps = Object.keys(rounded.byPadding) as (keyof typeof rounded.byPadding)[];
    for (let i = 1; i < steps.length; i++) {
      const prev = cssPx.get(rounded.byPadding[steps[i - 1]])!;
      const cur = cssPx.get(rounded.byPadding[steps[i]])!;
      expect(cur, `padding "${steps[i]}" must not get a tighter corner than "${steps[i - 1]}"`).toBeGreaterThan(prev);
    }
  });

  it('keeps 3xl/4xl above our own 2xl so the native Tailwind ramp stays monotonic', () => {
    // We override Tailwind's --radius-* variables on purpose, so a stray
    // `rounded-3xl` lands on our scale. If 3xl/4xl were left at Tailwind's
    // defaults, rounded-3xl (24px) would sit BELOW our 2xl (36px).
    expect(cssPx.get('2xl')!).toBeLessThan(cssPx.get('3xl')!);
    expect(cssPx.get('3xl')!).toBeLessThan(cssPx.get('4xl')!);
    expect(cssPx.get('4xl')!).toBeLessThan(cssPx.get('pill')!);
  });

  it('declares the radius scale in exactly one place', () => {
    // A second, drifting copy is how the corners stopped agreeing with each
    // other in the first place. ui99.css must not re-declare --radius-*.
    expect(base).not.toMatch(/^\s*--radius-[a-z0-9-]+\s*:/m);
  });

  it('gives each size step its own corner, and never inverts the scale', () => {
    // The bug behind "everything looks too rounded": a size map like
    // lg→control, xl→control, 2xl→xl makes the size prop meaningless and
    // flattens the hierarchy, because siblings end up identical. Button was
    // the worst case — all five sizes at 9999px.
    //
    // TWO DELIBERATE EXCEPTIONS, both with a reason:
    //   · the floor rungs (`none`, `xs`) may repeat, because they are the
    //     floor precisely because elements under ~28px are too small to have
    //     a corner of their own (a 18px <kbd> and a 22px <kbd> both want 8px;
    //     forcing them apart only produces a lozenge);
    //   · two steps of the SAME height may share a radius, because the law
    //     keys off size — a 40px button and a 40px icon button are one size.
    const FLOOR = new Set(['none', 'xs']);
    const kitDir = resolve(process.cwd(), 'src/components/ui');
    const offenders: string[] = [];
    const HEIGHT = /(?:^|\s)h-(\d+(?:\.\d+)?)\b/;

    for (const file of readdirSync(kitDir)) {
      if (!file.endsWith('.tsx')) continue;
      const src = readFileSync(resolve(kitDir, file), 'utf8');

      // Find object literals that map size names to radius tokens.
      for (const map of src.matchAll(/\{[^{}]*?(?:sm|md|lg|xl)[^{}]*?rounded-\(--radius-[^{}]*?\}/g)) {
        const entries = map[0]
          .split(/[,\n]/)
          .map((line) => {
            const h = line.match(HEIGHT);
            const r = line.match(/rounded-\(--radius-([a-z0-9-]+)\)/);
            return h && r ? { h: parseFloat(h[1]), r: r[1], px: cssPx.get(r[1])! } : null;
          })
          .filter((e): e is { h: number; r: string; px: number } => e !== null)
          .sort((a, b) => a.h - b.h);

        for (let i = 1; i < entries.length; i++) {
          const prev = entries[i - 1];
          const cur = entries[i];
          if (FLOOR.has(cur.r)) continue;
          if (cur.h === prev.h) continue; // one size, one corner
          if (cur.r === prev.r) {
            offenders.push(`${file}: ${cur.r} shared by h-${prev.h} and h-${cur.h} — two sizes, one corner`);
          }
          if (cur.px < prev.px) {
            offenders.push(
              `${file}: h-${cur.h} (${cur.px}px) must not be tighter than h-${prev.h} (${prev.px}px)`,
            );
          }
        }
      }
    }

    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * THE REGRESSION THAT WAS MISSING
 *
 * ~1,050 utility classes once shipped in a form that Tailwind silently refused
 * to compile: `rounded-(var(--radius-sm))` instead of `rounded-(--radius-sm)`,
 * and `shadow-(var(--rim-soft), var(--elevation-2))` instead of a named
 * composite. Nothing threw. TypeScript was clean. Every test passed. The
 * browser simply rendered square corners and no shadows at all.
 *
 * These assertions exist so that failure mode can never be silent again.
 * ═══════════════════════════════════════════════════════════════════════════ */
describe('token utilities actually compile', () => {
  const kitFiles = (() => {
    const dir = resolve(process.cwd(), 'src/components');
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory()
          ? walk(resolve(d, e.name))
          : /\.tsx?$/.test(e.name)
            ? [resolve(d, e.name)]
            : [],
      );
    return walk(dir);
  })();

  const sources = kitFiles.map((f) => ({ f, src: readFileSync(f, 'utf8') }));

  it('never wraps a token in var() inside a utility shorthand', () => {
    // rounded-(var(--x)) is a different string to Tailwind than
    // rounded-(--x). The first compiles to nothing, silently.
    const offenders = sources
      .filter(({ src }) => /(?<![\w-])[a-z-]+-\(var\(--[a-z0-9-]+\)\)/.test(src))
      .map(({ f }) => f.replace(process.cwd(), '.'));
    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });

  it('never writes a multi-token utility — composites must be named', () => {
    // shadow-(--a, --b) is not parseable as a value, so it emits no rule.
    // Two-layer shadows are expressed as --shadow-card / --shadow-modal / etc.
    const offenders = sources
      .filter(({ src }) =>
        /(?<![\w-])[a-z-]+-\((?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+),\s*(?:var\(--[a-z0-9-]+\)|--[a-z0-9-]+)\)/.test(src),
      )
      .map(({ f }) => f.replace(process.cwd(), '.'));
    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });

  it('never leaves a stray paren inside a utility shorthand', () => {
    // An over-greedy codemod once rewrote `shadow-(a, b)` as
    // `shadow-(--shadow-card))`, leaving the second `)` behind. 78 classes
    // looked migrated and rendered nothing. The lookahead keeps this from
    // firing on a `)` that legitimately closes a surrounding expression.
    const STRAY = /(?<![\w-])[a-z-]+-\([^()\n]*\)\)(?=[\s'"`}]|$)/;
    const offenders = sources
      .filter(({ src }) => STRAY.test(src))
      .map(({ f }) => f.replace(process.cwd(), '.'));
    expect(offenders, offenders.join('\n')).toHaveLength(0);
  });

  it('only references custom properties the stylesheet actually declares', () => {
    const declared = new Set([
      ...[elevation, glow, base, type]
        .join('\n')
        .matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm),
    ].map((m) => m[1]));

    const missing = new Map<string, Set<string>>();
    for (const { f, src } of sources) {
      // Match BOTH reference forms — checking only one is how the original
      // gap happened in the first place.
      for (const m of src.matchAll(
        /var\((--[a-z0-9-]+)\)|\(--([a-z0-9-]+)\)/g,
      )) {
        const token = m[1] ?? `--${m[2]}`;
        if (/^(?:elevation|rim|shadow|glow|radius|space|blur|z|type|weight|icon)-/.test(token) && !declared.has(token)) {
          if (!missing.has(token)) missing.set(token, new Set());
          missing.get(token)!.add(f.replace(process.cwd(), '.'));
        }
      }
    }

    const report = [...missing].map(([t, w]) => `${t} — ${[...w].join(', ')}`);
    expect(report, report.join('\n')).toHaveLength(0);
  });

  it('declares a named composite for every two-layer shadow the kit needs', () => {
    // If this ever fails, the fix is to add a composite to ui99-elevation.css
    // — never to write a multi-token utility, which renders as nothing.
    for (const token of ['--shadow-card', '--shadow-card-hover', '--shadow-popover', '--shadow-modal', '--shadow-glow-accent']) {
      expect(elevation + glow, `${token} must be declared`).toMatch(new RegExp(`${token}\\s*:`));
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
