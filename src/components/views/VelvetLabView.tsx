/**
 * UI99 — Master Mathematical UI Engine & Visual Audit Laboratory (Build 03.0)
 *
 * Full-scale, live inspection and validation of:
 * 1. OKLab / OKLCH Perceptual Lightness Delta Engine
 * 2. 5-Tier Surface & Layer Spectrum (Canvas, Quiet Well, Control Base, Card 1, Elevated Modal)
 * 3. Continuous Boundary Border Frequency Engine
 * 4. Inverse-Square Diffusion Shadow Physics
 * 5. Concentric Corner Radii & Modular 4px/8px Spatial Grids
 * 6. Critical Damping Spring Dynamics (Stiffness 500, Damping 38, Scale 0.985)
 * 7. Live Interactive Component Specimens (Buttons, Inputs, Sliders, Cards, Badges, Modals)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  Check,
  Copy,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Activity,
  User,
  Clock,
  Search,
  SlidersHorizontal,
  Plus,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Zap,
  Terminal,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Maximize2,
  Box,
  KeyRound,
  Filter,
  Lock,
  Flame,
  Code2,
  HelpCircle,
  Hash,
  Mail,
  RefreshCw,
  Send,
  Trash2,
  Settings,
  Heart,
  Share2,
  Calculator,
  Palette,
  CheckSquare,
  Compass,
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { createMasterEngine, MasterEngineOutput } from '../../core/tokens/masterEngine';
import {
  Button,
  IconButton,
  Card,
  Input,
  Switch,
  Badge,
  StatusBadge,
  PriorityBadge,
  Tag,
  SegmentedControl,
  Sparkline,
  Progress,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Kbd,
} from '../ui';

export function VelvetLabView() {
  const { isRTL } = useAuth();
  const { addToast } = useApp();

  // ── 1. ENGINE CONTROLLER STATES ──
  const [baseBgInput, setBaseBgInput] = useState<string>('#060709');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── 2. COMPONENT PLAYGROUND STATES ──
  const [activeTab, setActiveTab] = useState<'all' | 'buttons' | 'inputs' | 'cards' | 'accents'>('all');
  const [btnSize, setBtnSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');
  const [btnShape, setBtnShape] = useState<'pill' | 'rounded' | 'square'>('pill');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [cardBorderMode, setCardBorderMode] = useState<'zero' | 'hairline'>('zero');

  // Input States
  const [searchVal, setSearchVal] = useState<string>('0x99aF...3e82');
  const [emailVal, setEmailVal] = useState<string>('lead@ui99.dev');
  const [apiSecret, setApiSecret] = useState<string>('sk_live_master_engine_03');
  const [sliderVal, setSliderVal] = useState<number>(80);
  const [switch1, setSwitch1] = useState<boolean>(true);
  const [switch2, setSwitch2] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('row-2');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  // ── 3. DYNAMIC MATHEMATICAL ENGINE EXECUTION ──
  const engine: MasterEngineOutput = useMemo(() => {
    return createMasterEngine(baseBgInput);
  }, [baseBgInput]);

  const { canvas, quiet, control, card, elevated } = engine.surfaces;

  const copyCode = (title: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(title);
    addToast(isRTL ? `${title} کپی شد` : `${title} copied`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div
      style={{ backgroundColor: canvas.hex }}
      className="w-full space-y-10 pb-28 max-w-4xl mx-auto select-none transition-colors duration-500"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ── 1. MASTER ENGINE CONTROL BANNER & PROBE ── */}
      <section
        style={{
          background: card.gradient,
          border: cardBorderMode === 'zero' ? 'none' : `1px solid ${card.borderHex}`,
          boxShadow: card.shadowCss,
          borderRadius: `${card.radiusPx}px`,
        }}
        className="p-6 sm:p-7 space-y-5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-(--radius-pill) bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 type-micro font-mono">
              <Cpu className="icon-xs animate-pulse" />
              <span>{isRTL ? 'موتور توکن‌های مادر و ادراک بصری OKLab' : 'UI99 Master Mathematical Token Engine'}</span>
            </div>
            <h1 className="type-heading font-extrabold text-white tracking-tight">
              {isRTL ? 'آزمایشگاه و ممیزی جامع موتور ریاضیاتی' : 'Master Engine & Visual Audit Lab'}
            </h1>
            <p className="type-caption text-zinc-400 max-w-xl leading-relaxed">
              {isRTL
                ? 'محاسبه دیفرانسیلی و خودتنظیم‌گر تمام سطوح، بردرهای مویرگی، فیزیک سایه و المان‌های تعاملی بر پایه روان‌فیزیک وبر-فخنر.'
                : 'Self-adjusting differential calculation of all surfaces, hairline borders, shadows, and controls in uniform OKLab space.'}
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => copyCode('CSS Tokens', engine.cssTokens)}
            icon={copiedKey === 'CSS Tokens' ? <Check className="icon-xs" /> : <Copy className="icon-xs" />}
            className="shrink-0 font-mono font-bold"
          >
            {copiedKey === 'CSS Tokens' ? (isRTL ? 'کپی شد!' : 'Copied!') : (isRTL ? 'خروجی متغیرهای CSS' : 'Export CSS Variables')}
          </Button>
        </div>

        {/* Live Base Input & Presets Bar */}
        <div
          style={{
            background: quiet.hex,
            border: `1px solid ${quiet.borderHex}`,
            borderRadius: `${quiet.radiusPx}px`,
          }}
          className="p-3.5 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <Palette className="icon-xs text-emerald-400" />
            <span className="type-caption font-mono font-semibold text-zinc-200">
              {isRTL ? 'رنگ پایه ورودی بوم:' : 'Input Canvas Base:'}
            </span>
            <div className="flex items-center gap-1.5">
              {['#060709', '#08090C', '#030406', '#0B0C10'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBaseBgInput(preset)}
                  className={`px-2.5 py-1 rounded-(--radius-pill) type-micro font-mono border transition-all cursor-pointer ${
                    baseBgInput.toLowerCase() === preset.toLowerCase()
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 font-bold'
                      : 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 type-micro font-mono">
              <span className="text-zinc-500">OKLab Lightness:</span>
              <span className="text-emerald-400 font-bold">{(engine.baseOklch.l * 100).toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-1.5 type-micro font-mono">
              <span className="text-zinc-500">APCA Score:</span>
              <span className="text-white font-bold">{engine.audit.apcaScore} (AAA)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. AUDIT VIEW SELECTOR TABS ── */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
        <div className="flex items-center gap-2">
          <Fingerprint className="icon-sm text-emerald-400" />
          <h2 className="type-body font-bold text-white uppercase tracking-wider">
            {isRTL ? 'بخش‌های ممیزی و تست عملیاتی' : 'Operational Audit Specimen Sections'}
          </h2>
        </div>

        <SegmentedControl
          options={[
            { label: 'All Matrix', value: 'all' },
            { label: 'Buttons (01)', value: 'buttons' },
            { label: 'Inputs (02)', value: 'inputs' },
            { label: 'Cards (03)', value: 'cards' },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as any)}
          size="sm"
        />
      </div>

      {/* ── 3. THE 5-TIER MATHEMATICAL SPECTRUM SPECIMEN ── */}
      {(activeTab === 'all' || activeTab === 'cards') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="type-micro font-mono font-bold text-zinc-300 uppercase tracking-wider">
              {isRTL ? '۱. پلکان ۵ لایه روشنایی، بردرها و سایه‌های استخراج‌شده' : '1. Generated 5-Tier Luminance & Shadow Ladder'}
            </span>
            <span className="type-micro font-mono text-zinc-500">Weber-Fechner Law: &gamma; = 0.085</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[canvas, quiet, control, card, elevated].map((tier) => (
              <div
                key={tier.id}
                style={{
                  background: tier.hex,
                  border: tier.borderCss === 'none' ? 'none' : `1px solid ${tier.borderHex}`,
                  boxShadow: tier.shadowCss,
                  borderRadius: `${tier.radiusPx || 10}px`,
                }}
                className="p-3.5 space-y-2 text-center transition-all hover:scale-[1.02]"
              >
                <div className="space-y-0.5">
                  <span className="type-micro font-mono font-bold text-zinc-200 block truncate">
                    {tier.name}
                  </span>
                  <span className="type-micro font-mono text-zinc-400 block">{tier.hex}</span>
                </div>
                <div className="pt-1.5 border-t border-white/[0.04] space-y-0.5">
                  <span className="type-caption font-mono font-bold text-emerald-400 block">
                    &Delta; +{tier.deltaL}%
                  </span>
                  <span className="type-micro font-mono text-zinc-500 block">
                    {tier.borderCss === 'none' ? 'Zero-Border' : `Border ${tier.borderHex}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. COMPONENT 01: BUTTON TESTBENCH ── */}
      {(activeTab === 'all' || activeTab === 'buttons') && (
        <section
          style={{
            background: card.gradient,
            border: cardBorderMode === 'zero' ? 'none' : `1px solid ${card.borderHex}`,
            boxShadow: card.shadowCss,
            borderRadius: `${card.radiusPx}px`,
          }}
          className="p-6 sm:p-7 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="icon-xs text-emerald-400" />
                <h3 className="type-body font-bold text-white">
                  {isRTL ? 'ممیزی کامپوننت ۰۱: دکمه‌ها و فیزیک لمس' : 'Component 01 Audit: Button Matrix & Haptics'}
                </h3>
              </div>
              <p className="type-caption text-zinc-400">
                {isRTL ? '۵ وضعیت، مقیاس فشردن ۰.۹۸۵ و ضریب هاور ۲.۸ برابری' : '5 States, 0.985 Spring Press, 2.8x Hover Multiplier'}
              </p>
            </div>

            {/* Live Controller Settings */}
            <div className="flex flex-wrap items-center gap-2.5">
              <SegmentedControl
                options={[
                  { label: 'XS', value: 'xs' },
                  { label: 'SM', value: 'sm' },
                  { label: 'MD', value: 'md' },
                  { label: 'LG', value: 'lg' },
                ]}
                value={btnSize}
                onChange={(val) => setBtnSize(val as any)}
                size="sm"
              />
              <SegmentedControl
                options={[
                  { label: 'Pill', value: 'pill' },
                  { label: 'Rounded', value: 'rounded' },
                  { label: 'Square', value: 'square' },
                ]}
                value={btnShape}
                onChange={(val) => setBtnShape(val as any)}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <span className="type-micro font-mono text-zinc-400">Loading</span>
                <Switch checked={isLoading} onCheckedChange={setIsLoading} />
              </div>
              <div className="flex items-center gap-2">
                <span className="type-micro font-mono text-zinc-400">Disabled</span>
                <Switch checked={isDisabled} onCheckedChange={setIsDisabled} />
              </div>
            </div>
          </div>

          {/* Button Variants Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-(--radius-md) bg-black/40 border border-white/[0.03] space-y-2 text-center">
              <span className="type-micro font-mono text-zinc-400 block">Primary Ink</span>
              <Button
                variant="primary"
                size={btnSize}
                shape={btnShape}
                loading={isLoading}
                disabled={isDisabled}
                fullWidth
                onClick={() => setClickCount((c) => c + 1)}
                icon={<Zap className="icon-xs" />}
              >
                Primary
              </Button>
            </div>

            <div className="p-3 rounded-(--radius-md) bg-black/40 border border-white/[0.03] space-y-2 text-center">
              <span className="type-micro font-mono text-zinc-400 block">Quiet Action</span>
              <Button
                variant="quiet"
                size={btnSize}
                shape={btnShape}
                loading={isLoading}
                disabled={isDisabled}
                fullWidth
                onClick={() => setClickCount((c) => c + 1)}
                icon={<Sparkles className="icon-xs text-zinc-400" />}
              >
                Quiet
              </Button>
            </div>

            <div className="p-3 rounded-(--radius-md) bg-black/40 border border-white/[0.03] space-y-2 text-center">
              <span className="type-micro font-mono text-zinc-400 block">Control Tier</span>
              <Button
                variant="control"
                size={btnSize}
                shape={btnShape}
                loading={isLoading}
                disabled={isDisabled}
                fullWidth
                onClick={() => setClickCount((c) => c + 1)}
                icon={<Settings className="icon-xs" />}
              >
                Control
              </Button>
            </div>

            <div className="p-3 rounded-(--radius-md) bg-black/40 border border-white/[0.03] space-y-2 text-center">
              <span className="type-micro font-mono text-zinc-400 block">Emerald Verified</span>
              <Button
                variant="emerald"
                size={btnSize}
                shape={btnShape}
                loading={isLoading}
                disabled={isDisabled}
                fullWidth
                onClick={() => setClickCount((c) => c + 1)}
                icon={<ShieldCheck className="icon-xs" />}
              >
                Verified
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. COMPONENT 02: INPUTS & FORM CONTROLS TESTBENCH ── */}
      {(activeTab === 'all' || activeTab === 'inputs') && (
        <section
          style={{
            background: card.gradient,
            border: cardBorderMode === 'zero' ? 'none' : `1px solid ${card.borderHex}`,
            boxShadow: card.shadowCss,
            borderRadius: `${card.radiusPx}px`,
          }}
          className="p-6 sm:p-7 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <KeyRound className="icon-xs text-emerald-400" />
                <h3 className="type-body font-bold text-white">
                  {isRTL ? 'ممیزی کامپوننت ۰۲: فیلدهای ورودی و کنترل‌های فرم' : 'Component 02 Audit: Inputs & Form Matrix'}
                </h3>
              </div>
              <p className="type-caption text-zinc-400">
                {isRTL ? 'بردر مویرگی ۲.۰٪ و رینگ فوکوس نوری ۱۸٪' : 'Hairline 2.0% Border & 18% Optical Focus Ring'}
              </p>
            </div>
            <span className="type-micro font-mono text-emerald-400 font-bold">{control.hex}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Input 1: Search */}
            <div className="space-y-1">
              <span className="type-micro font-mono text-zinc-500">Search with Kbd</span>
              <div className="relative">
                <Search className="icon-xs absolute start-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{
                    background: control.hex,
                    border: `1px solid ${control.borderHex}`,
                    borderRadius: `${control.radiusPx}px`,
                  }}
                  className="w-full h-10 ps-8 pe-12 text-zinc-200 placeholder:text-zinc-500 type-caption font-mono focus:outline-none focus:border-white/[0.22] transition-all"
                />
                <div className="absolute end-2.5 top-1/2 -translate-y-1/2">
                  <Kbd>⌘K</Kbd>
                </div>
              </div>
            </div>

            {/* Input 2: Email */}
            <div className="space-y-1">
              <span className="type-micro font-mono text-zinc-500">Developer Email</span>
              <div className="relative">
                <Mail className="icon-xs absolute start-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  style={{
                    background: control.hex,
                    border: `1px solid ${control.borderHex}`,
                    borderRadius: `${control.radiusPx}px`,
                  }}
                  className="w-full h-10 ps-8 pe-3 text-zinc-200 placeholder:text-zinc-500 type-caption font-mono focus:outline-none focus:border-white/[0.22] transition-all"
                />
              </div>
            </div>

            {/* Input 3: Secret */}
            <div className="space-y-1">
              <span className="type-micro font-mono text-zinc-500">API Secret Key</span>
              <div className="relative">
                <Lock className="icon-xs absolute start-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  style={{
                    background: control.hex,
                    border: `1px solid ${control.borderHex}`,
                    borderRadius: `${control.radiusPx}px`,
                  }}
                  className="w-full h-10 ps-8 pe-3 text-white type-caption font-mono focus:outline-none focus:border-white/[0.25] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Range Slider & Toggles */}
          <div
            style={{
              background: quiet.hex,
              border: `1px solid ${quiet.borderHex}`,
              borderRadius: `${quiet.radiusPx}px`,
            }}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 sm:w-1/2">
              <div className="flex justify-between type-micro font-mono text-zinc-300">
                <span>Luminance Threshold:</span>
                <span className="text-emerald-400 font-bold">{sliderVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
            </div>

            <div className="flex items-center gap-4 sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="type-micro font-mono text-zinc-300">Zero Halation</span>
                <Switch checked={switch1} onCheckedChange={setSwitch1} />
              </div>
              <div className="flex items-center gap-2">
                <span className="type-micro font-mono text-zinc-300">Auto Delta</span>
                <Switch checked={switch2} onCheckedChange={setSwitch2} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. COMPONENT 03: 4-LAYER CONCENTRIC NESTED COMPLEX ── */}
      {(activeTab === 'all' || activeTab === 'cards') && (
        <section
          style={{
            background: card.gradient,
            border: cardBorderMode === 'zero' ? 'none' : `1px solid ${card.borderHex}`,
            boxShadow: card.shadowCss,
            borderRadius: `${card.radiusPx}px`,
          }}
          className="p-6 sm:p-7 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Box className="icon-xs text-emerald-400" />
                <h3 className="type-body font-bold text-white">
                  {isRTL ? 'ممیزی هندسه هم‌مرکز ۴ لایه (Concentric Topology)' : 'Component 03 Audit: 4-Layer Concentric Nesting'}
                </h3>
              </div>
              <p className="type-caption text-zinc-400">
                R_inner = max(0, R_outer - Padding) = 20 - 10 = 10px
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Layers className="icon-xs text-emerald-400" />}
            >
              Launch Tier 4 Modal
            </Button>
          </div>

          <div
            style={{
              background: quiet.hex,
              border: `1px solid ${quiet.borderHex}`,
              borderRadius: `${quiet.radiusPx}px`,
            }}
            className="p-4 space-y-2"
          >
            {[
              { id: 'row-1', title: 'OKLab Spectral Lightness Vector Matrix', tag: 'Colorimetry', prio: 'urgent' as const },
              { id: 'row-2', title: 'Continuous Boundary Border Spatial Frequency', tag: 'Boundary', prio: 'high' as const },
              { id: 'row-3', title: 'Inverse-Square Shadow Atmospheric Penumbra', tag: 'Shadow', prio: 'medium' as const },
            ].map((row) => {
              const isSelected = selectedItem === row.id;
              return (
                <div
                  key={row.id}
                  onClick={() => setSelectedItem(row.id)}
                  style={{
                    background: isSelected ? quiet.hoverHex : 'rgba(255, 255, 255, 0.002)',
                    border: isSelected ? `1px solid ${control.borderHex}` : '1px solid rgba(255, 255, 255, 0.008)',
                    borderRadius: `${control.radiusPx}px`,
                  }}
                  className="p-3 flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-white/[0.03] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                    <span className="type-caption font-semibold text-zinc-200 group-hover:text-white truncate">
                      {row.title}
                    </span>
                    <span className="type-micro font-mono text-zinc-500 hidden sm:inline">[{row.tag}]</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={row.prio} showLabel={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TIER 4 ELEVATED MODAL ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          style={{
            background: elevated.hex,
            border: `1px solid ${elevated.borderHex}`,
            boxShadow: elevated.shadowCss,
            borderRadius: `${elevated.radiusPx}px`,
          }}
          className="max-w-md w-full backdrop-blur-2xl"
        >
          <DialogHeader>
            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-3" />
            <DialogTitle className="type-title font-bold text-white text-center">
              {isRTL ? 'مودال لایه ۴ (Tier 4 Elevated)' : 'Tier 4 Elevated Modal'}
            </DialogTitle>
            <DialogDescription className="type-caption text-zinc-400 text-center">
              {isRTL
                ? `شناور روی بوم ${baseBgInput} با دلتای +${elevated.deltaL}% و سایه ۵۴px.`
                : `Floating above ${baseBgInput} with Delta +${elevated.deltaL}% and 54px shadow.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3">
            <div
              style={{
                background: quiet.hex,
                border: `1px solid ${quiet.borderHex}`,
                borderRadius: `${control.radiusPx}px`,
              }}
              className="p-3.5 space-y-1.5 type-micro font-mono"
            >
              <div className="flex justify-between">
                <span className="text-zinc-400">Modal Fill:</span>
                <span className="text-emerald-400 font-bold">{elevated.hex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Border Hairline:</span>
                <span className="text-zinc-300">{elevated.borderHex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Inverse Shadow:</span>
                <span className="text-zinc-300 truncate max-w-[200px]">{elevated.shadowCss}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              {isRTL ? 'بستن' : 'Close'}
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsModalOpen(false);
                addToast(isRTL ? 'موتور تایید شد' : 'Engine validated', 'success');
              }}
            >
              {isRTL ? 'تایید نهایی' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
