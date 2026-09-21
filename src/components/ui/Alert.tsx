/**
 * UI99 — Alert (Wave A)
 * Static callout with severity variants + cva matrix, icon/title/description
 * slots, role="alert" when the destructive variant is used.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const alertVariants = cva(
  'relative w-full flex gap-3 items-start rounded-2xl border p-4 text-sm tracking-tight',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-50 dark:bg-[#0E0E13] border-black/[0.06] dark:border-white/[0.04] text-zinc-800 dark:text-[#D4D4D8]',
        info: 'bg-blue-500/[0.06] dark:bg-blue-500/[0.08] border-blue-500/20 text-blue-800 dark:text-blue-300',
        success:
          'bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
        warning:
          'bg-amber-500/[0.06] dark:bg-amber-500/[0.08] border-amber-500/25 text-amber-800 dark:text-amber-300',
        destructive:
          'bg-rose-500/[0.06] dark:bg-rose-500/[0.08] border-rose-500/25 text-rose-800 dark:text-rose-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  title?: string;
}

export function Alert({ variant, icon, title, className, children, ...props }: AlertProps) {
  return (
    <div
      role={variant === 'destructive' ? 'alert' : undefined}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <span className="mt-0.5 shrink-0 [&_svg]:size-4">{icon}</span>}
      <div className="space-y-1 min-w-0">
        {title && <div className="font-semibold leading-snug">{title}</div>}
        <div className="text-[13px] leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
