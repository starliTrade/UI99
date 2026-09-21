/**
 * SAFA — Keyboard Hotkey Badge `<Kbd>` (Build 02.2)
 * Linear / Raycast-grade monospace hotkey indicators.
 */

import React, { ReactNode } from 'react';
import { useApp } from '../../core/context/AppContext';

export interface KbdProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function Kbd({ children, size = 'sm', className = '' }: KbdProps) {
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';

  const sizeStyles = {
    xs: 'text-[9px] min-w-[16px] h-4 px-1 rounded',
    sm: 'text-[10px] min-w-[18px] h-4.5 px-1.5 rounded-md',
    md: 'text-xs min-w-[22px] h-5.5 px-2 rounded-md',
  }[size];

  return (
    <kbd
      className={`inline-flex items-center justify-center font-mono font-medium select-none shadow-xs border transition-colors ${sizeStyles} ${
        isDark
          ? 'bg-[#15151B] text-[#A1A1AA] border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
          : 'bg-zinc-100 text-zinc-700 border-black/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]'
      } ${className}`}
    >
      {children}
    </kbd>
  );
}
