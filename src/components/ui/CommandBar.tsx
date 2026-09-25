/**
 * UI99 — CommandBar (Wave E)
 * Inline contextual action bar: action chips + keyboard hints + leading slot.
 * Complements the ⌘K palette for visible affordances (Fitts: no hunting).
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Kbd } from './Kbd';

export interface CommandBarProps extends React.ComponentProps<'div'> {
  leading?: React.ReactNode;
}

export function CommandBar({ leading, className = '', children, ...props }: CommandBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Contextual actions"
      className={cn(
        'flex items-center gap-2 rounded-(--radius-lg) border border-black/[0.05] dark:border-white/[0.04] bg-white/80 dark:bg-(--bg-elevated)/80 backdrop-blur-xl px-3 py-2 shadow-(--elevation-2) dark:shadow-(--elevation-2)',
        className
      )}
      {...props}
    >
      {leading && <span className="mr-1 shrink-0 [&_svg]:size-4 text-zinc-400">{leading}</span>}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">{children}</div>
    </div>
  );
}
CommandBar.displayName = 'CommandBar';

export interface CommandActionProps extends React.ComponentProps<'button'> {
  keys?: string[];
  active?: boolean;
}

export function CommandAction({ keys, active, className = '', children, ...props }: CommandActionProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-(--radius-pill) px-2.5 text-xs font-medium transition-colors cursor-pointer',
        'focus-visible:outline-none focus-ui99-inset active:scale-[0.97]',
        active
          ? 'bg-zinc-900 text-white dark:bg-(--text-primary) dark:text-(--text-on-fill)'
          : 'text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-(--text-secondary) dark:hover:bg-white/[0.05] dark:hover:text-white',
        className
      )}
      {...props}
    >
      {children}
      {keys && keys.length > 0 && <Kbd size="xs">{keys.join('')}</Kbd>}
    </button>
  );
}
CommandAction.displayName = 'CommandAction';
