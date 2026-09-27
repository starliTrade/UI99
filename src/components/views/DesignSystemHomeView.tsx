/**
 * UI \ [99] — Official Product Home & 99-Element Component Registry Studio
 *
 * Full dual-theme (Dark Obsidian / Crisp Light Mode) support,
 * 99-Element registry filtering, live interactive props playground,
 * Code viewer, CLI package managers, and token inspector.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Copy, Check, Github, Sparkles, Zap, ShieldCheck, BookOpen,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { useChoreography, Reveal } from '../ui/motion';
import { RegistryStudio } from '../home/RegistryStudio';
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

/**
 * Reads a live custom-property value from the document. The tokens inspector
 * uses this so it can never display a stale palette: what it prints IS the
 * theme's current value, dark or light.
 */
export function DesignSystemHomeView() {
  const { setCurrentTab, addToast } = useApp();
  const { isRTL } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { reveal } = useChoreography();

  const [activeComponentId, setActiveComponentId] = useState<string>('button');
  const [studioView, setStudioView] = useState<'stage' | 'code' | 'cli' | 'tokens'>('stage');

  // Interactive Live Playground State for Core Families
  const [btnSize, setBtnSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');

  const [badgePriority, setBadgePriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('urgent');

  const [inputValue, setInputValue] = useState('Obsidian Velvet Surface');
  const [otpValue, setOtpValue] = useState('9942');
  const [sliderValue, setSliderValue] = useState(78);
  const [ratingValue, setRatingValue] = useState(4.5);


  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 1600);
  };


  /**
   * The registry facts a visitor needs to trust a primitive — grouped, not
   * run together. Each one is a claim the kit can actually back: the
   * dependency list is the real one, the prop count is the documented
   * surface, and the accessibility badge is a kit-wide guarantee rather than
   * a per-component decoration.
   */


  return (
    <div className="w-full pb-16 px-0 sm:px-1 max-w-6xl mx-auto text-zinc-900 dark:text-white select-none transition-colors">

      {/* ══════════════════════════════════════════════════════════════
          1 · HERO SECTION (Obsidian Velvet + Soft Emerald Brand Halo)
         ══════════════════════════════════════════════════════════════ */}
      <section dir={isRTL ? 'rtl' : 'ltr'} className="relative flex flex-col items-start pb-6 sm:pb-10 overflow-visible">
        {/* The Token Lattice 3D panel was removed from the hero by audit
            decision: a hero must show the product, and the product is type +
            the registry studio directly below — not an abstract lattice. The
            component itself stays in the registry (102 = installable kit). */}

        {/* Soft, faint emerald brand ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/3 -translate-x-1/2 w-[280px] sm:w-[700px] h-[220px] sm:h-[380px] rounded-(--radius-pill) blur-(--blur-ambient) sm:blur-(--blur-ambient) pointer-events-none -z-content opacity-70 dark:opacity-85 transition-opacity"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.035) 40%, rgba(255, 255, 255, 0.015) 60%, transparent 80%)',
          }}
        />

        {/* Secondary ambient specular feather */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-1/4 w-[200px] sm:w-[400px] h-[160px] sm:h-[260px] rounded-(--radius-pill) blur-(--blur-ambient) sm:blur-(--blur-ambient) pointer-events-none -z-content opacity-40 dark:opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
          }}
        />

        {/* Main Display Headline — bilingual. Under data-script='fa' the type
            ramp swaps itself to the Persian optical steps (display 33px /
            billboard 66px), so no component-side mirroring is needed. The
            break point is a real sentence break in both scripts, so a plain
            <br> is correct in both directions — no mirrored markup. */}        <motion.h1
          {...reveal(0)}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="type-display sm:type-billboard font-semibold tracking-[-0.035em] sm:tracking-[-0.04em] text-zinc-950 dark:text-(--text-primary) leading-[1.08] sm:leading-[1.03] text-start"
        >
          {/* Positioning copy — declares a category the way Material and HIG
              do: the system itself is the product. Line 3 is the era claim. */}
          {isRTL ? (
            <>
              سیستم طراحی،
              <br />
              نه وابستگی.
              <br />
              عصرِ تازه‌ی طراحی.
            </>
          ) : (
            <>
              A design system,
              <br />
              not a dependency.
              <br />
              Design's new era.
            </>
          )}
        </motion.h1>

        {/* Subtitle — two staccato lines. Line 1 proves WHAT it is (substance),
            line 2 proves WHO owns it (freedom). Both mirror the headline's
            "system, not dependency" claim; each stays ≤ ~45 chars so the two
            lines never wrap past two visual lines on a 360px phone. */}
        <motion.p
          {...reveal(2)}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="mt-3 sm:mt-5 type-body sm:type-body-lg text-zinc-600 dark:text-[#8E909D] leading-relaxed text-start max-w-xl font-normal"
        >
          {isRTL ? (
            <>
              ۱۰۲ پریمیتیو ممیزی‌شده. یک هسته‌ی توکن.
              <br />
              از CLI تو. در ریپوی تو. برای همیشه.
            </>
          ) : (
            <>
              102 audited primitives. One token core.
              <br />
              From your CLI. Owned in your repo. Forever.
            </>
          )}
        </motion.p>

        {/* Hero Actions — every target is a 44px floor (AGENTS §5 touch rule;
            h-9/36px was a pointer-only affordance on the primary CTA). The CLI
            box matches the row height so the wrap never produces two elevations. */}
        <motion.div
          {...reveal(3)}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="relative mt-5 sm:mt-7 flex flex-wrap items-center gap-2 w-full"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-(--radius-control) bg-emerald-500/[0.03] dark:bg-emerald-400/[0.03] blur-xl pointer-events-none -z-content"
          />

          {/* 1. Primary Action: Browse the registry */}
          <button
            type="button"
            onClick={() => setCurrentTab('UIKIT')}
            className="order-1 w-full sm:order-none sm:w-auto min-h-[44px] px-4 rounded-(--radius-field) inline-flex items-center justify-center gap-1 type-caption font-semibold cursor-pointer transition-all bg-(--ink-fill) hover:opacity-90 text-(--text-on-fill) shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            <span>
              {isRTL
                ? `مرور ${Number(KIT_COMPONENT_COUNT).toLocaleString('fa-IR')} کامپوننت`
                : `Explore ${KIT_COMPONENT_COUNT} Components`}
            </span>
            {/* Forward = the reading direction: flipped in RTL. */}
            {isRTL ? <ArrowLeft className="icon-sm" /> : <ArrowRight className="icon-sm" />}
          </button>

          {/* 2. Secondary Action: Documentation */}
          <button
            type="button"
            onClick={() => setCurrentTab('DOCS')}
            className="order-3 flex-1 sm:order-none sm:flex-none min-h-[44px] px-4 rounded-(--radius-field) inline-flex items-center justify-center gap-1 type-caption font-medium cursor-pointer transition-all bg-(--bg-control) hover:bg-(--bg-control-hover) text-(--text-secondary) hover:text-(--text-primary) border border-(--border-soft) active:scale-[0.98] whitespace-nowrap"
          >
            <BookOpen className="icon-sm text-(--text-secondary)" />
            <span>{isRTL ? 'مستندات تعاملی' : 'Interactive Docs'}</span>
          </button>

          {/* 3. GitHub Action */}
          <button
            type="button"
            onClick={() => window.open('https://github.com/starliTrade/UI99', '_blank', 'noopener')}
            className="order-4 flex-1 sm:order-none sm:flex-none min-h-[44px] px-4 rounded-(--radius-field) inline-flex items-center justify-center gap-1 type-caption font-medium cursor-pointer transition-all bg-(--bg-control) hover:bg-(--bg-control-hover) text-(--text-secondary) hover:text-(--text-primary) border border-(--border-soft) active:scale-[0.98] whitespace-nowrap"
          >
            <Github className="icon-sm text-(--text-secondary)" />
            <span>GitHub</span>
          </button>

          {/* 4. Terminal Action: CLI Install Box — the command itself stays
              LTR even in Persian: code is code, and mixing bidi into a shell
              command corrupts it. */}
          <div className="order-2 w-full sm:order-none sm:w-auto min-h-[44px] inline-flex items-center justify-between gap-2 pl-3 pr-1 rounded-(--radius-field) bg-(--bg-control) hover:bg-(--bg-control-hover) border border-(--border-soft) type-caption font-mono text-(--text-secondary) whitespace-nowrap">
            <span dir="ltr" className="flex items-center gap-1">
              <span className="font-mono text-emerald-500 dark:text-emerald-400 font-bold select-none tracking-tight">
                &gt;_
              </span>
              <span className="font-mono font-medium text-zinc-800 dark:text-(--text-primary) type-body tracking-tight">
                npx @99/ui init
              </span>
            </span>
            <button
              type="button"
              onClick={() => copy('npx @99/ui init', 'cli-init')}
              aria-label={isRTL ? 'کپی دستور' : 'Copy CLI command'}
              className="p-1 rounded-(--radius-sm) hover:bg-(--bg-control-hover) text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer shrink-0 ml-1"
            >
              {copiedKey === 'cli-init' ? (
                <Check className="icon-xs text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy className="icon-xs" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      <Reveal index={4}>
        <RegistryStudio />
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          3 · DESIGN SYSTEM CRAFT PILLARS
         ══════════════════════════════════════════════════════════════ */}
      <Reveal index={5}>
        <section className="pt-12 sm:pt-16 space-y-4">
          {/* Left-Aligned Header */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-(--radius-pill) bg-emerald-500 inline-block" />
              <span className="type-micro font-mono uppercase tracking-widest text-zinc-500 dark:text-(--text-secondary)">
                Engineering Architecture
              </span>
            </div>
            <h2 className="type-title sm:type-heading font-bold tracking-tight text-zinc-950 dark:text-white">
              Crafted without compromise
            </h2>
            <p className="type-caption sm:type-body text-zinc-600 dark:text-(--text-secondary) max-w-xl">
              Engineered with the exact standards required by production developer tools and enterprise web applications.
            </p>
          </div>

          {/* Connected Pillar Card */}
          <div className="rounded-(--radius-control) bg-white dark:bg-(--bg-surface) border border-(--border-soft) shadow-(--elevation-1) dark:shadow-(--elevation-1) divide-y divide-zinc-100 dark:divide-(--border-soft) sm:divide-y-0 sm:bg-transparent sm:dark:bg-transparent sm:border-0 sm:shadow-none sm:grid sm:grid-cols-3 sm:gap-3">
            {/* Pillar 1: Keyboard Velocity */}
            <div className="p-3 sm:p-4 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-(--bg-surface) sm:border sm:border-zinc-200/80 sm:dark:border-(--border-soft) sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-(--border-strong) dark:hover:border-(--border-soft)">
              <div className="w-8 h-8 rounded-(--radius-field) bg-(--bg-subtle) dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-(--border-soft) dark:border-emerald-500/20">
                <Zap className="icon-md" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="type-caption sm:type-body font-bold text-zinc-950 dark:text-white">
                    Keyboard Velocity &amp; {KIT_COMPONENT_COUNT} Elements
                  </h3>
                </div>
                <p className="type-micro sm:type-caption text-zinc-600 dark:text-(--text-secondary) leading-relaxed">
                  Roving tabindex, global <code className="px-1 py-0.5 rounded bg-(--bg-subtle) dark:bg-(--bg-raised) text-zinc-800 dark:text-zinc-200 font-mono type-micro border border-(--border-soft)">⌘K</code> hotkeys, and tactile focus states across all 99 primitives.
                </p>
              </div>
            </div>

            {/* Pillar 2: Specular Velvet Depth */}
            <div className="p-3 sm:p-4 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-(--bg-surface) sm:border sm:border-zinc-200/80 sm:dark:border-(--border-soft) sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-(--border-strong) dark:hover:border-(--border-soft)">
              <div className="w-8 h-8 rounded-(--radius-field) bg-(--bg-subtle) dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-(--border-soft) dark:border-indigo-500/20">
                <Sparkles className="icon-md" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="type-caption sm:type-body font-bold text-zinc-950 dark:text-white">
                    Specular Velvet Depth
                  </h3>
                </div>
                <p className="type-micro sm:type-caption text-zinc-600 dark:text-(--text-secondary) leading-relaxed">
                  Mathematical obsidian layers with sub-pixel rim highlights that separate naturally in any environment.
                </p>
              </div>
            </div>

            {/* Pillar 3: Zero Runtime Overhead */}
            <div className="p-3 sm:p-4 sm:rounded-(--radius-control) sm:bg-white sm:dark:bg-(--bg-surface) sm:border sm:border-zinc-200/80 sm:dark:border-(--border-soft) sm:shadow-(--elevation-1) sm:dark:shadow-(--elevation-1) flex items-start gap-3 transition-all hover:border-(--border-strong) dark:hover:border-(--border-soft)">
              <div className="w-8 h-8 rounded-(--radius-field) bg-(--bg-subtle) dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-(--border-soft) dark:border-amber-500/20">
                <ShieldCheck className="icon-md" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="type-caption sm:type-body font-bold text-zinc-950 dark:text-white">
                    Zero Runtime Overhead
                  </h3>
                </div>
                <p className="type-micro sm:type-caption text-zinc-600 dark:text-(--text-secondary) leading-relaxed">
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
      <footer className="pt-8 sm:pt-10 mt-12 sm:mt-16 border-t border-(--border-soft) dark:border-(--border-soft)">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono type-caption sm:type-body font-bold text-zinc-950 dark:text-white">
              UI \ [99]
            </span>
            <span className="type-micro font-mono text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">{KIT_COMPONENT_COUNT} Elements</span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4 type-caption font-mono text-zinc-500 dark:text-(--text-secondary)" aria-label="Footer Navigation">
            {(['UIKIT', 'BLOCKS', 'DOCS', 'FOUNDATIONS'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className="hover:text-(--text-primary) transition-colors cursor-pointer"
              >
                {tab === 'UIKIT' ? `${KIT_COMPONENT_COUNT} Components` : tab === 'BLOCKS' ? 'Patterns' : tab === 'DOCS' ? 'Guides' : 'Design Tokens'}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-(--border-subtle) flex flex-wrap items-center justify-between gap-2 type-micro sm:type-micro font-mono text-zinc-500">
          <span>© 2026 UI \ [99] · MIT Licensed</span>
          <span>Dual Obsidian / Light Primitives · {KIT_COMPONENT_COUNT} Certified Elements</span>
        </div>
      </footer>
    </div>
  );
}
