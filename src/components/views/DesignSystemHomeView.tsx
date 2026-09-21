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
import { motion } from 'motion/react';
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
  Compass,
  Sliders,
  CheckCircle2,
  Calendar,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Zap,
  Code2,
  Shield,
  Command,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
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

export function DesignSystemHomeView() {
  const { themeMode, addToast, setCurrentTab } = useApp();
  const isDark = themeMode === 'dark';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Showcase interactive state
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'cards' | 'forms' | 'badges' | 'cli'>('cards');
  const [sliderVal, setSliderVal] = useState(72);
  const [switchVal, setSwitchVal] = useState(true);
  const [inputVal, setInputVal] = useState('contact@atelier99.design');
  const [selectedPriority, setSelectedPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('urgent');

  // Mathematical Radii interactive state
  const [outerRadius, setOuterRadius] = useState(24);
  const [paddingVal, setPaddingVal] = useState(16);
  const innerRadius = Math.max(0, outerRadius - paddingVal);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-20 sm:space-y-28 pb-20 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Pure shadcn/ui Minimalist & High-Impact Typography       */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-emerald-500/[0.035] dark:bg-emerald-400/[0.025] blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Announcement Pill (shadcn-style) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
            Build your component library.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
            Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source. Engineered with true velvet obsidian depth and Linear speed.
          </p>
        </motion.div>

        {/* CTA Button Group (shadcn-style) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <Button
            size="md"
            variant="primary"
            onClick={() => setCurrentTab('DOCS')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started
          </Button>

          <Button
            size="md"
            variant="secondary"
            onClick={() => setCurrentTab('UIKIT')}
            icon={<Layers className="w-4 h-4" />}
          >
            Browse Components
          </Button>

          {/* Quick CLI Copy Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-[#0E0E14] border border-black/[0.06] dark:border-white/[0.04] text-xs font-mono text-zinc-800 dark:text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <span className="text-zinc-500 select-none">$</span>
            <span className="font-semibold">npx @99/ui init</span>
            <button
              type="button"
              onClick={() => copyToClipboard('npx @99/ui init', 'hero-cli')}
              className="ml-1 p-1 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              {copiedKey === 'hero-cli' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SHADCN-STYLE INTERACTIVE SHOWCASE STAGE                                */}
      {/* ========================================================================= */}
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

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.03] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.03] self-start sm:self-auto">
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
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 ${
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

              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/[0.06] font-mono text-xs text-zinc-200 space-y-2">
                <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2">
                  <span>Terminal</span>
                  <span className="text-[10px] text-emerald-400">bash</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-400">
                    npx @99/ui add button card status-badge
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        'npx @99/ui add button card status-badge',
                        'cli-box'
                      )
                    }
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

      {/* ========================================================================= */}
      {/* 3. MATHEMATICAL RADII & ANTI-SLOP SYSTEM                                   */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Mathematical Foundations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Zero-Slop Mathematical Radii
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Clean nested containers require optical calculation. The inner corner radius must equal the outer corner radius minus container padding: <code className="text-emerald-400 font-mono">r_in = r_out - p</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.035] shadow-xs">
          {/* Left Controls */}
          <div className="md:col-span-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-500">
                <span>Outer Radius (r_out)</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{outerRadius}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="40"
                value={outerRadius}
                onChange={(e) => setOuterRadius(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-500">
                <span>Container Padding (p)</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{paddingVal}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                value={paddingVal}
                onChange={(e) => setPaddingVal(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#131318] border border-black/[0.04] dark:border-white/[0.03] space-y-1 text-xs font-mono">
              <div className="text-zinc-400">Calculated Inner Radius:</div>
              <div className="text-emerald-500 font-bold text-base">
                {outerRadius}px - {paddingVal}px = {innerRadius}px
              </div>
            </div>
          </div>

          {/* Right Live Visual Simulation */}
          <div className="md:col-span-6 flex items-center justify-center">
            <div
              style={{
                borderRadius: `${outerRadius}px`,
                padding: `${paddingVal}px`,
              }}
              className="w-full max-w-xs bg-zinc-200 dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.04] transition-all duration-150 shadow-xs"
            >
              <div
                style={{
                  borderRadius: `${innerRadius}px`,
                }}
                className="p-5 bg-white dark:bg-[#131318] border border-black/[0.06] dark:border-white/[0.04] text-center text-xs font-mono text-zinc-800 dark:text-zinc-200 shadow-sm transition-all duration-150"
              >
                Nested Element ({innerRadius}px)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DESIGN PILLARS (Anti-Slop, Velvet Base & Linear Speed)                 */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-xs font-bold">
            #06
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Obsidian Velvet Palette
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            True obsidian black base (<code className="text-emerald-400 font-mono">#06070A</code>) with sub-pixel top rim highlights for zero visual fatigue during prolonged engineering workflows.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono text-xs font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Linear Velocity Controls
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Keyboard first navigation (<Kbd size="xs">J</Kbd> / <Kbd size="xs">K</Kbd> / <Kbd size="xs">C</Kbd>) paired with instant spring physics and haptic micro-interactions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-mono text-xs font-bold">
            <Code2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Copy-Paste Architecture
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            100% code ownership. Copy source code directly into your components folder with Tailwind v4 classes and zero external wrapper dependencies.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="pt-12 border-t border-black/[0.06] dark:border-white/[0.04] space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <UI99BrandLogo size="md" withSubtitle={true} />

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <button
              type="button"
              onClick={() => setCurrentTab('UIKIT')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Components
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentTab('DOCS')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Documentation
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentTab('BLOCKS')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Blocks
            </button>
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
