/**
 * UI99 — Tactile Velvet Accordion Component (Build 02.2)
 * Dual-theme (Obsidian Dark / Porcelain Light) with Radix UI WAI-ARIA keyboard navigation and smooth height animation.
 */

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsDark } from './theme';

export interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const isDark = useIsDark();

  if (allowMultiple) {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultOpenId ? [defaultOpenId] : undefined}
        className={cn(
          'rounded-(--radius-control) border divide-y overflow-hidden transition-colors',
          isDark
            ? 'bg-(--bg-elevated) border-white/[0.04] divide-white/[0.04]'
            : 'bg-white border-black/[0.06] divide-black/[0.06]',
          className
        )}
      >
        {items.map((item) => (
          <AccordionPrimitive.Item
            key={item.id}
            value={item.id}
            className="border-b last:border-b-0 border-inherit"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className={cn(
                  'w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left rtl:text-right transition-colors cursor-pointer select-none outline-none focus-ui99-inset',
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]',
                  '[&[data-state=open]>div>svg]:rotate-180'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.icon && (
                    <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h4
                      className={cn(
                        'type-caption sm:type-body font-semibold tracking-tight truncate',
                        isDark ? 'text-(--text-primary)' : 'text-zinc-900'
                      )}
                    >
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="type-micro text-(--text-muted) truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-(--text-secondary)">
                  <ChevronDown className="icon-md transition-transform dur-base" />
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            <AccordionPrimitive.Content
              className={cn(
                'overflow-hidden type-caption sm:type-body transition-all',
                'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
              )}
            >
              <div
                className={cn(
                  'px-4 pb-4 pt-1 leading-relaxed',
                  isDark ? 'text-(--text-secondary)' : 'text-zinc-600'
                )}
              >
                {item.children}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="single"
      defaultValue={defaultOpenId}
      collapsible
      className={cn(
        'rounded-(--radius-control) border divide-y overflow-hidden transition-colors',
        isDark
          ? 'bg-(--bg-elevated) border-white/[0.04] divide-white/[0.04]'
          : 'bg-white border-black/[0.06] divide-black/[0.06]',
        className
      )}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="border-b last:border-b-0 border-inherit"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                'w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left rtl:text-right transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50',
                isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]',
                '[&[data-state=open]>div>svg]:rotate-180'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                    {item.icon}
                  </span>
                )}
                <div className="min-w-0">
                  <h4
                    className={cn(
                      'type-caption sm:type-body font-semibold tracking-tight truncate',
                      isDark ? 'text-(--text-primary)' : 'text-zinc-900'
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="type-micro text-(--text-muted) truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-(--text-secondary)">
                <ChevronDown className="icon-md transition-transform dur-base" />
              </div>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content
            className={cn(
              'overflow-hidden type-caption sm:type-body transition-all',
              'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
            )}
          >
            <div
              className={cn(
                'px-4 pb-4 pt-1 leading-relaxed',
                isDark ? 'text-(--text-secondary)' : 'text-zinc-600'
              )}
            >
              {item.children}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
