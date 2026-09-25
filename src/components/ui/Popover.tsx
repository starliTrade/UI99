/**
 * UI99 — Popover
 *
 * ANATOMY   Popover ▸ [PopoverTrigger] ▸ [PopoverAnchor] ▸ [PopoverContent]
 * STATES    default · open · focus-visible (focus-ui99) · closed
 * TOKENS    --bg-popover, --shadow-popover, --radius-lg, --border-subtle
 * A11Y      Radix Popover: non-modal, focus moves in on open and returns to
 *            the trigger on close; Escape dismisses.
 * KEYBOARD  Enter/Space toggles · Escape closes · Tab moves out naturally
 *            (non-modal — the surrounding page stays reachable).
 */

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // p-4 = 16px → the `md` padding band (docs/standards.md §5c).
        'z-popover w-72 rounded-(--radius-md) p-4 shadow-(--shadow-popover) outline-none dur-quick backdrop-blur-2xl',
        'bg-white/95 dark:bg-(--bg-elevated)/95 text-(--text-primary)',
        'border border-black/[0.06] dark:border-white/[0.07]',
        'shadow-(--elevation-3) dark:shadow-(--elevation-4)',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
