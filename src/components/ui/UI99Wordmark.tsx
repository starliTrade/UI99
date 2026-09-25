/**
 * UI / [99] — Pure Typographic Brand Logo (JetBrains Mono & Geist Powered)
 * 
 * Clean, modern, hyper-precise monospaced typography with an ultra-subtle,
 * whisper-quiet ambient velvet aura glow behind the [99] bracket mark.
 */

import React from 'react';
import { useIsDark } from './theme';

export interface UI99WordmarkProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'badge' | 'text-only';
  withSubtitle?: boolean;
}

export function UI99Wordmark({
  className = '',
  size = 'md',
  variant = 'full',
  withSubtitle = false,
}: UI99WordmarkProps) {
  const isDark = useIsDark();

  const fontStyle = {
    fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
  };

  const sizeClasses = {
    xs: {
      root: 'type-caption',
      ui: 'type-caption',
      slash: 'type-micro',
      brackets: 'type-caption',
      subtitle: 'type-micro',
      padding: 'px-2 py-1',
    },
    sm: {
      root: 'type-body',
      ui: 'type-body',
      slash: 'type-caption',
      brackets: 'type-body',
      subtitle: 'type-micro',
      padding: 'px-2.5 py-1',
    },
    md: {
      root: 'type-body sm:type-body-lg',
      ui: 'type-body sm:type-body',
      slash: 'type-caption sm:type-body',
      brackets: 'type-body sm:type-body',
      subtitle: 'type-micro',
      padding: 'px-3 py-1.5',
    },
    lg: {
      root: 'type-body-lg sm:type-title',
      ui: 'type-body-lg sm:type-title',
      slash: 'type-body-lg sm:type-body-lg',
      brackets: 'type-body-lg sm:type-title',
      subtitle: 'type-caption',
      padding: 'px-4 py-2',
    },
    xl: {
      root: 'type-heading sm:type-display',
      ui: 'type-heading sm:type-display',
      slash: 'type-title sm:type-heading',
      brackets: 'type-heading sm:type-display',
      subtitle: 'type-caption',
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
        className="absolute inset-0 -m-1.5 rounded-(--radius-pill) bg-emerald-500/[0.04] dark:bg-emerald-400/[0.06] blur-md opacity-40 group-hover:opacity-100 group-hover:bg-emerald-500/[0.12] dark:group-hover:bg-emerald-400/[0.15] transition-all dur-slow pointer-events-none"
      />

      <div
        className={`relative z-content flex items-center gap-1.5 font-bold tracking-tight leading-none rounded-(--radius-field) transition-all dur-base ${
          isDark
            ? 'group-hover:bg-white/[0.02]'
            : 'group-hover:bg-black/[0.02]'
        } ${sizeClasses.padding}`}
      >
        {/* "ui" */}
        <span
          className={`tracking-normal transition-colors dur-base ${
            isDark
              ? 'text-zinc-200 group-hover:text-white'
              : 'text-zinc-800 group-hover:text-zinc-950'
          } ${sizeClasses.ui}`}
        >
          ui
        </span>

        {/* "/" separator with quiet opacity */}
        <span
          className={`text-zinc-500/70 dark:text-zinc-600 font-light select-none transition-colors dur-base group-hover:text-zinc-400 ${sizeClasses.slash}`}
        >
          /
        </span>

        {/* "[99]" with JetBrains Mono ligatures & subtle emerald gradient sheen on hover */}
        <span
          className={`tracking-tight transition-all dur-base flex items-center ${
            isDark
              ? 'text-zinc-100 group-hover:text-emerald-400'
              : 'text-zinc-900 group-hover:text-emerald-600'
          } ${sizeClasses.brackets}`}
        >
          <span className="text-(--text-muted) dark:text-zinc-500 group-hover:text-emerald-500/60 font-light select-none">
            [
          </span>
          <span className="font-extrabold px-0.5 tracking-tighter">
            99
          </span>
          <span className="text-(--text-muted) dark:text-zinc-500 group-hover:text-emerald-500/60 font-light select-none">
            ]
          </span>
        </span>
      </div>

      {withSubtitle && (
        <span
          className={`font-mono uppercase tracking-widest text-(--text-muted) dark:text-zinc-400 pt-1 px-3 ${sizeClasses.subtitle}`}
        >
          Design System & Registry
        </span>
      )}
    </div>
  );
}

