/**
 * SAFA — Linear-Grade Status & Priority Badges (Build 03.0)
 * Full shadcn-grade matrix: Badge 9 variants x 3 sizes (cva) on the velvet
 * token system, plus semantic PriorityBadge / StatusBadge indicators.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  MinusCircle,
  Clock,
  Eye,
  Circle,
  CheckCircle2,
} from 'lucide-react';
import { useIsDark } from './theme';
import { cn } from '../../lib/utils';

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'canceled';

// =====================================================================
// Badge — shadcn-grade generic badge (cva)
// =====================================================================

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-mono font-medium tracking-tight whitespace-nowrap select-none transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-black',
        secondary:
          'bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300 border border-(--border-hairline)',
        outline:
          'border border-zinc-300 dark:border-white/[0.08] text-zinc-800 dark:text-zinc-200',
        destructive: 'bg-rose-600 text-white shadow-xs dark:bg-rose-500 dark:text-[#2A0A10]',
        green:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        amber:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
        purple:
          'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5 [&_svg]:size-3',
        md: 'text-xs px-2.5 py-0.5 [&_svg]:size-3.5',
        lg: 'text-sm px-3 py-1 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}

// =====================================================================
// PriorityBadge — Linear-style semantic priority indicator
// =====================================================================

export interface PriorityBadgeProps {
  priority: PriorityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function PriorityBadge({
  priority,
  showLabel = true,
  size = 'sm',
  className = '',
}: PriorityBadgeProps) {
  const isDark = useIsDark();

  const config = {
    urgent: {
      label: 'Urgent',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      style: isDark
        ? 'bg-rose-500/[0.1] text-rose-300 border-rose-500/25'
        : 'bg-rose-50 text-rose-700 border-rose-200',
    },
    high: {
      label: 'High',
      icon: <SignalHigh className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      style: isDark
        ? 'bg-amber-500/[0.1] text-amber-300 border-amber-500/25'
        : 'bg-amber-50 text-amber-700 border-amber-200',
    },
    medium: {
      label: 'Medium',
      icon: <SignalMedium className="w-3.5 h-3.5 text-blue-500 shrink-0" />,
      style: isDark
        ? 'bg-blue-500/[0.1] text-blue-300 border-blue-500/25'
        : 'bg-blue-50 text-blue-700 border-blue-200',
    },
    low: {
      label: 'Low',
      icon: <SignalLow className="w-3.5 h-3.5 text-zinc-400 shrink-0" />,
      style: isDark
        ? 'bg-white/[0.04] text-zinc-400 border-white/[0.06]'
        : 'bg-zinc-100 text-zinc-600 border-black/[0.06]',
    },
    none: {
      label: 'No priority',
      icon: <MinusCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />,
      style: isDark
        ? 'bg-white/[0.03] text-zinc-500 border-white/[0.04]'
        : 'bg-zinc-100/70 text-zinc-500 border-black/[0.04]',
    },
  }[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors ${
        size === 'md' ? 'px-2.5 py-1 text-xs' : ''
      } ${config.style} ${className}`}
      title={config.label}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// =====================================================================
// StatusBadge — Linear-style workflow status indicator
// =====================================================================

export interface StatusBadgeProps {
  status: IssueStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  status,
  showLabel = true,
  size = 'sm',
  className = '',
}: StatusBadgeProps) {
  const isDark = useIsDark();

  const config = {
    backlog: {
      label: 'Backlog',
      icon: <Circle className="w-3.5 h-3.5 stroke-dashed text-zinc-400 shrink-0" />,
      style: isDark ? 'text-zinc-400' : 'text-zinc-600',
    },
    todo: {
      label: 'Todo',
      icon: <Circle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />,
      style: isDark ? 'text-zinc-300' : 'text-zinc-700',
    },
    in_progress: {
      label: 'In Progress',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      style: isDark ? 'text-amber-400' : 'text-amber-600',
    },
    review: {
      label: 'In Review',
      icon: <Eye className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
      style: isDark ? 'text-purple-400' : 'text-purple-600',
    },
    done: {
      label: 'Done',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
      style: isDark ? 'text-emerald-400' : 'text-emerald-600',
    },
    canceled: {
      label: 'Canceled',
      icon: <MinusCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      style: isDark ? 'text-rose-400' : 'text-rose-600',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-tight whitespace-nowrap ${
        size === 'md' ? 'text-sm gap-2' : ''
      } ${config.style} ${className}`}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
