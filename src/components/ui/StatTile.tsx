/**
 * UI99 — StatTile (Wave D)
 * Metric card: value, label, delta chip (up/down/flat), optional trailing
 * sparkline slot. The workhorse of dashboards.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatTileProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaSuffix?: string;
  trend?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatTile({
  label,
  value,
  delta,
  deltaSuffix = '%',
  trend,
  size = 'md',
  className = '',
}: StatTileProps) {
  const deltaTone =
    delta === undefined ? 'neutral' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const toneStyle = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-rose-600 dark:text-rose-400',
    flat: 'text-(--text-secondary)',
    neutral: '',
  }[deltaTone];
  const DeltaIcon =
    deltaTone === 'up' ? ArrowUpRight : deltaTone === 'down' ? ArrowDownRight : Minus;

  const valueSize = {
    sm: 'type-body-lg',
    md: 'type-heading',
    lg: 'type-display sm:type-display',
  }[size];

  return (
    <div
      className={cn(
        'rounded-(--radius-control) bg-(--bg-card) border border-(--border-hairline) p-4 sm:p-5',
        'shadow-(--elevation-1) shadow-(--shadow-card)',
        'space-y-1.5',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="type-micro font-mono uppercase tracking-wider text-(--text-secondary)">
          {label}
        </span>
        {trend && <span className="shrink-0">{trend}</span>}
      </div>
      <div className={cn('font-bold font-mono tracking-tight text-zinc-950 dark:text-white', valueSize)}>
        {value}
      </div>
      {delta !== undefined && (
        <div className={cn('flex items-center gap-1 type-micro font-mono font-semibold', toneStyle)}>
          <DeltaIcon className="icon-xs" />
          {delta > 0 ? '+' : ''}
          {delta}
          {deltaSuffix}
          <span className="text-(--text-muted) font-normal">vs last week</span>
        </div>
      )}
    </div>
  );
}
