/**
 * UI99 UI Kit — Pure Feedback States (Phase 2.2)
 * EmptyState & LoadingState are context-free primitives; they live here so the
 * npm kit entry can export them without pulling app-context toast state
 * (ToastContainer remains an app-level composite, shadcn Toaster style).
 */

import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  persianTitle?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  persianTitle,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.055] shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-(--bg-card-hover) border border-black/[0.06] dark:border-white/[0.06] text-(--text-secondary) flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-(--text-primary) tracking-tight">
        {title}
      </h3>
      {persianTitle && (
        <p className="font-persian-luxury text-xs text-zinc-400 dark:text-(--text-muted) mt-0.5">
          {persianTitle}
        </p>
      )}
      <p className="text-xs text-(--text-secondary) mt-1 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Accessing UI99 Space...' }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="w-6 h-6 text-(--text-secondary) animate-spin mb-3" />
      <p className="text-xs text-(--text-secondary) tracking-tight">{message}</p>
    </div>
  );
}
