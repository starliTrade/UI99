/**
 * UI99 — Pagination (Wave B)
 * Composable pagination with aria-current, 44px touch targets, and the kit
 * icon-button visual. RTL-safe via logical flex ordering.
 */

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './Button';

export function Pagination({ className = '', ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    />
  );
}
Pagination.displayName = 'Pagination';

export function PaginationContent({ className = '', ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex items-center gap-1', className)} {...props} />;
}
PaginationContent.displayName = 'PaginationContent';

export function PaginationItem({ className = '', ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('list-none', className)} {...props} />;
}
PaginationItem.displayName = 'PaginationItem';

interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'icon';
  disabled?: boolean;
}

export function PaginationLink({
  className,
  isActive = false,
  size = 'icon',
  disabled,
  'aria-current': ariaCurrent,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : ariaCurrent}
      aria-disabled={disabled || undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'secondary' : 'ghost',
          size: size === 'icon' ? 'icon' : size,
        }),
        'min-h-[44px] min-w-[44px] pointer-events-none',
        disabled && 'opacity-40',
        className
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = 'PaginationLink';

export function PaginationPrevious({ className = '', ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Previous page" size="md" className={cn('gap-1 pl-2.5', className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Prev</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = 'PaginationPrevious';

export function PaginationNext({ className = '', ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Next page" size="md" className={cn('gap-1 pr-2.5', className)} {...props}>
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}
PaginationNext.displayName = 'PaginationNext';

export function PaginationEllipsis({ className = '', ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center text-zinc-400', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
    </span>
  );
}
PaginationEllipsis.displayName = 'PaginationEllipsis';
