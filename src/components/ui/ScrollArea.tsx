/**
 * UI99 — ScrollArea (Wave A)
 * Radix scroll-area with the kit's micro-thin scrollbar aesthetic (3px thumb,
 * velvet hover), replacing native scrollbars cross-browser.
 */

import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../lib/utils';

export function ScrollArea({
  className = '',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { children?: React.ReactNode }) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
ScrollArea.displayName = 'ScrollArea';

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  orientation?: 'vertical' | 'horizontal';
}

export function ScrollBar({
  className = '',
  orientation = 'vertical',
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' ? 'h-full w-2 border-l border-l-transparent p-[2px]' : 'flex-col h-2 w-full border-t border-t-transparent p-[2px]',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-black/20 hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/25" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
ScrollBar.displayName = 'ScrollBar';
