/**
 * Full app-shell smoke test — mounts the REAL <App /> (all providers + shell).
 * Catches runtime boot errors (context/hook/render crashes) that per-component
 * tests can never see — the exact class of bug that produces a blank preview.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import App from '../App';

describe('app shell boot (full <App /> mount)', () => {
  it('mounts all providers and renders the shell without crashing', async () => {
    render(<App />);

    // The shell must reach the point where the home view has painted content.
    await waitFor(
      () => {
        expect(document.querySelector('main')).not.toBeNull();
      },
      { timeout: 5000 }
    );

    // Header chrome is always present regardless of active tab.
    expect(document.querySelector('header')).not.toBeNull();
  });

  it('renders the shell axe-clean', async () => {
    const { container } = render(<App />);
    await waitFor(() => expect(document.querySelector('main')).not.toBeNull());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
