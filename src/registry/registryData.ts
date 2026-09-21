/**
 * UI \ [99] — Official Registry & Documentation Schema
 * Modeled after shadcn/ui registry specification.
 */

export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentRegistryItem {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'Actions' | 'Forms' | 'Layout' | 'Feedback' | 'Workflows' | 'Brand';
  version: string;
  primitive?: string;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  cliCommand: string;
  usageSnippet: string;
  codeSnippet: string;
  props: ComponentPropDoc[];
  features: string[];
}

export const REGISTRY_COMPONENTS: ComponentRegistryItem[] = [
  {
    id: 'button',
    name: 'button',
    title: 'Button',
    description: 'Displays a button or component that looks like a button with Obsidian velvet depth, specular rim highlight, and responsive spring physics.',
    category: 'Actions',
    version: '1.0.0',
    primitive: 'Native button / Radix Slot',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    cliCommand: 'npx @99/ui add button',
    features: [
      '5 visual variants (primary, secondary, outline, ghost, rose)',
      '4 responsive size tiers (xs, sm, md, lg)',
      'Sub-pixel specular top rim highlight (inset 0 1px 0 0 rgba(255,255,255,0.05))',
      'Tactile active press feedback (active:scale-[0.98])',
      'Built-in loading spinner and icon placement',
      'Accessible WCAG AAA contrast ratio',
    ],
    usageSnippet: `import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary">Create Project</Button>
      <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>
        Add Task
      </Button>
      <Button variant="outline" size="sm">Cancel</Button>
    </div>
  )
}`,
    codeSnippet: `import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'rose';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 active:scale-[0.98] select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

    const sizeStyles = {
      xs: 'text-xs px-2.5 py-1 gap-1.5 min-h-[28px]',
      sm: 'text-xs px-3.5 py-1.5 gap-2 min-h-[34px]',
      md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
      lg: 'text-base px-6 py-2.5 gap-2.5 min-h-[48px]',
    };

    const variantStyles = {
      primary:
        'bg-zinc-950 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_14px_rgba(255,255,255,0.12)]',
      secondary:
        'bg-zinc-100 text-zinc-900 dark:bg-white/[0.045] dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-black/[0.05] dark:border-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
      outline:
        'bg-transparent text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-white/[0.08] hover:bg-zinc-50 dark:hover:bg-white/[0.03]',
      ghost:
        'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.04]',
      rose:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={\`\${baseStyles} \${sizeStyles[size]} \${variantStyles[variant]} \${className}\`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';`,
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'rose'", default: "'primary'", description: 'Visual aesthetic and hierarchy of the button.' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls padding, typography size, and minimum touch target.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Displays an animated spinner and disables user interaction.' },
      { name: 'icon', type: 'ReactNode', default: 'undefined', description: 'Leading icon element inside the button container.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Toggles inert disabled state with muted opacity.' },
    ],
  },
  {
    id: 'badge',
    name: 'badge',
    title: 'Badge & Status',
    description: 'Ultra-refined semantic status indicators, Linear issue priorities, and metadata tag capsules.',
    category: 'Feedback',
    version: '1.0.0',
    primitive: 'Custom Semantic Tags',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx @99/ui add badge',
    features: [
      'IssueStatus: backlog, todo, in_progress, review, done, canceled',
      'PriorityLevel: urgent, high, medium, low, none',
      'Optional textual status label and micro icon indicator',
      'WCAG compliant contrast ratios',
    ],
    usageSnippet: `import { StatusBadge, PriorityBadge, Badge } from "@/components/ui/badge"

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <StatusBadge status="in_progress" showLabel={true} />
      <PriorityBadge priority="urgent" showLabel={true} />
      <Badge variant="green">Operational</Badge>
    </div>
  )
}`,
    codeSnippet: `import React from 'react';
import { Circle, Clock, CheckCircle2, XCircle, AlertCircle, SignalHigh, SignalMedium, SignalLow, MinusCircle } from 'lucide-react';

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'canceled';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export function StatusBadge({ status, showLabel = true }: { status: IssueStatus; showLabel?: boolean }) {
  const configs = {
    backlog: { label: 'Backlog', icon: Circle, color: 'text-zinc-400 bg-zinc-400/10' },
    todo: { label: 'Todo', icon: Circle, color: 'text-amber-500 bg-amber-500/10' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
    review: { label: 'Review', icon: AlertCircle, color: 'text-purple-500 bg-purple-500/10' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    canceled: { label: 'Canceled', icon: XCircle, color: 'text-zinc-500 bg-zinc-500/10' },
  };
  const c = configs[status] || configs.todo;
  const Icon = c.icon;
  return (
    <span className={\`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium \${c.color}\`}>
      <Icon className="w-3.5 h-3.5" />
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}`,
    props: [
      { name: 'status', type: "'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'canceled'", default: 'required', description: 'The lifecycle state of the work item.' },
      { name: 'priority', type: "'urgent' | 'high' | 'medium' | 'low' | 'none'", default: 'required', description: 'Urgency tier corresponding to Linear signals.' },
      { name: 'showLabel', type: 'boolean', default: 'true', description: 'Renders the descriptive text alongside the icon.' },
    ],
  },
  {
    id: 'card',
    name: 'card',
    title: 'Card',
    description: 'Velvet obsidian container with sub-pixel top rim specular highlight, mathematical nested radii, and diffuse shadow elevation.',
    category: 'Layout',
    version: '1.0.0',
    primitive: 'HTMLDivElement',
    dependencies: ['clsx', 'tailwind-merge'],
    cliCommand: 'npx @99/ui add card',
    features: [
      'Deep velvet Obsidian dark base (#0B0C11)',
      'Sub-pixel specular rim highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
      'Zero-slop: No cards inside cards, no hairline clutter',
      'CardHeader, CardTitle, CardDescription, CardContent, CardFooter primitives',
    ],
    usageSnippet: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Performance</CardTitle>
        <CardDescription>Obsidian velvet depth with sub-pixel specular highlight.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400">All services operating within latency bounds.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View Metrics</Button>
      </CardFooter>
    </Card>
  )
}`,
    codeSnippet: `import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.04] dark:border-white/[0.025]',
        'shadow-[0_16px_40px_-10px_rgba(0,0,0,0.65)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_18px_40px_-10px_rgba(0,0,0,0.65)]',
        'p-6 transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold tracking-tight text-zinc-900 dark:text-white', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('py-2', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center pt-4 border-t border-black/[0.04] dark:border-white/[0.03]', className)} {...props} />;
}`,
    props: [
      { name: 'className', type: 'string', default: "''", description: 'Tailwind utility overrides.' },
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Content nested within the card container.' },
    ],
  },
  {
    id: 'dropdown-menu',
    name: 'dropdown-menu',
    title: 'Dropdown Menu',
    description: 'Displays a menu to the user—such as a set of actions or functions—triggered by a button, powered by Radix Primitives.',
    category: 'Actions',
    version: '1.0.0',
    primitive: '@radix-ui/react-dropdown-menu',
    dependencies: ['@radix-ui/react-dropdown-menu', 'lucide-react', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx @99/ui add dropdown-menu',
    features: [
      'Radix UI accessible keyboard navigation (Arrow Up / Down, Enter, Esc)',
      'Sub-menu support and radio/checkbox item selection',
      'Floating velvet obsidian portal with backdrop blur',
      'Keyboard shortcut indicators (<Kbd />)',
    ],
    usageSnippet: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
    codeSnippet: `import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-black/[0.05] dark:border-white/[0.04]',
        'bg-white/95 dark:bg-[#131318]/95 backdrop-blur-xl p-1 text-zinc-950 dark:text-[#EDEDEF]',
        'shadow-[0_16px_36px_-8px_rgba(0,0,0,0.5)] animate-in fade-in-80',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;`,
    props: [
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Horizontal alignment relative to trigger button.' },
      { name: 'sideOffset', type: 'number', default: '4', description: 'Distance in pixels between trigger and floating content.' },
    ],
  },
  {
    id: 'linear-issue-tracker',
    name: 'linear-issue-tracker',
    title: 'Linear Issue Tracker',
    description: 'High-velocity Linear workflow engine featuring J/K keyboard navigation, inline C hotkey composer, multi-selection batch bar, and row popovers.',
    category: 'Workflows',
    version: '1.0.0',
    primitive: 'Complex Compound Engine',
    dependencies: ['motion', 'lucide-react', '@radix-ui/react-dropdown-menu', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx @99/ui add linear-issue-tracker',
    features: [
      'J / K / Arrow Up / Arrow Down keyboard cursor selection with green active ring',
      'C hotkey for instant inline issue composition with CMD+Enter save',
      'Space hotkey to toggle completion, X to toggle batch multi-select',
      'Interactive Radix DropdownMenu on every row to change Status and Priority on the fly',
      'Floating Liquid Glass Batch Action Bar with batch mark done, batch priority, and batch delete',
      'Integrated tab views (All, Active, Done, Urgent) and instant search filtering',
    ],
    usageSnippet: `import { LinearIssueTracker } from "@/components/ui/linear-issue-tracker"

