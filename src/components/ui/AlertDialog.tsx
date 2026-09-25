/**
 * UI99 — AlertDialog (Wave B)
 * Radix alert-dialog: interruptive confirmation with destructive CTA.
 * Cannot be dismissed by overlay click — by design (WCAG-protected flow).
 */

import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { buttonVariants } from './Button';

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function AlertDialog({
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root {...props} />;
}
AlertDialog.displayName = 'AlertDialog';

export function AlertDialogTrigger({
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger {...props} />;
}
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export function AlertDialogPortal({
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal {...props} />;
}
AlertDialogPortal.displayName = 'AlertDialogPortal';

export function AlertDialogOverlay({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/40 backdrop-blur-(--blur-sm)',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  );
}
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export function AlertDialogContent({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-(--radius-lg) border border-white/[0.03] bg-(--bg-elevated) p-6 shadow-(--elevation-4) focus:outline-none',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}
AlertDialogContent.displayName = 'AlertDialogContent';

export function AlertDialogHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />;
}
AlertDialogHeader.displayName = 'AlertDialogHeader';

export function AlertDialogFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4', className)}
      {...props}
    />
  );
}
AlertDialogFooter.displayName = 'AlertDialogFooter';

export function AlertDialogTitle({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn('text-base font-bold tracking-tight text-zinc-950 dark:text-white', className)}
      {...props}
    />
  );
}
AlertDialogTitle.displayName = 'AlertDialogTitle';

export function AlertDialogDescription({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-xs leading-relaxed text-(--text-secondary)', className)}
      {...props}
    />
  );
}
AlertDialogDescription.displayName = 'AlertDialogDescription';

export function AlertDialogAction({
  className = '',
  variant = 'primary',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonVariantProps, 'variant'>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant, size: 'md' }), 'min-h-[44px]', className)}
      {...props}
    />
  );
}
AlertDialogAction.displayName = 'AlertDialogAction';

export function AlertDialogCancel({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'min-h-[44px]', className)}
      {...props}
    />
  );
}
AlertDialogCancel.displayName = 'AlertDialogCancel';
