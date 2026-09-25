/**
 * UI99 — All-Props Heavy Playground (Sprint 3 · Phase 4.2 · v2 = 25 components)
 *
 * The TokenSandbox covers Button/Switch/Badge/Slider/Progress. This playground
 * covers EVERY major interactive primitive with live prop controls:
 *   v1 (7): DataTable, Combobox, Slider, Switch, PasswordInput, OTPInput, DatePicker
 *   v2 (+18): Tabs, ToggleGroup, RadioGroup, Dropdown, Checkbox, CheckboxGroup,
 *   RangeSlider, TagInput, NumberField, TimePicker, ColorPicker, Rating,
 *   SegmentedControl, HoverCard, Popover, Dialog, CommandDialog, TreeView,
 *   Stepper, Timeline, AvatarStack, Textarea, IconButton, Menubar.
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
  Clock,
  Palette,
  Star,
  Columns3,
  ListChecks,
  Tags,
  Hash,
  ToggleLeft,
  CircleDot,
  ChevronDown,
  PanelTop,
  MessageSquare,
  FolderTree,
  Route,
  History,
  Users,
  Type,
  SquarePen,
  MousePointerClick,
  PanelLeft,
  TextCursorInput,
} from 'lucide-react';
import {
  DataTable,
  Combobox,
  Slider,
  Switch,
  PasswordInput,
  OTPInput,
  DatePicker,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ToggleGroup,
  ToggleGroupItem,
  RadioGroup,
  RadioGroupItem,
  Label,
  Dropdown,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  TagInput,
  NumberField,
  TimePicker,
  ColorPicker,
  Rating,
  SegmentedControl,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  TreeView,
  Stepper,
  Timeline,
  TimelineItem,
  AvatarStack,
  Textarea,
  IconButton,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  Badge,
  PriorityBadge,
} from './index';
import { useIsDark } from './theme';

type PlaygroundComponent =
  | 'data-table'
  | 'combobox'
  | 'slider'
  | 'switch'
  | 'password'
  | 'otp'
  | 'date-picker'
  | 'time-picker'
  | 'number-field'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio-group'
  | 'toggle-group'
  | 'segmented'
  | 'dropdown'
  | 'tabs'
  | 'range-slider'
  | 'tag-input'
  | 'color-picker'
  | 'rating'
  | 'hover-card'
  | 'popover'
  | 'dialog'
  | 'command'
  | 'tree-view'
  | 'stepper'
  | 'timeline'
  | 'avatar-stack'
  | 'textarea'
  | 'icon-button'
  | 'menubar';

const COMPONENTS: { value: PlaygroundComponent; label: string; icon: React.ReactNode }[] = [
  { value: 'data-table', label: 'DataTable', icon: <Table2 className="icon-md" /> },
  { value: 'combobox', label: 'Combobox', icon: <Layers className="icon-md" /> },
  { value: 'slider', label: 'Slider', icon: <SlidersHorizontal className="icon-md" /> },
  { value: 'switch', label: 'Switch', icon: <ShieldCheck className="icon-md" /> },
  { value: 'password', label: 'PasswordInput', icon: <KeyRound className="icon-md" /> },
  { value: 'otp', label: 'OTPInput', icon: <KeyRound className="icon-md" /> },
  { value: 'date-picker', label: 'DatePicker', icon: <Calendar className="icon-md" /> },
  { value: 'time-picker', label: 'TimePicker', icon: <Clock className="icon-md" /> },
  { value: 'number-field', label: 'NumberField', icon: <Hash className="icon-md" /> },
  { value: 'checkbox', label: 'Checkbox', icon: <Check className="icon-md" /> },
  { value: 'checkbox-group', label: 'CheckboxGroup', icon: <ListChecks className="icon-md" /> },
  { value: 'radio-group', label: 'RadioGroup', icon: <CircleDot className="icon-md" /> },
  { value: 'toggle-group', label: 'ToggleGroup', icon: <ToggleLeft className="icon-md" /> },
  { value: 'segmented', label: 'SegmentedControl', icon: <Columns3 className="icon-md" /> },
  { value: 'dropdown', label: 'Dropdown', icon: <ChevronDown className="icon-md" /> },
  { value: 'tabs', label: 'Tabs', icon: <PanelTop className="icon-md" /> },
  { value: 'range-slider', label: 'RangeSlider', icon: <SlidersHorizontal className="icon-md" /> },
  { value: 'tag-input', label: 'TagInput', icon: <Tags className="icon-md" /> },
  { value: 'color-picker', label: 'ColorPicker', icon: <Palette className="icon-md" /> },
  { value: 'rating', label: 'Rating', icon: <Star className="icon-md" /> },
  { value: 'hover-card', label: 'HoverCard', icon: <MousePointerClick className="icon-md" /> },
  { value: 'popover', label: 'Popover', icon: <MessageSquare className="icon-md" /> },
  { value: 'dialog', label: 'Dialog', icon: <SquarePen className="icon-md" /> },
  { value: 'command', label: 'CommandDialog', icon: <TextCursorInput className="icon-md" /> },
  { value: 'tree-view', label: 'TreeView', icon: <FolderTree className="icon-md" /> },
  { value: 'stepper', label: 'Stepper', icon: <Route className="icon-md" /> },
  { value: 'timeline', label: 'Timeline', icon: <History className="icon-md" /> },
  { value: 'avatar-stack', label: 'AvatarStack', icon: <Users className="icon-md" /> },
  { value: 'textarea', label: 'Textarea', icon: <Type className="icon-md" /> },
  { value: 'icon-button', label: 'IconButton', icon: <MousePointerClick className="icon-md" /> },
  { value: 'menubar', label: 'Menubar', icon: <PanelLeft className="icon-md" /> },
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

const TREE_DATA = [
  {
    id: 'src',
    name: 'src',
    type: 'folder' as const,
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder' as const,
        children: [
          { id: 'button', name: 'Button.tsx', type: 'file' as const, extension: 'tsx' },
          { id: 'dialog', name: 'Dialog.tsx', type: 'file' as const, extension: 'tsx' },
          { id: 'tokens', name: 'tokens.css', type: 'file' as const, extension: 'css' },
        ],
      },
      { id: 'lib', name: 'lib', type: 'folder' as const, children: [{ id: 'utils', name: 'utils.ts', type: 'file' as const, extension: 'ts' }] },
      { id: 'pkg', name: 'package.json', type: 'file' as const, extension: 'json' },
    ],
  },
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
  const [slUnit, setSlUnit] = useState('%');

  // Switch controls
  const [swChecked, setSwChecked] = useState(true);
  const [swSize, setSwSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Password / OTP / Date / Time controls
  const [pwShowStrength, setPwShowStrength] = useState(true);
  const [otpLength, setOtpLength] = useState(6);
  const [dpValue, setDpValue] = useState<string | null>(null);
  const [tpValue, setTpValue] = useState<string | null>('09:41');
  const [tpStep, setTpStep] = useState<5 | 10 | 15 | 30 | 60>(30);

  // NumberField
  const [nfValue, setNfValue] = useState(42);

  // Checkbox / group
  const [ckChecked, setCkChecked] = useState(true);
  const [ckSize, setCkSize] = useState<'sm' | 'md'>('md');
  const [ckgValues, setCkgValues] = useState<string[]>(['emerald', 'amber']);

  // RadioGroup / ToggleGroup / Segmented
  const [rgValue, setRgValue] = useState('velvet');
  const [tgValue, setTgValue] = useState<string[]>(['bold']);
  const [sgValue, setSgValue] = useState<'day' | 'week' | 'month'>('week');

  // Dropdown / Tabs
  const [ddValue, setDdValue] = useState<'urgent' | 'high' | 'normal'>('normal');
  const [tabValue, setTabValue] = useState('preview');

  // RangeSlider / TagInput / ColorPicker / Rating
  const [rsValue, setRsValue] = useState<[number, number]>([24, 72]);
  const [tiTags, setTiTags] = useState<string[]>(['design', 'velvet']);
  const [cpColor, setCpColor] = useState('#10B981');
  const [rtValue, setRtValue] = useState(4);
  const [rtReadOnly, setRtReadOnly] = useState(false);

  // Overlays
  const [dlgOpen, setDlgOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  // TreeView / Stepper / Timeline / Stack
  const [tvSelected, setTvSelected] = useState<string | undefined>('button');
  const [stCurrent, setStCurrent] = useState(1);
  const [asMax, setAsMax] = useState(4);

  // Textarea
  const [taValue, setTaValue] = useState('');

  const copyJSX = () => {
    navigator.clipboard.writeText(generatedJSX);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedJSX = useMemo(() => {
    switch (component) {
      case 'data-table':
        return `import { DataTable } from '@/components/ui';\n\n<DataTable\n  columns={columns}\n  data={tasks}\n  pageSize={${dtPageSize}}\n  searchable={${dtSearchable}}\n/>`;
      case 'combobox':
        return `import { Combobox } from '@/components/ui';\n\n<Combobox\n  options={themeOptions}\n  value={${cbValue ? `"${cbValue}"` : 'null'}}\n  onChange={setTheme}\n  allowCreate={${cbAllowCreate}}\n  placeholder="Select theme…"\n/>`;
      case 'slider':
        return `import { Slider } from '@/components/ui';\n\n<Slider\n  value={${slValue}}\n  onChange={setValue}\n  label="Haptic Range"\n  unit="${slUnit}"\n  min={0}\n  max={100}\n/>`;
      case 'switch':
        return `import { Switch } from '@/components/ui';\n\n<Switch\n  checked={enabled}\n  onChange={setEnabled}\n  size="${swSize}"\n  label="Haptic feedback"\n/>`;
      case 'password':
        return `import { PasswordInput } from '@/components/ui';\n\n<PasswordInput\n  label="Enterprise Password"\n  showStrength={${pwShowStrength}}\n  placeholder="••••••••••"\n/>`;
      case 'otp':
        return `import { OTPInput } from '@/components/ui';\n\n<OTPInput\n  length={${otpLength}}\n  onComplete={(code) => verify(code)}\n/>`;
      case 'date-picker':
        return `import { DatePicker } from '@/components/ui';\n\n<DatePicker\n  value={${dpValue ? `"${dpValue}"` : 'null'}}\n  onChange={setDate}\n  placeholder="Pick a date"\n/>`;
      case 'time-picker':
        return `import { TimePicker } from '@/components/ui';\n\n<TimePicker\n  value={${tpValue ? `"${tpValue}"` : 'null'}}\n  onChange={setTime}\n  step={${tpStep}}\n/>`;
      case 'number-field':
        return `import { NumberField } from '@/components/ui';\n\n<NumberField\n  value={${nfValue}}\n  onChange={setValue}\n  min={0}\n  max={100}\n  step={1}\n  label="Velocity"\n/>`;
      case 'checkbox':
        return `import { Checkbox } from '@/components/ui';\n\n<Checkbox\n  checked={${ckChecked}}\n  onChange={setChecked}\n  size="${ckSize}"\n  label="Ship it"\n/>`;
      case 'checkbox-group':
        return `import { CheckboxGroup } from '@/components/ui';\n\n<CheckboxGroup\n  options={accentOptions}\n  value={[${ckgValues.map((v) => `'${v}'`).join(', ')}]}\n  onChange={setSelected}\n  label="Accents"\n/>`;
      case 'radio-group':
        return `import { RadioGroup, RadioGroupItem, Label } from '@/components/ui';\n\n<RadioGroup value="${rgValue}" onValueChange={setSurface}>\n  <div className="flex items-center gap-2">\n    <RadioGroupItem value="velvet" id="r-velvet" />\n    <Label htmlFor="r-velvet">Velvet Obsidian</Label>\n  </div>\n  <div className="flex items-center gap-2">\n    <RadioGroupItem value="porcelain" id="r-porcelain" />\n    <Label htmlFor="r-porcelain">Matte Porcelain</Label>\n  </div>\n</RadioGroup>`;
      case 'toggle-group':
        return `import { ToggleGroup, ToggleGroupItem } from '@/components/ui';\n\n<ToggleGroup\n  type="multiple"\n  value={[${tgValue.map((v) => `'${v}'`).join(', ')}]}\n  onValueChange={setFormats}\n>\n  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>\n  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>\n  <ToggleGroupItem value="underline">Underline</ToggleGroupItem>\n</ToggleGroup>`;
      case 'segmented':
        return `import { SegmentedControl } from '@/components/ui';\n\n<SegmentedControl\n  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}\n  value="${sgValue}"\n  onChange={setRange}\n/>`;
      case 'dropdown':
        return `import { Dropdown } from '@/components/ui';\n\n<Dropdown\n  options={priorityOptions}\n  value="${ddValue}"\n  onChange={setPriority}\n  label="Priority"\n/>`;
      case 'tabs':
        return `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';\n\n<Tabs value="${tabValue}" onValueChange={setTab}>\n  <TabsList>\n    <TabsTrigger value="preview">Preview</TabsTrigger>\n    <TabsTrigger value="code">Code</TabsTrigger>\n  </TabsList>\n  <TabsContent value="preview">…</TabsContent>\n  <TabsContent value="code">…</TabsContent>\n</Tabs>`;
      case 'range-slider':
        return `import { RangeSlider } from '@/components/ui';\n\n<RangeSlider\n  value={[${rsValue[0]}, ${rsValue[1]}]}\n  onChange={setRange}\n  min={0}\n  max={100}\n  step={1}\n/>`;
      case 'tag-input':
        return `import { TagInput } from '@/components/ui';\n\n<TagInput\n  tags={[${tiTags.map((t) => `'${t}'`).join(', ')}]}\n  onChange={setTags}\n  placeholder="Add tag…"\n  maxTags={6}\n/>`;
      case 'color-picker':
        return `import { ColorPicker } from '@/components/ui';\n\n<ColorPicker\n  value="${cpColor}"\n  onChange={setColor}\n  showAlpha={false}\n  label="Accent"\n/>`;
      case 'rating':
        return `import { Rating } from '@/components/ui';\n\n<Rating\n  value={${rtValue}}\n  onChange={setRating}\n  max={5}\n  size="md"\n  readOnly={${rtReadOnly}}\n/>`;
      case 'hover-card':
        return `import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui';\n\n<HoverCard>\n  <HoverCardTrigger asChild>\n    <button>Hover me</button>\n  </HoverCardTrigger>\n  <HoverCardContent>Velvet context card.</HoverCardContent>\n</HoverCard>`;
      case 'popover':
        return `import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui';\n\n<Popover>\n  <PopoverTrigger asChild>\n    <Button variant="outline">Open popover</Button>\n  </PopoverTrigger>\n  <PopoverContent>Focus-trapped, Esc-dismissed.</PopoverContent>\n</Popover>`;
      case 'dialog':
        return `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';\n\n<Dialog open={${dlgOpen}} onOpenChange={setOpen}>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Delete workspace</DialogTitle>\n      <DialogDescription>This cannot be undone.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>…</DialogFooter>\n  </DialogContent>\n</Dialog>`;
      case 'command':
        return `import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui';\n\n<CommandDialog open={open} onOpenChange={setOpen}>\n  <CommandInput placeholder="Type a command…" />\n  <CommandList>\n    <CommandEmpty>No results.</CommandEmpty>\n    <CommandGroup heading="Actions">\n      <CommandItem>Create project</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</CommandDialog>`;
      case 'tree-view':
        return `import { TreeView } from '@/components/ui';\n\n<TreeView\n  data={fileTree}\n  selectedId={${tvSelected ? `"${tvSelected}"` : 'undefined'}}\n  onSelect={setSelected}\n  label="File tree"\n/>`;
      case 'stepper':
        return `import { Stepper } from '@/components/ui';\n\n<Stepper\n  steps={['Account', 'Workspace', 'Invite', 'Done']}\n  current={${stCurrent}}\n/>`;
      case 'timeline':
        return `import { Timeline, TimelineItem } from '@/components/ui';\n\n<Timeline>\n  <TimelineItem timestamp="09:41" accent="emerald">Deploy succeeded</TimelineItem>\n  <TimelineItem timestamp="09:38" accent="amber">Cache warming</TimelineItem>\n  <TimelineItem timestamp="09:30" accent="rose">Alert resolved</TimelineItem>\n</Timeline>`;
      case 'avatar-stack':
        return `import { AvatarStack } from '@/components/ui';\n\n<AvatarStack\n  names={['Aria', 'Safa', 'Nova', 'Kian', 'Rana']}\n  size="md"\n  max={${asMax}}\n/>`;
      case 'textarea':
        return `import { Textarea } from '@/components/ui';\n\n<Textarea\n  label="Release notes"\n  placeholder="What shipped?"\n  rows={4}\n/>`;
      case 'icon-button':
        return `import { IconButton } from '@/components/ui';\nimport { Plus } from 'lucide-react';\n\n<IconButton icon={<Plus />} variant="primary" size="md" label="Add item" />`;
      case 'menubar':
        return `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui';\n\n<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent>\n      <MenubarItem>New tab</MenubarItem>\n      <MenubarItem>Close window</MenubarItem>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>`;
    }
  }, [component, dtSearchable, dtPageSize, cbValue, cbAllowCreate, slValue, slUnit, swSize, pwShowStrength, otpLength, dpValue, tpValue, tpStep, nfValue, ckChecked, ckSize, ckgValues, rgValue, tgValue, sgValue, ddValue, tabValue, rsValue, tiTags, cpColor, rtValue, rtReadOnly, dlgOpen, tvSelected, stCurrent, asMax]);

  const resetDefaults = () => {
    setDtSearchable(true); setDtPageSize(3);
    setCbValue('obsidian'); setCbAllowCreate(false);
    setSlValue(64); setSlUnit('%');
    setSwChecked(true); setSwSize('md');
    setPwShowStrength(true); setOtpLength(6); setDpValue(null);
    setTpValue('09:41'); setTpStep(30);
    setNfValue(42);
    setCkChecked(true); setCkSize('md'); setCkgValues(['emerald', 'amber']);
    setRgValue('velvet'); setTgValue(['bold']); setSgValue('week');
    setDdValue('normal'); setTabValue('preview');
    setRsValue([24, 72]); setTiTags(['design', 'velvet']);
    setCpColor('#10B981'); setRtValue(4); setRtReadOnly(false);
    setDlgOpen(false); setCmdOpen(false);
    setTvSelected('button'); setStCurrent(1); setAsMax(4);
    setTaValue('');
  };

  return (
    <div className="p-4 sm:p-6 rounded-(--radius-control) sm:rounded-(--radius-lg) bg-white dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.03] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
        <div className="flex items-center gap-2.5">
          <Database className="icon-lg text-emerald-500" />
          <div>
            <h3 className="type-body font-bold text-zinc-950 dark:text-(--text-primary) tracking-tight">
              All-Props Lab — 31 Heavy Primitives, Live
            </h3>
            <p className="type-micro text-(--text-muted) dark:text-(--text-secondary)">
              Every prop of the complex components, wired to real state. Copy the JSX when it looks right.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" icon={<RotateCcw className="icon-xs" />} onClick={resetDefaults}>
            Reset
          </Button>
          <Button
            variant="secondary"
            size="xs"
            icon={copied ? <Check className="icon-xs text-emerald-500" /> : <Copy className="icon-xs" />}
            onClick={copyJSX}
          >
            {copied ? 'Copied!' : 'Copy JSX'}
          </Button>
        </div>
      </div>

      {/* Component selector */}
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 -m-1" role="tablist" aria-label="Playground component">
        {COMPONENTS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={component === c.value}
            onClick={() => setComponent(c.value)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-(--radius-pill) type-caption font-medium transition-all cursor-pointer focus-visible:outline-none focus-ui99 ${
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
                <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Page size</span>
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
              <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed border-t border-black/[0.04] dark:border-white/[0.04] pt-3">
                Type free text and press <kbd className="font-mono px-1 py-0.5 rounded bg-zinc-200 dark:bg-white/10 type-micro">Enter</kbd> with
                create enabled — the option flows through the same <code className="font-mono">onChange</code>.
              </div>
            </>
          )}
          {component === 'slider' && (
            <div>
              <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Unit</span>
              <Segmented value={slUnit} onChange={setSlUnit} options={[{ value: '%', label: '%' }, { value: 'px', label: 'px' }, { value: 'ms', label: 'ms' }]} />
            </div>
          )}
          {component === 'switch' && (
            <div>
              <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Size</span>
              <Segmented value={swSize} onChange={setSwSize} options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]} />
            </div>
          )}
          {component === 'password' && (
            <Switch size="sm" checked={pwShowStrength} onChange={setPwShowStrength} label="Show strength meter" />
          )}
          {component === 'otp' && (
            <div>
              <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Length</span>
              <Segmented value={otpLength} onChange={setOtpLength} options={[4, 5, 6].map((n) => ({ value: n, label: String(n) }))} />
            </div>
          )}
          {component === 'date-picker' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Open the picker, navigate months with the arrows or the keyboard, and select a day. The ISO value streams into the code panel.
            </div>
          )}
          {component === 'time-picker' && (
            <>
              <div>
                <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Step (minutes)</span>
                <Segmented value={tpStep} onChange={setTpStep} options={[5, 15, 30, 60].map((n) => ({ value: n as 5 | 15 | 30 | 60, label: String(n) }))} />
              </div>
              <Button variant="outline" size="xs" onClick={() => setTpValue(null)}>Clear value</Button>
            </>
          )}
          {component === 'number-field' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Arrow keys step the value; the stepper buttons clamp to min/max. Fully keyboard-driven.
            </div>
          )}
          {component === 'checkbox' && (
            <div>
              <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Size</span>
              <Segmented value={ckSize} onChange={setCkSize} options={[{ value: 'sm' as const, label: 'sm' }, { value: 'md' as const, label: 'md' }]} />
            </div>
          )}
          {component === 'checkbox-group' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              The group owns an array — check/uncheck to watch the value stream into the code panel.
            </div>
          )}
          {component === 'radio-group' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Roving tabindex + arrow keys (RTL-aware), exactly per the WAI-ARIA radiogroup pattern.
            </div>
          )}
          {component === 'toggle-group' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Multiple mode — the value is an array. Arrows move focus, Space toggles.
            </div>
          )}
          {component === 'segmented' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Single-select capsule with a spring-analyzed thumb. Try the keyboard too.
            </div>
          )}
          {component === 'dropdown' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Listbox pattern with type-ahead. The selection badge mirrors the value.
            </div>
          )}
          {component === 'tabs' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Roving tabindex on the trigger list; arrow keys move between triggers, Tab enters the panel.
            </div>
          )}
          {component === 'range-slider' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Two-thumb range — each handle is an arrow-key-navigable slider handle with its own aria-valuenow.
            </div>
          )}
          {component === 'tag-input' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Type and press Enter to add, Backspace to remove the last tag. Tag chips are focusable and removable.
            </div>
          )}
          {component === 'color-picker' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Preset swatches + native input fallback. Values stay in the token-adjacent format (#rrggbb).
            </div>
          )}
          {component === 'rating' && (
            <Switch size="sm" checked={rtReadOnly} onChange={setRtReadOnly} label="Read-only" />
          )}
          {component === 'hover-card' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Focus + hover trigger (WCAG 1.4.13 dismissible, hoverable). Keyboard users tab into the trigger.
            </div>
          )}
          {component === 'popover' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Opens on click, traps focus, closes on Esc or outside interaction.
            </div>
          )}
          {component === 'dialog' && (
            <>
              <Button variant="primary" size="sm" onClick={() => setDlgOpen(true)}>Open dialog</Button>
              <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
                Focus trap + Esc + focus restore + aria-modal. Backdrop blur per the overlay spec.
              </div>
            </>
          )}
          {component === 'command' && (
            <>
              <Button variant="primary" size="sm" onClick={() => setCmdOpen(true)}>Open command palette</Button>
              <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
                cmdk under the hood: type-ahead, arrows, Enter, Esc — the ⌘K pattern.
              </div>
            </>
          )}
          {component === 'tree-view' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              aria-selected rows, arrows to navigate, Enter to expand folders.
            </div>
          )}
          {component === 'stepper' && (
            <div className="flex flex-col gap-2">
              <Segmented value={stCurrent} onChange={setStCurrent} options={[0, 1, 2, 3].map((n) => ({ value: n, label: String(n + 1) }))} />
              <div className="type-micro text-(--text-muted) dark:text-(--text-secondary)">current step index</div>
            </div>
          )}
          {component === 'timeline' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Accent dots carry the semantic color; content is an ordered list for screen readers.
            </div>
          )}
          {component === 'avatar-stack' && (
            <>
              <div>
                <span className="type-caption font-semibold text-(--text-muted) dark:text-(--text-secondary) block mb-1.5">Max visible</span>
                <Segmented value={asMax} onChange={setAsMax} options={[3, 4, 5].map((n) => ({ value: n, label: String(n) }))} />
              </div>
              <div className="type-micro text-(--text-muted) dark:text-(--text-secondary)">+1 more → overflow counter</div>
            </>
          )}
          {component === 'textarea' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Label wired via htmlFor, error slot via aria-describedby.
            </div>
          )}
          {component === 'icon-button' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Hit-area proxy keeps the 44px target even when the icon is 16px.
            </div>
          )}
          {component === 'menubar' && (
            <div className="type-micro text-(--text-muted) dark:text-(--text-secondary) leading-relaxed">
              Radix menubar pattern: arrows across menus, roving focus inside.
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="lg:col-span-8">
          <div
            className={`rounded-(--radius-control) border border-black/[0.04] dark:border-white/[0.04] p-5 sm:p-7 flex items-center justify-center min-h-[300px] transition-colors ${
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
                        <span className={`type-caption font-semibold font-mono ${PRIORITY_COLORS[row.priority]}`}>
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
                  <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">
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
                  label={`Haptic Range — ${slValue}${slUnit}`}
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
                  <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">
                    value = "{dpValue}"
                  </p>
                )}
              </div>
            )}

            {component === 'time-picker' && (
              <div className="w-full max-w-xs">
                <TimePicker value={tpValue} onChange={(v) => setTpValue(v ?? null)} step={tpStep} />
                {tpValue && (
                  <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">
                    value = "{tpValue}"
                  </p>
                )}
              </div>
            )}

            {component === 'number-field' && (
              <div className="w-full max-w-xs">
                <NumberField value={nfValue} onChange={setNfValue} min={0} max={100} step={1} label="Velocity" suffix="ops/s" />
              </div>
            )}

            {component === 'checkbox' && (
              <div className="w-full max-w-xs space-y-3">
                <Checkbox checked={ckChecked} onChange={setCkChecked} size={ckSize} label="Ship it" description="Passes all gates" />
                <Checkbox checked={false} onChange={() => {}} size={ckSize} label="Disabled sample" disabled />
              </div>
            )}

            {component === 'checkbox-group' && (
              <div className="w-full max-w-xs">
                <CheckboxGroup
                  options={[
                    { value: 'emerald', label: 'Emerald Signal' },
                    { value: 'amber', label: 'Amber Focus' },
                    { value: 'rose', label: 'Rose Interrupt' },
                  ]}
                  value={ckgValues}
                  onChange={setCkgValues}
                  orientation="vertical"
                />
              </div>
            )}

            {component === 'radio-group' && (
              <RadioGroup value={rgValue} onValueChange={setRgValue} className="w-full max-w-xs gap-3">
                {[
                  { value: 'velvet', label: 'Velvet Obsidian' },
                  { value: 'porcelain', label: 'Matte Porcelain' },
                  { value: 'graphite', label: 'Studio Graphite' },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2.5">
                    <RadioGroupItem value={opt.value} id={`rg-${opt.value}`} />
                    <Label htmlFor={`rg-${opt.value}`} className="type-body cursor-pointer">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {component === 'toggle-group' && (
              <ToggleGroup type="multiple" value={tgValue} onValueChange={setTgValue}>
                <ToggleGroupItem value="bold" aria-label="Bold">Bold</ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic">Italic</ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline">Underline</ToggleGroupItem>
              </ToggleGroup>
            )}

            {component === 'segmented' && (
              <SegmentedControl<'day' | 'week' | 'month'>
                options={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
                value={sgValue}
                onChange={setSgValue}
              />
            )}

            {component === 'dropdown' && (
              <div className="w-full max-w-xs">
                <Dropdown<'urgent' | 'high' | 'normal'>
                  options={[
                    { value: 'urgent', label: 'Urgent', description: 'Drop everything' },
                    { value: 'high', label: 'High', description: 'This sprint' },
                    { value: 'normal', label: 'Normal', description: 'Normal cadence' },
                  ]}
                  value={ddValue}
                  onChange={setDdValue}
                  label="Priority"
                />
                <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">value = "{ddValue}"</p>
              </div>
            )}

            {component === 'tabs' && (
              <div className="w-full max-w-md">
                <Tabs value={tabValue} onValueChange={setTabValue}>
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <div className="p-4 rounded-(--radius-field) bg-(--bg-card) border border-(--border-hairline) type-caption text-(--text-secondary)">
                      Preview panel — keyboard-roving triggers.
                    </div>
                  </TabsContent>
                  <TabsContent value="code">
                    <div className="p-4 rounded-(--radius-field) bg-(--bg-card) border border-(--border-hairline) type-caption text-(--text-secondary)">
                      Code panel.
                    </div>
                  </TabsContent>
                  <TabsContent value="logs">
                    <div className="p-4 rounded-(--radius-field) bg-(--bg-card) border border-(--border-hairline) type-caption text-(--text-secondary)">
                      Logs panel.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {component === 'range-slider' && (
              <div className="w-full max-w-sm">
                <RangeSlider value={rsValue} onChange={setRsValue} min={0} max={100} step={1} />
                <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">
                  [{rsValue[0]}, {rsValue[1]}]
                </p>
              </div>
            )}

            {component === 'tag-input' && (
              <div className="w-full max-w-sm">
                <TagInput tags={tiTags} onChange={setTiTags} placeholder="Add tag…" maxTags={6} label="Tags" />
              </div>
            )}

            {component === 'color-picker' && (
              <div className="w-full max-w-sm">
                <ColorPicker value={cpColor} onChange={setCpColor} label="Accent" />
                <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">value = "{cpColor}"</p>
              </div>
            )}

            {component === 'rating' && (
              <div className="w-full max-w-xs">
                <Rating value={rtValue} onChange={rtReadOnly ? undefined : setRtValue} max={5} size="lg" readOnly={rtReadOnly} />
                <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">value = {rtValue}</p>
              </div>
            )}

            {component === 'hover-card' && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-(--radius-field) type-body font-medium bg-zinc-100 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.05] cursor-pointer hover:bg-state-hover focus-visible:outline-none focus-ui99"
                  >
                    Hover / focus me
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge>UI99</Badge>
                      <span className="type-caption font-semibold text-zinc-950 dark:text-(--text-primary)">Velvet context</span>
                    </div>
                    <p className="type-micro text-(--text-muted) dark:text-(--text-secondary)">
                      Dismissible, hoverable per WCAG 1.4.13 — pointer can travel into the card.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}

            {component === 'popover' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <p className="type-caption text-zinc-700 dark:text-(--text-secondary)">
                    Focus-trapped velvet popover. Esc or outside click dismisses.
                  </p>
                </PopoverContent>
              </Popover>
            )}

            {component === 'dialog' && (
              <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">Alternate trigger</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete workspace?</DialogTitle>
                    <DialogDescription>
                      This permanently removes the workspace and all objects inside it. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={() => setDlgOpen(false)}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDlgOpen(false)}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {component === 'command' && (
              <>
                <Button variant="primary" size="sm" onClick={() => setCmdOpen(true)}>Open ⌘K palette</Button>
                <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
                  <CommandInput placeholder="Type a command or search…" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Actions">
                      <CommandItem>Create project</CommandItem>
                      <CommandItem>Invite teammate</CommandItem>
                      <CommandItem>Toggle theme</CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Navigate">
                      <CommandItem>Go to Docs</CommandItem>
                      <CommandItem>Open UI Kit</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}

            {component === 'tree-view' && (
              <div className="w-full max-w-sm type-body">
                <TreeView data={TREE_DATA} selectedId={tvSelected} onSelect={(node) => setTvSelected(node.id)} label="File tree" />
              </div>
            )}

            {component === 'stepper' && (
              <div className="w-full max-w-md">
                <Stepper steps={['Account', 'Workspace', 'Invite', 'Done']} current={stCurrent} />
              </div>
            )}

            {component === 'timeline' && (
              <div className="w-full max-w-sm type-body">
                <Timeline>
                  <TimelineItem timestamp="09:41" accent="emerald">
                    Deploy succeeded — 92 components
                  </TimelineItem>
                  <TimelineItem timestamp="09:38" accent="amber">
                    Cache warming in progress
                  </TimelineItem>
                  <TimelineItem timestamp="09:30" accent="rose">
                    Alert resolved by Noor
                  </TimelineItem>
                </Timeline>
              </div>
            )}

            {component === 'avatar-stack' && (
              <div>
                <AvatarStack names={['Aria', 'Safa', 'Nova', 'Kian', 'Rana']} size="md" max={asMax} />
                <p className="mt-3 type-micro font-mono text-(--text-muted) dark:text-(--text-secondary) text-center">max = {asMax}</p>
              </div>
            )}

            {component === 'textarea' && (
              <div className="w-full max-w-sm">
                <Textarea
                  label="Release notes"
                  placeholder="What shipped?"
                  rows={4}
                  value={taValue}
                  onChange={(e) => setTaValue(e.target.value)}
                />
              </div>
            )}

            {component === 'icon-button' && (
              <div className="flex items-center gap-3">
                <IconButton icon={<Check className="icon-md" />} variant="primary" size="md" label="Confirm" />
                <IconButton icon={<Copy className="icon-md" />} variant="outline" size="md" label="Duplicate" />
                <IconButton icon={<RotateCcw className="icon-md" />} variant="ghost" size="md" label="Reset" />
                <IconButton icon={<Check className="icon-md" />} variant="ghost" size="md" label="Locked" disabled />
              </div>
            )}

            {component === 'menubar' && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>New tab</MenubarItem>
                    <MenubarItem>Close window</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
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
    <div className="inline-flex p-0.5 rounded-(--radius-pill) bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`h-6 px-2.5 rounded-(--radius-pill) type-micro font-medium transition-all cursor-pointer focus-visible:outline-none focus-ui99-inset ${
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
    <div className="relative rounded-(--radius-control) bg-zinc-950 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.05] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="icon-dot rounded-(--radius-pill) bg-rose-400/70" />
          <span className="icon-dot rounded-(--radius-pill) bg-amber-400/70" />
          <span className="icon-dot rounded-(--radius-pill) bg-emerald-400/70" />
          <span className="ml-2 type-micro font-mono text-(--text-secondary)">Playground.tsx</span>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1 type-micro font-mono text-(--text-secondary) hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="icon-xs text-emerald-400" /> : <Copy className="icon-xs" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 type-micro leading-relaxed font-mono text-zinc-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
