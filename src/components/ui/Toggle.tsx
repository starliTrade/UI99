/**
 * UI99 — Toggle (Wave A)
 * Two-state pressed button (Radix) — the building block of toolbar groups.
 * data-state="on" renders the M3 selected state layer.
 */

import React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight cursor-pointer select-none transition-all duration-150 focus-visible:outline-none focus-safa disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-transparent text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-[#92929B] dark:hover:bg-white/[0.04] dark:hover:text-[#EDEDEF] data-[state=on]:bg-black/[0.06] data-[state=on]:text-zinc-950 dark:data-[state=on]:bg-white/[0.08] dark:data-[state=on]:text-white',
        outline:
          'bg-transparent border border-black/[0.1] dark:border-white/[0.08] text-zinc-800 dark:text-[#D4D4D8] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] shadow-xs data-[state=on]:border-black/20 dark:data-[state=on]:border-white/25 data-[state=on]:bg-black/[0.05] dark:data-[state=on]:bg-white/[0.06]',
        secondary:
          'bg-zinc-100 dark:bg-[#16161B] text-zinc-800 dark:text-[#D4D4D8] hover:bg-zinc-200 dark:hover:bg-[#1C1C22] data-[state=on]:bg-zinc-900 data-[state=on]:text-white dark:data-[state=on]:bg-[#EBEBEF] dark:data-[state=on]:text-[#0C0C0E]',
      },
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

export function Toggle({ variant, size, className, ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
