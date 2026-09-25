/**
 * UI99 — ToggleGroup (Wave A)
 * Radix toggle-group: single-select (tabs-like) or multi-select (toolbar).
 * Items nest the Toggle visual with seamless grouping (no double borders).
 */

import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '../../lib/utils';
import { toggleVariants, type ToggleProps } from './Toggle';

export function ToggleGroup({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        'inline-flex items-center gap-1 rounded-(var(--radius-field)) bg-(--bg-sunken) p-1 border border-(--border-hairline)',
        className
      )}
      {...props}
    />
  );
}

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    Pick<ToggleProps, 'variant' | 'size'> {}

export function ToggleGroupItem({ variant = 'default', size, className, ...props }: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({ variant, size }),
        'min-w-10 border-0 shadow-none bg-transparent data-[state=on]:bg-white data-[state=on]:shadow-xs dark:data-[state=on]:bg-(--bg-elevated)',
        className
      )}
      {...props}
    />
  );
}
