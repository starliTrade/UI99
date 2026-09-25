/**
 * UI99 — Tactile Checkbox & Radio Controls (Build 02.2)
 * Pixel-accurate, micro-spring check animations, dual-theme support.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useIsDark } from './theme';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}: CheckboxProps) {
  const isDark = useIsDark();

  const boxSize = size === 'sm' ? 'w-4 h-4 rounded-md' : 'w-5 h-5 rounded-[7px]';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <label
      className={`inline-flex items-start gap-2.5 select-none ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Native input for keyboard & assistive-tech support (WCAG 4.1.2) */}
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          // jsdom fires change events on synthetic clicks even on disabled
          // inputs; real browsers never do. Guard the handler so a disabled
          // checkbox can never emit a state change.
          if (disabled) return;
          onChange(e.target.checked);
        }}
      />
      <div
        className={`relative flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/55 ${boxSize} ${
          checked
            ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400'
            : isDark
            ? 'bg-(--bg-elevated) border border-white/[0.1] peer-hover:border-white/[0.2]'
            : 'bg-zinc-100 border border-black/[0.12] peer-hover:border-black/[0.25]'
        }`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <Check className={`${iconSize} stroke-[2.5]`} />
          </motion.div>
        )}
      </div>

      {(label || description) && (
        <div className="flex flex-col text-left rtl:text-right pt-0.5">
          {label && (
            <span
              className={`text-xs font-semibold tracking-tight leading-none ${
                isDark ? 'text-(--text-primary)' : 'text-zinc-900'
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={`text-[11px] leading-snug mt-1 ${
                isDark ? 'text-(--text-secondary)' : 'text-zinc-500'
              }`}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

export interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: React.ReactNode;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({
  checked,
  onChange,
  label,
  name,
  disabled = false,
  className = '',
}: RadioProps) {
  const isDark = useIsDark();

  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      {/* Native input for keyboard & assistive-tech support (WCAG 4.1.2) */}
      <input
        type="radio"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={onChange}
      />
      <div
        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/55 ${
          checked
            ? 'border-2 border-emerald-500'
            : isDark
            ? 'border border-white/[0.12] bg-(--bg-elevated) peer-hover:border-white/[0.25]'
            : 'border border-black/[0.15] bg-zinc-100 peer-hover:border-black/[0.3]'
        }`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
          />
        )}
      </div>
      {label && (
        <span
          className={`text-xs font-medium tracking-tight ${
            isDark ? 'text-(--text-primary)' : 'text-zinc-900'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
}
