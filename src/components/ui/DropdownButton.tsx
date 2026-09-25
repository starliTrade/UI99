/**
 * UI \ [99] — LinkButton & DropdownButton Primitives
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  variant?: 'subtle' | 'emerald' | 'underline';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function LinkButton({
  href,
  external = false,
  variant = 'subtle',
  icon,
  children,
  className = '',
  ...props
}: LinkButtonProps) {
  const variantStyles = {
    subtle:
      'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors',
    emerald:
      'text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-colors',
    underline:
      'text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-white/20 hover:decoration-zinc-900 dark:hover:decoration-white transition-colors',
  }[variant];

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center gap-1.5 text-xs font-mono cursor-pointer ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {external && <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />}
    </a>
  );
}

export interface DropdownButtonOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownButtonProps {
  label: string;
  options: DropdownButtonOption[];
  onSelect: (value: string) => void;
  selected?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function DropdownButton({
  label,
  options,
  onSelect,
  selected,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = '',
}: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const sizeStyles = size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-xs';

  const variantStyles = {
    primary:
      'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 border border-transparent shadow-xs',
    secondary:
      'bg-zinc-100 dark:bg-(--bg-elevated) text-zinc-900 dark:text-(--text-primary) hover:bg-zinc-200 dark:hover:bg-(--bg-card-hover) border border-zinc-200/80 dark:border-white/[0.04]',
    outline:
      'bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.08]',
  }[variant];

  const currentLabel = options.find((o) => o.value === selected)?.label || label;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`rounded-(--radius-field) font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles}`}
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] py-1 rounded-(--radius-field) bg-white dark:bg-(--bg-elevated) border border-zinc-200 dark:border-white/[0.06] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-xs text-left font-mono flex items-center justify-between transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                selected === opt.value
                  ? 'bg-zinc-100 dark:bg-white/[0.08] text-emerald-500 font-bold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon && <span className="w-3.5 h-3.5">{opt.icon}</span>}
                <span>{opt.label}</span>
              </div>
              {selected === opt.value && <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-emerald-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
