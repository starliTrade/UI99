/**
 * UI99 — EmptyPlaceholder Component
 * Zero-slop illustration-free empty states with micro-action triggers and keyboard hints.
 */

import React from 'react';
import { PackageOpen, Plus, Sparkles, Inbox, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Kbd } from './Kbd';

export interface EmptyPlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  shortcut?: string;
  className?: string;
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  shortcut,
  className,
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-(--radius-lg)',
        'border border-dashed border-black/10 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-(--bg-card)/50',
        'w-full max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-12 h-12 rounded-(--radius-control) bg-white dark:bg-(--bg-elevated) border border-black/5 dark:border-white/5 flex items-center justify-center text-(--text-secondary) dark:text-zinc-500 shadow-xs mb-4">
        {icon || <Inbox className="icon-xl stroke-[1.5]" />}
      </div>

      <h4 className="type-body-lg font-semibold text-zinc-900 dark:text-white tracking-tight mb-1">
        {title}
      </h4>

      {description && (
        <p className="type-caption sm:type-body text-(--text-muted) dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={onAction}
            icon={<Plus className="icon-sm" />}
          >
            <span>{actionLabel}</span>
            {shortcut && (
              <span className="ml-2">
                <Kbd size="xs">{shortcut}</Kbd>
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
