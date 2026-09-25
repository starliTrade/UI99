/**
 * UI99 — Unified Tactile Controls (Button, IconButton, Tag, Avatar) (Build 03.0)
 * Full shadcn-grade variant/size matrix on the UI99 velvet token system.
 * Five-state contract per docs/standards.md §12: default/hover/press/
 * focus-visible/disabled — focus ring via focus-ui99 (WCAG 2.4.13).
 *
 * @token Surfaces resolve via `--bg-card` / `--bg-elevated`; state layers via
 *   `--state-hover` (6% dark / 4% light, M3 ratios). Fill inverses read
 *   `--text-on-fill`. Override the theme by toggling `.dark`/`.light`/
 *   `.porcelain` on <html> — never hardcode hex in consumers.
 */

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 cursor-pointer select-none active:scale-[0.97] focus-visible:outline-none focus-ui99 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-(--ink-fill) text-(--ink-on-fill) hover:bg-(--ink-fill) border border-black/10 shadow-xs dark:border-white/10 dark:shadow-(--elevation-2)',
        secondary:
          'bg-zinc-100 text-zinc-800 hover:bg-state-hover hover:text-black border border-black/[0.05] shadow-xs dark:bg-white/[0.045] dark:text-(--text-primary) dark:hover:text-white dark:border-white/[0.025] shadow-(--shadow-card)',
        outline:
          'bg-transparent text-zinc-800 border border-black/[0.1] hover:bg-state-hover shadow-xs dark:text-(--text-primary) dark:border-white/[0.04]',
        ghost:
          'bg-transparent text-zinc-600 hover:bg-state-hover hover:text-zinc-950 dark:text-(--text-secondary) dark:hover:text-(--text-primary)',
        link: 'bg-transparent underline-offset-4 hover:underline text-(--text-primary) hover:bg-transparent px-0',
        destructive:
          'bg-(--intent-rose) text-(--intent-rose-on) hover:bg-(--intent-rose-hover) border border-rose-700/40 dark:border-rose-400/20 shadow-xs',
        success:
          'bg-(--intent-emerald) text-(--intent-emerald-on) hover:bg-(--intent-emerald-hover) border border-emerald-700/40 dark:border-emerald-400/20 shadow-xs',
        'white-pill':
          'bg-(--ink-fill) text-(--ink-on-fill) font-semibold shadow-xs border border-white/20 dark:border-white/10',
        'dark-pill':
          'bg-(--bg-sunken) text-(--text-primary) hover:bg-(--bg-card-hover) hover:text-white border border-black/10 dark:bg-white/[0.045] dark:border-white/[0.03] shadow-(--shadow-card) shadow-xs',
        rose:
          'bg-(--rose-tint) text-(--rose-tint-text) hover:bg-(--rose-tint-hover) border border-rose-200/60 dark:border-rose-500/15',
      },
      // Radius follows PADDING (the rounded standard), not the component name.
      // Every button used to be `radius-pill` (9999px), which turned a 24px
      // chip and a 48px CTA into the same lozenge. Now each size is a soft
      // rectangle sized to its own height, and `shape` is the explicit opt-in
      // for a real capsule.
      size: {
        xs: 'text-[11px] px-2.5 py-1 rounded-(--radius-xs) gap-1 h-6',
        sm: 'text-xs px-3.5 py-1.5 rounded-(--radius-sm) gap-1.5 h-8',
        md: 'text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-(--radius-control) gap-2 h-10',
        lg: 'text-base px-6 py-3 rounded-(--radius-md) gap-2.5 h-12',
        icon: 'w-10 h-10 rounded-(--radius-control) p-0 [&_svg]:size-4',
      },
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

