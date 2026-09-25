/**
 * UI99 — Unified Velvet UX Feedback States: Toast, EmptyState, LoadingState (Build 02.3)
 * Semantic toast types with pause-on-hover/focus timing (WCAG 2.2.1), Escape dismissal,
 * dismiss button, aria-live announcements, and a 3-message concurrent cap (M3 snackbar).
 * Dual-theme (Obsidian / Matte Porcelain).
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useApp, ToastItem } from '../../core/context/AppContext';
import { Button } from './Button';

const MAX_CONCURRENT_TOASTS = 3;
const TOAST_DURATION_MS = 4500; // M3 guidance: 4–10s for toasts with actions; pause-on-hover applies

const toastVisuals: Record<
  NonNullable<ToastItem['type']>,
  { icon: ReactNode; accentClass: string; label: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />,
    accentClass: 'border-l-2 border-l-emerald-500/70',
    label: 'Success',
  },
  warning: {
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />,
    accentClass: 'border-l-2 border-l-amber-500/70',
    label: 'Warning',
  },
  rose: {
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />,
    accentClass: 'border-l-2 border-l-rose-500/70',
    label: 'Error',
  },
  amber: {
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />,
    accentClass: 'border-l-2 border-l-amber-500/70',
    label: 'Notice',
  },
  purple: {
    icon: <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-500" />,
    accentClass: 'border-l-2 border-l-purple-500/70',
    label: 'Insight',
  },
  info: {
    icon: <Info className="w-3.5 h-3.5 shrink-0 text-blue-500" />,
    accentClass: 'border-l-2 border-l-blue-500/70',
    label: 'Info',
  },
};

// --- Single Toast (self-managed timing with pause-on-hover/focus) ---
function ToastRow({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(TOAST_DURATION_MS);
  const startedRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visual = toastVisuals[toast.type || 'info'] ?? toastVisuals.info;

  useEffect(() => {
    if (paused) {
      // Freeze remaining time
      remainingRef.current -= Date.now() - startedRef.current;
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    startedRef.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(toast.id), Math.max(remainingRef.current, 0));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, onDismiss, toast.id]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      tabIndex={-1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onDismiss(toast.id);
        }
      }}
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      className={`pointer-events-auto relative w-full flex items-center gap-2.5 px-4 py-2.5 rounded-(var(--radius-control)) border border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-(--bg-elevated)/95 backdrop-blur-2xl text-(--text-primary) shadow-(var(--elevation-3)) dark:shadow-(var(--elevation-3)) text-xs font-medium select-none ${visual.accentClass}`}
    >
      {visual.icon}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="relative shrink-0 p-1 -m-1 rounded-(var(--radius-pill)) text-zinc-400 hover:text-zinc-900 dark:text-(--text-muted) dark:hover:text-(--text-primary) transition-colors cursor-pointer after:absolute after:-inset-1.5 after:content-['']"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// --- Toast Container ---
export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  // Enforce concurrent cap: newest wins, oldest evicted (M3 snackbar guidance)
  const visibleToasts = toasts.slice(-MAX_CONCURRENT_TOASTS);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4 pt-safe"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {visibleToasts.map((t) => (
          <ToastRow key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- EmptyState ---
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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-(var(--radius-control)) bg-white dark:bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.055] shadow-(var(--elevation-2)) dark:shadow-(var(--elevation-2))">
      {icon && (
        <div className="w-12 h-12 rounded-(var(--radius-pill)) bg-zinc-100 dark:bg-(--bg-card-hover) border border-black/[0.06] dark:border-white/[0.06] text-(--text-secondary) flex items-center justify-center mb-3">
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

// --- LoadingState ---
export function LoadingState({ message = 'Accessing UI99 Space...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="w-6 h-6 text-(--text-secondary) animate-spin mb-3" />
      <p className="text-xs text-(--text-secondary) tracking-tight">{message}</p>
    </div>
  );
}
