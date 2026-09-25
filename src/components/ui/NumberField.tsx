/**
 * UI99 — NumberField (Wave H)
 * Numeric input with +/- steppers: clamped to [min,max], stepped,
 * arrows/Up/Down keyboard support, disabled state.
  * @token Steppers ride `--state-hover`; input body `--bg-elevated`; clamp disable uses opacity-40 (never gray-on-gray).
*/

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberField({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix,
  disabled = false,
  className = '',
}: NumberFieldProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const decrement = () => onChange(clamp(value - step));
  const increment = () => onChange(clamp(value + step));

  const stepperCls = cn(
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-sm) transition-colors cursor-pointer',
    'text-zinc-500 hover:bg-black/[0.04] dark:text-(--text-secondary) dark:hover:bg-white/[0.06]',
    'focus-visible:outline-none focus-ui99-inset',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent'
  );

  return (
    <div className={cn('inline-flex items-center gap-0', className)}>
      {label && <span className="sr-only">{label}</span>}
      <button type="button" aria-label="Decrease" onClick={decrement} disabled={disabled || value <= min} className={stepperCls}>
        <Minus className="w-4 h-4" />
      </button>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-label={label ?? 'Value'}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          value={`${value}${suffix ?? ''}`}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              increment();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              decrement();
            }
          }}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value.replace(/[^\d.-]/g, ''));
            if (!Number.isNaN(parsed)) onChange(clamp(parsed));
          }}
          className={cn(
            'h-10 w-20 rounded-(--radius-field) border border-black/[0.07] bg-white text-center text-sm font-semibold text-zinc-950',
            'dark:border-white/[0.07] dark:bg-(--bg-elevated) dark:text-(--text-primary)',
            'focus-visible:outline-none focus-ui99-inset',
            'disabled:cursor-not-allowed disabled:opacity-45'
          )}
        />
      </div>
      <button type="button" aria-label="Increase" onClick={increment} disabled={disabled || value >= max} className={stepperCls}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
