/**
 * UI \ [99] — Official Documentation & Component Registry Center
 * Engineered with 100% fidelity to shadcn/ui & Linear architecture:
 * - 3-Column layout (Left sticky categorized sidebar, center docs canvas, right On-This-Page TOC)
 * - Interactive Preview Stage with viewport width switchers (Desktop, Tablet, Mobile) and live property controllers
 * - Code tab with bespoke Prism Obsidian Dark syntax highlighting
 * - CLI & Manual installation workflows with package manager switchers (npm, pnpm, yarn, bun)
 * - Usage snippets and interactive Examples gallery
 * - Props & TypeScript API Reference tables
 * - Pagination footer for effortless keyboard and click flow
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Code2,
  Eye,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  ChevronRight,
  Package,
  FileCode,
  Palette,
  Laptop,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FolderGit2,
  Sliders,
  Play,
  Smartphone,
  Tablet,
  Monitor,
  Hash,
  Share2,
  Compass,
  Zap,
  CheckCheck,
  Flame,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  RefreshCw,
  History,
  Rocket,
  Folder,
  Bold,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { REGISTRY_COMPONENTS, ComponentRegistryItem } from '../../registry/registryData';
import { KIT_COMPONENT_COUNT, KIT_VERSION } from '../../generated/kit-count';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatusBadge,
  PriorityBadge,
  Badge,
  Tag,
  Avatar,
  AvatarStack,
  Checkbox,
  Switch,
  Input,
  SearchBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LinearIssueTracker,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Kbd,
  UI99Wordmark,
  Slider,
  Progress,
  Tooltip,
  Accordion,
  SegmentedControl,
  StatTile,
  CodeBlock,
  ColorPicker,
  SignaturePad,
  PasswordInput,
  TerminalEmulator,
  KanbanBoard,
  DiffViewer,
  TreeView,
  CalendarView,
  AudioPlayer,
  TagInput,
  RichTextEditorBar,
  Banner,
  EmptyPlaceholder,
  TourGuide,
  Confetti,
  NumberField,
  OTPInput,
  Rating,
  DatePicker,
  TimePicker,
  Combobox,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SplitButton,
  FloatingActionButton,
  LinkButton,
  DropdownButton,
  PinInput,
  CurrencyInput,
  DateRangePicker,
  RangeSlider,
  CheckboxGroup,
  DataTable,
  MetricCard,
  Spinner,
  // Wave completions: live previews for every remaining registry element
  ActivityFeed,
  AlertDialog as AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AspectRatio,
  BottomNavigation,
  Breadcrumb,
  Carousel,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Combobox as ComboboxPrimitive,
  CommandBar,
  CommandAction,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  Confetti as ConfettiPrimitive,
  Dialog as DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dropdown,
  EmptyPlaceholder as EmptyPlaceholderPrimitive,
  FileUpload,
  FormField,
  FormHint,
  FormError,
  HeatMapCalendar,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  KeyboardShortcutsDialog,
  Label,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MeterBar,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NumberField as NumberFieldPrimitive,
  OTPInput as OTPInputPrimitive,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  Popover as PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  RadioGroup,
  RadioGroupItem,
  Rating as RatingPrimitive,
  RichTextEditorBar as RichTextEditorBarPrimitive,
  ScrollArea,
  SearchBar as SearchBarPrimitive,
  Separator,
  Sheet as SheetDemoRoot,
  SheetTrigger as SheetDemoTrigger,
  SheetContent as SheetDemoContent,
  SheetHeader as SheetDemoHeader,
  SheetTitle as SheetDemoTitle,
  SheetDescription as SheetDemoDescription,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarItem,
  Skeleton,
  Swatch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TagInput as TagInputPrimitive,
  Textarea,
  TimePicker as TimePickerPrimitive,
  Timeline,
  TimelineItem,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  TopHeader,
  TourGuide as TourGuidePrimitive,
} from '../ui';

type DocGuideSection =
  | 'intro'
  | 'installation'
  | 'theming'
  | 'npm-guide'
  | 'cli'
  | 'changelog'
  | 'typography';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
type ViewportSize = '100%' | '768px' | '375px';

// Registry ids that ship a dedicated live preview in the DocsView stage above.
// The generic fallback card renders for anything NOT in this set — keep this in
// sync when adding registry element #100+ so it doesn't fall through silently.
const LIVE_PREVIEW_IDS = new Set<string>([
  'button', 'icon-button', 'copy-button', 'toggle', 'toggle-group', 'tag',
  'kbd', 'avatar', 'avatar-stack', 'swatch', 'input', 'textarea',
  'search-bar', 'password-input', 'number-field', 'otp-input', 'color-picker', 'date-picker',
  'time-picker', 'combobox', 'dropdown', 'slider', 'file-upload', 'rich-text-editor-bar',
  'signature-pad', 'rating', 'tag-input', 'label', 'form-field', 'field-error',
  'switch', 'checkbox', 'radio-group', 'segmented-control', 'aspect-ratio', 'collapsible',
  'badge', 'stat-tile', 'trend-delta', 'sparkline', 'donut-ring', 'heat-map-calendar',
  'meter-bar', 'progress', 'skeleton', 'table', 'pagination', 'tree-view',
  'timeline', 'stepper', 'code-block', 'carousel', 'diff-viewer', 'kanban-board',
  'calendar-view', 'audio-player', 'dialog', 'alert-dialog', 'sheet', 'popover',
  'dropdown-menu', 'tooltip', 'hover-card', 'menubar', 'navigation-menu', 'command',
  'command-bar', 'keyboard-shortcuts-dialog', 'tour-guide', 'confetti', 'toast', 'banner',
  'alert', 'empty-placeholder', 'card', 'separator', 'scroll-area', 'sidebar',
  'tabs', 'accordion', 'breadcrumb', 'bottom-navigation', 'top-header', 'linear-issue-tracker',
  'terminal-emulator', 'activity-feed', 'ui99-wordmark', 'split-button', 'floating-action-button', 'link-button',
  'dropdown-button', 'pin-input', 'currency-input', 'date-range-picker', 'range-slider', 'checkbox-group',
  'data-table', 'metric-card', 'spinner',
]);

export function DocsView() {
  const { themeMode, addToast, setCurrentTab } = useApp();
  const isDark = themeMode === 'dark';

  // Navigation State
  const [activeSection, setActiveSection] = useState<string>('button');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [installMethod, setInstallMethod] = useState<'cli' | 'manual'>('cli');
  const [viewportWidth, setViewportWidth] = useState<ViewportSize>('100%');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ⌘K Command Palette — jumps to any docs section (audit P3.10)
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Live Component Playground State
  const [demoBtnVariant, setDemoBtnVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'rose'>('primary');
  const [demoBtnSize, setDemoBtnSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');
  const [demoBtnLoading, setDemoBtnLoading] = useState(false);
  const [demoBtnDisabled, setDemoBtnDisabled] = useState(false);

  const [demoBadgeVariant, setDemoBadgeVariant] = useState<'default' | 'secondary' | 'outline' | 'green' | 'amber' | 'destructive'>('default');
  const [demoBadgePulse, setDemoBadgePulse] = useState(false);

  const [demoSwitchChecked, setDemoSwitchChecked] = useState(true);
  const [demoInputValue, setDemoInputValue] = useState('Velvet Obsidian Engine');
  const [demoInputDisabled, setDemoInputDisabled] = useState(false);

  const [demoSliderValue, setDemoSliderValue] = useState(72);
  const [demoProgressValue, setDemoProgressValue] = useState(85);
  const [demoCheckboxChecked, setDemoCheckboxChecked] = useState(true);
  const [demoSegValue, setDemoSegValue] = useState('ALL');

  // Additional component playgrounds state
  const [demoColor, setDemoColor] = useState('#3B82F6');
  const [demoPasswordValue, setDemoPasswordValue] = useState('Vault@2026!Secure');
  const [demoPasswordScore, setDemoPasswordScore] = useState(4);
  const [demoRatingValue, setDemoRatingValue] = useState(4.5);
  const [demoOtpValue, setDemoOtpValue] = useState('992026');
  const [demoTagList, setDemoTagList] = useState(['React', 'TypeScript', 'Tailwind', 'Obsidian']);
  const [demoDatePickerValue, setDemoDatePickerValue] = useState('2026-09-24');
  const [demoTimePickerValue, setDemoTimePickerValue] = useState('09:41');
  const [demoComboboxValue, setDemoComboboxValue] = useState('linear');
  const [demoNumberValue, setDemoNumberValue] = useState(42);
  const [demoDropdownValue, setDemoDropdownValue] = useState<'dark' | 'light' | 'system'>('dark');
  const [demoToggleOn, setDemoToggleOn] = useState(true);
  const [demoToggleGroup, setDemoToggleGroup] = useState('day');
  const [demoSearchValue, setDemoSearchValue] = useState('');
  const [demoTextareaValue, setDemoTextareaValue] = useState('');
  const [demoConfettiActive, setDemoConfettiActive] = useState(false);
  const [demoShortcutsOpen, setDemoShortcutsOpen] = useState(false);
  const [demoCommandOpen, setDemoCommandOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Copy helper with animated toast
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Filter components by search query
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return REGISTRY_COMPONENTS;
    const q = searchQuery.toLowerCase();
    return REGISTRY_COMPONENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group components by category
  const categories = useMemo(() => {
    const map: Record<string, ComponentRegistryItem[]> = {};
    filteredComponents.forEach((c) => {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    });
    return map;
  }, [filteredComponents]);

  const activeComponent = REGISTRY_COMPONENTS.find((c) => c.id === activeSection);
  const isGuideSection = !activeComponent;

  // Pagination helper: find current index and calculate prev/next
  const allNavItems = useMemo(() => {
    const guides = [
      { id: 'intro', title: 'Introduction', isGuide: true },
      { id: 'installation', title: 'Installation', isGuide: true },
      { id: 'theming', title: 'Theming & Tokens', isGuide: true },
      { id: 'npm-guide', title: 'Registry Architecture', isGuide: true },
      { id: 'cli', title: 'CLI Reference', isGuide: true },
      { id: 'changelog', title: 'Changelog & Releases', isGuide: true },
    ];
    const comps = REGISTRY_COMPONENTS.map((c) => ({ id: c.id, title: c.title, isGuide: false }));
    return [...guides, ...comps];
  }, []);

  const currentIndex = allNavItems.findIndex((item) => item.id === activeSection);
  const prevItem = currentIndex > 0 ? allNavItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : null;

  // CLI Command string generator
  const getCliCommand = (compName: string, pm: PackageManager) => {
    switch (pm) {
      case 'pnpm':
        return `pnpm dlx @99/ui add ${compName}`;
      case 'yarn':
        return `yarn dlx @99/ui add ${compName}`;
      case 'bun':
        return `bunx --bun @99/ui add ${compName}`;
      case 'npm':
      default:
        return `npx @99/ui add ${compName}`;
    }
  };

  // Scroll to anchor smooth helper
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ⌘K Command Palette (audit P3.10) — jumps straight to any section */}
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Jump to a component or guide…" />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          <CommandGroup heading="Getting Started">
            <CommandItem onSelect={() => { setActiveSection('intro'); setPaletteOpen(false); }}>
              Introduction
            </CommandItem>
            <CommandItem onSelect={() => { setActiveSection('installation'); setPaletteOpen(false); }}>
              Installation
            </CommandItem>
            <CommandItem onSelect={() => { setActiveSection('theming'); setPaletteOpen(false); }}>
              Theming &amp; Tokens
            </CommandItem>
            <CommandItem onSelect={() => { setActiveSection('cli'); setPaletteOpen(false); }}>
              CLI Reference
            </CommandItem>
            <CommandItem onSelect={() => { setActiveSection('changelog'); setPaletteOpen(false); }}>
              Changelog &amp; Releases
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Components">
            {REGISTRY_COMPONENTS.map((c) => (
              <CommandItem
                key={c.id}
                value={`${c.title} ${c.name} ${c.category}`}
                onSelect={() => { setActiveSection(c.id); setPaletteOpen(false); }}
              >
                {c.title}
                <CommandShortcut className="ml-auto text-[10px] font-mono text-zinc-500">
                  {c.category}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* ── 1. TOP STATUS BAR / BREADCRUMB / REGISTRY QUICK LINK ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.04] text-xs font-mono">
        <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-500 dark:text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveSection('intro')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Docs
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-zinc-400">
            {activeComponent ? activeComponent.category : 'Getting Started'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-zinc-950 dark:text-white font-semibold capitalize">
            {activeComponent ? activeComponent.title : activeSection.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="xs"
            icon={<Layers className="w-3.5 h-3.5" />}
            onClick={() => setCurrentTab('UIKIT')}
          >
            Full UI Kit
          </Button>

          <a
            href="/registry.json"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-colors border border-black/[0.04] dark:border-white/[0.03]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>registry.json</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* ── 2. MAIN 3-COLUMN DOCUMENTATION GRID (SHADCN STANDARD) ── */}
      {/* Mobile Component Selector & Quick Switcher (< lg) */}
      <div className="lg:hidden space-y-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Mobile Sheet Drawer Trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.06] text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform"
              >
                <Menu className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline">Menu</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  {REGISTRY_COMPONENTS.length}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 bg-white dark:bg-[#07080C] border-r border-zinc-200 dark:border-white/[0.06] overflow-y-auto">
              <SheetHeader className="p-4 border-b border-zinc-200 dark:border-white/[0.06] text-left">
                <SheetTitle className="text-sm font-mono font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> UI99 Component Registry
                </SheetTitle>
                <SheetDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select a guide or component
                </SheetDescription>
              </SheetHeader>

              <div className="p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Getting Started */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    Getting Started
                  </h4>
                  {[
                    { id: 'intro', label: 'Introduction', icon: BookOpen },
                    { id: 'installation', label: 'Installation', icon: Terminal },
                    { id: 'theming', label: 'Theming & Tokens', icon: Palette },
                    { id: 'npm-guide', label: 'Registry Architecture', icon: Package },
                    { id: 'cli', label: 'CLI Reference', icon: FolderGit2 },
                    { id: 'changelog', label: 'Changelog & Releases', icon: History },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileNavOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Categories */}
                {Object.entries(categories).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                      {category}
                    </div>
                    {items.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveSection(item.id);
                            setMobileNavOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <span>{item.title}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Quick Dropdown selector */}
          <div className="relative flex-1">
            <select
              value={activeSection}
              onChange={(e) => {
                setActiveSection(e.target.value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full pl-3 pr-8 py-2.5 rounded-2xl text-xs font-mono font-medium bg-white dark:bg-[#0A0B10] border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer shadow-sm"
            >
              <optgroup label="Getting Started">
                <option value="intro">Introduction</option>
                <option value="installation">Installation</option>
                <option value="theming">Theming & Tokens</option>
                <option value="npm-guide">Registry Architecture</option>
                <option value="cli">CLI Reference</option>
                <option value="changelog">Changelog & Releases</option>
              </optgroup>
              {Object.entries(categories).map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Fast horizontal category chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('intro')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-mono transition-colors shrink-0 ${
              isGuideSection
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'bg-white/[0.03] text-zinc-400 border border-white/[0.04]'
            }`}
          >
            Guides
          </button>
          {REGISTRY_COMPONENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveSection(c.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-mono transition-colors shrink-0 ${
                activeSection === c.id
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.04]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT SIDEBAR: CATEGORIZED NAVIGATION (3 cols, hidden on mobile for clean UX) ── */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-16 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar pr-2 select-none">
          {/* Search Input for Quick Component Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search docs & components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-zinc-100"
              >
                ✕
              </button>
            )}
          </div>

          {/* Getting Started Section */}
          <div className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              Getting Started
            </h4>
            <div className="space-y-0.5">
              {[
                { id: 'intro', label: 'Introduction', icon: BookOpen },
                { id: 'installation', label: 'Installation', icon: Terminal },
                { id: 'theming', label: 'Theming & Tokens', icon: Palette },
                { id: 'npm-guide', label: 'Registry Architecture', icon: Package },
                { id: 'cli', label: 'CLI Reference', icon: FolderGit2 },
                { id: 'changelog', label: 'Changelog & Releases', icon: History },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 text-white dark:bg-white/[0.08] dark:text-white font-semibold shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component Catalog Grouped by Category */}
          <div className="space-y-5 pt-2 border-t border-black/[0.04] dark:border-white/[0.03]">
            <div className="flex items-center justify-between px-3">
              <h4 className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Components
              </h4>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                {REGISTRY_COMPONENTS.length} items
              </span>
            </div>

            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  {category}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-zinc-950 text-white dark:bg-white/[0.08] dark:text-white font-semibold shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── CENTER COLUMN: MAIN CONTENT CANVAS (6 or 7 cols) ── */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-10 min-w-0">
          {/* ========================================================
              VIEW 1: COMPONENT SHOWCASE (SHADCN PATTERN)
             ======================================================== */}
          {activeComponent && (
            <article className="space-y-8">
              {/* PAGE HEADER */}
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {activeComponent.title}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    v{activeComponent.version}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  {activeComponent.description}
                </p>

                {/* Quick Action Chips & CLI Copy Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.03] text-xs font-mono text-zinc-700 dark:text-zinc-300">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeComponent.cliCommand}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeComponent.cliCommand, 'header-cli')}
                      className="text-zinc-400 hover:text-white transition-colors cursor-pointer pl-1"
                      title="Copy CLI command"
                    >
                      {copiedKey === 'header-cli' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 rounded-xl">
                    Primitive: {activeComponent.primitive || 'Native React'}
                  </span>
                </div>
              </header>

              {/* ── SECTION 1: INTERACTIVE PREVIEW & CODE STAGE ── */}
              <section id="preview" className="space-y-3">
                {/* Tabs & Viewport Controls Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Preview / Code Tab Buttons */}
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                        activeTab === 'preview'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                          : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                        activeTab === 'code'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                          : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </button>
                  </div>

                  {/* Viewport Width Switchers (Desktop / Tablet / Mobile) */}
                  {activeTab === 'preview' && (
                    <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => setViewportWidth('100%')}
                        title="Full width (100%)"
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          viewportWidth === '100%'
                            ? 'bg-white text-zinc-900 dark:bg-white/[0.1] dark:text-white shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewportWidth('768px')}
                        title="Tablet width (768px)"
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          viewportWidth === '768px'
                            ? 'bg-white text-zinc-900 dark:bg-white/[0.1] dark:text-white shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewportWidth('375px')}
                        title="Mobile width (375px)"
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          viewportWidth === '375px'
                            ? 'bg-white text-zinc-900 dark:bg-white/[0.1] dark:text-white shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* TAB CONTENT: PREVIEW STAGE OR CODE */}
                {activeTab === 'preview' ? (
                  <div className="space-y-4">
                    {/* Live Playground Stage */}
                    <div
                      className="mx-auto rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.04] bg-zinc-50 dark:bg-[#07080C] p-4 sm:p-8 md:p-12 min-h-[260px] sm:min-h-[320px] flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-(var(--elevation-3))"
                      style={{ maxWidth: viewportWidth }}
                    >
                      {/* Sub-pixel top rim specular highlight */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                      {/* Subtle dot matrix pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />

                      {/* Component Live Render Switch */}
                      <div className="relative z-10 w-full flex items-center justify-center">
                        {activeComponent.id === 'button' && (
                          <Button
                            variant={demoBtnVariant}
                            size={demoBtnSize}
                            loading={demoBtnLoading}
                            disabled={demoBtnDisabled}
                            icon={<Sparkles className="w-4 h-4" />}
                          >
                            Button Component
                          </Button>
                        )}

                        {activeComponent.id === 'badge' && (
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={demoBadgeVariant}>
                              Production Ready
                            </Badge>
                            <Badge variant="outline">v2.0.4</Badge>
                            <Badge variant="green">99.9% Uptime</Badge>
                          </div>
                        )}

                        {activeComponent.id === 'card' && (
                          <Card className="w-full max-w-sm">
                            <CardHeader>
                              <CardTitle>Obsidian Velvet</CardTitle>
                              <CardDescription>
                                Sub-pixel specular rim and soft ambient shadow profile.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Crafted for high-density interfaces and dark luxury dashboards.
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button size="xs" variant="primary">
                                Explore Tokens
                              </Button>
                            </CardFooter>
                          </Card>
                        )}

                        {activeComponent.id === 'switch' && (
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.03]">
                            <Switch checked={demoSwitchChecked} onCheckedChange={setDemoSwitchChecked} />
                            <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                              {demoSwitchChecked ? 'Enabled · Active State' : 'Disabled · Inactive'}
                            </span>
                          </div>
                        )}

                        {activeComponent.id === 'input' && (
                          <div className="w-full max-w-md space-y-2">
                            <Input
                              value={demoInputValue}
                              onChange={(e) => setDemoInputValue(e.target.value)}
                              placeholder="Enter project name..."
                              disabled={demoInputDisabled}
                            />
                            <p className="text-[11px] font-mono text-zinc-400">
                              Character count: {demoInputValue.length}
                            </p>
                          </div>
                        )}

                        {activeComponent.id === 'tag' && (
                          <div className="flex flex-wrap items-center gap-2">
                            <Tag variant="neutral">Design System</Tag>
                            <Tag variant="green">Approved</Tag>
                            <Tag variant="blue">Registry</Tag>
                            <Tag variant="purple">Sprint 99</Tag>
                            <Tag variant="rose">Critical</Tag>
                          </div>
                        )}

                        {activeComponent.id === 'priority-badge' && (
                          <div className="flex flex-wrap items-center gap-3">
                            <PriorityBadge priority="urgent" showLabel={true} />
                            <PriorityBadge priority="high" showLabel={true} />
                            <PriorityBadge priority="medium" showLabel={true} />
                            <PriorityBadge priority="low" showLabel={true} />
                          </div>
                        )}

                        {activeComponent.id === 'status-badge' && (
                          <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status="in_progress" showLabel={true} />
                            <StatusBadge status="todo" showLabel={true} />
                            <StatusBadge status="done" showLabel={true} />
                            <StatusBadge status="canceled" showLabel={true} />
                          </div>
                        )}

                        {activeComponent.id === 'tabs' && (
                          <div className="w-full max-w-md">
                            <Tabs defaultValue="overview">
                              <TabsList className="grid grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                <TabsTrigger value="reports">Reports</TabsTrigger>
                              </TabsList>
                              <TabsContent value="overview" className="p-4 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] text-xs text-zinc-400 mt-2">
                                Overview content with spring tab transitions.
                              </TabsContent>
                              <TabsContent value="analytics" className="p-4 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] text-xs text-zinc-400 mt-2">
                                Real-time analytics metrics streaming via edge nodes.
                              </TabsContent>
                              <TabsContent value="reports" className="p-4 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] text-xs text-zinc-400 mt-2">
                                Audit reports generated automatically.
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}

                        {activeComponent.id === 'slider' && (
                          <div className="w-full max-w-md space-y-3">
                            <div className="flex justify-between text-xs font-mono text-zinc-400">
                              <span>Fluid Opacity</span>
                              <span className="text-emerald-400 font-bold">{demoSliderValue}%</span>
                            </div>
                            <Slider value={demoSliderValue} onChange={setDemoSliderValue} min={0} max={100} />
                          </div>
                        )}

                        {activeComponent.id === 'progress' && (
                          <div className="w-full max-w-md space-y-3">
                            <div className="flex justify-between text-xs font-mono text-zinc-400">
                              <span>Build Compilation</span>
                              <span className="text-emerald-400 font-bold">{demoProgressValue}%</span>
                            </div>
                            <Progress value={demoProgressValue} />
                          </div>
                        )}

                        {activeComponent.id === 'segmented-control' && (
                          <SegmentedControl
                            options={[
                              { label: 'All Issues', value: 'ALL' },
                              { label: 'Assigned', value: 'ASSIGNED' },
                              { label: 'Mentioned', value: 'MENTIONED' },
                            ]}
                            value={demoSegValue}
                            onChange={setDemoSegValue}
                          />
                        )}

                        {activeComponent.id === 'stat-tile' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                            <StatTile label="P99 Response" value="11.4 ms" delta={18.4} />
                            <StatTile label="API Invocations" value="1,429k" delta={0} />
                          </div>
                        )}

                        {activeComponent.id === 'kbd' && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-zinc-400">Press</span>
                            <Kbd>⌘</Kbd>
                            <Kbd>K</Kbd>
                            <span className="text-xs font-mono text-zinc-400">to open command palette</span>
                          </div>
                        )}

                        {activeComponent.id === 'checkbox' && (
                          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03]">
                            <Checkbox checked={demoCheckboxChecked} onChange={setDemoCheckboxChecked} />
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              Enable specular border highlights across registry
                            </span>
                          </div>
                        )}

                        {activeComponent.id === 'linear-issue-tracker' && (
                          <div className="w-full max-w-lg">
                            <LinearIssueTracker />
                          </div>
                        )}

                        {activeComponent.id === 'ui99-brand-logo' && (
                          <div className="flex flex-col items-center gap-4">
                            <UI99Wordmark size="lg" />
                            <span className="text-xs font-mono text-zinc-400">Obsidian Velvet Luxury Brand Mark</span>
                          </div>
                        )}

                        {activeComponent.id === 'dropdown-menu' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" icon={<ChevronDown className="w-4 h-4" />}>
                                Options Menu
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Design System</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <span>Copy Token URL</span>
                                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <span>Export Figma Tokens</span>
                                <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-rose-400">
                                <span>Purge Cache</span>
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {activeComponent.id === 'tooltip' && (
                          <div className="flex items-center justify-center p-6">
                            <Tooltip content="Sub-pixel specular rim highlight: inset 0 1px 0 0 rgba(255,255,255,0.05)" side="top">
                              <Button variant="outline">Hover for Specular Spec</Button>
                            </Tooltip>
                          </div>
                        )}

                        {activeComponent.id === 'accordion' && (
                          <div className="w-full max-w-md">
                            <Accordion
                              items={[
                                {
                                  id: '1',
                                  title: 'What makes UI [99] Obsidian Dark distinctive?',
                                  children: 'Locked #06070A canvas, sub-pixel specular rim highlights, and zero-pill layout discipline.',
                                },
                                {
                                  id: '2',
                                  title: 'Is it compatible with Tailwind CSS v4?',
                                  children: 'Yes, 100% native CSS variables without arbitrary config plugins.',
                                },
                                {
                                  id: '3',
                                  title: 'Are touch targets accessible?',
                                  children: 'Every interactive control adheres to the strict 44px minimum touch target standard.',
                                },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'color-picker' && (
                          <div className="w-full max-w-xs flex flex-col items-center gap-3">
                            <ColorPicker
                              value={demoColor}
                              onChange={setDemoColor}
                              label="Accent Color"
                            />
                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                              <span>Selected:</span>
                              <span className="font-bold text-white px-2 py-0.5 rounded bg-white/[0.06]">{demoColor}</span>
                            </div>
                          </div>
                        )}

                        {activeComponent.id === 'signature-pad' && (
                          <div className="w-full max-w-md">
                            <SignaturePad
                              onSave={(dataUrl) => addToast('Signature captured successfully', 'success')}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'password-input' && (
                          <div className="w-full max-w-sm">
                            <PasswordInput
                              value={demoPasswordValue}
                              onChange={(e) => setDemoPasswordValue(e.target.value)}
                              onStrengthChange={setDemoPasswordScore}
                              label="Enterprise Password"
                              showStrength={true}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'terminal-emulator' && (
                          <div className="w-full max-w-lg">
                            <TerminalEmulator
                              initialLogs={[
                                { id: '1', command: 'npx @99/ui init', output: 'UI \\ [99] Enterprise Core v2.0.4 loaded.', status: 'success', timestamp: '12:00:00' },
                                { id: '2', command: 'npx @99/ui add all', output: 'All 26 components compiled in registry.', status: 'success', timestamp: '12:00:01' },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'kanban-board' && (
                          <div className="w-full max-w-full overflow-x-auto pb-2">
                            <KanbanBoard />
                          </div>
                        )}

                        {activeComponent.id === 'diff-viewer' && (
                          <div className="w-full max-w-full overflow-x-auto">
                            <DiffViewer
                              fileName="src/tokens/colors.ts"
                              lines={[
                                { type: 'normal', oldLineNumber: 1, newLineNumber: 1, content: 'export const canvas = {' },
                                { type: 'delete', oldLineNumber: 2, content: '  bg: "#0B0C11",' },
                                { type: 'add', newLineNumber: 2, content: '  bg: "#06070A", // Velvet Obsidian' },
                                { type: 'add', newLineNumber: 3, content: '  rim: "inset 0 1px 0 0 rgba(255,255,255,0.05)",' },
                                { type: 'normal', oldLineNumber: 3, newLineNumber: 4, content: '};' },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'tree-view' && (
                          <div className="w-full max-w-sm p-3 rounded-2xl bg-zinc-100 dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.04]">
                            <TreeView
                              data={[
                                {
                                  id: 'src',
                                  name: 'src',
                                  type: 'folder',
                                  children: [
                                    {
                                      id: 'components',
                                      name: 'components',
                                      type: 'folder',
                                      children: [
                                        { id: 'ui', name: 'ui (26 items)', type: 'folder' },
                                        { id: 'views', name: 'views', type: 'folder' },
                                      ],
                                    },
                                    { id: 'tokens', name: 'tokens.ts', type: 'file' },
                                    { id: 'app', name: 'App.tsx', type: 'file' },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'calendar-view' && (
                          <div className="w-full max-w-md">
                            <CalendarView
                              events={[
                                { id: '1', day: 8, title: 'Phase 3 Design Audit', variant: 'rose' },
                                { id: '2', day: 24, title: 'Sprint Demo 99', variant: 'emerald' },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'audio-player' && (
                          <div className="w-full max-w-md">
                            <AudioPlayer
                              title="Obsidian Velvet Ambient Frequency"
                              artist="Velvet Acoustic Lab"
                              durationSec={184}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'icon-button' && (
                          <div className="flex items-center gap-3">
                            <Button size="sm" className="p-2.5 rounded-full" variant="primary">
                              <Sparkles className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="p-2.5 rounded-2xl" variant="secondary">
                              <Search className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="p-2.5 rounded-xl" variant="outline">
                              <Terminal className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {activeComponent.id === 'copy-button' && (
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03]">
                            <code className="text-xs font-mono text-emerald-400">npx @99/ui add all</code>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => copyToClipboard('npx @99/ui add all', 'demo-cli')}
                              icon={copiedKey === 'demo-cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            >
                              {copiedKey === 'demo-cli' ? 'Copied' : 'Copy'}
                            </Button>
                          </div>
                        )}

                        {activeComponent.id === 'stat-tile' && (
                          <div className="w-full max-w-xs">
                            <StatTile
                              label="Total API Invocations"
                              value="1,429,820"
                              delta={18.4}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'trend-delta' && (
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              +24.8% ↑
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              -8.2% ↓
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                              0.0% —
                            </span>
                          </div>
                        )}

                        {activeComponent.id === 'sparkline' && (
                          <div className="w-full max-w-xs p-4 rounded-2xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                              <span>Throughput</span>
                              <span className="text-emerald-400 font-bold">+18.4%</span>
                            </div>
                            <div className="h-12 w-full flex items-end gap-1.5 pt-2">
                              {[30, 45, 25, 60, 80, 50, 75, 95, 65, 85, 90, 100].map((val, i) => (
                                <div
                                  key={i}
                                  style={{ height: `${val}%` }}
                                  className="flex-1 bg-emerald-500/30 hover:bg-emerald-400 rounded-t-xs transition-colors"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {activeComponent.id === 'donut-ring' && (
                          <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-zinc-800"
                                  strokeWidth="3"
                                  stroke="currentColor"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-emerald-400"
                                  strokeDasharray="78, 100"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <span className="absolute text-xs font-mono font-bold text-white">78%</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="font-semibold text-zinc-200">Design System Audit</div>
                              <div className="text-zinc-400">78 / {KIT_COMPONENT_COUNT} criteria verified</div>
                            </div>
                          </div>
                        )}

                        {activeComponent.id === 'stepper' && (
                          <div className="w-full max-w-md flex items-center justify-between">
                            {['Workspace', 'Tokens', 'Verification'].map((step, idx) => (
                              <div key={step} className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    idx <= 1 ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <span className={`text-xs font-medium ${idx <= 1 ? 'text-white' : 'text-zinc-500'}`}>
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeComponent.id === 'banner' && (
                          <div className="w-full max-w-lg p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>UI \ [99] Registry is ready for production.</span>
                            </div>
                            <Button size="xs" variant="primary">Explore</Button>
                          </div>
                        )}

                        {activeComponent.id === 'alert' && (
                          <div className="w-full max-w-md p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1 text-xs">
                            <div className="font-bold flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-rose-400" />
                              Security Policy Notice
                            </div>
                            <p className="text-zinc-400">
                              Authentication credentials require 2FA enforcement on this cluster.
                            </p>
                          </div>
                        )}

                        {activeComponent.id === 'ui99-wordmark' && (
                          <div className="flex flex-col items-center gap-4">
                            <UI99Wordmark size="lg" />
                            <span className="text-xs font-mono text-zinc-400">Obsidian Velvet Official Wordmark</span>
                          </div>
                        )}

                        {activeComponent.id === 'split-button' && (
                          <div className="flex items-center gap-3">
                            <SplitButton
                              label="Deploy Production"
                              onClick={() => addToast('Deploy started', 'success')}
                              items={[
                                { label: 'Deploy Staging', onClick: () => addToast('Staging deploy', 'info') },
                                { label: 'Canary Test', onClick: () => addToast('Canary test', 'info') },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'floating-action-button' && (
                          <div className="flex items-center gap-4">
                            <FloatingActionButton
                              label="Create Task"
                              onClick={() => addToast('FAB clicked', 'info')}
                              variant="primary"
                            />
                            <FloatingActionButton
                              onClick={() => addToast('FAB emerald clicked', 'success')}
                              variant="emerald"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'link-button' && (
                          <div className="flex items-center gap-4">
                            <LinkButton href="https://github.com" external variant="emerald">
                              GitHub Repository
                            </LinkButton>
                            <LinkButton href="/docs" variant="underline">
                              Documentation Guide
                            </LinkButton>
                          </div>
                        )}

                        {activeComponent.id === 'dropdown-button' && (
                          <div className="flex items-center gap-3">
                            <DropdownButton
                              label="Select Node"
                              onSelect={(val) => addToast(`Selected: ${val}`, 'info')}
                              options={[
                                { value: 'edge-1', label: 'Edge Node Frankfurt' },
                                { value: 'edge-2', label: 'Edge Node Silicon Valley' },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'pin-input' && (
                          <div className="flex flex-col items-center gap-2">
                            <PinInput length={6} value="994200" onChange={() => {}} />
                            <span className="text-[11px] font-mono text-zinc-500">Auto-progression & Masking</span>
                          </div>
                        )}

                        {activeComponent.id === 'currency-input' && (
                          <div className="w-full max-w-xs">
                            <CurrencyInput value={1499.50} onChange={() => {}} currency="USD" />
                          </div>
                        )}

                        {activeComponent.id === 'date-range-picker' && (
                          <div className="flex items-center gap-2">
                            <DateRangePicker />
                          </div>
                        )}

                        {activeComponent.id === 'range-slider' && (
                          <div className="w-full max-w-sm p-4 rounded-2xl bg-zinc-100 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03]">
                            <RangeSlider value={[25, 75]} onChange={() => {}} min={0} max={100} />
                          </div>
                        )}

                        {activeComponent.id === 'checkbox-group' && (
                          <div className="w-full max-w-sm">
                            <CheckboxGroup
                              options={[
                                { value: 'auth', label: 'OAuth 2.0 PKCE', description: 'Enterprise authentication' },
                                { value: 'audit', label: 'WCAG 2.2 Audit', description: 'Strict focus & contrast check' },
                              ]}
                              value={['auth', 'audit']}
                              onChange={() => {}}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'data-table' && (
                          <div className="w-full max-w-lg">
                            <DataTable
                              columns={[
                                { key: 'name', header: 'Component', sortable: true },
                                { key: 'cat', header: 'Category' },
                                { key: 'wcag', header: 'Accessibility', render: () => <Badge variant="green" size="sm">AAA</Badge> },
                              ]}
                              data={[
                                { name: 'SplitButton', cat: 'Actions', wcag: 'AAA' },
                                { name: 'DataTable', cat: 'Data', wcag: 'AAA' },
                                { name: 'PinInput', cat: 'Forms', wcag: 'AAA' },
                              ]}
                              pageSize={3}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'metric-card' && (
                          <div className="w-full max-w-sm">
                            <MetricCard
                              label="Monthly Active Instances"
                              value="24,980"
                              delta={15.2}
                              sparklineData={[10, 20, 18, 30, 45, 60, 75, 90]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'spinner' && (
                          <div className="flex items-center gap-4">
                            <Spinner size="sm" variant="emerald" />
                            <Spinner size="md" variant="emerald" label="Syncing telemetry..." />
                            <Spinner size="lg" variant="subtle" />
                          </div>
                        )}

                        {/* ── Wave completions: live previews for every remaining registry element ── */}

                        {activeComponent.id === 'activity-feed' && (
                          <div className="w-full max-w-md">
                            <ActivityFeed
                              events={[
                                { id: 'a1', actor: { name: 'Aria' }, action: 'committed', target: 'tokens/ui99.css', timestamp: '2m ago', details: 'feat: rose-intent token sweep' },
                                { id: 'a2', actor: { name: 'Safa' }, action: 'resolved', target: 'UI-482', timestamp: '18m ago', details: 'Contrast gate: amber 600 → 700' },
                                { id: 'a3', actor: { name: 'Nova' }, action: 'commented', target: 'PR #99', timestamp: '1h ago', details: 'Specular rim looks perfect now.' },
                                { id: 'a4', actor: { name: 'Kian' }, action: 'created', target: 'Milestone v1.0', timestamp: '3h ago' },
                              ]}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'alert-dialog' && (
                          <AlertDialogRoot>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete workspace</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  All objects, relationships and token snapshots will be permanently removed. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction variant="destructive">Delete forever</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogRoot>
                        )}

                        {activeComponent.id === 'aspect-ratio' && (
                          <div className="w-full max-w-sm">
                            <AspectRatio ratio={16 / 9}>
                              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-xs font-mono text-emerald-300">16 : 9 · locked</span>
                              </div>
                            </AspectRatio>
                          </div>
                        )}

                        {activeComponent.id === 'avatar' && (
                          <div className="flex flex-wrap items-center justify-center gap-5">
                            <Avatar name="Aria" size="xs" />
                            <Avatar name="Safa" size="sm" status="online" />
                            <Avatar name="Nova" size="md" status="online" />
                            <Avatar name="Kian" size="lg" status="offline" />
                            <Avatar src="https://i.pravatar.cc/96?img=32" alt="Rana" size="md" />
                            <span className="text-[11px] font-mono text-zinc-500">xs → lg · fallback initials · status dot</span>
                          </div>
                        )}

                        {activeComponent.id === 'avatar-stack' && (
                          <div className="flex flex-col items-center gap-4">
                            <AvatarStack names={['Aria', 'Safa', 'Nova', 'Kian', 'Rana', 'Omid']} size="md" />
                            <AvatarStack names={['Aria', 'Safa', 'Nova', 'Kian']} size="sm" max={3} />
                          </div>
                        )}

                        {activeComponent.id === 'bottom-navigation' && (
                          <div className="w-full max-w-sm">
                            <BottomNavigation />
                          </div>
                        )}

                        {activeComponent.id === 'breadcrumb' && (
                          <Breadcrumb
                            items={[
                              { label: 'Design System', href: '#' },
                              { label: 'Components', href: '#' },
                              { label: 'Breadcrumb', href: '#', active: true },
                            ]}
                          />
                        )}

                        {activeComponent.id === 'carousel' && (
                          <div className="w-full max-w-md">
                            <Carousel label="Token highlights">
                              {[
                                { name: 'Obsidian', hex: '#06070A' },
                                { name: 'Velvet', hex: '#0B0C11' },
                                { name: 'Emerald', hex: '#10B981' },
                                { name: 'Rose Intent', hex: '#F43F5E' },
                              ].map((c) => (
                                <div
                                  key={c.name}
                                  className="h-40 rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center gap-2"
                                  style={{ background: `linear-gradient(160deg, ${c.hex} 0%, #0B0C11 130%)` }}
                                >
                                  <span className="text-sm font-semibold text-white">{c.name}</span>
                                  <span className="text-xs font-mono text-white/45">{c.hex}</span>
                                </div>
                              ))}
                            </Carousel>
                          </div>
                        )}

                        {activeComponent.id === 'code-block' && (
                          <div className="w-full max-w-lg">
                            <CodeBlock
                              filename="tokens.ts"
                              language="ts"
                              code={`import { tokens } from '@99/ui';\n\nexport const surface = tokens.bg.surface;\n// → rgba(14, 14, 19, 0.52)`}
                              showLineNumbers
                            />
                          </div>
                        )}

                        {activeComponent.id === 'collapsible' && (
                          <div className="w-full max-w-md">
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm">Design principles</Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="mt-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs text-zinc-400 leading-relaxed">
                                  Velvet surfaces over hard slabs · hairline borders · specular rim highlights ·
                                  every state derived from tokens, never hand-picked.
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        )}

                        {activeComponent.id === 'combobox' && (
                          <div className="w-full max-w-sm">
                            <ComboboxPrimitive
                              options={[
                                { value: 'linear', label: 'Linear' },
                                { value: 'shadcn', label: 'shadcn/ui' },
                                { value: 'daisyui', label: 'daisyUI' },
                                { value: 'ui99', label: 'UI99' },
                              ]}
                              value={demoComboboxValue}
                              onChange={(v) => setDemoComboboxValue(v ?? 'linear')}
                              placeholder="Pick a design system…"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'command' && (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => setDemoCommandOpen(true)}
                              icon={<Search className="w-4 h-4" />}
                            >
                              Open command palette <Kbd>⌘K</Kbd>
                            </Button>
                            <CommandDialog open={demoCommandOpen} onOpenChange={setDemoCommandOpen}>
                              <CommandInput placeholder="Type a command or search…" />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Suggestions">
                                  <CommandItem>
                                    <Calendar className="mr-2 h-4 w-4" /> Calendar
                                  </CommandItem>
                                  <CommandItem>
                                    <Sparkles className="mr-2 h-4 w-4" /> Launch workflow
                                  </CommandItem>
                                  <CommandItem>
                                    <Palette className="mr-2 h-4 w-4" /> Export tokens
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </CommandDialog>
                          </>
                        )}

                        {activeComponent.id === 'command-bar' && (
                          <div className="w-full max-w-md">
                            <CommandBar leading={<Search className="w-4 h-4 text-zinc-500" />}>
                              <CommandAction keys={['⌘', 'K']}>Command palette</CommandAction>
                              <CommandAction keys={['⌘', 'B']} active>Toggle sidebar</CommandAction>
                              <CommandAction keys={['G', 'D']}>Go to dashboard</CommandAction>
                            </CommandBar>
                          </div>
                        )}

                        {activeComponent.id === 'confetti' && (
                          <div className="flex flex-col items-center gap-4">
                            <ConfettiPrimitive active={demoConfettiActive} particleCount={90} durationMs={2200} onComplete={() => setDemoConfettiActive(false)} />
                            <Button variant="success" onClick={() => setDemoConfettiActive(true)}>
                              <Sparkles className="w-4 h-4" /> Celebrate
                            </Button>
                          </div>
                        )}

                        {activeComponent.id === 'date-picker' && (
                          <div className="w-full max-w-sm">
                            <DatePicker value={demoDatePickerValue} onChange={(iso) => setDemoDatePickerValue(iso ?? '2026-09-24')} />
                          </div>
                        )}

                        {activeComponent.id === 'dialog' && (
                          <DialogRoot>
                            <DialogTrigger asChild>
                              <Button variant="primary">Open dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Velvet Obsidian Engine</DialogTitle>
                                <DialogDescription>
                                  Tokens, focus rings and state layers are the single source of truth. Edit once — every surface follows.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button variant="secondary" size="sm">Later</Button>
                                <Button variant="primary" size="sm">Adopt tokens</Button>
                              </div>
                            </DialogContent>
                          </DialogRoot>
                        )}

                        {activeComponent.id === 'dropdown' && (
                          <div className="w-full max-w-xs">
                            <Dropdown
                              options={[
                                { value: 'dark', label: 'Obsidian Dark' },
                                { value: 'light', label: 'Porcelain Light' },
                                { value: 'system', label: 'Match system' },
                              ]}
                              value={demoDropdownValue}
                              onChange={(v) => setDemoDropdownValue(v)}
                              label="Theme"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'empty-placeholder' && (
                          <div className="w-full max-w-md">
                            <EmptyPlaceholderPrimitive
                              icon={<Compass className="w-6 h-6" />}
                              title="No objects yet"
                              description="Capture your first thought, link or decision — UI99 will classify and file it automatically."
                              actionLabel="New object"
                              onAction={() => addToast('Create object opened', 'info')}
                              shortcut="⌘N"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'file-upload' && (
                          <div className="w-full max-w-md">
                            <FileUpload
                              label="Drop design tokens or click to browse"
                              multiple
                              onFilesSelected={(files) => addToast(`${files.length} file(s) selected`, 'success')}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'field-error' && (
                          <div className="w-full max-w-sm">
                            <FormField label="Workspace name" htmlFor="demo-ws" required error="A workspace name is required.">
                              <Input id="demo-ws" value="" placeholder="Required field" />
                            </FormField>
                          </div>
                        )}

                        {activeComponent.id === 'form-field' && (
                          <div className="w-full max-w-sm">
                            <FormField label="Display name" htmlFor="demo-ff" hint="Shown on your public profile. Max 32 characters.">
                              <Input id="demo-ff" defaultValue="Aria Velvet" />
                            </FormField>
                          </div>
                        )}

                        {activeComponent.id === 'heat-map-calendar' && (
                          <div className="w-full max-w-md">
                            <HeatMapCalendar
                              weeks={16}
                              color="emerald"
                              label="Design velocity"
                              data={Array.from({ length: 16 * 7 }, (_, i) =>
                                [0, 1, 2, 3, 5, 8, 11][i % 7] + (i % 13 === 0 ? 4 : 0)
                              )}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'hover-card' && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="ghost">@ui99</Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="space-y-1.5">
                                <p className="text-sm font-semibold text-white">UI99 Design System</p>
                                <p className="text-xs text-zinc-400">Velvet-obsidian React kit · WCAG 2.2 audited · RTL-first.</p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}

                        {activeComponent.id === 'keyboard-shortcuts-dialog' && (
                          <>
                            <Button variant="secondary" onClick={() => setDemoShortcutsOpen(true)}>
                              View shortcuts <Kbd>⌘/</Kbd>
                            </Button>
                            <KeyboardShortcutsDialog
                              open={demoShortcutsOpen}
                              onOpenChange={setDemoShortcutsOpen}
                              groups={[
                                {
                                  category: 'Navigation',
                                  shortcuts: [
                                    { description: 'Command palette', keys: ['⌘', 'K'] },
                                    { description: 'Toggle sidebar', keys: ['⌘', 'B'] },
                                  ],
                                },
                                {
                                  category: 'Objects',
                                  shortcuts: [
                                    { description: 'New object', keys: ['⌘', 'N'] },
                                    { description: 'Quick search', keys: ['⌘', 'P'] },
                                  ],
                                },
                              ]}
                            />
                          </>
                        )}

                        {activeComponent.id === 'label' && (
                          <div className="flex flex-col gap-2 items-start">
                            <Label htmlFor="demo-label-input">Email address</Label>
                            <Input id="demo-label-input" placeholder="aria@ui99.dev" className="max-w-xs" />
                          </div>
                        )}

                        {activeComponent.id === 'menubar' && (
                          <Menubar>
                            <MenubarMenu>
                              <MenubarTrigger>File</MenubarTrigger>
                              <MenubarContent>
                                <MenubarItem>New object <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                                <MenubarItem>Export <MenubarShortcut>⌘E</MenubarShortcut></MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem className="text-rose-400">Delete…</MenubarItem>
                              </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                              <MenubarTrigger>View</MenubarTrigger>
                              <MenubarContent>
                                <MenubarItem>Tokens</MenubarItem>
                                <MenubarItem>Registry</MenubarItem>
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                        )}

                        {activeComponent.id === 'meter-bar' && (
                          <div className="w-full max-w-md space-y-4">
                            <MeterBar label="Contrast AAA" value={96} low={60} high={85} optimum={92} showValue />
                            <MeterBar label="Bundle budget" value={71} low={50} high={80} optimum={65} showValue />
                          </div>
                        )}

                        {activeComponent.id === 'navigation-menu' && (
                          <NavigationMenu>
                            <NavigationMenuList>
                              <NavigationMenuItem>
                                <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                  <div className="grid w-[320px] gap-2 p-4">
                                    <NavigationMenuLink href="#">Color psychology</NavigationMenuLink>
                                    <NavigationMenuLink href="#">Elevation & surfaces</NavigationMenuLink>
                                    <NavigationMenuLink href="#">Motion system</NavigationMenuLink>
                                  </div>
                                </NavigationMenuContent>
                              </NavigationMenuItem>
                              <NavigationMenuItem>
                                <NavigationMenuLink href="#">Registry</NavigationMenuLink>
                              </NavigationMenuItem>
                            </NavigationMenuList>
                          </NavigationMenu>
                        )}

                        {activeComponent.id === 'number-field' && (
                          <div className="w-full max-w-xs">
                            <NumberFieldPrimitive
                              value={demoNumberValue}
                              onChange={setDemoNumberValue}
                              min={0}
                              max={99}
                              step={1}
                              label="Opacity"
                              suffix="%"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'otp-input' && (
                          <div className="flex flex-col items-center gap-4">
                            <OTPInputPrimitive value={demoOtpValue} onChange={setDemoOtpValue} length={6} />
                            <p className="text-xs font-mono text-zinc-500">value: {demoOtpValue || '—'}</p>
                          </div>
                        )}

                        {activeComponent.id === 'pagination' && (
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious href="#" />
                              </PaginationItem>
                              <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                              <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                              <PaginationItem>
                                <PaginationNext href="#" />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        )}

                        {activeComponent.id === 'popover' && (
                          <PopoverRoot>
                            <PopoverTrigger asChild>
                              <Button variant="outline">Token details</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-white">--bg-surface</p>
                                <p className="text-xs font-mono text-emerald-300">rgba(14, 14, 19, 0.52)</p>
                                <p className="text-xs text-zinc-400">Dock base · blur(18px) saturate(170%)</p>
                              </div>
                            </PopoverContent>
                          </PopoverRoot>
                        )}

                        {activeComponent.id === 'radio-group' && (
                          <RadioGroup defaultValue="velvet" className="gap-3">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="velvet" id="rg-velvet" />
                              <Label htmlFor="rg-velvet">Velvet Obsidian</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="porcelain" id="rg-porcelain" />
                              <Label htmlFor="rg-porcelain">Porcelain Light</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="system" id="rg-system" disabled />
                              <Label htmlFor="rg-system">System (soon)</Label>
                            </div>
                          </RadioGroup>
                        )}

                        {activeComponent.id === 'rating' && (
                          <div className="flex flex-col items-center gap-3">
                            <RatingPrimitive value={demoRatingValue} onChange={setDemoRatingValue} size="lg" />
                            <p className="text-xs font-mono text-zinc-500">value: {demoRatingValue}</p>
                          </div>
                        )}

                        {activeComponent.id === 'rich-text-editor-bar' && (
                          <div className="w-full max-w-md">
                            <RichTextEditorBarPrimitive activeFormats={['bold', 'code']} />
                          </div>
                        )}

                        {activeComponent.id === 'scroll-area' && (
                          <ScrollArea className="h-44 w-full max-w-sm rounded-2xl border border-white/[0.05] bg-white/[0.015]">
                            <div className="p-4 space-y-3 text-xs text-zinc-400 leading-relaxed">
                              {Array.from({ length: 12 }, (_, i) => (
                                <p key={i}>Registry entry {i + 1} — velvet surface, hairline border, specular rim.</p>
                              ))}
                            </div>
                          </ScrollArea>
                        )}

                        {activeComponent.id === 'search-bar' && (
                          <div className="w-full max-w-md">
                            <SearchBarPrimitive value={demoSearchValue} onChange={setDemoSearchValue} />
                          </div>
                        )}

                        {activeComponent.id === 'separator' && (
                          <div className="w-full max-w-sm space-y-4">
                            <p className="text-xs text-zinc-400">Surfaces above</p>
                            <Separator />
                            <p className="text-xs text-zinc-400">Surfaces below</p>
                          </div>
                        )}

                        {activeComponent.id === 'sheet' && (
                          <SheetDemoRoot>
                            <SheetDemoTrigger asChild>
                              <Button variant="secondary">Open sheet</Button>
                            </SheetDemoTrigger>
                            <SheetDemoContent side="right">
                              <SheetDemoHeader>
                                <SheetDemoTitle>Registry inspector</SheetDemoTitle>
                                <SheetDemoDescription>
                                  Side sheet — mobile-first, backdrop blurred, velvet border.
                                </SheetDemoDescription>
                              </SheetDemoHeader>
                              <div className="p-4 text-xs text-zinc-400">Esc to dismiss · focus is trapped while open.</div>
                            </SheetDemoContent>
                          </SheetDemoRoot>
                        )}

                        {activeComponent.id === 'sidebar' && (
                          <div className="w-full max-w-sm h-64 rounded-3xl border border-white/[0.04] overflow-hidden">
                            <SidebarProvider>
                              <Sidebar>
                                <SidebarHeader>
                                  <span className="text-xs font-mono font-bold text-white px-2">UI99 · Workspace</span>
                                </SidebarHeader>
                                <SidebarBody>
                                  <SidebarItem icon={<Layers className="w-4 h-4" />} label="Objects" isActive href="#" />
                                  <SidebarItem icon={<Palette className="w-4 h-4" />} label="Tokens" href="#" />
                                  <SidebarItem icon={<Package className="w-4 h-4" />} label="Registry" href="#" />
                                </SidebarBody>
                              </Sidebar>
                            </SidebarProvider>
                          </div>
                        )}

                        {activeComponent.id === 'skeleton' && (
                          <div className="w-full max-w-sm space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                          </div>
                        )}

                        {activeComponent.id === 'swatch' && (
                          <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                            <Swatch name="Canvas" hex="#06070A" contrastNote="AAA · 16.9:1" />
                            <Swatch name="Surface 1" hex="#0B0C11" contrastNote="AAA · 15.8:1" />
                            <Swatch name="Emerald 500" hex="#10B981" contrastNote="AA · 4.9:1" />
                            <Swatch name="Rose Intent" hex="#F43F5E" contrastNote="AA · 4.6:1" />
                          </div>
                        )}

                        {activeComponent.id === 'table' && (
                          <div className="w-full max-w-lg rounded-2xl border border-white/[0.04] overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Token</TableHead>
                                  <TableHead>Value</TableHead>
                                  <TableHead>Contrast</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-mono">--bg-canvas</TableCell>
                                  <TableCell className="font-mono">#06070A</TableCell>
                                  <TableCell>16.9:1</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-mono">--text-primary</TableCell>
                                  <TableCell className="font-mono">#EDEDEF</TableCell>
                                  <TableCell>AAA</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {activeComponent.id === 'tag-input' && (
                          <div className="w-full max-w-md">
                            <TagInputPrimitive
                              tags={demoTagList}
                              onChange={setDemoTagList}
                              suggestions={['Radix', 'Motion', 'a11y']}
                              placeholder="Add tag…"
                            />
                          </div>
                        )}

                        {activeComponent.id === 'textarea' && (
                          <div className="w-full max-w-md">
                            <Textarea
                              value={demoTextareaValue}
                              onChange={(e) => setDemoTextareaValue(e.target.value)}
                              placeholder="Describe the design intent…"
                              rows={4}
                            />
                          </div>
                        )}

                        {activeComponent.id === 'time-picker' && (
                          <div className="w-full max-w-xs">
                            <TimePickerPrimitive value={demoTimePickerValue} onChange={(v) => setDemoTimePickerValue(v ?? '09:41')} step={15} />
                          </div>
                        )}

                        {activeComponent.id === 'timeline' && (
                          <div className="w-full max-w-md">
                            <Timeline>
                              <TimelineItem timestamp="09:41" accent="emerald">
                                Tokens audit passed — 22/22 contrast pairs.
                              </TimelineItem>
                              <TimelineItem timestamp="10:15" accent="amber">
                                Registry scan flagged 2 orphan demos.
                              </TimelineItem>
                              <TimelineItem timestamp="11:02" accent="rose">
                                Rose-intent sweep merged to main.
                              </TimelineItem>
                            </Timeline>
                          </div>
                        )}

                        {activeComponent.id === 'toast' && (
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button size="sm" variant="success" onClick={() => addToast('Object saved to space', 'success')}>
                              Success toast
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => addToast('Sync running in background', 'info')}>
                              Info toast
                            </Button>
                            <Button size="sm" variant="rose" onClick={() => addToast('Token gate failed — see logs', 'rose')}>
                              Error toast
                            </Button>
                          </div>
                        )}

                        {activeComponent.id === 'toggle' && (
                          <div className="flex items-center gap-3">
                            <Toggle pressed={demoToggleOn} onPressedChange={setDemoToggleOn} aria-label="Toggle bold">
                              <Bold className="w-4 h-4" />
                            </Toggle>
                            <Toggle variant="outline" aria-label="Toggle italic">
                              <span className="italic font-serif">I</span>
                            </Toggle>
                          </div>
                        )}

                        {activeComponent.id === 'toggle-group' && (
                          <ToggleGroup
                            type="single"
                            value={demoToggleGroup}
                            onValueChange={(v) => v && setDemoToggleGroup(v)}
                          >
                            <ToggleGroupItem value="day" aria-label="Day">Day</ToggleGroupItem>
                            <ToggleGroupItem value="week" aria-label="Week">Week</ToggleGroupItem>
                            <ToggleGroupItem value="month" aria-label="Month">Month</ToggleGroupItem>
                          </ToggleGroup>
                        )}

                        {activeComponent.id === 'top-header' && (
                          <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/[0.03]">
                            <TopHeader />
                          </div>
                        )}

                        {activeComponent.id === 'tour-guide' && (
                          <div className="w-full max-w-md">
                            <TourGuidePrimitive
                              steps={[
                                { badge: '1 / 3', title: 'Welcome to UI99', description: 'A velvet-obsidian design system with a 99-element registry.' },
                                { badge: '2 / 3', title: 'Tokens are law', description: 'Every color, border and shadow derives from src/styles/ui99.css.' },
                                { badge: '3 / 3', title: 'Ship anywhere', description: 'Copy a primitive into any React app — theme follows the DOM.' },
                              ]}
                            />
                          </div>
                        )}

                        {/* General showcase fallback — safety net for future registry additions.
                            Every one of the 99 standard elements ships a dedicated live preview above. */}
                        {!LIVE_PREVIEW_IDS.has(activeComponent.id) && (
                          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-4 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                                {activeComponent.title} Primitive
                              </h3>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                                {activeComponent.description}
                              </p>
                            </div>
                            <div className="pt-2 flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => copyToClipboard(activeComponent.cliCommand, 'fallback-cli')}
                              >
                                {activeComponent.cliCommand}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LIVE INTERACTIVE CONTROLLERS (Props Tweaker) */}
                    <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.03] flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">Live Props:</span>
                      </div>

                      {activeComponent.id === 'button' && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400">variant:</span>
                            <select
                              value={demoBtnVariant}
                              onChange={(e) => setDemoBtnVariant(e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                            >
                              <option value="primary">primary</option>
                              <option value="secondary">secondary</option>
                              <option value="outline">outline</option>
                              <option value="ghost">ghost</option>
                              <option value="rose">rose</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400">size:</span>
                            <select
                              value={demoBtnSize}
                              onChange={(e) => setDemoBtnSize(e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                            >
                              <option value="xs">xs</option>
                              <option value="sm">sm</option>
                              <option value="md">md</option>
                              <option value="lg">lg</option>
                            </select>
                          </div>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={demoBtnLoading}
                              onChange={(e) => setDemoBtnLoading(e.target.checked)}
                              className="rounded accent-emerald-500"
                            />
                            <span className="text-zinc-400">loading</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={demoBtnDisabled}
                              onChange={(e) => setDemoBtnDisabled(e.target.checked)}
                              className="rounded accent-emerald-500"
                            />
                            <span className="text-zinc-400">disabled</span>
                          </label>
                        </>
                      )}

                      {activeComponent.id === 'badge' && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400">variant:</span>
                            <select
                              value={demoBadgeVariant}
                              onChange={(e) => setDemoBadgeVariant(e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono"
                            >
                              <option value="default">default</option>
                              <option value="secondary">secondary</option>
                              <option value="outline">outline</option>
                              <option value="success">success</option>
                              <option value="warning">warning</option>
                              <option value="destructive">destructive</option>
                            </select>
                          </div>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={demoBadgePulse}
                              onChange={(e) => setDemoBadgePulse(e.target.checked)}
                              className="rounded accent-emerald-500"
                            />
                            <span className="text-zinc-400">pulse</span>
                          </label>
                        </>
                      )}

                      {activeComponent.id === 'input' && (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={demoInputDisabled}
                            onChange={(e) => setDemoInputDisabled(e.target.checked)}
                            className="rounded accent-emerald-500"
                          />
                          <span className="text-zinc-400">disabled</span>
                        </label>
                      )}

                      {activeComponent.id === 'color-picker' && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Presets:</span>
                          {['#3B82F6', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setDemoColor(c)}
                              className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      )}

                      {activeComponent.id === 'password-input' && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Score:</span>
                          <span className="text-emerald-400 font-bold">{demoPasswordScore} / 4</span>
                        </div>
                      )}

                      {activeComponent.id === 'switch' && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">State:</span>
                          <span className="text-emerald-400 font-bold">{demoSwitchChecked ? 'True' : 'False'}</span>
                        </div>
                      )}

                      {activeComponent.id === 'slider' && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Value:</span>
                          <span className="text-emerald-400 font-bold">{demoSliderValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* CODE TAB VIEW */
                  <div className="w-full">
                    <CodeBlock
                      code={activeComponent.codeSnippet}
                      language="tsx"
                      filename={`src/components/ui/${activeComponent.name}.tsx`}
                      showLineNumbers={true}
                      maxHeight="520px"
                      allowCollapse={true}
                    />
                  </div>
                )}
              </section>

              {/* ── SECTION 2: INSTALLATION (SHADCN STEP-BY-STEP) ── */}
              <section id="installation" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    Installation
                  </h2>
                </div>

                {/* Installation Method Toggle: CLI vs Manual */}
                <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.04] pb-2">
                  <button
                    type="button"
                    onClick={() => setInstallMethod('cli')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      installMethod === 'cli'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    CLI
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallMethod('manual')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      installMethod === 'manual'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Manual
                  </button>
                </div>

                {installMethod === 'cli' ? (
                  <div className="space-y-3">
                    {/* Package manager switcher: pnpm / npm / yarn / bun */}
                    <div className="flex items-center gap-1.5">
                      {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPackageManager(pm)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                            packageManager === pm
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.02]'
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>

                    <CodeBlock
                      code={getCliCommand(activeComponent.name, packageManager)}
                      language="bash"
                      showLineNumbers={false}
                    />
                  </div>
                ) : (
                  /* MANUAL INSTALLATION STEPS */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        1. Install required primitive packages:
                      </span>
                      <CodeBlock
                        code={`npm i ${activeComponent.dependencies.join(' ')}`}
                        language="bash"
                        showLineNumbers={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        2. Copy component source code to{' '}
                        <code className="text-emerald-400">
                          src/components/ui/{activeComponent.name}.tsx
                        </code>
                      </span>
                      <CodeBlock
                        code={activeComponent.codeSnippet}
                        language="tsx"
                        filename={`src/components/ui/${activeComponent.name}.tsx`}
                        showLineNumbers={true}
                        maxHeight="320px"
                        allowCollapse={true}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* ── SECTION 3: USAGE ── */}
              <section id="usage" className="space-y-3 pt-4">
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Usage
                </h2>
                <CodeBlock
                  code={activeComponent.usageSnippet}
                  language="tsx"
                  filename="App.tsx"
                  showLineNumbers={true}
                />
              </section>

              {/* ── SECTION 4: API REFERENCE (PROPS TABLE) ── */}
              <section id="props" className="space-y-3 pt-4">
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  API Reference
                </h2>
                <p className="text-xs font-mono text-zinc-500">
                  TypeScript interfaces and runtime props for {activeComponent.title}.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-black/[0.06] dark:border-white/[0.04]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] dark:border-white/[0.04] bg-zinc-100/50 dark:bg-white/[0.02]">
                        <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-200">Prop</th>
                        <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-200">Type</th>
                        <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-200">Default</th>
                        <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-200">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.03]">
                      {activeComponent.props.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                          <td className="p-3 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                            {p.name}
                          </td>
                          <td className="p-3 font-mono text-zinc-400 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.04] text-zinc-300">
                              {p.type}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-zinc-500 whitespace-nowrap">
                            {p.default || '-'}
                          </td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-300 leading-relaxed min-w-[200px]">
                            {p.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── SECTION 5: ACCESSIBILITY & KEYBOARD SPECS ── */}
              <section id="accessibility" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    Accessibility & Keyboard Navigation
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    WCAG 2.2 AAA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-100/60 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <h3 className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Focus & State Management
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Equipped with <code className="text-emerald-400 font-mono">focus-ui99</code> double-ring indicator (2px canvas gap + 2px emerald focus ring) meeting WCAG 2.4.11 / 2.4.13 focus appearance guidelines.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-100/60 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <h3 className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Keyboard Interaction
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Full keyboard operability with <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono">Tab</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono">Enter</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono">Space</kbd>, and arrow key navigation in RTL & LTR modes.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── SECTION 6: PAGINATION FOOTER (PREV / NEXT) ── */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                {prevItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(prevItem.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                  >
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {prevItem.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(nextItem.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                  >
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      Next <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {nextItem.title}
                    </span>
                  </button>
                )}
              </footer>
            </article>
          )}

          {/* ========================================================
              VIEW 2: GETTING STARTED GUIDES (SHADCN PATTERN)
             ======================================================== */}

          {/* GUIDE 1: INTRODUCTION */}
          {activeSection === 'intro' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <div className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-mono bg-zinc-100 dark:bg-[#0E0E14] text-zinc-600 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04]">
                  v{KIT_VERSION} · {KIT_COMPONENT_COUNT} components · WCAG-verified · MIT
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Introduction.
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  Re-usable components built using Radix UI primitives, Tailwind CSS, and Velvet Obsidian Dark design tokens.
                </p>
              </header>

              <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <p>
                  <strong className="text-zinc-900 dark:text-white font-semibold">UI \ [99]</strong> is <strong>NOT</strong> a component library in the traditional sense of an immutable npm package. It is a collection of re-usable components that you can copy and paste directly into your apps.
                </p>

                <div className="p-5 rounded-3xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] space-y-3">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Core Architecture Principles
                  </h3>
                  <ul className="space-y-2 text-xs text-zinc-400 list-disc pl-4">
                    <li><strong>Ownership:</strong> You own the code. Customize components according to your application requirements.</li>
                    <li><strong>Velvet Obsidian Dark:</strong> Mathematical tokens locked to pure #06070A canvas and sub-pixel specular rim highlights.</li>
                    <li><strong>Linear Speed:</strong> Physics-based spring animations with motion/react for instant tactile response.</li>
                    <li><strong>Type Safety:</strong> 100% TypeScript strict typing with complete JSDoc annotations.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4">
                  <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                    Quick Start
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Run the init command to bootstrap the design tokens into your project:
                  </p>
                  <CodeBlock
                    code="npx @99/ui init"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <div />
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('installation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Installation
                  </span>
                </button>
              </footer>
            </article>
          )}

          {/* GUIDE 2: INSTALLATION */}
          {activeSection === 'installation' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Installation
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  How to install dependencies and configure your project for UI \ [99].
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    1. Create React + Vite Project
                  </h3>
                  <CodeBlock
                    code="npm create vite@latest my-app -- --template react-ts"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    2. Install Core Utility Packages
                  </h3>
                  <CodeBlock
                    code="npm install clsx tailwind-merge lucide-react motion"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    3. Add cn() helper to src/lib/utils.ts
                  </h3>
                  <CodeBlock
                    code={`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
                    language="typescript"
                    filename="src/lib/utils.ts"
                    showLineNumbers={true}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    4. Configure Velvet Obsidian Dark in src/index.css
                  </h3>
                  <CodeBlock
                    code={`@import "tailwindcss";

.dark {
  --bg-canvas: #06070A;
  --bg-surface-1: #0B0C11;
  --bg-surface-2: #131318;
  --border-specular: rgba(255, 255, 255, 0.04);
}`}
                    language="css"
                    filename="src/index.css"
                    showLineNumbers={true}
                  />
                </div>
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('intro');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Introduction
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('theming');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Theming & Tokens
                  </span>
                </button>
              </footer>
            </article>
          )}

          {/* GUIDE 3: THEMING */}
          {activeSection === 'theming' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Theming & Design Tokens
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  Mathematical color tokens, specular rim highlights, and diffusion shadow profiles.
                </p>
              </header>

              {/* Swatch Palette Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#06070A] border border-white/[0.08] space-y-2">
                  <div className="h-14 rounded-xl bg-[#06070A] border border-white/[0.04]" />
                  <div className="text-xs font-mono font-bold text-white">#06070A</div>
                  <div className="text-[11px] font-mono text-zinc-400">Canvas Root</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0C11] border border-white/[0.08] space-y-2">
                  <div className="h-14 rounded-xl bg-[#0B0C11] border border-white/[0.04]" />
                  <div className="text-xs font-mono font-bold text-white">#0B0C11</div>
                  <div className="text-[11px] font-mono text-zinc-400">Surface Layer 1</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#131318] border border-white/[0.08] space-y-2">
                  <div className="h-14 rounded-xl bg-[#131318] border border-white/[0.04]" />
                  <div className="text-xs font-mono font-bold text-white">#131318</div>
                  <div className="text-[11px] font-mono text-zinc-400">Elevated Modals</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  Specular Rim Highlight System
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every obsidian card utilizes an ultra-fine sub-pixel rim highlight on the top edge to create tactile material depth without bright solid borders:
                </p>
                <CodeBlock
                  code={`/* Standard Specular Top Rim Highlight */
box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);

/* Diffused Ambient Elevation */
box-shadow: 0 18px 40px -10px rgba(0, 0, 0, 0.65);`}
                  language="css"
                  showLineNumbers={false}
                />
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('installation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Installation
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('npm-guide');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Registry Architecture
                  </span>
                </button>
              </footer>
            </article>
          )}

          {/* GUIDE 4: REGISTRY ARCHITECTURE (NPM GUIDE) */}
          {activeSection === 'npm-guide' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Registry Architecture
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  How UI \ [99] distributes zero-dependency copy-paste components via standard JSON registry schemas.
                </p>
              </header>

              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] space-y-3">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    How It Works
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    When you run <code>npx @99/ui add button</code>, the CLI fetches the component recipe from <code>/registry.json</code>, resolves peer dependencies, and places the component file directly into your workspace.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Registry Schema Example (registry.json)
                  </h3>
                  <CodeBlock
                    code={`{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "dependencies": ["clsx", "tailwind-merge", "lucide-react"],
  "files": [
    {
      "path": "ui/button.tsx",
      "type": "registry:ui"
    }
  ]
}`}
                    language="json"
                    filename="public/registry.json"
                    showLineNumbers={true}
                  />
                </div>
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('theming');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Theming & Tokens
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('cli');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    CLI Reference
                  </span>
                </button>
              </footer>
            </article>
          )}

          {/* GUIDE 5: CLI REFERENCE */}
          {activeSection === 'cli' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  CLI Reference
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  Command-line interface commands for adding components and blocks.
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Initialize Configuration
                  </h3>
                  <CodeBlock
                    code="npx @99/ui init"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Add Component
                  </h3>
                  <CodeBlock
                    code="npx @99/ui add button card dialog switch"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Add Block
                  </h3>
                  <CodeBlock
                    code="npx @99/ui add linear-issue-tracker"
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('npm-guide');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Registry Architecture
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('changelog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Changelog &amp; Releases
                  </span>
                </button>
              </footer>
            </article>
          )}

          {/* GUIDE 6: CHANGELOG & RELEASES (audit P3 — versioning on the site) */}
          {activeSection === 'changelog' && (
            <article className="space-y-8">
              <header className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.04]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Changelog &amp; Releases
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  Every release of UI \ [99], versioned with Changesets and gated by the full quality pipeline.
                </p>
              </header>

              {/* Current release — version is GENERATED (src/generated/kit-count.ts), never hard-coded */}
              <div className="p-5 sm:p-6 rounded-3xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-950 text-white dark:bg-white/[0.08] dark:text-white text-xs font-mono font-bold">
                    <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                    v{KIT_VERSION}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LATEST · STABLE
                  </span>
                  <span className="text-xs font-mono text-zinc-400">@99/ui — first stable, publish-ready</span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white">Registry v2.1 (shadcn-grade).</strong>{' '}
                      {KIT_COMPONENT_COUNT} components scanned from source with title/description/category/keywords and a verified meta.a11y contract — the docs and the registry can never drift again.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white">CLI v2 (plug-able).</strong>{' '}
                      Multi-registry resolution (flag → components.json → env → repo → bundled snapshot → published URL), init with resolvedPaths, search, --dry-run.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white">Publish-ready npm kit.</strong>{' '}
                      exports map (8 paths incl. porcelain + tailwind.css), files whitelist, peerDependencies react/react-dom, sideEffects CSS-only — audited by a CI gate.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white">Audit matrix.</strong>{' '}
                      20 heavy primitives axe-clean + disabled + focus-ui99 gates; All-Props Lab covers 31 interactive primitives with live props and copy-ready JSX.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-950 dark:text-white">daisyUI-class gateway.</strong>{' '}
                      @99/ui/tailwind.css semantic classes (ui-btn, ui-card, ui-input, ui-badge) generated from the same audited token layer.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Release process — the flow docs/RELEASE.md prescribes */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  How releases are cut
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Versions are minted by Changesets — never bumped by hand. A pull request carrying a changeset
                  file lands its notes in the generated CHANGELOG.md and GitHub Releases on the next{' '}
                  <code className="mx-1 px-1 py-0.5 rounded bg-zinc-200/60 dark:bg-white/[0.06] font-mono text-[11px]">version-packages</code>{' '}
                  run. The full checklist lives in{' '}
                  <code className="px-1 py-0.5 rounded bg-zinc-200/60 dark:bg-white/[0.06] font-mono text-[11px]">docs/RELEASE.md</code>.
                </p>
                <CodeBlock
                  code={`bun run changeset          # describe the change (semver intent)\nbun run version-packages   # bump version + generate CHANGELOG.md\nbun run lib:build          # rebuild the kit with the new version baked in\ncd dist-kit && npm publish`}
                  language="bash"
                  showLineNumbers={false}
                />
              </div>

              <div className="p-4 rounded-2xl border border-black/[0.05] dark:border-white/[0.04] bg-white/[0.02] text-[11px] font-mono text-zinc-500 dark:text-zinc-400 leading-relaxed">
                The version shown on this page, the header badge, and the registry envelope are all generated
                from one source — <code className="text-emerald-400">src/generated/kit-count.ts</code> — so the site can never advertise a version the package is not.
              </div>

              {/* Pagination */}
              <footer className="flex items-center justify-between pt-10 border-t border-black/[0.06] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('cli');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-start gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    CLI Reference
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('button');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-end gap-1 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-right"
                >
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Button Component
                  </span>
                </button>
              </footer>
            </article>
          )}
        </div>

        {/* ── RIGHT COLUMN: "ON THIS PAGE" TABLE OF CONTENTS (2 cols on xl) ── */}
        <aside className="hidden xl:block xl:col-span-2 space-y-4 sticky top-16 select-none pl-4 border-l border-black/[0.04] dark:border-white/[0.03]">
          <div className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-emerald-400" />
            <span>On This Page</span>
          </div>

          <div className="space-y-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {activeComponent ? (
              <>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('preview')}
                  className="block hover:text-black dark:hover:text-white py-1 transition-colors text-left"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('installation')}
                  className="block hover:text-black dark:hover:text-white py-1 transition-colors text-left"
                >
                  Installation
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('usage')}
                  className="block hover:text-black dark:hover:text-white py-1 transition-colors text-left"
                >
                  Usage
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('props')}
                  className="block hover:text-black dark:hover:text-white py-1 transition-colors text-left"
                >
                  API Reference
                </button>
              </>
            ) : (
              <>
                <div className="text-zinc-400 py-1">Overview</div>
                <div className="text-zinc-400 py-1">Step-by-Step</div>
                <div className="text-zinc-400 py-1">Architecture</div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.03] space-y-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast('Page URL copied to clipboard', 'success');
              }}
              className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-emerald-400" />
              <span>Share Page</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
