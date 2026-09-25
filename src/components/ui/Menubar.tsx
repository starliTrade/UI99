/**
 * UI99 — Menubar (Wave E)
 * Horizontal menu bar (Radix): app-style nested menus with full keyboard
 * navigation, styled to the kit's velvet popover language.
 */

import React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

const menuContentClass =
  'z-50 min-w-[12rem] overflow-hidden rounded-(var(--radius-control)) border border-black/[0.06] dark:border-white/[0.05] bg-white/95 dark:bg-(--bg-elevated)/95 backdrop-blur-2xl p-1.5 text-(--text-primary) shadow-(var(--elevation-3)) dark:shadow-(var(--elevation-3)) data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';

const menuItemClass =
  'relative flex cursor-pointer select-none items-center gap-2 rounded-(var(--radius-sm)) px-2 py-1.5 text-xs outline-none transition-colors focus:bg-black/[0.05] focus:text-zinc-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 dark:focus:bg-white/[0.06] dark:focus:text-white [&_svg]:size-3.5 [&_svg]:shrink-0';

export function Menubar({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-(var(--radius-field)) bg-(--bg-sunken) border border-(--border-hairline) p-1',
        className
      )}
      {...props}
    />
  );
}
Menubar.displayName = 'Menubar';

export function MenubarMenu(props: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />;
}
MenubarMenu.displayName = 'MenubarMenu';

export function MenubarTrigger({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        'flex cursor-pointer select-none items-center rounded-(var(--radius-sm)) px-2.5 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:outline-none focus-ui99-inset data-[state=open]:bg-white data-[state=open]:shadow-xs dark:data-[state=open]:bg-(--bg-elevated)',
        className
      )}
      {...props}
    />
  );
}
MenubarTrigger.displayName = 'MenubarTrigger';

export function MenubarContent({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content className={cn(menuContentClass, className)} {...props} />
    </MenubarPrimitive.Portal>
  );
}
MenubarContent.displayName = 'MenubarContent';

export function MenubarItem({
  className = '',
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Item
      className={cn(menuItemClass, inset && 'pl-8', className)}
      {...props}
    />
  );
}
MenubarItem.displayName = 'MenubarItem';

export function MenubarCheckboxItem({
  className = '',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem className={cn(menuItemClass, 'pl-8', className)} {...props}>
      <MenubarPrimitive.ItemIndicator>
        <Check className="absolute left-2" />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export function MenubarRadioItem({
  className = '',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem className={cn(menuItemClass, 'pl-8', className)} {...props}>
      <MenubarPrimitive.ItemIndicator>
        <Circle className="absolute left-2 h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}
MenubarRadioItem.displayName = 'MenubarRadioItem';

export function MenubarLabel({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>) {
  return (
    <MenubarPrimitive.Label
      className={cn('px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400', className)}
      {...props}
    />
  );
}
MenubarLabel.displayName = 'MenubarLabel';

export function MenubarSeparator({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-black/[0.06] dark:bg-white/[0.06]', className)}
      {...props}
    />
  );
}
MenubarSeparator.displayName = 'MenubarSeparator';

export function MenubarSub(props: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub {...props} />;
}
MenubarSub.displayName = 'MenubarSub';

export function MenubarSubTrigger({
  className = '',
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(menuItemClass, 'data-[state=open]:bg-black/[0.05] dark:data-[state=open]:bg-white/[0.06]', className)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  );
}
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export function MenubarSubContent({
  className = '',
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent className={cn(menuContentClass, className)} {...props} />
    </MenubarPrimitive.Portal>
  );
}
MenubarSubContent.displayName = 'MenubarSubContent';

export function MenubarShortcut({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('ml-auto text-[10px] font-mono tracking-widest text-zinc-400', className)}
      {...props}
    />
  );
}
MenubarShortcut.displayName = 'MenubarShortcut';
