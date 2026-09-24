/**
 * UI99 — Banner Component
 * Top announcement banner with velvet obsidian aura, dismiss action, and primary callout.
 */

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface BannerProps {
  title: string;
  /** Inline secondary text next to the title (or use `children` for rich content). */
  description?: string;
  /** Rich content rendered under the title row — composes with `description`. */
  children?: React.ReactNode;
  variant?: 'obsidian' | 'emerald' | 'amber' | 'sapphire';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Banner({
  title,
  description,
  children,
  variant = 'obsidian',
  actionLabel,
  onAction,
  onDismiss,
  icon,
  className,
}: BannerProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  const variants = {
    obsidian: 'bg-zinc-900/90 dark:bg-[#0E0E14] text-white border-black/10 dark:border-white/[0.04]',
    emerald: 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-500/20',
    sapphire: 'bg-blue-500/10 text-blue-900 dark:text-blue-300 border-blue-500/20',
  };

  return (
    <div
      role={variant === 'amber' ? 'alert' : 'status'}
      className={cn(
        'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-sm',
        variants[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">
          {icon || <Sparkles className="w-4 h-4 text-emerald-400" />}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs truncate">
          <span className="font-semibold text-current truncate">{title}</span>
          {description && (
            <span className="text-zinc-400 dark:text-zinc-400 hidden sm:inline truncate">
              {description}
            </span>
          )}
        </div>
      </div>

      {children && <div className="min-w-0 text-xs opacity-90">{children}</div>}

      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && (
          <Button
            size="xs"
            variant="secondary"
            onClick={onAction}
            className="text-xs h-7 px-2.5"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
        <button
          type="button"
          onClick={() => {
            setClosed(true);
            onDismiss?.();
          }}
          aria-label="Dismiss banner"
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
