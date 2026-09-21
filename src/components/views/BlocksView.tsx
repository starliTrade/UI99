/**
 * UI \ [99] — Production Blocks & Templates
 * Complete interactive modules built on UI \ [99] foundations.
 */

import React, { useState } from 'react';
import {
  LayoutTemplate,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Switch, Tag, PriorityBadge, StatusBadge, Kbd } from '../ui';

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

export function BlocksView() {
  const { themeMode, addToast } = useApp();
  const isDark = themeMode === 'dark';

  const [activeBlock, setActiveBlock] = useState<'linear' | 'analytics' | 'settings'>('linear');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  // Settings mock state
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const copyBlockCode = (blockId: string) => {
    const code = `// Imported from UI \\ [99] Blocks
import { ${blockId === 'linear' ? 'LinearIssueTracker' : 'Card, Button, Switch'} } from '@/components/ui';

export function ${blockId.charAt(0).toUpperCase() + blockId.slice(1)}Block() {
  return (
    // ... Production Block
  );
}`;
    navigator.clipboard.writeText(code);
    setCopiedBlock(blockId);
    addToast('Block code snippet copied', 'success');
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Production Blocks & Templates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Production Blocks & Templates
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Pre-built application modules and views crafted with UI \ [99] design tokens, ready for instant integration into real software.
        </p>
      </div>

      {/* Block Category Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.04]">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.03]">
          <button
            type="button"
            onClick={() => setActiveBlock('linear')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              activeBlock === 'linear'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Linear Issue Workflow
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
            Analytics & Metrics
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
            Security & Preferences
          </button>
        </div>

        <Button
          size="sm"
          variant="secondary"
          icon={copiedBlock === activeBlock ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          onClick={() => copyBlockCode(activeBlock)}
        >
          Copy Block Template
        </Button>
      </div>

      {/* Block 1: Linear Issue Tracker */}
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

      {/* Block 2: Analytics Deck */}
      {activeBlock === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardDescription>Total API Invocations</CardDescription>
                <CardTitle className="text-2xl font-mono">1,429,820</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                  <span>+18.4%</span>
                  <span className="text-zinc-400">vs last cycle</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>P99 Latency</CardDescription>
                <CardTitle className="text-2xl font-mono">11.4 ms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                  <span>-2.1 ms</span>
                  <span className="text-zinc-400">speed optimization</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Global Uptime</CardDescription>
                <CardTitle className="text-2xl font-mono">99.99%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>All edge nodes operational</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rolling 30-Day Throughput</CardTitle>
              <CardDescription>Real-time edge performance and response distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-44 w-full rounded-2xl bg-zinc-100 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.03] flex items-end p-4 gap-2">
                {[40, 55, 30, 70, 85, 60, 75, 90, 65, 80, 95, 85, 70, 60, 92].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="flex-1 bg-zinc-300 dark:bg-white/[0.1] hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors rounded-t-sm"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Block 3: Settings Panel */}
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
    </div>
  );
}
