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

  it('exposes a utility per step, carrying all three properties', () => {
    // Must be an `@utility`, not a plain `.class`. A plain class cannot take a
    // variant, so `sm:type-body` would silently resolve to nothing — which is
    // exactly the bug the file header documents. Matching `@utility` also keeps
    // the assertion off the illustrative `.type-body { … }` in the header comment,
    // which a bare `\.type-body\s*\{` regex would happily match first.
    for (const step of STEPS) {
      const rule = typeUtils.match(new RegExp(`@utility type-${step}\\s*\\{([^}]+)\\}`));
      expect(rule, `@utility type-${step} must exist`).not.toBeNull();
      expect(rule![1]).toContain('font-size');
      expect(rule![1]).toContain('line-height');
      expect(rule![1]).toContain('letter-spacing');
    }
  });

  it('wires the Persian override to data-script', () => {
    expect(typeUtils).toContain("[data-script='fa']");
    // The override is a plain class rule on purpose: it must out-specify the
    // same-layer `@utility` rule regardless of source order.
    expect(typeUtils).toMatch(/\[data-script='fa'\]\s+\.type-body\s*\{/);
  });

  it('registers weights and icon sizes as utilities, not raw scale names', () => {
    for (const w of ['regular', 'medium', 'semibold', 'bold']) {
      expect(typeUtils, `weight-${w} must be a utility`).toMatch(
        new RegExp(`@utility weight-${w}\\s*\\{[^}]*font-weight`),
      );
    }
    for (const s of ['xs', 'sm', 'md', 'lg']) {
      expect(typeUtils, `icon-${s} must be a utility`).toMatch(
        new RegExp(`@utility icon-${s}\\s*\\{[^}]*width`),
      );
    }
  });

  it('declares exactly four weight tokens', () => {
    const weights = [...type.matchAll(/--weight-(\w+):/g)].map((m) => m[1]);
    expect(weights.sort()).toEqual(['bold', 'medium', 'regular', 'semibold']);
  });

  it('declares five optical icon sizes plus two dot sizes', () => {
    // Five, not four. The original scale was 12/14/18/24 and skipped 16px — the
    // single most common icon size in the kit (351 call sites). A scale that
    // omits its own default is not a scale, so 16px and 20px were added and the
    // ladder rebuilt from the sizes actually in use.
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
      expect(type, `--icon-${size}`).toMatch(new RegExp(`--icon-${size}\\s*:`));
    }
    for (const size of ['dot', 'dot-lg']) {
      expect(type, `--icon-${size}`).toMatch(new RegExp(`--icon-${size}\\s*:`));
    }
  });

  it('orders the icon scale strictly ascending', () => {
    const px = (name: string) => {
      const m = type.match(new RegExp(`--icon-${name}:\\s*([\\d.]+)rem`));
      return m ? parseFloat(m[1]) * 16 : NaN;
    };
    const ladder = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (let i = 1; i < ladder.length; i++) {
      expect(px(ladder[i]), `icon-${ladder[i]} must exceed icon-${ladder[i - 1]}`).toBeGreaterThan(
        px(ladder[i - 1]),
      );
    }
    // And 16px — the default — is really on the scale, not approximated.
    expect(px('md'), 'icon-md is the 16px default').toBe(16);
  });

  it('keeps status dots below the icon scale', () => {
    const px = (name: string) => {
      const m = type.match(new RegExp(`--icon-${name}:\\s*([\\d.]+)rem`));
      return m ? parseFloat(m[1]) * 16 : NaN;
    };
    // A dot is not a glyph. It must never be expressible as "a very small icon".
    expect(px('dot')).toBeLessThan(px('xs'));
    expect(px('dot-lg')).toBeLessThan(px('xs'));
  });

  it('exposes an icon utility per size', () => {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'dot', 'dot-lg']) {
      expect(typeUtils, `icon-${size} must be a utility`).toMatch(
        new RegExp(`@utility icon-${size}\\s*\\{[^}]*width`),
      );
    }
    // The bare default, so a component can size an icon with no class at all.
    expect(typeUtils).toMatch(/@utility icon\s*\{[^}]*width:\s*var\(--icon-md\)/);
  });

  it('leaves no raw w/h pair on a component element', () => {
    // Icons, not layout boxes. A 16px divider or an 18px checkbox is not an
    // icon, and naming it one would be worse than leaving it raw — so the rule
    // only fires on a matched w-N h-N pair, and `tokens:gate` enforces it.
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(resolve(process.cwd(), dir), { withFileTypes: true })) {
        const p = `${dir}/${entry.name}`;
        if (entry.isDirectory()) walk(p);
        else if (entry.name.endsWith('.tsx')) {
          const src = readFileSync(resolve(process.cwd(), p), 'utf8');
          for (const m of src.matchAll(
            /<[A-Z][A-Za-z0-9]*\b[^>]*?className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g,
          )) {
            const list = m[1] ?? m[2] ?? m[3] ?? '';
            const w = /(?:^|\s)w-(3|3\.5|4|5|6)(?=\s|$)/.exec(list);
            const h = /(?:^|\s)h-(3|3\.5|4|5|6)(?=\s|$)/.exec(list);
            if (w && h && w[1] === h[1]) offenders.push(`${p}: ${m[0].slice(0, 60)}`);
          }
        }
      }
    };
    walk('src');
    expect(offenders, `raw icon sizes:\n${offenders.join('\n')}`).toEqual([]);
  });
});

