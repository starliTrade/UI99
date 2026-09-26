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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-(--radius-control) bg-white dark:bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.055] shadow-(--elevation-2) dark:shadow-(--elevation-2)">
      {icon && (
        <div className="w-12 h-12 rounded-(--radius-pill) bg-(--bg-subtle) dark:bg-(--bg-card-hover) border border-black/[0.06] dark:border-white/[0.06] text-(--text-secondary) flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="type-body-lg font-semibold text-(--text-primary) tracking-tight">
        {title}
      </h3>
      {persianTitle && (
        <p className="font-persian-luxury type-caption text-(--text-secondary) dark:text-(--text-muted) mt-0.5">
          {persianTitle}
        </p>
      )}
      <p className="type-caption text-(--text-secondary) mt-1 max-w-xs leading-relaxed">
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
      <Loader2 className="icon-xl text-(--text-secondary) animate-spin mb-3" />
      <p className="type-caption text-(--text-secondary) tracking-tight">{message}</p>
    </div>
  );
}
