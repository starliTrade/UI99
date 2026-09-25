/**
 * UI99 — Tactile Range Slider Component (Build 02.3)
 * Dual-theme (Obsidian Dark / Porcelain Light), smooth spring thumb, value readout.
 * RTL-aware: track fills and thumb position mirror under [dir="rtl"].
 * The native <input type="range"> is the accessibility root (keyboard + AT),
 * with aria-valuetext exposing the unit.
 */

import React from 'react';
import { useIsDark } from './theme';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '%',
  disabled = false,
  className = '',
}: SliderProps) {
  const isDark = useIsDark();

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div
      className={`w-full space-y-2 select-none ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className={`font-semibold tracking-tight ${isDark ? 'text-(--text-primary)' : 'text-zinc-800'}`}>
              {label}
            </span>
          )}
          <span className="font-mono text-zinc-500 text-[11px]">
            {value}
            {unit}
          </span>
        </div>
      )}

      {/* RTL mirroring: container is dir-neutral; [dir=rtl] fills from the right */}
      <div className="relative flex items-center h-5 slider-ui99" dir="ltr">
        {/* Track background */}
        <div
          className={`w-full h-1.5 rounded-(var(--radius-pill)) overflow-hidden ${
            isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
          }`}
        >
          {/* Active filled track */}
          <div
            className="h-full bg-emerald-500 rounded-(var(--radius-pill)) transition-all duration-75 shadow-(var(--glow-accent-sm)) slider-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real hidden range input overlaid for native accessibility & keyboard support */}
        <input
          type="range"
          aria-label={label}
          aria-valuetext={`${value}${unit}`}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/55 rounded-(var(--radius-pill))"
        />

        {/* Visual tactile thumb */}
        <div
          className={`absolute pointer-events-none w-4 h-4 rounded-(var(--radius-pill)) -translate-x-1/2 shadow-md transition-transform duration-75 slider-thumb ${
            isDark
              ? 'bg-white border-2 border-(--bg-elevated) shadow-(var(--elevation-1))'
              : 'bg-white border-2 border-emerald-500 shadow-(var(--elevation-1))'
          }`}
          style={{ left: `${percentage}%`, ['--thumb-pos' as string]: `${100 - percentage}%` }}
        />
      </div>
    </div>
  );
}
