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
  'inline-flex items-center justify-center gap-2 rounded-(--radius-sm) font-medium tracking-tight cursor-pointer select-none transition-all dur-quick focus-visible:outline-none focus-ui99 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-transparent text-zinc-600 hover:bg-(--bg-subtle) hover:text-zinc-950 dark:text-(--text-secondary) dark:hover:bg-(--bg-wash) dark:hover:text-(--text-primary) data-[state=on]:bg-(--bg-wash) data-[state=on]:text-zinc-950 dark:data-[state=on]:bg-white/[0.08] dark:data-[state=on]:text-white',
        outline:
          'bg-transparent border border-black/[0.1] dark:border-(--border-strong) text-(--text-primary) hover:bg-(--bg-quiet-hover) shadow-xs data-[state=on]:border-black/20 dark:data-[state=on]:border-white/25 data-[state=on]:bg-(--bg-wash) dark:data-[state=on]:bg-white/[0.06]',
        secondary:
          'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary) data-[state=on]:bg-zinc-900 data-[state=on]:text-white dark:data-[state=on]:bg-(--text-primary) dark:data-[state=on]:text-(--text-on-fill)',
      },
      size: {
        sm: 'h-8 px-2 type-caption',
        md: 'h-10 px-3 type-body',
        lg: 'h-12 px-4 type-body-lg',
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
