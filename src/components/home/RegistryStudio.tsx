/**
 * UI99 — Registry Studio
 *
 * The first live contact a visitor has with the engine. It has to answer four
 * questions without ever making the visitor think about the chrome:
 *
 *   1. What does this component actually look like, doing its job?
 *   2. Where am I in a hundred and three components?
 *   3. How do I get it into my project?
 *   4. How is it built — props, tokens, source?
 *
 * LAYOUT CONTRACT — every value is a token, paired the way ui99-elevation.css
 * documents for itself:
 *
 *   surface   card    radius-lg     bg-card      1px border-subtle
 *   inset     canvas  radius-md     bg-sunken    1px border-subtle
 *   zone      —       no radius     bg-surface   1px border-subtle
 *   control   32px    radius-sm     bg-wash      the group owns the border
 *   micro     28px    radius-xs     fill only    no border
 *   field     32px    radius-field  —            inputs and search
 *
 * Padding is one scale: 12 horizontal / 8 vertical on a phone, 16 / 12 from
 * sm up, 16 around the canvas and 24 from md. No half-steps, no raw alpha
 * borders, no raw hexes.
 *
 * Below lg the inspector sits under the canvas as a disclosure. From lg it
 * becomes a right rail — the canvas keeps the room it needs and the props
 * stop costing the visitor a scroll.
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, BarChart3, Bell, BookOpen, Check, CheckCircle2, CheckSquare,
  ChevronDown, ChevronLeft, ChevronRight, Code2, Copy, Eye, Github, Layers,
  Layout, MousePointerClick, Palette, Plus, Search, Sparkles, Terminal, Zap,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { REGISTRY_COMPONENTS } from '../../registry/registryData';
import type { ComponentRegistryItem } from '../../registry/registryData';
import { STUDIO_SPECIMENS, HAND_BUILT_STAGE_IDS as HAND_BUILT_STAGES } from './studioSpecimens';
import {
  Button, IconButton, Tag, Badge, StatusBadge, PriorityBadge, Switch, Input, Kbd, AvatarStack, Sparkline, StatTile, Progress, SegmentedControl, Slider, Checkbox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, Tabs, TabsList, TabsTrigger, TabsContent, CodeBlock, Toggle, ToggleGroup, ToggleGroupItem, Alert, Rating, OTPInput, CopyButton, NumberField, ColorPicker, PasswordInput, TagInput, Banner, DiffViewer, TerminalEmulator,
} from '../ui';

/** Read a live token value out of the applied theme. */
function liveTokenValue(token: string): string {
  if (typeof window === 'undefined') return token;
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v || token;
}

type StudioView = 'stage' | 'code' | 'cli' | 'tokens';

const VIEWS: ReadonlyArray<{ id: StudioView; label: string; icon: typeof Eye }> = [
  { id: 'stage', label: 'Preview', icon: Eye },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'cli', label: 'CLI', icon: Terminal },
  { id: 'tokens', label: 'Tokens', icon: Palette },
];

/**
 * The view switcher. It sits on the workbench surface, directly above the
 * canvas it controls — not in the browser zone with the filters. Mixing the
 * two meant the browser needed three stacked rows on a phone: tabs, then
 * search, then categories, before a single component was visible.
 */
