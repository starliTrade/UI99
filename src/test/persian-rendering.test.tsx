/**
 * Persian rendering — the three fixes, asserted on the RENDERED DOM.
 *
 * Every other gate in this repo reads source as text or greps a stylesheet.
 * That is not enough for these three bugs, because each one is invisible in
 * the source and only exists once the tree is rendered:
 *
 *   1. Persian labels were rendered in a non-Persian face. The source said
 *      `font-mono`; the stylesheet said `font-mono` had no Vazirmatn; both
 *      looked fine in isolation. The label was Persian and the face was not.
 *   2. The spec sheet shipped behind a disclosure, so "the dropdown is still
 *      there" was true in the DOM even with the state variable deleted.
 *   3. The hero CTA sat on the theme branch instead of the control surface,
 *      which is only visible as an actual class on the actual button.
 *
 * So this file renders the studio with the language forced to Persian and
 * asserts what the visitor's browser would compute. The language switch lives
 * in the real AuthProvider, so the harness uses the real providers and flips
 * the language the same way the header globe does — a mock would test the
 * mock, not the path a visitor walks.
 */

import React, { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { AppProvider } from '../core/context/AppContext';
import { AuthProvider, useAuth } from '../core/context/AuthContext';
import { RegistryStudio } from '../components/home/RegistryStudio';
import { DesignSystemHomeView } from '../components/views/DesignSystemHomeView';

/** Switches the tree to Persian on mount, the way the header globe does. */
function Persian({ children }: { children: React.ReactNode }) {
  const { setLanguage } = useAuth();
  useEffect(() => {
    setLanguage('fa');
  }, [setLanguage]);
  return <>{children}</>;
}

function Harness({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <Persian>{children}</Persian>
      </AppProvider>
    </AuthProvider>
  );
}

/** Any Arabic-script character — the test for "this label is Persian". */
const PERSIAN = /[؀-ۿ]/;

/** Renders and waits for the language flip to paint. */
async function renderPersian(node: React.ReactElement) {
  const out = render(<Harness>{node}</Harness>);
  await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));
  return out;
}

describe('Persian rendering — the studio', () => {
  it('renders the studio with Persian chrome', async () => {
    await renderPersian(<RegistryStudio />);
    expect(screen.getByLabelText('استودیوی رجیستری')).toBeInTheDocument();
  });

  it('never puts Persian text on the mono voice (§2.8)', async () => {
    const { container } = await renderPersian(<RegistryStudio />);

    // Walk the rendered tree, not the source: the bug was a class that only
    // became wrong once the label behind it turned Persian.
    const offenders: string[] = [];
    for (const el of Array.from(container.querySelectorAll<HTMLElement>('*'))) {
      const text = (el.textContent ?? '').trim();
      // Only leaf-ish nodes: a wrapper inherits its children's text and would
      // be blamed for a descendant's class.
      if (!text || el.children.length > 0 || !PERSIAN.test(text)) continue;
      if (el.classList.contains('font-mono') || el.classList.contains('font-code')) {
        offenders.push(`${el.tagName.toLowerCase()} "${text.slice(0, 30)}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('gives the Persian category labels the UI voice, not the mono voice', async () => {
    const { container } = await renderPersian(<RegistryStudio />);
    // The category filter is the row the visitor reads first, and it is the
    // row the "Persian text, Persian font" complaint was about. Scoped to the
    // category chips specifically: a button elsewhere may legitimately carry
    // no font class at all and simply inherit the body voice.
    const chips = Array.from(
      container.querySelectorAll<HTMLElement>('button[aria-pressed]'),
    ).filter((b) => PERSIAN.test(b.textContent ?? ''));
    expect(chips.length).toBeGreaterThan(0);
    for (const chip of chips) {
      expect(chip.className).toMatch(/font-ui/);
      expect(chip.className).not.toMatch(/font-mono|font-code/);
    }
  });

  it('leaves no inner disclosure over the spec sheet', async () => {
    await renderPersian(<RegistryStudio />);
    // The sheet is the point of the panel; gating it behind a disclosure was
    // the regression. Nothing in the studio may be a collapsed spec sheet.
    const studio = screen.getByLabelText('استودیوی رجیستری');
    const toggles = Array.from(studio.querySelectorAll<HTMLElement>('[aria-expanded]'));
    const specToggle = toggles.filter((t) =>
      /مشخصات|جزئیات|spec|sheet/i.test(t.textContent ?? ''),
    );
    expect(specToggle).toEqual([]);
  });

  it('shows the spec content without any click, in both placements', async () => {
    const { container } = await renderPersian(<RegistryStudio />);
    // Both placements render (rail from lg, sheet below it), so the spec rows
    // appear twice. What matters is that the value next to the label is
    // mounted in the tree without a click — a collapsed disclosure would
    // leave the label with no sibling value.
    const rows = Array.from(container.querySelectorAll('dt')).filter(
      (dt) => dt.textContent === 'دسته',
    );
    expect(rows.length).toBeGreaterThan(0);
    for (const dt of rows) {
      const dd = dt.parentElement?.querySelector('dd');
      expect(dd?.textContent?.trim()).toBeTruthy();
    }
  });
});

describe('Persian rendering — the hero CTA row', () => {
  it('puts every hero action on the control surface, not the theme branch', async () => {
    await renderPersian(<DesignSystemHomeView />);

    const gh = screen.getByRole('button', { name: /GitHub/ });
    // The second surface level. A button that is only a `border` on the
    // canvas reads as a fifth surface, which is what the law forbids.
    expect(gh.className).toMatch(/bg-\(--bg-control\)/);
    expect(gh.className).toMatch(/text-\(--text-secondary\)/);
    // No theme branch may survive on the row; only hover may vary.
    const themed = gh.className.split(/\s+/).filter((c) => /^(bg|text|border)-(zinc|slate|gray|neutral)-/.test(c));
    expect(themed).toEqual([]);
  });

  it('gives the GitHub icon the secondary ink, not a hardcoded colour', async () => {
    await renderPersian(<DesignSystemHomeView />);
    const gh = screen.getByRole('button', { name: /GitHub/ });
    const icon = gh.querySelector('svg');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('class')).toMatch(/text-\(--text-secondary\)/);
  });

  it('leaves no raw palette value anywhere in the hero action row', async () => {
    await renderPersian(<DesignSystemHomeView />);
    // Scoped to the row, not the page: the CTA row is the block that moved to
    // the control surface, so it is the block that must be fully tokenised.
    // A global check would be dominated by unrelated sections.
    const row = screen.getByRole('button', { name: /GitHub/ }).parentElement!;
    const themed = row.innerHTML.match(/(?:text|bg|border)-(?:zinc|slate|gray|neutral|stone)-\d+/g) ?? [];
    expect(themed).toEqual([]);
  });

  it('keeps the Persian CTA label readable at the same voice', async () => {
    await renderPersian(<DesignSystemHomeView />);
    const docs = screen.getByRole('button', { name: /مستندات تعاملی/ });
    expect(docs.className).toMatch(/bg-\(--bg-control\)/);
  });
});
