/**
 * UI99 — Unified Velvet Form Inputs (Build 02.2)
 * High-craft tactile inputs, dual-theme support (Obsidian Dark / Matte Light),
 * micro-hairlines, and calm focus rings with cn utility.
 *
 * @token Field body resolves `--bg-elevated` on `--bg-card` containers;
 *   resting border `--border-hairline`, focus ring `focus-ui99-inset` riding
 *   `--focus-ring` (WCAG 2.4.13). Placeholder uses `--text-muted`.
 */

import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Input ---
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const inputSizeStyles = {
  sm: 'text-xs px-3 py-1.5 h-8 rounded-(var(--radius-sm))',
  md: 'text-sm px-3.5 py-2.5 h-10 rounded-(var(--radius-field))',
  lg: 'text-base px-4 py-3 h-12 rounded-(var(--radius-field))',
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, inputSize = 'md', loading = false, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const helperId = error ? `${inputId}-error` : undefined;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-700 dark:text-(--text-secondary) tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-(--text-muted) pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={helperId}
            className={cn(
              'w-full bg-(--bg-elevated) border border-black/[0.08] dark:border-white/[0.06] text-(--text-primary) placeholder-(--text-muted) hover:bg-state-hover transition-all duration-150 focus:outline-none focus:border-black/30 dark:focus:border-white/[0.16] shadow-xs focus-ui99',
              inputSizeStyles[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-rose-500/60 focus:border-rose-500',
              className
            )}
            {...props}
          />
          {(rightIcon || loading) && (
            <div className="absolute right-3.5 text-(--text-muted) flex items-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : rightIcon}
            </div>
          )}
        </div>
        {error && <p id={helperId} className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- Textarea ---
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', rows = 3, id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const helperId = error ? `${textareaId}-error` : undefined;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-zinc-700 dark:text-(--text-secondary) tracking-tight">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={helperId}
          className={cn(
            'w-full bg-(--bg-elevated) border border-black/[0.08] dark:border-white/[0.06] rounded-(var(--radius-field)) p-3.5 text-sm text-(--text-primary) placeholder-(--text-muted) hover:bg-state-hover transition-all duration-150 focus:outline-none focus:border-black/30 dark:focus:border-white/[0.16] resize-y shadow-xs focus-ui99',
            error && 'border-rose-500/60 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {error && <p id={helperId} className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// --- SearchBar ---
export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search everything in UI99...',
  onClear,
  autoFocus,
  className = '',
}: SearchBarProps) {
  return (
    <div className={cn('relative w-full flex items-center', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-(--text-muted) pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-(--bg-elevated) border border-black/[0.08] dark:border-white/[0.06] rounded-(var(--radius-pill)) pl-10 pr-10 py-2.5 text-sm text-(--text-primary) placeholder-(--text-muted) hover:bg-state-hover focus:outline-none focus:border-black/30 dark:focus:border-white/[0.16] transition-all shadow-xs tracking-tight"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 p-1 rounded-(var(--radius-pill)) text-zinc-400 hover:text-zinc-900 dark:text-(--text-muted) dark:hover:text-(--text-primary) transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
