/**
 * UI99 — Sidebar primitives (Wave E)
 * Collapse/expand rail state (context + keyboard toggle), collapsible groups
 * with CSS grid animation, tooltip-on-rail via data-collapsed. Layout-agnostic:
 * hosts own the shell markup, we own the behavior + styling.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { useIsDark } from './theme';

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children, defaultCollapsed = false }: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggle = useCallback(() => setCollapsed((v) => !v), []);
  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

export interface SidebarProps extends React.ComponentProps<'aside'> {
  width?: number;
  collapsedWidth?: number;
}

export function Sidebar({
  width = 240,
  collapsedWidth = 64,
  className = '',
  children,
  ...props
}: SidebarProps) {
  const { collapsed } = useSidebar();
  const isDark = useIsDark();
  return (
    <aside
      data-collapsed={collapsed}
      style={{ width: collapsed ? collapsedWidth : width }}
      className={cn(
        'relative flex h-full shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200',
        isDark
          ? 'border-white/[0.03] bg-(--bg-card)'
          : 'border-black/[0.04] bg-white',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
Sidebar.displayName = 'Sidebar';

export function SidebarHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex h-14 shrink-0 items-center px-3', className)} {...props} />;
}
SidebarHeader.displayName = 'SidebarHeader';

export function SidebarBody({ className = '', ...props }: React.ComponentProps<'nav'>) {
  return <nav className={cn('flex-1 space-y-1 overflow-y-auto px-3 py-2', className)} {...props} />;
}
SidebarBody.displayName = 'SidebarBody';

export function SidebarFooter({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('shrink-0 border-t border-(--border-hairline) p-3', className)} {...props} />;
}
SidebarFooter.displayName = 'SidebarFooter';

export interface SidebarItemProps extends React.ComponentProps<'a'> {
  icon?: React.ReactNode;
  isActive?: boolean;
  label: string;
}

export function SidebarItem({ icon, isActive, label, className = '', ...props }: SidebarItemProps) {
  const { collapsed } = useSidebar();
  return (
    <a
      title={collapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive}
      className={cn(
        'group flex min-h-[44px] items-center gap-2.5 rounded-xl px-2.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-ui99-inset',
        isActive
          ? 'bg-black/[0.05] text-zinc-950 dark:bg-white/[0.05] dark:text-white shadow-(var(--rim-soft))'
          : 'text-zinc-600 hover:bg-black/[0.03] hover:text-zinc-950 dark:text-(--text-secondary) dark:hover:bg-white/[0.03] dark:hover:text-(--text-primary)',
        collapsed && 'justify-center px-0',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&_svg]:size-4">{icon}</span>}
      {!collapsed && <span className="truncate">{label}</span>}
    </a>
  );
}
SidebarItem.displayName = 'SidebarItem';
