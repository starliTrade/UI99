/**
 * UI \ [99] — Foundations & Design Tokens
 * 
 * Exhaustive reference for:
 * - Obsidian Dark & Matte Light Color Matrices
 * - Specular Hairline Highlights & Ambient Shadows
 * - Mathematical Radii Formula & Live Tester
 * - Typographic Scale & Baseline Rhythms
 * - Anti-Slop Engineering Rules
 * - 100% English copy
 */

import React, { useState } from 'react';
import {
  Palette,
  Zap,
  Code2,
  Compass,
  Type,
  SunMoon,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Kbd } from '../ui';
import { Reveal } from '../ui/motion';
import { KIT_COMPONENT_COUNT } from '../../generated/kit-count';

export function FoundationsView() {
  const { themeMode, setThemeMode, addToast } = useApp();
  const isDark = themeMode === 'dark';
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [simOuterRadius, setSimOuterRadius] = useState(24);
  const [simPadding, setSimPadding] = useState(16);
  const simInnerRadius = Math.max(0, simOuterRadius - simPadding);

  const copyValue = (val: string, name: string) => {
    navigator.clipboard.writeText(val);
    setCopiedToken(name);
    addToast(`Copied ${val}`, 'success');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorTokens = [
    { name: 'Canvas Root', dark: '#06070A', light: '#F4F4F6', desc: 'Base velvet obsidian canvas' },
    { name: 'Surface Layer 1', dark: '#0B0C11', light: '#FFFFFF', desc: 'Standard cards & containers' },
    { name: 'Surface Layer 2', dark: '#131318', light: '#F9F9FB', desc: 'Elevated popovers & modals' },
    { name: 'Liquid Glass Dock', dark: 'rgba(14, 14, 19, 0.52)', light: 'rgba(255, 255, 255, 0.82)', desc: 'Capsules with blur(18px)' },
    { name: 'Text Primary', dark: '#EDEDEF', light: '#111113', desc: 'High-contrast typography' },
    { name: 'Text Muted', dark: '#8E8E98', light: '#71717A', desc: 'Secondary metadata & labels' },
    { name: 'Accent Emerald', dark: '#10B981', light: '#059669', desc: 'Success & positive status' },
    { name: 'Accent Rose', dark: '#F43F5E', light: '#E11D48', desc: 'Urgent & destructive priority' },
  ];

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center h-7 px-3 rounded-(var(--radius-pill)) text-[11px] font-mono bg-zinc-100 dark:bg-[#0E0E14] text-zinc-600 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04]">
          {KIT_COMPONENT_COUNT} components · WCAG-verified · MIT
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Foundations.
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The mathematical values, color tokens, optical refraction highlights, typographic scales, and anti-slop rules powering the UI \ [99] design system.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <SunMoon className="w-5 h-5 text-emerald-500" />
              <span>Obsidian Velvet Color Tokens</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Click any token to copy its exact HEX or RGBA variable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {colorTokens.map((t) => (
            <div
              key={t.name}
              onClick={() => copyValue(isDark ? t.dark : t.light, t.name)}
              className="p-4 rounded-(var(--radius-control)) bg-zinc-50 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3 cursor-pointer hover:border-black/20 dark:hover:border-white/10 transition-colors shadow-xs group"
            >
              <div
                style={{ backgroundColor: isDark ? t.dark : t.light }}
                className="w-full h-16 rounded-(var(--radius-field)) border border-black/[0.08] dark:border-white/[0.05] flex items-center justify-center relative overflow-hidden"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-mono gap-1">
                  {copiedToken === t.name ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white">
                  <span>{t.name}</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {isDark ? t.dark : t.light}
                </div>
                <div className="text-[11px] text-zinc-500 line-clamp-1">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Mathematical Radii Rule Simulator */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" />
            <span>Interactive Nested Radii Calculator</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Based on the optical physics rule: Inside Corner Radius = Outside Corner Radius - Padding
          </p>
        </div>

        <div className="p-6 rounded-(var(--radius-lg)) bg-zinc-50 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Outer Radius</span>
                <span className="font-bold text-zinc-900 dark:text-white">{simOuterRadius}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="48"
                value={simOuterRadius}
                onChange={(e) => setSimOuterRadius(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Container Padding</span>
                <span className="font-bold text-zinc-900 dark:text-white">{simPadding}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={simPadding}
                onChange={(e) => setSimPadding(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Visualization Area */}
          <div className="p-8 rounded-(var(--radius-control)) bg-zinc-200/50 dark:bg-[#06070A] flex flex-col items-center justify-center gap-4">
            <div
              style={{
                borderRadius: `${simOuterRadius}px`,
                padding: `${simPadding}px`,
              }}
              className="w-full max-w-md bg-white dark:bg-[#131318] border border-black/[0.08] dark:border-white/[0.04] shadow-md transition-all duration-150"
            >
              <div
                style={{
                  borderRadius: `${simInnerRadius}px`,
                }}
                className="p-6 bg-zinc-100 dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.03] text-center space-y-1 transition-all duration-150"
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  Child Element Container
                </div>
                <div className="text-xs font-mono text-emerald-500">
                  Inner Radius = {simInnerRadius}px
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-500">
              Formula: {simOuterRadius}px - {simPadding}px = {simInnerRadius}px
            </div>
          </div>
        </div>
      </section>

      {/* 3. Anti-Slop Certification Rules */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Anti-Slop Design Certification</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Systematic elimination of low-effort visual clichés in favor of world-class Linear & Apple standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-(var(--radius-control)) bg-rose-500/5 border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
              <ShieldAlert className="w-4 h-4" />
              <span>Banned Anti-Patterns</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• Unjustified nested cards inside cards</li>
              <li>• Generic purple-to-blue marketing gradients</li>
              <li>• Thick colored side-tab borders on container edges</li>
              <li>• Neon glowing drop-shadows with harsh contrast</li>
              <li>• Generic SaaS buzzwords like "Supercharge" or "Empower"</li>
            </ul>
          </div>

          <div className="p-5 rounded-(var(--radius-control)) bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Enforced Standards in UI \ [99]</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• True velvet obsidian black <code className="font-mono text-[11px]">#06070A</code> with 0% unwanted tint</li>
              <li>• Sub-pixel specular top rim highlight: <code className="font-mono text-[11px]">inset 0 1px 0 0 rgba(255,255,255,0.05)</code></li>
              <li>• Mathematical nested corner radius ratio: Inside = Outside - Padding</li>
              <li>• Keyboard-first ergonomics with J/K/C shortcuts</li>
              <li>• Copy-source modularity matching shadcn/ui</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. LIVE THEME LAB — Porcelain ↔ Obsidian (audit P3.11) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-500" />
            <span>Live Theme Lab — Porcelain ↔ Obsidian</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Flip the whole canvas between the two audited themes and watch every token pair react in real time.
          </p>
        </div>

        <div className="p-5 sm:p-7 rounded-(var(--radius-lg)) bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isDark ? 'outline' : 'primary'}
              size="sm"
              icon={<SunMoon className="w-3.5 h-3.5" />}
              onClick={() => setThemeMode('light')}
            >
              Porcelain (Light)
            </Button>
            <Button
              variant={isDark ? 'primary' : 'outline'}
              size="sm"
              icon={<SunMoon className="w-3.5 h-3.5" />}
              onClick={() => setThemeMode('dark')}
            >
              Obsidian (Dark)
            </Button>
            <span className="text-[11px] font-mono text-zinc-400">
              active: {themeMode} · data-theme="{themeMode}"
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Canvas', token: '--bg-canvas', dark: '#06070A', light: '#F5F5F8' },
              { label: 'Surface', token: '--bg-surface', dark: '#0B0C11', light: '#FFFFFF' },
              { label: 'Card', token: '--bg-card', dark: '#0E0E14', light: '#FFFFFF' },
              { label: 'Elevated', token: '--bg-elevated', dark: '#131318', light: '#FFFFFF' },
            ].map((row) => (
              <button
                key={row.token}
                type="button"
                onClick={() => copyValue(`var(${row.token})`, row.token)}
                className="text-left p-3 rounded-(var(--radius-control)) bg-zinc-100/70 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.04] space-y-2 cursor-pointer hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-ui99-inset"
              >
                <div
                  className="w-full h-12 rounded-(var(--radius-field)) border border-black/[0.06] dark:border-white/[0.05]"
                  style={{ background: `var(${row.token})` }}
                />
                <div className="text-[11px] font-semibold text-zinc-900 dark:text-white">{row.label}</div>
                <div className="font-mono text-[10px] text-zinc-400">{isDark ? row.dark : row.light}</div>
                <div className="font-mono text-[10px] text-emerald-500/80">{row.token}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-(var(--radius-control)) bg-(--bg-card) border border-(--border-hairline) space-y-1.5">
              <div className="text-xs font-semibold text-(--text-primary)">ui-card sample</div>
              <div className="text-[11px] text-(--text-secondary)">Tokens resolve live in both themes.</div>
            </div>
            <div className="p-4 rounded-(var(--radius-control)) bg-(--bg-card) border border-(--border-hairline) flex items-center justify-center">
              <Button variant="primary" size="sm">Primary</Button>
            </div>
            <div className="p-4 rounded-(var(--radius-control)) bg-(--bg-card) border border-(--border-hairline) flex items-center justify-center">
              <span className="ui-badge ui-badge-success">contrast-verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Migrated from product home: design pillars */}
      {/* ========================================================================= */}
      {/* 4. DESIGN PILLARS (Anti-Slop, Velvet Base & Linear Speed)                 */}
      {/* ========================================================================= */}
        <Reveal index={1}>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-(var(--radius-lg)) bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-(var(--radius-field)) bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-xs font-bold">
            #06
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Obsidian Velvet Palette
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            True obsidian black base (<code className="text-emerald-400 font-mono">#06070A</code>) with sub-pixel top rim highlights for zero visual fatigue during prolonged engineering workflows.
          </p>
        </div>

        <div className="p-6 rounded-(var(--radius-lg)) bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-(var(--radius-field)) bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono text-xs font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            Linear Velocity Controls
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Keyboard first navigation (<Kbd size="xs">J</Kbd> / <Kbd size="xs">K</Kbd> / <Kbd size="xs">C</Kbd>) paired with instant spring physics and haptic micro-interactions.
          </p>
        </div>

        <div className="p-6 rounded-(var(--radius-lg)) bg-zinc-50/70 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
          <div className="w-8 h-8 rounded-(var(--radius-field)) bg-purple-500/10 text-purple-500 flex items-center justify-center font-mono text-xs font-bold">
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
      </Reveal>

    </div>
  );
}