describe('registry integrity', () => {
  /**
   * `Card` once imported `../../core/tokens` for the radius law. The npm bundle
   * inlines that, so the bug was invisible to typecheck, tests and build — but
   * `npx @99/ui add card` copied a file importing a path that does not exist in
   * the consumer's project. `registry:validate` caught it; this keeps the class
   * of bug from returning through a different door.
   */
  it('ships no component that imports app-internal modules', () => {
    // Scoped to what the registry actually ships. Plenty of components in this
    // directory are app-only (ObjectCard, TopHeader, BottomNavigation — they
    // read App/Auth/Object context) and are *supposed* to be coupled to the
    // app; only a component a consumer can copy has to stand alone.
    const registry = JSON.parse(
      readFileSync(resolve(process.cwd(), 'public/registry.json'), 'utf8'),
    ) as { items: { name: string; files: { content: string }[] }[] };
    const offenders: string[] = [];
    for (const item of registry.items) {
      if (item.name === 'utils') continue;
      for (const file of item.files) {
        for (const m of file.content.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
          if (/(^|\/)(core|context|registry)\//.test(m[1])) {
            offenders.push(`${item.name} → ${m[1]}`);
          }
        }
      }
    }
    expect(
      offenders,
      `registry components must only import lib/ or their siblings:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('keeps the radius law defined exactly once, in the module the registry ships', () => {
    const lib = readFileSync(resolve(process.cwd(), 'src/lib/utils.ts'), 'utf8');
    const core = readFileSync(resolve(process.cwd(), 'src/core/tokens/index.ts'), 'utf8');
    // One definition...
    expect(lib).toContain('export const rounded = {');
    // ...re-exported, not restated, so the two cannot drift.
    expect(core).toContain("export { rounded, radiusClassForPadding } from '../../lib/utils'");
    expect(core).not.toContain('export const rounded = {');
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
    const layers = [
      'base',
      'content',
      'sticky',
      'raised',
      'floating',
      'dock',
      'header',
      'overlay',
      'modal',
      'popover',
      'toast',
      'tooltip',
    ];
    for (const l of layers) {
      expect(SHARED, `--z-${l}`).toContain(`--z-${l}:`);
    }
  });

  it('exposes a z utility per layer', () => {
    for (const l of [
      'base',
      'content',
      'sticky',
      'raised',
      'floating',
      'dock',
      'header',
      'overlay',
      'modal',
      'popover',
      'toast',
      'tooltip',
    ]) {
      expect(elevation, `z-${l} utility must exist`).toMatch(
        new RegExp(`@utility z-${l}\\s*\\{[^}]*z-index`),
      );
    }
  });

  /**
   * The portal band is not decoration. Radix renders every menu, listbox and
   * popover surface into document.body, so a dropdown opened inside an open
   * Dialog is no longer a descendant of that Dialog and cannot inherit its
   * stacking context. At --z-modal it painted *under* the dialog that owns it.
   */
  it('puts the portal band above modal so a menu inside a dialog can win', () => {
    const v = (l: string) => parseInt(SHARED.match(new RegExp(`--z-${l}:\\s*(\\d+)`))![1], 10);
    expect(v('popover')).toBeGreaterThan(v('modal'));
    expect(v('popover')).toBeLessThan(v('toast'));
  });

  it('keeps z-index ascending so later layers always win', () => {
    const values = [...SHARED.matchAll(/--z-([a-z]+):\s*(\d+);/g)].map(
      (m) => [m[1], parseInt(m[2], 10)] as const,
    );
    const order = [
      'base',
      'content',
      'sticky',
      'raised',
      'floating',
      'dock',
      'header',
      'overlay',
      'modal',
      'popover',
      'toast',
      'tooltip',
    ];
    const map = new Map<string, number>(values);
    for (let i = 1; i < order.length; i++) {
      expect(map.get(order[i])!).toBeGreaterThan(map.get(order[i - 1])!);
    }
  });

  it('exposes a spacing utility per declared step', () => {
    for (const step of [
      'hairline',
      'tight',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      'cluster',
      'gap',
      'gutter',
      'section',
    ]) {
      expect(elevation, `space-${step} utility must exist`).toMatch(
        new RegExp(`@utility space-${step}\\s*\\{`),
      );
    }
  });

  it('keeps the whole spacing scale on the 4px grid', () => {
    for (const m of SHARED.matchAll(/--space-([a-z0-9]+):\s*(\d+)px/g)) {
      const px = parseInt(m[2], 10);
      // 2px half-steps are deliberate (icon-to-text tight pairs) and are the
      // only sanctioned exception; anything else off-grid is a drift.
      if (px !== 2) expect(px % 4, `--space-${m[1]} must sit on the 4px grid`).toBe(0);
    }
  });

  /**
   * Recorded because the finding is counter-intuitive and was nearly acted on in
   * reverse. Tailwind v4 spacing is a single `--spacing: .25rem` multiplier, so
   * the 4px grid is ALREADY enforced by the framework. Eight of the twelve
   * declared numeric steps are byte-for-byte the values Tailwind already emits.
   * This test does not forbid them — it documents why nobody should mass-migrate
   * `p-4` to `space-md`: 911 call sites, zero rendered pixels changed.
   */
  it('does not pretend the numeric steps add a grid Tailwind lacks', () => {
    const numeric = [
      ...SHARED.matchAll(/--space-(?!cluster|gap\b|gutter|section)([a-z0-9]+):\s*(\d+)px/g),
    ].map((m) => parseInt(m[2], 10));
    const tailwindSteps = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64];
    const redundant = numeric.filter((px) => tailwindSteps.includes(px));
    const additive = numeric.filter((px) => !tailwindSteps.includes(px));
    // Of the twelve numeric steps, only 56/72/96 are genuinely additive; the
    // other nine duplicate what Tailwind already emits. --space-section is 56px
    // too, but it is an intent alias, not a step, so it is excluded above.
    expect(additive, 'only 56/72/96 are genuinely additive').toEqual([56, 72, 96]);
    expect(redundant.length, 'most numeric steps duplicate Tailwind').toBe(9);
    // The intent aliases are the part that carries meaning.
    for (const alias of ['cluster', 'gap', 'gutter', 'section']) {
      expect(SHARED, `--space-${alias} is the load-bearing part`).toContain(
        `--space-${alias}:`,
      );
    }
  });

  it('leaves no raw numeric z-index in the source', () => {
    // The eight original tokens governed nothing: 90 hand-picked numbers across
    // 19 files sat beside them. A regression here is silent — the page still
    // renders, just in the wrong order — so it is asserted, not reviewed.
    const named = [
      'base',
      'content',
      'sticky',
      'raised',
      'floating',
      'dock',
      'header',
      'overlay',
      'modal',
      'popover',
      'toast',
      'tooltip',
    ];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(resolve(process.cwd(), dir), { withFileTypes: true })) {
        const p = `${dir}/${entry.name}`;
        if (entry.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(entry.name)) {
          readFileSync(resolve(process.cwd(), p), 'utf8')
            .split('\n')
            .forEach((line, i) => {
              const m = line.match(/(?<![\w-])-?z-\[?(\d+)\]?(?![\w-])/);
              if (m && !named.includes(m[1])) offenders.push(`${p}:${i + 1} → ${m[0]}`);
            });
        }
      }
    };
    walk('src');
    expect(offenders, `raw z-index values:\n${offenders.join('\n')}`).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Density, focus, motion and light-theme contrast.
   Each of these axes was declared in the docs and either unenforced or wrong.
   The tests below are the reason they now hold.
   ═══════════════════════════════════════════════════════════════════════════ */
describe('density axis', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/ui99-elevation.css'), 'utf8');

  it('defines a density multiplier that all three modes set', () => {
    expect(css).toMatch(/--density-scale:\s*1;/);
    expect(css).toMatch(/\[data-density='compact'\]\s*\{\s*--density-scale:\s*0\.875;\s*\}/);
    expect(css).toMatch(/\[data-density='comfortable'\]\s*\{\s*--density-scale:\s*1\.125;\s*\}/);
  });

  it('exposes control heights that resolve against the multiplier', () => {
    // The ladder has to be expressed against the scale, or a density change is
    // a no-op — which is exactly what a decorative density mode looks like.
    for (const step of ['xs', 'sm', 'md', 'lg']) {
      expect(css).toMatch(new RegExp(`--control-h-${step}:\\s*calc\\([^)]*var\\(--density-scale\\)`));
    }
  });

  it('scales the intent aliases but leaves the numeric steps density-invariant', () => {
    // Numeric steps mirror what Tailwind already emits; scaling them would make
    // a data cell change size when only the rhythm was meant to change.
    expect(css).toMatch(/--space-md:\s*16px;/);
    expect(css).toMatch(/--space-cluster:\s*calc\(8px \* var\(--density-scale\)\)/);
  });

  it('defaults to `default` density so the 44px touch floor holds unless traded away', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    // No data-density in the markup means the CSS `default` branch applies,
    // which is scale 1 — the baseline the touch-target rule was written for.
    expect(html).not.toMatch(/data-density="(compact|comfortable)"/);
  });
});

describe('focus visibility (WCAG 2.4.7 / 2.4.11)', () => {
  const ui = readFileSync(resolve(process.cwd(), 'src/styles/ui99.css'), 'utf8');

  it('draws the focus ring with outline, not box-shadow', () => {
    // A box-shadow ring REPLACES the element's elevation shadow, so a card
    // lost its depth cue at exactly the moment a keyboard user needed it.
    const block = /\.focus-ui99:focus-visible[^{]*\{[^}]*\}/.exec(ui)?.[0] ?? '';
    expect(block).toMatch(/outline:\s*2px solid var\(--focus-ring\)/);
    expect(block).not.toMatch(/box-shadow/);
  });

  it('supplies an offset so the ring is legible against both theme surfaces', () => {
    const block = /\.focus-ui99:focus-visible[^{]*\{[^}]*\}/.exec(ui)?.[0] ?? '';
    expect(block).toMatch(/outline-offset:\s*2px/);
  });

  it('offers the AGENTS.md-mandated `focus-safa` spelling as an alias', () => {
    // AGENTS.md §6 and docs/standards.md §12 both name `focus-safa`. The
    // constitution is the spec, so the alias exists rather than the doc being
    // quietly rewritten to match the code.
    expect(ui).toMatch(/\.focus-safa:focus-visible/);
    expect(ui).toMatch(/\.focus-safa-inset:focus-visible/);
  });

  it('never removes the focus indicator without providing a replacement', () => {
    const offenders: string[] = [];
    for (const f of readdirSync(resolve(process.cwd(), 'src/components/ui'))) {
      if (!f.endsWith('.tsx')) continue;
      const src = readFileSync(resolve(process.cwd(), 'src/components/ui', f), 'utf8');
      for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g)) {
        const list = m[1] ?? m[2] ?? m[3] ?? '';
        if (!/outline-none/.test(list)) continue;
        if (/(?:^|\s)(?:[a-z-]+:)*ring-\d/.test(list)) continue;
        if (/focus-ui99|focus-safa/.test(list)) continue;
        offenders.push(`${f}: ${list.trim().slice(0, 70)}`);
      }
    }
    expect(offenders, `focus removed with no replacement:\n${offenders.join('\n')}`).toEqual([]);
  });
});

describe('reduced motion (WCAG 2.3.3)', () => {
  it('honours prefers-reduced-motion for the springs, not just CSS transitions', () => {
    // The CSS block reaches transition-duration. `motion` animates transforms
    // through JS, so without a provider the setting simply did not apply to
    // the ~90 spring-animated components.
    const main = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8');
    expect(main).toMatch(/<MotionConfig reducedMotion="user">/);
  });

  it('still covers plain CSS transitions', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/ui99.css'), 'utf8');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});

describe('motion duration ramp', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/ui99.css'), 'utf8');

  it('declares every duration the code actually uses', () => {
    // 150ms was the most common transition in the kit (23 sites) and the
    // original ramp — 75/120/180/280/400 — had no token for it. The ramp was
    // rebuilt from the measured distribution; these are the measured values.
    for (const [token, value] of [
      ['instant', '75ms'],
      ['fast', '100ms'],
      ['quick', '150ms'],
      ['base', '180ms'],
      ['slow', '280ms'],
      ['deliberate', '400ms'],
      ['progress', '700ms'],
    ] as const) {
      expect(css, `--duration-${token}`).toMatch(new RegExp(`--duration-${token}:\\s*${value.replace('.', '\\.')}`));
    }
  });

  it('uses a named duration at every migrated call site', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(resolve(process.cwd(), dir), { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(e.name)) {
          readFileSync(resolve(process.cwd(), p), 'utf8')
            .split('\n')
            .forEach((line, i) => {
              if (/(?<![\w-])duration-\d/.test(line)) offenders.push(`${p}:${i + 1}`);
            });
        }
      }
    };
    walk('src');
    expect(offenders, `raw duration-N:\n${offenders.join('\n')}`).toEqual([]);
  });
});

describe('light-theme legibility (WCAG 1.4.3)', () => {
  const relLum = (hex: string) => {
    const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const contrast = (a: string, b: string) => {
    const [l1, l2] = [relLum(a), relLum(b)];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  it('documents why raw zinc is banned as an unpaired text colour', () => {
    // Measured against this kit's own surfaces, which is the whole point:
    // zinc-400 is 2.56:1 on white and 7.62:1 on the dark card. A "neutral"
    // value is not a neutral value — it is a dark-theme choice that vanishes
    // in the light one.
    expect(contrast('#a1a1aa', '#ffffff')).toBeLessThan(4.5);
    expect(contrast('#a1a1aa', '#0B0C11')).toBeGreaterThan(4.5);
  });

  it('leaves no base zinc text colour unpaired with a dark: variant', () => {
    const offenders: string[] = [];
    for (const f of readdirSync(resolve(process.cwd(), 'src/components/ui'))) {
      if (!f.endsWith('.tsx')) continue;
      const src = readFileSync(resolve(process.cwd(), 'src/components/ui', f), 'utf8');
      for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g)) {
        const list = m[1] ?? m[2] ?? m[3] ?? '';
        if (/dark:/.test(list)) continue;
        if (/(?:^|\s)text-zinc-(?:300|400|500)(?=\s|$)/.test(list)) offenders.push(`${f}: ${list.trim().slice(0, 70)}`);
      }
    }
    expect(offenders, `unpaired light-invisible text:\n${offenders.join('\n')}`).toEqual([]);
  });
});

describe('component anatomy', () => {
  it('documents every kit component', () => {
    // AGENTS.md §6 requires the audit checklist per component. 7 files opened
    // with no docblock at all, which is how "94/101 headers" was understated.
    const undocumented: string[] = [];
    for (const f of readdirSync(resolve(process.cwd(), 'src/components/ui'))) {
      if (!f.endsWith('.tsx')) continue;
      const src = readFileSync(resolve(process.cwd(), 'src/components/ui', f), 'utf8');
      if (!/^\s*\/\*\*/.test(src)) undocumented.push(f);
    }
    expect(undocumented, `components with no header doc:\n${undocumented.join('\n')}`).toEqual([]);
  });
});
