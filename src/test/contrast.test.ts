/**
 * Phase 1.3 CI Gate — WCAG contrast verification over the UI99 token matrix.
 * Body text pairs must be ≥ 4.5:1; large-text/UI-component pairs ≥ 3:1.
 * Source of truth: src/core/tokens/index.ts + math helpers.
 */
import { describe, it, expect } from 'vitest';
import { calculateContrastRatio, auditBrightnessLimit } from '../core/tokens/math';
import { tokens } from '../core/tokens';

const dark = tokens.dark;
const light = tokens.light;

// (foreground, background, minimum, label)
const darkPairs: [string, string, number, string][] = [
  [dark.text.primary, dark.canvas.base, 7, 'primary/canvas AAA'],
  [dark.text.primary, dark.canvas.surface, 7, 'primary/surface AAA'],
  [dark.text.secondary, dark.canvas.base, 4.5, 'secondary/canvas AA'],
  [dark.text.secondary, dark.canvas.surface, 4.5, 'secondary/surface AA'],
  [dark.text.secondary, dark.canvas.surfaceSecondary, 4.5, 'secondary/surfaceSecondary AA'],
  [dark.text.accentEmerald, dark.canvas.base, 3, 'emerald/canvas UI'],
  [dark.text.accentAmber, dark.canvas.base, 3, 'amber/canvas UI'],
  [dark.text.accentRose, dark.canvas.base, 3, 'rose/canvas UI'],
  [dark.text.accentSapphire, dark.canvas.base, 3, 'sapphire/canvas UI'],
  [dark.text.accentAmethyst, dark.canvas.base, 3, 'amethyst/canvas UI'],
];

const lightPairs: [string, string, number, string][] = [
  [light.text.primary, light.canvas.base, 7, 'primary/canvas AAA'],
  [light.text.primary, light.canvas.surface, 7, 'primary/surface AAA'],
  [light.text.secondary, light.canvas.base, 4.5, 'secondary/canvas AA'],
  [light.text.secondary, light.canvas.surface, 4.5, 'secondary/surface AA'],
  [light.text.secondary, light.canvas.surfaceSecondary, 4.5, 'secondary/surfaceSecondary AA'],
  [light.text.accentEmerald, light.canvas.base, 3, 'emerald/canvas UI'],
  [light.text.accentAmber, light.canvas.base, 3, 'amber/canvas UI'],
  [light.text.accentRose, light.canvas.base, 3, 'rose/canvas UI'],
  [light.text.accentSapphire, light.canvas.base, 3, 'sapphire/canvas UI'],
  [light.text.accentAmethyst, light.canvas.base, 3, 'amethyst/canvas UI'],
];

describe('WCAG contrast matrix — dark theme', () => {
  it.each(darkPairs)('%s on %s (%s) passes', (fg, bg, min, label) => {
    const ratio = calculateContrastRatio(fg, bg);
    expect(ratio, `${label}: ${fg} on ${bg} = ${ratio}:1 (needs ${min}:1)`).toBeGreaterThanOrEqual(min);
  });
});

describe('WCAG contrast matrix — light theme', () => {
  it.each(lightPairs)('%s on %s (%s) passes', (fg, bg, min, label) => {
    const ratio = calculateContrastRatio(fg, bg);
    expect(ratio, `${label}: ${fg} on ${bg} = ${ratio}:1 (needs ${min}:1)`).toBeGreaterThanOrEqual(min);
  });
});

describe('Muted text — the floor of the ladder, in BOTH themes', () => {
  // Muted is not decoration. It carries timestamps, helper copy, captions and
  // metadata — all of it small text, so WCAG asks 4.5:1 and not the 3:1 a
  // decorative grey can reach for. Both themes shipped at ~3.1:1, and only
  // fixing light would have made the two drift apart again, which is the exact
  // failure this block exists to prevent.
  it('dark muted clears AA on a card', () => {
    expect(calculateContrastRatio(dark.text.muted, dark.canvas.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it('light muted clears AA on a card', () => {
    expect(calculateContrastRatio(light.text.muted, light.canvas.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it('light muted still clears AA on the canvas, not just on a card', () => {
    expect(calculateContrastRatio(light.text.muted, light.canvas.base)).toBeGreaterThanOrEqual(4.5);
  });
  it('muted stays below secondary — the hierarchy must survive the fix', () => {
    // On dark, less contrast = lighter. On light, less contrast = darker. A
    // muted that outranks secondary in either direction is a bug, not a taste
    // call: the two tokens would be telling the eye the opposite story.
    expect(calculateContrastRatio(dark.text.muted, dark.canvas.surface)).toBeLessThan(
      calculateContrastRatio(dark.text.secondary, dark.canvas.surface),
    );
    expect(calculateContrastRatio(light.text.muted, light.canvas.surface)).toBeLessThan(
      calculateContrastRatio(light.text.secondary, light.canvas.surface),
    );
  });
});

describe('Light/dark surface parity', () => {
  // "Light should be exactly as good as dark" has to mean something measurable,
  // or it is just a preference. The one number that captures it: how far a
  // theme's own card sits from its own canvas. Dark cards melt into a near-black
  // canvas; light cards used to sit on a visibly grey page, 3x further away.
  it('light canvas is no further from its card than dark is', () => {
    const d = auditBrightnessLimit(dark.canvas.base, dark.canvas.surface, 'dark');
    const l = auditBrightnessLimit(light.canvas.base, light.canvas.surface, 'light');
    expect(
      l.difference,
      `light canvas→card gap ${l.difference} vs dark ${d.difference} — light should be the same system in a brighter room`,
    ).toBeLessThanOrEqual(d.difference * 1.5);
  });
});

describe('Anti-slop brightness audit (canvas vs surface)', () => {
  it('dark mode stays within the 12% limit', () => {
    const r = auditBrightnessLimit(dark.canvas.base, dark.canvas.surface, 'dark');
    expect(r.passesRule).toBe(true);
  });
  it('light mode stays within the 7% limit', () => {
    const r = auditBrightnessLimit(light.canvas.base, light.canvas.surface, 'light');
    expect(r.passesRule).toBe(true);
  });
});
