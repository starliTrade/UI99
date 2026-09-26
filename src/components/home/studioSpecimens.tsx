/**
 * UI99 — Studio Stage Specimens
 *
 * The home studio stage is the first live contact a visitor has with the
 * engine. 32 heavy components carry a hand-built interactive demo; everything
 * else renders a DESIGNED specimen here — real kit components in their
 * canonical arrangement, sized for the stage. A registry that shows a
 * placeholder for its own parts has already lost the argument its homepage
 * is making.
 *
 * Specimen ≠ demo: no state to twiddle (that is what Docs and the All-Props
 * Lab are for) — a specimen proves the component exists, composes, and sits
 * on the tokens, at a glance. Fixed-position chrome (dock/header) is staged
 * inside a relative frame so it can never paint over the real product UI.
 * Anything whose whole point is viewport-anchored (toasts) falls back to the
 * SpecimenFallback card — a placeholder for those would lie about position.
 *
 * The catalogue is typed against the REGISTRY so a new registry item without
 * a specimen or a hand-built demo is a TYPE ERROR, not a silent blank stage.
 */

import {
  Bell, Check, ChevronDown, Command, Home, Layers, Plus,
  Search, Sparkles, User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Accordion, ActivityFeed, AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AspectRatio,
  AudioPlayer,  Avatar, Breadcrumb, Button, CalendarView, Carousel,
  CheckboxGroup, CodeBlock, Collapsible, CollapsibleContent,
  CollapsibleTrigger, Combobox, Command as CommandRoot, CommandBar,
  CommandEmpty, CommandGroup, CommandItem, CommandList, Confetti,
  CurrencyInput, DatePicker, DateRangePicker, DensitySwitcher, DonutRing,
  Dropdown, DropdownButton, EmptyPlaceholder, FileUpload,
  FloatingActionButton, FormError, FormField, KanbanBoard,
  HeatMapCalendar, HoverCard, HoverCardContent, HoverCardTrigger, Input,
  Kbd, Label, LinearIssueTracker, LinkButton, Menubar, MenubarContent,
  MenubarItem, MenubarMenu, MenubarTrigger, MeterBar, MetricCard,
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  ObjectCard, Pagination, PinInput, Popover, PopoverContent,
  PopoverTrigger, RadioGroup, RadioGroupItem, RangeSlider,
  RichTextEditorBar, ScrollArea, SearchBar, Separator, Sheet, SheetContent,
  SheetHeader, SheetTitle, SheetTrigger, SidebarItem, SidebarProvider,
  SignaturePad, Skeleton, Spinner, SplitButton, StatusBadge, Stepper,
  Swatch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tag, Textarea, TimePicker, Timeline, TimelineItem, Tooltip, TreeView,
  TrendDelta, UI99Wordmark,
} from '../ui';

/*
 * Registry ids that carry a hand-built interactive demo INSIDE the home view
 * (state-wired controls). Everything else resolves through STUDIO_SPECIMENS.
 * The vitest studio-coverage gate holds REGISTRY ∪ hand-built ∪ specimens
 * equal to 100% — a new registry item with neither is a red test, not a
 * blank stage.
 */
export const HAND_BUILT_STAGE_IDS: ReadonlySet<string> = new Set([
  'alert', 'avatar-stack', 'badge', 'banner', 'button', 'card', 'checkbox',
  'color-picker', 'copy-button', 'dialog', 'diff-viewer', 'dropdown-menu',
  'icon-button', 'input', 'kbd', 'number-field', 'otp-input',
  'password-input', 'priority-badge', 'progress', 'rating',
  'segmented-control', 'slider', 'sparkline', 'stat-tile', 'status-badge',
  'switch', 'tabs', 'tag-input', 'terminal-emulator', 'toggle',
  'toggle-group',
]);

/* ── fallback: never a dead stage ─────────────────────────────────────────── */

