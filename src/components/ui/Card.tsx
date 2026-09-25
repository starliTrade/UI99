/**
 * UI99 — Obsidian Liquid Glass (SOLG) Reusable Surfaces & Card Primitives (Build 02.2)
 * Authentic layered materials: Canvas -> Surface -> Elevated -> Liquid Glass
 * Dual-theme (Obsidian Dark / Porcelain Light) responsive.
 *
 * @token Surface ladder: canvas → `--bg-surface` → `--bg-card` →
 *   `--bg-elevated`; elevation steps add the deep-diffusion shadow profile
 *   (18px/40px −10px) and the specular top rim (`--border-specular`).
 *   Hover elevation lifts to `--bg-card-hover`.
 */

import React, { ReactNode, HTMLAttributes } from 'react';

export type SurfaceVariant =
  | 'surface'            // Primary container surface (--bg-surface / white)
  | 'surfaceSecondary'   // Secondary container surface (--bg-card / --bg-sunken)
  | 'elevated'           // Elevated interactive surface (--bg-elevated / white)
  | 'glass'              // Translucent liquid glass with blur
  | 'compact'            // Ultra-compact quiet list container
  | 'flat'               // Clean minimal container without shadow
  | 'outline';           // Pure hairline container

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: SurfaceVariant;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  interactive?: boolean;
}

export function Surface({
  children,
  variant = 'surface',
  rounded = '2xl',
  padding = 'md',
  hoverable = false,
  interactive = false,
  className = '',
  ...props
}: SurfaceProps) {
  // Monotonic scale — each step must be visibly larger than the last, or the
  // size prop lies. Material's rule: a container's radius is driven by its
  // padding, so bigger surfaces get bigger corners, never the same one twice.
  const roundMap = {
    sm: 'rounded-(var(--radius-sm))',
    md: 'rounded-(var(--radius-field))',
    lg: 'rounded-(var(--radius-control))',
    xl: 'rounded-(var(--radius-lg))',
    '2xl': 'rounded-(var(--radius-xl))',
    '3xl': 'rounded-(var(--radius-sheet))',
    full: 'rounded-(var(--radius-pill))',
  }[rounded];

  const padMap = {
    none: 'p-0',
    xs: 'p-2 sm:p-2.5',
    sm: 'p-3 sm:p-3.5',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
    xl: 'p-6 sm:p-8',
  }[padding];

  const variantMap = {
    surface:
      'bg-(--bg-card) border border-black/[0.045] dark:border-white/[0.025] shadow-(var(--elevation-1)) dark:shadow-(var(--rim-soft), var(--elevation-3))',
    surfaceSecondary:
      'bg-(--bg-sunken) dark:bg-(--bg-surface) border border-black/[0.035] dark:border-white/[0.02] shadow-(var(--rim-strong)) dark:shadow-(var(--rim-soft), var(--elevation-1))',
    elevated:
      'bg-(--bg-elevated) border border-(--border-hairline) shadow-(var(--elevation-2)) dark:shadow-(var(--rim-soft), var(--elevation-3))',
    glass:
      'bg-white/80 dark:bg-(--bg-card)/60 backdrop-blur-2xl border border-(--border-hairline) shadow-(var(--elevation-2)) dark:shadow-(var(--rim-soft), var(--elevation-3))',
    compact:
      'bg-white/90 dark:bg-(--bg-surface) border border-black/[0.03] dark:border-white/[0.02] shadow-xs',
    flat:
      'bg-zinc-100/80 dark:bg-(--bg-surface)/80 border-transparent',
    outline:
      'bg-transparent border border-black/[0.08] dark:border-white/[0.035]',
  }[variant];

  const hoverStyle =
    hoverable || interactive
      ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-(var(--elevation-3)) cursor-pointer active:scale-[0.99]'
      : '';

  return (
    <div
      className={`relative ${roundMap} ${padMap} ${variantMap} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Backward-compatible alias
export const Card = Surface;

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 pb-3 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-base font-semibold tracking-tight text-zinc-950 dark:text-white ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs text-zinc-500 dark:text-zinc-400 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`py-1.5 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-center pt-3 border-t border-(--border-hairline) ${className}`} {...props} />;
}

export function GlassSurface({
  children,
  className = '',
  ...props
}: SurfaceProps) {
  return (
    <Surface variant="glass" rounded="2xl" padding="md" className={className} {...props}>
      {children}
    </Surface>
  );
}

export const GlassCard = GlassSurface;

export function ElevatedSurface({
  children,
  className = '',
  ...props
}: SurfaceProps) {
  return (
    <Surface variant="elevated" rounded="2xl" padding="md" className={className} {...props}>
      {children}
    </Surface>
  );
}
