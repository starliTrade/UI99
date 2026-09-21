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
