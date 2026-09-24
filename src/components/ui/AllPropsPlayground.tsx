/**
 * UI99 — All-Props Heavy Playground (Sprint 3 · Phase 4.2)
 *
 * The TokenSandbox covers Button/Switch/Badge/Slider/Progress. This playground
 * covers the HEAVY interactive primitives that never had live prop controls:
 *   DataTable (search/sort/pagination), Combobox (create-option flow),
 *   Slider (haptic steps), Switch (haptic spring), PasswordInput (strength),
 *   OTPInput (auto-advance), DatePicker (month grid).
 *
 * Same contract as the rest of the gallery: dual-theme via tokens, five-state
 * controls, 44px touch targets, and copy-ready JSX for every state.
 */

import React, { useState, useMemo } from 'react';
import {
  Table2,
  Check,
  Copy,
  RotateCcw,
  Database,
  Layers,
  Calendar,
  KeyRound,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DataTable,
  Combobox,
  Slider,
  Switch,
  PasswordInput,
  OTPInput,
  DatePicker,
  Badge,
  PriorityBadge,
  Button,
} from './index';
import { useIsDark } from './theme';

type PlaygroundComponent =
  | 'data-table'
  | 'combobox'
  | 'slider'
  | 'switch'
  | 'password'
  | 'otp'
  | 'date-picker';

