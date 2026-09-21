import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center p-1 rounded-2xl bg-zinc-100/90 dark:bg-[#121217] text-zinc-600 dark:text-[#92929B] border border-black/[0.04] dark:border-white/[0.04]',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer select-none outline-none focus-safa-inset',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs',
      'dark:data-[state=active]:bg-[#1D1D24] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-3 focus-visible:outline-none focus-safa-inset',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
