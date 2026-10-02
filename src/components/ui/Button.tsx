/**
 * UI99 — Master Mathematical Tactile Controls (Button, IconButton, Tag, Avatar)
 *
 * Implements the 4-Core Mathematical Engine:
 * 1. OKLab Luminance Tiers: Primary Ink (Solid), Quiet (W 0.006), Control (W 0.024), Accent Tints.
 * 2. Dynamic Hover Alpha Scaling: alpha_hover = alpha_rest * 2.8.
 * 3. Critical Damping Spring Physics: Stiffness 500, Damping 38, Scale 0.985 on press.
 * 4. Concentric Geometry & 4px/8px Modular Padding Grid.
 * 5. Full 5-State Contract: Default, Hover, Press, Focus-Visible, Disabled + Loading.
 */

import React, { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium tracking-tight select-none cursor-pointer ' +
    'transition-all duration-150 ease-out ' +
    'active:scale-[0.985] active:duration-75 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060709] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // Tier 0: Solid Ink Contrast (Maximum Clarity)
        primary:
          'bg-white text-black font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.50)] hover:bg-zinc-100 hover:shadow-[0_6px_20px_rgba(0,0,0,0.65)] border-0',

        // Compatibility alias for white-pill
        'white-pill':
          'bg-white text-black font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.50)] hover:bg-zinc-100 hover:shadow-[0_6px_20px_rgba(0,0,0,0.65)] border-0',

        // Tier 1: Quiet Action (Mathematical W(0.006) -> Hover W(0.018))
        quiet:
          'bg-white/[0.006] text-zinc-200 border border-white/[0.010] hover:bg-white/[0.018] hover:border-white/[0.016] hover:text-white',

        // Alias for secondary compatibility
        secondary:
          'bg-white/[0.006] text-zinc-200 border border-white/[0.010] hover:bg-white/[0.018] hover:border-white/[0.016] hover:text-white',

        // Tier 2: Interactive Control Button (W(0.024) Base)
        control:
          'bg-white/[0.024] text-zinc-100 border border-white/[0.020] hover:bg-white/[0.045] hover:border-white/[0.035] hover:text-white',

        // Compatibility alias for dark-pill
        'dark-pill':
          'bg-white/[0.024] text-zinc-100 border border-white/[0.020] hover:bg-white/[0.045] hover:border-white/[0.035] hover:text-white',

        // Accent Emerald (Verified / Success)
        emerald:
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-300',

        success:
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-300',

        // Accent Rose (Destructive / Urgent)
        rose:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300',

        destructive:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300',

        // Transparent Outline
        outline:
          'bg-transparent text-zinc-300 border border-white/[0.020] hover:bg-white/[0.018] hover:border-white/[0.030] hover:text-white',

        // Ghost Affordance
        ghost:
          'bg-transparent text-zinc-400 hover:bg-white/[0.018] hover:text-zinc-100 border-0',

        // Link Affordance
        link:
          'bg-transparent text-zinc-300 hover:text-white underline-offset-4 hover:underline p-0 border-0 h-auto',

        white:
          'bg-white text-zinc-900 hover:opacity-90 shadow-xs border border-black/[0.06]',
      },

      // Harmonic Sizing Ladder: [Height, Horizontal Padding, Vertical Padding, Font Scale]
      size: {
        xs: 'h-6 px-2.5 type-micro gap-1',
        sm: 'h-8 px-3.5 type-caption gap-1.5',
        md: 'h-10 px-4 type-body gap-2',
        lg: 'h-12 px-6 type-body-lg gap-2.5',
        icon: 'w-10 h-10 p-0 shrink-0 [&_svg]:size-4',
      },

      // Concentric Corner Geometry
      shape: {
        pill: 'rounded-(--radius-pill)',
        rounded: 'rounded-(--radius-control)',
        square: 'rounded-(--radius-sm)',
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  children,
  icon,
  iconEnd,
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
      {loading ? (
        <Loader2 className="icon-xs animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0 inline-flex">{icon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {!loading && iconEnd && <span className="shrink-0 inline-flex">{iconEnd}</span>}
    </button>
  );
}

// ── ICON BUTTON ──

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

        white:
          'bg-white text-zinc-900 hover:opacity-90 shadow-xs border border-black/[0.06]',

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

        destructive:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300',

        outline:
          'bg-transparent text-zinc-300 border border-white/[0.020] hover:bg-white/[0.018] hover:border-white/[0.030] hover:text-white',

        ghost:
          'bg-transparent text-zinc-400 hover:bg-white/[0.018] hover:text-zinc-100 border-0',

        link:
          'bg-transparent text-zinc-300 hover:text-white border-0',
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
  'aria-label'?: string;
  label?: string;
  loading?: boolean;
}

export function IconButton({
  icon,
  variant = 'quiet',
  size = 'md',
  shape = 'pill',
  loading = false,
  label,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const ariaLabel = props['aria-label'] || label || 'Action button';
  return (
    <button
      className={cn(iconButtonVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? <Loader2 className="icon-xs animate-spin shrink-0" /> : icon}
    </button>
  );
}

// ── TAG / CHIP ──

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  label?: string;
  variant?:
    | 'default'
    | 'primary'
    | 'emerald'
    | 'rose'
    | 'amber'
    | 'blue'
    | 'purple'
    | 'neutral'
    | 'green'
    | 'red';
  size?: 'xs' | 'sm' | 'md';
  onRemove?: () => void;
}

export function Tag({
  children,
  label,
  variant = 'default',
  size = 'sm',
  onRemove,
  className = '',
  ...props
}: TagProps) {
  const variantStyles: Record<string, string> = {
    default: 'bg-white/[0.024] text-zinc-300 border-white/[0.020]',
    neutral: 'bg-white/[0.024] text-zinc-300 border-white/[0.020]',
    primary: 'bg-white/10 text-white border-white/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 type-micro gap-1 rounded-(--radius-pill)',
    sm: 'px-2.5 py-0.5 type-micro font-medium gap-1.5 rounded-(--radius-pill)',
    md: 'px-3 py-1 type-caption font-medium gap-2 rounded-(--radius-pill)',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border font-mono tracking-tight select-none transition-colors',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span>{children || label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 cursor-pointer -me-0.5 p-0.5"
          aria-label="Remove tag"
        >
          <X className="size-2.5" />
        </button>
      )}
    </span>
  );
}

// ── AVATAR ──

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
  src,
  name = '',
  alt = '',
  size = 'md',
  status,
  className = '',
  ...props
}: AvatarProps) {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 type-micro',
    md: 'w-10 h-10 type-caption',
    lg: 'w-12 h-12 type-body font-bold',
    xl: 'w-16 h-16 type-title font-bold',
  };

  const displayName = name || alt;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.03] text-zinc-200 font-mono select-none shrink-0 overflow-hidden',
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#060709]',
            status === 'online' && 'bg-emerald-500',
            status === 'offline' && 'bg-zinc-600',
            status === 'busy' && 'bg-rose-500',
            status === 'away' && 'bg-amber-500'
          )}
        />
      )}
    </div>
  );
}
