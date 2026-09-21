/**
 * UI99 — Tactile Switch / Toggle Component (Build 02.2)
 * Dual-theme (Obsidian / Matte Porcelain) with Radix UI headless accessibility and tactile spring.
 *
 * @token Track off-state rides `--state-selected` over `--bg-sunken`; on-state
 *   fills the success token. Thumb shadow is the soft-contact profile
 *   (0 2px 6px rgba(0,0,0,0.25)) — never a hard border.
 */

import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';
import { useIsDark } from './theme';

export interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  onCheckedChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  const isDark = useIsDark();

  const handleChange = (val: boolean) => {
    onChange?.(val);
    onCheckedChange?.(val);
  };

  const rootSizes = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-12',
  }[size];

  const thumbSizes = {
    sm: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5 rtl:data-[state=checked]:-translate-x-4 rtl:data-[state=unchecked]:-translate-x-0.5',
    md: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5 rtl:data-[state=checked]:-translate-x-5 rtl:data-[state=unchecked]:-translate-x-0.5',
    lg: 'h-5 w-5 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1 rtl:data-[state=checked]:-translate-x-6 rtl:data-[state=unchecked]:-translate-x-1',
  }[size];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={handleChange}
        disabled={disabled}
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-safa disabled:cursor-not-allowed',
          rootSizes,
          checked
            ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
            : isDark
            ? 'bg-[#181820] border-white/[0.08]'
            : 'bg-zinc-200 border-black/[0.06]'
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out',
            thumbSizes
          )}
        />
      </SwitchPrimitive.Root>

      {(label || description) && (
        <div className="flex flex-col text-left rtl:text-right">
          {label && (
            <span
              className={cn(
                'text-xs font-semibold tracking-tight',
                isDark ? 'text-[#EDEDEF]' : 'text-zinc-900'
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={cn(
                'text-[11px] leading-tight',
                isDark ? 'text-[#8E8E98]' : 'text-zinc-500'
              )}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
