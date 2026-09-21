/**
 * SAFA — Skeleton Loading Placeholders (Build 02.2)
 * Subtle shimmering placeholder lines, cards, and avatars.
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
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`animate-pulse ${roundMap} ${
        isDark ? 'bg-white/[0.05]' : 'bg-black/[0.06]'
      } ${className}`}
    />
  );
}
