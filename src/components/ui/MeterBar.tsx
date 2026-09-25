/**
 * UI99 — MeterBar (Wave D)
 * Native <meter>-semantics bar: value/max with zone thresholds (low/optimal/
 * high color mapping) — distinct from Progress (task completion).
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface MeterBarProps {
  value: number;
  max?: number;
  min?: number;
  low?: number;
  high?: number;
  optimum?: number;
  label: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function MeterBar({
  value,
  max = 100,
  min = 0,
  low,
  high,
  optimum,
  label,
  showValue = true,
  size = 'md',
  className = '',
}: MeterBarProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // Zone coloring per <meter> spec: low/optimum/high relationships.
  const zone =
    optimum !== undefined && value < optimum
      ? 'bg-amber-500'
      : high !== undefined && value > high
        ? 'bg-rose-500'
        : low !== undefined && value < low
          ? 'bg-amber-500'
          : 'bg-emerald-500';

  return (
    <div
      className={cn('w-full space-y-1.5', className)}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
    >
      {showValue && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-800 dark:text-(--text-primary)">{label}</span>
          <span className="font-mono text-[11px] text-(--text-secondary)">
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-(var(--radius-pill)) overflow-hidden bg-black/[0.08] dark:bg-white/[0.08]',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={cn('h-full rounded-(var(--radius-pill)) transition-all duration-300', zone)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
