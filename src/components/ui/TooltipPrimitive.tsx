/**
 * UI99 — Tooltip Primitive
 *
 * ANATOMY   TooltipProvider ▸ TooltipRoot ▸ TooltipTrigger ▸ TooltipContent
 * STATES    default · open · focus-visible (focus-ui99) · disabled
 * TOKENS    --bg-popover, --text-primary, --radius-sm, --z-tooltip
 * A11Y      Radix Tooltip: role="tooltip" referenced by aria-describedby.
 *            A tooltip is NEVER the only home for information — it is
 *            unavailable to touch users, so anything essential must also exist
 *            in the surface itself.
 * KEYBOARD  Focus opens · Escape dismisses immediately.
 * LAYER     --z-tooltip, the top of the stack: a tooltip must never be
 *            occluded by the overlay it describes.
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-popover overflow-hidden rounded-(--radius-field) px-3 py-1.5 type-caption font-medium tracking-tight shadow-md dur-quick',
      'bg-(--ink-fill) text-(--ink-on-fill) border border-black/[0.1] shadow-(--elevation-2)',
      'dark:bg-(--bg-elevated) dark:text-(--text-primary) dark:border-white/[0.08] dark:shadow-(--elevation-2)',
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
