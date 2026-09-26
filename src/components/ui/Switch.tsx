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
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-(--radius-pill) border-2 border-transparent transition-colors focus-visible:outline-none focus-ui99 disabled:cursor-not-allowed',
          rootSizes,
          checked
            ? 'bg-emerald-500 shadow-(--glow-accent-md)'
            : isDark
            ? 'bg-(--bg-elevated) border-white/[0.08]'
            : 'bg-(--bg-raised) border-(--border-subtle)'
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block rounded-(--radius-pill) bg-white shadow-md ring-0 transition-transform dur-base ease-in-out',
            thumbSizes
          )}
        />
      </SwitchPrimitive.Root>

      {(label || description) && (
        <div className="flex flex-col text-left rtl:text-right">
          {label && (
            <span
              className={cn(
                'type-caption font-semibold tracking-tight',
                isDark ? 'text-(--text-primary)' : 'text-zinc-900'
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={cn(
                'type-micro leading-tight',
                isDark ? 'text-(--text-secondary)' : 'text-zinc-500'
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
