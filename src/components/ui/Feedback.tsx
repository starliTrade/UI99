/**
 * SAFA UI Kit — Pure Feedback States (Phase 2.2)
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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#111114] border border-black/[0.06] dark:border-white/[0.055] shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-[#16161B] border border-black/[0.06] dark:border-white/[0.06] text-zinc-600 dark:text-[#92929B] flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
        {title}
      </h3>
      {persianTitle && (
        <p className="font-persian-luxury text-xs text-zinc-400 dark:text-[#5C5C66] mt-0.5">
          {persianTitle}
        </p>
      )}
      <p className="text-xs text-zinc-500 dark:text-[#92929B] mt-1 max-w-xs leading-relaxed">
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

export function LoadingState({ message = 'Accessing Safa Space...' }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="w-6 h-6 text-zinc-500 dark:text-[#92929B] animate-spin mb-3" />
      <p className="text-xs text-zinc-500 dark:text-[#8E8E98] tracking-tight">{message}</p>
    </div>
  );
}
