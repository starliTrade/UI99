/**
 * UI99 — Collapsible (Wave A)
 * Radix collapsible with kit motion tokens; grid-rows animation for smooth
 * height reveal (pure CSS, respects prefers-reduced-motion).
 */

import React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '../../lib/utils';

export function Collapsible({
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root {...props} />;
}
Collapsible.displayName = 'Collapsible';

export function CollapsibleTrigger({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn('group cursor-pointer focus-visible:outline-none focus-safa-inset', className)}
      {...props}
    />
  );
}
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export function CollapsibleContent({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      className={cn(
        'overflow-hidden data-[state=closed]:hidden',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  );
}
CollapsibleContent.displayName = 'CollapsibleContent';
