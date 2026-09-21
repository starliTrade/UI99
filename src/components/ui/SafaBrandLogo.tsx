/**
 * UI / [99] — Pure Typographic Brand Logo (JetBrains Mono & Geist Powered)
 * 
 * Clean, modern, hyper-precise monospaced typography with an ultra-subtle,
 * whisper-quiet ambient velvet aura glow behind the [99] bracket mark.
 */

import React from 'react';
import { useIsDark } from './theme';

export interface UI99BrandLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'badge' | 'text-only';
  withSubtitle?: boolean;
}

export function UI99BrandLogo({
  className = '',
  size = 'md',
  variant = 'full',
  withSubtitle = false,
}: UI99BrandLogoProps) {
  const isDark = useIsDark();

  const fontStyle = {
    fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
  };

  const sizeClasses = {
    xs: {
      root: 'text-xs',
      ui: 'text-xs',
      slash: 'text-[11px]',
      brackets: 'text-xs',
      subtitle: 'text-[9px]',
      padding: 'px-2 py-1',
    },
    sm: {
      root: 'text-sm',
      ui: 'text-sm',
      slash: 'text-xs',
      brackets: 'text-sm',
      subtitle: 'text-[10px]',
      padding: 'px-2.5 py-1',
    },
    md: {
      root: 'text-sm sm:text-base',
      ui: 'text-sm sm:text-[15px]',
      slash: 'text-xs sm:text-sm',
      brackets: 'text-sm sm:text-[15px]',
      subtitle: 'text-[10px]',
      padding: 'px-3 py-1.5',
    },
    lg: {
      root: 'text-lg sm:text-xl',
      ui: 'text-lg sm:text-xl',
      slash: 'text-base sm:text-lg',
      brackets: 'text-lg sm:text-xl',
      subtitle: 'text-xs',
      padding: 'px-4 py-2',
    },
    xl: {
      root: 'text-2xl sm:text-3xl',
      ui: 'text-2xl sm:text-3xl',
      slash: 'text-xl sm:text-2xl',
      brackets: 'text-2xl sm:text-3xl',
      subtitle: 'text-xs',
      padding: 'px-5 py-2.5',
    },
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col select-none cursor-pointer group ${className}`}
      style={fontStyle}
      aria-label="UI \ [99] Design System"
    >
      {/* Ultra-subtle, whisper-quiet diffuse aura highlight on hover */}
      <div
        className="absolute inset-0 -m-1.5 rounded-full bg-emerald-500/[0.04] dark:bg-emerald-400/[0.06] blur-md opacity-40 group-hover:opacity-100 group-hover:bg-emerald-500/[0.12] dark:group-hover:bg-emerald-400/[0.15] transition-all duration-300 pointer-events-none"
      />

      <div
        className={`relative z-10 flex items-center gap-1.5 font-bold tracking-tight leading-none rounded-xl transition-all duration-200 ${
          isDark
            ? 'group-hover:bg-white/[0.02]'
            : 'group-hover:bg-black/[0.02]'
        } ${sizeClasses.padding}`}
      >
        {/* "ui" */}
        <span
          className={`tracking-normal transition-colors duration-200 ${
            isDark
              ? 'text-zinc-200 group-hover:text-white'
              : 'text-zinc-800 group-hover:text-zinc-950'
          } ${sizeClasses.ui}`}
        >
          ui
        </span>

        {/* "/" separator with quiet opacity */}
        <span
          className={`text-zinc-500/70 dark:text-zinc-600 font-light select-none transition-colors duration-200 group-hover:text-zinc-400 ${sizeClasses.slash}`}
        >
          /
        </span>

        {/* "[99]" with JetBrains Mono ligatures & subtle emerald gradient sheen on hover */}
        <span
          className={`tracking-tight transition-all duration-200 flex items-center ${
            isDark
              ? 'text-zinc-100 group-hover:text-emerald-400'
              : 'text-zinc-900 group-hover:text-emerald-600'
          } ${sizeClasses.brackets}`}
        >
          <span className="text-zinc-500 dark:text-zinc-500 group-hover:text-emerald-500/60 font-light select-none">
            [
          </span>
          <span className="font-extrabold px-0.5 tracking-tighter">
            99
          </span>
          <span className="text-zinc-500 dark:text-zinc-500 group-hover:text-emerald-500/60 font-light select-none">
            ]
          </span>
        </span>
      </div>

      {withSubtitle && (
        <span
          className={`font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 pt-1 px-3 ${sizeClasses.subtitle}`}
        >
          Design System & Registry
        </span>
      )}
    </div>
  );
}

// Backward compatibility alias
export const SafaBrandLogo = UI99BrandLogo;
