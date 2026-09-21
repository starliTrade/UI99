/**
 * UI99 — Separator (Wave A)
 * Radix-based divider, horizontal/vertical, with kit hairline tokens.
 */

import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../../lib/utils';

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function Separator({
  orientation = 'horizontal',
  label,
  className = '',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-black/[0.06] dark:bg-white/[0.06]',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
      {...props}
    >
      {label && (
        <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          {label}
        </span>
      )}
    </SeparatorPrimitive.Root>
  );
}
