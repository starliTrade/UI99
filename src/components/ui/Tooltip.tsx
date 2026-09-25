/**
 * UI99 — Tactile Velvet Tooltip Component (Build 02.3)
 * Dual-theme (Obsidian Dark / Porcelain Light) with Radix UI collision detection.
 * Keyboard-accessible: Radix Trigger opens on focus AND hover (WAI-ARIA APG pattern);
 * wrapper span no longer overrides pointer-events/cursor of the trigger.
  * @token Panel is `--bg-elevated` at 96% with `--border-hairline`; arrow inherits the same surface — no contrast seam.
*/

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayMs = 150,
  className = '',
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayMs}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild className={className}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            role="tooltip"
            className={cn(
              'z-50 overflow-hidden rounded-(--radius-field) px-2.5 py-1 text-[11px] font-medium tracking-tight shadow-lg border select-none',
              'bg-(--ink-fill) text-(--ink-on-fill) border-black/[0.1] shadow-(--elevation-2)',
              'dark:bg-(--bg-elevated) dark:text-(--text-primary) dark:border-white/[0.08] dark:shadow-(--elevation-2)',
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1'
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-(--ink-fill)" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
