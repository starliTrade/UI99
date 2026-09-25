/**
 * Navigation guard — the CI tripwire for IA regressions.
 *
 * The bug this exists to prevent: five dock items shipped against ten app tabs,
 * leaving LIFE/CREATE/MEDIA/MORE/INBOX unreachable from primary navigation.
 * These tests fail the build the moment a tab is declared without a dock entry.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { NAV_ITEMS, NAV_TABS } from '../components/ui/navItems';
import { BottomNavigation } from '../components/ui/BottomNavigation';
import { AppProvider, NavTab } from '../core/context/AppContext';
import { AuthProvider } from '../core/context/AuthContext';

describe('primary navigation model', () => {
  it('exposes exactly five destinations (bottom-bar cognitive ceiling)', () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });

  it('has no duplicate tabs', () => {
    const tabs = NAV_ITEMS.map((i) => i.tab);
    expect(new Set(tabs).size).toBe(tabs.length);
  });

  it('covers the product site in journey order', () => {
    expect(NAV_ITEMS.map((i) => i.tab)).toEqual([
      'HOME',
      'UIKIT',
      'BLOCKS',
      'DOCS',
      'FOUNDATIONS',
    ]);
  });

  it('gives every destination bilingual copy', () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.length, `${item.tab} label`).toBeGreaterThan(0);
      expect(item.faLabel.length, `${item.tab} faLabel`).toBeGreaterThan(0);
      expect(item.intent.length, `${item.tab} intent`).toBeGreaterThan(0);
      expect(item.faIntent.length, `${item.tab} faIntent`).toBeGreaterThan(0);
    }
  });

  it('no longer ships the retired personal-OS tabs', () => {
    // Plain strings on purpose: these are no longer valid NavTab values, and
    // the test should keep compiling precisely because they were removed.
    const retired = ['LIFE', 'CREATE', 'MEDIA', 'MORE', 'INBOX'];
    for (const tab of retired) {
      expect(NAV_TABS.has(tab as NavTab), `${tab} must not be in the dock`).toBe(false);
    }
  });
});

describe('BottomNavigation', () => {
  it('renders one accessible destination per nav item', () => {
    render(
      <AuthProvider>
        <AppProvider>
          <BottomNavigation />
        </AppProvider>
      </AuthProvider>,
    );

    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(nav).toBeInTheDocument();

    for (const item of NAV_ITEMS) {
      expect(
        screen.getByRole('button', { name: item.label }),
        `dock must expose "${item.label}"`,
      ).toBeInTheDocument();
    }

    // Search companion button stays reachable.
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('exposes aria-current on the active destination only', () => {
    render(
      <AuthProvider>
        <AppProvider>
          <BottomNavigation />
        </AppProvider>
      </AuthProvider>,
    );

    const overview = screen.getByRole('button', { name: 'Overview' });
    const components = screen.getByRole('button', { name: 'Components' });

    expect(overview).toHaveAttribute('aria-current', 'page');
    expect(components).not.toHaveAttribute('aria-current');
  });
});
