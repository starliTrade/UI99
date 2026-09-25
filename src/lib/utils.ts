import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind CSS classes with clsx and resolving conflicts with tailwind-merge.
 * Standard implementation benchmarked against shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
 * WHY IT LIVES HERE AND NOT IN src/core/tokens:
 *
 * `core/` is the *application's* internals — objects, auth, app context. This
 * is not that: it is the design system's own geometry, and a component copied
 * out of the registry with `npx @99/ui add card` has to keep working in a
 * project that has never heard of this app. It used to live in core/tokens,
 * which meant every copied `Card` shipped an import of `../../core/tokens` —
 * a path that does not exist in the consumer's tree. The npm bundle hid the
 * bug (the bundler inlines it), so it passed review, tests, and a green build;
 * it only surfaced when `registry:validate` asked whether a shipped file
 * references something the registry does not ship.
 *
 * So: this file is the single source of truth, `core/tokens` re-exports it for
 * the app, and a copied `Card` needs nothing but this file. Mirrored in
 * `src/styles/ui99-elevation.css` §RADIUS — that CSS block is what the browser
 * reads, this is what the code reasons about. `src/test/tokens.test.ts` asserts
 * the two never drift apart.
 */

export type RadiusRung =
  | 'none' | 'xs' | 'sm' | 'field' | 'control' | 'md'
  | 'lg' | 'xl' | '2xl' | 'sheet' | '3xl' | '4xl' | 'pill';

/** Every padding step a `Surface` accepts. */
export type SurfacePaddingStep = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
