/**
 * UI \ [99] — Product Home (shadcn-class, ruthless focus)
 *
 * Five blocks. One visual language. Zero noise:
 *   1. Hero        — pill, one headline, one sentence, two actions
 *   2. Live window — a real product surface inside a quiet app frame
 *   3. Explorer    — the 63-component registry, searchable, click-to-install
 *   4. Token line  — one-line theme statement with palette swatches
 *   5. Footer      — two lines
 * Sections breathe (py-20); cards share one radius/border/shadow recipe.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Copy, Check, Search, Terminal, Github, Layers } from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useChoreography, Reveal } from '../ui/motion';
import {
  Button,
  StatusBadge,
  PriorityBadge,
  Switch,
  Input,
  Kbd,
  AvatarStack,
  Sparkline,
  StatTile,
  MeterBar,
  TrendDelta,
  Progress,
  SegmentedControl,
  UI99Wordmark,
} from '../ui';

/* ------------------------------------------------------------------ */
/* Component index — mirrors public/registry.json (63 registry:ui)     */
/* ------------------------------------------------------------------ */

type Cat = 'Actions' | 'Inputs' | 'Navigation' | 'Data' | 'Overlays' | 'Layout' | 'Feedback' | 'Display';

const COMPONENT_INDEX: { name: string; slug: string; cat: Cat }[] = [
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

const CATS: ('All' | Cat)[] = ['All', 'Actions', 'Inputs', 'Navigation', 'Data', 'Overlays', 'Layout', 'Feedback', 'Display'];

/* ------------------------------------------------------------------ */

export function DesignSystemHomeView() {
  const { setCurrentTab, addToast, setFocusComponent } = useApp();
  const { reveal } = useChoreography();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [demoTab, setDemoTab] = useState<'app' | 'forms' | 'data'>('app');
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerCat, setExplorerCat] = useState<(typeof CATS)[number]>('All');
  const [switchOn, setSwitchOn] = useState(true);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const filtered = COMPONENT_INDEX.filter(
    (c) => (explorerCat === 'All' || c.cat === explorerCat) && c.name.toLowerCase().includes(explorerQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 px-2 sm:px-4">

      {/* ══════════════════════════════════════════════════════════════
          1 · HERO — quiet, confident, two actions
         ══════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center text-center pt-16 sm:pt-24 pb-20 sm:pb-24">
        {/* single calm aurora */}
        <div
          aria-hidden="true"
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[560px] h-[300px] rounded-full blur-[140px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(closest-side, rgba(16,185,129,0.07), transparent)' }}
        />

        <motion.button
          {...reveal(0)}
          type="button"
          onClick={() => setCurrentTab('DOCS')}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-zinc-100 dark:bg-[#0E0E14] text-zinc-600 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04] hover:border-emerald-500/40 transition-colors cursor-pointer"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          v1.0 — 63 components, MIT
        </motion.button>

        <motion.h1
          {...reveal(1)}
          className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05] text-balance"
        >
          Build your component library.
        </motion.h1>

        <motion.p
          {...reveal(2)}
          className="mt-5 max-w-xl text-base sm:text-lg text-zinc-500 dark:text-[#92929B] leading-relaxed text-balance"
        >
          Accessible, copy-and-paste React primitives with velvet obsidian depth — for teams who sweat the last pixel.
        </motion.p>

        <motion.div {...reveal(3)} className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="primary"
            onClick={() => setCurrentTab('UIKIT')}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Get Started
          </Button>

          <div className="inline-flex items-center justify-between gap-2 pl-3.5 pr-2 py-2 rounded-full bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] text-xs font-mono text-zinc-700 dark:text-zinc-300 min-h-[44px]">
            <span className="truncate">
              <span className="text-zinc-400 select-none">$ </span>
              npx @99/ui init
            </span>
            <button
              type="button"
              onClick={() => copy('npx @99/ui init', 'hero-cli')}
              aria-label="Copy install command"
              className="p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.07] transition-colors cursor-pointer focus-visible:outline-none focus-safa"
            >
              {copiedKey === 'hero-cli' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
          </div>

          <Button
            size="md"
            variant="ghost"
            icon={<Github className="w-4 h-4" />}
            onClick={() => window.open('https://github.com/starliTrade/UI99', '_blank', 'noopener')}
            className="w-full sm:w-auto min-h-[44px]"
          >
            GitHub
          </Button>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2 · LIVE WINDOW — one app frame, three real surfaces
         ══════════════════════════════════════════════════════════════ */}
      <Reveal>
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SegmentedControl
              size="sm"
              value={demoTab}
              onChange={setDemoTab}
              options={[
                { value: 'app', label: 'Tasks' },
                { value: 'forms', label: 'Forms' },
                { value: 'data', label: 'Data' },
              ]}
            />
            <span className="hidden sm:block text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
              live — every pixel is the kit
            </span>
          </div>

          {/* App frame */}
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.035] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)]">
            {/* chrome */}
            <div className="flex items-center gap-2 px-4 h-11 border-b border-black/[0.04] dark:border-white/[0.04] bg-zinc-50/60 dark:bg-[#0A0B0F]">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/[0.12]" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/[0.12]" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/[0.12]" />
              </span>
              <span className="ml-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-600">safa — workspace</span>
              <span className="ml-auto flex items-center gap-1.5">
                <Kbd size="xs">⌘K</Kbd>
              </span>
            </div>

            {/* content */}
            <div className="p-5 sm:p-6">
              {demoTab === 'app' && (
                <div className="space-y-2">
                  {[
                    { id: 'UI-214', title: 'Ship specular rim tokens to registry', status: 'in_progress' as const, priority: 'urgent' as const, people: ['Sara', 'Ali', 'Nima'], done: 64 },
                    { id: 'UI-198', title: 'Audit Combobox against WCAG 2.4.11', status: 'review' as const, priority: 'high' as const, people: ['Raha', 'Omid'], done: 90 },
                    { id: 'UI-187', title: 'Porcelain preset — copper focus ring', status: 'done' as const, priority: 'medium' as const, people: ['Sara', 'Bahar', 'Ali', 'Nima'], done: 100 },
                  ].map((row) => (
                    <div
                      key={row.id}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-black/[0.05] dark:hover:border-white/[0.05] hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600 w-14 shrink-0">{row.id}</span>
                      <StatusBadge status={row.status} showLabel={false} />
                      <span className="text-[13px] font-medium text-zinc-800 dark:text-[#D4D4D8] truncate flex-1 min-w-0">{row.title}</span>
                      <span className="hidden md:flex w-24 shrink-0"><Progress value={row.done} /></span>
                      <PriorityBadge priority={row.priority} showLabel={false} size="sm" />
                      <span className="hidden sm:block shrink-0"><AvatarStack names={row.people} max={3} size="xs" /></span>
                    </div>
                  ))}
                </div>
              )}

              {demoTab === 'forms' && (
                <div className="max-w-md space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-500 dark:text-[#8E8E98]">Email</label>
                    <Input value="ada@atelier99.design" onChange={() => {}} placeholder="you@studio.com" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#0E0E13] border border-black/[0.04] dark:border-white/[0.03]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-medium text-zinc-800 dark:text-[#D4D4D8]">Velvet mode</span>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Specular rims on surfaces</p>
                    </div>
                    <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" variant="primary">Save preferences</Button>
                    <Button size="sm" variant="ghost">Cancel</Button>
                    <span className="ml-auto hidden sm:flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600">
                      press <Kbd size="xs">⏎</Kbd>
                    </span>
                  </div>
                </div>
              )}

              {demoTab === 'data' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatTile label="Focus streak" value={21} delta={12.4} size="sm" />
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#0E0E13] border border-black/[0.04] dark:border-white/[0.03] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-600 dark:text-[#92929B]">Deep work</span>
                      <TrendDelta delta={-3.2} />
                    </div>
                    <MeterBar value={72} label="Deep work load" showValue={false} size="sm" />
                    <Sparkline data={[3, 5, 4, 8, 6, 9, 7, 11]} color="emerald" fill width={220} height={36} />
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#0E0E13] border border-black/[0.04] dark:border-white/[0.03] space-y-2">
                    <span className="text-xs font-medium text-zinc-600 dark:text-[#92929B]">Review queue</span>
                    <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">14</div>
                    <Progress value={58} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          3 · EXPLORER — the registry, searchable
         ══════════════════════════════════════════════════════════════ */}
      <Reveal index={1}>
        <section className="pt-20 sm:pt-24 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                63 components. Zero lock-in.
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-[#8E8E98]">
                Click any component to open its live preview, variants and code.
              </p>
            </div>
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={explorerQuery}
                onChange={(e) => setExplorerQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search components"
                className="w-full h-10 pl-9 pr-3 rounded-full bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.04] text-xs text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-safa-inset"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-2 px-2">
            {CATS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setExplorerCat(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono whitespace-nowrap cursor-pointer transition-colors min-h-[32px] border ${
                  explorerCat === cat
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent font-semibold'
                    : 'text-zinc-500 border-black/[0.06] dark:text-zinc-400 dark:border-white/[0.06] hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filtered.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setFocusComponent(c.slug);
                  setCurrentTab('UIKIT');
                }}
                title={`View ${c.name} — variants, sizes & code`}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] text-left cursor-pointer transition-all duration-150 hover:border-emerald-500/35 hover:bg-black/[0.01] dark:hover:bg-white/[0.02] focus-visible:outline-none focus-safa min-h-[44px]"
              >
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{c.name}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 -translate-x-0.5 group-hover:translate-x-0 transition-all rtl:rotate-180" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-8 text-center text-xs text-zinc-400 dark:text-zinc-600">No component matches “{explorerQuery}”.</p>
            )}
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          4 · TOKEN LINE — themes in one breath
         ══════════════════════════════════════════════════════════════ */}
      <Reveal index={1}>
        <section className="pt-20 sm:pt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035]">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-[#EDEDEF]">Two token universes, one audit bar.</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-[#8E8E98]">
                Obsidian Dark & Porcelain Light — both WCAG-computed, installable as registry themes.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {['#06070A', '#0B0C11', '#131318', '#10B981'].map((h) => (
                  <span key={h} className="h-6 w-6 rounded-lg border border-white/[0.08]" style={{ background: h }} />
                ))}
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {['#FAF9F6', '#FFFFFF', '#F6F5F1', '#B45309'].map((h) => (
                  <span key={h} className="h-6 w-6 rounded-lg border border-black/[0.08]" style={{ background: h }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          5 · FOOTER
         ══════════════════════════════════════════════════════════════ */}
      <footer className="pt-16 mt-20 border-t border-black/[0.05] dark:border-white/[0.04]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <UI99Wordmark size="md" withSubtitle />
          <nav className="flex items-center gap-4 text-xs font-mono text-zinc-500" aria-label="Footer">
            {(['UIKIT', 'DOCS', 'FOUNDATIONS', 'BLOCKS'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCurrentTab(tab)}
                className="min-h-[44px] flex items-center hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-safa"
              >
                {tab === 'UIKIT' ? 'Components' : tab === 'DOCS' ? 'Docs' : tab === 'FOUNDATIONS' ? 'Foundations' : 'Blocks'}
              </button>
            ))}
            <button
              type="button"
              onClick={() => window.open('https://github.com/starliTrade/UI99', '_blank', 'noopener')}
              aria-label="GitHub repository"
              className="min-h-[44px] flex items-center hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-safa"
            >
              <Github className="w-4 h-4" />
            </button>
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.03] flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
          <span>© 2026 UI \ [99] · MIT</span>
          <span>Obsidian Velvet · Linear Velocity</span>
        </div>
      </footer>
    </div>
  );
}
