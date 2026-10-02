/**
 * UI99 — Master Mathematical Tactile IconButton (کامپوننت آیکون‌باتن با فیزیک و هندسه هم‌مرکز)
 */

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const iconButtonVariants = cva(
  'inline-flex items-center justify-center select-none cursor-pointer ' +
    'transition-all duration-150 ease-out ' +
    'active:scale-[0.92] active:duration-75 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060709] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-black shadow-[0_4px_14px_rgba(0,0,0,0.50)] hover:bg-zinc-100 hover:shadow-[0_6px_20px_rgba(0,0,0,0.65)] border-0',

        quiet:
          'bg-white/[0.006] text-zinc-300 border border-white/[0.010] hover:bg-white/[0.018] hover:border-white/[0.016] hover:text-white',

        secondary:
          'bg-white/[0.006] text-zinc-300 border border-white/[0.010] hover:bg-white/[0.018] hover:border-white/[0.016] hover:text-white',

        control:
          'bg-white/[0.024] text-zinc-100 border border-white/[0.020] hover:bg-white/[0.045] hover:border-white/[0.035] hover:text-white',

        emerald:
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-300',

        rose:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300',

        ghost:
          'bg-transparent text-zinc-400 hover:bg-white/[0.018] hover:text-zinc-100 border-0',
      },

      size: {
        xs: 'w-6 h-6 rounded-(--radius-xs) [&_svg]:size-3',
        sm: 'w-8 h-8 rounded-(--radius-sm) [&_svg]:size-3.5',
        md: 'w-10 h-10 rounded-(--radius-control) [&_svg]:size-4',
        lg: 'w-12 h-12 rounded-(--radius-md) [&_svg]:size-5',
      },

      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-(--radius-control)',
        square: 'rounded-(--radius-sm)',
      },
    },
    defaultVariants: {
      variant: 'quiet',
      size: 'md',
      shape: 'pill',
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
  'aria-label': string;
  loading?: boolean;
}

export function IconButton({
  icon,
  variant = 'quiet',
  size = 'md',
  shape = 'pill',
  loading = false,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(iconButtonVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="icon-xs animate-spin shrink-0" /> : icon}
    </button>
  );
}
