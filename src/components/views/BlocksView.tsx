/**
 * UI \ [99] — Production Blocks & Templates (Phase 5)
 * Complete, copy-paste ready application modules engineered with UI \ [99] primitives.
 */

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  Code2,
  Terminal,
  Shield,
  CreditCard,
  Kanban,
  Settings,
  Sparkles,
  ArrowRight,
  Github,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { KIT_COMPONENT_COUNT } from '../../generated/kit-count';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Switch,
  Tag,
  PriorityBadge,
  StatusBadge,
  Kbd,
  CodeBlock,
  Input,
  PasswordInput,
  Badge,
  SegmentedControl,
  Sparkline,
  DonutRing,
  TrendDelta,
  MeterBar,
  StatTile,
} from '../ui';

// ── BLOCK 1: LINEAR ISSUE WORKFLOW ──
function LinearIssueTrackerBlock() {
  const issues = [
    {
      id: '99-101',
      title: 'Implement sub-pixel specular highlight on card rims',
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      tag: 'UI Engine',
      assignee: 'Sarah C.',
    },
    {
      id: '99-102',
      title: 'Add haptic spring physics to segmented control',
      priority: 'high' as const,
      status: 'todo' as const,
      tag: 'Animation',
      assignee: 'Alex M.',
    },
    {
      id: '99-103',
      title: 'Audit WCAG AAA contrast ratio across obsidian dark canvas',
      priority: 'medium' as const,
      status: 'done' as const,
      tag: 'Accessibility',
      assignee: 'Elena R.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-white">Active Cycle 99.1</span>
          <Tag variant="purple">3 Issues</Tag>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>Keyboard:</span>
          <Kbd size="xs">J</Kbd>
          <Kbd size="xs">K</Kbd>
          <Kbd size="xs">C</Kbd>
        </div>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#131318] border border-black/[0.05] dark:border-white/[0.035] flex items-center justify-between gap-4 hover:border-black/20 dark:hover:border-white/10 transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <PriorityBadge priority={issue.priority} size="sm" showLabel={false} />
              <span className="text-xs font-mono text-zinc-400">{issue.id}</span>
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200 truncate">
                {issue.title}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Tag variant="neutral">{issue.tag}</Tag>
              <StatusBadge status={issue.status} showLabel={true} />
              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                {issue.assignee[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BLOCK 2: AUTHENTICATION CARD BLOCK ──
function AuthCardBlock() {
  const [email, setEmail] = useState('developer@linear.app');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-2xl border-white/[0.06] bg-[#0B0C11]">
        <CardHeader className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold">Sign in to UI \ [99]</CardTitle>
          <CardDescription>Enter your workspace credentials to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-center gap-2">
            <Github className="w-4 h-4" />
            Continue with GitHub
          </Button>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06] dark:border-white/[0.05]" />
            </div>
            <span className="relative px-3 bg-white dark:bg-[#0B0C11] text-[11px] font-mono text-zinc-400">
              OR EMAIL
            </span>
          </div>

          <div className="space-y-3">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/20"
              />
              Remember for 30 days
            </label>
            <a href="#forgot" className="text-emerald-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button variant="primary" className="w-full justify-center">
            Sign In with Enterprise SSO
          </Button>
          <p className="text-[11px] text-center text-zinc-500">
            Don't have an account?{' '}
            <span className="text-emerald-400 font-medium cursor-pointer hover:underline">
              Create workspace
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// ── BLOCK 3: PRICING PLANS BLOCK ──
function PricingPlansBlock() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Starter',
      price: billing === 'yearly' ? '$0' : '$0',
      period: 'forever',
      description: 'Ideal for solo developers building modern web apps.',
      features: ['Up to 10 projects', `All ${KIT_COMPONENT_COUNT} UI primitives`, 'Community Discord support', 'MIT License'],
      highlight: false,
      cta: 'Get Started Free',
    },
    {
      name: 'Pro Team',
      price: billing === 'yearly' ? '$29' : '$39',
      period: 'per seat / month',
      description: 'Designed for fast-moving engineering and product teams.',
      features: [
        'Unlimited projects',
        'Full CLI registry access',
        'Private team presets',
        'Priority GitHub support',
        'Figma token sync',
      ],
      highlight: true,
      badge: 'MOST POPULAR',
      cta: 'Start 14-Day Free Trial',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'annual billing',
      description: 'Dedicated infrastructure, custom tokens, and SLAs.',
      features: [
        'Custom design audit',
        '99.99% Uptime SLA',
        'SOC2 Type II compliance',
        'Dedicated Slack channel',
        'Custom component builder',
      ],
      highlight: false,
      cta: 'Contact Sales',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Predictable, transparent plans.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
          Start for free, scale with precision. Upgrade anytime with seamless license rollover.
        </p>
        <div className="pt-2">
          <SegmentedControl
            options={[
              { label: 'Monthly Billing', value: 'monthly' },
              { label: 'Yearly (Save 25%)', value: 'yearly' },
            ]}
            value={billing}
            onChange={(val) => setBilling(val as any)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col justify-between ${
              plan.highlight
                ? 'border-emerald-500/30 bg-[#0E0E14] shadow-[0_20px_48px_-12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                : 'bg-[#0B0C11]'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-black shadow-sm">
                  {plan.badge}
                </span>
              </div>
            )}
            <div>
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="text-xs">{plan.description}</CardDescription>
                <div className="pt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-950 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 pt-2 border-t border-black/[0.05] dark:border-white/[0.04]">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
            <CardFooter className="pt-4">
              <Button
                variant={plan.highlight ? 'primary' : 'outline'}
                className="w-full justify-center"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── MAIN BLOCKS VIEW COMPONENT ──
export function BlocksView() {
  const [activeBlock, setActiveBlock] = useState<'linear' | 'analytics' | 'settings' | 'auth' | 'pricing'>('linear');
  const [blockTab, setBlockTab] = useState<'preview' | 'code'>('preview');

  // Settings mock state
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const blockCodeSnippets: Record<string, string> = {
    linear: `import React from 'react';
import { PriorityBadge, StatusBadge, Tag, Kbd } from '@99/ui';

export function LinearIssueTrackerBlock() {
  const issues = [
    { id: '99-101', title: 'Implement specular highlight', priority: 'urgent', status: 'in_progress', tag: 'UI Engine', assignee: 'Sarah C.' },
    { id: '99-102', title: 'Add haptic spring physics', priority: 'high', status: 'todo', tag: 'Animation', assignee: 'Alex M.' },
    { id: '99-103', title: 'Audit WCAG AAA contrast ratio', priority: 'medium', status: 'done', tag: 'Accessibility', assignee: 'Elena R.' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">Active Cycle 99.1</span>
          <Tag variant="purple">3 Issues</Tag>
        </div>
      </div>
      <div className="space-y-2">
        {issues.map((issue) => (
          <div key={issue.id} className="p-3.5 rounded-2xl bg-[#131318] border border-white/[0.035] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PriorityBadge priority={issue.priority as any} size="sm" showLabel={false} />
              <span className="text-xs font-mono text-zinc-400">{issue.id}</span>
              <span className="text-xs font-medium text-zinc-200 truncate">{issue.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag variant="neutral">{issue.tag}</Tag>
              <StatusBadge status={issue.status as any} showLabel={true} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    auth: `import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, PasswordInput } from '@99/ui';
import { Github, Lock } from 'lucide-react';

export function AuthCardBlock() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-white/[0.06] bg-[#0B0C11]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Sign in to Workspace</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-center gap-2">
          <Github className="w-4 h-4" /> Continue with GitHub
        </Button>
        <Input label="Work Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full justify-center">Sign In</Button>
      </CardFooter>
    </Card>
  );
}`,
    pricing: `import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, SegmentedControl } from '@99/ui';
import { Check } from 'lucide-react';

const plans = [
  { name: 'Starter',  price: { monthly: '$0',  yearly: '$0'  }, period: 'forever',
    description: 'Ideal for solo developers building modern web apps.',
    features: ['Up to 10 projects', 'All 92 UI primitives', 'Community support'], cta: 'Get Started Free' },
  { name: 'Pro Team', price: { monthly: '$39', yearly: '$29' }, period: 'per seat / month', highlight: true, badge: 'MOST POPULAR',
    description: 'Designed for fast-moving engineering and product teams.',
    features: ['Unlimited projects', 'Full CLI registry access', 'Private team presets', 'Figma token sync'], cta: 'Start 14-Day Free Trial' },
  { name: 'Enterprise', price: { monthly: 'Custom', yearly: 'Custom' }, period: 'annual billing',
    description: 'Dedicated infrastructure, custom tokens, and SLAs.',
    features: ['Custom design audit', '99.99% Uptime SLA', 'SOC2 Type II compliance'], cta: 'Contact Sales' },
];

export function PricingPlansBlock() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="space-y-8">
      <SegmentedControl
        options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly (Save 25%)', value: 'yearly' }]}
        value={billing}
        onChange={setBilling}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.highlight ? 'ring-1 ring-emerald-500/20' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-mono font-bold">{plan.price[billing]}</span>
                <span className="text-xs font-mono text-zinc-500">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> <span>{f}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant={plan.highlight ? 'primary' : 'outline'} className="w-full">{plan.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
    analytics: `import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatTile, TrendDelta, Sparkline, DonutRing, MeterBar } from '@99/ui';

export function AnalyticsMetricsBlock() {
  const invocations = [12, 18, 14, 22, 30, 26, 34, 41, 38, 45, 52, 49, 58, 64];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="API Invocations" value="1,429,820" delta={18.4} />
        <StatTile label="P99 Latency" value="11.4 ms" delta={-2.1} deltaSuffix=" ms" />
        <StatTile label="Global Uptime" value="99.99%" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rolling 30-Day Throughput</CardTitle>
          <CardDescription>Requests per minute, edge regions aggregated.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Sparkline data={invocations} color="emerald" width={320} height={64} />
          <DonutRing segments={[{ value: 92, color: 'emerald' }, { value: 8, color: 'neutral' }]} size={96} label="92%" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Plan limits across edge regions.</CardDescription>
        </CardHeader>
        <CardContent>
          <MeterBar value={72} label="Resource allocation — 72% of plan limits" showValue />
          <TrendDelta delta={24.8} />
        </CardContent>
      </Card>
    </div>
  );
}`,
    settings: `import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Switch } from '@99/ui';

export function SecuritySettingsBlock() {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Security & Access Control</CardTitle>
        <CardDescription>Two-factor authentication settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Two-Factor Auth (2FA)</span>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>
      </CardContent>
    </Card>
  );
}`,
  };

  return (
    <div className="w-full space-y-8 pb-16">
      {/* PAGE HEADER */}
      <header className="pb-2 space-y-3">
        <div className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-mono bg-zinc-100 dark:bg-[#0E0E14] text-zinc-600 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04]">
          {KIT_COMPONENT_COUNT} components · WCAG-verified · MIT
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.05] text-balance">
          Production Blocks.
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-[#92929B] max-w-xl leading-relaxed">
          Real application modules assembled from UI \ [99] primitives — study the pattern, then copy the code directly.
        </p>
      </header>

      {/* Block Category Navigation & Preview/Code Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.04]">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.03]">
          <button
            type="button"
            onClick={() => setActiveBlock('linear')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'linear'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Linear Issue Tracker
          </button>
          <button
            type="button"
            onClick={() => setActiveBlock('auth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'auth'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Auth & Login Card
          </button>
          <button
            type="button"
            onClick={() => setActiveBlock('pricing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'pricing'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Pricing Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveBlock('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'analytics'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Analytics & Deck
          </button>
          <button
            type="button"
            onClick={() => setActiveBlock('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'settings'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Security Preferences
          </button>
        </div>

        {/* Preview / Code Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.03]">
          <button
            type="button"
            onClick={() => setBlockTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              blockTab === 'preview'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setBlockTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              blockTab === 'code'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* RENDER CONTENT: PREVIEW OR CODE */}
      {blockTab === 'code' ? (
        <div className="w-full">
          <CodeBlock
            code={blockCodeSnippets[activeBlock] || '// Code snippet loading...'}
            language="tsx"
            filename={`${activeBlock.charAt(0).toUpperCase() + activeBlock.slice(1)}Block.tsx`}
            showLineNumbers
            maxHeight="520px"
          />
        </div>
      ) : (
        <>
          {activeBlock === 'linear' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono">Block: LinearIssueTracker.tsx</span>
                <span className="flex items-center gap-1 text-emerald-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Interactive Workflow Module</span>
                </span>
              </div>
              <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.035] bg-zinc-50 dark:bg-[#0B0C11] p-6 shadow-sm">
                <LinearIssueTrackerBlock />
              </div>
            </div>
          )}

          {activeBlock === 'auth' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono">Block: AuthCard.tsx</span>
                <span className="flex items-center gap-1 text-emerald-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SSO & Credentials Card</span>
                </span>
              </div>
              <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.035] bg-zinc-50 dark:bg-[#06070A] p-6 sm:p-12 shadow-sm">
                <AuthCardBlock />
              </div>
            </div>
          )}

          {activeBlock === 'pricing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono">Block: PricingMatrix.tsx</span>
                <span className="flex items-center gap-1 text-emerald-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tiered Pricing Table</span>
                </span>
              </div>
              <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.035] bg-zinc-50 dark:bg-[#06070A] p-6 sm:p-8 shadow-sm">
                <PricingPlansBlock />
              </div>
            </div>
          )}

          {activeBlock === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatTile label="API Invocations" value="1,429,820" delta={18.4} size="md" />
                <StatTile label="P99 Latency" value="11.4 ms" delta={2.1} deltaSuffix=" ms faster" size="md" />
                <StatTile label="Global Uptime" value="99.99%" size="md" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Rolling 30-Day Throughput</CardTitle>
                  <CardDescription>Real-time edge performance — requests per minute, regions aggregated.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 w-full min-w-0">
                      <Sparkline data={[12, 18, 14, 22, 30, 26, 34, 41, 38, 45, 52, 49, 58, 64]} color="emerald" height={72} />
                    </div>
                    <DonutRing segments={[{ value: 92, color: 'emerald' }, { value: 8, color: 'neutral' }]} size={104} label="92%" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                  <CardDescription>Plan limits across edge regions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MeterBar value={72} label="Resource allocation — 72% of plan limits" showValue size="md" />
                  <div className="flex items-center gap-2">
                    <TrendDelta delta={24.8} />
                    <span className="text-xs text-zinc-500">throughput vs last cycle</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeBlock === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Access Control</CardTitle>
                  <CardDescription>Two-factor authentication and security notification settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        Two-Factor Authentication (2FA)
                      </div>
                      <div className="text-xs text-zinc-500">
                        Require verification code from authenticator app on new logins
                      </div>
                    </div>
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        Unrecognized Device Alerts
                      </div>
                      <div className="text-xs text-zinc-500">
                        Dispatch immediate notification when login occurs from new IP
                      </div>
                    </div>
                    <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        Public Registry Profile
                      </div>
                      <div className="text-xs text-zinc-500">
                        Allow community developers to discover your shared components
                      </div>
                    </div>
                    <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="primary">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
