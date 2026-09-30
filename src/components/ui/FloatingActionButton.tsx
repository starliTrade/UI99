/**
 * UI \ [99] — FloatingActionButton (FAB) Primitive
 * Elevated circular/capsule trigger with velvet diffuse shadow.
 */

import React from 'react';
import { Plus } from 'lucide-react';

export interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'emerald' | 'secondary';
  size?: 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function FloatingActionButton({
  icon = <Plus className="icon-lg" />,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: FloatingActionButtonProps) {
  const sizeClasses = {
    md: label ? 'h-11 px-4 type-caption' : 'h-11 w-11',
    lg: label ? 'h-13 px-5 type-body' : 'h-13 w-13',
  }[size];

  const variantClasses = {
    primary:
      'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-(--elevation-3) border border-white/10 dark:border-white/20',
    emerald:
      'bg-emerald-500 hover:bg-emerald-400 text-white shadow-(--elevation-3) border border-emerald-400/30',
    secondary:
      'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary) shadow-(--elevation-3) border border-(--border-subtle) hover:border-(--border-soft)',
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-(--radius-pill) inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      {label && <span className="font-semibold whitespace-nowrap">{label}</span>}
    </button>
  );
}
