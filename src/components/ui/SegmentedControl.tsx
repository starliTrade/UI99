/**
 * UI99 — Unified Velvet Segmented Control (Build 02.3)
 * Seamless dark container matching #111114 with satin pill transitions.
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
  const padMap = size === 'sm' ? 'p-1' : 'p-1.5';
  const itemPad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm';

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
      className={`${
        fullWidth ? 'w-full flex' : 'inline-flex'
      } items-center rounded-full transition-all overflow-x-auto no-scrollbar scroll-smooth ${
        isDark
          ? 'bg-[#0E0E14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.045),0_8px_20px_rgba(0,0,0,0.45)] border border-white/[0.025]'
          : 'bg-zinc-100/90 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.04)] border border-black/[0.04]'
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
              className={`relative ${itemPad} rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0 sm:shrink focus-ui99-inset ${
                fullWidth ? 'flex-1' : ''
              } ${
                isSelected
                  ? isDark
                    ? 'text-black font-semibold'
                    : 'text-zinc-950 font-semibold'
                  : isDark
                  ? 'text-[#8E8E98] hover:text-white hover:bg-white/[0.03]'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.03]'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId={`segmented-pill-${options.map((o) => o.value).join('-')}`}
                  className={`absolute inset-0 rounded-full ${
                    isDark
                      ? 'bg-white shadow-[0_2px_10px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)]'
                      : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border border-black/[0.04]'
                  }`}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="tracking-tight">{opt.label}</span>
                {opt.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                      isSelected
                        ? isDark
                          ? 'bg-black text-white'
                          : 'bg-zinc-100 text-zinc-900 border border-black/[0.06]'
                        : isDark
                        ? 'bg-white/[0.08] text-[#92929B]'
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
