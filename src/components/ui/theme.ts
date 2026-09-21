/**
 * SAFA UI Kit — Self-Contained Theme Detection (Phase 2.1)
 *
 * Kit primitives must not depend on app context (npm-package portability,
 * the shadcn/ui standard: copy a component anywhere and it works).
 *
 * The app shell (AppProvider) owns theme *state* and expresses it by toggling
 * the `dark` / `light` class on <html>. This hook observes that class with a
 * MutationObserver via useSyncExternalStore — no context needed, reactive to
 * app theme switches, SSR/JS-safe. Consumers can still force a mode with
 * `darkMode` prop overrides, matching shadcn's opt-out ergonomics.
 */

import { useSyncExternalStore } from 'react';

export type KitThemeMode = 'dark' | 'light';

function subscribe(onChange: () => void): () => void {
  if (typeof document === 'undefined') return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): KitThemeMode {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function getServerSnapshot(): KitThemeMode {
  // SAFA is dark-first (AGENTS.md §1)
  return 'dark';
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) === 'dark';
}

export type ThemeOverride = KitThemeMode | undefined;

/** Convenience for primitives: resolve explicit prop override or observed mode. */
export function useThemeClass(darkMode?: ThemeOverride): { isDark: boolean; mode: KitThemeMode } {
  const observed = useIsDark();
  const mode: KitThemeMode = darkMode ?? (observed ? 'dark' : 'light');
  return { isDark: mode === 'dark', mode };
}
