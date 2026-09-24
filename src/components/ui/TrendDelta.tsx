/**
 * UI99 — TrendDelta (Wave D)
 * Compact signed delta chip: +12.4% / -3.1% with semantic tone, used inside
 * tables, tiles and headers. Color never the only signal (icon + sign).
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TrendDeltaProps {
  delta: number;
  suffix?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  invertTone?: boolean; // for "lower is better" metrics
  className?: string;
}

export function TrendDelta({
  delta,
  suffix = '%',
  size = 'sm',
  showIcon = true,
  invertTone = false,
  className = '',
}: TrendDeltaProps) {
  const effective = invertTone ? -delta : delta;
  const tone =
    effective > 0 ? 'up' : effective < 0 ? 'down' : 'flat';
  const toneStyle = {
    up: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    down: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    flat: 'bg-black/[0.04] text-zinc-600 dark:bg-white/[0.05] dark:text-(--text-secondary) border-black/[0.04] dark:border-white/[0.05]',
  }[tone];
  const Icon = tone === 'up' ? ArrowUpRight : tone === 'down' ? ArrowDownRight : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border font-mono font-semibold whitespace-nowrap',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
        toneStyle,
        className
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />}
      {delta > 0 ? '+' : ''}
      {delta}
      {suffix}
    </span>
  );
}