const COMPONENTS: { value: PlaygroundComponent; label: string; icon: React.ReactNode }[] = [
  { value: 'data-table', label: 'DataTable', icon: <Table2 className="w-4 h-4" /> },
  { value: 'combobox', label: 'Combobox', icon: <Layers className="w-4 h-4" /> },
  { value: 'slider', label: 'Slider', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { value: 'switch', label: 'Switch', icon: <ShieldCheck className="w-4 h-4" /> },
  { value: 'password', label: 'PasswordInput', icon: <KeyRound className="w-4 h-4" /> },
  { value: 'otp', label: 'OTPInput', icon: <KeyRound className="w-4 h-4" /> },
  { value: 'date-picker', label: 'DatePicker', icon: <Calendar className="w-4 h-4" /> },
];

interface TaskRow {
  id: number;
  task: string;
  owner: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
}

const DEMO_TASKS: TaskRow[] = [
  { id: 1, task: 'Ship registry v2 scan', owner: 'Ada', priority: 'urgent', status: 'in_progress' },
  { id: 2, task: 'Tokenize rose-intent fills', owner: 'Kai', priority: 'high', status: 'done' },
  { id: 3, task: 'Audit RTL slider mirrors', owner: 'Noor', priority: 'medium', status: 'todo' },
  { id: 4, task: 'Wire axe-core into CI', owner: 'Ada', priority: 'high', status: 'done' },
  { id: 5, task: 'Porcelain contrast sweep', owner: 'Rio', priority: 'low', status: 'todo' },
  { id: 6, task: 'Pin CLI transitive deps', owner: 'Kai', priority: 'medium', status: 'in_progress' },
  { id: 7, task: 'Publish @99/ui@1.0.0', owner: 'Ada', priority: 'urgent', status: 'todo' },
];

const DEMO_OPTIONS = [
  { value: 'obsidian', label: 'Velvet Obsidian', hint: 'Default canvas' },
  { value: 'porcelain', label: 'Matte Porcelain', hint: 'Day theme' },
  { value: 'emerald', label: 'Emerald Signal', hint: 'Completion accent' },
  { value: 'amber', label: 'Amber Focus', hint: 'Attention accent' },
  { value: 'rose', label: 'Rose Interrupt', hint: 'Urgent accent' },
];

const PRIORITY_COLORS: Record<TaskRow['priority'], string> = {
  urgent: 'text-rose-500',
  high: 'text-amber-500',
  medium: 'text-blue-500',
  low: 'text-zinc-400 dark:text-zinc-500',
};

export function AllPropsPlayground() {
  const isDark = useIsDark();

  const [component, setComponent] = useState<PlaygroundComponent>('data-table');
  const [copied, setCopied] = useState(false);

  // DataTable controls
  const [dtSearchable, setDtSearchable] = useState(true);
  const [dtPageSize, setDtPageSize] = useState(3);

  // Combobox controls
  const [cbValue, setCbValue] = useState<string | null>('obsidian');
  const [cbAllowCreate, setCbAllowCreate] = useState(false);

  // Slider controls
  const [slValue, setSlValue] = useState(64);
  const [slShowValue, setSlShowValue] = useState(true);
  const [slUnit, setSlUnit] = useState('%');

  // Switch controls
  const [swChecked, setSwChecked] = useState(true);
  const [swSize, setSwSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Password controls
  const [pwShowStrength, setPwShowStrength] = useState(true);

  // OTP controls
  const [otpLength, setOtpLength] = useState(6);

  // DatePicker
  const [dpValue, setDpValue] = useState<string | null>(null);

  const copyJSX = () => {
    navigator.clipboard.writeText(generatedJSX);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedJSX = useMemo(() => {
    switch (component) {
      case 'data-table':
        return `import { DataTable } from '@/components/ui';

<DataTable
  columns={columns}
  data={tasks}
  pageSize={${dtPageSize}}
  searchable={${dtSearchable}}
/>`;
      case 'combobox':
        return `import { Combobox } from '@/components/ui';

<Combobox
  options={themeOptions}
  value={${cbValue ? `"${cbValue}"` : 'null'}}
  onChange={setTheme}
  allowCreate={${cbAllowCreate}}
  placeholder="Select theme…"
/>`;
      case 'slider':
        return `import { Slider } from '@/components/ui';

<Slider
  value={${slValue}}
  onChange={setValue}
  label="Haptic Range"
  unit="${slUnit}"
  min={0}
  max={100}
/>`;
      case 'switch':
        return `import { Switch } from '@/components/ui';

<Switch
  checked={enabled}
  onChange={setEnabled}
  size="${swSize}"
  label="Haptic feedback"
/>`;
      case 'password':
        return `import { PasswordInput } from '@/components/ui';

<PasswordInput
  label="Enterprise Password"
  showStrength={${pwShowStrength}}
  placeholder="••••••••••"
/>`;
      case 'otp':
        return `import { OTPInput } from '@/components/ui';

<OTPInput
  length={${otpLength}}
  onComplete={(code) => verify(code)}
/>`;
      case 'date-picker':
        return `import { DatePicker } from '@/components/ui';

<DatePicker
  value={${dpValue ? `"${dpValue}"` : 'null'}}
  onChange={setDate}
  placeholder="Pick a date"
/>`;
    }
  }, [component, dtSearchable, dtPageSize, cbValue, cbAllowCreate, slValue, slShowValue, slUnit, swSize, pwShowStrength, otpLength, dpValue]);

  const resetDefaults = () => {
    setDtSearchable(true); setDtPageSize(3);
    setCbValue('obsidian'); setCbAllowCreate(false);
    setSlValue(64); setSlShowValue(true); setSlUnit('%');
    setSwChecked(true); setSwSize('md');
    setPwShowStrength(true);
    setOtpLength(6);
    setDpValue(null);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-(--text-primary) tracking-tight">
              Heavy Primitives — All Props, Live
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-(--text-secondary)">
              Every prop of the complex components, wired to real state. Copy the JSX when it looks right.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" icon={<RotateCcw className="w-3 h-3" />} onClick={resetDefaults}>
            Reset
          </Button>
          <Button
            variant="secondary"
            size="xs"
            icon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            onClick={copyJSX}
          >
            {copied ? 'Copied!' : 'Copy JSX'}
          </Button>
        </div>
      </div>

      {/* Component selector */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Playground component">
        {COMPONENTS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={component === c.value}
            onClick={() => setComponent(c.value)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-ui99 ${
              component === c.value
                ? 'bg-(--ink-fill) text-(--ink-on-fill) shadow-xs'
                : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-(--text-secondary) hover:bg-state-hover'
            }`}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Props panel */}
        <div className="lg:col-span-4 space-y-3.5" role="tabpanel">
          {component === 'data-table' && (
            <>
              <Switch size="sm" checked={dtSearchable} onChange={setDtSearchable} label="Searchable" />
              <div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-(--text-secondary) block mb-1.5">Page size</span>
                <Segmented
                  value={dtPageSize}
                  onChange={setDtPageSize}
                  options={[3, 5, 7].map((n) => ({ value: n, label: String(n) }))}
                />
              </div>
            </>
          )}
          {component === 'combobox' && (
            <>
              <Switch size="sm" checked={cbAllowCreate} onChange={setCbAllowCreate} label="Allow create option" />
              <div className="text-[11px] text-zinc-500 dark:text-(--text-secondary) leading-relaxed border-t border-black/[0.04] dark:border-white/[0.04] pt-3">
                Type free text and press <kbd className="font-mono px-1 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-[10px]">Enter</kbd> with
                create enabled — the option flows through the same <code className="font-mono">onChange</code>.
              </div>
            </>
          )}
          {component === 'slider' && (
            <>
              <Switch size="sm" checked={slShowValue} onChange={setSlShowValue} label="Show live value" />
              <div>
                <span className="text-xs font-semibold text-zinc-500 dark:text-(--text-secondary) block mb-1.5">Unit</span>
                <Segmented value={slUnit} onChange={setSlUnit} options={[{ value: '%', label: '%' }, { value: 'px', label: 'px' }, { value: 'ms', label: 'ms' }]} />
              </div>
            </>
          )}
          {component === 'switch' && (
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-(--text-secondary) block mb-1.5">Size</span>
              <Segmented value={swSize} onChange={setSwSize} options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]} />
            </div>
          )}
          {component === 'password' && (
            <Switch size="sm" checked={pwShowStrength} onChange={setPwShowStrength} label="Show strength meter" />
          )}
          {component === 'otp' && (
            <div>
              <span className="text-xs font-semibold text-zinc-500 dark:text-(--text-secondary) block mb-1.5">Length</span>
              <Segmented value={otpLength} onChange={setOtpLength} options={[4, 5, 6].map((n) => ({ value: n, label: String(n) }))} />
            </div>
          )}
          {component === 'date-picker' && (
            <div className="text-[11px] text-zinc-500 dark:text-(--text-secondary) leading-relaxed">
              Open the picker, navigate months with the arrows or the keyboard, and select a day. The ISO value streams into the code panel.
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="lg:col-span-8">
          <div
            className={`rounded-2xl border border-black/[0.04] dark:border-white/[0.04] p-5 sm:p-7 flex items-center justify-center min-h-[300px] transition-colors ${
              isDark ? 'bg-(--bg-sunken)' : 'bg-zinc-50'
            }`}
          >
            {component === 'data-table' && (
              <div className="w-full">
                <DataTable<TaskRow>
                  columns={[
                    { key: 'task', header: 'Task', sortable: true },
                    { key: 'owner', header: 'Owner', sortable: true },
                    {
                      key: 'priority',
                      header: 'Priority',
                      sortable: true,
                      render: (row) => (
                        <span className={`text-xs font-semibold font-mono ${PRIORITY_COLORS[row.priority]}`}>
                          {row.priority}
                        </span>
                      ),
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <PriorityBadge priority={row.priority === 'urgent' ? 'urgent' : row.priority === 'high' ? 'high' : row.priority === 'medium' ? 'medium' : 'low'} showLabel={false} />,
                    },
                  ]}
                  data={DEMO_TASKS}
                  pageSize={dtPageSize}
                  searchable={dtSearchable}
                />
              </div>
            )}

            {component === 'combobox' && (
              <div className="w-full max-w-xs">
                <Combobox
                  options={DEMO_OPTIONS}
                  value={cbValue}
                  onChange={setCbValue}
                  allowCreate={cbAllowCreate}
                  placeholder="Select theme…"
                  searchPlaceholder="Search themes…"
                />
                {cbValue && (
                  <p className="mt-3 text-[11px] font-mono text-zinc-500 dark:text-(--text-secondary) text-center">
                    value = "{cbValue}"
                  </p>
                )}
              </div>
            )}

            {component === 'slider' && (
              <div className="w-full max-w-sm">
                <Slider
                  value={slValue}
                  onChange={setSlValue}
                  label={slShowValue ? `Haptic Range — ${slValue}${slUnit}` : 'Haptic Range Calibration'}
                  unit={`${slUnit} `}
                  min={0}
                  max={100}
                />
              </div>
            )}

            {component === 'switch' && (
              <div className="w-full max-w-xs space-y-4">
                <Switch checked={swChecked} onChange={setSwChecked} size={swSize} label="Haptic feedback on gesture" description="Emits a 12ms micro-vibration pulse" />
                <Switch checked={!swChecked} onChange={(v) => setSwChecked(!v)} size={swSize} label="Mirror state" />
              </div>
            )}

            {component === 'password' && (
              <div className="w-full max-w-xs">
                <PasswordInput label="Enterprise Password" showStrength={pwShowStrength} placeholder="••••••••••" />
              </div>
            )}

            {component === 'otp' && (
              <div className="w-full max-w-xs">
                <OTPInput length={otpLength} onComplete={() => {}} />
              </div>
            )}

            {component === 'date-picker' && (
              <div className="w-full max-w-xs">
                <DatePicker value={dpValue ?? undefined} onChange={(v) => setDpValue(v ?? null)} />
                {dpValue && (
                  <p className="mt-3 text-[11px] font-mono text-zinc-500 dark:text-(--text-secondary) text-center">
                    value = "{dpValue}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="w-full">
        <CodePanel code={generatedJSX} />
      </div>
    </div>
  );
}

/* ── Internal mini segmented (numeric/enum generic) ─────────────────── */
function Segmented<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex p-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`h-6 px-2.5 rounded-full text-[11px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-ui99-inset ${
            value === o.value
              ? 'bg-(--ink-fill) text-(--ink-on-fill) shadow-xs'
              : 'text-zinc-600 dark:text-(--text-secondary) hover:text-zinc-900 dark:hover:text-(--text-primary)'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Code panel with copy (mirrors Sandbox code footer) ─────────────── */
function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-2xl bg-zinc-950 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.05] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400/70" />
          <span className="w-2 h-2 rounded-full bg-amber-400/70" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
          <span className="ml-2 text-[10px] font-mono text-zinc-400">Playground.tsx</span>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 text-[11px] leading-relaxed font-mono text-zinc-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
