/**
 * UI99 — AvatarStack (Wave G)
 * Overlapping avatar group with overflow counter; ring gap keeps velvet
 * separation between members.
  * @token Member rings separate via the surface color of the hosting card (`ring-2`), keeping velvet gap on any `--bg-card`/`--bg-surface`.
*/

import React from 'react';
import { cn } from '../../lib/utils';
import { Avatar } from './Button';

export interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarStack({ names, max = 4, size = 'sm', className = '' }: AvatarStackProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;

  return (
    <div className={cn('flex items-center', className)} aria-label={`${names.length} members`}>
      {visible.map((name, i) => (
        <div
          key={`${name}-${i}`}
          className={cn(i > 0 && '-ml-2')}
          style={{ zIndex: visible.length - i }}
        >
          <Avatar name={name} size={size} className="ring-2 ring-white dark:ring-(--bg-card)" />
        </div>
      ))}
      {overflow > 0 && (
        <div className="-ml-2" style={{ zIndex: 0 }}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-zinc-100 dark:bg-(--bg-card-hover) font-mono font-semibold text-(--text-secondary) ring-2 ring-white dark:ring-(--bg-card)',
              size === 'xs' && 'w-6 h-6 text-[9px]',
              size === 'sm' && 'w-7 h-7 text-[10px]',
              size === 'md' && 'w-9 h-9 text-xs',
              size === 'lg' && 'w-12 h-12 text-sm'
            )}
          >
            +{overflow}
          </div>
        </div>
      )}
    </div>
  );
}