export default function Demo() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <LinearIssueTracker />
    </div>
  )
}`,
    codeSnippet: `// Complete compound workflow engine:
import { LinearIssueTracker } from '@/components/ui/LinearIssueTracker';
export { LinearIssueTracker };`,
    props: [
      { name: 'initialIssues', type: 'IssueItem[]', default: 'DEFAULT_ISSUES', description: 'Optional initial dataset of issues.' },
      { name: 'onIssueChange', type: '(issues: IssueItem[]) => void', default: 'undefined', description: 'Callback fired when issues are updated or mutated.' },
    ],
  },
  {
    id: 'switch',
    name: 'switch',
    title: 'Switch',
    description: 'A tactile control that allows the user to toggle between checked and not checked states, benchmarked against iOS and Linear ergonomics.',
    category: 'Forms',
    version: '1.0.0',
    primitive: '@radix-ui/react-switch',
    dependencies: ['@radix-ui/react-switch', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx @99/ui add switch',
    features: [
      'Accessible WAI-ARIA switch roles and keyboard activation',
      'Smooth spring motion on thumb toggle',
      'Dark obsidian inactive track and emerald/zinc active track',
    ],
    usageSnippet: `import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function Demo() {
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch checked={enabled} onCheckedChange={setEnabled} />
      <span className="text-sm">Dark mode specular highlights</span>
    </div>
  )
}`,
    codeSnippet: `import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export function Switch({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'data-[state=checked]:bg-zinc-950 dark:data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-800',
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}`,
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Controlled checked state of the switch.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', default: 'undefined', description: 'Callback when toggle state changes.' },
    ],
  },
  {
    id: 'tabs',
    name: 'tabs',
    title: 'Tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time with smooth spring indicators.',
    category: 'Layout',
    version: '1.0.0',
    primitive: '@radix-ui/react-tabs',
    dependencies: ['@radix-ui/react-tabs', 'clsx', 'tailwind-merge', 'motion'],
    cliCommand: 'npx @99/ui add tabs',
    features: [
      'Accessible tablist and tabpanel semantics',
      'Sliding velvet active cushion background',
      'Keyboard Arrow Left/Right support',
    ],
    usageSnippet: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Demo() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Manage account settings here.</TabsContent>
      <TabsContent value="password">Change password here.</TabsContent>
    </Tabs>
  )
}`,
    codeSnippet: `import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;
export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/[0.04] p-1 text-zinc-500 dark:text-zinc-400 border border-black/[0.04] dark:border-white/[0.03]',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;`,
    props: [
      { name: 'defaultValue', type: 'string', default: 'undefined', description: 'Default active tab value.' },
      { name: 'value', type: 'string', default: 'undefined', description: 'Controlled active tab value.' },
      { name: 'onValueChange', type: '(value: string) => void', default: 'undefined', description: 'Callback on tab change.' },
    ],
  },
  {
    id: 'safa-brand-logo',
    name: 'safa-brand-logo',
    title: 'Brand Logo & Typography',
    description: 'Official UI \\ [99] brand typography and minimalist [99] standalone icon mark.',
    category: 'Brand',
    version: '1.0.0',
    primitive: 'SVG Vector Geometry',
    dependencies: ['motion'],
    cliCommand: 'npx @99/ui add logo',
    features: [
      'Dual-layer optical composition with UI / [99] logotype',
      'Minimalist standalone [99] icon token',
      'Interactive hover glow aura with velvet Obsidian dissipation',
      'Sizes: sm, md, lg',
    ],
    usageSnippet: `import { UI99BrandLogo } from "@/components/ui"

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <UI99BrandLogo size="md" />
      <UI99BrandLogo size="lg" />
    </div>
  )
}`,
    codeSnippet: `// See /src/components/ui/SafaBrandLogo.tsx
import { UI99BrandLogo } from '@/components/ui/SafaBrandLogo';
export { UI99BrandLogo };`,
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Optical scale tier.' },
    ],
  },
];
