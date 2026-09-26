/**
 * UI99 — Unified Velvet Modal & Mobile BottomSheet (Build 02.2)
 * Seamless dark depth on --bg-elevated, micro-hairlines, soft diffusion shadows,
 * backed by Radix UI Dialog primitives for full WAI-ARIA focus management & keyboard interaction.
  * @token Backdrop is canvas-black at 70% + blur(8px); dialog resolves `--bg-elevated` and the specular top rim.
*/

import React, { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { IconButton } from './Button';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  showClose = true,
}: ModalProps) {
  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-overlay bg-black/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <div className="fixed inset-0 z-modal flex items-end sm:items-center justify-center sm:p-4 overflow-hidden pointer-events-none">
          <DialogPrimitive.Content
            className={cn(
              'pointer-events-auto relative w-full bg-white dark:bg-(--bg-elevated) text-(--text-primary)',
              'border border-black/[0.08] dark:border-white/[0.06]',
              'shadow-(--elevation-4) shadow-(--shadow-popover)',
              // Mobile: a bottom sheet, so only the top corners are rounded —
              // `lg` reads as a sheet rising off the screen edge. At sm+ it
              // becomes a centred dialog, which takes the `2xl` rung. The old
              // hard-coded 28px here was an untokenised one-off.
              'rounded-t-(--radius-lg) sm:rounded-(--radius-2xl) overflow-hidden max-h-[92vh] flex flex-col z-content pb-safe outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95',
              maxWClass
            )}
          >
            {/* Tactile Sheet Drag Handle for Mobile */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab">
              <div className="w-10 h-1 rounded-(--radius-pill) bg-(--bg-raised) dark:bg-white/15" />
            </div>

            {/* Header */}
            {(title || showClose) && (
              <div className="px-5 sm:px-6 pt-3 sm:pt-4 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.05] flex items-center justify-between shrink-0">
                <div>
                  {title && (
                    <DialogPrimitive.Title className="type-body-lg sm:type-title font-bold tracking-tight text-(--text-primary)">
                      {title}
                    </DialogPrimitive.Title>
                  )}
                  {subtitle && (
                    <DialogPrimitive.Description className="type-caption text-(--text-secondary) mt-0.5">
                      {subtitle}
                    </DialogPrimitive.Description>
                  )}
                </div>
                {showClose && (
                  <IconButton
                    icon={<X className="icon-md" />}
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    label="Close dialog"
                  />
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar flex-1">
              {children}
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
