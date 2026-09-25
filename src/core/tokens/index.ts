/**
 * UI99 — Obsidian Liquid Glass Unified Design Tokens (Build 02.2)
 * 
 * Engineering & Color Science Standards:
 * - 60-30-10 Chromatic Balance: 60% Velvet Canvas, 30% Layer Surfaces, 10% Accents.
 * - WCAG AAA Certified Contrast: > 16:1 text-to-background ratio.
 * - Sub-pixel Specular Rim Lighting: 1px top highlight (inset 0 1px 0 0) simulating physical glass.
 * - Mathematical Radius Nesting: Inner Radius = Outer Radius - Padding.
 * - Dual-Theme Parity: Velvet Obsidian Dark (#06070A) & Porcelain Matte Light (#F5F5F8).
 */

export const tokens = {
  // Theme Metadata & Color Science
  meta: {
    systemName: 'UI99 Design System',
    specification: 'Linear-Grade & Apple Human Interface Guidelines Hybrid',
    contrastRatio: 'WCAG AAA (18.4:1 dark / 17.2:1 light)',
    rhythmGrid: '4px / 8px atomic base unit',
    typeScaleRatio: 1.25, // Major Third
  },

  // Color Psychology Rationale & Functionality
  psychology: {
    obsidian: {
      role: 'Canvas & Deep Grounding',
      hex: '#06070A',
      rationale: 'Absorbs visual noise, eliminates blue-light eye strain, creates deep focus velvet contrast.',
    },
    porcelain: {
      role: 'Daylight Matte Balance',
      hex: '#F5F5F8',
      rationale: 'Non-glare, matte off-white that avoids clinical blinding brightness while preserving razor sharpness.',
    },
    emerald: {
      role: 'Dopamine & Completion',
      hex: '#10B981',
      rationale: 'Invokes calm achievement, verified closure, and positive habit loop reinforcement.',
    },
    amber: {
      role: 'Focus & Active Sprint',
      hex: '#F59E0B',
      rationale: 'Directs immediate attentional focus without triggering panic or alarm.',
    },
    rose: {
      role: 'Urgent Interrupt & Live Energy',
      hex: '#F43F5E',
      rationale: 'Instant priority signal calibrated to cut through visual noise without hostility.',
    },
    sapphire: {
      role: 'Cognitive Clarity & Graph Sync',
      hex: '#3B82F6',
      rationale: 'Evokes technological precision, cloud synchronization, and structural logic.',
    },
    amethyst: {
      role: 'Synthesis & Memory Reflection',
      hex: '#A855F7',
      rationale: 'Stimulates associative thinking, journaling depth, and contemplative insight.',
    },
  },

  // Obsidian Dark Theme Tokens (Primary & Default)
  dark: {
    canvas: {
      base: '#06070A',                  // Deepest velvet obsidian backdrop
      surface: '#0E0E14',               // Primary container surface
      surfaceSecondary: '#0B0C11',      // Inset containers / grouped lists
      elevated: '#131318',              // Elevated interactive modals / popovers
      cardHover: '#15151C',             // Hover card state
      cardActive: '#1A1A22',            // Pressed card state
      glass: 'rgba(14, 14, 19, 0.52)',  // Frosted liquid glass (blur 20px)
      glassSubtle: 'rgba(255, 255, 255, 0.045)', // Active navigation cushion
      highlightInset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#EDEDEF',               // High-contrast refined silver white
      secondary: '#8E8E98',             // Clean silver neutral (#92929B equivalent)
      muted: '#5C5C68',                 // Subtle muted caption
      subtle: '#454550',                // Darkest caption
      accentEmerald: '#10B981',         // Completion tick
      accentAmber: '#F59E0B',           // Focus mark
      accentRose: '#F43F5E',            // Live indicator
      accentSapphire: '#3B82F6',        // Cloud sync
      accentAmethyst: '#A855F7',        // Insight
    },
    border: {
      hairline: 'rgba(255, 255, 255, 0.025)',
      subtle: 'rgba(255, 255, 255, 0.04)',
      medium: 'rgba(255, 255, 255, 0.08)',
      focus: 'rgba(255, 255, 255, 0.28)',
      active: '#EDEDEF',
    },
    shadow: {
      e0: 'none',
      e1: '0 2px 8px -1px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      e2: '0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
      e3: '0 16px 36px -6px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      e4: '0 24px 56px -10px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
    },
  },

  // Pure Matte Light Theme Tokens (Calm porcelain companion)
  light: {
    canvas: {
      base: '#F5F5F8',                  // Matte porcelain base
      surface: '#FFFFFF',               // Pure white container
      surfaceSecondary: '#F8F8FA',      // Inset group container
      elevated: '#FFFFFF',              // Elevated floating sheet
      cardHover: '#FAFAFC',             // Hover card state
      cardActive: '#F0F0F4',            // Pressed state
      glass: 'rgba(255, 255, 255, 0.72)', // Frosted porcelain glass (blur 24px)
      glassSubtle: 'rgba(0, 0, 0, 0.04)', // Active light cushion
      highlightInset: 'inset 0 1px 0 0 rgba(255, 255, 255, 1)',
    },
    text: {
      primary: '#111116',               // Deep obsidian charcoal text
      secondary: '#646470',             // Muted steel text
      muted: '#9494A0',                 // Caption text
      subtle: '#B5B5BE',                // Hairline text
      accentEmerald: '#059669',
      accentAmber: '#B45309', // amber-700 — amber-600 fails WCAG UI 3:1 on #F5F5F8 (2.93:1)
      accentRose: '#E11D48',
      accentSapphire: '#2563EB',
      accentAmethyst: '#7C3AED',
    },
    border: {
      hairline: 'rgba(0, 0, 0, 0.03)',
      subtle: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.09)',
      focus: 'rgba(0, 0, 0, 0.35)',
      active: '#111116',
    },
    shadow: {
      e0: 'none',
      e1: '0 2px 6px 0 rgba(0, 0, 0, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
      e2: '0 6px 18px -4px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
      e3: '0 12px 28px -6px rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 1)',
      e4: '0 20px 42px -8px rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 1)',
    },
  },

  /* NOTE: there is deliberately no `radius` bag of numbers here any more.
     The rounded standard is a *law*, not a lookup table — see the exported
     `rounded` constant at the bottom of this file, paired with the §RADIUS
     block in src/styles/ui99-elevation.css. */

  // Spacing Units (Atomic 4px / 8px Rhythm)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // Motion Transitions (Tactile, smooth spring-based)
  spring: {
    snappy: { type: 'spring', stiffness: 480, damping: 32 },
    gentle: { type: 'spring', stiffness: 380, damping: 28 },
    fluid: { type: 'spring', stiffness: 320, damping: 24 },
  },

  // State Layers (Material 3-grade, unified across all components; see index.css --state-*)
  // Usage: bg-state-hover / bg-state-press / bg-state-selected / bg-state-drag
  stateLayers: {
    hover: 'var(--state-hover)',      // dark: 6% white | light: 4% black
    press: 'var(--state-press)',      // dark: 4% white | light: 3% black
    selected: 'var(--state-selected)',// dark: 8% white | light: 6% black
    drag: 'var(--state-drag)',        // dark: 16% white | light: 10% black
  },

  // Motion Durations (Apple HIG 150–500ms band; see index.css --duration-* and docs/standards.md §6)
  duration: {
    instant: '75ms',   // state toggles, color swaps
    fast: '120ms',     // hover/press feedback
    base: '180ms',     // small overlays
    slow: '280ms',     // dialogs, sheets
    deliberate: '400ms', // page/hero transitions
  },
  easing: {
    ui99: 'var(--ease-ui99)',           // cubic-bezier(0.16, 1, 0.3, 1) — signature UI99 ease
    standard: 'var(--ease-standard)',   // cubic-bezier(0.2, 0, 0, 1) — M3 standard
  },

  // Focus System (WCAG 2.4.11/2.4.13; see index.css .focus-ui99 / .focus-ui99-inset)
  focus: {
    ringColor: 'var(--focus-ring)',
    ringWidth: '2px',
    gapWidth: '2px',   // canvas-colored separation ring
    classes: {
      outer: 'focus-ui99',       // double-ring for buttons, inputs, icon targets
      inset: 'focus-ui99-inset', // inner ring for segmented pills, list rows, accordion triggers
    },
  },
};

