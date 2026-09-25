/**
 * UI99 — Label (Wave A)
 * Radix-based accessible form label with kit typography + disabled styling
 * hooking the standard `[data-disabled]` and peer-invalid patterns.
 */

import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export function Label({ className = '', ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'type-caption font-semibold tracking-tight text-zinc-700 dark:text-(--text-secondary) select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
