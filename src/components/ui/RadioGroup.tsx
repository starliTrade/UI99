/**
 * UI99 — RadioGroup (Wave B)
 * Radix radio-group: full arrow-navigation + roving tabindex parity.
 * Visual uses the kit's velvet dot indicator with focus-ui99-inset ring.
 */

import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RadioGroup({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2.5', className)}
      {...props}
    />
  );
}
RadioGroup.displayName = 'RadioGroup';

export function RadioGroupItem({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'aspect-square h-4.5 w-4.5 text-zinc-900 dark:text-(--text-primary) shrink-0 cursor-pointer',
        'rounded-(var(--radius-pill)) border border-black/[0.2] dark:border-white/[0.2] shadow-xs',
        'focus-visible:outline-none focus-ui99 disabled:opacity-40 disabled:cursor-not-allowed',
        'data-[state=checked]:border-current',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2 w-2 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
RadioGroupItem.displayName = 'RadioGroupItem';
