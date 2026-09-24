/**
 * UI \ [99] — MetricCard & Spinner Primitives
 */

import React from 'react';
import { TrendDelta } from './TrendDelta';
import { Sparkline } from './Sparkline';
import { Loader2 } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  sparklineData?: number[];
  sparklineColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  sparklineData,
  sparklineColor = 'emerald',
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <div
      role="group"
      aria-label={`${label}: ${typeof value === 'string' || typeof value === 'number' ? value : ''}${delta !== undefined ? `, ${delta > 0 ? 'up' : 'down'} ${Math.abs(delta)} percent` : ''}`}
      className={`p-4 rounded-2xl bg-white dark:bg-(--bg-card) border border-zinc-200/80 dark:border-white/[0.035] shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
          {label}
        </span>
        {icon && <span className="text-zinc-400 dark:text-zinc-600">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono">
          {value}
        </span>
        {delta !== undefined && (
          <div className="flex items-center gap-1">
            <TrendDelta delta={delta} />
            {deltaLabel && <span className="text-[10px] text-zinc-500 font-mono">{deltaLabel}</span>}
          </div>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="pt-1">
          <Sparkline data={sparklineData} height={32} color={sparklineColor} />
        </div>
      )}
    </div>
  );
}

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'subtle' | 'white';
  className?: string;
  label?: string;
}

export function Spinner({
  size = 'md',
  variant = 'emerald',
  className = '',
  label,
}: SpinnerProps) {
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  const variantStyles = {
    emerald: 'text-emerald-500',
    subtle: 'text-zinc-400 dark:text-zinc-600',
    white: 'text-white',
  }[variant];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeStyles} ${variantStyles}`} />
      {label && <span className="text-xs font-mono text-zinc-500">{label}</span>}
    </div>
  );
}
