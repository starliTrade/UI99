/**
 * SAFA — Unified Tactile Controls (Button, IconButton, Tag, Avatar) (Build 03.0)
 * Full shadcn-grade variant/size matrix on the SAFA velvet token system.
 * Five-state contract per docs/standards.md §12: default/hover/press/
 * focus-visible/disabled — focus ring via focus-safa (WCAG 2.4.13).
 */

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] focus-visible:outline-none focus-safa disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[#111116] text-white hover:bg-[#1E1E24] border border-black/10 shadow-xs dark:bg-[#EBEBEF] dark:text-[#0C0C0E] dark:hover:bg-[#F5F5F8] dark:border-white/10',
        secondary:
          'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 hover:text-black border border-black/[0.05] shadow-xs dark:bg-[#16161B] dark:text-[#D4D4D8] dark:hover:bg-[#1C1C22] dark:hover:text-white dark:border-white/[0.06]',
        outline:
          'bg-transparent text-zinc-800 border border-black/[0.1] hover:bg-black/[0.03] shadow-xs dark:text-[#D4D4D8] dark:border-white/[0.08] dark:hover:bg-white/[0.04]',
        ghost:
          'bg-transparent text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-[#92929B] dark:hover:bg-white/[0.04] dark:hover:text-[#EDEDEF]',
        link: 'bg-transparent underline-offset-4 hover:underline text-zinc-900 dark:text-[#EDEDEF] hover:bg-transparent px-0',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-500 border border-rose-700/40 shadow-xs dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-[#2A0A10]',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-700/40 shadow-xs dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-[#06251A]',
        'white-pill':
          'bg-[#EBEBEF] text-[#0C0C0E] font-semibold hover:bg-[#F5F5F8] shadow-xs border border-white/20',
        'dark-pill':
          'bg-[#111116] text-[#EDEDEF] hover:bg-[#1C1C22] hover:text-white border border-black/10 dark:border-white/[0.06] shadow-xs',
        rose:
          'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60 dark:bg-[#18181F] dark:text-[#D4C5B9] dark:hover:bg-[#20202A] dark:border-white/[0.07]',
      },
      size: {
        xs: 'text-[11px] px-2.5 py-1 rounded-full gap-1 h-6',
        sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 h-8',
        md: 'text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full gap-2 h-10',
        lg: 'text-base px-6 py-3 rounded-full gap-2.5 h-12',
        icon: 'w-10 h-10 rounded-full p-0 [&_svg]:size-4',
      },
      shape: {
        pill: '',
        rounded: 'rounded-xl',
        square: 'rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'pill',
      fullWidth: false,
    },
  }
);

