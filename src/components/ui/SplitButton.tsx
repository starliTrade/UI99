/**
 * UI \ [99] — SplitButton Primitive
 * Primary action combined with a chevron dropdown trigger.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SplitButtonItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  items: SplitButtonItem[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function SplitButton({
  label,
  onClick,
  items,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const sizeClasses = {
    sm: 'h-8 type-caption',
    md: 'h-9 type-caption',
    lg: 'h-10 type-body',
  }[size];

  const mainPadding = {
    sm: 'px-3',
    md: 'px-3',
    lg: 'px-4',
  }[size];

  const triggerPadding = {
    sm: 'px-2',
    md: 'px-2',
    lg: 'px-3',
  }[size];

  const variantStyles = {
    primary:
      'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 border border-transparent shadow-xs',
    secondary:
      'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-soft)',
    outline:
      'bg-transparent text-zinc-900 dark:text-white hover:bg-(--bg-quiet-hover) border border-(--border-strong) dark:border-(--border-strong)',
  }[variant];

  return (
    <div ref={containerRef} className={`relative inline-flex items-stretch rounded-(--radius-field) shadow-xs ${className}`}>
      {/* Primary Action */}
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${sizeClasses} ${mainPadding} ${variantStyles} rounded-l-(--radius-control) font-medium flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
      >
        {label}
      </button>

      {/* Divider */}
      <div
        className={`w-px ${
          variant === 'primary'
            ? 'bg-zinc-700 dark:bg-zinc-300'
            : 'bg-(--bg-raised) dark:bg-(--bg-raised)'
        }`}
      />

      {/* Menu Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${sizeClasses} ${triggerPadding} ${variantStyles} rounded-r-(--radius-control) flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ChevronDown className={`icon-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full right-0 mt-1 min-w-[160px] py-1 rounded-(--radius-field) bg-white dark:bg-(--bg-card) border border-(--border-soft) dark:border-(--border-strong) shadow-xl z-popover animate-in fade-in zoom-in-95 dur-fast">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full px-3 py-1 type-caption text-left font-mono flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-quiet-hover) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {item.icon && <span className="w-3.5 h-3.5">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
