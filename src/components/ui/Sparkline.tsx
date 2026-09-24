/**
 * UI99 — Sparkline (Wave D)
 * Zero-dependency SVG micro-chart: line or bar mode, gradient fill option,
 * a11y via role="img" + aria-label. No chart library — 2KB of math.
 */

import React, { useId } from 'react';
import { cn } from '../../lib/utils';

export interface SparklineProps {
  data: number[];
  mode?: 'line' | 'bar';
  width?: number;
  height?: number;
  color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'neutral';
  fill?: boolean;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

const colorMap = {
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  blue: '#3B82F6',
  purple: '#A855F7',
  neutral: 'var(--text-secondary, #8E8E98)',
} as const;

export function Sparkline({
  data,
  mode = 'line',
  width = 120,
  height = 36,
  color = 'emerald',
  fill = true,
  strokeWidth = 1.5,
  label,
  className = '',
}: SparklineProps) {
  const gradId = useId();
  const hex = colorMap[color];

  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  if (mode === 'bar') {
    const gap = 1.5;
    const barW = Math.max((width - gap * (data.length - 1)) / data.length, 1);
    return (
      <svg
        role="img"
        aria-label={label ?? `Bar sparkline, ${data.length} points`}
        viewBox={`0 0 ${width} ${height}`}
        className={cn('overflow-visible', className)}
        style={{ width, height }}
      >
        {data.map((v, i) => {
          const h = Math.max(((v - min) / range) * (height - 2), 1);
          return (
            <rect
              key={i}
              x={i * (barW + gap)}
              y={height - h}
              width={barW}
              height={h}
              rx={Math.min(barW / 2, 2)}
              fill={hex}
              opacity={0.35 + 0.65 * (v / max)}
            />
          );
        })}
      </svg>
    );
  }

  const step = width / Math.max(data.length - 1, 1);
  const points = data.map((v, i) => [i * step, height - 2 - ((v - min) / range) * (height - 4)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      role="img"
      aria-label={label ?? `Line sparkline, ${data.length} points`}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      style={{ width, height }}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hex} stopOpacity="0.25" />
              <stop offset="100%" stopColor={hex} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradId})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={hex}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2.2} fill={hex} />
    </svg>
  );
}