// --- Button ---
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Button content. Icons route through `icon` for RTL-safe spacing. */
  children: ReactNode;
  /** Leading icon (lucide); sized to the current `size` ladder. */
  icon?: ReactNode;
  /** Shows a spinner and sets `disabled` while true. */
  loading?: boolean;
  /**
   * Visual intent. `primary` fills with the ink token and reads
   * `--text-on-fill`; `outline`/`secondary` ride `--border-strong` /
   * `--state-hover`; `link` is a text-level affordance. `white-pill` /
   * `dark-pill` are theme-contrast pills for hero CTA pairs; `rose` is
   * the soft destructive-affordance tint.
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'success'
    | 'white-pill'
    | 'dark-pill'
    | 'rose';
  /** Size ladder — heights are explicit (`h-6…h-12`) for density control. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  /** Corner geometry: `pill` (default, velvet), `rounded`, `square`. */
  shape?: 'pill' | 'rounded' | 'square';
  /** Stretch to container width (mobile-first CTA pattern). */
  fullWidth?: boolean;
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
  'rounded-(--radius-pill) inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-90 focus-visible:outline-none focus-ui99 disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-(--ink-fill) text-(--ink-on-fill) shadow-xs',
        white:
          'bg-white text-zinc-900 hover:bg-zinc-100 shadow-xs border border-black/[0.06] dark:bg-(--text-primary) dark:text-(--ink-on-fill) dark:hover:bg-white',
        secondary:
          'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-black/[0.05] dark:bg-(--bg-card-hover) dark:text-(--text-secondary) dark:hover:bg-(--bg-card-hover) dark:border-white/[0.06]',
        outline:
          'bg-transparent text-zinc-800 border border-black/[0.1] hover:bg-state-hover dark:text-(--text-secondary) dark:border-white/[0.08]',
        ghost:
          'bg-transparent text-zinc-600 hover:bg-state-hover hover:text-zinc-950 dark:text-(--text-secondary) dark:hover:text-(--text-primary)',
        link: 'bg-transparent hover:bg-transparent text-(--text-primary) hover:scale-100',
        destructive:
          'bg-(--intent-rose) text-(--intent-rose-on) hover:bg-(--intent-rose-hover) border border-rose-700/40 dark:border-rose-400/20 shadow-xs',
        rose:
          'bg-(--rose-tint) text-(--rose-tint-text) hover:bg-(--rose-tint-hover) border border-rose-200/60 dark:border-rose-500/15',
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
      'bg-zinc-100 text-zinc-700 border border-black/[0.06] dark:bg-white/[0.04] dark:text-(--text-secondary) dark:border-white/[0.06]',
    amber:
      'bg-amber-50 text-amber-800 border border-amber-300/40 font-medium dark:bg-amber-400/[0.08] dark:text-amber-300/90 dark:border-amber-400/20',
    purple:
      'bg-purple-50 text-purple-800 border border-purple-300/40 font-medium dark:bg-purple-400/[0.08] dark:text-purple-300/90 dark:border-purple-400/20',
    green:
      'bg-emerald-50 text-emerald-800 border border-emerald-300/40 font-medium dark:bg-emerald-400/[0.08] dark:text-emerald-300/90 dark:border-emerald-400/20',
    red:
      'bg-rose-50 text-rose-800 border border-rose-300/40 font-medium dark:bg-rose-400/[0.08] dark:text-rose-300/90 dark:border-rose-400/20',
    rose:
      'bg-stone-100 text-stone-800 border border-stone-200 font-medium dark:bg-white/[0.05] dark:text-(--text-secondary) dark:border-white/[0.07]',
    blue:
      'bg-blue-50 text-blue-800 border border-blue-300/40 font-medium dark:bg-blue-400/[0.08] dark:text-blue-300/90 dark:border-blue-400/20',
    outline:
      'bg-transparent text-zinc-700 border border-black/[0.12] dark:text-(--text-secondary) dark:border-white/[0.12]',
    solid:
      'bg-zinc-900 text-white border border-zinc-900 dark:bg-(--text-primary) dark:text-(--text-on-fill) dark:border-(--text-primary)',
  }[effectiveVariant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-(--radius-pill) tracking-tight whitespace-nowrap ${sizeStyle} ${variantStyle} ${className}`}
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
  alt?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline';
  className?: string;
}

export function Avatar({
  name = 'UI99',
  alt,
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

  const displayName = alt || name;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={displayName}
          className={`rounded-(--radius-pill) object-cover ring-1 ring-black/[0.06] dark:ring-white/10 ${sizeStyle} ${className}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`rounded-(--radius-pill) bg-zinc-200 text-zinc-800 dark:bg-(--bg-card-hover) dark:text-(--text-secondary) flex items-center justify-center font-medium ring-1 ring-black/[0.06] dark:ring-white/10 ${sizeStyle} ${className}`}
        >
          {initial}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-(--radius-pill) ring-2 ring-white dark:ring-(--bg-sunken) ${
            status === 'online' ? 'bg-emerald-400' : 'bg-zinc-400 dark:bg-zinc-500'
          } ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
        />
      )}
    </div>
  );
}
