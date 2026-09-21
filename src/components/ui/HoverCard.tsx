/**
 * UI99 — HoverCard (Wave A)
 * Rich preview on hover/focus (Radix) — glass surface, no pointer capture,
 * aria-describedby wiring handled by Radix.
 */

import React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '../../lib/utils';

export function HoverCard({
  openDelay = 200,
  closeDelay = 150,
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}
HoverCard.displayName = 'HoverCard';

export function HoverCardTrigger({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger
      className={cn('cursor-pointer focus-visible:outline-none focus-safa', className)}
      {...props}
    />
  );
}
HoverCardTrigger.displayName = 'HoverCardTrigger';

export function HoverCardContent({
  className = '',
  align = 'center',
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-2xl border border-black/[0.06] dark:border-white/[0.04] bg-white/95 dark:bg-[#131318]/95 backdrop-blur-2xl p-4 text-zinc-900 dark:text-[#EDEDEF] shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.05)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
HoverCardContent.displayName = 'HoverCardContent';
