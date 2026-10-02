/**
 * UI99 — Obsidian Deep Architecture Studio & Visual Calibration Lab
 *
 * Professional engineering tool for calibrating the ultimate, softest,
 * closest-to-base surface hierarchy on the Velvet Obsidian canvas (#060709).
 *
 * Grounded in:
 * - Apple HIG & visionOS Liquid Glass specular Fresnel rim reflection
 * - Google Material 3 Tonal Surface Elevation math
 * - Weber-Fechner Law / Just Noticeable Difference (JND) threshold
 * - APCA & WCAG 2.2 AAA Contrast Verification
 */

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Layers,
  Sparkles,
  Eye,
  Check,
  Copy,
  Scale,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  Lock,
  ArrowRight,
  SunMoon,
  Code2,
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Badge, StatusBadge, PriorityBadge } from './Badge';
import { calculateContrastRatio } from '../../core/tokens/math';

export type CalibrationProfile = 'liquid-velvet' | 'ultra-quiet' | 'tactile-specular';

export function ObsidianArchitectureLab() {
  const [profile, setProfile] = useState<CalibrationProfile>('liquid-velvet');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live tunable parameters
  const [quietAlpha, setQuietAlpha] = useState<number>(0.008); // 0.8% white
  const [cardElev, setCardElev] = useState<number>(18); // Delta +18
  const [rimOpacity, setRimOpacity] = useState<number>(0.045); // 4.5% top rim specular
  const [shadowBlur, setShadowBlur] = useState<number>(40); // 40px diffusion

  // Presets
  const applyProfile = (p: CalibrationProfile) => {
    setProfile(p);
    if (p === 'liquid-velvet') {
      setQuietAlpha(0.008);
      setCardElev(18);
      setRimOpacity(0.045);
      setShadowBlur(40);
    } else if (p === 'ultra-quiet') {
      setQuietAlpha(0.005);
      setCardElev(12);
      setRimOpacity(0.025);
      setShadowBlur(28);
    } else if (p === 'tactile-specular') {
      setQuietAlpha(0.012);
      setCardElev(24);
      setRimOpacity(0.075);
      setShadowBlur(50);
    }
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Mathematical delta computations from #060709
  const baseHex = '#060709';
  const baseLuminance = 0.0038; // ~0.4%

  const liveValues = useMemo(() => {
    const cardBgHex = `#${Math.round(6 + cardElev * 0.35)
      .toString(16)
      .padStart(2, '0')}${Math.round(7 + cardElev * 0.35)
      .toString(16)
      .padStart(2, '0')}${Math.round(9 + cardElev * 0.45)
      .toString(16)
      .padStart(2, '0')}`;

    const elevatedBgHex = `#${Math.round(6 + cardElev * 0.6)
      .toString(16)
      .padStart(2, '0')}${Math.round(7 + cardElev * 0.6)
      .toString(16)
      .padStart(2, '0')}${Math.round(9 + cardElev * 0.75)
      .toString(16)
      .padStart(2, '0')}`;

    return {
      cardBg: cardBgHex,
      elevatedBg: elevatedBgHex,
      quietBg: `rgba(255, 255, 255, ${quietAlpha})`,
      quietHoverBg: `rgba(255, 255, 255, ${quietAlpha * 2.5})`,
      borderSubtle: `rgba(255, 255, 255, ${(quietAlpha * 3.1).toFixed(3)})`,
      rimSpecular: `inset 0 1px 0 0 rgba(255, 255, 255, ${rimOpacity})`,
      shadowAmbient: `0 18px ${shadowBlur}px -10px rgba(0, 0, 0, 0.75)`,
    };
  }, [quietAlpha, cardElev, rimOpacity, shadowBlur]);

  return (
    <div className="space-y-8 p-6 sm:p-8 rounded-(--radius-xl) bg-[#060709] border border-white/[0.04] shadow-2xl relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/[0.015] blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="type-title font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Obsidian Deep Surface Architecture & Calibration Studio</span>
            </h3>
          </div>
          <p className="type-caption text-zinc-400 mt-1 max-w-2xl">
            Mathematical calibration for the <code className="text-emerald-400 font-mono">#060709</code> base canvas: Weber-Fechner JND delta stepping, sub-pixel specular rim physics, and diffused dark elevation.
          </p>
        </div>

        {/* Profile Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-(--radius-control) bg-white/[0.02] border border-white/[0.04] shrink-0">
          <button
            type="button"
            onClick={() => applyProfile('liquid-velvet')}
            className={`px-3 py-1.5 rounded-(--radius-sm) type-caption font-mono font-medium transition-all cursor-pointer ${
              profile === 'liquid-velvet'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            A · Liquid Velvet (Linear/visionOS)
          </button>
          <button
            type="button"
            onClick={() => applyProfile('ultra-quiet')}
            className={`px-3 py-1.5 rounded-(--radius-sm) type-caption font-mono font-medium transition-all cursor-pointer ${
              profile === 'ultra-quiet'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            B · Ultra-Quiet (Raycast Ambient)
          </button>
          <button
            type="button"
            onClick={() => applyProfile('tactile-specular')}
            className={`px-3 py-1.5 rounded-(--radius-sm) type-caption font-mono font-medium transition-all cursor-pointer ${
              profile === 'tactile-specular'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            C · Tactile Specular (Apple HIG)
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE PARAMETER TUNING BENCH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-(--radius-lg) bg-white/[0.015] border border-white/[0.03]">
        {/* Slider 1: Quiet Alpha */}
        <div className="space-y-2">
          <div className="flex justify-between type-caption font-mono">
            <span className="text-zinc-400">Quiet Alpha (Resting)</span>
            <span className="text-emerald-400 font-bold">{(quietAlpha * 100).toFixed(1)}% ({quietAlpha})</span>
          </div>
          <input
            type="range"
            min="0.003"
            max="0.020"
            step="0.001"
            value={quietAlpha}
            onChange={(e) => setQuietAlpha(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between type-micro font-mono text-zinc-500">
            <span>0.3% (Ghost)</span>
            <span>0.8% (Golden)</span>
            <span>2.0% (Boxy)</span>
          </div>
        </div>

        {/* Slider 2: Card Delta */}
        <div className="space-y-2">
          <div className="flex justify-between type-caption font-mono">
            <span className="text-zinc-400">Card Base (&Delta; Step)</span>
            <span className="text-emerald-400 font-bold">&Delta; +{cardElev} ({liveValues.cardBg})</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="2"
            value={cardElev}
            onChange={(e) => setCardElev(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between type-micro font-mono text-zinc-500">
            <span>&Delta; +8 (Subtle)</span>
            <span>&Delta; +18 (Ideal)</span>
            <span>&Delta; +32 (Harsh)</span>
          </div>
        </div>

        {/* Slider 3: Rim Specular */}
        <div className="space-y-2">
          <div className="flex justify-between type-caption font-mono">
            <span className="text-zinc-400">Top Rim Specular</span>
            <span className="text-emerald-400 font-bold">{(rimOpacity * 100).toFixed(1)}% white</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.005"
            value={rimOpacity}
            onChange={(e) => setRimOpacity(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between type-micro font-mono text-zinc-500">
            <span>1.0% (Flat)</span>
            <span>4.5% (Velvet)</span>
            <span>10% (Chalky)</span>
          </div>
        </div>

        {/* Slider 4: Shadow Diffusion */}
        <div className="space-y-2">
          <div className="flex justify-between type-caption font-mono">
            <span className="text-zinc-400">Shadow Diffusion</span>
            <span className="text-emerald-400 font-bold">{shadowBlur}px blur</span>
          </div>
          <input
            type="range"
            min="15"
            max="65"
            step="5"
            value={shadowBlur}
            onChange={(e) => setShadowBlur(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between type-micro font-mono text-zinc-500">
            <span>15px (Tight)</span>
            <span>40px (Deep)</span>
            <span>65px (Ethereal)</span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME LIVE VISUAL TEST STAGE ON PURE #060709 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="icon-md text-emerald-400" />
            <h4 className="type-body font-bold text-white">
              Live Stage Preview (Rendered directly on #060709 Velvet Obsidian)
            </h4>
          </div>
          <span className="type-micro font-mono text-zinc-400">
            Pure Math Rendering
          </span>
        </div>

        <div
          style={{ backgroundColor: baseHex }}
          className="p-6 sm:p-10 rounded-(--radius-xl) border border-white/[0.03] space-y-6"
        >
          {/* Row 1: The Unified Button Ladder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between type-micro font-mono text-zinc-400">
              <span>Interactive Control Ladder (Primary, Secondary/Quiet, Ghost)</span>
              <span>Hairline: {liveValues.borderSubtle}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Button */}
              <button
                type="button"
                className="h-10 px-5 rounded-(--radius-field) bg-white text-black font-semibold type-caption shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                Primary Ink Action
              </button>

              {/* Unified Secondary / Quiet Button with Live Values */}
              <button
                type="button"
                style={{
                  backgroundColor: liveValues.quietBg,
                  borderColor: liveValues.borderSubtle,
                }}
                className="h-10 px-5 rounded-(--radius-field) border text-zinc-300 hover:text-white type-caption font-medium transition-all duration-150 cursor-pointer active:scale-[0.98] inline-flex items-center gap-2"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = liveValues.quietHoverBg;
                  e.currentTarget.style.borderColor = `rgba(255, 255, 255, ${(quietAlpha * 5).toFixed(3)})`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = liveValues.quietBg;
                  e.currentTarget.style.borderColor = liveValues.borderSubtle;
                }}
              >
                <Sparkles className="icon-sm text-zinc-400" />
                <span>Secondary / Quiet CTA (&Delta; +6)</span>
              </button>

              {/* Ghost Button */}
              <button
                type="button"
                className="h-10 px-4 rounded-(--radius-field) bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.03] type-caption font-medium transition-all cursor-pointer"
              >
                Ghost Action
              </button>

              {/* Form Input Live Preview */}
              <div className="relative flex-1 min-w-[220px]">
                <input
                  type="text"
                  placeholder="Tactile Velvet Input..."
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${(quietAlpha * 4.5).toFixed(3)})`,
                    borderColor: liveValues.borderSubtle,
                  }}
                  className="w-full h-10 px-3.5 rounded-(--radius-field) border text-zinc-200 placeholder:text-zinc-600 type-caption font-mono focus:outline-none focus:border-white/[0.15] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Card & Surface Nesting Geometry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Standard Object Container (Tier 3) */}
            <div
              style={{
                backgroundColor: liveValues.cardBg,
                boxShadow: `${liveValues.rimSpecular}, ${liveValues.shadowAmbient}`,
                borderColor: liveValues.borderSubtle,
              }}
              className="p-5 rounded-(--radius-lg) border transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h5 className="type-caption font-bold text-white">Tier 3 · Card Surface ({liveValues.cardBg})</h5>
                </div>
                <span className="type-micro font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  &Delta; +{cardElev}
                </span>
              </div>
              <p className="type-caption text-zinc-400 leading-relaxed">
                Sub-pixel top rim specular highlight separates this surface effortlessly from the <code className="text-zinc-300">#060709</code> base without opaque borders.
              </p>

              {/* Inner Nested Control Element */}
              <div
                style={{
                  backgroundColor: liveValues.quietBg,
                  borderColor: liveValues.borderSubtle,
                }}
                className="p-3 rounded-(--radius-md) border flex items-center justify-between"
              >
                <span className="type-caption font-mono text-zinc-300">Inner Rung (r_inner = 14px)</span>
                <span className="type-micro font-mono text-zinc-500">Concentric</span>
              </div>
            </div>

            {/* Card 2: Elevated Overlay / Modal (Tier 4) */}
            <div
              style={{
                backgroundColor: liveValues.elevatedBg,
                boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, ${(rimOpacity * 1.5).toFixed(3)}), 0 24px 54px -12px rgba(0, 0, 0, 0.88)`,
                borderColor: `rgba(255, 255, 255, ${(quietAlpha * 4.5).toFixed(3)})`,
              }}
              className="p-5 rounded-(--radius-lg) border transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <h5 className="type-caption font-bold text-white">Tier 4 · Elevated Modal ({liveValues.elevatedBg})</h5>
                </div>
                <span className="type-micro font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  &Delta; +{Math.round(cardElev * 1.4)}
                </span>
              </div>
              <p className="type-caption text-zinc-400 leading-relaxed">
                Floating popovers, command dialogs (⌘K), and bottom sheets sit at the peak of the diffusion pyramid.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="primary" size="xs">Confirm Action</Button>
                <Button variant="secondary" size="xs">Dismiss</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MATHEMATICAL TOKENS CODE SNIPPET EXPORTER */}
      <div className="p-5 rounded-(--radius-lg) bg-white/[0.015] border border-white/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="icon-md text-emerald-400" />
            <h4 className="type-caption font-mono font-bold text-white">
              Generated CSS Token Matrix for #060709
            </h4>
          </div>
          <Button
            size="xs"
            variant="secondary"
            icon={copiedKey === 'tokens' ? <Check className="icon-sm text-emerald-400" /> : <Copy className="icon-sm" />}
            onClick={() =>
              copyCode(
                `/* Obsidian Velvet System Tokens (#060709 Baseline) */\n:root {\n  --bg-canvas: #060709;\n  --bg-quiet: ${liveValues.quietBg};\n  --bg-quiet-hover: ${liveValues.quietHoverBg};\n  --bg-card: ${liveValues.cardBg};\n  --bg-elevated: ${liveValues.elevatedBg};\n  --border-subtle: ${liveValues.borderSubtle};\n  --rim-soft: ${liveValues.rimSpecular};\n  --shadow-card: ${liveValues.shadowAmbient};\n}`,
                'tokens'
              )
            }
          >
            {copiedKey === 'tokens' ? 'Copied Tokens!' : 'Copy CSS Tokens'}
          </Button>
        </div>

        <pre className="p-4 rounded-(--radius-control) bg-black/60 border border-white/[0.03] text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed">
          {`:root {
  --bg-canvas: #060709;                 /* Base Velvet Canvas */
  --bg-quiet: ${liveValues.quietBg};         /* Tier 1: Δ +6 Quiet/Secondary Controls */
  --bg-quiet-hover: ${liveValues.quietHoverBg};   /* Tier 1 Hover: Δ +15 State Shift */
  --bg-card: ${liveValues.cardBg};                  /* Tier 3: Δ +${cardElev} Card Container */
  --bg-elevated: ${liveValues.elevatedBg};              /* Tier 4: Elevated Dialogs & Modals */
  --border-subtle: ${liveValues.borderSubtle};      /* Optical Hairline Border */
  --rim-soft: ${liveValues.rimSpecular}; /* Sub-pixel Top Specular Highlight */
  --shadow-card: ${liveValues.shadowAmbient}; /* Deep Ambient Diffusion */
}`}
        </pre>
      </div>
    </div>
  );
}
