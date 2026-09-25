/**
 * UI99 — Density Switcher
 *
 * The control surface for the density axis. It writes ONE attribute on <html>;
 * every control height and rhythm token in the kit resolves against
 * `--density-scale`, so nothing here touches a component's internals.
 *
 *   <DensitySwitcher />                       uncontrolled, persists locally
 *   <DensitySwitcher value="compact" onChange={…} />   controlled
 *
 * The modes are the same three Material and iOS use, and the same three carry
 * the same warning: `compact` is a pointer affordance. At `md` it is 35px,
 * below the 44px touch floor AGENTS.md §5 requires. Use it for dense desktop
 * tables and dashboards; use `comfortable` on touch.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import type { SegmentOption } from './SegmentedControl';

export type Density = 'compact' | 'default' | 'comfortable';

const DENSITIES: SegmentOption<Density>[] = [
  { label: 'Compact', value: 'compact' },
  { label: 'Default', value: 'default' },
  { label: 'Comfortable', value: 'comfortable' },
];

const STORAGE_KEY = 'ui99-density';

function applyToDocument(density: Density) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-density', density);
}

function readInitial(): Density {
  if (typeof document === 'undefined') return 'default';
  const attr = document.documentElement.getAttribute('data-density');
  if (attr === 'compact' || attr === 'comfortable' || attr === 'default') return attr;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'compact' || stored === 'comfortable' || stored === 'default') return stored;
  } catch {
    /* private mode / storage disabled — the attribute is the source of truth */
  }
  return 'default';
}

export interface DensitySwitcherProps {
  /** Controlled value. Omit to let the switcher own the state. */
  value?: Density;
  onChange?: (density: Density) => void;
  className?: string;
  /** Stretch the control to its container. */
  fullWidth?: boolean;
}

export function DensitySwitcher({ value, onChange, className, fullWidth }: DensitySwitcherProps) {
  const [internal, setInternal] = useState<Density>(readInitial);

  // The attribute must be present before first paint of a consumer's tree, so
  // it is applied on mount as well as on change.
  useEffect(() => {
    applyToDocument(internal);
  }, [internal]);

  const handleChange = useCallback(
    (next: Density) => {
      setInternal(next);
      applyToDocument(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* non-fatal: the switcher still works for this session */
      }
      onChange?.(next);
    },
    [onChange],
  );

  return (
    <SegmentedControl
      options={DENSITIES}
      value={value ?? internal}
      onChange={handleChange}
      label="Interface density"
      fullWidth={fullWidth}
      className={className}
    />
  );
}

export default DensitySwitcher;
