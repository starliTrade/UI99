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
 * TOUCH DENSITY LAW — the 44px floor (AGENTS S5) is a TOUCH floor, never
 * a visual one. Controls stay pro-dense (28–32px) at EVERY breakpoint; a
 * transparent after-pseudo expands the hit area out to the floor:
 *
 *   24px visual + HIT_WIDER (-inset-2.5) = 44px touch view tabs, pm lanes
 *   28px visual + HIT_WIDE  (-inset-2)   = 44px touch stepper, icon buttons
 *   32px visual + HIT       (-inset-1.5) = 44px touch chips, pills
 *   36px field, no expansion             search input (inputs cannot carry
 *                                                        pseudo hit areas)
 *   well    recessed     command trays sit in bg-sunken, never elevated
 *
 * Zone anatomy (all radii/fills are tokens, zero raw alphas, one matte fill
 * per state — selection is always the ink-fill/on-fill token pair):
 *
 *   card      radius-lg  bg-card      1px border-subtle
 *   header    --         bg-surface   1px border-subtle
 *   ribbon    --         bg-sunken    1px border-subtle
 *   canvas    radius-md  bg-sunken    1px border-subtle
 *   sheet     radius-md  bg-surface   1px border-subtle
 *   control   32px       radius-sm    bg-wash - the group owns the border
 *   field     --         radius-field inputs and search
 *
 * Structure, in reading order: identity -> browser -> ribbon -> switcher ->
 * workbench -> spec. ONE view switcher (not one per view), and the spec sheet
 * is content on a phone — always visible below the workbench — while desktop
 * gets it as a right rail from lg. Same Inspector component, two placements.
 *
 * A11y: WAI-ARIA tabs on the ribbon (roving tabindex, RTL-aware arrow keys),
 * radiogroup on the PM picker, labelled icon-only buttons, focus-ui99 rings
 * with pseudo-element hit expansion on compact desktop targets.
 */

import { useMemo, useState } from 'react';
import {
  ArrowRight, BarChart3, Bell, BookOpen, Check, CheckCircle2, CheckSquare,
  ChevronDown, ChevronLeft, ChevronRight, Code2, Copy, Eye, Github, Layers, Layout,
  MousePointerClick, Palette, Plus, Search, Sparkles, Terminal, X, Zap,
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

/* -- Shared chip language ----------------------------------------------------
 * Selection is ALWAYS the ink-fill pair — light theme: dark ink on porcelain,
 * dark theme: porcelain on obsidian. One matte fill, both themes, no drift. */
const SELECTED_CHIP = 'bg-(--ink-fill) text-(--text-on-fill) font-bold';
const IDLE_CHIP =
  'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--state-hover)';
/**
 * Touch density — the 44px Apple-HIG floor is a TOUCH floor, not a visual
 * one. Visuals stay dense on every breakpoint; the pseudo-element carries
 * the floor. Inset math: 28px + 2×8 = 44, 32px + 2×6 = 44.
 */
const HIT = "after:absolute after:-inset-1.5 after:content-['']"; // 32px visuals
const HIT_WIDE = "after:absolute after:-inset-2 after:content-['']"; // 28px visuals
const HIT_WIDER = "after:absolute after:-inset-2.5 after:content-['']"; // 24px visuals

type StudioView = 'stage' | 'code' | 'cli' | 'tokens';

const VIEWS: ReadonlyArray<{ id: StudioView; label: string; icon: typeof Eye }> = [
  { id: 'stage', label: 'Preview', icon: Eye },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'cli', label: 'CLI', icon: Terminal },
  { id: 'tokens', label: 'Tokens', icon: Palette },
];

/**
 * The view switcher. One instance, directly above the workbench it controls —
 * it used to be rendered once per view, four copies of the same control.
 * On a phone it is a four-lane full-width switchboard (40px lanes); from sm
 * it relaxes to the inline segmented control.
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
      className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex items-center gap-0.5 p-1 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft)"
    >
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={view === v.id}
          onClick={() => onChange(v.id)}
          className={`relative flex items-center justify-center gap-1 h-6 px-2 rounded-(--radius-xs) type-micro font-mono transition-colors cursor-pointer focus-ui99 ${HIT_WIDER} ${
            view === v.id ? SELECTED_CHIP : IDLE_CHIP
          }`}
        >
          <v.icon className="icon-xs shrink-0" />
          <span className="type-caption">{v.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Package-manager picker — a real radiogroup (single-select semantics), four
 * equal lanes on a phone, inline pills from sm. Used by the quick-add tray
 * and the CLI view; one component, one behaviour.
 */
