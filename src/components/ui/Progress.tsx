/**
 * UI99 — Progress & Segmented Step Meter Component (Build 02.2)
 * Dual-theme (Obsidian Dark / Porcelain Light) with shimmer aura.
  * @token Track is `--state-selected` over the hosting surface; fill uses the emerald success token — constant across themes.
*/

import React from 'react';
import { useIsDark } from './theme';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  segmented?: number; // optional segmented ticks
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'emerald',
  segmented,
  className = '',
}: ProgressProps) {
  const isDark = useIsDark();

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    emerald: 'bg-emerald-500 shadow-(--glow-accent-md)',
    amber: 'bg-amber-500 shadow-(--glow-warning-md)',
    rose: 'bg-rose-500 shadow-(--glow-rose-md)',
    blue: 'bg-blue-500 shadow-(--glow-accent-md)',
    purple: 'bg-purple-500 shadow-(--glow-accent-md)',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  if (segmented && segmented > 1) {
    const currentStep = Math.round((percentage / 100) * segmented);
    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs">
            {label && (
              <span className={`font-semibold ${isDark ? 'text-(--text-primary)' : 'text-zinc-800'}`}>
                {label}
              </span>
            )}
            {showValue && (
              <span className="font-mono text-zinc-500 text-[11px]">
                {currentStep}/{segmented}
              </span>
            )}
          </div>
        )}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${segmented}, minmax(0, 1fr))` }}>
          {Array.from({ length: segmented }).map((_, i) => {
            const isFilled = i < currentStep;
            return (
              <div
                key={i}
                className={`${heights[size]} rounded-(--radius-pill) transition-all duration-200 ${
                  isFilled
                    ? variantColors[variant]
                    : isDark
                    ? 'bg-white/[0.08]'
                    : 'bg-black/[0.08]'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className={`font-semibold ${isDark ? 'text-(--text-primary)' : 'text-zinc-800'}`}>
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-mono text-zinc-500 text-[11px]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${heights[size]} rounded-(--radius-pill) overflow-hidden ${
          isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
        }`}
      >
        <div
          className={`h-full rounded-(--radius-pill) transition-all duration-300 ${variantColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