/**
 * Mathematical corner radius nesting calculation:
 * Ensures inner container curves align perfectly with outer parent.
 */
export function calculateInnerRadius(outerRadius: number, padding: number): number {
  return Math.max(0, outerRadius - padding);
}

/** Every rung of the radius ladder, in ascending order. */
export type RadiusRung =
  | 'none' | 'xs' | 'sm' | 'field' | 'control' | 'md'
  | 'lg' | 'xl' | '2xl' | 'sheet' | '3xl' | '4xl' | 'pill';

/** Every padding step a `Surface` accepts. */
export type SurfacePaddingStep = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/* ============================================================================
 * THE ROUNDED STANDARD
 * ============================================================================
 *
 * ONE LAW — outer radius = inner radius + the padding between them.
 *
 * A corner is never picked by eye or by element width; it is a function of the
 * container's padding. That is why this is banded by *padding* rather than by
 * component name, and why nesting stays concentric without anybody thinking
 * about it. Same law as Material 3 shape and the iOS HIG continuous-corner
 * guidance; the values sit in the iOS 26 band, which is rounder than iOS 17.
 *
 * Mirrored in `src/styles/ui99-elevation.css` §RADIUS. That CSS block is what
 * the browser reads; this object is what the code reasons about. `src/test/
 * tokens.test.ts` asserts the two never drift apart.
 */
