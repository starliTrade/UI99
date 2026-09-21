/**
 * UI99 — Timeline (Wave C)
 * Vertical event feed (Life-OS pattern): dot-on-rail with timestamp + content
 * slots; accent variants per event kind.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface TimelineProps extends React.ComponentProps<'ol'> {}

export function Timeline({ className = '', ...props }: TimelineProps) {
  return (
    <ol
      className={cn('relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-black/[0.08] dark:before:bg-white/[0.08]', className)}
      {...props}
    />
  );
}
Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends React.ComponentProps<'li'> {
  timestamp?: string;
  accent?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'neutral';
}

const accentMap = {
  emerald: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
  amber: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
  rose: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]',
  blue: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
  purple: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
  neutral: 'bg-zinc-400 dark:bg-zinc-600',
};

export function TimelineItem({
  timestamp,
  accent = 'neutral',
  className = '',
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li className={cn('relative pl-7', className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-white dark:border-[#0B0C11]',
          accentMap[accent]
        )}
      />
      {timestamp && (
        <div className="text-[10px] font-mono uppercase tracking-wider text-(--text-muted) mb-1">
          {timestamp}
        </div>
      )}
      <div className="text-xs text-(--text-primary) leading-relaxed">{children}</div>
    </li>
  );
}
TimelineItem.displayName = 'TimelineItem';
