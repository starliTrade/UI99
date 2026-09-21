/**
 * UI99 — DonutRing (Wave D)
 * Zero-dependency SVG progress ring: single or multi-segment, center slot,
 * polished round caps, accessible via role="img" + aria-label.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface DonutSegment {
  value: number;
  color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'neutral';
}

const segColor = {
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  blue: '#3B82F6',
  purple: '#A855F7',
  neutral: 'rgba(142,142,152,0.35)',
} as const;

export interface DonutRingProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
  children?: React.ReactNode;
}

export function DonutRing({
  segments,
  size = 88,
  thickness = 8,
  label,
  showValue = false,
  valueSuffix = '%',
  className = '',
  children,
}: DonutRingProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg
        role="img"
        aria-label={label ?? `Progress ring at ${Math.round((segments[0]?.value ?? 0) / total * 100)}%`}
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: size, height: size }}
        className="-rotate-90"
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(142,142,152,0.15)"
          strokeWidth={thickness}
        />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * circumference;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segColor[seg.color ?? 'emerald']}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${circumference - Math.max(dash - 2, 0)}`}
              strokeDashoffset={-offsetAcc}
              className="transition-all duration-300"
            />
          );
          offsetAcc += dash;
          return el;
        })}
      </svg>
      {(children || showValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ?? (
            <span className="text-sm font-bold font-mono text-zinc-950 dark:text-white">
              {Math.round(((segments[0]?.value ?? 0) / total) * 100)}
              <span className="text-[10px] text-zinc-400">{valueSuffix}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
