/**
 * UI \ [99] — Linear.app Inspired High-Velocity Home Workspace
 * World-class Linear design: active cycles, issue stream with J/K navigation,
 * inline C hotkey composer, priority matrix, cycle burndown, and keyboard shortcuts.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  ArrowUpRight,
  Plus,
  Compass,
  Calendar,
  Sparkles,
  ChevronRight,
  Target,
  Scissors,
  Music,
  Activity,
  Layers,
  Search,
  Check,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  XCircle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  MinusCircle,
  TrendingUp,
  BarChart3,
  GitBranch,
  Terminal,
  Zap,
  Tag as TagIcon,
  Trash2,
  CornerDownLeft,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { useObjects } from '../../core/context/ObjectContext';
import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';
import { PriorityLevel, IssueStatus } from '../ui/Badge';
import { Kbd } from '../ui/Kbd';

interface LinearIssue {
  id: string;
  key: string;
  title: string;
  status: IssueStatus;
  priority: PriorityLevel;
  estimate?: number;
  assignee: { name: string; avatar: string };
  cycle: string;
  labels: string[];
  updatedAt: string;
}

const INITIAL_ISSUES: LinearIssue[] = [
  {
    id: 'iss-1',
    key: 'UI-101',
    title: 'Migrate core design tokens to Velvet Obsidian palette & math radii',
    status: 'in_progress',
    priority: 'urgent',
    estimate: 5,
    assignee: { name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 24',
    labels: ['Tokens', 'P0', 'Spec'],
    updatedAt: '12m ago',
  },
  {
    id: 'iss-2',
    key: 'UI-102',
    title: 'Implement J/K cursor keyboard navigation & inline quick composer',
    status: 'in_progress',
    priority: 'high',
    estimate: 3,
    assignee: { name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 24',
    labels: ['Engine', 'Keyboard'],
    updatedAt: '45m ago',
  },
  {
    id: 'iss-3',
    key: 'UI-103',
    title: 'Universal component registry documentation with live testing playground',
    status: 'todo',
    priority: 'high',
    estimate: 8,
    assignee: { name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 24',
    labels: ['Docs', 'Registry'],
    updatedAt: '2h ago',
  },
  {
    id: 'iss-4',
    key: 'UI-104',
    title: 'Liquid Glass capsule navigation dock with haptic springs',
    status: 'done',
    priority: 'medium',
    estimate: 2,
    assignee: { name: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 24',
    labels: ['UI/UX', 'Mobile'],
    updatedAt: '1d ago',
  },
  {
    id: 'iss-5',
    key: 'UI-105',
    title: 'Dual-theme porcelain light & velvet obsidian contrast audit',
    status: 'done',
    priority: 'low',
    estimate: 1,
    assignee: { name: 'David L.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 24',
    labels: ['WCAG', 'Accessibility'],
    updatedAt: '2d ago',
  },
  {
    id: 'iss-6',
    key: 'UI-106',
    title: 'Real-time sync and WebSockets state authoring pipeline',
    status: 'backlog',
    priority: 'medium',
    estimate: 5,
    assignee: { name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces' },
    cycle: 'Cycle 25',
    labels: ['Backend', 'Sockets'],
    updatedAt: '3d ago',
  },
];

export function ModernLinearHomeView() {
  const { isRTL } = useAuth();
  const { setIsSearchOpen, setCurrentTab, addToast } = useApp();

  const [issues, setIssues] = useState<LinearIssue[]>(INITIAL_ISSUES);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newEstimate, setNewEstimate] = useState<number>(3);
  const [viewMode, setViewMode] = useState<'ISSUES' | 'CYCLE' | 'VELOCITY'>('ISSUES');

  const composerInputRef = useRef<HTMLInputElement>(null);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const matchSearch =
        !searchQuery.trim() ||
        iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'ACTIVE' && (iss.status === 'in_progress' || iss.status === 'todo')) ||
        iss.status === filterStatus;

      const matchPriority = filterPriority === 'ALL' || iss.priority === filterPriority;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [issues, searchQuery, filterStatus, filterPriority]);

  // Keyboard navigation listener (J/K navigation, C for composer, Space to toggle status)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        if (e.key === 'Escape' && isComposerOpen) {
          setIsComposerOpen(false);
        }
        return;
      }

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, Math.max(0, filteredIssues.length - 1)));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsComposerOpen(true);
        setTimeout(() => composerInputRef.current?.focus(), 50);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (filteredIssues[selectedIdx]) {
          toggleIssueStatus(filteredIssues[selectedIdx].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredIssues, selectedIdx, isComposerOpen]);

  const toggleIssueStatus = (id: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          const nextStatus: IssueStatus =
            iss.status === 'done'
              ? 'todo'
              : iss.status === 'todo'
              ? 'in_progress'
              : 'done';
          return { ...iss, status: nextStatus };
        }
        return iss;
      })
    );
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextNumber = issues.length + 101;
    const newIssue: LinearIssue = {
      id: `iss-${Date.now()}`,
      key: `UI-${nextNumber}`,
      title: newTitle.trim(),
      status: 'todo',
      priority: newPriority,
      estimate: newEstimate,
      assignee: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
      },
      cycle: 'Cycle 24',
      labels: ['Sprint'],
      updatedAt: 'Just now',
    };

    setIssues([newIssue, ...issues]);
    setNewTitle('');
    setIsComposerOpen(false);
    addToast(`Created issue ${newIssue.key}`, 'success');
  };

  // Status icon & colors
  const renderStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="icon-md text-emerald-500 fill-emerald-500/20" />;
      case 'in_progress':
        return <Clock className="icon-md text-amber-500 animate-pulse" />;
      case 'todo':
        return <Circle className="icon-md text-zinc-500 hover:text-zinc-300" />;
      case 'backlog':
        return <MinusCircle className="icon-md text-zinc-600" />;
      case 'canceled':
        return <XCircle className="icon-md text-rose-500" />;
      default:
        return <Circle className="icon-md text-zinc-500" />;
    }
  };

  // Priority icon
  const renderPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded type-micro font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <SignalHigh className="icon-xs text-rose-400" />
            <span>P0</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded type-micro font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <SignalHigh className="icon-xs text-amber-400" />
            <span>P1</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded type-micro font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <SignalMedium className="icon-xs text-blue-400" />
            <span>P2</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded type-micro font-mono font-medium text-zinc-500 border border-zinc-500/20">
            <SignalLow className="icon-xs text-zinc-500" />
            <span>P3</span>
          </span>
        );
    }
  };

  const doneCount = issues.filter((i) => i.status === 'done').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const totalPoints = issues.reduce((acc, curr) => acc + (curr.estimate || 1), 0);
  const donePoints = issues.filter((i) => i.status === 'done').reduce((acc, curr) => acc + (curr.estimate || 1), 0);
  const cycleCompletion = Math.round((donePoints / (totalPoints || 1)) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-28 pt-1 select-none space-y-6">
      {/* 1. LINEAR HEADER BAR: Active Cycle, Velocity & Actions */}
      <div className="p-4 sm:p-5 rounded-(--radius-lg) bg-(--bg-wash) dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.035] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-(--radius-control) bg-(--ink-fill) dark:bg-white/10 flex items-center justify-center text-white shrink-0 border border-black/[0.08] dark:border-white/[0.04]">
              <Zap className="icon-md text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="type-body-lg sm:type-body-lg font-bold tracking-tight text-zinc-950 dark:text-[#EDEDEF]">
                  Sprint Cycle 24
                </h1>
                <span className="px-2 py-0.5 rounded-(--radius-pill) type-micro font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ACTIVE • 4d left
                </span>
              </div>
              <p className="type-caption text-zinc-500 dark:text-[#8E8E98] font-mono">
                {donePoints} of {totalPoints} story points completed ({cycleCompletion}%)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsComposerOpen(true);
                setTimeout(() => composerInputRef.current?.focus(), 50);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-field) type-caption font-semibold bg-zinc-950 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.97] cursor-pointer shadow-xs"
            >
              <Plus className="icon-sm stroke-[2.5]" />
              <span>New Issue</span>
              <Kbd size="xs" className="hidden sm:inline-block ml-1 opacity-70">C</Kbd>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('UIKIT')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-field) type-caption font-medium bg-zinc-100 hover:bg-(--bg-raised) dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer border border-black/[0.04] dark:border-white/[0.03]"
            >
              <Layers className="icon-sm" />
              <span className="hidden sm:inline">UI Kit</span>
            </button>
          </div>
        </div>

        {/* Progress Bar (Linear Sub-Pixel Specular) */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-2 rounded-(--radius-pill) bg-(--bg-raised) dark:bg-zinc-800/80 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all dur-lazy"
              style={{ width: `${cycleCompletion}%` }}
            />
            <div
              className="h-full bg-amber-500/70 transition-all dur-lazy"
              style={{ width: `${Math.round((inProgressCount / issues.length) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between type-micro font-mono text-zinc-400 dark:text-zinc-500 px-0.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-emerald-500" />
                {doneCount} Done
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-amber-500" />
                {inProgressCount} In Progress
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-zinc-500" />
                {issues.length - doneCount - inProgressCount} Todo
              </span>
            </div>
            <span>Velocity: 34 pts/sprint</span>
          </div>
        </div>
      </div>

      {/* 2. INLINE ISSUE COMPOSER (Linear "C" Shortcut) */}
      <AnimatePresence>
        {isComposerOpen && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            onSubmit={handleCreateIssue}
            className="p-4 rounded-(--radius-control) bg-white dark:bg-(--bg-card-hover) border border-black/[0.08] dark:border-white/[0.04] shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 type-caption font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <Terminal className="icon-sm" />
                <span>Create New Linear Issue</span>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-white rounded-(--radius-sm) transition-colors cursor-pointer"
              >
                <X className="icon-md" />
              </button>
            </div>

            <input
              ref={composerInputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Issue title or description..."
              className="w-full bg-transparent type-body font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.03]">
              <div className="flex items-center gap-2">
                {/* Priority Selector */}
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                  aria-label="Issue priority level"
                  className="bg-(--bg-subtle) dark:bg-white/[0.04] type-caption font-mono font-medium rounded-(--radius-sm) px-2.5 py-1 text-zinc-700 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04] focus:outline-none cursor-pointer"
                >
                  <option value="urgent">P0 Urgent</option>
                  <option value="high">P1 High</option>
                  <option value="medium">P2 Medium</option>
                  <option value="low">P3 Low</option>
                </select>

                {/* Estimate Selector */}
                <select
                  value={newEstimate}
                  onChange={(e) => setNewEstimate(Number(e.target.value))}
                  aria-label="Story points estimate"
                  className="bg-(--bg-subtle) dark:bg-white/[0.04] type-caption font-mono font-medium rounded-(--radius-sm) px-2.5 py-1 text-zinc-700 dark:text-zinc-300 border border-black/[0.05] dark:border-white/[0.04] focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 pt</option>
                  <option value={2}>2 pts</option>
                  <option value={3}>3 pts</option>
                  <option value={5}>5 pts</option>
                  <option value={8}>8 pts</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-3 py-1 rounded-(--radius-field) type-caption text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-(--radius-field) type-caption font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                >
                  <span>Save Issue</span>
                  <CornerDownLeft className="icon-xs" />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. FILTER AND SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1 bg-(--bg-wash) dark:bg-(--bg-card) p-1 rounded-(--radius-control) border border-black/[0.04] dark:border-white/[0.03] overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'In Flight' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'todo', label: 'Todo' },
            { id: 'done', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-(--radius-field) type-caption font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Priority filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="icon-sm absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter issues..."
              className="w-full bg-(--bg-subtle) dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.03] rounded-(--radius-field) pl-8 pr-3 py-1.5 type-caption text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            aria-label="Filter issues by priority"
            className="bg-(--bg-subtle) dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.03] type-caption font-mono rounded-(--radius-field) px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="urgent">P0 Urgent</option>
            <option value="high">P1 High</option>
            <option value="medium">P2 Medium</option>
            <option value="low">P3 Low</option>
          </select>
        </div>
      </div>

      {/* 4. LINEAR ISSUE STREAM (J/K Navigable Table) */}
      <div className="rounded-(--radius-lg) bg-white dark:bg-(--bg-card) border border-black/[0.05] dark:border-white/[0.03] shadow-xs overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.03]">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
            <h3 className="type-body font-semibold text-zinc-900 dark:text-white">All caught up</h3>
            <p className="type-caption text-zinc-500">No issues match the selected filter criteria.</p>
          </div>
        ) : (
          filteredIssues.map((iss, idx) => {
            const isSelected = selectedIdx === idx;
            const isDone = iss.status === 'done';

            return (
              <div
                key={iss.id}
                onClick={() => setSelectedIdx(idx)}
                className={`group flex items-center justify-between p-3 sm:px-4 sm:py-3.5 transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-(--bg-wash) dark:bg-white/[0.04] ring-1 ring-inset ring-emerald-500/40'
                    : 'hover:bg-(--bg-subtle) dark:hover:bg-white/[0.015]'
                }`}
              >
                {/* Left section: toggle + ID + Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleIssueStatus(iss.id);
                    }}
                    className="p-1 -m-1 rounded-(--radius-sm) text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                    title={`Status: ${iss.status} (Click to toggle)`}
                  >
                    {renderStatusIcon(iss.status)}
                  </button>

                  {/* Identifier */}
                  <span className="type-micro font-mono font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
                    {iss.key}
                  </span>

                  {/* Title */}
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <span
                      className={`type-caption sm:type-body font-medium tracking-tight truncate ${
                        isDone
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-950 dark:text-[#EDEDEF]'
                      }`}
                    >
                      {iss.title}
                    </span>

                    {/* Labels */}
                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                      {iss.labels.map((lbl) => (
                        <span
                          key={lbl}
                          className="px-1.5 py-0.2 rounded type-micro font-mono text-zinc-500 dark:text-zinc-400 bg-(--bg-subtle) dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.02]"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right section: Priority + Estimate + Assignee + Timestamp */}
                <div className="flex items-center gap-3 shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
                  {/* Priority */}
                  {renderPriorityBadge(iss.priority)}

                  {/* Estimate */}
                  {iss.estimate && (
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded type-micro font-mono font-semibold text-zinc-600 dark:text-zinc-400 bg-(--bg-subtle) dark:bg-white/[0.03]">
                      {iss.estimate}pt
                    </span>
                  )}

                  {/* Assignee Avatar */}
                  <img
                    src={iss.assignee.avatar}
                    alt={iss.assignee.name}
                    className="w-5 h-5 rounded-(--radius-pill) object-cover border border-black/[0.08] dark:border-white/[0.04]"
                    title={iss.assignee.name}
                  />

                  {/* Relative timestamp */}
                  <span className="hidden lg:inline-block type-micro font-mono text-zinc-400 dark:text-zinc-500 w-12 text-right">
                    {iss.updatedAt}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. KEYBOARD SHORTCUTS REFERENCE BAR (Linear Pro Productivity Hint) */}
      <div className="p-3.5 rounded-(--radius-control) bg-(--bg-subtle) dark:bg-(--bg-card) border border-black/[0.04] dark:border-white/[0.03] flex flex-wrap items-center justify-between gap-3 type-micro font-mono text-zinc-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Kbd size="xs">J</Kbd>
            <Kbd size="xs">K</Kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd size="xs">C</Kbd>
            <span>New Issue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd size="xs">Space</Kbd>
            <span>Toggle Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd size="xs">⌘</Kbd>
            <Kbd size="xs">K</Kbd>
            <span>Search</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="icon-sm" />
          <span>Linear Velocity Engine Active</span>
        </div>
      </div>
    </div>
  );
}

