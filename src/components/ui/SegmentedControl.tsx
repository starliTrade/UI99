/**
 * UI99 — Unified Velvet Segmented Control (Build 02.3)
 * Seamless dark container on --bg-elevated with satin pill transitions.
 * Authentic Apple / Linear tactile active cushion for light and dark modes.
 * WAI-ARIA radiogroup pattern: roving tabindex, Arrow/Home/End navigation,
 * Space/Enter selection, RTL-aware arrow mapping (WCAG-compliant keyboard UX).
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useIsDark } from './theme';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  label?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  fullWidth = true,
  className = '',
}: SegmentedControlProps<T>) {
  const isDark = useIsDark();
  const groupRef = useRef<HTMLDivElement>(null);
  const padMap = size === 'sm' ? 'p-1' : 'p-1';
  const itemPad = size === 'sm' ? 'px-3 py-1 type-caption' : 'px-4 py-2 type-caption sm:type-body';

  const isRTL =
    typeof document !== 'undefined' &&
    (document.documentElement.getAttribute('dir') === 'rtl' ||
      document.documentElement.dir === 'rtl');

  const selectAt = (index: number) => {
    if (index < 0 || index >= options.length) return;
    onChange(options[index].value);
    // Move focus to the newly selected tab-stop button (roving tabindex)
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = options.findIndex((o) => o.value === value);
    let next: number | null = null;

    switch (e.key) {
      case 'ArrowDown':
        next = currentIndex + 1;
        break;
      case 'ArrowRight':
        // In RTL, ArrowRight moves to the previous (visually-left) segment
        next = isRTL ? currentIndex - 1 : currentIndex + 1;
        break;
      case 'ArrowLeft':
        next = isRTL ? currentIndex + 1 : currentIndex - 1;
        break;
      case 'ArrowUp':
        next = currentIndex - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = options.length - 1;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        return;
      default:
        return;
    }

    e.preventDefault();
    if (next !== null) selectAt(next);
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      style={
        isDark
          ? {
              backgroundColor: 'rgba(255, 255, 255, 0.006)',
              borderColor: 'rgba(255, 255, 255, 0.010)',
              borderWidth: 1,
              borderStyle: 'solid',
            }
          : undefined
      }
      className={`${
        fullWidth ? 'w-full flex' : 'inline-flex'
      } items-center rounded-(--radius-pill) transition-all overflow-x-auto no-scrollbar scroll-smooth ${
        !isDark ? 'bg-(--bg-raised) shadow-(--rim-subtle) border border-(--border-subtle)' : ''
      } ${padMap} ${className}`}
    >
      <div className={`flex items-center gap-1 min-w-max sm:min-w-0 ${fullWidth ? 'w-full' : ''}`}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          const selectedIndex = options.findIndex((o) => o.value === value);
          const isFocusTarget = isSelected || (selectedIndex === -1 && opt === options[0]);
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isFocusTarget ? 0 : -1}
              onClick={() => onChange(opt.value)}
              className={`relative ${itemPad} rounded-(--radius-pill) font-medium transition-all dur-base flex items-center justify-center gap-1 cursor-pointer select-none whitespace-nowrap shrink-0 sm:shrink focus-ui99-inset ${
                fullWidth ? 'flex-1' : ''
              } ${
                isSelected
                  ? isDark
                    ? 'text-white font-semibold'
                    : 'text-zinc-950 font-semibold'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.010]'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.03]'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId={`segmented-pill-${options.map((o) => o.value).join('-')}`}
                  style={
                    isDark
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.024)',
                          borderColor: 'rgba(255, 255, 255, 0.020)',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.60)',
                        }
                      : undefined
                  }
                  className={`absolute inset-0 rounded-(--radius-pill) ${
                    !isDark ? 'bg-white shadow-(--elevation-1) border border-black/[0.04]' : ''
                  }`}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative z-content flex items-center justify-center gap-1">
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="tracking-tight">{opt.label}</span>
                {opt.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 type-micro rounded-(--radius-pill) font-semibold ${
                      isSelected
                        ? isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-(--bg-raised) text-zinc-900 border border-(--border-soft)'
                        : isDark
                        ? 'bg-white/[0.04] text-zinc-400'
                        : 'bg-black/[0.06] text-zinc-600'
                    }`}
                  >
                    {opt.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