function ViewTabs({
  view, onChange, isRTL,
}: {
  view: StudioView;
  onChange: (v: StudioView) => void;
  isRTL: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label={isRTL ? 'نمای استودیو' : 'Studio view'}
      className="flex items-center gap-0.5 p-0.5 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft)"
    >
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={view === v.id}
          onClick={() => onChange(v.id)}
          className={`relative flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-1.5 h-8 px-2 rounded-(--radius-xs) type-caption font-mono transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1 after:content-[''] ${
            view === v.id
              ? 'bg-white dark:bg-white text-zinc-950 font-bold'
              : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <v.icon className="w-3 h-3 shrink-0" />
          <span className="type-micro sm:type-caption">{v.label}</span>
        </button>
      ))}

    </div>
  );
}

export function RegistryStudio() {
  const { setCurrentTab, addToast, setFocusComponent } = useApp();
  const { isRTL } = useAuth();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<string>('button');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [studioView, setStudioView] = useState<StudioView>('stage');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectorOpen, setInspectorOpen] = useState(false);

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

  const getCliCommand = (compName: string, pm: typeof packageManager = packageManager) => {
    switch (pm) {
      case 'pnpm': return `pnpm dlx @99/ui add ${compName}`;
      case 'yarn': return `yarn dlx @99/ui add ${compName}`;
      case 'bun': return `bunx --bun @99/ui add ${compName}`;
      default: return `npx @99/ui add ${compName}`;
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(isRTL ? 'در کلیپ‌بورد کپی شد' : 'Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 1600);
  };

  /**
   * Category taxonomy is DERIVED from the registry, never hand-listed.
   *
   * The previous hand-written map had drifted into fiction: 15 ids that no
   * longer exist, 19 registry items filed nowhere, and fabricated counts on a
   * "99" the registry had outgrown. A gallery whose own filter miscounts
   * itself cannot be taken seriously.
   */
  const categories = useMemo(() => {
    const meta: Record<string, { label: string; icon: typeof Layers }> = {
      'Actions': { label: 'Actions & Buttons', icon: MousePointerClick },
      'Forms': { label: 'Forms & Inputs', icon: Sparkles },
      'Selection': { label: 'Selection & Toggles', icon: CheckSquare },
      'Data Display': { label: 'Data & Metrics', icon: BarChart3 },
      'Overlays': { label: 'Overlays & Dialogs', icon: Bell },
      'Layout & Navigation': { label: 'Layout & Navigation', icon: Layout },
    };
    const seen = new Map<string, number>();
    for (const c of REGISTRY_COMPONENTS) seen.set(c.category, (seen.get(c.category) ?? 0) + 1);
    const derived = [...seen.entries()].map(([cat, count]) => ({
      id: cat,
      label: meta[cat]?.label ?? cat,
      count,
      icon: meta[cat]?.icon ?? Layers,
    }));
    return [
      { id: 'all', label: isRTL ? 'همه' : 'All', count: REGISTRY_COMPONENTS.length, icon: Layers },
      ...derived,
    ];
  }, [isRTL]);

  const filteredComponents = REGISTRY_COMPONENTS.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.primitive && c.primitive.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q));
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const currentComp: ComponentRegistryItem =
    REGISTRY_COMPONENTS.find((c) => c.id === activeComponentId) || REGISTRY_COMPONENTS[0];

  const registryIndex = Math.max(0, REGISTRY_COMPONENTS.findIndex((c) => c.id === activeComponentId));

  /** Step through the whole registry, not just the current filter. */
  const stepComponent = (delta: number) => {
    const next = REGISTRY_COMPONENTS[registryIndex + delta];
    if (next) setActiveComponentId(next.id);
  };

  /**
   * WAI-ARIA tabs pattern on the ribbon: one tab stop, arrow keys walk it,
   * Home/End jump to the ends. A hundred and three tab stops was both a
   * keyboard trap and a screen-reader wall.
   */
  const onRibbonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const back = isRTL ? 1 : -1;
    let next = registryIndex;
    if (e.key === 'ArrowRight') next = registryIndex + back;
    else if (e.key === 'ArrowLeft') next = registryIndex - back;
    else if (e.key === 'Home') next = 0;
    else next = REGISTRY_COMPONENTS.length - 1;
    const target = REGISTRY_COMPONENTS[Math.min(Math.max(next, 0), REGISTRY_COMPONENTS.length - 1)];
    if (!target) return;
    setActiveComponentId(target.id);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-ribbon-item="${target.id}"]`)?.focus();
    });
  };

  const realDeps = currentComp.dependencies.filter((d) => d !== 'react');
  const specimen = STUDIO_SPECIMENS[activeComponentId];
  const showSpecimen = Boolean(specimen) && !HAND_BUILT_STAGES.has(activeComponentId);

  return (
    <div className="rounded-(--radius-lg) border border-(--border-subtle) bg-white dark:bg-(--bg-card) shadow-(--shadow-card) overflow-hidden">
      {/* 1 · IDENTITY — which component, and where you are in the registry */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-(--border-subtle) bg-(--bg-surface) flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-(--radius-pill) h-2 w-2 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-1.5 type-caption font-mono min-w-0 truncate">
          <span className="font-semibold text-zinc-950 dark:text-white truncate">{currentComp.title}</span>
          <span className="px-1.5 py-0.5 rounded type-micro bg-(--bg-raised) dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 shrink-0">
            {currentComp.primitive || 'Native'}
          </span>
          <span className="hidden lg:inline-block px-1.5 py-0.5 rounded type-micro bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            WCAG 2.2 AA
          </span>
        </div>

        <div className="flex-1" />

        {/* Registry stepper — every component reachable without the ribbon */}
        <div className="flex items-center gap-0.5 p-0.5 w-fit shrink-0 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft)">
          <button
            type="button"
            onClick={() => stepComponent(-1)}
            disabled={registryIndex <= 0}
            aria-label={isRTL ? 'کامپوننت قبلی' : 'Previous component'}
            className="relative flex items-center justify-center h-7 w-7 rounded-(--radius-xs) text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/[0.07] dark:hover:bg-white/[0.07] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
          >
            {isRTL ? <ChevronRight className="icon-xs" /> : <ChevronLeft className="icon-xs" />}
          </button>
          <span className="type-micro font-mono text-zinc-500 dark:text-zinc-400 tabular-nums px-1 select-none">
            {registryIndex + 1}/{REGISTRY_COMPONENTS.length}
          </span>
          <button
            type="button"
            onClick={() => stepComponent(1)}
            disabled={registryIndex >= REGISTRY_COMPONENTS.length - 1}
            aria-label={isRTL ? 'کامپوننت بعدی' : 'Next component'}
            className="relative flex items-center justify-center h-7 w-7 rounded-(--radius-xs) text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/[0.07] dark:hover:bg-white/[0.07] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
          >
            {isRTL ? <ChevronLeft className="icon-xs" /> : <ChevronRight className="icon-xs" />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => { setFocusComponent(currentComp.name); setCurrentTab('DOCS'); }}
          aria-label={isRTL ? 'مستندات کامل' : 'Open full API docs'}
          className="relative flex items-center gap-1.5 h-8 px-2 rounded-(--radius-sm) type-caption font-mono font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-(--bg-raised) dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0 focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
        >
          <BookOpen className="icon-xs shrink-0" />
          <span className="hidden sm:inline">{isRTL ? 'مستندات' : 'Full API'}</span>
          <ArrowRight className="icon-xs rtl:rotate-180 shrink-0" />
        </button>
      </div>

      {/* 2 · BROWSER — search and categories, one scroll strip. */}
      <div className="px-3 sm:px-4 py-2 border-b border-(--border-subtle) bg-(--bg-surface) flex items-center gap-2 min-w-0">
        <div className="relative w-28 sm:w-44 shrink-0">
          <Search className="icon-xs absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'جستجو…' : 'Search…'}
            aria-label={isRTL ? 'جستجوی کامپوننت' : 'Search components'}
            className="w-full h-8 pl-6 pr-2 rounded-(--radius-field) bg-white dark:bg-white/[0.03] border border-(--border-soft) type-caption text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 focus-ui99-inset font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x min-w-0 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`relative inline-flex items-center gap-1.5 h-8 px-2 rounded-(--radius-sm) type-micro font-mono whitespace-nowrap transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-[''] ${
                activeCategory === cat.id
                  ? 'bg-(--ink-fill) dark:bg-white/[0.08] text-white dark:text-(--text-primary) font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-(--bg-raised) dark:hover:bg-white/[0.03]'
              }`}
            >
              <cat.icon className="w-3 h-3 shrink-0" />
              <span>{cat.label}</span>
              <span className="tabular-nums opacity-55">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 · RIBBON — the filtered registry, one tab stop, every screen.
          A category that cannot show its own components is a filter with
          no answer, so this row is not desktop-only. */}
      <div className="flex px-3 sm:px-4 py-2 border-b border-(--border-subtle) bg-(--bg-sunken) items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
        {filteredComponents.length === 0 ? (
          <p className="type-caption font-mono text-zinc-500 dark:text-zinc-400">
            {isRTL ? 'کامپوننتی یافت نشد' : 'No components match this filter'}
          </p>
        ) : (
          <div role="tablist" aria-label={isRTL ? 'کامپوننت‌ها' : 'Registry components'} aria-orientation="horizontal" className="flex items-center gap-1.5 shrink-0" onKeyDown={onRibbonKeyDown}>
            {filteredComponents.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={activeComponentId === c.id}
                tabIndex={activeComponentId === c.id ? 0 : -1}
                data-ribbon-item={c.id}
                onClick={() => setActiveComponentId(c.id)}
                className={`relative px-2 h-8 rounded-(--radius-sm) type-caption font-mono whitespace-nowrap transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-[''] ${
                  activeComponentId === c.id
                    ? 'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-(--bg-raised) dark:hover:bg-white/[0.04] hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4 · WORKBENCH — canvas, and from lg the inspector rail beside it */}
      <div className="flex flex-col lg:flex-row min-w-0">
        <div className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 bg-white dark:bg-(--bg-card)">
          {studioView === 'stage' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <ViewTabs view={studioView} onChange={setStudioView} isRTL={isRTL} />
              </div>
              <div className="relative min-h-[140px] sm:min-h-[290px] rounded-(--radius-md) bg-(--bg-sunken) border border-(--border-subtle) p-4 sm:p-6 flex items-center justify-center overflow-x-auto overflow-y-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative z-content w-full max-w-lg flex items-center justify-center">
                  {showSpecimen && (() => { const S = specimen!; return <S />; })()}
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
                        <IconButton icon={<Sparkles className="icon-md" />} aria-label="Sparkles" variant="primary" />
                        <IconButton icon={<Github className="icon-md" />} aria-label="Github" variant="secondary" />
                        <IconButton icon={<Terminal className="icon-md" />} aria-label="Terminal" variant="outline" />
                        <IconButton icon={<Zap className="icon-md" />} aria-label="Zap" variant="ghost" />
                      </div>
                    )}

                    {activeComponentId === 'copy-button' && (
                      <div className="flex items-center gap-3 p-3 rounded-(--radius-field) bg-(--bg-subtle) dark:bg-(--bg-surface) border border-(--border-soft) dark:border-(--border-soft)">
                        <code className="type-caption font-mono text-emerald-500">npx @99/ui add button</code>
                        <CopyButton text="npx @99/ui add button" />
                      </div>
                    )}

                    {activeComponentId === 'toggle' && (
                      <div className="flex items-center gap-3">
                        <Toggle pressed={toggleState} onPressedChange={setToggleState} aria-label="Toggle pin">
                          <Sparkles className="icon-md mr-2" />
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
                        description="Sub-pixel specular border highlights and WCAG 2.2 AA certified."
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
                        <p className="type-micro font-mono text-zinc-500 text-center">
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
                        <span className="type-caption font-mono text-zinc-500">Value: {otpValue}</span>
                      </div>
                    )}

                    {activeComponentId === 'color-picker' && (
                      <div className="flex flex-col items-center gap-3">
                        <ColorPicker value={colorValue} onChange={setColorValue} />
                        <span className="type-caption font-mono text-zinc-500">Hex: {colorValue}</span>
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
                        <span className="type-caption font-mono text-zinc-500">{ratingValue} / 5.0</span>
                      </div>
                    )}

                    {activeComponentId === 'switch' && (
                      <div className="flex items-center gap-3">
                        <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                        <span className="type-caption font-medium text-zinc-700 dark:text-zinc-300">
                          Specular Rim Highlight ({switchChecked ? 'Active' : 'Muted'})
                        </span>
                      </div>
                    )}

                    {activeComponentId === 'slider' && (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between type-caption font-mono text-zinc-600 dark:text-zinc-400">
                          <span>Level</span>
                          <span className="text-zinc-950 dark:text-white font-bold">{sliderValue}%</span>
                        </div>
                        <Slider value={sliderValue} min={0} max={100} onChange={setSliderValue} />
                      </div>
                    )}

                    {activeComponentId === 'progress' && (
                      <div className="w-full space-y-2">
                        <div className="flex justify-between type-caption font-mono text-zinc-600 dark:text-zinc-400">
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
                          <p className="type-caption text-zinc-600 dark:text-zinc-400">
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
                      <div className="w-full p-4 rounded-(--radius-control) bg-(--bg-subtle) dark:bg-(--bg-surface) border border-(--border-soft) dark:border-(--border-soft) space-y-2">
                        <div className="flex justify-between type-caption font-mono">
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
                        <span className="type-caption text-zinc-600 dark:text-zinc-400 ml-1 font-mono">
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
                        <TabsContent value="overview" className="p-2 type-caption text-zinc-600 dark:text-zinc-400">
                          Overview panel content with velvet spring indicator.
                        </TabsContent>
                        <TabsContent value="activity" className="p-2 type-caption text-zinc-600 dark:text-zinc-400">
                          Real-time user event bus telemetry.
                        </TabsContent>
                        <TabsContent value="settings" className="p-2 type-caption text-zinc-600 dark:text-zinc-400">
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
                </div>
              </div>

              {/* Micro-controls for the stateful demos */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-(--border-subtle)">
                <div className="flex flex-col gap-1.5 min-w-0">
                    {activeComponentId === 'button' && (
                      <>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-500 font-mono type-micro select-none shrink-0 w-14">Variant:</span>
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x py-0.5">
                            {(['primary', 'secondary', 'outline', 'ghost', 'rose'] as const).map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setBtnVariant(v)}
                                aria-pressed={btnVariant === v}
                                className={`relative px-2 h-7 flex items-center rounded-(--radius-xs) capitalize font-mono type-micro whitespace-nowrap cursor-pointer transition-colors shrink-0 focus-ui99 after:absolute after:-inset-1.5 after:content-[''] ${
                                  btnVariant === v
                                    ? 'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-(--bg-raised) dark:bg-white/[0.03]'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-500 font-mono type-micro select-none shrink-0 w-14">Size:</span>
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x py-0.5">
                            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setBtnSize(s)}
                                aria-pressed={btnSize === s}
                                className={`relative px-2 h-7 flex items-center rounded-(--radius-xs) uppercase font-mono type-micro cursor-pointer transition-colors shrink-0 focus-ui99 after:absolute after:-inset-1.5 after:content-[''] ${
                                  btnSize === s
                                    ? 'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-(--bg-raised) dark:bg-white/[0.03]'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 min-w-0 w-full lg:w-auto">
                    {/* Inspector disclosure — an action, not a second bar. It
                        cost a full 40px row on a phone; here it sits with the
                        other actions and the panel opens below the card. */}
                    <button
                      type="button"
                      onClick={() => setInspectorOpen((v) => !v)}
                      aria-expanded={inspectorOpen}
                      className="relative order-last flex items-center gap-1.5 h-8 px-2 rounded-(--radius-sm) type-micro font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-(--bg-raised) dark:hover:bg-white/[0.06] transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
                    >
                      <Zap className="icon-xs text-emerald-500 shrink-0" />
                      {isRTL ? 'مشخصات' : 'Spec'}
                      <span className="opacity-55">{currentComp.props.length}</span>
                      <ChevronDown className={`icon-xs transition-transform shrink-0 ${inspectorOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* PM Quick Pills */}
                    <div className="flex items-center p-0.5 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) shrink-0">
                      {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPackageManager(pm)}
                          aria-pressed={packageManager === pm}
                          className={`relative px-1.5 h-7 flex items-center rounded type-micro font-mono cursor-pointer transition-all focus-ui99 after:absolute after:-inset-1 after:content-[''] ${
                            packageManager === pm
                              ? 'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 font-bold'
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
                      aria-label={isRTL ? 'کپی دستور نصب' : 'Copy CLI command'}
                      className="relative flex-1 basis-[200px] inline-flex items-center justify-between gap-2 px-2 h-8 rounded-(--radius-sm) type-caption font-mono bg-white dark:bg-white/[0.04] hover:bg-(--bg-subtle) dark:hover:bg-white/[0.07] text-zinc-800 dark:text-(--text-primary) border border-(--border-soft) dark:border-(--border-soft) transition-colors cursor-pointer min-w-0 overflow-hidden focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
                    >
                      <span className="flex items-center gap-1.5 truncate min-w-0">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold type-caption select-none shrink-0">&gt;_</span>
                        <span className="truncate type-micro sm:type-caption">{getCliCommand(currentComp.name)}</span>
                      </span>
                      {copiedKey === 'quick-add' ? (
                        <Check className="icon-sm text-emerald-500 shrink-0 ml-1" />
                      ) : (
                        <Copy className="icon-sm text-zinc-400 shrink-0 ml-1" />
                      )}
                    </button>
                </div>
              </div>
          )}

          {studioView === 'code' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <ViewTabs view={studioView} onChange={setStudioView} isRTL={isRTL} />
              </div>
              <CodeBlock
              code={currentComp.codeSnippet}
              language="tsx"
              filename={`src/components/ui/${currentComp.name}.tsx`}
                showLineNumbers
                maxHeight="420px"
              />
            </div>
          )}

          {studioView === 'cli' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <ViewTabs view={studioView} onChange={setStudioView} isRTL={isRTL} />
              </div>
              <div className="space-y-4">
              <div className="p-4 rounded-(--radius-md) bg-(--bg-sunken) border border-(--border-subtle) space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="type-caption font-mono text-zinc-600 dark:text-zinc-400 font-semibold truncate">
                    {isRTL ? 'افزودن به پروژه' : 'Add component to your project'}
                  </span>
                  <div className="flex items-center p-0.5 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) shrink-0">
                    {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPackageManager(pm)}
                        aria-pressed={packageManager === pm}
                        className={`relative px-2 h-7 flex items-center rounded-(--radius-xs) type-micro font-mono cursor-pointer transition-colors focus-ui99 after:absolute after:-inset-1 after:content-[''] ${
                          packageManager === pm
                            ? 'bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 font-bold'
                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 p-3 rounded-(--radius-sm) bg-(--ink-fill) dark:bg-(--bg-surface) font-mono type-caption text-emerald-400 border border-(--border-soft) min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="select-none text-zinc-600 dark:text-zinc-500 shrink-0">&gt;_</span>
                    <span className="truncate type-micro sm:type-caption">{getCliCommand(currentComp.name)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(getCliCommand(currentComp.name), 'cli-single')}
                    aria-label={isRTL ? 'کپی دستور' : 'Copy command'}
                    className="p-1.5 rounded-(--radius-xs) hover:bg-zinc-800 dark:hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 focus-ui99"
                  >
                    {copiedKey === 'cli-single' ? <Check className="icon-sm text-emerald-400" /> : <Copy className="icon-sm" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-(--radius-md) bg-(--bg-sunken) border border-(--border-subtle) space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="type-caption font-mono text-zinc-600 dark:text-zinc-400 font-semibold truncate">
                    {isRTL ? 'دستور ایمپورت' : 'Import statement'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(`import { ${currentComp.title.replace(/[\s-]+/g, '')} } from '@/components/ui/${currentComp.name}';`, 'import-code')}
                    aria-label={isRTL ? 'کپی ایمپورت' : 'Copy import'}
                    className="p-1.5 rounded-(--radius-xs) hover:bg-(--bg-raised) dark:hover:bg-white/[0.08] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 focus-ui99"
                  >
                    {copiedKey === 'import-code' ? <Check className="icon-sm text-emerald-500 dark:text-emerald-400" /> : <Copy className="icon-sm" />}
                  </button>
                </div>
                <div className="p-3 rounded-(--radius-sm) bg-(--ink-fill) dark:bg-(--bg-surface) font-mono type-micro sm:type-caption text-zinc-200 border border-(--border-soft) overflow-x-auto no-scrollbar whitespace-nowrap" dir="ltr">
                  import &#123; {currentComp.title.replace(/[\s-]+/g, '')} &#125; from '@/components/ui/{currentComp.name}';
                </div>
              </div>
              </div>
            </div>
          )}

          {studioView === 'tokens' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end">
                <ViewTabs view={studioView} onChange={setStudioView} isRTL={isRTL} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['--bg-canvas', isRTL ? 'بوم' : 'Canvas'],
                ['--bg-card', isRTL ? 'کارت' : 'Surface card'],
                ['--border-subtle', isRTL ? 'حاشیه' : 'Hairline border'],
                ['--radius-control', isRTL ? 'شعاع کنترل' : 'Control radius'],
                ['--elevation-2', isRTL ? 'ارتفاع' : 'Elevation 2'],
                ['--space-md', isRTL ? 'فاصله' : 'Space step'],
              ].map(([token, label]) => (
                <div key={token} className="p-3 rounded-(--radius-sm) bg-(--bg-sunken) border border-(--border-subtle) type-micro font-mono min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                    <span className="text-zinc-600 dark:text-zinc-600 truncate">{token}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 break-all">{liveTokenValue(token)}</span>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* 5 · INSPECTOR — the registry's real data, side by side on desktop */}
        <aside
          className={`lg:w-80 lg:shrink-0 border-t lg:border-t-0 lg:border-s border-(--border-subtle) bg-(--bg-surface) min-w-0 ${
            inspectorOpen ? 'block' : 'hidden lg:block'
          }`}
          aria-label={isRTL ? 'مشخصات کامپوننت' : 'Component inspector'}
        >
          <div className="p-3 sm:p-4 space-y-4">
            <div>
              <h3 className="type-caption font-mono font-bold text-zinc-900 dark:text-white mb-2">
                {isRTL ? 'مشخصات' : 'Specification'}
              </h3>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 type-micro font-mono">
                {[
                  { l: isRTL ? 'دسته' : 'Category', v: currentComp.category },
                  { l: isRTL ? 'اولیه' : 'Primitive', v: currentComp.primitive || (isRTL ? 'بومی' : 'Native') },
                  { l: isRTL ? 'نسخه' : 'Version', v: `v${currentComp.version}` },
                  { l: isRTL ? 'پروپس' : 'Props', v: String(currentComp.props.length), tone: true },
                ].map((f) => (
                  <div key={f.l} className="min-w-0">
                    <dt className="text-zinc-400 dark:text-zinc-500">{f.l}</dt>
                    <dd className={`truncate ${'tone' in f && f.tone ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>{f.v}</dd>
                  </div>
                ))}
              </dl>
              {realDeps.length > 0 && (
                <p className="mt-2 type-micro font-mono text-zinc-500 dark:text-zinc-400 truncate">
                  {isRTL ? 'وابستگی: ' : 'Deps: '}{realDeps.join(', ')}
                </p>
              )}
            </div>

            <div>
              <h3 className="type-caption font-mono font-bold text-zinc-900 dark:text-white mb-2">
                {isRTL ? 'قابلیت‌ها' : 'Capabilities'}
              </h3>
              <ul className="space-y-1.5">
                {currentComp.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 type-micro text-zinc-600 dark:text-zinc-300">
                    <CheckCircle2 className="icon-xs text-emerald-500 shrink-0 mt-px" />
                    <span className="min-w-0">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="type-caption font-mono font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Zap className="icon-xs text-emerald-500" />
                {isRTL ? 'پروپس‌ها' : 'Props'}
                <span className="text-zinc-500 dark:text-zinc-500">({currentComp.props.length})</span>
              </h3>
              <ul className="space-y-2">
                {currentComp.props.length === 0 && (
                  <li className="type-micro text-zinc-500 dark:text-zinc-400">
                    {isRTL
                      ? 'برای این کامپوننت هنوز مستندات پروپس ثبت نشده است.'
                      : 'No prop documentation filed for this component yet.'}
                  </li>
                )}
                {currentComp.props.slice(0, 6).map((p) => (
                  <li key={p.name} className="min-w-0">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="type-micro font-mono font-semibold text-zinc-900 dark:text-white truncate">{p.name}</span>
                      <span className="type-micro font-mono text-emerald-600 dark:text-emerald-400 truncate">{p.type}</span>
                    </div>
                    <p className="type-micro text-zinc-500 dark:text-zinc-400 leading-snug">{p.description}</p>
                  </li>
                ))}
                {currentComp.props.length > 6 && (
                  <li>
                    <button
                      type="button"
                      onClick={() => { setFocusComponent(currentComp.name); setCurrentTab('DOCS'); }}
                      className="relative type-micro font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-1 cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
                    >
                      {isRTL ? `و ${currentComp.props.length - 6} پروپس دیگر` : `+ ${currentComp.props.length - 6} more`}
                      <ArrowRight className="icon-xs rtl:rotate-180" />
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setFocusComponent(currentComp.name); setCurrentTab('DOCS'); }}
                className="relative flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-(--radius-sm) bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 type-caption font-mono font-bold transition-opacity hover:opacity-90 cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
              >
                <BookOpen className="icon-xs" />
                {isRTL ? 'مستندات کامل' : 'Full API'}
              </button>
              <button
                type="button"
                onClick={() => copy(getCliCommand(currentComp.name), 'inspector-add')}
                aria-label={isRTL ? 'کپی دستور نصب' : 'Copy install command'}
                className="relative flex items-center justify-center h-9 w-9 shrink-0 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) text-zinc-600 dark:text-zinc-300 hover:bg-(--bg-raised) dark:hover:bg-white/[0.07] transition-colors cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
              >
                {copiedKey === 'inspector-add' ? <Check className="icon-sm text-emerald-500" /> : <Plus className="icon-sm" />}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence initial={false}>
            {inspectorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-(--border-subtle) bg-(--bg-surface)"
              >
                <div className="px-3 sm:px-4 pb-4">
                  <MobileInspector
                    comp={currentComp}
                    isRTL={isRTL}
                    deps={realDeps}
                    onOpenDocs={() => { setFocusComponent(currentComp.name); setCurrentTab('DOCS'); }}
                    onCopy={() => copy(getCliCommand(currentComp.name), 'mobile-add')}
                    copied={copiedKey === 'mobile-add'}
                  />
                </div>
              </motion.div>
            )}
      </AnimatePresence>
    </div>
  );
}

function MobileInspector({
  comp, isRTL, deps, onOpenDocs, onCopy, copied,
}: {
  comp: ComponentRegistryItem;
  isRTL: boolean;
  deps: string[];
  onOpenDocs: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-4 pt-1">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 type-micro font-mono">
        {[
          { l: isRTL ? 'دسته' : 'Category', v: comp.category },
          { l: isRTL ? 'اولیه' : 'Primitive', v: comp.primitive || (isRTL ? 'بومی' : 'Native') },
          { l: isRTL ? 'نسخه' : 'Version', v: `v${comp.version}` },
          { l: isRTL ? 'پروپس' : 'Props', v: String(comp.props.length), tone: true },
        ].map((f) => (
          <div key={f.l} className="min-w-0">
            <dt className="text-zinc-400 dark:text-zinc-500">{f.l}</dt>
            <dd className={`truncate ${'tone' in f && f.tone ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>{f.v}</dd>
          </div>
        ))}
      </dl>
      {deps.length > 0 && (
        <p className="type-micro font-mono text-zinc-500 dark:text-zinc-400 truncate">
          {isRTL ? 'وابستگی: ' : 'Deps: '}{deps.join(', ')}
        </p>
      )}

      <div>
        <h3 className="type-caption font-mono font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Zap className="icon-xs text-emerald-500" />
          {isRTL ? 'پروپس‌ها' : 'Props'}
        </h3>
        <ul className="space-y-2">
          {comp.props.length === 0 && (
            <li className="type-micro text-zinc-500 dark:text-zinc-400">
              {isRTL
                ? 'برای این کامپوننت هنوز مستندات پروپس ثبت نشده است.'
                : 'No prop documentation filed for this component yet.'}
            </li>
          )}
          {comp.props.slice(0, 4).map((p) => (
            <li key={p.name} className="min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="type-micro font-mono font-semibold text-zinc-900 dark:text-white truncate">{p.name}</span>
                <span className="type-micro font-mono text-emerald-600 dark:text-emerald-400 truncate">{p.type}</span>
              </div>
              <p className="type-micro text-zinc-500 dark:text-zinc-400 leading-snug">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="type-caption font-mono font-bold text-zinc-900 dark:text-white mb-2">
          {isRTL ? 'قابلیت‌ها' : 'Capabilities'}
        </h3>
        <ul className="space-y-1.5">
          {comp.features.map((f) => (
            <li key={f} className="flex items-start gap-2 type-micro text-zinc-600 dark:text-zinc-300">
              <CheckCircle2 className="icon-xs text-emerald-500 shrink-0 mt-px" />
              <span className="min-w-0">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDocs}
          className="relative flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-(--radius-sm) bg-(--ink-fill) dark:bg-white text-white dark:text-zinc-950 type-caption font-mono font-bold transition-opacity hover:opacity-90 cursor-pointer focus-ui99 after:absolute after:-inset-1 after:content-['']"
        >
          <BookOpen className="icon-xs" />
          {isRTL ? 'مستندات کامل' : 'Full API'}
        </button>
        <button
          type="button"
          onClick={onCopy}
          aria-label={isRTL ? 'کپی دستور نصب' : 'Copy install command'}
          className="relative flex items-center justify-center h-11 w-11 shrink-0 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer focus-ui99"
        >
          {copied ? <Check className="icon-sm text-emerald-500" /> : <Plus className="icon-sm" />}
        </button>
      </div>
    </div>
  );
}
