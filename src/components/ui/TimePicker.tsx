/**
 * UI99 — TimePicker (Wave F)
 * Filterable 24h time listbox at a configurable step. Velvet rows with
 * selected inversion, keyboard focusable options, `HH:mm` contract.
  * @token Rows invert on selection (`--text-on-fill`); filter input focus rides `--focus-ring` via `focus-safa-inset`.
*/

import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

export interface TimePickerProps {
  /** 24h `HH:mm` string or null. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Slot resolution in minutes (must divide 60). */
  step?: 5 | 10 | 15 | 30 | 60;
  className?: string;
}

export function TimePicker({ value, onChange, step = 30, className = '' }: TimePickerProps) {
  const [query, setQuery] = useState('');

  const slots = useMemo(() => {
    const out: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += step) {
        out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return out;
  }, [step]);

  const filtered = useMemo(() => slots.filter((t) => t.includes(query)), [slots, query]);

  return (
    <div className={cn('rounded-2xl border border-black/[0.06] bg-white p-3 dark:border-white/[0.06] dark:bg-[#131318]', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter times…"
        aria-label="Filter times"
        className={cn(
          'mb-2 h-9 w-full rounded-xl border border-black/[0.07] bg-transparent px-3 text-sm text-zinc-950 placeholder:text-zinc-400',
          'dark:border-white/[0.07] dark:text-[#EDEDEF] dark:placeholder:text-[#71717A]',
          'focus-visible:outline-none focus-safa-inset'
        )}
      />
      <div role="listbox" aria-label="Time" className="no-scrollbar max-h-48 overflow-y-auto">
        {filtered.map((t) => (
          <button
            key={t}
            type="button"
            role="option"
            aria-selected={t === value}
            onClick={() => onChange(t)}
            className={cn(
              'flex min-h-[36px] w-full items-center justify-between rounded-lg px-3 text-left text-xs font-mono transition-colors',
              'hover:bg-(--state-hover)',
              'focus-visible:outline-none focus-safa-inset cursor-pointer',
              t === value
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-(--text-primary)'
            )}
          >
            {t}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-(--text-muted)">No match</div>
        )}
      </div>
    </div>
  );
}
