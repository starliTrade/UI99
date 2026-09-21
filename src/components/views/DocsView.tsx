/**
 * UI \ [99] — Official Documentation & Component Registry Center
 * Engineered with 100% fidelity to shadcn/ui & Linear speed:
 * - Preview / Code tabs
 * - CLI installation with package manager switcher (pnpm, npm, yarn, bun)
 * - Manual installation with copyable code and dependencies
 * - Complete NPM package & registry architecture guide
 * - Props & API reference tables
 * - Velvet Obsidian Dark & Matte Porcelain Light design tokens
 * - 100% English native copy
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Code2,
  Eye,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  ChevronRight,
  Package,
  FileCode,
  Palette,
  Laptop,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FolderGit2,
  Sliders,
  Play,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { REGISTRY_COMPONENTS, ComponentRegistryItem } from '../../registry/registryData';
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
  Avatar,
  Checkbox,
  Switch,
  Input,
  SearchBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LinearIssueTracker,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Kbd,
  UI99BrandLogo,
} from '../ui';

type DocSection =
  | 'intro'
  | 'installation'
  | 'npm-guide'
  | 'theming'
  | 'cli'
  | string; // Component id

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function DocsView() {
  const { themeMode, addToast, setCurrentTab } = useApp();
  const isDark = themeMode === 'dark';

  const [activeSection, setActiveSection] = useState<DocSection>('npm-guide');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [installMethod, setInstallMethod] = useState<'cli' | 'manual'>('cli');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Playground State for Component Previews
  const [demoBtnVariant, setDemoBtnVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'rose'>('primary');
  const [demoBtnSize, setDemoBtnSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');
  const [demoBtnLoading, setDemoBtnLoading] = useState(false);
  const [demoSwitchChecked, setDemoSwitchChecked] = useState(true);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => {
      setCopiedKey(null), 2000;
    }, 2000);
  };

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return REGISTRY_COMPONENTS;
    const q = searchQuery.toLowerCase();
    return REGISTRY_COMPONENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeComponent = REGISTRY_COMPONENTS.find((c) => c.id === activeSection);

  // Generate package manager CLI string
  const getCliCommand = (componentName: string, pm: PackageManager) => {
    switch (pm) {
      case 'pnpm':
        return `pnpm dlx @99/ui add ${componentName}`;
      case 'yarn':
        return `yarn dlx @99/ui add ${componentName}`;
      case 'bun':
        return `bunx --bun @99/ui add ${componentName}`;
      case 'npm':
      default:
        return `npx @99/ui add ${componentName}`;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP HEADER & BREADCRUMBS (shadcn/ui style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.04]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveSection('intro')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Docs
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-400">
            {activeComponent ? 'Components' : 'Getting Started'}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-950 dark:text-white font-semibold capitalize">
            {activeComponent ? activeComponent.title : activeSection.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to UI Kit Preview */}
          <Button
            variant="secondary"
            size="xs"
            icon={<Layers className="w-3.5 h-3.5" />}
            onClick={() => setCurrentTab('UIKIT')}
          >
            Component Suite
          </Button>

          {/* Quick Registry JSON Link */}
          <a
            href="/registry.json"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-colors border border-black/[0.04] dark:border-white/[0.03]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>registry.json</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* MOBILE HORIZONTAL PILL CAROUSEL: Quick Jump to Guides & Components */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 border-b border-black/[0.04] dark:border-white/[0.03]">
        {[
          { id: 'npm-guide', label: 'NPM & Registry' },
          { id: 'intro', label: 'Intro' },
          { id: 'installation', label: 'Install' },
          { id: 'cli', label: 'CLI' },
          { id: 'theming', label: 'Theming' },
          { id: 'button', label: 'Button' },
          { id: 'card', label: 'Card' },
          { id: 'input', label: 'Input' },
          { id: 'badge', label: 'Badge' },
          { id: 'switch', label: 'Switch' },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setActiveTab('preview');
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-black/[0.04] dark:border-white/[0.03]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 2. TWO-COLUMN LAYOUT: SIDEBAR & MAIN DOCS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT STICKY NAVIGATION SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 space-y-6 md:sticky md:top-20">
          {/* Quick Filter */}
          <div className="space-y-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search components & guides..."
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="space-y-6 text-sm">
            {/* GETTING STARTED GROUP */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 px-3">
                Getting Started
              </h4>
              <div className="space-y-0.5">
                {[
                  { id: 'npm-guide', label: 'NPM & Registry Architecture', badge: 'Crucial' },
                  { id: 'intro', label: 'Introduction' },
                  { id: 'installation', label: 'Installation & Setup' },
                  { id: 'cli', label: 'CLI Architecture' },
                  { id: 'theming', label: 'Obsidian Velvet Tokens' },
                ].map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPONENTS GROUP */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3">
                <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                  Components ({filteredComponents.length})
                </h4>
              </div>
              <div className="space-y-0.5 max-h-[460px] overflow-y-auto no-scrollbar">
                {filteredComponents.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        setActiveTab('preview');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.category && (
                        <span className="text-[10px] font-mono opacity-50">
                          {item.category}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DOCUMENTATION CONTENT */}
        <main className="md:col-span-9 space-y-10 min-w-0">
          {/* ======================================================= */}
          {/* CASE A: OFFICIAL NPM & REGISTRY ARCHITECTURE GUIDE      */}
          {/* ======================================================= */}
          {activeSection === 'npm-guide' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Official NPM & shadcn/ui Distribution Blueprint</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Publishing & Distributing UI \ [99] via npm and shadcn Registry
                </h1>
                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Modern frontend ecosystems support two primary distribution patterns for design systems. <strong>UI \ [99]</strong> seamlessly implements both:
                </p>
              </div>

              {/* Comparative Architecture Diagram / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model 1: shadcn/ui Registry Model */}
                <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.03] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    <Terminal className="w-4 h-4" />
                    <span>Pattern 1: Copy-Source Registry (shadcn style)</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    Direct CLI (<code className="text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">npx @99/ui add</code>)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Source code is copied directly into the developer's <code className="text-emerald-500">components/ui/</code> directory. Full code ownership, zero vendor lock-in, and instant CSS variable customization.
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Command: <code className="text-zinc-900 dark:text-zinc-200">npx @99/ui add button</code>
                    </span>
                  </div>
                </div>

                {/* Model 2: Monolithic NPM Package */}
                <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.03] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    <Package className="w-4 h-4" />
                    <span>Pattern 2: Compiled Node Package (<code className="text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">@99/ui</code>)</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    Standard Dependency (<code className="text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">npm i @99/ui</code>)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pre-bundled single package compiled with <code className="text-purple-400">tsup</code>, featuring full TypeScript declarations (<code className="text-xs">.d.ts</code>) and tree-shaking exports.
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Command: <code className="text-zinc-900 dark:text-zinc-200">npm i @99/ui</code>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Implementation Roadmap */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-500" />
                  <span>Step-by-Step Implementation & Publishing Workflow</span>
                </h2>

                <div className="space-y-4">
                  {/* Step 1: components.json */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-400">Step 1: User Project Configuration</span>
                      <Kbd size="xs">components.json</Kbd>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Created in user root to declare CSS paths, Tailwind configuration, and component aliases:
                    </p>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}`}
                    </pre>
                  </div>

                  {/* Step 2: registry.json */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-400">Step 2: Component Registry Manifest</span>
                      <Kbd size="xs">public/registry.json</Kbd>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Hosts the index of components, npm dependencies (Radix, Motion), and file payloads:
                    </p>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "@99/ui",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "dependencies": ["class-variance-authority", "clsx", "tailwind-merge"],
      "files": [{ "path": "ui/button.tsx", "type": "registry:ui" }]
    },
    {
      "name": "linear-issue-tracker",
      "type": "registry:component",
      "dependencies": ["motion", "lucide-react", "@radix-ui/react-dropdown-menu"]
    }
  ]
}`}
                    </pre>
                  </div>

                  {/* Step 3: @99/ui CLI */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-400">Step 3: Official CLI with Commander.js / Clack</span>
                      <Kbd size="xs">npx @99/ui add [component]</Kbd>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Published package on npm with executable <code className="text-xs">bin/index.js</code>:
                    </p>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`#!/usr/bin/env node
import { Command } from "commander";
import prompts from "prompts";

const program = new Command();

program
  .name("@99/ui")
  .description("Add Obsidian Dark velvet UI components to your app")
  .version("1.0.0");

program
  .command("add")
  .argument("[components...]", "the components to add")
  .action(async (components) => {
    // 1. Fetch component spec from https://ui99.design/registry.json
    // 2. Install dependencies (e.g. @radix-ui/react-slot, motion)
    // 3. Write component code into user's components/ui/ folder
    console.log("Success! Added components to components/ui/");
  });

program.parse();`}
                    </pre>
                  </div>

                  {/* Step 4: Publish to NPM as @99/ui */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.05] dark:border-white/[0.03] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-400">Step 4: Bundled NPM Release</span>
                      <Kbd size="xs">npm publish --access public</Kbd>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Production <code className="text-xs">tsup.config.ts</code> configuration for ESM, CJS, and DTS files:
                    </p>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "motion", "lucide-react"],
});`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* CASE B: INTRODUCTION GUIDE                              */}
          {/* ======================================================= */}
          {activeSection === 'intro' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.03]">
                  <span>Documentation</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Introduction to UI \ [99]
                </h1>
                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Re-engineered UI components designed for high-velocity software, built with Radix UI, Motion, and Tailwind CSS.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#0B0C11] border border-black/[0.05] dark:border-white/[0.03] space-y-3">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  This is NOT a traditional black-box component library.
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  It is a collection of re-usable components that you copy and paste into your apps. What does that mean? It means you do not install it as a black-box runtime dependency. You pick the components you need, copy and paste the code into your project, and customize them to your exact product requirements. The code is 100% yours.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  Design Architecture Principles
                </h3>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                  <li><strong>Obsidian Dark Velvet:</strong> Locked to true velvet black <code className="text-zinc-900 dark:text-zinc-200 font-mono">#06070A</code> with specular top rim highlights. Zero unwanted blue tint, zero harsh white blocks.</li>
                  <li><strong>Linear Ergonomics:</strong> J/K keyboard navigation, C hotkey inline composer, micro row popovers, and liquid glass batch docks.</li>
                  <li><strong>Mathematically Nested Radii:</strong> Strict corner radius formula (<code className="text-zinc-900 dark:text-zinc-200 font-mono">Inner = Outer - Padding</code>).</li>
                  <li><strong>Zero-Slop Standard:</strong> Anti-slop certified. No nested cards inside cards, no hairline clutter, and WCAG AAA compliance.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* CASE C: INSTALLATION GUIDE                              */}
          {/* ======================================================= */}
          {activeSection === 'installation' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Installation
                </h1>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  How to install dependencies and structure your project for UI \ [99].
                </p>
              </div>

              {/* Package Manager Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    1. Initialize project with UI \ [99] CLI:
                  </span>
                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] p-1 rounded-xl">
                    {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPackageManager(pm)}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                          packageManager === pm
                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto flex items-center justify-between">
                  <span>
                    {packageManager === 'pnpm' && 'pnpm dlx @99/ui init'}
                    {packageManager === 'npm' && 'npx @99/ui init'}
                    {packageManager === 'yarn' && 'yarn dlx @99/ui init'}
                    {packageManager === 'bun' && 'bunx --bun @99/ui init'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        packageManager === 'pnpm'
                          ? 'pnpm dlx @99/ui init'
                          : packageManager === 'bun'
                          ? 'bunx --bun @99/ui init'
                          : packageManager === 'yarn'
                          ? 'yarn dlx @99/ui init'
                          : 'npx @99/ui init',
                        'install-init'
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'install-init' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Configure utils */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  2. Add cn() helper to <code className="text-emerald-500">src/lib/utils.ts</code>:
                </span>
                <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
                </pre>
              </div>

              {/* Configure Tailwind */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  3. Configure Velvet Obsidian Dark in <code className="text-emerald-500">src/index.css</code>:
                </span>
                <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`@import "tailwindcss";

