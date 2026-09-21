/**
 * SAFA — Tactile Velvet Tooltip Component (Build 02.2)
 * Dual-theme (Obsidian Dark / Porcelain Light) with Radix UI collision detection & WAI-ARIA accessibility.
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
          <span className="inline-flex cursor-default">{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 overflow-hidden rounded-xl px-2.5 py-1 text-[11px] font-medium tracking-tight shadow-lg border select-none',
              'bg-[#111116] text-white border-black/[0.1] shadow-[0_8px_20px_rgba(0,0,0,0.15)]',
              'dark:bg-[#181820] dark:text-[#EDEDEF] dark:border-white/[0.08] dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]',
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1'
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[#111116] dark:fill-[#181820]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