export const rounded = {
  /** The law, in one line. Quoted in docs/standards.md §5c. */
  law: 'outer radius = inner radius + the padding between them',

  /** Rungs in strict ascending order. `pill` is terminal by definition. */
  ladder: ['none', 'xs', 'sm', 'field', 'control', 'md', 'lg', 'xl', '2xl', 'sheet', '3xl', '4xl', 'pill'] as const satisfies readonly RadiusRung[],

  /** The pixel value of each rung — the single place these numbers are written. */
  px: {
    none: 0,
    xs: 8,
    sm: 12,
    field: 14,
    control: 18,
    md: 22,
    lg: 26,
    xl: 32,
    '2xl': 36,
    sheet: 40,
    '3xl': 48,
    '4xl': 64,
    pill: 9999,
  } as const,

  /**
   * The padding band each rung is designed for. The comment column in the CSS
   * says the same thing; keeping it here lets a component *ask* for the right
   * corner instead of hard-coding one.
   */
  paddingBand: {
    none: [0, 0] as const,
    xs: [1, 4] as const,
    sm: [6, 8] as const,
    field: [10, 12] as const,
    control: [14, 16] as const,
    md: [16, 20] as const,
    lg: [20, 24] as const,
    xl: [24, 32] as const,
    '2xl': [32, 36] as const,
    sheet: [36, 44] as const,
    '3xl': [44, 56] as const,
    '4xl': [56, 128] as const,
  },

  /**
   * THE MAPPING THAT MATTERS: a padding step picks the corner.
   *
   * This is what `Surface`/`Card` consumes, and the reason a card's corners
   * track its content instead of its name. Note that from `md` upward the rung
   * and the padding step share a name — the ladder and the spacing scale are
   * deliberately locked together above the 20px mark.
   */
  byPadding: {
    none: 'none',
    xs: 'sm',
    sm: 'field',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  } as const,

  /**
   * Tailwind v4 shorthand — note the `(--token)` form.
   * `(var(--token))` is NOT equivalent: it compiles to no rule at all, which is
   * how ~1,050 dead utilities shipped once already. Enforced by tokens-gate.
   */
  classFor: (rung: RadiusRung): string => `rounded-(--radius-${rung})`,
} as const;

/**
 * The corner a container of the given padding should use.
 * Returns the Tailwind class directly, so callers never touch a raw number.
 */
export function radiusClassForPadding(padding: SurfacePaddingStep): string {
  return rounded.classFor(rounded.byPadding[padding]);
}

// Re-export mathematical algorithms & audit helpers
export {
  calculateLuminance,
  calculateContrastRatio,
  calculateBrightness,
  auditBrightnessLimit,
  calculateConcentricRadius,
  auditButtonPadding,
  auditContainerPadding,
  hexToRgb,
} from './math';
export type {
  BrightnessAuditResult,
  ConcentricRadiusResult,
  ButtonPaddingAudit,
  ContainerPaddingAudit,
} from './math';
