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
import { radiusClassForPadding } from '../../lib/utils';
import type { RadiusRung, SurfacePaddingStep } from '../../lib/utils';

export type SurfaceVariant =
  | 'surface'            // Primary container surface (--bg-surface / white)
  | 'surfaceSecondary'   // Secondary container surface (--bg-card / --bg-sunken)
  | 'elevated'           // Elevated interactive surface (--bg-elevated / white)
  | 'glass'              // Translucent liquid glass with blur
  | 'compact'            // Ultra-compact quiet list container
  | 'flat'               // Clean minimal container without shadow
  | 'outline';           // Pure hairline container

export type SurfacePadding = SurfacePaddingStep;
export type SurfaceRadius = RadiusRung;

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  /**
   * Escape hatch. Leave it undefined and the corner is DERIVED from `padding`
   * via the rounded standard — that is the correct 99% of the time, because
   * `outer radius = inner radius + padding` is what keeps nesting concentric.
   * Set it only for a genuine shape decision (a pill-shaped card, a card that
   * must match a fixed-height parent), never to "make it look nicer".
   */
  rounded?: SurfaceRadius;
  hoverable?: boolean;
  interactive?: boolean;
}

export function Surface({
  children,
  variant = 'surface',
  rounded,
  padding = 'md',
  hoverable = false,
  interactive = false,
  className = '',
  ...props
}: SurfaceProps) {
  // The rounded standard: the corner is a function of the padding, not of the
  // component's name or its width. `md` padding lands on the `md` rung, `lg` on
  // `lg`, so a card inside a card inside a sheet reads as concentric for free.
  const roundClass = rounded
    ? `rounded-(--radius-${rounded})`
    : radiusClassForPadding(padding);

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
      'bg-(--bg-card) border border-(--border-subtle) shadow-(--shadow-card)',
    surfaceSecondary:
      'bg-(--bg-sunken) dark:bg-(--bg-surface) border border-(--border-hairline) shadow-(--shadow-card)',
    elevated:
      'bg-(--bg-elevated) border border-(--border-hairline) shadow-(--shadow-card-hover)',
    glass:
      'bg-white/80 dark:bg-(--bg-card)/60 backdrop-blur-2xl border border-(--border-hairline) shadow-(--shadow-card-hover)',
    compact:
      'bg-white/90 dark:bg-(--bg-surface) border border-(--border-hairline) shadow-(--elevation-1)',
    flat:
      'bg-(--bg-wash) dark:bg-(--bg-surface)/80 border-transparent',
    outline:
      'bg-transparent border border-black/[0.08] dark:border-white/[0.035]',
  }[variant];

  const hoverStyle =
    hoverable || interactive
      ? 'transition-all dur-base hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover) cursor-pointer active:scale-[0.99]'
      : '';

  return (
    <div
      className={`relative ${roundClass} ${padMap} ${variantMap} ${hoverStyle} ${className}`}
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
  return <h3 className={`type-body-lg font-semibold tracking-tight text-zinc-950 dark:text-white ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`type-caption text-(--text-muted) dark:text-zinc-400 ${className}`} {...props} />;
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
    <Surface variant="glass" padding="md" className={className} {...props}>
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
    <Surface variant="elevated" padding="md" className={className} {...props}>
      {children}
    </Surface>
  );
}
