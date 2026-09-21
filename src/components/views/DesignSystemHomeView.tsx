/**
 * UI \ [99] — Official Design System & Registry Platform (shadcn/ui + Linear Standard)
 * 
 * Crafted to the exact design excellence of https://ui.shadcn.com:
 * - Direct typography hierarchy with clean Geist/Inter + JetBrains Mono pairings
 * - Minimalist Announcement Pill: "Announcing UI \ [99] v1.0 — Obsidian Velvet Engine"
 * - Huge confident headline with high-contrast subtitles
 * - Exact shadcn action button pair: "Get Started" (solid black/white) + "GitHub" / "Components"
 * - Live Component Showcase Stage with real interactive card, buttons, tabs, input, datepicker/sliders, and badges
 * - Unified border & shadow profile: sub-pixel hairline border + top rim highlight + deep diffusion
 * - Zero AI slop, zero low-contrast muddy colors, mathematical harmony throughout.
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Layers,
  Sparkles,
  Github,
  BookOpen,
  Keyboard,
  Sliders,
  CheckCircle2,
  Calendar,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Shield,
  Command,
  Palette,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useChoreography, Reveal } from '../ui/motion';
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
  Switch,
  Input,
  Kbd,
  UI99BrandLogo,
} from '../ui';

const COMPONENT_INDEX: { name: string; slug: string; cat: 'Actions' | 'Inputs' | 'Navigation' | 'Data' | 'Overlays' | 'Layout' | 'Feedback' | 'Display' }[] = [
  { name: 'Button', slug: 'button', cat: 'Actions' },
  { name: 'IconButton', slug: 'icon-button', cat: 'Actions' },
  { name: 'Toggle', slug: 'toggle', cat: 'Actions' },
  { name: 'ToggleGroup', slug: 'toggle-group', cat: 'Actions' },
  { name: 'CopyButton', slug: 'copy-button', cat: 'Actions' },
  { name: 'Input', slug: 'input', cat: 'Inputs' },
  { name: 'Textarea', slug: 'textarea', cat: 'Inputs' },
  { name: 'SearchBar', slug: 'search-bar', cat: 'Inputs' },
  { name: 'Switch', slug: 'switch', cat: 'Inputs' },
  { name: 'Checkbox', slug: 'checkbox', cat: 'Inputs' },
  { name: 'RadioGroup', slug: 'radio-group', cat: 'Inputs' },
  { name: 'Slider', slug: 'slider', cat: 'Inputs' },
  { name: 'DatePicker', slug: 'date-picker', cat: 'Inputs' },
  { name: 'TimePicker', slug: 'time-picker', cat: 'Inputs' },
  { name: 'Combobox', slug: 'combobox', cat: 'Inputs' },
  { name: 'Rating', slug: 'rating', cat: 'Inputs' },
  { name: 'OTPInput', slug: 'otp-input', cat: 'Inputs' },
  { name: 'NumberField', slug: 'number-field', cat: 'Inputs' },
  { name: 'FileUpload', slug: 'file-upload', cat: 'Inputs' },
  { name: 'Label', slug: 'label', cat: 'Inputs' },
  { name: 'SegmentedControl', slug: 'segmented-control', cat: 'Navigation' },
  { name: 'Breadcrumb', slug: 'breadcrumb', cat: 'Navigation' },
  { name: 'Tabs', slug: 'tabs', cat: 'Navigation' },
  { name: 'Pagination', slug: 'pagination', cat: 'Navigation' },
  { name: 'Menubar', slug: 'menubar', cat: 'Navigation' },
  { name: 'NavigationMenu', slug: 'navigation-menu', cat: 'Navigation' },
  { name: 'Sidebar', slug: 'sidebar', cat: 'Navigation' },
  { name: 'CommandBar', slug: 'command-bar', cat: 'Navigation' },
  { name: 'Table', slug: 'table', cat: 'Data' },
  { name: 'Badge', slug: 'badge', cat: 'Data' },
  { name: 'Progress', slug: 'progress', cat: 'Data' },
  { name: 'Sparkline', slug: 'sparkline', cat: 'Data' },
  { name: 'DonutRing', slug: 'donut-ring', cat: 'Data' },
  { name: 'HeatMapCalendar', slug: 'heat-map-calendar', cat: 'Data' },
  { name: 'StatTile', slug: 'stat-tile', cat: 'Data' },
  { name: 'MeterBar', slug: 'meter-bar', cat: 'Data' },
  { name: 'TrendDelta', slug: 'trend-delta', cat: 'Data' },
  { name: 'Timeline', slug: 'timeline', cat: 'Data' },
  { name: 'Stepper', slug: 'stepper', cat: 'Data' },
  { name: 'Kbd', slug: 'kbd', cat: 'Data' },
  { name: 'Dialog', slug: 'dialog', cat: 'Overlays' },
  { name: 'AlertDialog', slug: 'alert-dialog', cat: 'Overlays' },
  { name: 'Modal', slug: 'modal', cat: 'Overlays' },
  { name: 'Sheet', slug: 'sheet', cat: 'Overlays' },
  { name: 'Popover', slug: 'popover', cat: 'Overlays' },
  { name: 'DropdownMenu', slug: 'dropdown-menu', cat: 'Overlays' },
  { name: 'Tooltip', slug: 'tooltip', cat: 'Overlays' },
  { name: 'HoverCard', slug: 'hover-card', cat: 'Overlays' },
  { name: 'Command', slug: 'command', cat: 'Overlays' },
  { name: 'Separator', slug: 'separator', cat: 'Layout' },
  { name: 'ScrollArea', slug: 'scroll-area', cat: 'Layout' },
  { name: 'AspectRatio', slug: 'aspect-ratio', cat: 'Layout' },
  { name: 'Card', slug: 'card', cat: 'Layout' },
  { name: 'Collapsible', slug: 'collapsible', cat: 'Layout' },
  { name: 'Accordion', slug: 'accordion', cat: 'Layout' },
  { name: 'Alert', slug: 'alert', cat: 'Feedback' },
  { name: 'EmptyState', slug: 'empty-state', cat: 'Feedback' },
  { name: 'LoadingState', slug: 'loading-state', cat: 'Feedback' },
  { name: 'Skeleton', slug: 'skeleton', cat: 'Feedback' },
  { name: 'AvatarStack', slug: 'avatar-stack', cat: 'Display' },
  { name: 'CodeBlock', slug: 'code-block', cat: 'Display' },
  { name: 'Carousel', slug: 'carousel', cat: 'Display' },
  { name: 'Swatch', slug: 'swatch', cat: 'Display' },
];

export function DesignSystemHomeView() {
  const { themeMode, addToast, setCurrentTab } = useApp();
  const isDark = themeMode === 'dark';

  const { reveal } = useChoreography();

  // — 3D pointer-tracked hero tilt (spring-damped,Apple-grade restraint) —
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const springTiltY = useSpring(tiltY, { stiffness: 150, damping: 20 });
  const heroRotateX = useTransform(springTiltY, [-0.5, 0.5], [6, -6]);
  const heroRotateY = useTransform(springTiltX, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(springTiltX, [-0.5, 0.5], ['38%', '62%']);
  const glowY = useTransform(springTiltY, [-0.5, 0.5], ['30%', '70%']);

  const onHeroPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onHeroPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerCat, setExplorerCat] = useState<'ALL' | 'Actions' | 'Inputs' | 'Navigation' | 'Data' | 'Overlays' | 'Layout' | 'Feedback' | 'Display'>('ALL');
  const explorerQuery_fn = (v: string) => v;

  // Live Showcase interactive state
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'cards' | 'forms' | 'badges' | 'cli'>('cards');
  const [pm, setPm] = useState<'npm' | 'pnpm' | 'bun' | 'yarn'>('npm');
  const PM_ADD: Record<typeof pm, string> = {
    npm: 'npx @99/ui add button card',
    pnpm: 'pnpm dlx @99/ui add button card',
    bun: 'bunx @99/ui add button card',
    yarn: 'yarn dlx @99/ui add button card',
  };
  const [sliderVal, setSliderVal] = useState(72);
  const [switchVal, setSwitchVal] = useState(true);
  const [inputVal, setInputVal] = useState('contact@atelier99.design');
  const [selectedPriority, setSelectedPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('urgent');


  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-14 sm:space-y-20 pb-20 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 1. HERO — 3D depth stage: perspective tilt, cursor aurora, live parallax */}
      {/* ========================================================================= */}
        <section
        className="relative pt-6 sm:pt-14 pb-4 max-w-5xl mx-auto"
        style={{ perspective: 1200 }}
        onPointerMove={onHeroPointerMove}
        onPointerLeave={onHeroPointerLeave}
      >
        {/* Cursor-tracking aurora glow (spring-damped) */}
        <motion.div
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[380px] rounded-full blur-[130px] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(closest-side, rgba(16,185,129,0.10), transparent)',
            left: glowX,
            top: glowY,
          }}
        />

        <motion.div
          style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: 'preserve-3d' }}
          className="relative flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
        >
          {/* Layer z=0 — announcement pill (reveal(0)) */}
          <motion.div
            {...reveal(0)}
            style={{ transform: 'translateZ(30px)' }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-[#0E0E14] text-zinc-800 dark:text-zinc-300 border border-black/[0.06] dark:border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] cursor-pointer hover:border-emerald-500/40 transition-all duration-200"
            onClick={() => setCurrentTab('DOCS')}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">UI \ [99] v1.0</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-zinc-600 dark:text-zinc-400">Obsidian Velvet Registry</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
          </motion.div>

          {/* Layer z=55 — headline */}
          <motion.div
            {...reveal(1)}
            style={{ transform: 'translateZ(55px)' }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
              Build your component library.
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
              Accessible, copy-and-paste React primitives with velvet obsidian depth — engine built for teams who sweat the last pixel.
            </p>
          </motion.div>

          {/* Layer z=40 — CTA row */}
          <motion.div
            {...reveal(2)}
            style={{ transform: 'translateZ(40px)' }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2 w-full"
          >
            <Button
              size="md"
              variant="primary"
              onClick={() => setCurrentTab('DOCS')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Get Started
            </Button>

            <Button
              size="md"
              variant="outline"
              icon={<Github className="w-4 h-4" />}
              onClick={() => window.open('https://github.com/starliTrade/UI99', '_blank', 'noopener')}
              className="w-full sm:w-auto min-h-[44px]"
            >
              GitHub
            </Button>

            <Button
              size="md"
              variant="secondary"
              icon={<Layers className="w-4 h-4" />}
              onClick={() => setCurrentTab('UIKIT')}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Browse Components
            </Button>

            {/* Quick CLI copy pill */}
            <div className="inline-flex items-center justify-between sm:justify-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.06] dark:border-white/[0.04] text-xs font-mono text-zinc-800 dark:text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] w-full sm:w-auto min-h-[44px]">
              <span className="truncate">
                <span className="text-zinc-500 select-none">$ </span>
                <span className="font-semibold">npx @99/ui init</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard('npx @99/ui init', 'hero-cli')}
                aria-label="Copy install command to clipboard"
                className="ml-1 p-2 -m-1 rounded-lg hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer relative after:absolute after:-inset-1 after:content-['']"
              >
                {copiedKey === 'hero-cli' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5 SYSTEM STATS STRIP — real numbers, mobile-first 2x2 grid              */}
      {/* ========================================================================= */}
        <Reveal>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { value: '63', label: 'Components', sub: 'registry:ui items' },
          { value: '100+', label: 'Variants', sub: 'full size matrix' },
          { value: '0', label: 'Axe Violations', sub: 'CI-blocked gate' },
          { value: '2', label: 'Themes', sub: 'Obsidian · Porcelain' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{stat.label}</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">{stat.sub}</div>
          </div>
        ))}
      </section>
      </Reveal>

      {/* ========================================================================= */}
      {/* 2. SHADCN-STYLE INTERACTIVE SHOWCASE STAGE                                */}
      {/* ========================================================================= */}
        <Reveal index={1}>
      <section className="space-y-4">
        {/* Showcase Header Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.04] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Examples
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">Live Production Primitives</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.03] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.03] self-start overflow-x-auto no-scrollbar max-w-full">
            {(
              [
                { id: 'cards', label: 'Cards & Surfaces' },
                { id: 'forms', label: 'Forms & Controls' },
                { id: 'badges', label: 'Badges & Tags' },
                { id: 'cli', label: 'CLI Architecture' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveShowcaseTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 whitespace-nowrap min-h-[36px] ${
                  activeShowcaseTab === tab.id
                    ? 'bg-white text-zinc-950 dark:bg-[#131318] dark:text-white font-semibold shadow-xs border border-black/[0.04] dark:border-white/[0.04]'
                    : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stage Card */}
        <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.035] bg-zinc-50/70 dark:bg-[#08090D] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.07] pointer-events-none" />

          {/* TAB 1: Cards & Surfaces */}
          {activeShowcaseTab === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Card Example 1: Project Overview */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.035] shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-emerald-500 uppercase tracking-wider">
                      Repository
                    </span>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                      @99/ui-core-registry
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Zero-runtime overhead modular component system.
                    </p>
                  </div>
                  <PriorityBadge priority="urgent" size="sm" showLabel={false} />
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#131318] border border-black/[0.04] dark:border-white/[0.03] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>Installation Progress</span>
                    <span className="text-emerald-500 font-bold">{sliderVal}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${sliderVal}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <Tag variant="neutral">React 19</Tag>
                    <Tag variant="purple">Tailwind v4</Tag>
                  </div>
                  <Button size="xs" variant="secondary" onClick={() => setCurrentTab('DOCS')}>
                    View Docs
                  </Button>
                </div>
              </div>

              {/* Card Example 2: Interactive Linear Issue */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.035] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="font-bold text-zinc-900 dark:text-zinc-200">UI-99</span>
                      <span>•</span>
                      <span>Linear Workspace</span>
                    </div>
                    <StatusBadge status="in_progress" showLabel={true} />
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Sub-pixel specular rim highlights on Obsidian Velvet (#06070A)
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Ensure zero-slop mathematical nested radii (<code className="text-emerald-400 font-mono">r_in = r_out - p</code>) across all card surfaces.
                  </p>
                </div>

                <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.03] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
                    <Kbd size="xs">C</Kbd>
                    <span>Create Issue</span>
                  </div>
                  <Button size="xs" variant="primary" onClick={() => setCurrentTab('BLOCKS')}>
                    Open Issue Tracker
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Forms & Controls */}
          {activeShowcaseTab === 'forms' && (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.035] shadow-xs space-y-5 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Form Controls & State
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Accessible, keyboard-navigable inputs with tactile feedback.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-500">Email Address</label>
                  <Input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>Slider Density</span>
                    <span>{sliderVal}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#131318] border border-black/[0.04] dark:border-white/[0.03]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      Obsidian Velvet Mode
                    </span>
                    <p className="text-[11px] text-zinc-500">
                      Specular highlight on surface borders
                    </p>
                  </div>
                  <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
                </div>
              </div>

              <Button size="sm" variant="primary" className="w-full">
                Save Preferences
              </Button>
            </div>
          )}

          {/* TAB 3: Badges & Tags */}
          {activeShowcaseTab === 'badges' && (
            <div className="space-y-6 relative z-10 py-4 max-w-xl mx-auto">
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500">Status Badges</span>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="done" showLabel={true} />
                  <StatusBadge status="in_progress" showLabel={true} />
                  <StatusBadge status="todo" showLabel={true} />
                  <StatusBadge status="canceled" showLabel={true} />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500">Priority Levels</span>
                <div className="flex flex-wrap items-center gap-3">
                  {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPriority(p)}
                      className={`cursor-pointer transition-transform ${
                        selectedPriority === p ? 'scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <PriorityBadge priority={p} showLabel={true} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500">Categorical Tags</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag variant="neutral">UI \ [99]</Tag>
                  <Tag variant="blue">TypeScript</Tag>
                  <Tag variant="purple">Architecture</Tag>
                  <Tag variant="green">Passed</Tag>
                  <Tag variant="rose">Deprecations</Tag>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLI Architecture */}
          {activeShowcaseTab === 'cli' && (
            <div className="space-y-4 max-w-xl mx-auto relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Component Installation</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Direct code generation into your repository without dependency lock-in.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-white/[0.03] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.03] w-fit">
                {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((mgr) => (
                  <button
                    key={mgr}
                    type="button"
                    onClick={() => setPm(mgr)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-colors min-h-[28px] ${
                      pm === mgr
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    {mgr}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.06] font-mono text-xs text-zinc-200 space-y-2">
                <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2">
                  <span>Terminal</span>
                  <span className="text-[10px] text-emerald-400">bash</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-400">{PM_ADD[pm]}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(PM_ADD[pm], 'cli-box')}
                    className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-white"
                  >
                    {copiedKey === 'cli-box' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2">
                <span>Supports: Next.js 15, Vite React, Astro, Remix</span>
                <Button size="xs" variant="secondary" onClick={() => setCurrentTab('DOCS')}>
                  Read CLI Spec
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* ========================================================================= */}
      {/* 2.5 COMPONENT EXPLORER — searchable 63-item grid (shadcn parity)          */}
      {/* ========================================================================= */}
        <Reveal index={1}>
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              63 Components. Zero lock-in.
            </h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={explorerQuery}
              onChange={(e) => setExplorerQuery(explorerQuery_fn(e.target.value))}
              placeholder="Search components…"
              aria-label="Search components"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-safa-inset"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
          {(['ALL', 'Actions', 'Inputs', 'Navigation', 'Data', 'Overlays', 'Layout', 'Feedback', 'Display'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setExplorerCat(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono whitespace-nowrap cursor-pointer transition-colors min-h-[32px] border ${
                explorerCat === cat
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent font-semibold'
                  : 'bg-transparent text-zinc-500 border-black/[0.06] dark:text-zinc-400 dark:border-white/[0.06] hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {COMPONENT_INDEX.filter(
            (c) =>
              (explorerCat === 'ALL' || c.cat === explorerCat) &&
              c.name.toLowerCase().includes(explorerQuery.toLowerCase())
          ).map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => copyToClipboard(`npx @99/ui add ${c.slug}`, `explorer-${c.slug}`)}
              className="group flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] text-left cursor-pointer transition-all duration-150 hover:border-emerald-500/35 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-safa min-h-[44px]"
              title={`Copy: npx @99/ui add ${c.slug}`}
            >
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{c.name}</span>
              <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedKey === `explorer-${c.slug}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Terminal className="w-3 h-3 text-zinc-400" />
                )}
              </span>
            </button>
          ))}
        </div>

        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
          Click any component to copy its install command · powered by the same registry behind npx @99/ui
        </p>
      </section>
      </Reveal>


      {/* ========================================================================= */}
      {/* 4.5 THEMES — Obsidian × Porcelain                                         */}
      {/* ========================================================================= */}
      <Reveal index={1}>
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Presets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Two token universes, one audit bar.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Every preset passes the same WCAG-computed contrast gate. Install as a registry theme item — no runtime JS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {([
            {
              id: 'safa-theme',
              name: 'Obsidian Dark',
              desc: 'Velvet obsidian canvas with specular rim highlights. The default.',
              canvas: '#06070A',
              swatches: ['#0B0C11', '#131318', '#FFFFFF', '#10B981', '#B45309'],
              dark: true,
            },
            {
              id: 'safa-theme-porcelain',
              name: 'Porcelain Light',
              desc: 'Warm bone-white ceramic with ink text and copper focus.',
              canvas: '#FAF9F6',
              swatches: ['#FFFFFF', '#F6F5F1', '#1C1917', '#059669', '#B45309'],
              dark: false,
            },
          ] as const).map((theme) => (
            <div
              key={theme.id}
              className="p-6 rounded-3xl border border-black/[0.05] dark:border-white/[0.03] bg-zinc-50/70 dark:bg-[#0B0C11] space-y-4"
            >
              <div
                className="h-24 rounded-2xl border p-4 flex flex-col justify-between"
                style={{ background: theme.canvas, borderColor: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(28,25,23,0.08)' }}
              >
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: theme.dark ? '#EDEDEF' : '#1C1917' }}
                >
                  {theme.name}
                </span>
                <div className="flex gap-2">
                  {theme.swatches.map((hex) => (
                    <span
                      key={hex}
                      className="w-7 h-7 rounded-lg border"
                      style={{ background: hex, borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(28,25,23,0.1)' }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{theme.desc}</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => copyToClipboard(`npx @99/ui add ${theme.id}`, `theme-${theme.id}`)}
                  >
                    {copiedKey === `theme-${theme.id}` ? 'Copied!' : 'Copy install'}
                  </Button>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">registry:theme</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="pt-12 border-t border-black/[0.06] dark:border-white/[0.04] space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <UI99BrandLogo size="md" withSubtitle={true} />

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            {(
              [
                { id: 'UIKIT', label: 'Components' },
                { id: 'DOCS', label: 'Documentation' },
                { id: 'BLOCKS', label: 'Blocks' },
              ] as const
            ).map((link, i) => (
              <React.Fragment key={link.id}>
                {i > 0 && <span>•</span>}
                <button
                  type="button"
                  onClick={() => setCurrentTab(link.id)}
                  className="hover:text-black dark:hover:text-white transition-colors cursor-pointer py-2 min-h-[44px] flex items-center focus-visible:outline-none focus-safa"
                >
                  {link.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 pt-4 border-t border-black/[0.04] dark:border-white/[0.03]">
          <span>© 2026 UI \ [99]. Built with Obsidian Velvet Depth & Linear Velocity.</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
}