.dark {
  --bg-canvas: #06070A;
  --bg-card: #0B0C11;
  --border-specular: rgba(255, 255, 255, 0.04);
}`}
                </pre>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* CASE D: COMPONENT DOCUMENTATION PAGE (SHADCN/UI FORMAT) */}
          {/* ======================================================= */}
          {activeComponent && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Component Title & Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {activeComponent.title}
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border border-black/[0.04] dark:border-white/[0.03]">
                    v{activeComponent.version}
                  </span>
                </div>
                <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {activeComponent.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {activeComponent.primitive && (
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-[#131318] text-zinc-700 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04]">
                      Primitive: {activeComponent.primitive}
                    </span>
                  )}
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    WCAG AAA
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Touch 44px
                  </span>
                </div>
              </div>

              {/* PREVIEW VS CODE TABS (shadcn/ui signature feature) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === 'preview'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-xs'
                          : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTab === 'code'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-xs'
                          : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </button>
                  </div>

                  {activeTab === 'code' && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeComponent.codeSnippet, 'component-code')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      {copiedKey === 'component-code' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Component Code</span>
                    </button>
                  )}
                </div>

                {/* TAB CONTENT: PREVIEW */}
                {activeTab === 'preview' && (
                  <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.04] bg-zinc-50/50 dark:bg-[#08090D] overflow-hidden shadow-xs">
                    {/* Interactive Preview Canvas */}
                    <div className="min-h-[260px] p-8 flex items-center justify-center relative overflow-hidden">
                      {/* Subtle canvas background dot grid */}
                      <div className="absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                      {/* Render Active Component Preview */}
                      <div className="relative z-10 w-full max-w-lg flex items-center justify-center">
                        {activeComponent.id === 'button' && (
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button
                              variant={demoBtnVariant}
                              size={demoBtnSize}
                              loading={demoBtnLoading}
                            >
                              Button Demo
                            </Button>
                          </div>
                        )}

                        {activeComponent.id === 'badge' && (
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            <StatusBadge status="in_progress" showLabel={true} />
                            <PriorityBadge priority="urgent" showLabel={true} />
                            <Badge variant="green">Operational</Badge>
                            <Tag variant="purple">UI \ [99]</Tag>
                          </div>
                        )}

                        {activeComponent.id === 'card' && (
                          <Card className="w-full">
                            <CardHeader>
                              <CardTitle>UI \ [99] Velvet Surface</CardTitle>
                              <CardDescription>
                                Mathematically calibrated specular rim highlight.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Zero-slop layout with ambient shadow profile and 24px outer radius.
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button size="xs" variant="secondary">
                                Action
                              </Button>
                            </CardFooter>
                          </Card>
                        )}

                        {activeComponent.id === 'switch' && (
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={demoSwitchChecked}
                              onCheckedChange={setDemoSwitchChecked}
                            />
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              Sub-pixel Specular Rim Highlight ({demoSwitchChecked ? 'Active' : 'Muted'})
                            </span>
                          </div>
                        )}

                        {activeComponent.id === 'dropdown-menu' && (
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
                              <DropdownMenuItem className="text-rose-500">
                                Sign Out
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {activeComponent.id === 'tabs' && (
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="activity">Activity</TabsTrigger>
                              <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="p-4 text-xs text-zinc-500">
                              Overview panel content with velvet spring indicator.
                            </TabsContent>
                            <TabsContent value="activity" className="p-4 text-xs text-zinc-500">
                              Live user activity and event bus metrics.
                            </TabsContent>
                            <TabsContent value="settings" className="p-4 text-xs text-zinc-500">
                              System preferences and token overrides.
                            </TabsContent>
                          </Tabs>
                        )}

                        {activeComponent.id === 'safa-brand-logo' && (
                          <div className="flex flex-col items-center gap-4">
                            <UI99BrandLogo size="lg" />
                            <span className="text-xs font-mono text-zinc-400">
                              Hover to observe velvet dissipation glow
                            </span>
                          </div>
                        )}

                        {activeComponent.id === 'linear-issue-tracker' && (
                          <div className="w-full">
                            <LinearIssueTracker />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Controls Toolbar for Button */}
                    {activeComponent.id === 'button' && (
                      <div className="px-5 py-3 border-t border-black/[0.04] dark:border-white/[0.03] bg-zinc-100/60 dark:bg-white/[0.015] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 font-mono">Variant:</span>
                          {(['primary', 'secondary', 'outline', 'ghost', 'rose'] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setDemoBtnVariant(v)}
                              className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer font-medium ${
                                demoBtnVariant === v
                                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold'
                                  : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400 font-mono">Size:</span>
                            {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setDemoBtnSize(s)}
                                className={`px-2 py-0.5 rounded-lg uppercase cursor-pointer font-mono text-[11px] ${
                                  demoBtnSize === s
                                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold'
                                    : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>

                          <label className="flex items-center gap-1.5 cursor-pointer text-zinc-500">
                            <input
                              type="checkbox"
                              checked={demoBtnLoading}
                              onChange={(e) => setDemoBtnLoading(e.target.checked)}
                              className="rounded"
                            />
                            <span>Loading</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: CODE */}
                {activeTab === 'code' && (
                  <div className="relative rounded-3xl bg-zinc-950 text-zinc-200 border border-black/[0.08] dark:border-white/[0.04] p-5 font-mono text-xs overflow-x-auto max-h-[460px] no-scrollbar">
                    <pre className="leading-relaxed whitespace-pre font-mono">
                      {activeComponent.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {/* INSTALLATION SECTION (CLI vs Manual tabs) */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                  Installation
                </h2>

                {/* CLI vs Manual Switcher */}
                <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.04] pb-2">
                  <button
                    type="button"
                    onClick={() => setInstallMethod('cli')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      installMethod === 'cli'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold'
                        : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>CLI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallMethod('manual')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      installMethod === 'manual'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold'
                        : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Manual</span>
                  </button>
                </div>

                {installMethod === 'cli' ? (
                  <div className="space-y-3">
                    {/* Package manager picker */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Run in your terminal:</span>
                      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] p-1 rounded-xl">
                        {(['pnpm', 'npm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                          <button
                            key={pm}
                            type="button"
                            onClick={() => setPackageManager(pm)}
                            className={`px-2 py-0.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                              packageManager === pm
                                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold'
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                          >
                            {pm}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative rounded-2xl bg-zinc-900 text-zinc-100 p-4 font-mono text-xs flex items-center justify-between">
                      <span>{getCliCommand(activeComponent.name, packageManager)}</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            getCliCommand(activeComponent.name, packageManager),
                            'cli-cmd'
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white cursor-pointer"
                      >
                        {copiedKey === 'cli-cmd' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-xs text-zinc-500">
                      1. Install required primitive packages:
                    </span>
                    <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 text-xs font-mono overflow-x-auto">
                      {`npm i ${activeComponent.dependencies.join(' ')}`}
                    </pre>

                    <span className="text-xs text-zinc-500 pt-2 block">
                      2. Copy component code into{' '}
                      <code className="text-emerald-500">
                        components/ui/{activeComponent.name}.tsx
                      </code>
                    </span>
                  </div>
                )}
              </div>

              {/* USAGE SECTION */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                    Usage
                  </h2>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeComponent.usageSnippet, 'usage-snippet')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'usage-snippet' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy Usage</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed">
                  {activeComponent.usageSnippet}
                </pre>
              </div>

              {/* PROPS DEFINITION TABLE (API Reference) */}
              <div className="space-y-3 pt-4">
                <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                  Props & API Reference
                </h2>
                <div className="rounded-2xl border border-black/[0.05] dark:border-white/[0.03] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.05] dark:border-white/[0.04] bg-zinc-50 dark:bg-white/[0.02]">
                        <th className="p-3 font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                          Prop
                        </th>
                        <th className="p-3 font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                          Type
                        </th>
                        <th className="p-3 font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                          Default
                        </th>
                        <th className="p-3 font-medium text-zinc-700 dark:text-zinc-300">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.03]">
                      {activeComponent.props.map((p) => (
                        <tr key={p.name} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                          <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                            {p.name}
                          </td>
                          <td className="p-3 font-mono text-purple-600 dark:text-purple-400">
                            {p.type}
                          </td>
                          <td className="p-3 font-mono text-zinc-400">
                            {p.default || '-'}
                          </td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-400">
                            {p.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
