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
  icon = <Plus className="w-5 h-5" />,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: FloatingActionButtonProps) {
  const sizeClasses = {
    md: label ? 'h-11 px-4 text-xs' : 'h-11 w-11',
    lg: label ? 'h-13 px-5 text-sm' : 'h-13 w-13',
  }[size];

  const variantClasses = {
    primary:
      'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.35)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.8)] border border-white/10 dark:border-white/20',
    emerald:
      'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_12px_32px_rgba(16,185,129,0.35)] border border-emerald-400/30',
    secondary:
      'bg-zinc-100 dark:bg-(--bg-elevated) text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-(--bg-card-hover) shadow-[0_12px_32px_rgba(0,0,0,0.25)] border border-zinc-200 dark:border-white/[0.06]',
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      {label && <span className="font-semibold whitespace-nowrap">{label}</span>}
    </button>
  );
}
