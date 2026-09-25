/**
 * UI99 — ActivityFeed Component
 * Real-time event and audit stream with actor avatars, timestamps, and commit diff tags.
 */

import React from 'react';
import { GitCommit, CheckCircle2, MessageSquare, Plus, ArrowUpRight, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar } from './Button';
import { PriorityBadge, StatusBadge } from './Badge';

export interface ActivityEvent {
  id: string;
  actor: { name: string; avatar?: string };
  action: 'committed' | 'resolved' | 'commented' | 'created' | 'cycled';
  target: string;
  timestamp: string;
  details?: string;
}

export interface ActivityFeedProps {
  events?: ActivityEvent[];
  className?: string;
}

const DEFAULT_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    actor: { name: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces' },
    action: 'resolved',
    target: 'UI-101 (Migrate core tokens to Velvet Obsidian)',
    timestamp: '4m ago',
    details: 'Validated 100% WCAG AAA contrast in Dark & Light palettes.',
  },
  {
    id: '2',
    actor: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces' },
    action: 'committed',
    target: 'feat(ui): add 16 new master primitives to kit export',
    timestamp: '18m ago',
    details: 'Added ColorPicker, SignaturePad, TreeView, DiffViewer, TerminalEmulator.',
  },
  {
    id: '3',
    actor: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces' },
    action: 'commented',
    target: 'UI-103 (Keyboard hotkeys documentation)',
    timestamp: '1h ago',
    details: '"The J/K selection feels extremely responsive like desktop software."',
  },
];

export function ActivityFeed({ events = DEFAULT_EVENTS, className }: ActivityFeedProps) {
  const getActionMeta = (action: ActivityEvent['action']) => {
    switch (action) {
      case 'resolved':
        return { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' };
      case 'committed':
        return { icon: GitCommit, color: 'text-blue-500 bg-blue-500/10' };
      case 'commented':
        return { icon: MessageSquare, color: 'text-purple-500 bg-purple-500/10' };
      case 'created':
        return { icon: Plus, color: 'text-amber-500 bg-amber-500/10' };
      case 'cycled':
        return { icon: Flame, color: 'text-rose-500 bg-rose-500/10' };
    }
  };

  return (
    <div
      className={cn(
        'p-4 rounded-(--radius-lg) bg-white dark:bg-(--bg-card) border border-black/[0.06] dark:border-white/[0.04]',
        'flex flex-col gap-4 shadow-sm w-full',
        className
      )}
    >
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.03]">
        <h4 className="type-caption font-semibold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">
          Live Activity Stream
        </h4>
        <span className="type-micro font-mono text-(--text-secondary)">Real-time sync</span>
      </div>

      <div className="flex flex-col gap-4 relative">
        <div className="absolute top-3 bottom-3 left-4 w-[1px] bg-zinc-200 dark:bg-white/[0.06] -z-base" />

        {events.map((evt) => {
          const meta = getActionMeta(evt.action);
          const Icon = meta.icon;

          return (
            <div key={evt.id} className="flex items-start gap-3 relative z-content">
              <Avatar
                src={evt.actor.avatar}
                alt={evt.actor.name}
                size="sm"
                className="shrink-0 ring-2 ring-white dark:ring-(--bg-card)"
              />

              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 type-caption">
                  <span className="font-semibold text-zinc-900 dark:text-white truncate">
                    {evt.actor.name}
                  </span>
                  <span className="text-(--text-muted) dark:text-zinc-400">{evt.action}</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-none">
                    {evt.target}
                  </span>
                  <span className="type-micro text-(--text-secondary) ml-auto font-mono">
                    {evt.timestamp}
                  </span>
                </div>

                {evt.details && (
                  <p className="type-caption text-(--text-muted) dark:text-zinc-400 bg-zinc-50 dark:bg-(--bg-elevated) p-2 rounded-(--radius-field) border border-black/[0.03] dark:border-white/[0.03]">
                    {evt.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
