/**
 * UI99 — Skeleton Loading Placeholders (Build 02.2)
 * Subtle shimmering placeholder lines, cards, and avatars.
  * @token Shimmer sweeps 8%–14% foreground (both themes) — respects `prefers-reduced-motion` by holding mid-gray.
*/

import React from 'react';
import { useIsDark } from './theme';

export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Skeleton({ className = '', rounded = 'md' }: SkeletonProps) {
  const isDark = useIsDark();

  const roundMap = {
    sm: 'rounded-(--radius-xs)',
    md: 'rounded-(--radius-field)',
    lg: 'rounded-(--radius-control)',
    xl: 'rounded-(--radius-lg)',
    full: 'rounded-(--radius-pill)',
  }[rounded];

  return (
    <div
      className={`animate-pulse ${roundMap} ${
        isDark ? 'bg-white/[0.05]' : 'bg-black/[0.06]'
      } ${className}`}
    />
  );
}
