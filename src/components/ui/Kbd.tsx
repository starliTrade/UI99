/**
 * UI99 — Keyboard Hotkey Badge `<Kbd>` (Build 02.2)
 * Linear / Raycast-grade monospace hotkey indicators.
 */

import React, { ReactNode } from 'react';
import { useIsDark } from './theme';

export interface KbdProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function Kbd({ children, size = 'sm', className = '' }: KbdProps) {
  const isDark = useIsDark();

  const sizeStyles = {
    xs: 'type-micro min-w-[16px] h-4 px-1 rounded',
    sm: 'type-micro min-w-[18px] h-[18px] px-1.5 rounded-(--radius-xs)',
    md: 'type-caption min-w-[22px] h-[22px] px-2 rounded-(--radius-xs)',
  }[size];

  return (
    <kbd
      className={`inline-flex items-center justify-center font-mono font-medium select-none shadow-xs border transition-colors ${sizeStyles} ${
        isDark
          ? 'bg-(--bg-elevated) text-(--text-secondary) border-white/[0.08] shadow-(--shadow-card)'
          : 'bg-zinc-100 text-zinc-700 border-black/[0.08] shadow-(--shadow-card)'
      } ${className}`}
    >
      {children}
    </kbd>
  );
}
