/**
 * UI99 — HeatMapCalendar (Wave D)
 * GitHub-style contribution grid: 7 rows x N weeks, 5 intensity levels,
 * month labels optional, fully CSS-driven (no deps), accessible summary.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface HeatMapCalendarProps {
  /** Flat values, index 0 = oldest cell; length = weeks * 7 */
  data: number[];
  weeks?: number;
  max?: number;
  color?: 'emerald' | 'amber' | 'rose' | 'blue';
  cellSize?: number;
  label?: string;
  className?: string;
}

const heatColor = {
  emerald: ['var(--bg-sunken)', 'rgba(16,185,129,0.25)', 'rgba(16,185,129,0.45)', 'rgba(16,185,129,0.7)', '#10B981'],
  amber: ['var(--bg-sunken)', 'rgba(245,158,11,0.25)', 'rgba(245,158,11,0.45)', 'rgba(245,158,11,0.7)', '#F59E0B'],
  rose: ['var(--bg-sunken)', 'rgba(244,63,94,0.25)', 'rgba(244,63,94,0.45)', 'rgba(244,63,94,0.7)', '#F43F5E'],
  blue: ['var(--bg-sunken)', 'rgba(59,130,246,0.25)', 'rgba(59,130,246,0.45)', 'rgba(59,130,246,0.7)', '#3B82F6'],
} as const;

/** Light-theme palettes: level 0 becomes a faint gray, rest scale color opacity. */
const heatColorLight = {
  emerald: ['rgba(0,0,0,0.05)', 'rgba(5,150,105,0.2)', 'rgba(5,150,105,0.4)', 'rgba(5,150,105,0.65)', '#059669'],
  amber: ['rgba(0,0,0,0.05)', 'rgba(180,83,9,0.2)', 'rgba(180,83,9,0.4)', 'rgba(180,83,9,0.65)', '#B45309'],
  rose: ['rgba(0,0,0,0.05)', 'rgba(190,18,60,0.2)', 'rgba(190,18,60,0.4)', 'rgba(190,18,60,0.65)', '#BE123C'],
  blue: ['rgba(0,0,0,0.05)', 'rgba(37,99,235,0.2)', 'rgba(37,99,235,0.4)', 'rgba(37,99,235,0.65)', '#2563EB'],
} as const;

export function HeatMapCalendar({
  data,
  weeks = 18,
  max,
  color = 'emerald',
  cellSize = 11,
  label,
  className = '',
}: HeatMapCalendarProps) {
  // Light/dark decided via CSS: we render both palettes through currentColor trick
  // — simpler: read theme from DOM class on <html> (kit theme protocol).
  const isDark =
    typeof document === 'undefined' || !document.documentElement.classList.contains('light');
  const palette = (isDark ? heatColor : heatColorLight)[color];
  const cap = max ?? Math.max(...data, 1);

  const cells = data.slice(0, weeks * 7);

  return (
    <div
      role="img"
      aria-label={label ?? `Activity heatmap: ${data.filter((v) => v > 0).length} active of ${cells.length} days`}
      className={cn('inline-grid gap-[3px]', className)}
      style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gridAutoColumns: `${cellSize}px` }}
    >
      {cells.map((v, i) => {
        const level = v <= 0 ? 0 : Math.min(4, Math.ceil((v / cap) * 4));
        return (
          <span
            key={i}
            className="rounded-[3px] transition-colors duration-150"
            style={{ width: cellSize, height: cellSize, backgroundColor: palette[level] }}
          />
        );
      })}
    </div>
  );
}
