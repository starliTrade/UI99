// Ambient declaration for the untyped jest-axe package.
// NOTE: must stay a script file (no top-level import/export) for this to be
// treated as an ambient module declaration rather than an augmentation.
declare module 'jest-axe' {
  interface JestAxeConfigureOptions {
    rules?: Record<string, { enabled?: boolean } | string>;
    disableOtherRules?: boolean;
  }
  const axe: (html: Element, options?: JestAxeConfigureOptions) => Promise<{ violations: unknown[] }>;
  const toHaveNoViolations: { matcher: string };
}
