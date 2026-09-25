/**
 * UI99 — DatePicker (Wave F)
 * Popover month-grid picker (Radix popover + controlled grid). Velvet
 * day cells with today ring, aria-selected, keyboard focusable, disabledDates.
 * Value contract: ISO `yyyy-mm-dd` string or null (uncontrolled optional).
  * @token Grid cells ride `--state-hover` on `--bg-elevated`; selection inverts with `--text-on-fill`; today-ring uses `--border-strong`.
*/

import React, { useState, useMemo } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface DatePickerProps {
  /** ISO `yyyy-mm-dd` or null. Omit for uncontrolled usage. */
  value?: string | null;
  onChange?: (iso: string | null) => void;
  placeholder?: string;
  disabledDates?: (iso: string) => boolean;
  disabled?: boolean;
  className?: string;
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseISO(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match.map(Number) as unknown as number[];
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m: m - 1, d };
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabledDates,
  disabled = false,
  className = '',
}: DatePickerProps) {
  const parsed = value ? parseISO(value) : null;
  const [view, setView] = useState(() => ({ y: parsed?.y ?? new Date().getFullYear(), m: parsed?.m ?? new Date().getMonth() }));
  const [open, setOpen] = useState(false);

  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: toISO(view.y, view.m, d) });
    return cells;
  }, [view]);

  const select = (iso: string) => {
    onChange?.(iso);
    setOpen(false);
  };

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const nm = v.m + delta;
      if (nm < 0) return { y: v.y - 1, m: 11 };
      if (nm > 11) return { y: v.y + 1, m: 0 };
      return { ...v, m: nm };
    });
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex h-10 min-w-[180px] items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-3 text-sm text-zinc-950',
            'dark:border-white/[0.07] dark:bg-(--bg-elevated) dark:text-(--text-primary)',
            'transition-colors hover:bg-(--state-hover)',
            'focus-visible:outline-none focus-ui99-inset cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-45',
            className
          )}
        >
          <CalendarDays className="w-4 h-4 text-zinc-400 dark:text-(--text-secondary)" />
          <span className={cn(!parsed && 'text-zinc-400 dark:text-(--text-secondary)')}>
            {parsed ? value : placeholder}
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className="z-50 w-[280px] rounded-2xl border border-black/[0.06] bg-white p-3 shadow-(var(--elevation-4)) dark:border-white/[0.06] dark:bg-(--bg-elevated)"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-black/[0.04] dark:text-(--text-secondary) dark:hover:bg-white/[0.06] focus-visible:outline-none focus-ui99 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-(--text-primary)" aria-live="polite">
              {MONTHS[view.m]} {view.y}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-black/[0.04] dark:text-(--text-secondary) dark:hover:bg-white/[0.06] focus-visible:outline-none focus-ui99 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`}>
            {WEEKDAYS.map((wd) => (
              <div key={wd} role="columnheader" className="py-1 text-center text-[10px] font-mono uppercase text-(--text-muted)">
                {wd}
              </div>
            ))}
            {grid.map((cell, i) =>
              cell === null ? (
                <div key={`pad-${i}`} />
              ) : (
                <button
                  key={cell.iso}
                  type="button"
                  role="gridcell"
                  aria-selected={cell.iso === value}
                  disabled={disabledDates?.(cell.iso)}
                  onClick={() => select(cell.iso)}
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-ui99-inset',
                    'hover:bg-(--state-hover)',
                    cell.iso === value
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-(--text-primary)',
                    cell.iso === todayISO && cell.iso !== value && 'ring-1 ring-black/[0.25] dark:ring-white/[0.35]',
                    disabledDates?.(cell.iso) && 'cursor-not-allowed opacity-30 line-through hover:bg-transparent dark:hover:bg-transparent'
                  )}
                >
                  {cell.day}
                </button>
              )
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