function PmPicker({
  value, onChange, isRTL,
}: {
  value: 'npm' | 'pnpm' | 'yarn' | 'bun';
  onChange: (pm: 'npm' | 'pnpm' | 'yarn' | 'bun') => void;
  isRTL: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={isRTL ? 'پکیج منیجر' : 'Package manager'}
      className="grid grid-cols-4 sm:inline-flex sm:items-center gap-1 p-1 w-full sm:w-fit rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) shrink-0"
    >
      {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
        <button
          key={pm}
          type="button"
          role="radio"
          aria-checked={value === pm}
          onClick={() => onChange(pm)}
          className={`relative flex items-center justify-center h-6 px-2 rounded-(--radius-xs) type-micro font-mono uppercase whitespace-nowrap cursor-pointer transition-colors focus-ui99 ${HIT_WIDER} ${
            value === pm ? SELECTED_CHIP : IDLE_CHIP
          }`}
        >
          {pm}
        </button>
      ))}
    </div>
  );
}

/**
 * The recessed command well — the one idiom for "a shell line lives here".
 * Sunken fill, hairline border, emerald prompt. 36px visual height — a
 * text-adjacent control, like an IDE status bar; full-width on a phone so
 * the whole row is the copy target.
 */
function CommandWell({
  command, copied, onCopy, isRTL,
}: {
  command: string;
  copied: boolean;
  onCopy: () => void;
  isRTL: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={isRTL ? `کپی دستور: ${command}` : `Copy command: ${command}`}
      className="flex-1 min-w-0 flex items-center justify-between gap-2 px-2.5 h-7 rounded-(--radius-sm) bg-(--bg-sunken) border border-(--border-subtle) hover:border-(--border-soft) font-mono transition-colors cursor-pointer focus-ui99"
    >
      <span className="flex items-center gap-1.5 min-w-0">
        <span className="text-emerald-500 dark:text-emerald-400 font-bold type-micro select-none shrink-0">
          &gt;_
        </span>
        <span dir="ltr" className="truncate type-micro text-(--text-primary)">
          {command}
        </span>
      </span>
      <span className="shrink-0 text-(--text-muted)">
        {copied ? <Check className="icon-sm text-emerald-500 dark:text-emerald-400" /> : <Copy className="icon-sm" />}
      </span>
    </button>
  );
}

/**
 * The spec sheet — registry truth about the component. One presentational
 * component, two placements: a right rail from lg (variant="rail") and an
 * always-visible sheet under the workbench on a phone (variant="sheet").
 * No second data source. The Specification block is a disclosure — collapsed
 * until asked for — so the sheet leads with capabilities, not metadata.
 */