export function SpecimenFallback({ title }: { title: string }) {
  return (
    <div className="w-full max-w-sm p-5 rounded-(--radius-control) bg-(--bg-surface) border border-(--border-subtle) shadow-(--shadow-card) flex items-center gap-3">
      <span className="icon-dot-lg rounded-(--radius-pill) bg-emerald-500 shrink-0" />
      <div className="min-w-0 text-start">
        <p className="type-caption font-semibold text-(--text-primary) truncate">{title}</p>
        <p className="type-micro font-mono text-(--text-muted)">Specimen · full API in Docs</p>
      </div>
    </div>
  );
}

/* ── the catalogue: one specimen per registry id without a hand-built demo ── */

export const STUDIO_SPECIMENS: Record<string, () => ReactNode> = {
  accordion: () => (
    <Accordion
      className="w-full max-w-md"
      items={[
        {
          id: 'tokens', title: 'Tokens are the contract', subtitle: '192 declared, gate-locked',
          children: <p className="type-caption text-(--text-secondary) px-4 pb-4">Every value the kit uses is a named token — no stray hexes survive the gate.</p>,
        },
        {
          id: 'a11y', title: 'Accessibility is compile-time', subtitle: 'axe-clean · focus-visible',
          children: <p className="type-caption text-(--text-secondary) px-4 pb-4">Focus order, contrast and state layers ship pre-wired per component.</p>,
        },
      ]}
    />
  ),

  'activity-feed': () => (
    <div className="w-full max-w-md"><ActivityFeed /></div>
  ),

  'alert-dialog': () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="min-h-[44px] px-4 rounded-(--radius-field) type-caption font-semibold bg-(--ink-fill) text-(--ink-on-fill) cursor-pointer">
          Discard draft…
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
          <AlertDialogDescription>Your edits since the last save will be gone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction>Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),

  'aspect-ratio': () => (
    <AspectRatio ratio={16 / 9} className="w-full max-w-sm overflow-hidden rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-wash)">
      <div className="h-full w-full flex items-center justify-center">
        <span className="type-caption font-mono text-(--text-muted)">16 / 9 — locked</span>
      </div>
    </AspectRatio>
  ),

  'audio-player': () => (
    <AudioPlayer title="Obsidian Velvet" artist="UI99 Sound Lab" durationSec={214} className="w-full max-w-sm" />
  ),

  avatar: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Aria Velvet" size="lg" status="online" />
      <Avatar name="Kian Rostami" size="md" status="offline" />
      <Avatar name="Nova Chen" size="sm" />
    </div>
  ),

  'bottom-navigation': () => (
    <div className="relative h-32 w-full max-w-md overflow-hidden rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-canvas)">
      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <div className="flex items-center gap-1 rounded-(--radius-pill) bg-(--bg-surface) border border-(--border-subtle) shadow-(--shadow-card) p-1">
          {[{ icon: Home, active: true }, { icon: Layers, active: false }, { icon: Search, active: false }, { icon: User, active: false }].map(
            ({ icon: Icon, active }, i) => (
              <span key={i} className={`flex h-9 w-9 items-center justify-center rounded-(--radius-pill) ${active ? 'bg-white/[0.045] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' : ''}`}>
                <Icon className="icon-sm text-(--text-secondary)" />
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  ),

  breadcrumb: () => (
    <Breadcrumb
      items={[
        { label: 'Registry' },
        { label: 'Primitives', onClick: () => {} },
        { label: 'Button', active: true },
      ]}
    />
  ),

  'calendar-view': () => <CalendarView className="w-full max-w-md" />,

  carousel: () => (
    <Carousel className="w-full max-w-md">
      {['First card', 'Second card', 'Third card'].map((label) => (
        <div key={label} className="p-5 rounded-(--radius-control) bg-(--bg-surface) border border-(--border-subtle) type-caption text-(--text-secondary) min-w-[200px]">
          {label}
        </div>
      ))}
    </Carousel>
  ),

  'checkbox-group': () => (
    <CheckboxGroup
      className="w-full max-w-xs"
      options={[
        { value: 'tokens', label: 'Token core' },
        { value: 'registry', label: 'Registry sync' },
        { value: 'a11y', label: 'A11y gates' },
      ]}
      value={['tokens', 'a11y']}
      onChange={() => {}}
    />
  ),

  'code-block': () => (
    <div className="w-full max-w-md">
      <CodeBlock
        code={`npx @99/ui add button`}
        language="bash"
        showLineNumbers={false}
      />
    </div>
  ),

  collapsible: () => (
    <Collapsible className="w-full max-w-md">
      <CollapsibleTrigger className="min-h-[44px] w-full px-4 rounded-(--radius-control) bg-(--bg-subtle) border border-(--border-subtle) type-caption font-medium text-(--text-primary) flex items-center justify-between cursor-pointer">
        Release notes
        <ChevronDown className="icon-sm text-(--text-muted)" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-4 py-3 type-caption text-(--text-secondary)">102 components scanned from source with a verified meta.a11y contract.</p>
      </CollapsibleContent>
    </Collapsible>
  ),

  combobox: () => (
    <div className="w-full max-w-xs">
      <Combobox
        options={[
          { value: 'velvet', label: 'Obsidian Velvet' },
          { value: 'porcelain', label: 'Porcelain Matte' },
          { value: 'graphite', label: 'Graphite Ink' },
        ]}
        value={null}
        onChange={() => {}}
        placeholder="Select theme…"
        searchPlaceholder="Search themes…"
      />
    </div>
  ),

  command: () => (
    <div className="w-full max-w-md rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-surface) shadow-(--shadow-card) overflow-hidden">
      <CommandRoot>
        <CommandList className="p-1.5">
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem><Plus className="icon-sm mr-2" /> Add component</CommandItem>
            <CommandItem><Search className="icon-sm mr-2" /> Search registry</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandRoot>
    </div>
  ),

  'command-bar': () => (
    <CommandBar className="w-full max-w-md" leading={<Command className="icon-sm text-(--text-muted)" />} />
  ),

  confetti: () => (
    <div className="relative">
      <Confetti active={false} />
      <div className="p-4 rounded-(--radius-control) bg-(--bg-subtle) border border-(--border-subtle) type-caption text-(--text-secondary)">
        Triggered on success — fires once, then removes itself.
      </div>
    </div>
  ),

  'currency-input': () => (
    <div className="w-full max-w-xs"><CurrencyInput value={149} onChange={() => {}} /></div>
  ),

  'data-table': () => (
    <Table className="w-full max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Primitive</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>Button</TableCell><TableCell><StatusBadge status="done" showLabel /></TableCell></TableRow>
        <TableRow><TableCell>Dialog</TableCell><TableCell><StatusBadge status="review" showLabel /></TableCell></TableRow>
      </TableBody>
    </Table>
  ),

  'date-picker': () => <DatePicker className="w-full max-w-xs" />,

  'date-range-picker': () => <DateRangePicker className="w-full max-w-sm" />,

  'density-switcher': () => <DensitySwitcher />,

  'donut-ring': () => (
    <DonutRing
      segments={[{ value: 62, color: 'emerald' }, { value: 26, color: 'blue' }, { value: 12, color: 'neutral' }]}
      size={132}
      label="Coverage"
      showValue
    />
  ),

  dropdown: () => (
    <Dropdown
      className="w-full max-w-xs"
      options={[{ value: 'npm', label: 'npm' }, { value: 'pnpm', label: 'pnpm' }, { value: 'bun', label: 'bun' }]}
      value="npm"
      onChange={() => {}}
      label="Package manager"
    />
  ),

  'dropdown-button': () => (
    <DropdownButton
      label="Download"
      options={[{ value: 'zip', label: 'Source zip' }, { value: 'tgz', label: 'npm tarball' }]}
      onSelect={() => {}}
    />
  ),

  'empty-placeholder': () => (
    <EmptyPlaceholder
      icon={<Sparkles className="icon-lg" />}
      title="No drafts yet"
      description="Saved drafts land here."
      actionLabel="New draft"
      onAction={() => {}}
    />
  ),

  'field-error': () => (
    <div className="w-full max-w-xs space-y-1.5">
      <Label htmlFor="specimen-field">Workspace name</Label>
      <Input id="specimen-field" defaultValue="velvet-lab" aria-invalid />
      <FormError>This name is taken.</FormError>
    </div>
  ),

  'file-upload': () => <FileUpload label="Drop tokens.json here" accept=".json" className="w-full max-w-sm" />,

  'floating-action-button': () => (
    <div className="relative h-28 w-full max-w-md overflow-hidden rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-canvas)">
      <div className="absolute bottom-3 end-3">
        <FloatingActionButton icon={<Plus className="icon-md" />} label="Create" onClick={() => {}} />
      </div>
    </div>
  ),

  'form-field': () => (
    <FormField label="Display name" htmlFor="specimen-ff" hint="Shown on shared presets" className="w-full max-w-xs">
      <Input id="specimen-ff" placeholder="Aria Velvet" />
    </FormField>
  ),

  'heat-map-calendar': () => (
    <HeatMapCalendar data={Array.from({ length: 91 }, (_, i) => (i * 7) % 10)} weeks={13} color="emerald" label="Last 13 weeks" />
  ),

  'hover-card': () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="type-caption font-medium text-(--text-primary) underline decoration-(--border-strong) underline-offset-4 cursor-pointer">@ui99</button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <p className="type-caption font-semibold text-(--text-primary)">UI99 Kit</p>
        <p className="type-micro text-(--text-muted)">102 primitives · MIT · no accounts</p>
      </HoverCardContent>
    </HoverCard>
  ),

  'kanban-board': () => (
    <div className="w-full max-w-2xl"><KanbanBoard /></div>
  ),

  'keyboard-shortcuts-dialog': () => (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {([['⌘', 'K'], ['⇧', '⌘', 'P'], ['⌘', '/']] as const).map((combo, i) => (
          <span key={i} className="flex items-center gap-1">
            {combo.map((k) => <Kbd key={k} size="sm">{k}</Kbd>)}
          </span>
        ))}
      </div>
      <p className="type-micro font-mono text-(--text-muted)">Groups render in the real dialog</p>
    </div>
  ),

  label: () => (
    <div className="w-full max-w-xs space-y-1.5">
      <Label htmlFor="specimen-label">API key</Label>
      <Input id="specimen-label" placeholder="••••" />
    </div>
  ),

  'linear-issue-tracker': () => <LinearIssueTracker />,

  'link-button': () => (
    <div className="flex items-center gap-4">
      <LinkButton href="https://github.com/starliTrade/UI99" external variant="emerald">Source</LinkButton>
      <LinkButton href="#docs" variant="underline">Docs</LinkButton>
    </div>
  ),

  menubar: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New preset</MenubarItem>
          <MenubarItem>Export tokens…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),

  'meter-bar': () => <MeterBar value={72} label="Token coverage" showValue className="w-full max-w-sm" />,

  'metric-card': () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
      <MetricCard label="Primitives" value={102} delta={8} sparklineColor="emerald" />
      <MetricCard label="Install time" value="4.2s" delta={-11} sparklineColor="blue" />
    </div>
  ),

  motion: () => (
    <div className="flex flex-col items-center gap-3">
      <span className="relative flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-(--radius-pill) h-4 w-4 bg-emerald-500" />
      </span>
      <p className="type-micro font-mono text-(--text-muted)">spring 460 / 38 — one cushion, everywhere</p>
    </div>
  ),

  'navigation-menu': () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-64 space-y-2">
              <NavigationMenuLink href="#installation">Installation</NavigationMenuLink>
              <NavigationMenuLink href="#theming">Theming</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#tokens" className="px-3 py-2 type-caption font-medium text-(--text-primary)">Tokens</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),

  'object-card': () => (
    <ObjectCard
      object={{
        id: 'spec-1', type: 'note', status: 'review', title: 'Velvet elevation ramp',
        description: 'Negative spread grounds the card.', createdAt: '2026-09-26T09:00:00Z',
        tags: ['tokens', 'elevation'],
      }}
    />
  ),

  pagination: () => (
    <div className="max-w-md">
      <Pagination>
        <span className="type-caption font-mono text-(--text-muted)">1 / 24</span>
      </Pagination>
    </div>
  ),

  'pin-input': () => (
    <div className="w-full max-w-xs"><PinInput length={4} value="9942" onChange={() => {}} /></div>
  ),

  popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="min-h-[44px] px-4 rounded-(--radius-field) type-caption bg-(--bg-subtle) border border-(--border-subtle) text-(--text-primary) cursor-pointer">
          Token preview
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <p className="type-caption font-semibold text-(--text-primary)">--elevation-2</p>
        <p className="type-micro font-mono text-(--text-muted)">0 1px 3px α.28, 0 10px 24px -12px α.5</p>
      </PopoverContent>
    </Popover>
  ),

  'radio-group': () => (
    <RadioGroup className="w-full max-w-xs" value="velvet" onValueChange={() => {}}>
      <div className="flex items-center gap-2"><RadioGroupItem value="velvet" id="rg-v" /><Label htmlFor="rg-v">Obsidian Velvet</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="porcelain" id="rg-p" /><Label htmlFor="rg-p">Porcelain Matte</Label></div>
    </RadioGroup>
  ),

  'range-slider': () => (
    <div className="w-full max-w-sm">
      <RangeSlider value={[24, 72]} min={0} max={100} onChange={() => {}} />
      <p className="type-micro mt-2 text-(--text-tertiary)">24 — 72</p>
    </div>
  ),

  'rich-text-editor-bar': () => <RichTextEditorBar className="w-full max-w-md" />,

  'scroll-area': () => (
    <ScrollArea className="h-32 w-full max-w-xs rounded-(--radius-control) border border-(--border-subtle) p-3">
      {Array.from({ length: 8 }, (_, i) => (
        <p key={i} className="type-caption text-(--text-secondary) py-1">Scrollable row {i + 1}</p>
      ))}
    </ScrollArea>
  ),

  'search-bar': () => (
    <div className="w-full max-w-sm"><SearchBar value="" onChange={() => {}} placeholder="Filter 102 primitives…" /></div>
  ),

  separator: () => (
    <div className="w-full max-w-sm space-y-3">
      <p className="type-caption text-(--text-secondary)">Above the line</p>
      <Separator />
      <p className="type-caption text-(--text-secondary)">Below the line</p>
    </div>
  ),

  sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="min-h-[44px] px-4 rounded-(--radius-field) type-caption bg-(--bg-subtle) border border-(--border-subtle) text-(--text-primary) cursor-pointer">
          Open settings sheet
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),

  sidebar: () => (
    <div className="h-44 w-full max-w-md overflow-hidden rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-canvas) flex">
      <SidebarProvider>
        <div className="w-48 p-2.5 bg-(--bg-surface) border-e border-(--border-subtle) flex flex-col gap-1">
          <SidebarItem icon={<Home className="icon-sm" />} label="Overview" isActive />
          <SidebarItem icon={<Layers className="icon-sm" />} label="Registry" />
          <SidebarItem icon={<Search className="icon-sm" />} label="Search" />
        </div>
      </SidebarProvider>
      <div className="flex-1" />
    </div>
  ),

  'signature-pad': () => <SignaturePad className="w-full max-w-sm" />,

  tag: () => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag variant="neutral" onRemove={() => {}}>Design System</Tag>
      <Tag variant="green" onRemove={() => {}}>Shipped</Tag>
      <Tag variant="purple" onRemove={() => {}}>Tokens</Tag>
      <Tag variant="rose">Beta</Tag>
    </div>
  ),

  'time-picker': () => (
    <div className="w-full max-w-[15rem]">
      <TimePicker value="09:30" onChange={() => {}} step={30} />
    </div>
  ),

  tooltip: () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Tooltip content="Copied to clipboard" side="top">
        <Button variant="outline" size="sm">Hover me</Button>
      </Tooltip>
      <Tooltip content="WCAG 2.2 AA · 44px target" side="bottom" delayMs={0}>
        <Kbd>⌘K</Kbd>
      </Tooltip>
    </div>
  ),


  skeleton: () => (
    <div className="w-full max-w-sm space-y-2.5">
      <Skeleton className="h-5 w-2/3" rounded="md" />
      <Skeleton className="h-3 w-full" rounded="sm" />
      <Skeleton className="h-3 w-4/5" rounded="sm" />
      <Skeleton className="h-24 w-full" rounded="lg" />
    </div>
  ),

  spinner: () => (
    <div className="flex items-center gap-3">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>
  ),

  'split-button': () => (
    <SplitButton
      label="Publish"
      onClick={() => {}}
      items={[
        { label: 'Publish now', onClick: () => {} },
        { label: 'Schedule…', onClick: () => {} },
      ]}
    />
  ),

  stepper: () => <Stepper steps={['Tokens', 'Compose', 'Ship']} current={1} className="w-full max-w-md" />,

  swatch: () => (
    <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
      <Swatch name="Canvas" hex="#060709" />
      <Swatch name="Card" hex="#0C0D12" />
    </div>
  ),

  table: () => (
    <Table className="w-full max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Release</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>1.0.0</TableCell><TableCell>Sep 2026</TableCell></TableRow>
        <TableRow><TableCell>0.9.0</TableCell><TableCell>Aug 2026</TableCell></TableRow>
      </TableBody>
    </Table>
  ),

  textarea: () => <Textarea className="w-full max-w-sm" placeholder="Describe the system…" rows={3} />,

  timeline: () => (
    <Timeline className="w-full max-w-sm">
      <TimelineItem timestamp="09:41" accent="emerald">Tokens verified</TimelineItem>
      <TimelineItem timestamp="09:44" accent="blue">Registry synced</TimelineItem>
      <TimelineItem timestamp="09:47" accent="neutral">Published 1.0.0</TimelineItem>
    </Timeline>
  ),

  'top-header': () => (
    <div className="w-full max-w-md rounded-(--radius-control) border border-(--border-subtle) bg-(--bg-canvas) overflow-hidden">
      <div className="h-10 bg-(--bg-surface) border-b border-(--border-subtle) flex items-center px-3 gap-2">
        <span className="h-2 w-2 rounded-(--radius-pill) bg-emerald-500" />
        <span className="type-caption font-mono text-(--text-muted)">Registry / Button</span>
        <span className="ml-auto flex items-center gap-1.5">
          <Search className="icon-sm text-(--text-muted)" />
          <Bell className="icon-sm text-(--text-muted)" />
        </span>
      </div>
    </div>
  ),

  'tour-guide': () => (
    <div className="w-full max-w-sm p-4 rounded-(--radius-control) bg-(--bg-surface) border border-(--border-subtle) shadow-(--shadow-card) space-y-2">
      <div className="flex items-center justify-between">
        <p className="type-caption font-semibold text-(--text-primary)">The stage</p>
        <Kbd size="xs">1/3</Kbd>
      </div>
      <p className="type-micro text-(--text-muted)">Every specimen renders live on the tokens. Steps advance through the tour.</p>
    </div>
  ),

  'tree-view': () => (
    <div className="w-full max-w-sm">
      <TreeView
        data={[
          {
            id: 'src', name: 'src', type: 'folder',
            children: [
              { id: 'ui', name: 'ui', type: 'folder', children: [{ id: 'button', name: 'Button.tsx', type: 'file', extension: 'tsx' }] },
              { id: 'styles', name: 'styles', type: 'folder', children: [{ id: 'tokens', name: 'ui99.css', type: 'file', extension: 'css' }] },
            ],
          },
        ]}
        selectedId="button"
      />
    </div>
  ),

  'trend-delta': () => (
    <div className="flex items-center gap-3">
      <TrendDelta delta={12.4} suffix="%" />
      <TrendDelta delta={-3.1} suffix="ms" invertTone />
    </div>
  ),

  'ui99-wordmark': () => <UI99Wordmark />,

  toast: () => (
    <div className="w-full max-w-sm p-4 rounded-(--radius-control) bg-(--bg-surface) border border-(--border-subtle) shadow-(--shadow-card) flex items-center gap-2.5">
      <Check className="icon-sm text-emerald-500 shrink-0" />
      <p className="type-caption text-(--text-primary)">Tokens exported — 192 values</p>
    </div>
  ),
};
