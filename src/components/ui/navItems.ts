/**
 * UI99 — Primary Navigation Model
 *
 * Single source of truth for the product-site dock. Every `NavTab` MUST appear
 * here exactly once — enforced by `src/test/navigation.test.tsx`. Five items is
 * the cognitive ceiling for a bottom bar (3–5 destinations, NNG).
 *
 * Order is deliberate, not alphabetical: it follows the visitor's journey —
 * understand (Overview) → find (Components) → compose (Patterns) → learn
 * (Guides) → trust (Design).
 */

/**
 * The five product-site destinations, declared here as a standalone literal.
 *
 * Deliberately does NOT import NavTab from core/context: this file ships in the
 * npm kit, and the registry would then register a dangling dependency on an
 * app-only module. `AppContext` re-exports this type instead, so the two can
 * never drift without a type error.
 */
export type NavTab = 'HOME' | 'UIKIT' | 'BLOCKS' | 'DOCS' | 'FOUNDATIONS';

/** Job-to-be-done per destination — drives the copy and the ordering. */
export interface NavItemDefinition {
  tab: NavTab;
  label: string;
  faLabel: string;
  /** Short verb used in marketing copy and the command palette. */
  intent: string;
  faIntent: string;
}

export const NAV_ITEMS: readonly NavItemDefinition[] = [
  {
    tab: 'HOME',
    label: 'Overview',
    faLabel: 'نمای کلی',
    intent: 'See what UI99 is',
    faIntent: 'شناخت UI99',
  },
  {
    tab: 'UIKIT',
    label: 'Components',
    faLabel: 'کامپوننت‌ها',
    intent: 'Browse the primitives',
    faIntent: 'مرور کامپوننت‌ها',
  },
  {
    tab: 'BLOCKS',
    label: 'Patterns',
    faLabel: 'الگوها',
    intent: 'Copy composed screens',
    faIntent: 'الگوهای آماده',
  },
  {
    tab: 'DOCS',
    label: 'Guides',
    faLabel: 'راهنماها',
    intent: 'Install, theme, ship',
    faIntent: 'نصب و راه‌اندازی',
  },
  {
    tab: 'FOUNDATIONS',
    label: 'Design',
    faLabel: 'طراحی',
    intent: 'Inspect the tokens',
    faIntent: 'توکن‌های طراحی',
  },
] as const;

/** Every declared tab, as a Set — used by the navigation guard test. */
export const NAV_TABS: ReadonlySet<NavTab> = new Set(NAV_ITEMS.map((i) => i.tab));
