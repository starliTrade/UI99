/**
 * UI99 — World-Class UI Kit, Design System & Component Registry (Build 02.2)
 * 
 * Benchmarked against Linear.app, Apple Human Interface Guidelines, and shadcn/ui.
 * Full dual-theme parity (Obsidian Dark #06070A & Matte Porcelain #F5F5F8),
 * Color psychology foundations, 4-tier elevation, mathematical radii nesting,
 * and copy-ready component code blocks for production deployment across any project.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  Type,
  Palette,
  Star,
  Check,
  Copy,
  Sliders,
  Terminal,
  Command,
  Flame,
  Clock,
  ArrowUpRight,
  Tag as TagIcon,
  User,
  Folder,
  Calendar,
  ChevronRight,
  Info,
  Eye,
  Code,
  Circle,
  CheckCircle2,
  MinusCircle,
  AlertTriangle,
  Search,
  Moon,
  Sun,
  RefreshCw,
  Play,
  Send,
  Share2,
  MoreHorizontal,
  Filter,
  Square,
  CheckSquare,
  Compass,
  LayoutGrid,
  SquarePen,
  Waves,
  Inbox,
  X,
  Volume2,
  ExternalLink,
  Laptop,
  CheckCircle,
  SlidersHorizontal,
  Bell,
  ShieldCheck,
  Zap,
  Package,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Hash,
  MoveHorizontal,
  Maximize2,
  Bold,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { tokens, calculateInnerRadius } from '../../core/tokens';
import {
  Button,
  IconButton,
  Tag,
  Avatar,
  Card,
  Surface,
  GlassSurface,
  ElevatedSurface,
  Input,
  Textarea,
  SearchBar,
  Switch,
  Checkbox,
  Radio,
  Dropdown,
  Slider,
  Progress,
  Tooltip,
  Accordion,
  Breadcrumb,
  SegmentedControl,
  PriorityBadge,
  StatusBadge,
  PriorityLevel,
  IssueStatus,
  Kbd,
  Skeleton,
  Modal,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut as CmdkShortcut,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TokensAuditPlayground,
  LinearIssueTracker,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Separator,
  Label,
  FormField,
  Alert,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  ScrollArea,
  AspectRatio,
  Badge,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  RadioGroup,
  RadioGroupItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  Stepper,
  Timeline,
  TimelineItem,
  FileUpload,
  Sparkline,
  DonutRing,
  HeatMapCalendar,
  StatTile,
  MeterBar,
  TrendDelta,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarItem,
  CommandBar,
  CommandAction,
  AvatarStack,
  CodeBlock,
  Carousel,
  DatePicker,
  Combobox,
  TimePicker,
  Rating,
  OTPInput,
  CopyButton,
  Swatch,
  NumberField,
} from '../ui';

type SectionTab =
  | 'ALL'
  | 'FOUNDATIONS'
  | 'COMPONENTS'
  | 'LINEAR_PATTERNS'
  | 'SURFACES'
  | 'REGISTRY'
  | 'SANDBOX';

export function UIKitView() {
  const { themeMode, setThemeMode, addToast, focusComponent, setFocusComponent } = useApp();
  const { isRTL, setLanguage, language } = useAuth();
  const isDark = themeMode === 'dark';

  const [activeSection, setActiveSection] = useState<SectionTab>('ALL');

  // Deep-link from home explorer: focus the component's gallery section
  React.useEffect(() => {
    if (!focusComponent) return;
    const WAVE_MAP: Record<string, SectionTab> = {
      // Waves map to gallery sections; default COMPONENTS
    };
    setActiveSection('COMPONENTS');
    requestAnimationFrame(() => {
      const el = document.querySelector('[data-gallery-section]');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setFocusComponent(null);
  }, [focusComponent, setFocusComponent]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal demo state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRadixDialogOpen, setIsRadixDialogOpen] = useState(false);

  // Form Controls Demo State
  const [demoSwitch1, setDemoSwitch1] = useState(true);
  const [demoSwitch2, setDemoSwitch2] = useState(false);
  const [demoCheckbox1, setDemoCheckbox1] = useState(true);
  const [demoCheckbox2, setDemoCheckbox2] = useState(false);
  const [demoRadio, setDemoRadio] = useState<'standard' | 'priority' | 'realtime'>('priority');
  const [demoDropdownVal, setDemoDropdownVal] = useState('high');
  const [demoSearchVal, setDemoSearchVal] = useState('');
  const [demoInputVal, setDemoInputVal] = useState('Personal Life Operating System');
  const [demoTextareaVal, setDemoTextareaVal] = useState(
    'Velvet obsidian material framework with sub-pixel specular rim lighting and haptic spring physics.'
  );
  const [demoSliderVal, setDemoSliderVal] = useState(68);
  const [demoProgressVal, setDemoProgressVal] = useState(75);

  // Interactive Sandbox state
  const [sbComponent, setSbComponent] = useState<'button' | 'switch' | 'badge' | 'slider' | 'progress'>('button');
  const [sbVariant, setSbVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'rose'>('primary');
  const [sbSize, setSbSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [sbLoading, setSbLoading] = useState(false);
  const [sbDisabled, setSbDisabled] = useState(false);
  const [sbWithIcon, setSbWithIcon] = useState(true);
  const [sbLabel, setSbLabel] = useState('Launch Workflow');

  // Command palette keyboard shortcut listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    addToast(`Copied ${label} to clipboard`, 'success');
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  // Navigation tab options
  const sectionOptions = [
    { value: 'ALL', label: isRTL ? 'تمام بخش‌ها' : 'All Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { value: 'FOUNDATIONS', label: isRTL ? 'مبانی و روانشناسی رنگ' : 'Foundations & Colors', icon: <Palette className="w-3.5 h-3.5" /> },
    { value: 'COMPONENTS', label: isRTL ? 'کامپوننت‌ها' : 'Component Suite', icon: <Sliders className="w-3.5 h-3.5" /> },
    { value: 'LINEAR_PATTERNS', label: isRTL ? 'الگوهای لینیار' : 'Linear Workflows', icon: <Terminal className="w-3.5 h-3.5" /> },
    { value: 'SURFACES', label: isRTL ? 'شیشه و متریال' : 'Materials & Glass', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { value: 'REGISTRY', label: isRTL ? 'راهنمای نصب و ایمپورت' : 'Registry & Usage', icon: <Package className="w-3.5 h-3.5" /> },
    { value: 'SANDBOX', label: isRTL ? 'سندباکس کد' : 'Live Code Lab', icon: <Code className="w-3.5 h-3.5" /> },
  ];

  // Generated code for Sandbox
  const sandboxJSXCode = useMemo(() => {
    if (sbComponent === 'button') {
      const iconAttr = sbWithIcon ? ' icon={<Sparkles className="w-4 h-4" />}' : '';
      const loadingAttr = sbLoading ? ' loading' : '';
      const disabledAttr = sbDisabled ? ' disabled' : '';
      return `import { Button } from '@/components/ui';\n\n<Button\n  variant="${sbVariant}"\n  size="${sbSize}"${iconAttr}${loadingAttr}${disabledAttr}\n>\n  ${sbLabel}\n</Button>`;
    }
    if (sbComponent === 'switch') {
      return `import { Switch } from '@/components/ui';\n\n<Switch\n  checked={enabled}\n  onChange={setEnabled}\n  size="${sbSize}"\n  label="${sbLabel}"\n  description="Haptic spring transition"\n/>`;
    }
    if (sbComponent === 'badge') {
      return `import { PriorityBadge } from '@/components/ui';\n\n<PriorityBadge\n  priority="urgent"\n  showLabel={true}\n  size="${sbSize === 'lg' ? 'md' : sbSize}"\n/>`;
    }
    if (sbComponent === 'slider') {
      return `import { Slider } from '@/components/ui';\n\n<Slider\n  value={val}\n  onChange={setVal}\n  label="${sbLabel}"\n  min={0}\n  max={100}\n  unit="% "\n/>`;
    }
    return `import { Progress } from '@/components/ui';\n\n<Progress\n  value={75}\n  max={100}\n  label="${sbLabel}"\n  variant="emerald"\n  size="${sbSize}"\n/>`;
  }, [sbComponent, sbVariant, sbSize, sbLoading, sbDisabled, sbWithIcon, sbLabel]);

  return (
    <div className="space-y-10 pb-28 pt-2">
      {/* 1. HERO SYSTEM BANNER (World-Class System Identity & Live Controls) */}
      <section className="relative rounded-[32px] p-6 sm:p-10 overflow-hidden bg-white dark:bg-[#0A0B10] border border-black/[0.05] dark:border-white/[0.035] shadow-[0_16px_40px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_60px_-12px_rgba(0,0,0,0.85)] transition-colors">
        {/* Soft Ambient Radial Light */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/[0.05] dark:bg-white/[0.02] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/[0.04] dark:bg-emerald-500/[0.025] blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.035] border border-black/[0.05] dark:border-white/[0.05] text-[11px] font-mono tracking-tight text-zinc-600 dark:text-[#92929B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-zinc-900 dark:text-white">UI \ [99] SYSTEM v1.0</span>
              <span className="text-zinc-300 dark:text-white/20">•</span>
              <span>LINEAR × SHADCN STANDARD</span>
              <span className="text-zinc-300 dark:text-white/20">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">WCAG AAA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF] leading-[1.15]">
              World-Class UI Kit & Component Registry
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-[#92929B] leading-relaxed max-w-xl">
              Engineered with 60-30-10 color psychology, Linear velocity, and shadcn/ui modularity: true obsidian depths (#06070A), matte porcelain day mode (#F5F5F8), sub-pixel specular rim lighting, tactile haptic physics, and universal copyable components.
            </p>

            {/* Live Theme & Direction Switcher Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Theme Toggle */}
              <div className="inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-[#131318] border border-black/[0.06] dark:border-white/[0.06] shadow-xs">
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white text-black shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-black dark:text-zinc-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Obsidian Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    !isDark
                      ? 'bg-[#111116] text-white shadow-xs font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Matte Porcelain</span>
                </button>
              </div>

              {/* Language / RTL Toggle */}
              <div className="inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-[#131318] border border-black/[0.06] dark:border-white/[0.06] shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('fa')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'fa'
                      ? 'bg-emerald-500 text-white shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-black dark:text-zinc-400'
                  }`}
                >
                  فارسی (RTL)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-black shadow-xs font-bold'
                      : 'text-zinc-600 hover:text-black dark:text-zinc-400'
                  }`}
                >
                  English (LTR)
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#131318] border border-black/[0.05] dark:border-white/[0.04]">
                  {isDark ? '#06070A Root' : '#F5F5F8 Root'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<Copy className="w-4 h-4" />}
              onClick={() => copyToClipboard(JSON.stringify(tokens, null, 2), 'Design Tokens JSON')}
            >
              {copiedCode === 'Design Tokens JSON' ? 'Tokens Copied!' : 'Export Tokens JSON'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={<Code className="w-4 h-4" />}
              onClick={() => {
                const tailwindSnippet = `// tailwind.config.ts\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        obsidian: '#06070A',\n        porcelain: '#F5F5F8',\n        surface: { dark: '#0E0E14', light: '#FFFFFF' },\n        elevated: { dark: '#131318', light: '#FFFFFF' }\n      }\n    }\n  }\n};`;
                copyToClipboard(tailwindSnippet, 'Tailwind Config');
              }}
            >
              Copy Tailwind Config
            </Button>

            <Button
              variant="outline"
              size="md"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => setIsDemoModalOpen(true)}
            >
              Preview Velvet Modal
            </Button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR (Linear-Style Sticky Filter Rail) */}
      <div className="sticky top-16 z-30 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-[#06070A]/80 border-y border-black/[0.04] dark:border-white/[0.02]">
        <SegmentedControl
          options={sectionOptions as any}
          value={activeSection}
          onChange={setActiveSection as any}
          size="sm"
          fullWidth
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. FOUNDATIONS SECTION: Color Science, Psychology, Typography, Radii Math */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'FOUNDATIONS') && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Palette className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  01. Foundations & Color Science (60-30-10 Architecture)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  Mathematical color psychology, sub-pixel specular rim physics, and corner nesting geometry.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-[#8E8E98]">
              RATIO 18.4:1
            </span>
          </div>

          {/* Color Psychology Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Obsidian Canvas */}
            <div
              onClick={() => copyToClipboard('#06070A', 'Velvet Obsidian')}
              className="group p-5 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] shadow-xs cursor-pointer transition-all hover:border-black/[0.15] dark:hover:border-white/[0.09] active:scale-[0.98]"
            >
              <div className="h-20 rounded-2xl bg-[#06070A] border border-white/[0.06] flex items-end p-3 mb-3 shadow-inner">
                <span className="text-[10px] font-mono text-zinc-400 font-bold">60% BASE CANVAS</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-[#EDEDEF]">Velvet Obsidian</h4>
                  <p className="text-xs font-mono text-zinc-500 dark:text-[#8E8E98]">#06070A</p>
                </div>
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                {tokens.psychology.obsidian.rationale}
              </p>
            </div>

            {/* Porcelain Light */}
            <div
              onClick={() => copyToClipboard('#F5F5F8', 'Matte Porcelain')}
              className="group p-5 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] shadow-xs cursor-pointer transition-all hover:border-black/[0.15] dark:hover:border-white/[0.09] active:scale-[0.98]"
            >
              <div className="h-20 rounded-2xl bg-[#F5F5F8] border border-black/[0.06] flex items-end p-3 mb-3 shadow-inner">
                <span className="text-[10px] font-mono text-zinc-600 font-bold">60% DAY CANVAS</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-[#EDEDEF]">Matte Porcelain</h4>
                  <p className="text-xs font-mono text-zinc-500 dark:text-[#8E8E98]">#F5F5F8</p>
                </div>
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                {tokens.psychology.porcelain.rationale}
              </p>
            </div>

            {/* Surface L1 */}
            <div
              onClick={() => copyToClipboard(isDark ? '#0E0E14' : '#FFFFFF', 'Surface Layer')}
              className="group p-5 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] shadow-xs cursor-pointer transition-all hover:border-black/[0.15] dark:hover:border-white/[0.09] active:scale-[0.98]"
            >
              <div
                className={`h-20 rounded-2xl flex items-end p-3 mb-3 border ${
                  isDark
                    ? 'bg-[#0E0E14] border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'bg-white border-black/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,1)]'
                }`}
              >
                <span className="text-[10px] font-mono text-zinc-500 font-bold">30% CONTAINER L1</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-[#EDEDEF]">Surface Layer 1</h4>
                  <p className="text-xs font-mono text-zinc-500 dark:text-[#8E8E98]">
                    {isDark ? '#0E0E14' : '#FFFFFF'}
                  </p>
                </div>
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Cards, object rows, and structured segmented controls.
              </p>
            </div>

            {/* Elevated L2 */}
            <div
              onClick={() => copyToClipboard(isDark ? '#131318' : '#FFFFFF', 'Elevated Layer')}
              className="group p-5 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] shadow-xs cursor-pointer transition-all hover:border-black/[0.15] dark:hover:border-white/[0.09] active:scale-[0.98]"
            >
              <div
                className={`h-20 rounded-2xl flex items-end p-3 mb-3 border ${
                  isDark
                    ? 'bg-[#131318] border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                    : 'bg-white border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                }`}
              >
                <span className="text-[10px] font-mono text-zinc-500 font-bold">ELEVATED L2 MODAL</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-[#EDEDEF]">Elevated Layer 2</h4>
                  <p className="text-xs font-mono text-zinc-500 dark:text-[#8E8E98]">
                    {isDark ? '#131318' : '#FFFFFF (Elevated)'}
                  </p>
                </div>
                <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Floating popovers, command spotlights, and bottom sheets.
              </p>
            </div>
          </div>

          {/* 10% Semantic Functional Accents with Psychological Rationale */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
              10% Semantic Color Psychology (Functional Signals)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {[
                { name: 'Emerald', hex: '#10B981', psych: tokens.psychology.emerald },
                { name: 'Amber', hex: '#F59E0B', psych: tokens.psychology.amber },
                { name: 'Rose', hex: '#F43F5E', psych: tokens.psychology.rose },
                { name: 'Sapphire', hex: '#3B82F6', psych: tokens.psychology.sapphire },
                { name: 'Amethyst', hex: '#A855F7', psych: tokens.psychology.amethyst },
              ].map((c) => (
                <div
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex, c.name)}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] hover:border-black/[0.15] dark:hover:border-white/[0.08] cursor-pointer transition-all active:scale-98"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: c.hex }} />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.name}</span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{c.hex}</p>
                  <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-300 mt-1">{c.psych.role}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-snug">{c.psych.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Scale: Persian Luxury + Latin Pair */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
                  Bilingual Typographic Harmony (Vazirmatn & Plus Jakarta Sans)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">RATIO 1.25 (MAJOR THIRD)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persian Luxury */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] space-y-3 text-right rtl">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  فارسی فاخر (وزیرمتن با اعداد فارسی)
                </span>
                <p className="text-2xl font-bold font-persian-luxury text-zinc-950 dark:text-[#EDEDEF]">
                  صفا: آرامش ذهن و سیستم‌عامل زندگی
                </p>
                <p className="text-sm font-persian-luxury text-zinc-600 dark:text-[#92929B] leading-relaxed">
                  تراز اپتیکال دقیق خطوط، خوانایی حداکثری، و قالب‌بندی ارقام فارسی: ۱۲۳،۴۵۶ ریال در کادرها.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-black/[0.04] dark:border-white/[0.04]">
                  <span>Vazirmatn Weights: 400 / 500 / 700</span>
                  <span>کنتراست AAA</span>
                </div>
              </div>

              {/* Latin Display */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#0E0E14] border border-black/[0.04] dark:border-white/[0.03] space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                  LATIN BODY & MONO TOKENS
                </span>
                <p className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  Precision Velocity & Sub-Pixel Rims
                </p>
                <p className="text-sm text-zinc-600 dark:text-[#92929B] leading-relaxed">
                  Calibrated 1.5–1.7 leading with zero clipping in pills, tags, and command bars: <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10">⌘K Spotlight</code>
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-black/[0.04] dark:border-white/[0.04]">
                  <span>Plus Jakarta Sans & JetBrains Mono</span>
                  <span>Step: 11 / 13 / 15 / 24 / 36px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Radius Nesting Rule Demonstration */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
                  Mathematical Corner Radius Nesting (r_inner = r_outer - padding)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">GEOMETRIC PURITY</span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-[#8E8E98] leading-relaxed">
              When rounded containers nest inside another rounded container, the inner radius must equal the outer radius minus the intervening padding. This prevents optical discordance and visual clashing.
            </p>

            <div className="p-6 rounded-[28px] bg-zinc-100 dark:bg-[#131318] border border-black/[0.06] dark:border-white/[0.05] flex flex-col items-center justify-center gap-3">
              <div className="text-[11px] font-mono text-zinc-500">
                Outer Container: Radius 28px, Padding 16px
              </div>
              <div className="w-full max-w-sm p-4 rounded-[12px] bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.05] shadow-xs text-center">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  Inner Card: Calculated Radius = 28px - 16px = 12px (Perfect Concentricity)
                </span>
              </div>
            </div>
          </div>

          {/* Phase 2: Live Concentric Radii Nesting & Design Tokens Engine */}
          <TokensAuditPlayground />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPONENT SUITE (shadcn/ui style live registry) */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'COMPONENTS') && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  02. Production Component Suite (Dual-Theme Adaptive)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  Buttons, sliders, progress bars, tooltips, accordions, switches, dropdowns, inputs, and modals.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-[#8E8E98]">
              ATOMIC EXPORTS
            </span>
          </div>

          {/* Interactive Component Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Buttons & IconButtons */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Buttons & IconButtons</h3>
                <span className="text-[11px] font-mono text-zinc-400">Button, IconButton</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {(
                  [
                    'primary',
                    'secondary',
                    'outline',
                    'ghost',
                    'link',
                    'destructive',
                    'success',
                    'rose',
                  ] as const
                ).map((v) => (
                  <Button key={v} variant={v}>{
                    v.charAt(0).toUpperCase() + v.slice(1)
                  }</Button>
                ))}
                <Button variant="primary" loading>Loading</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>

              {/* Size ladder — h-6 → h-12 + icon */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                {(['xs', 'sm', 'md', 'lg', 'icon'] as const).map((s) => (
                  <Button key={s} size={s} variant="secondary" icon={s === 'icon' ? <Sparkles className="w-4 h-4" /> : undefined}>
                    {s === 'icon' ? '' : s.toUpperCase()}
                  </Button>
                ))}
                <span className="text-[10px] font-mono text-zinc-400 ml-1">h-6→h-12 + icon</span>
              </div>

              {/* Shape prop — pill / rounded / square */}
              <div className="flex flex-wrap items-center gap-2">
                <Button shape="pill" variant="outline">Pill</Button>
                <Button shape="rounded" variant="outline">Rounded</Button>
                <Button shape="square" variant="outline">Square</Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                {(['primary', 'white', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'rose'] as const).map((v) => (
                  <IconButton
                    key={v}
                    icon={<Sparkles className="w-4 h-4" />}
                    variant={v}
                    label={`${v} icon button`}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Switches & Checkboxes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Tactile Toggles & Checkboxes</h3>
                <span className="text-[11px] font-mono text-zinc-400">Switch, Checkbox, Radio</span>
              </div>
              <div className="space-y-3">
                <Switch
                  checked={demoSwitch1}
                  onChange={setDemoSwitch1}
                  label="Haptic feedback on gesture touch"
                  description="Emits 12ms micro-vibration pulse"
                />
                <Checkbox
                  checked={demoCheckbox1}
                  onChange={setDemoCheckbox1}
                  label="Persist session data in secure local storage"
                />
                <div className="flex items-center gap-4 pt-1">
                  <Radio
                    checked={demoRadio === 'standard'}
                    onChange={() => setDemoRadio('standard')}
                    label="FIFO Queue"
                  />
                  <Radio
                    checked={demoRadio === 'priority'}
                    onChange={() => setDemoRadio('priority')}
                    label="Priority Weighted"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Slider & Progress Meter */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Slider & Progress Indicators</h3>
                <span className="text-[11px] font-mono text-zinc-400">Slider, Progress</span>
              </div>
              <Slider
                value={demoSliderVal}
                onChange={setDemoSliderVal}
                label="Tactile Range Calibration"
                unit="%"
              />
              <Progress
                value={demoSliderVal}
                label="Linear Velocity Meter"
                variant="emerald"
                size="md"
              />
              <Progress
                value={demoSliderVal}
                label="Segmented Sprint Phases"
                variant="amber"
                segmented={5}
                size="sm"
              />
            </div>

            {/* Card 4: Tooltips, Breadcrumb & Badges */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Breadcrumbs, Tooltips & Kbd</h3>
                <span className="text-[11px] font-mono text-zinc-400">Breadcrumb, Tooltip, Kbd</span>
              </div>
              <Breadcrumb
                items={[
                  { label: 'OS Root', onClick: () => {} },
                  { label: 'Studio', onClick: () => {} },
                  { label: 'Design System', active: true },
                ]}
              />
              <div className="flex items-center gap-3 pt-2">
                <Tooltip content="Instantly trigger universal command palette">
                  <Button variant="secondary" size="sm" icon={<Command className="w-3.5 h-3.5" />}>
                    Hover For Tooltip
                  </Button>
                </Tooltip>
                <div className="flex items-center gap-1.5">
                  <Kbd size="sm">⌘</Kbd>
                  <Kbd size="sm">K</Kbd>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PriorityBadge priority="urgent" />
                <PriorityBadge priority="high" />
                <StatusBadge status="done" />
                <StatusBadge status="in_progress" />
              </div>
            </div>

            {/* Card 5: Inputs, SearchBar, Textarea & Dropdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Form Controls & Dropdowns</h3>
                <span className="text-[11px] font-mono text-zinc-400">Input, SearchBar, Dropdown, Textarea</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="System Identifier"
                  value={demoInputVal}
                  onChange={(e) => setDemoInputVal(e.target.value)}
                  leftIcon={<Terminal className="w-4 h-4" />}
                />
                <SearchBar
                  value={demoSearchVal}
                  onChange={setDemoSearchVal}
                  placeholder="Universal search..."
                  onClear={() => setDemoSearchVal('')}
                />
                <Dropdown
                  label="Execution Tier"
                  value={demoDropdownVal}
                  onChange={setDemoDropdownVal}
                  options={[
                    { value: 'urgent', label: 'P0 Urgent Interrupt' },
                    { value: 'high', label: 'P1 High Priority' },
                    { value: 'medium', label: 'P2 Standard Sprint' },
                  ]}
                />
              </div>
            </div>

            {/* Card 6: Accordion Collapsible */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Velvet Accordion Collapsible</h3>
                <span className="text-[11px] font-mono text-zinc-400">Accordion</span>
              </div>
              <Accordion
                defaultOpenId="item-1"
                items={[
                  {
                    id: 'item-1',
                    title: 'How does dual-theme parity work in UI99?',
                    subtitle: 'Tailwind v4 custom variants & token cascading',
                    icon: <Palette className="w-4 h-4" />,
                    children: (
                      <p>
                        The application manages dark and light states cleanly on the root document element. All components automatically inherit high-contrast obsidian velvet or matte porcelain styling without manual class branching.
                      </p>
                    ),
                  },
                  {
                    id: 'item-2',
                    title: 'Can I copy these components into any React/Next.js app?',
                    subtitle: '100% modular, zero lock-in design tokens',
                    icon: <Package className="w-4 h-4" />,
                    children: (
                      <p>
                        Yes! Every component in <code>src/components/ui</code> is completely self-contained, typed with TypeScript, styled with Tailwind CSS, and animated with motion/react. You can copy-paste any file directly into your next project.
                      </p>
                    ),
                  },
                ]}
              />
            </div>

            {/* Card 7: Radix Dialog & Popover (shadcn standard) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Radix Dialog & Popover</h3>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold">shadcn/ui spec</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Accessible headless primitives with automated focus restoration, aria-modal semantics, and collision detection.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Dialog open={isRadixDialogOpen} onOpenChange={setIsRadixDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="primary" size="sm">
                      Open Radix Dialog
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Radix WAI-ARIA Dialog</DialogTitle>
                      <DialogDescription>
                        Complete keyboard focus trapping, Esc dismissal, and screen-reader accessibility.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05] space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-600 dark:text-zinc-400">Primitive</span>
                        <span className="text-emerald-500">@radix-ui/react-dialog</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-600 dark:text-zinc-400">Spec Status</span>
                        <span className="text-emerald-500">Compliant</span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" size="sm" onClick={() => setIsRadixDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setIsRadixDialogOpen(false);
                          addToast('Radix dialog confirmed', 'success');
                        }}
                      >
                        Accept
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm">
                      Trigger Popover
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Radix Popover Content</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Floating card with auto-alignment, viewport edge collision detection, and zero z-index clipping.
                      </p>
                      <Button
                        variant="white-pill"
                        size="xs"
                        fullWidth
                        onClick={() => addToast('Popover action triggered', 'info')}
                      >
                        Action Trigger
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Card 8: Radix Sheet & DropdownMenu */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Sheet Drawer & DropdownMenu</h3>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold">shadcn/ui spec</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Slide-out edge drawers (bottom/right) and multi-level accessible menu primitives with hotkeys.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="sm">
                      Slide-out Sheet
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Mobile Edge Sheet</SheetTitle>
                      <SheetDescription>
                        Radix-powered edge panel with tactile slide physics and smooth backdrop blur.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05] text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Supports top, bottom, left, and right docking with responsive iPhone-first ergonomics.
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setIsSheetOpen(false);
                          addToast('Sheet action completed', 'success');
                        }}
                      >
                        Complete Action
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" icon={<MoreHorizontal className="w-3.5 h-3.5" />}>
                      Action Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Project Options</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => addToast('Copied link', 'success')}>
                      Copy Deep Link
                      <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addToast('Shared object', 'info')}>
                      Share With Team
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => addToast('Archived item', 'warning')}
                      className="text-rose-500 focus:text-rose-600"
                    >
                      Archive Entry
                      <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Card 9: Radix Tabs & cmdk Command Palette */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Radix Tabs & cmdk Command Palette</h3>
                  <p className="text-xs text-zinc-500 dark:text-[#8E8E98] mt-0.5">
                    Fast keyboard navigation benchmarked against Raycast & Linear.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Command className="w-3.5 h-3.5" />}
                  onClick={() => setIsCommandOpen(true)}
                >
                  Open Command Palette (⌘K)
                </Button>
              </div>

              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Interactive Preview</TabsTrigger>
                  <TabsTrigger value="code">API Reference</TabsTrigger>
                  <TabsTrigger value="theme">Dual-Theme State</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05]">
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Seamless Radix Tabs with automatic keyboard arrow navigation, ARIA tablist/tabpanel roles, and animated focus rings.
                  </p>
                </TabsContent>
                <TabsContent value="code" className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05]">
                  <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    {`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';`}
                  </pre>
                </TabsContent>
                <TabsContent value="theme" className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-600 dark:text-zinc-400">Current Palette</span>
                    <span className="font-mono text-zinc-900 dark:text-white">
                      {isDark ? 'Obsidian #06070A Velvet Dark' : 'Matte Porcelain #F5F5F8 Light'}
                    </span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4.5 WAVE A SPOTLIGHT — Separator/Toggle/Label/HoverCard/ScrollArea/Alert  */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                04. Wave A — Layout & Feedback Primitives
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Separator · Label · Toggle · ToggleGroup · HoverCard · Collapsible · ScrollArea · AspectRatio · FormField · Alert
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Toggle + ToggleGroup */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Toggle & Group</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle defaultPressed aria-label="Bold">
                <Bold className="w-4 h-4" />
              </Toggle>
              <Toggle defaultPressed variant="outline" size="sm">Outline</Toggle>
              <Toggle variant="secondary" size="sm">Secondary</Toggle>
            </div>
            <ToggleGroup type="single" defaultValue="day" aria-label="View density">
              <ToggleGroupItem value="day" size="sm">Day</ToggleGroupItem>
              <ToggleGroupItem value="week" size="sm">Week</ToggleGroupItem>
              <ToggleGroupItem value="month" size="sm">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Separator + Label + FormField */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Form Scaffolding</h3>
            <FormField label="Workspace name" htmlFor="wave-a-ws" required hint="max 32">
              <Input id="wave-a-ws" placeholder="ui99-prod" inputSize="sm" />
            </FormField>
            <Separator />
            <FormField label="API endpoint" htmlFor="wave-a-api" error="Endpoint must start with https://">
              <Input id="wave-a-api" defaultValue="http://atelier99.dev" inputSize="sm" error="Endpoint must start with https://" />
            </FormField>
          </div>

          {/* Alert matrix */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Alert Severity</h3>
            <Alert variant="success" title="Deployed">All 27 registry items validated.</Alert>
            <Alert variant="warning" icon={<AlertTriangle className="w-4 h-4" />}>
              Two legacy hexes detected in MoreView.
            </Alert>
            <Alert variant="destructive" title="Build failed">Contrast gate rejected amber-600.</Alert>
          </div>

          {/* ScrollArea + HoverCard + Collapsible + AspectRatio */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Overlay & Scroll Primitives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScrollArea className="h-36 rounded-2xl border border-black/[0.05] dark:border-white/[0.04] p-4">
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <p key={i} className="leading-relaxed">Row {i + 1} — velvet scroll primitives keep the 3px thumb aesthetic cross-browser.</p>
                  ))}
                </div>
              </ScrollArea>
              <div className="space-y-3">
                <HoverCard>
                  <HoverCardTrigger>
                    <span className="text-xs font-semibold underline decoration-dashed underline-offset-4 text-zinc-700 dark:text-[#92929B]">@ui99 hover me</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">UI99 Registry</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Copy-anywhere primitives with WCAG-computed tokens.</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-[#92929B]">
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                    Show install steps
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="pt-2 text-xs font-mono text-emerald-500">npx @99/ui add separator toggle alert</p>
                  </CollapsibleContent>
                </Collapsible>
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-black/[0.04] dark:border-white/[0.04] flex items-center justify-center">
                  <span className="text-[10px] font-mono text-zinc-500">16:9 AspectRatio</span>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.6 WAVE B SPOTLIGHT — AlertDialog/RadioGroup/Table/Pagination            */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                05. Wave B — Flows & Data Display
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                AlertDialog · RadioGroup · Table · Pagination
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AlertDialog + RadioGroup */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Interruptive Flows</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete workspace…</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “ui99-prod”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the workspace and every object inside it. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete forever</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Separator />

            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-zinc-700 dark:text-[#92929B] mb-2">Visibility</legend>
              <RadioGroup defaultValue="private">
                <div className="flex items-center gap-2.5">
                  <RadioGroupItem value="private" id="rg-private" />
                  <Label htmlFor="rg-private" className="font-normal text-xs cursor-pointer">Private — only me</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <RadioGroupItem value="team" id="rg-team" />
                  <Label htmlFor="rg-team" className="font-normal text-xs cursor-pointer">Team — workspace members</Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <RadioGroupItem value="public" id="rg-public" disabled />
                  <Label htmlFor="rg-public" className="font-normal text-xs opacity-50">Public (soon)</Label>
                </div>
              </RadioGroup>
            </fieldset>
          </div>

          {/* Table + Pagination */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Data Display</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Object</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: 'UI-101 · Registry CLI', status: 'In Progress', p: 'Urgent' },
                  { name: 'UI-99 · Velvet tokens', status: 'Done', p: 'Medium' },
                  { name: 'UI-77 · Docs site', status: 'Todo', p: 'Low' },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status === 'Done' ? 'done' : row.status === 'Todo' ? 'todo' : 'in_progress'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <PriorityBadge priority={row.p === 'Urgent' ? 'urgent' : row.p === 'Medium' ? 'medium' : 'low'} showLabel={false} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" aria-disabled="true" disabled />
                </PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.7 WAVE C SPOTLIGHT — Stepper/Timeline/FileUpload                        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                06. Wave C — Product Patterns
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Stepper · Timeline · FileUpload
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Stepper</h3>
            <Stepper steps={['Capture', 'Organize', 'Review']} current={1} />
            <Stepper steps={['Draft', 'Review', 'Ship']} current={3} orientation="vertical" className="pt-2" />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Timeline</h3>
            <Timeline>
              <TimelineItem timestamp="09:41" accent="emerald">Morning pages synced to vault.</TimelineItem>
              <TimelineItem timestamp="12:15" accent="amber">Focus block started — 90m deep work.</TimelineItem>
              <TimelineItem timestamp="18:02" accent="blue">Weekly review drafted automatically.</TimelineItem>
            </Timeline>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">FileUpload</h3>
            <FileUpload label="Drop attachments or click to browse" multiple />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.8 WAVE D SPOTLIGHT — Sparkline/DonutRing/HeatMap/StatTile/Meter/Trend   */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                07. Wave D — Micro-Data & Charts
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Sparkline · DonutRing · HeatMapCalendar · StatTile · MeterBar · TrendDelta — zero chart deps, pure SVG
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Focus hours" value={184} delta={12.4} size="md" trend={<Sparkline data={[3,5,4,8,6,9,7,11]} width={64} height={24} />} />
          <StatTile label="Deep tasks" value={47} delta={-3.1} size="md" trend={<Sparkline data={[9,7,8,5,6,5,4,4]} width={64} height={24} color="rose" mode="bar" />} />
          <StatTile label="Streak" value="21d" delta={0} size="md" />
          <StatTile label="Review load" value={68} size="md" trend={<DonutRing segments={[{ value: 68 }]} size={40} thickness={5} label="Review load" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Sparkline modes</h3>
            <div className="flex items-end gap-4 flex-wrap">
              <Sparkline data={[2,4,3,6,5,8,7,10]} label="Weekly momentum" />
              <Sparkline data={[8,6,7,5,6,4,5,3]} color="rose" fill={false} label="Distractions" />
              <Sparkline data={[1,2,3,5,4,6,9,8]} color="purple" mode="bar" label="Output bars" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] self-start">DonutRing</h3>
            <DonutRing
              segments={[
                { value: 62, color: 'emerald' },
                { value: 24, color: 'blue' },
                { value: 14, color: 'amber' },
              ]}
              showValue
              label="Energy split"
            />
            <MeterBar value={72} label="Weekly goal" />
            <MeterBar value={91} low={30} label="System health" size="sm" />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">HeatMap + Delta</h3>
            <HeatMapCalendar
              weeks={14}
              color="emerald"
              label="14-week activity"
              data={Array.from({ length: 14 * 7 }, (_, i) => ((i * 2654435761) % 97) / 97 > 0.6 ? ((i * 40503) % 9) + 1 : 0)}
            />
            <div className="flex items-center gap-2 pt-1">
              <TrendDelta delta={12.4} />
              <TrendDelta delta={-3.1} />
              <TrendDelta delta={0} />
              <TrendDelta delta={8} invertTone />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.9 WAVE E SPOTLIGHT — Menubar/NavigationMenu/Sidebar/CommandBar          */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                08. Wave E — Advanced Navigation
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Menubar · NavigationMenu · Sidebar · CommandBar
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Menubar & NavigationMenu</h3>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New object <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarItem>Export…</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem disabled>Archive workspace</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Toggle density</MenubarItem>
                  <MenubarItem>Focus mode <MenubarShortcut>F</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[320px] gap-2">
                      <NavigationMenuLink href="#">Color tokens</NavigationMenuLink>
                      <NavigationMenuLink href="#">Focus system</NavigationMenuLink>
                      <NavigationMenuLink href="#">Motion</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#">Components</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenu>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Sidebar rail & CommandBar</h3>
            <SidebarProvider>
              <div className="flex h-56 overflow-hidden rounded-2xl border border-black/[0.05] dark:border-white/[0.04]">
                <Sidebar width={180}>
                  <SidebarHeader>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Workspace</span>
                  </SidebarHeader>
                  <SidebarBody>
                    <SidebarItem label="Inbox" icon={<Inbox className="w-4 h-4" />} isActive />
                    <SidebarItem label="Calendar" icon={<Calendar className="w-4 h-4" />} />
                    <SidebarItem label="Media" icon={<Layers className="w-4 h-4" />} />
                  </SidebarBody>
                  <SidebarFooter>
                    <span className="text-[10px] text-zinc-400">v1.0</span>
                  </SidebarFooter>
                </Sidebar>
                <div className="flex-1 p-4">
                  <CommandBar leading={<Terminal className="w-4 h-4" />}>
                    <CommandAction keys={["⌘", "K"]}>Palette</CommandAction>
                    <CommandAction>Capture</CommandAction>
                    <CommandAction active>Share</CommandAction>
                  </CommandBar>
                </div>
              </div>
            </SidebarProvider>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.10 WAVE G SPOTLIGHT — AvatarStack/CodeBlock/Carousel               */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                09. Wave G — Group, Code & Media Display
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                AvatarStack · CodeBlock · Carousel (scroll-snap, zero-dep)
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">AvatarStack & CodeBlock</h3>
            <AvatarStack names={['Sara', 'Ali', 'Nima', 'Raha', 'Omid', 'Bahar']} max={4} size="md" />
            <CodeBlock
              language="tsx"
              filename="safa.config.ts"
              showLineNumbers
              code={`import { UI99Provider } from '@99/ui';

export default function App() {
  return (
    <UI99Provider theme="dark">
      <Surface />
    </UI99Provider>
  );
}`}
            />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Carousel</h3>
            <Carousel label="Surface gallery" itemClassName="w-64">
              {['#0B0C11', '#131318', '#1A1A20', '#0E0E14', '#18181D'].map((token, i) => (
                <div
                  key={token}
                  className="h-36 rounded-2xl border border-white/[0.05] flex items-end p-4"
                  style={{ background: token }}
                >
                  <span className="text-[10px] font-mono text-white/50">surface-{i + 1} · {token}</span>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 4.11 WAVE F SPOTLIGHT — DatePicker/Combobox/TimePicker               */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                10. Wave F — Interactive Heavyweights
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                DatePicker · Combobox · TimePicker — the shadcn "both worlds" trio
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">DatePicker</h3>
            <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">Popover month grid · today ring · disabledDates</p>
            <DatePicker placeholder="Pick a deadline" />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Combobox</h3>
            <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">cmdk filter · create-option · 44px rows</p>
            <Combobox
              options={[
                { value: 'deep-work', label: 'Deep work', hint: '90m' },
                { value: 'review', label: 'Review queue', hint: '25m' },
                { value: 'sync', label: 'Team sync', hint: '30m' },
                { value: 'rest', label: 'Velvet rest', hint: '∞' },
              ]}
              value={null}
              onChange={() => {}}
              placeholder="Choose a block…"
              allowCreate
            />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">TimePicker</h3>
            <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">Filterable HH:mm listbox · 30m step</p>
            <TimePicker value={null} onChange={() => {}} step={30} />
          </div>
        </div>
      </section>

      {/* 4.12 WAVE H SPOTLIGHT — Rating/OTPInput/CopyButton/Swatch/NumberField */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <Star className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                11. Wave H — Input & Polish Finals
              </h2>
              <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                Rating · OTPInput · CopyButton · Swatch · NumberField
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">NEW</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Rating & NumberField</h3>
            <WaveHInputsDemo />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">OTPInput</h3>
            <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">Auto-advance · paste · arrows</p>
            <OTPInput length={6} />
            <CopyButton text="npx @99/ui init" label="Copy install" />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Swatch</h3>
            <div className="grid grid-cols-2 gap-3">
              <Swatch name="Root" hex="#06070A" />
              <Swatch name="Surface 1" hex="#0B0C11" />
              <Swatch name="Surface 2" hex="#131318" />
              <Swatch name="Accent" hex="#B45309" contrastNote="AAA on canvas" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. LINEAR-GRADE PATTERNS: Issue Tracker & Workflows */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'LINEAR_PATTERNS') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  03. Linear-Grade Product Workflows & Issue Rows
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  High-velocity task list with status transitions, priority badges, keyboard shortcuts, and batch selection.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd size="xs">C</Kbd>
              <Kbd size="xs">⌘K</Kbd>
            </div>
          </div>

          {/* Linear-Grade Interactive Issue Tracker Engine */}
          <LinearIssueTracker />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. SURFACES & LIQUID GLASS */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'SURFACES') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  04. Liquid Glass & Authentic Materials
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  Sub-pixel rim highlights, frosted glass physics, and living auras.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-[#8E8E98]">
              PHYSICS & BLUR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Obsidian Liquid Glass Dock */}
            <div className="p-6 rounded-3xl bg-[#06070A] border border-white/[0.06] shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-bold font-mono">OBSIDIAN LIQUID DOCK</span>
                <span className="text-[10px] text-zinc-400">rgba(14,14,19,0.52) • blur(20px)</span>
              </div>
              <div className="py-6 flex justify-center">
                <div className="liquid-glass-dark-dock px-4 py-2.5 rounded-full flex items-center gap-3">
                  <span className="p-2 rounded-full bg-white/[0.06] text-white">
                    <LayoutGrid className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <Compass className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <SquarePen className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <Waves className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 text-center">
                Deep obsidian diffusion with specular rim highlight.
              </p>
            </div>

            {/* Matte Porcelain Liquid Dock */}
            <div className="p-6 rounded-3xl bg-[#F5F5F8] border border-black/[0.08] shadow-md space-y-4">
              <div className="flex items-center justify-between text-zinc-900">
                <span className="text-xs font-bold font-mono">PORCELAIN MATTE DOCK</span>
                <span className="text-[10px] text-zinc-500">rgba(255,255,255,0.72) • blur(24px)</span>
              </div>
              <div className="py-6 flex justify-center">
                <div className="liquid-glass-light-dock px-4 py-2.5 rounded-full flex items-center gap-3">
                  <span className="p-2 rounded-full bg-zinc-950 text-white shadow-xs">
                    <LayoutGrid className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-500 hover:text-black transition-colors">
                    <Compass className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-500 hover:text-black transition-colors">
                    <SquarePen className="w-4 h-4" />
                  </span>
                  <span className="p-2 rounded-full text-zinc-500 hover:text-black transition-colors">
                    <Waves className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center">
                Frosted porcelain cushion with gentle specular rim.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. REGISTRY & USAGE GUIDE (shadcn/ui style import documentation) */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'REGISTRY') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  05. Component Registry & Installation Guide
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  Clean 1-line imports, zero-bloat architecture, and copy-ready module definitions.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-[#8E8E98]">
              UNIVERSAL REUSABILITY
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
              Single Barrel Import (Just Like shadcn/ui)
            </h3>

            <p className="text-xs text-zinc-500 dark:text-[#8E8E98] leading-relaxed">
              Every component is consolidated under <code>src/components/ui/index.ts</code>. You can import any piece of UI directly with one clean line:
            </p>

            <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-[#06070A] border border-black/[0.08] dark:border-white/[0.04] relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                <span className="text-[11px] font-mono text-zinc-400">TypeScript Usage Example</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `import {\n  Button,\n  Switch,\n  Slider,\n  Progress,\n  Dropdown,\n  Card,\n  Modal,\n  Kbd\n} from '@/components/ui';`,
                      'Import Barrel'
                    )
                  }
                  className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === 'Import Barrel' ? 'Copied!' : 'Copy Import'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-300 overflow-x-auto no-scrollbar whitespace-pre-wrap">
{`import {
  Button,
  IconButton,
  Switch,
  Checkbox,
  Radio,
  Dropdown,
  Slider,
  Progress,
  Tooltip,
  Accordion,
  Breadcrumb,
  Card,
  Input,
  Modal,
  Kbd,
  PriorityBadge,
  StatusBadge
} from '@/components/ui';`}
              </pre>
            </div>

            {/* Component Inventory Table */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-black/[0.05] dark:border-white/[0.04] text-zinc-400 font-mono">
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Module Path</th>
                    <th className="py-2.5 px-3">Key Props</th>
                    <th className="py-2.5 px-3">Dual-Theme Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.03]">
                  {[
                    { name: 'Button', path: 'src/components/ui/Button.tsx', props: 'variant, size, loading, icon', status: 'Verified WCAG AAA' },
                    { name: 'Switch', path: 'src/components/ui/Switch.tsx', props: 'checked, onChange, size, label', status: 'Haptic Physics' },
                    { name: 'Slider', path: 'src/components/ui/Slider.tsx', props: 'value, onChange, min, max, unit', status: 'Tactile Spring' },
                    { name: 'Progress', path: 'src/components/ui/Progress.tsx', props: 'value, max, variant, segmented', status: 'Shimmer Aura' },
                    { name: 'Dropdown', path: 'src/components/ui/Dropdown.tsx', props: 'value, onChange, options, size', status: 'Velvet Popover' },
                    { name: 'Modal', path: 'src/components/ui/Modal.tsx', props: 'isOpen, onClose, title, subtitle', status: 'Sheet & Dialog' },
                    { name: 'Accordion', path: 'src/components/ui/Accordion.tsx', props: 'items, defaultOpenId, allowMultiple', status: 'Smooth Spring' },
                    { name: 'Tooltip', path: 'src/components/ui/Tooltip.tsx', props: 'content, side, delayMs', status: 'Micro-Elevation' },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01]">
                      <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{row.path}</td>
                      <td className="py-3 px-3 font-mono text-zinc-500">{row.props}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE SANDBOX & LIVE CODE GENERATOR */}
      {/* ========================================================================= */}
      {(activeSection === 'ALL' || activeSection === 'SANDBOX') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.04] pb-3">
            <div className="flex items-center gap-2.5">
              <Code className="w-5 h-5 text-emerald-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  06. Interactive Sandbox & Live JSX Exporter
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#8E8E98]">
                  Configure props in real-time, test tactile physics, and copy production code.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-[#8E8E98]">
              LIVE GENERATOR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF] tracking-tight">
                Configure Properties
              </h3>

              <Dropdown<string>
                label="Select Component"
                value={sbComponent}
                onChange={(v) => setSbComponent(v as any)}
                options={[
                  { value: 'button', label: 'Button' },
                  { value: 'switch', label: 'Switch / Toggle' },
                  { value: 'badge', label: 'PriorityBadge' },
                  { value: 'slider', label: 'Slider' },
                  { value: 'progress', label: 'Progress Meter' },
                ]}
              />

              {sbComponent === 'button' && (
                <>
                  <Dropdown<string>
                    label="Variant"
                    value={sbVariant}
                    onChange={(v) => setSbVariant(v as any)}
                    options={[
                      { value: 'primary', label: 'primary (Dual-adaptive)' },
                      { value: 'secondary', label: 'secondary' },
                      { value: 'outline', label: 'outline' },
                      { value: 'ghost', label: 'ghost' },
                      { value: 'rose', label: 'rose' },
                    ]}
                  />

                  <div className="flex items-center gap-4 pt-1">
                    <Switch
                      size="sm"
                      checked={sbWithIcon}
                      onChange={setSbWithIcon}
                      label="With Icon"
                    />
                    <Switch
                      size="sm"
                      checked={sbLoading}
                      onChange={setSbLoading}
                      label="Loading"
                    />
                    <Switch
                      size="sm"
                      checked={sbDisabled}
                      onChange={setSbDisabled}
                      label="Disabled"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-500">Size</span>
                <SegmentedControl
                  size="sm"
                  value={sbSize}
                  onChange={(v) => setSbSize(v as any)}
                  options={[
                    { value: 'sm', label: 'SM' },
                    { value: 'md', label: 'MD' },
                    { value: 'lg', label: 'LG' },
                  ]}
                />
              </div>

              <Input
                label="Label Content"
                value={sbLabel}
                onChange={(e) => setSbLabel(e.target.value)}
              />
            </div>

            {/* Live Preview & Code */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] flex items-center justify-center min-h-[160px] relative">
                <span className="absolute top-3 left-4 text-[10px] font-mono text-zinc-400">
                  TACTILE PREVIEW STAGE
                </span>

                {sbComponent === 'button' && (
                  <Button
                    variant={sbVariant}
                    size={sbSize}
                    icon={sbWithIcon ? <Sparkles className="w-4 h-4" /> : undefined}
                    loading={sbLoading}
                    disabled={sbDisabled}
                    onClick={() => addToast('Triggered sandbox button!', 'success')}
                  >
                    {sbLabel}
                  </Button>
                )}

                {sbComponent === 'switch' && (
                  <Switch
                    size={sbSize}
                    checked={demoSwitch1}
                    onChange={setDemoSwitch1}
                    label={sbLabel}
                    description="Live toggle state"
                  />
                )}

                {sbComponent === 'badge' && (
                  <PriorityBadge
                    priority="urgent"
                    showLabel={true}
                    size={sbSize === 'lg' ? 'md' : sbSize}
                  />
                )}

                {sbComponent === 'slider' && (
                  <div className="w-full max-w-xs">
                    <Slider
                      value={demoSliderVal}
                      onChange={setDemoSliderVal}
                      label={sbLabel}
                      unit="%"
                    />
                  </div>
                )}

                {sbComponent === 'progress' && (
                  <div className="w-full max-w-xs">
                    <Progress
                      value={demoProgressVal}
                      label={sbLabel}
                      size={sbSize}
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-[#06070A] border border-black/[0.08] dark:border-white/[0.04] relative">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                  <span className="text-[11px] font-mono text-zinc-400">Ready-To-Paste JSX</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sandboxJSXCode, 'Sandbox JSX')}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode === 'Sandbox JSX' ? 'Copied!' : 'Copy JSX'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto no-scrollbar whitespace-pre-wrap">
                  {sandboxJSXCode}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Velvet Demo Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Velvet Obsidian Modal Specification"
        subtitle="Linear-grade elevation with backdrop blur and mobile bottom-sheet drag handle"
      >
        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-[#92929B] leading-relaxed">
            This modal responds natively to the active theme mode. In dark mode, it adopts deep #111114 obsidian depth with a 1px specular rim highlight. In light mode, it manifests as a crisp, shadow-diffused porcelain card.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#16161B] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">Live Status</h4>
              <p className="text-[11px] text-zinc-500">WCAG AAA contrast verified</p>
            </div>
            <StatusBadge status="done" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsDemoModalOpen(false);
                addToast('Modal action executed smoothly', 'success');
              }}
            >
              Confirm Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* shadcn cmdk Command Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
                setIsCommandOpen(false);
                addToast(`Theme switched to ${themeMode === 'dark' ? 'Light' : 'Dark'}`, 'info');
              }}
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>Toggle Dark / Light Theme</span>
              <CmdkShortcut>⌘T</CmdkShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setIsRadixDialogOpen(true);
                setIsCommandOpen(false);
              }}
            >
              <Layers className="mr-2 h-4 w-4" />
              <span>Open Radix Dialog</span>
              <CmdkShortcut>⌘D</CmdkShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setIsSheetOpen(true);
                setIsCommandOpen(false);
              }}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Open Edge Sheet Drawer</span>
              <CmdkShortcut>⌘S</CmdkShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                setActiveSection('FOUNDATIONS');
                setIsCommandOpen(false);
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Foundations & Design Tokens</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setActiveSection('COMPONENTS');
                setIsCommandOpen(false);
              }}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>UI Components & Primitives</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setActiveSection('LINEAR_PATTERNS');
                setIsCommandOpen(false);
              }}
            >
              <Terminal className="mr-2 h-4 w-4" />
              <span>Linear Issue Tracker Workflow</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

// ——— Wave H interactive demo (local state) ———
function WaveHInputsDemo() {
  const [rating, setRating] = useState(4);
  const [count, setCount] = useState(3);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-[#8E8E98]">Rating</span>
        <Rating value={rating} onChange={setRating} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-[#8E8E98]">Pomodoros</span>
        <NumberField value={count} onChange={setCount} min={1} max={12} suffix="×" label="Pomodoros" />
      </div>
    </div>
  );
}
