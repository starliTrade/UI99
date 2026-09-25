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
      className={cn('cursor-pointer focus-visible:outline-none focus-ui99', className)}
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
          'z-50 w-72 rounded-2xl border border-(--border-subtle) bg-white/95 dark:bg-(--bg-elevated)/95 backdrop-blur-2xl p-4 text-(--text-primary) shadow-(var(--elevation-3)) dark:shadow-(var(--elevation-3))',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
HoverCardContent.displayName = 'HoverCardContent';
