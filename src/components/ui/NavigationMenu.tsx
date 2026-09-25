/**
 * UI99 — NavigationMenu (Wave E)
 * Radix navigation-menu: site-level nav with rich panels (shadcn docs-style),
 * glass popover surface, viewport-managed transitions.
 */

import React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cn } from '../../lib/utils';

export function NavigationMenu({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn('relative z-content flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    />
  );
}
NavigationMenu.displayName = 'NavigationMenu';

export function NavigationMenuList({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn('flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  );
}
NavigationMenuList.displayName = 'NavigationMenuList';

export function NavigationMenuItem({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item className={cn('relative', className)} {...props} />;
}
NavigationMenuItem.displayName = 'NavigationMenuItem';

export function NavigationMenuTrigger({
  className = '',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1 rounded-(--radius-pill) px-3 type-caption font-medium transition-colors cursor-pointer',
        'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04] dark:text-(--text-secondary) dark:hover:text-(--text-primary) dark:hover:bg-white/[0.04]',
        'focus-visible:outline-none focus-ui99 data-[state=open]:bg-black/[0.05] dark:data-[state=open]:bg-white/[0.06]',
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export function NavigationMenuLink({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        'inline-flex h-9 items-center rounded-(--radius-pill) px-3 type-caption font-medium transition-colors',
        'text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.04] dark:text-(--text-secondary) dark:hover:text-(--text-primary) dark:hover:bg-white/[0.04]',
        'focus-visible:outline-none focus-ui99',
        className
      )}
      {...props}
    />
  );
}
NavigationMenuLink.displayName = 'NavigationMenuLink';

export function NavigationMenuContent({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        'left-0 top-0 w-full rounded-(--radius-lg) border border-(--border-subtle) bg-white/95 dark:bg-(--bg-elevated)/95 backdrop-blur-2xl p-4 shadow-(--elevation-3) data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
        className
      )}
      {...props}
    />
  );
}
NavigationMenuContent.displayName = 'NavigationMenuContent';

export function NavigationMenuViewport({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn('absolute left-0 top-full flex justify-center')}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          'relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-(--radius-lg) border border-(--border-subtle) bg-white/95 dark:bg-(--bg-elevated)/95 backdrop-blur-2xl shadow-(--elevation-3) origin-top-center',
          'data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90',
          className
        )}
        {...props}
      />
    </div>
  );
}
NavigationMenuViewport.displayName = 'NavigationMenuViewport';
