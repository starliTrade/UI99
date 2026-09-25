/**
 * UI \ [99] — Official Product Home & 99-Element Component Registry Studio
 *
 * Full dual-theme (Dark Obsidian / Crisp Light Mode) support,
 * 99-Element registry filtering, live interactive props playground,
 * Code viewer, CLI package managers, and token inspector.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Copy,
  Check,
  Search,
  Terminal,
  Github,
  Sparkles,
  Layers,
  Code2,
  Eye,
  Sliders,
  CheckCircle2,
  Zap,
  Command,
  ShieldCheck,
  ChevronRight,
  MousePointerClick,
  Bell,
  BarChart3,
  Layout,
  BookOpen,
  Boxes,
  Palette,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useChoreography, Reveal } from '../ui/motion';
import { TokenLatticeHero } from '../ui/TokenLatticeHero';
import { KIT_COMPONENT_COUNT } from '../../generated/kit-count';
import {
  Button,
  IconButton,
  Tag,
  Badge,
  StatusBadge,
  PriorityBadge,
  Switch,
  Input,
  Textarea,
  SearchBar,
  Kbd,
  Avatar,
  AvatarStack,
  Sparkline,
  StatTile,
  MeterBar,
  TrendDelta,
  Progress,
  SegmentedControl,
  Slider,
  Checkbox,
  Radio,
  Tooltip,
  Accordion,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CodeBlock,
  Breadcrumb,
  Skeleton,
  Separator,
  Label,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  ScrollArea,
  Alert,
  RadioGroup,
  RadioGroupItem,
  Stepper,
  Timeline,
  FileUpload,
  DonutRing,
  HeatMapCalendar,
  DatePicker,
  TimePicker,
  Combobox,
  Rating,
  OTPInput,
  CopyButton,
  Swatch,
  NumberField,
  ColorPicker,
  PasswordInput,
  TagInput,
  Banner,
  EmptyPlaceholder,
  TourGuide,
  Confetti,
  TreeView,
  KanbanBoard,
  DiffViewer,
  CalendarView,
  AudioPlayer,
  TerminalEmulator,
  ActivityFeed,
  LinearIssueTracker,
  UI99Wordmark,
} from '../ui';
import { REGISTRY_COMPONENTS, ComponentRegistryItem } from '../../registry/registryData';

export function DesignSystemHomeView() {
  const { setCurrentTab, addToast, setFocusComponent } = useApp();
  const { reveal } = useChoreography();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<string>('button');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [studioView, setStudioView] = useState<'stage' | 'code' | 'cli' | 'tokens'>('stage');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Playground State for Core Families
  const [btnVariant, setBtnVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'rose'>('primary');
  const [btnSize, setBtnSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');
  const [btnLoading, setBtnLoading] = useState(false);

  const [badgeStatus, setBadgeStatus] = useState<'in_progress' | 'todo' | 'review' | 'done' | 'canceled'>('in_progress');
  const [badgePriority, setBadgePriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('urgent');
  const [badgeVariant, setBadgeVariant] = useState<'default' | 'green' | 'amber' | 'destructive' | 'purple' | 'blue'>('green');

  const [switchChecked, setSwitchChecked] = useState(true);
  const [inputValue, setInputValue] = useState('Obsidian Velvet Surface');
  const [passwordValue, setPasswordValue] = useState('Vault@2026!Secure');
  const [otpValue, setOtpValue] = useState('9942');
  const [colorValue, setColorValue] = useState('#10B981');
  const [sliderValue, setSliderValue] = useState(78);
  const [progressValue, setProgressValue] = useState(86);
  const [ratingValue, setRatingValue] = useState(4.5);
  const [numberValue, setNumberValue] = useState(99);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [segmentedValue, setSegmentedValue] = useState('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tags, setTags] = useState(['react', 'tailwind-v4', 'obsidian', 'linear']);
  const [toggleState, setToggleState] = useState(true);

  const [packageManager, setPackageManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');

  const getCliCommand = (compName: string, pm: 'npm' | 'pnpm' | 'yarn' | 'bun' = packageManager) => {
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

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const categories = [
    { id: 'all', label: 'All (99)', count: 99, icon: Layers },
    { id: 'actions', label: 'Actions & Buttons', count: 10, icon: MousePointerClick },
    { id: 'forms', label: 'Forms & Inputs', count: 20, icon: Sliders },
    { id: 'data', label: 'Data & Metrics', count: 15, icon: BarChart3 },
    { id: 'feedback', label: 'Feedback & Badges', count: 12, icon: Bell },
    { id: 'navigation', label: 'Navigation', count: 12, icon: Layout },
    { id: 'overlays', label: 'Overlays & Dialogs', count: 12, icon: Sparkles },
    { id: 'workflow', label: 'Workflow & Complex', count: 18, icon: Code2 },
  ];

  const categoryMap: Record<string, string[]> = {
    actions: [
      'button', 'icon-button', 'split-button', 'copy-button', 'toggle',
      'toggle-group', 'floating-action-button', 'link-button', 'dropdown-button', 'wordmark'
    ],
    forms: [
      'input', 'textarea', 'search-input', 'password-input', 'number-field',
      'otp-input', 'pin-input', 'currency-input', 'tag-input', 'color-picker',
      'date-picker', 'date-range-picker', 'time-picker', 'slider', 'range-slider',
      'switch', 'checkbox', 'checkbox-group', 'radio', 'radio-group', 'segmented-control'
    ],
    data: [
      'table', 'data-table', 'code-block', 'sparkline', 'stat-tile',
      'metric-card', 'trend-delta', 'donut-ring', 'heatmap-calendar', 'meter-bar',
      'progress', 'avatar', 'avatar-stack', 'kbd', 'badge'
    ],
    feedback: [
      'status-badge', 'priority-badge', 'tag', 'alert', 'banner',
      'spinner', 'skeleton', 'toast', 'empty-placeholder', 'empty-state',
      'loading-state', 'confetti'
    ],
    navigation: [
      'tabs', 'tabs-list', 'tabs-trigger', 'tabs-content', 'breadcrumb',
      'pagination', 'stepper', 'timeline', 'bottom-navigation', 'top-header',
      'scroll-area', 'sidebar'
    ],
    overlays: [
      'dialog', 'sheet', 'drawer', 'popover', 'tooltip',
      'hover-card', 'context-menu', 'dropdown-menu', 'command-menu', 'command-bar',
      'alert-modal', 'modal'
    ],
    workflow: [
      'terminal-emulator', 'kanban-board', 'linear-issue-tracker', 'diff-viewer', 'calendar-view',
      'audio-player', 'activity-feed', 'tree-view', 'tour-guide', 'rich-text-editor-bar',
      'signature-pad', 'file-upload', 'combobox', 'swatch', 'rating',
      'card', 'accordion', 'collapsible'
    ],
  };

  const filteredComponents = REGISTRY_COMPONENTS.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.primitive && c.primitive.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q));

    const matchesCategory =
      activeCategory === 'all' ||
      c.category.toLowerCase().includes(activeCategory) ||
      (categoryMap[activeCategory] && categoryMap[activeCategory].includes(c.id));

    return matchesSearch && matchesCategory;
  });

  const currentComp: ComponentRegistryItem =
    REGISTRY_COMPONENTS.find((c) => c.id === activeComponentId) || REGISTRY_COMPONENTS[0];

  return (
    <div className="w-full pb-16 px-0 sm:px-1 max-w-6xl mx-auto text-zinc-900 dark:text-white select-none transition-colors">

      {/* ══════════════════════════════════════════════════════════════
          1 · HERO SECTION (Obsidian Velvet + Soft Emerald Brand Halo)
         ══════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-start pb-6 sm:pb-10 overflow-visible">
        {/* Token Lattice — the one 3D moment on the site. Colours are read
            live from CSS custom properties, so it re-themes with the product
            and proves the token layer in motion. Decorative, aria-hidden,
            reduced-motion aware, and pauses when off-screen. */}
        <TokenLatticeHero className="absolute -top-6 sm:-top-10 right-0 hidden sm:block w-[46%] max-w-[560px] h-[300px] lg:h-[380px] -z-10 pointer-events-none opacity-90" />

        {/* Soft, faint emerald brand ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/3 -translate-x-1/2 w-[280px] sm:w-[700px] h-[220px] sm:h-[380px] rounded-(--radius-pill) blur-(--blur-ambient) sm:blur-(--blur-ambient) pointer-events-none -z-10 opacity-70 dark:opacity-85 transition-opacity"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.035) 40%, rgba(255, 255, 255, 0.015) 60%, transparent 80%)',
          }}
        />

        {/* Secondary ambient specular feather */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-1/4 w-[200px] sm:w-[400px] h-[160px] sm:h-[260px] rounded-(--radius-pill) blur-(--blur-ambient) sm:blur-(--blur-ambient) pointer-events-none -z-10 opacity-40 dark:opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
          }}
        />

        {/* Main Display Headline — minimal, dotted, per house style */}
        <motion.h1
          {...reveal(0)}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-semibold tracking-[-0.035em] sm:tracking-[-0.04em] text-zinc-950 dark:text-[#EDEDEF] leading-[1.08] sm:leading-[1.03] text-left font-['Inter',_'Plus_Jakarta_Sans',_sans-serif]"
        >
          Stop rebuilding
          <br />
          what already works.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...reveal(2)}
          className="mt-3.5 sm:mt-5 text-xs sm:text-sm md:text-[15px] text-zinc-600 dark:text-[#8E909D] leading-relaxed text-left max-w-xl font-normal tracking-[-0.01em] font-['Inter',_'Plus_Jakarta_Sans',_sans-serif]"
        >
          {KIT_COMPONENT_COUNT} accessible primitives, each one already WCAG 2.2
          audited, axe-core clean, and contrast-verified. Own the source, drop it
          into any React app, and ship in an afternoon.
        </motion.p>

        {/* Hero Actions: Unified Horizontal Action Row */}
        <motion.div
          {...reveal(3)}
          className="relative mt-5 sm:mt-7 flex flex-wrap items-center gap-2.5 w-full sm:w-auto"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-(--radius-control) bg-emerald-500/[0.03] dark:bg-emerald-400/[0.03] blur-xl pointer-events-none -z-10"
          />

          {/* 1. Primary Action: Browse 99 Components */}
          <button
            type="button"
            onClick={() => setCurrentTab('UIKIT')}
            className="h-9 px-3.5 rounded-(--radius-field) inline-flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all bg-zinc-900 dark:bg-[#EDEDEF] hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            <span>Explore {KIT_COMPONENT_COUNT} Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* 2. Secondary Action: Documentation */}
          <button
            type="button"
            onClick={() => setCurrentTab('DOCS')}
            className="h-9 px-3.5 rounded-(--radius-field) inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer transition-all bg-zinc-100 dark:bg-[#0E0E14] hover:bg-zinc-200/80 dark:hover:bg-[#15161E] text-zinc-800 dark:text-[#EDEDEF] border border-zinc-200/80 dark:border-white/[0.04] hover:border-zinc-300 dark:hover:border-white/[0.08] shadow-(--shadow-card) active:scale-[0.98] whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Interactive Docs</span>
          </button>

          {/* 3. GitHub Action */}
          <button
            type="button"
            onClick={() => window.open('https://github.com/starliTrade/UI99', '_blank', 'noopener')}
            className="h-9 px-3 rounded-(--radius-field) inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer transition-all bg-zinc-100 dark:bg-[#0E0E14] hover:bg-zinc-200/80 dark:hover:bg-[#15161E] text-zinc-800 dark:text-[#EDEDEF] border border-zinc-200/80 dark:border-white/[0.04] hover:border-zinc-300 dark:hover:border-white/[0.08] shadow-(--shadow-card) active:scale-[0.98] whitespace-nowrap"
          >
            <Github className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>GitHub</span>
          </button>

          {/* 4. Terminal Action: CLI Install Box */}
          <div className="h-9 inline-flex items-center justify-between gap-2.5 pl-3 pr-1.5 rounded-(--radius-field) bg-zinc-100 dark:bg-[#0A0B10] border border-zinc-200/80 dark:border-white/[0.035] shadow-(--shadow-card) text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold select-none text-xs tracking-tight">
                &gt;_
              </span>
              <span className="font-medium text-zinc-800 dark:text-[#EDEDEF] text-xs">
                npx @99/ui init
              </span>
            </span>
            <button
              type="button"
              onClick={() => copy('npx @99/ui init', 'cli-init')}
              aria-label="Copy CLI command"
              className="p-1 rounded-(--radius-sm) hover:bg-zinc-200 dark:hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
            >
              {copiedKey === 'cli-init' ? (
                <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2 · WORLD-CLASS 99-ELEMENT COMPONENT REGISTRY STUDIO
         ══════════════════════════════════════════════════════════════ */}
      <Reveal index={4}>
        <div className="mt-4 sm:mt-8 rounded-(--radius-control) sm:rounded-(--radius-lg) border border-zinc-200/60 dark:border-white/[0.03] bg-white dark:bg-[#0C0D12] shadow-(--elevation-3) dark:shadow-(--elevation-4) overflow-hidden transition-all">
          {/* 1. Studio Top Navigation & Control Bar */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-200/50 dark:border-white/[0.03] bg-zinc-50/70 dark:bg-[#090A0E] flex items-center justify-between gap-2 sm:gap-4 flex-nowrap min-w-0">
            {/* Left: Active Component Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-(--radius-pill) h-2 w-2 bg-emerald-500" />
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono min-w-0 truncate">
                <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline shrink-0">Registry</span>
                <span className="text-zinc-400 dark:text-zinc-600 hidden sm:inline shrink-0">/</span>
                <span className="font-semibold text-zinc-950 dark:text-white truncate">
                  {currentComp.title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200/50 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border border-zinc-300/40 dark:border-white/[0.03] shrink-0">
                  {currentComp.primitive || 'Native'}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  WCAG AAA
                </span>
              </div>
            </div>

            {/* Right: Studio Mode Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="flex items-center gap-0.5 p-0.5 rounded-(--radius-field) bg-zinc-200/50 dark:bg-[#111218] border border-zinc-300/40 dark:border-white/[0.03]">
                {[
                  { id: 'stage', label: 'Preview', icon: Eye },
                  { id: 'code', label: 'Code', icon: Code2 },
                  { id: 'cli', label: 'CLI', icon: Terminal },
                  { id: 'tokens', label: 'Tokens', icon: Palette },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setStudioView(v.id as any)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-(--radius-sm) text-xs font-mono transition-all cursor-pointer ${
                      studioView === v.id
                        ? 'bg-white dark:bg-white text-zinc-950 dark:text-zinc-950 font-bold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <v.icon className="w-3 h-3 shrink-0" />
                    <span className="text-[11px] sm:text-xs">{v.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFocusComponent(currentComp.name);
                  setCurrentTab('DOCS');
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-(--radius-field) text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0"
              >
                <span>Full API</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. Component Horizontal Category & Carousel Shelf */}
          <div className="border-b border-zinc-200/50 dark:border-white/[0.03] bg-zinc-100/40 dark:bg-[#07080B]">
            {/* Category Filter Pills */}
            <div className="px-3 sm:px-4 pt-2.5 pb-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-(--radius-sm) text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-zinc-900 dark:bg-white/[0.08] text-white dark:text-[#EDEDEF] font-semibold border border-transparent dark:border-white/[0.08]'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <cat.icon className="w-3 h-3 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Component Horizontal Ribbon & Filter */}
            <div className="px-3 sm:px-4 py-2 border-t border-zinc-200/40 dark:border-white/[0.02] flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x">
              {/* Search filter pill */}
              <div className="relative shrink-0 w-32 xs:w-40 sm:w-48">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 99 elements..."
                  className="w-full pl-7 pr-2.5 py-1 rounded-(--radius-sm) bg-white dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.04] text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 font-mono"
                />
              </div>

              <div className="h-4 w-px bg-zinc-300/70 dark:bg-white/[0.08] shrink-0" />

              {/* Horizontal Components Ribbon (Supporting All {KIT_COMPONENT_COUNT} Elements) */}
              <div className="flex items-center gap-1.5 shrink-0">
                {filteredComponents.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveComponentId(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-(--radius-sm) text-xs font-mono whitespace-nowrap transition-all cursor-pointer border min-h-[30px] sm:min-h-[32px] ${
                      activeComponentId === c.id
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-white/[0.03] hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{c.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Spacious Interactive Stage Canvas */}
          <div className="p-3 sm:p-6 md:p-8 bg-white dark:bg-[#0C0D12]">
            {/* ─── STAGE (PREVIEW) ─── */}
            {studioView === 'stage' && (
              <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-4">
                {/* Canvas Area with Velvet Dot Background */}
                <div className="relative min-h-[220px] sm:min-h-[290px] rounded-(--radius-control) bg-zinc-50/80 dark:bg-[#060709] border border-zinc-200/80 dark:border-white/[0.025] p-4 sm:p-8 flex items-center justify-center overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Live Component Render Area */}
                  <div className="relative z-10 w-full max-w-lg flex items-center justify-center">
                    {/* BUTTONS & ACTIONS */}
                    {activeComponentId === 'button' && (
                      <Button
                        variant={btnVariant}
                        size={btnSize}
                        loading={btnLoading}
                        onClick={() => {
                          setBtnLoading(true);
                          setTimeout(() => setBtnLoading(false), 900);
                        }}
                      >
                        Interactive Button
                      </Button>
                    )}

                    {activeComponentId === 'icon-button' && (
                      <div className="flex items-center gap-3">
                        <IconButton icon={<Sparkles className="w-4 h-4" />} aria-label="Sparkles" variant="primary" />
                        <IconButton icon={<Github className="w-4 h-4" />} aria-label="Github" variant="secondary" />
                        <IconButton icon={<Terminal className="w-4 h-4" />} aria-label="Terminal" variant="outline" />
                        <IconButton icon={<Zap className="w-4 h-4" />} aria-label="Zap" variant="ghost" />
                      </div>
                    )}

                    {activeComponentId === 'copy-button' && (
                      <div className="flex items-center gap-3 p-3 rounded-(--radius-field) bg-zinc-100 dark:bg-[#0A0B10] border border-zinc-200 dark:border-white/[0.04]">
                        <code className="text-xs font-mono text-emerald-500">npx @99/ui add button</code>
                        <CopyButton text="npx @99/ui add button" />
                      </div>
                    )}

                    {activeComponentId === 'toggle' && (
                      <div className="flex items-center gap-3">
                        <Toggle pressed={toggleState} onPressedChange={setToggleState} aria-label="Toggle pin">
                          <Sparkles className="w-4 h-4 mr-2" />
                          <span>Velvet Mode</span>
                        </Toggle>
                      </div>
                    )}

                    {activeComponentId === 'toggle-group' && (
                      <ToggleGroup type="single" defaultValue="center">
                        <ToggleGroupItem value="left" aria-label="Align left">Left</ToggleGroupItem>
                        <ToggleGroupItem value="center" aria-label="Align center">Center</ToggleGroupItem>
                        <ToggleGroupItem value="right" aria-label="Align right">Right</ToggleGroupItem>
                      </ToggleGroup>
                    )}

                    {/* BADGES & FEEDBACK */}
                    {activeComponentId === 'badge' && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <StatusBadge status={badgeStatus} showLabel={true} />
                        <PriorityBadge priority={badgePriority} showLabel={true} />
                        <Badge variant={badgeVariant}>Operational</Badge>
                        <Tag variant="purple">UI \ [99]</Tag>
                      </div>
                    )}

                    {activeComponentId === 'status-badge' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status="in_progress" showLabel />
                        <StatusBadge status="done" showLabel />
                        <StatusBadge status="review" showLabel />
                        <StatusBadge status="todo" showLabel />
                      </div>
                    )}

                    {activeComponentId === 'priority-badge' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority="urgent" showLabel />
                        <PriorityBadge priority="high" showLabel />
                        <PriorityBadge priority="medium" showLabel />
                        <PriorityBadge priority="low" showLabel />
                      </div>
                    )}

                    {activeComponentId === 'alert' && (
                      <Alert variant="default" title="Linear Engine Ready">
                        All 99 UI primitives compiled with zero runtime bundle overhead.
                      </Alert>
                    )}

                    {activeComponentId === 'banner' && (
                      <Banner
                        title="Obsidian Velvet System 2.0"
                        description="Sub-pixel specular border highlights and WCAG 2.2 AAA certified."
                        variant="emerald"
                      />
                    )}

                    {/* FORM CONTROLS */}
                    {activeComponentId === 'input' && (
                      <div className="w-full space-y-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type text..."
                        />
                        <p className="text-[11px] font-mono text-zinc-500 text-center">
                          Value: "{inputValue}"
                        </p>
                      </div>
                    )}

                    {activeComponentId === 'password-input' && (
                      <div className="w-full space-y-2">
                        <PasswordInput
                          value={passwordValue}
                          onChange={(e) => setPasswordValue(e.target.value)}
                          placeholder="Enter secure password"
                          showStrength
                        />
                      </div>
                    )}

                    {activeComponentId === 'otp-input' && (
                      <div className="flex flex-col items-center gap-3">
                        <OTPInput length={4} value={otpValue} onChange={setOtpValue} />
                        <span className="text-xs font-mono text-zinc-500">Value: {otpValue}</span>
                      </div>
                    )}

                    {activeComponentId === 'color-picker' && (
                      <div className="flex flex-col items-center gap-3">
                        <ColorPicker value={colorValue} onChange={setColorValue} />
                        <span className="text-xs font-mono text-zinc-500">Hex: {colorValue}</span>
                      </div>
                    )}

                    {activeComponentId === 'tag-input' && (
                      <div className="w-full">
                        <TagInput tags={tags} onChange={setTags} label="Keywords" placeholder="Add tag..." />
                      </div>
                    )}

                    {activeComponentId === 'number-field' && (
                      <div className="w-48">
                        <NumberField value={numberValue} onChange={setNumberValue} min={0} max={200} step={1} />
                      </div>
                    )}

                    {activeComponentId === 'rating' && (
                      <div className="flex flex-col items-center gap-2">
                        <Rating value={ratingValue} onChange={setRatingValue} max={5} />
                        <span className="text-xs font-mono text-zinc-500">{ratingValue} / 5.0</span>
                      </div>
                    )}

                    {activeComponentId === 'switch' && (
                      <div className="flex items-center gap-3">
                        <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Specular Rim Highlight ({switchChecked ? 'Active' : 'Muted'})
                        </span>
                      </div>
                    )}

                    {activeComponentId === 'slider' && (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                          <span>Level</span>
                          <span className="text-zinc-950 dark:text-white font-bold">{sliderValue}%</span>
                        </div>
                        <Slider value={sliderValue} min={0} max={100} onChange={setSliderValue} />
                      </div>
                    )}

                    {activeComponentId === 'progress' && (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                          <span>Sprint Completion</span>
                          <span className="text-zinc-950 dark:text-white font-bold">{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} />
                      </div>
                    )}

                    {activeComponentId === 'checkbox' && (
                      <Checkbox
                        checked={checkboxChecked}
                        onChange={setCheckboxChecked}
                        label="Sub-pixel specular rim highlights"
                      />
                    )}

                    {activeComponentId === 'segmented-control' && (
                      <SegmentedControl
                        value={segmentedValue}
                        onChange={setSegmentedValue}
                        options={[
                          { value: 'ALL', label: 'All' },
                          { value: 'ACTIVE', label: 'Active' },
                          { value: 'DONE', label: 'Done' },
                        ]}
                      />
                    )}

                    {/* SURFACES & DATA */}
                    {activeComponentId === 'card' && (
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle>Velvet Obsidian Depth</CardTitle>
                          <CardDescription>Sub-pixel specular border highlights.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            Engineered with #06070A velvet obsidian base.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button size="xs" variant="secondary">
                            Action
                          </Button>
                        </CardFooter>
                      </Card>
                    )}

                    {activeComponentId === 'stat-tile' && (
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <StatTile label="Velocity Index" value="99.4%" delta={8.2} />
                        <StatTile label="Burndown" value="38 pts" delta={-4.5} />
                      </div>
                    )}

                    {activeComponentId === 'sparkline' && (
                      <div className="w-full p-4 rounded-(--radius-control) bg-zinc-100 dark:bg-[#090A0E] border border-zinc-200 dark:border-white/[0.04] space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-500">Real-time Telemetry</span>
                          <span className="text-emerald-500 font-bold">+14.2%</span>
                        </div>
                        <Sparkline data={[12, 18, 15, 26, 22, 35, 30, 48, 42, 58, 62]} height={48} color="emerald" />
                      </div>
                    )}

                    {activeComponentId === 'avatar-stack' && (
                      <AvatarStack
                        names={['Alex Rivera', 'Sara Chen', 'Darius Vance', 'Elena Rostova', 'Marcus Sterling']}
                        max={4}
                      />
                    )}

                    {activeComponentId === 'kbd' && (
                      <div className="flex items-center gap-2">
                        <Kbd size="sm">⌘</Kbd>
                        <Kbd size="sm">K</Kbd>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-1 font-mono">
                          Command Palette
                        </span>
                      </div>
                    )}

                    {/* OVERLAYS & MODALS */}
                    {activeComponentId === 'dialog' && (
                      <div>
                        <Button variant="primary" onClick={() => setDialogOpen(true)}>
                          Open Modal Dialog
                        </Button>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Deploy to Edge Nodes</DialogTitle>
                              <DialogDescription>
                                Promote build #99 across global edge network.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="ghost" size="sm" onClick={() => setDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="primary" size="sm" onClick={() => setDialogOpen(false)}>
                                Confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {activeComponentId === 'dropdown-menu' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary">Open Dropdown Menu</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          <DropdownMenuLabel>Account</DropdownMenuLabel>
                          <DropdownMenuItem>
                            Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-500">Sign Out</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {activeComponentId === 'tabs' && (
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="activity">Activity</TabsTrigger>
                          <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="p-2 text-xs text-zinc-600 dark:text-zinc-400">
                          Overview panel content with velvet spring indicator.
                        </TabsContent>
                        <TabsContent value="activity" className="p-2 text-xs text-zinc-600 dark:text-zinc-400">
                          Real-time user event bus telemetry.
                        </TabsContent>
                        <TabsContent value="settings" className="p-2 text-xs text-zinc-600 dark:text-zinc-400">
                          System preferences and token overrides.
                        </TabsContent>
                      </Tabs>
                    )}

                    {/* WORKFLOWS & HEAVYWEIGHTS */}
                    {activeComponentId === 'terminal-emulator' && (
                      <div className="w-full">
                        <TerminalEmulator
                          initialLogs={[
                            { id: '1', command: 'ui99-engine --version', output: '1.0.0 (99 certified primitives)', status: 'success', timestamp: '10:42:01' },
                            { id: '2', command: 'ui99 audit --strict', output: '✓ WCAG 2.2 AAA double-ring focus active', status: 'success', timestamp: '10:42:15' },
                          ]}
                          className="max-h-[220px]"
                        />
                      </div>
                    )}

                    {activeComponentId === 'diff-viewer' && (
                      <div className="w-full">
                        <DiffViewer
                          fileName="src/core/tokens/theme.ts"
                          lines={[
                            { type: 'delete', oldLineNumber: 1, content: 'const theme = "dark";' },
                            { type: 'add', newLineNumber: 1, content: 'const theme = "obsidian-velvet";' },
                            { type: 'add', newLineNumber: 2, content: 'export const tokens = { theme };' },
                          ]}
                        />
                      </div>
                    )}

                    {/* Fallback for other 99 components */}
                    {![
                      'button', 'icon-button', 'copy-button', 'toggle', 'toggle-group',
                      'badge', 'status-badge', 'priority-badge', 'alert', 'banner',
                      'input', 'password-input', 'otp-input', 'color-picker', 'tag-input',
                      'number-field', 'rating', 'switch', 'slider', 'progress',
                      'checkbox', 'segmented-control', 'card', 'stat-tile', 'sparkline',
                      'avatar-stack', 'kbd', 'dialog', 'dropdown-menu', 'tabs',
                      'terminal-emulator', 'diff-viewer'
                    ].includes(activeComponentId) && (
                      <div className="w-full p-6 rounded-(--radius-control) bg-zinc-100/70 dark:bg-[#08090D] border border-zinc-200/80 dark:border-white/[0.04] text-center space-y-3">
                        <div className="inline-flex p-3 rounded-(--radius-control) bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Boxes className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{currentComp.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">{currentComp.description}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFocusComponent(currentComp.name);
                              setCurrentTab('DOCS');
                            }}
                            className="px-3 py-1.5 rounded-(--radius-field) bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-mono font-bold cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
                          >
                            <span>Open in Live Docs</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Micro-Controls & CLI Installation Footer */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-(--radius-control) bg-zinc-50/90 dark:bg-[#08090D] border border-zinc-200/80 dark:border-white/[0.03] overflow-hidden">
                  {/* Left: Interactive Micro Controls */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    {activeComponentId === 'button' && (
                      <>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-500 font-mono text-[11px] select-none shrink-0 w-12">Variant:</span>
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x py-0.5">
                            {(['primary', 'secondary', 'outline', 'ghost', 'rose'] as const).map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setBtnVariant(v)}
                                className={`px-2 py-0.5 rounded-(--radius-xs) capitalize font-mono text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                                  btnVariant === v
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-200/50 dark:bg-white/[0.03]'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-500 font-mono text-[11px] select-none shrink-0 w-12">Size:</span>
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x py-0.5">
                            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setBtnSize(s)}
                                className={`px-2 py-0.5 rounded-(--radius-xs) uppercase font-mono text-[10px] cursor-pointer transition-colors shrink-0 ${
                                  btnSize === s
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-200/50 dark:bg-white/[0.03]'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeComponentId !== 'button' && (
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 py-1">
                        <span>Primitive: <strong className="text-zinc-950 dark:text-white">{currentComp.primitive || 'Native'}</strong></span>
                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                        <span>Category: <strong className="text-zinc-950 dark:text-white capitalize">{currentComp.category}</strong></span>
                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                        <span className="text-emerald-500">WCAG 2.2 AAA</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Quick Install CLI Capsule */}
                  <div className="flex items-center gap-1.5 min-w-0 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-200/60 dark:border-white/[0.03]">
                    {/* PM Quick Pills */}
                    <div className="flex items-center p-0.5 rounded-(--radius-sm) bg-zinc-200/70 dark:bg-white/[0.04] border border-zinc-300/60 dark:border-white/[0.03] shrink-0">
                      {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPackageManager(pm)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                            packageManager === pm
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>

                    {/* Copy command box */}
                    <button
                      type="button"
                      onClick={() => copy(getCliCommand(currentComp.name), 'quick-add')}
                      aria-label="Copy CLI command"
                      className="flex-1 lg:flex-initial inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-(--radius-field) text-xs font-mono bg-white dark:bg-[#0E0F14] hover:bg-zinc-100 dark:hover:bg-[#151620] text-zinc-800 dark:text-[#EDEDEF] border border-zinc-200 dark:border-white/[0.04] shadow-(--shadow-card) transition-colors cursor-pointer min-h-[30px] min-w-0 overflow-hidden"
                    >
                      <span className="flex items-center gap-1.5 truncate min-w-0">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs select-none shrink-0">&gt;_</span>
                        <span className="truncate text-[11px] sm:text-xs">{getCliCommand(currentComp.name)}</span>
                      </span>
                      {copiedKey === 'quick-add' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CODE (TSX) ─── */}
            {studioView === 'code' && (
              <div className="space-y-2">
                <CodeBlock
                  code={currentComp.codeSnippet}
                  language="tsx"
                  filename={`src/components/ui/${currentComp.name}.tsx`}
                  showLineNumbers
                  maxHeight="380px"
                />
              </div>
            )}

            {/* ─── CLI (NPX / PNPM / BUN / YARN) ─── */}
            {studioView === 'cli' && (
              <div className="space-y-3">
                <div className="p-3 sm:p-4 rounded-(--radius-control) bg-zinc-50/70 dark:bg-[#06070A] border border-zinc-200/50 dark:border-white/[0.06] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold truncate">
                      Add component to your project
                    </span>
                    
                    {/* Package manager toggle */}
                    <div className="flex items-center p-0.5 rounded-(--radius-sm) bg-zinc-200/50 dark:bg-white/[0.06] border border-zinc-300/40 dark:border-white/[0.04] shrink-0">
                      {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPackageManager(pm)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                            packageManager === pm
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold'
                              : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-(--radius-field) bg-zinc-900 dark:bg-[#090A0F] font-mono text-xs text-emerald-400 border border-zinc-800 dark:border-white/[0.04] min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className="select-none text-zinc-600 dark:text-zinc-500 shrink-0">&gt;_</span>
                      <span className="truncate text-[11px] sm:text-xs">{getCliCommand(currentComp.name)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(getCliCommand(currentComp.name), 'cli-single')}
                      aria-label="Copy command"
                      className="p-1.5 rounded-(--radius-sm) hover:bg-zinc-800 dark:hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {copiedKey === 'cli-single' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-(--radius-control) bg-zinc-50/70 dark:bg-[#06070A] border border-zinc-200/50 dark:border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold truncate">
                      Import statement
                    </span>
                    <button
                      type="button"
                      onClick={() => copy(`import { ${currentComp.title.replace(/[\s-]+/g, '')} } from '@/components/ui/${currentComp.name}';`, 'import-code')}
                      className="p-1.5 rounded-(--radius-sm) hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {copiedKey === 'import-code' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-(--radius-field) bg-zinc-900 dark:bg-[#090A0F] font-mono text-[11px] sm:text-xs text-zinc-200 border border-zinc-800 dark:border-white/[0.04] overflow-x-auto no-scrollbar whitespace-nowrap">
                    import &#123; {currentComp.title.replace(/[\s-]+/g, '')} &#125; from '@/components/ui/{currentComp.name}';
                  </div>
                </div>
              </div>
            )}

            {/* ─── TOKENS INSPECTOR ─── */}
            {studioView === 'tokens' && (
              <div className="space-y-3">
                <div className="p-4 rounded-(--radius-control) bg-zinc-50/80 dark:bg-[#08090D] border border-zinc-200/80 dark:border-white/[0.04] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">Obsidian Velvet Token Specs</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-(--radius-field) bg-white dark:bg-[#0D0E14] border border-zinc-200/60 dark:border-white/[0.03]">
                      <span className="text-zinc-500">Surface Base:</span> <span className="text-emerald-500">#06070A</span>
                    </div>
                    <div className="p-2.5 rounded-(--radius-field) bg-white dark:bg-[#0D0E14] border border-zinc-200/60 dark:border-white/[0.03]">
                      <span className="text-zinc-500">Surface Card:</span> <span className="text-emerald-500">#0B0C11</span>
                    </div>
                    <div className="p-2.5 rounded-(--radius-field) bg-white dark:bg-[#0D0E14] border border-zinc-200/60 dark:border-white/[0.03]">
                      <span className="text-zinc-500">Hairline Border:</span> <span className="text-emerald-500">rgba(255,255,255,0.025)</span>
                    </div>
                    <div className="p-2.5 rounded-(--radius-field) bg-white dark:bg-[#0D0E14] border border-zinc-200/60 dark:border-white/[0.03]">
                      <span className="text-zinc-500">Focus Ring:</span> <span className="text-emerald-500">var(--focus-ui99)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          3 · DESIGN SYSTEM CRAFT PILLARS
         ══════════════════════════════════════════════════════════════ */}
      <Reveal index={5}>
        <section className="pt-12 sm:pt-16 space-y-5">
          {/* Left-Aligned Header */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-(--radius-pill) bg-emerald-500 inline-block" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Engineering Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Crafted without compromise
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#92929B] max-w-xl">
              Engineered with the exact standards required by production developer tools and enterprise web applications.
            </p>
          </div>

          {/* Connected Pillar Card */}
          <div className="rounded-(--radius-control) bg-white dark:bg-[#0A0B0E] border border-zinc-200/80 dark:border-white/[0.035] shadow-(--elevation-1) dark:shadow-(--elevation-1) divide-y divide-zinc-100 dark:divide-white/[0.035] sm:divide-y-0 sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:shadow-none sm:grid sm:grid-cols-3 sm:gap-3.5">
            {/* Pillar 1: Keyboard Velocity */}
            <div className="p-3.5 sm:p-4.5 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-[#0A0B0E] sm:border sm:border-zinc-200/80 sm:dark:border-white/[0.035] sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-zinc-300 dark:hover:border-white/[0.08]">
              <div className="w-8 h-8 rounded-(--radius-field) bg-zinc-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/60 dark:border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
                    Keyboard Velocity &amp; {KIT_COMPONENT_COUNT} Elements
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-[#92929B] leading-relaxed">
                  Roving tabindex, global <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 font-mono text-[10px] border border-zinc-200/60 dark:border-white/[0.04]">⌘K</code> hotkeys, and tactile focus states across all 99 primitives.
                </p>
              </div>
            </div>

            {/* Pillar 2: Specular Velvet Depth */}
            <div className="p-3.5 sm:p-4.5 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-[#0A0B0E] sm:border sm:border-zinc-200/80 sm:dark:border-white/[0.035] sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-zinc-300 dark:hover:border-white/[0.08]">
              <div className="w-8 h-8 rounded-(--radius-field) bg-zinc-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/60 dark:border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
                    Specular Velvet Depth
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-[#92929B] leading-relaxed">
                  Mathematical obsidian layers with sub-pixel rim highlights that separate naturally in any environment.
                </p>
              </div>
            </div>

            {/* Pillar 3: Zero Runtime Overhead */}
            <div className="p-3.5 sm:p-4.5 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-[#0A0B0E] sm:border sm:border-zinc-200/80 sm:dark:border-white/[0.035] sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-zinc-300 dark:hover:border-white/[0.08]">
              <div className="w-8 h-8 rounded-(--radius-field) bg-zinc-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200/60 dark:border-amber-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
                    Zero Runtime Overhead
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-[#92929B] leading-relaxed">
                  Pure Tailwind v4 utility tokens and headless primitives. Copy, paste, and ship without runtime weight.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          4 · MINIMALIST FOOTER
         ══════════════════════════════════════════════════════════════ */}
      <footer className="pt-8 sm:pt-10 mt-12 sm:mt-16 border-t border-zinc-200 dark:border-white/[0.04]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
              UI \ [99]
            </span>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{KIT_COMPONENT_COUNT} Elements</span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400" aria-label="Footer Navigation">
            {(['UIKIT', 'BLOCKS', 'DOCS', 'FOUNDATIONS'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                {tab === 'UIKIT' ? `${KIT_COMPONENT_COUNT} Components` : tab === 'BLOCKS' ? 'Patterns' : tab === 'DOCS' ? 'Guides' : 'Design Tokens'}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.03] flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-500">
          <span>© 2026 UI \ [99] · MIT Licensed</span>
          <span>Dual Obsidian / Light Primitives · {KIT_COMPONENT_COUNT} Certified Elements</span>
        </div>
      </footer>
    </div>
  );
}