// --- Button ---
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  children,
  icon,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, shape, fullWidth }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
      {icon && !loading && <span className="shrink-0 inline-flex">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

export const iconButtonVariants = cva(
  'rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-90 focus-visible:outline-none focus-safa disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-[#111116] text-white hover:bg-[#1E1E24] shadow-xs dark:bg-[#EBEBEF] dark:text-[#0C0C0E] dark:hover:bg-[#F5F5F8]',
        white:
          'bg-white text-zinc-900 hover:bg-zinc-100 shadow-xs border border-black/[0.06] dark:bg-[#EBEBEF] dark:text-[#0C0C0E] dark:hover:bg-[#F5F5F8]',
        secondary:
          'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-black/[0.05] dark:bg-[#16161B] dark:text-[#D4D4D8] dark:hover:bg-[#1E1E26] dark:border-white/[0.06]',
        outline:
          'bg-transparent text-zinc-800 border border-black/[0.1] hover:bg-black/[0.03] dark:text-[#D4D4D8] dark:border-white/[0.08] dark:hover:bg-white/[0.04]',
        ghost:
          'bg-transparent text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-[#92929B] dark:hover:bg-white/[0.04] dark:hover:text-[#EDEDEF]',
        link: 'bg-transparent hover:bg-transparent text-zinc-900 dark:text-[#EDEDEF] hover:scale-100',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-500 border border-rose-700/40 shadow-xs dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-[#2A0A10]',
        rose:
          'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60 dark:bg-[#18181F] dark:text-[#D4C5B9] dark:hover:bg-[#20202A] dark:border-white/[0.07]',
      },
      size: {
        xs: 'w-7 h-7 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-9 h-9 sm:w-10 sm:h-10 text-sm',
        lg: 'w-11 h-11 text-base',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

// --- IconButton ---
export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
  label?: string;
  loading?: boolean;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  loading = false,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      title={label}
      aria-label={label}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
    </button>
  );
}

// --- Tag ---
export interface TagProps {
  children?: ReactNode;
  label?: string;
  variant?: 'neutral' | 'amber' | 'purple' | 'green' | 'red' | 'rose' | 'blue' | 'outline' | 'solid';
  color?: TagProps['variant'];
  size?: 'sm' | 'md';
  onRemove?: () => void;
  className?: string;
}

export function Tag({
  children,
  label,
  variant,
  color,
  size = 'sm',
  onRemove,
  className = '',
}: TagProps) {
  const effectiveVariant = variant || color || 'neutral';
  const sizeStyle = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  const variantStyle = {
    neutral:
      'bg-zinc-100 text-zinc-700 border border-black/[0.06] dark:bg-white/[0.04] dark:text-[#A1A1AA] dark:border-white/[0.06]',
    amber:
      'bg-amber-50 text-amber-800 border border-amber-300/40 font-medium dark:bg-amber-400/[0.08] dark:text-amber-300/90 dark:border-amber-400/20',
    purple:
      'bg-purple-50 text-purple-800 border border-purple-300/40 font-medium dark:bg-purple-400/[0.08] dark:text-purple-300/90 dark:border-purple-400/20',
    green:
      'bg-emerald-50 text-emerald-800 border border-emerald-300/40 font-medium dark:bg-emerald-400/[0.08] dark:text-emerald-300/90 dark:border-emerald-400/20',
    red:
      'bg-rose-50 text-rose-800 border border-rose-300/40 font-medium dark:bg-rose-400/[0.08] dark:text-rose-300/90 dark:border-rose-400/20',
    rose:
      'bg-stone-100 text-stone-800 border border-stone-200 font-medium dark:bg-white/[0.05] dark:text-[#D4C5B9] dark:border-white/[0.07]',
    blue:
      'bg-blue-50 text-blue-800 border border-blue-300/40 font-medium dark:bg-blue-400/[0.08] dark:text-blue-300/90 dark:border-blue-400/20',
    outline:
      'bg-transparent text-zinc-700 border border-black/[0.12] dark:text-[#A1A1AA] dark:border-white/[0.12]',
    solid:
      'bg-zinc-900 text-white border border-zinc-900 dark:bg-[#EBEBEF] dark:text-[#0C0C0E] dark:border-[#EBEBEF]',
  }[effectiveVariant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full tracking-tight whitespace-nowrap ${sizeStyle} ${variantStyle} ${className}`}
    >
      <span>{children || label}</span>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="relative hover:opacity-75 transition-opacity p-0.5 cursor-pointer after:absolute after:-inset-2 after:content-['']"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}

// --- Avatar ---
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline';
  className?: string;
}

export function Avatar({
  name = 'Safa',
  src,
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const sizeStyle = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-semibold',
  }[size];

  const initial = name ? name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/10 ${sizeStyle} ${className}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`rounded-full bg-zinc-200 text-zinc-800 dark:bg-[#1A1A20] dark:text-[#D4D4D8] flex items-center justify-center font-medium ring-1 ring-black/[0.06] dark:ring-white/10 ${sizeStyle} ${className}`}
        >
          {initial}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#0B0B0D] ${
            status === 'online' ? 'bg-emerald-400' : 'bg-zinc-400 dark:bg-zinc-500'
          } ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
        />
      )}
    </div>
  );
}