function Inspector({
  comp, isRTL, deps, copied, onCopy, onOpenDocs, variant,
}: {
  comp: ComponentRegistryItem;
  isRTL: boolean;
  deps: string[];
  copied: boolean;
  onCopy: () => void;
  onOpenDocs: () => void;
  variant: 'rail' | 'sheet';
}) {
  const propLimit = variant === 'rail' ? 6 : 4;
  const actionSize = variant === 'rail' ? 'h-9' : 'h-10';
  const [specOpen, setSpecOpen] = useState(false);

  return (
    <div className="space-y-4">
      <section>
        <button
          type="button"
          onClick={() => setSpecOpen((o) => !o)}
          aria-expanded={specOpen}
          aria-controls={`studio-spec-${variant}`}
          className={`relative flex w-full items-center justify-between gap-2 mb-2 cursor-pointer focus-ui99 ${HIT}`}
        >
          <span className="type-caption font-mono font-bold text-(--text-primary)">
            {isRTL ? 'مشخصات' : 'Specification'}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`icon-xs text-(--text-muted) transition-transform ${specOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {specOpen && (
          <div id={`studio-spec-${variant}`} className="space-y-2">
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 type-micro font-mono">
              {[
                { l: isRTL ? 'دسته' : 'Category', v: comp.category },
                { l: isRTL ? 'اولیه' : 'Primitive', v: comp.primitive || (isRTL ? 'بومی' : 'Native') },
                { l: isRTL ? 'نسخه' : 'Version', v: `v${comp.version}` },
                { l: isRTL ? 'پروپس' : 'Props', v: String(comp.props.length), tone: true },
              ].map((f) => (
                <div key={f.l} className="min-w-0">
                  <dt className="text-(--text-muted)">{f.l}</dt>
                  <dd className={`truncate ${'tone' in f && f.tone ? 'text-emerald-600 dark:text-emerald-400' : 'text-(--text-primary)'}`}>
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
            {deps.length > 0 && (
              <p className="type-micro font-mono text-(--text-secondary) truncate">
                {isRTL ? 'وابستگی: ' : 'Deps: '}{deps.join(', ')}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        <h3 className="type-caption font-mono font-bold text-(--text-primary) mb-2">
          {isRTL ? 'قابلیت‌ها' : 'Capabilities'}
        </h3>
        <ul className="space-y-1.5">
          {comp.features.map((f) => (
            <li key={f} className="flex items-start gap-2 type-micro text-(--text-secondary)">
              <CheckCircle2 className="icon-xs text-emerald-500 shrink-0 mt-px" />
              <span className="min-w-0">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="type-caption font-mono font-bold text-(--text-primary) mb-2 flex items-center gap-1.5">
          <Zap className="icon-xs text-emerald-500" />
          {isRTL ? 'پروپس‌ها' : 'Props'}
          <span className="text-(--text-muted)">({comp.props.length})</span>
        </h3>
        <ul className="space-y-2">
          {comp.props.length === 0 && (
            <li className="type-micro text-(--text-secondary)">
              {isRTL
                ? 'برای این کامپوننت هنوز مستندات پروپس ثبت نشده است.'
                : 'No prop documentation filed for this component yet.'}
            </li>
          )}
          {comp.props.slice(0, propLimit).map((p) => (
            <li key={p.name} className="min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="type-micro font-mono font-semibold text-(--text-primary) truncate">{p.name}</span>
                <span className="type-micro font-mono text-emerald-600 dark:text-emerald-400 truncate">{p.type}</span>
              </div>
              <p className="type-micro text-(--text-secondary) leading-snug">{p.description}</p>
            </li>
          ))}
          {comp.props.length > propLimit && (
            <li>
              <button
                type="button"
                onClick={onOpenDocs}
                className={`relative type-micro font-mono text-(--text-secondary) hover:text-(--text-primary) inline-flex items-center gap-1 cursor-pointer focus-ui99 ${HIT}`}
              >
                {isRTL ? `و ${comp.props.length - propLimit} پروپس دیگر` : `+ ${comp.props.length - propLimit} more`}
                <ArrowRight className="icon-xs rtl:rotate-180" />
              </button>
            </li>
          )}
        </ul>
      </section>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onOpenDocs}
          className={`relative flex-1 flex items-center justify-center gap-1.5 ${actionSize} px-3 rounded-(--radius-sm) bg-(--ink-fill) text-(--text-on-fill) type-caption font-mono font-bold transition-opacity hover:opacity-90 cursor-pointer focus-ui99 ${HIT}`}
        >
          <BookOpen className="icon-xs" />
          {isRTL ? 'مستندات کامل' : 'Full API'}
        </button>
        <button
          type="button"
          onClick={onCopy}
          aria-label={isRTL ? 'کپی دستور نصب' : 'Copy install command'}
          className={`relative flex items-center justify-center ${actionSize} ${variant === 'rail' ? 'w-9' : 'w-10'} shrink-0 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) text-(--text-secondary) hover:bg-(--state-hover) transition-colors cursor-pointer focus-ui99 ${HIT}`}
        >
          {copied ? <Check className="icon-sm text-emerald-500" /> : <Plus className="icon-sm" />}
        </button>
      </div>
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

  const filtersActive = searchQuery.trim() !== '' || activeCategory !== 'all';
  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const currentComp: ComponentRegistryItem =
    REGISTRY_COMPONENTS.find((c) => c.id === activeComponentId) || REGISTRY_COMPONENTS[0];

  const registryIndex = Math.max(0, REGISTRY_COMPONENTS.findIndex((c) => c.id === activeComponentId));

  /** Step through the whole registry, not just the current filter. */
  const stepComponent = (delta: number) => {
    const next = REGISTRY_COMPONENTS[registryIndex + delta];
    if (next) setActiveComponentId(next.id);
  };

  /** Open the component's full API docs, pre-focused. */
  const openDocs = () => {
    setFocusComponent(currentComp.name);
    setCurrentTab('DOCS');
  };

  /**
   * WAI-ARIA tabs pattern on the ribbon: one tab stop, arrow keys walk it,
   * Home/End jump to the ends, directions flip in RTL. A hundred and three
   * tab stops was both a keyboard trap and a screen-reader wall.
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
  const cliCommand = getCliCommand(currentComp.name);

  return (
    <section
      className="rounded-(--radius-lg) border border-(--border-subtle) bg-(--bg-card) shadow-(--shadow-card) overflow-hidden"
      aria-label={isRTL ? 'استودیوی رجیستری' : 'Registry studio'}
    >
      {/* 1 - IDENTITY — which component, where you are, and how to act.
          One dense row at every breakpoint: the title truncates, controls
          stay compact and take their touch room from hit expansion. */}
      <header className="px-3 sm:px-4 py-2 border-b border-(--border-subtle) bg-(--bg-surface) flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="flex h-2 w-2 relative shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-(--radius-pill) h-2 w-2 bg-emerald-500" />
          </span>
          <h2 className="type-caption font-mono min-w-0 truncate">
            <span className="font-semibold text-(--text-primary)">{currentComp.title}</span>
            <span className="ms-1.5 px-1.5 py-0.5 rounded-(--radius-xs) type-micro bg-(--bg-raised) dark:bg-(--bg-wash) text-(--text-secondary) font-normal">
              {currentComp.primitive || 'Native'}
            </span>
            <span className="hidden lg:inline-flex ms-1.5 px-1.5 py-0.5 rounded-(--radius-xs) type-micro bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 align-middle">
              WCAG 2.2 AA
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Registry stepper — every component reachable without the ribbon.
              28px visuals; the 44px touch floor comes from HIT_WIDE. */}
          <div className="flex items-center gap-0.5 p-1 sm:p-0.5 rounded-(--radius-sm) bg-(--bg-wash) border border-(--border-soft) shrink-0">
            <button
              type="button"
              onClick={() => stepComponent(-1)}
              disabled={registryIndex <= 0}
              aria-label={isRTL ? 'کامپوننت قبلی' : 'Previous component'}
              className={`relative flex items-center justify-center h-7 w-7 rounded-(--radius-xs) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--state-hover) disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer focus-ui99 ${HIT_WIDE}`}
            >
              {isRTL ? <ChevronRight className="icon-xs" /> : <ChevronLeft className="icon-xs" />}
            </button>
            <span
              className="type-micro font-mono text-(--text-secondary) tabular-nums px-1 select-none"
              aria-label={isRTL ? `${registryIndex + 1} از ${REGISTRY_COMPONENTS.length}` : `Component ${registryIndex + 1} of ${REGISTRY_COMPONENTS.length}`}
            >
              {registryIndex + 1}/{REGISTRY_COMPONENTS.length}
            </span>
            <button
              type="button"
              onClick={() => stepComponent(1)}
              disabled={registryIndex >= REGISTRY_COMPONENTS.length - 1}
              aria-label={isRTL ? 'کامپوننت بعدی' : 'Next component'}
              className={`relative flex items-center justify-center h-7 w-7 rounded-(--radius-xs) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--state-hover) disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer focus-ui99 ${HIT_WIDE}`}
            >
              {isRTL ? <ChevronLeft className="icon-xs" /> : <ChevronRight className="icon-xs" />}
            </button>
          </div>

          {/* Docs — icon-only 44px target on a phone, labelled pill from sm. */}
          <button
            type="button"
            onClick={openDocs}
            aria-label={isRTL ? 'مستندات کامل' : 'Open full API docs'}
            className={`relative flex items-center justify-center sm:justify-start gap-1.5 h-8 w-8 sm:w-auto sm:px-2.5 rounded-(--radius-sm) type-caption font-mono font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--state-hover) transition-colors cursor-pointer shrink-0 focus-ui99 ${HIT_WIDE}`}
          >
            <BookOpen className="icon-xs shrink-0" />
            <span className="hidden sm:inline">{isRTL ? 'مستندات' : 'Full API'}</span>
            <ArrowRight className="hidden sm:inline icon-xs rtl:rotate-180 shrink-0" />
          </button>
        </div>
      </header>

      {/* 2 - BROWSER — search owns its full-width row on a phone; from sm the
          search and the category strip share one line. */}
      <div className="px-3 sm:px-4 py-2 border-b border-(--border-subtle) bg-(--bg-surface) flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
        <div className="relative w-full sm:w-48 shrink-0">
          <Search className="icon-xs absolute start-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'جستجو…' : 'Search…'}
            aria-label={isRTL ? 'جستجوی کامپوننت' : 'Search components'}
            className="w-full h-9 sm:h-7 ps-8 pe-9 sm:pe-2 rounded-(--radius-field) bg-(--bg-card) dark:bg-(--bg-wash) border border-(--border-soft) type-caption text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-strong) focus-ui99-inset font-mono"
          />
          {searchQuery !== '' && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={isRTL ? 'پاک‌کردن جستجو' : 'Clear search'}
              className="absolute end-1 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-(--radius-xs) text-(--text-muted) hover:text-(--text-primary) cursor-pointer focus-ui99"
            >
              <X className="icon-xs" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x min-w-0 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`relative inline-flex items-center gap-1.5 h-8 px-2.5 rounded-(--radius-sm) type-micro font-mono whitespace-nowrap transition-colors cursor-pointer focus-ui99 ${HIT} ${
                activeCategory === cat.id ? SELECTED_CHIP : IDLE_CHIP
              }`}
            >
              <cat.icon className="w-3 h-3 shrink-0" />
              <span>{cat.label}</span>
              <span className="tabular-nums opacity-55">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 - RIBBON — the filtered registry, one tab stop, every screen.
          A category that cannot show its own components is a filter with
          no answer, so this row is not desktop-only. */}
      <div className="flex px-3 sm:px-4 py-2 border-b border-(--border-subtle) bg-(--bg-sunken) items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
        {filteredComponents.length === 0 ? (
          <div className="flex items-center gap-2 py-1">
            <Search className="icon-xs text-(--text-muted) shrink-0" />
            <p className="type-caption font-mono text-(--text-secondary)">
              {isRTL ? 'کامپوننتی یافت نشد' : 'No components match this filter'}
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className={`relative inline-flex items-center gap-1 h-8 px-2.5 rounded-(--radius-sm) type-micro font-mono text-emerald-600 dark:text-emerald-400 hover:bg-(--state-hover) cursor-pointer transition-colors shrink-0 focus-ui99 ${HIT}`}
              >
                <X className="icon-xs" />
                {isRTL ? 'پاک‌کردن فیلترها' : 'Clear filters'}
              </button>
            )}
          </div>
        ) : (
          <div
            role="tablist"
            aria-label={isRTL ? 'کامپوننت‌ها' : 'Registry components'}
            aria-orientation="horizontal"
            className="flex items-center gap-1.5 shrink-0"
            onKeyDown={onRibbonKeyDown}
          >
            {filteredComponents.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={activeComponentId === c.id}
                tabIndex={activeComponentId === c.id ? 0 : -1}
                data-ribbon-item={c.id}
                onClick={() => setActiveComponentId(c.id)}
                className={`relative px-2 h-7 rounded-(--radius-sm) type-caption font-mono whitespace-nowrap transition-colors cursor-pointer focus-ui99 ${HIT_WIDE} ${
                  activeComponentId === c.id ? SELECTED_CHIP : IDLE_CHIP
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4 - WORKBENCH — one switcher, the canvas, and the quick-add tray;
          from lg the inspector rail joins on the right. */}
      <div className="flex flex-col lg:flex-row min-w-0">
        <div className="flex-1 min-w-0 p-3.5 sm:p-4 md:p-6 flex flex-col gap-3.5 sm:gap-4 bg-(--bg-card)">
          <div className="flex justify-center">
            <ViewTabs view={studioView} onChange={setStudioView} isRTL={isRTL} />
          </div>

          {studioView === 'stage' && (
            <>
              {/* The stage — a recessed canvas with a dot lattice; wide
                  specimens scroll, never squeeze. */}
              <div className="relative min-h-[260px] sm:min-h-[340px] rounded-(--radius-md) bg-(--bg-sunken) border border-(--border-subtle) p-4 sm:p-6 flex items-center justify-center overflow-x-auto overflow-y-hidden">
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
                      <p className="type-micro font-mono text-(--text-muted) text-center">
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
                      <span className="type-caption font-mono text-(--text-muted)">Value: {otpValue}</span>
                    </div>
                  )}

                  {activeComponentId === 'color-picker' && (
                    <div className="flex flex-col items-center gap-3">
                      <ColorPicker value={colorValue} onChange={setColorValue} />
                      <span className="type-caption font-mono text-(--text-muted)">Hex: {colorValue}</span>
                    </div>
                  )}

                  {activeComponentId === 'tag-input' && (
                    <div className="w-full">
                      <TagInput tags={tags} onChange={setTags} label="Keywords" placeholder="Add tag..." />
                    </div>
                  )}

                  {activeComponentId === 'number-field' && (
                    <div className="w-48 max-w-full">
                      <NumberField value={numberValue} onChange={setNumberValue} min={0} max={200} step={1} />
                    </div>
                  )}

                  {activeComponentId === 'rating' && (
                    <div className="flex flex-col items-center gap-2">
                      <Rating value={ratingValue} onChange={setRatingValue} max={5} />
                      <span className="type-caption font-mono text-(--text-muted)">{ratingValue} / 5.0</span>
                    </div>
                  )}

                  {activeComponentId === 'switch' && (
                    <div className="flex items-center gap-3">
                      <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                      <span className="type-caption font-medium text-(--text-secondary)">
                        Specular Rim Highlight ({switchChecked ? 'Active' : 'Muted'})
                      </span>
                    </div>
                  )}

                  {activeComponentId === 'slider' && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between type-caption font-mono text-(--text-secondary)">
                        <span>Level</span>
                        <span className="text-(--text-primary) font-bold">{sliderValue}%</span>
                      </div>
                      <Slider value={sliderValue} min={0} max={100} onChange={setSliderValue} />
                    </div>
                  )}

                  {activeComponentId === 'progress' && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between type-caption font-mono text-(--text-secondary)">
                        <span>Sprint Completion</span>
                        <span className="text-(--text-primary) font-bold">{progressValue}%</span>
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
                        <p className="type-caption text-(--text-secondary)">
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
                        <span className="text-(--text-muted)">Real-time Telemetry</span>
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
                      <span className="type-caption text-(--text-secondary) ms-1 font-mono">
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
                      <TabsContent value="overview" className="p-2 type-caption text-(--text-secondary)">
                        Overview panel content with velvet spring indicator.
                      </TabsContent>
                      <TabsContent value="activity" className="p-2 type-caption text-(--text-secondary)">
                        Real-time user event bus telemetry.
                      </TabsContent>
                      <TabsContent value="settings" className="p-2 type-caption text-(--text-secondary)">
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

              {/* Quick-add tray — demo chips for stateful specimens, then the
                  universal PM + install row. One tray, one visual weight. */}
              <div className="rounded-(--radius-md) bg-(--bg-surface) border border-(--border-subtle) p-2 space-y-2">
                {activeComponentId === 'button' && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-14 shrink-0 type-micro font-mono text-(--text-muted)">Variant</span>
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x min-w-0">
                        {(['primary', 'secondary', 'outline', 'ghost', 'rose'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setBtnVariant(v)}
                            aria-pressed={btnVariant === v}
                            className={`relative flex items-center h-7 px-2.5 rounded-(--radius-xs) capitalize font-mono type-micro whitespace-nowrap cursor-pointer transition-colors shrink-0 focus-ui99 ${HIT_WIDE} ${
                              btnVariant === v ? SELECTED_CHIP : `${IDLE_CHIP} bg-(--bg-raised) dark:bg-(--bg-wash)`
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-14 shrink-0 type-micro font-mono text-(--text-muted)">Size</span>
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x min-w-0">
                        {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setBtnSize(s)}
                            aria-pressed={btnSize === s}
                            className={`relative flex items-center h-7 px-2.5 rounded-(--radius-xs) uppercase font-mono type-micro cursor-pointer transition-colors shrink-0 focus-ui99 ${HIT_WIDE} ${
                              btnSize === s ? SELECTED_CHIP : `${IDLE_CHIP} bg-(--bg-raised) dark:bg-(--bg-wash)`
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${activeComponentId === 'button' ? 'pt-2 border-t border-(--border-subtle)' : ''}`}>
                  <PmPicker value={packageManager} onChange={setPackageManager} isRTL={isRTL} />
                  <CommandWell
                    command={cliCommand}
                    copied={copiedKey === 'quick-add'}
                    onCopy={() => copy(cliCommand, 'quick-add')}
                    isRTL={isRTL}
                  />
                </div>
              </div>
            </>
          )}

          {studioView === 'code' && (
            <CodeBlock
              code={currentComp.codeSnippet}
              language="tsx"
              filename={`src/components/ui/${currentComp.name}.tsx`}
              showLineNumbers
              maxHeight="420px"
            />
          )}

          {studioView === 'cli' && (
            <div className="space-y-3">
              <div className="rounded-(--radius-md) bg-(--bg-surface) border border-(--border-subtle) p-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="type-caption font-mono text-(--text-secondary) font-semibold truncate">
                    {isRTL ? 'افزودن به پروژه' : 'Add component to your project'}
                  </span>
                  <PmPicker value={packageManager} onChange={setPackageManager} isRTL={isRTL} />
                </div>
                <CommandWell
                  command={cliCommand}
                  copied={copiedKey === 'cli-single'}
                  onCopy={() => copy(cliCommand, 'cli-single')}
                  isRTL={isRTL}
                />
              </div>

              <div className="rounded-(--radius-md) bg-(--bg-surface) border border-(--border-subtle) p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="type-caption font-mono text-(--text-secondary) font-semibold truncate">
                    {isRTL ? 'دستور ایمپورت' : 'Import statement'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(`import { ${currentComp.title.replace(/[\s-]+/g, '')} } from '@/components/ui/${currentComp.name}';`, 'import-code')}
                    aria-label={isRTL ? 'کپی ایمپورت' : 'Copy import'}
                    className={`relative flex items-center justify-center h-8 w-8 rounded-(--radius-xs) text-(--text-muted) hover:text-(--text-primary) hover:bg-(--state-hover) transition-colors cursor-pointer shrink-0 focus-ui99 ${HIT}`}
                  >
                    {copiedKey === 'import-code' ? <Check className="icon-sm text-emerald-500 dark:text-emerald-400" /> : <Copy className="icon-sm" />}
                  </button>
                </div>
                <div className="px-3 py-2.5 rounded-(--radius-sm) bg-(--bg-sunken) border border-(--border-subtle) font-mono type-micro sm:type-caption text-(--text-primary) overflow-x-auto no-scrollbar whitespace-nowrap" dir="ltr">
                  import &#123; {currentComp.title.replace(/[\s-]+/g, '')} &#125; from '@/components/ui/{currentComp.name}';
                </div>
              </div>
            </div>
          )}

          {studioView === 'tokens' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                ['--bg-canvas', isRTL ? 'بوم' : 'Canvas'],
                ['--bg-card', isRTL ? 'کارت' : 'Surface card'],
                ['--border-subtle', isRTL ? 'حاشیه' : 'Hairline border'],
                ['--radius-control', isRTL ? 'شعاع کنترل' : 'Control radius'],
                ['--elevation-2', isRTL ? 'ارتفاع' : 'Elevation 2'],
                ['--space-md', isRTL ? 'فاصله' : 'Space step'],
              ].map(([token, label]) => (
                <div key={token} className="p-2.5 rounded-(--radius-sm) bg-(--bg-sunken) border border-(--border-subtle) type-micro font-mono min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-(--text-secondary)">{label}</span>
                    <span className="text-(--text-muted) truncate">{token}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 break-all">{liveTokenValue(token)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5 - INSPECTOR RAIL — desktop placement of the spec sheet */}
        <aside
          className="hidden lg:block lg:w-80 lg:shrink-0 border-s border-(--border-subtle) bg-(--bg-surface) min-w-0"
          aria-label={isRTL ? 'مشخصات کامپوننت' : 'Component inspector'}
        >
          <div className="p-4">
            <Inspector
              comp={currentComp}
              isRTL={isRTL}
              deps={realDeps}
              copied={copiedKey === 'inspector-add'}
              onCopy={() => copy(cliCommand, 'inspector-add')}
              onOpenDocs={openDocs}
              variant="rail"
            />
          </div>
        </aside>
      </div>

      {/* 6 - SPEC SHEET — the phone placement. Spec is content, not a
          hidden drawer: it is always visible below the workbench. */}
      <div className="lg:hidden border-t border-(--border-subtle) bg-(--bg-surface) px-3 sm:px-4 py-4">
        <Inspector
          comp={currentComp}
          isRTL={isRTL}
          deps={realDeps}
          copied={copiedKey === 'mobile-add'}
          onCopy={() => copy(cliCommand, 'mobile-add')}
          onOpenDocs={openDocs}
          variant="sheet"
        />
      </div>
    </section>
  );
}
