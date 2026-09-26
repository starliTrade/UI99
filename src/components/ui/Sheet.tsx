/**
 * UI99 — Sheet
 *
 * ANATOMY   Sheet ▸ overlay ▸ [SheetContent] ▸ grabber ▸ [SheetTitle] ▸ close
 * STATES    default · open · focus-visible (focus-ui99) · disabled
 * TOKENS    --bg-elevated, --shadow-modal, --radius-sheet, --z-modal
 * A11Y      Radix Dialog with the same trap/restore contract as Dialog; on
 *            mobile the sheet is the primary surface, so the title is required.
 * KEYBOARD  Escape closes · Tab cycles within · drag handle is decorative and
 *            aria-hidden (the close button is the keyboard path).
 * LAYER     --z-modal, above --z-header by design (docs §3.3).
 */

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-overlay bg-black/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-modal gap-4 bg-white dark:bg-(--bg-elevated) text-(--text-primary) p-6 shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:dur-base data-[state=open]:dur-slow',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-black/[0.08] dark:border-white/[0.06] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top rounded-b-(--radius-lg)',
        bottom:
          'inset-x-0 bottom-0 border-t border-black/[0.08] dark:border-white/[0.06] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-(--radius-lg) max-h-[92vh] overflow-y-auto pb-safe',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-black/[0.08] dark:border-white/[0.06] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm rounded-r-(--radius-lg)',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-black/[0.08] dark:border-white/[0.06] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm rounded-l-(--radius-lg)',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showClose?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, showClose = true, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {side === 'bottom' && (
        <div className="sm:hidden -mt-3 mb-3 flex justify-center cursor-grab">
          <div className="w-10 h-1 rounded-(--radius-pill) bg-(--bg-raised) dark:bg-white/15" />
        </div>
      )}
      {children}
      {showClose && (
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-(--radius-pill) p-1.5 opacity-70 transition-opacity hover:opacity-100 hover:bg-(--state-hover) focus-visible:outline-none focus-ui99 cursor-pointer">
          <X className="icon-md" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1 text-center sm:text-left rtl:sm:text-right',
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-auto',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'type-body-lg font-bold tracking-tight text-(--text-primary)',
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('type-caption text-(--text-secondary)', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
