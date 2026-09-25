/**
 * UI99 — Linear-Grade Issue Tracker & Workflow Engine (Build 02.2)
 *
 * Implements high-velocity Linear.app interactive patterns:
 * 1. J / K / Arrow Up / Arrow Down keyboard navigation with active cursor ring.
 * 2. C hotkey for instant inline issue composition.
 * 3. Space hotkey to toggle completion, X to toggle batch selection.
 * 4. Interactive Radix DropdownMenu on every row to change Status and Priority on the fly.
 * 5. Floating Liquid Glass Batch Action Bar for multi-selected operations.
 * 6. View tabs, instant search filtering, and responsive mobile-first touch ergonomics.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Plus,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  Layers,
  Tag as TagIcon,
  User,
  Calendar,
  AlertCircle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  MinusCircle,
  Clock,
  Circle,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { useIsDark } from './theme';
import { Button } from './Button';
import { SearchBar } from './Input';
import { Checkbox } from './Checkbox';
import { Tag } from './Button';
import { Avatar } from './Button';
import { Kbd } from './Kbd';
import { PriorityBadge, StatusBadge, PriorityLevel, IssueStatus } from './Badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './DropdownMenu';

export interface IssueItem {
  id: string;
  code: string;
  title: string;
  status: IssueStatus;
  priority: PriorityLevel;
  label: string;
  labelColor: 'neutral' | 'amber' | 'purple' | 'green' | 'red' | 'rose' | 'blue';
  assignee: string;
  date: string;
  completed?: boolean;
}

const DEFAULT_ISSUES: IssueItem[] = [
  {
    id: '1',
    code: 'SAF-101',
    title: 'Design liquid-glass floating dock with sub-pixel rim highlights',
    status: 'done',
    priority: 'high',
    label: 'Design System',
    labelColor: 'purple',
    assignee: 'UI99',
    date: 'Today',
    completed: true,
  },
  {
    id: '2',
    code: 'SAF-102',
    title: 'Implement Linear keyboard hotkey engine (J/K, X, Space, C)',
    status: 'in_progress',
    priority: 'urgent',
    label: 'Interaction',
    labelColor: 'red',
    assignee: 'Core Agent',
    date: 'In 1h',
    completed: false,
  },
  {
    id: '3',
    code: 'SAF-103',
    title: 'Calibrate WCAG AAA contrast ratio & anti-slop brightness limits',
    status: 'todo',
    priority: 'medium',
    label: 'Color Science',
    labelColor: 'green',
    assignee: 'Elena Rostova',
    date: 'Tomorrow',
    completed: false,
  },
  {
    id: '4',
    code: 'SAF-104',
    title: 'Build concentric corner radius nesting formula simulator',
    status: 'todo',
    priority: 'high',
    label: 'Geometry',
    labelColor: 'blue',
    assignee: 'Tariq Al-Mansoor',
    date: 'Sep 24',
    completed: false,
  },
  {
    id: '5',
    code: 'SAF-105',
    title: 'Create bi-directional Vazirmatn & Plus Jakarta Sans typography matrix',
    status: 'backlog',
    priority: 'low',
    label: 'Typography',
    labelColor: 'amber',
    assignee: 'Design Lead',
    date: 'Next Week',
    completed: false,
  },
];

export function LinearIssueTracker() {
  const { addToast } = useApp();
  const isDark = useIsDark();

  const [issues, setIssues] = useState<IssueItem[]>(DEFAULT_ISSUES);
  const [activeCursorIndex, setActiveCursorIndex] = useState<number>(0);
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [viewTab, setViewTab] = useState<'ALL' | 'ACTIVE' | 'DONE' | 'URGENT'>('ALL');

  // Inline Fast Creator state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('high');
  const [newStatus, setNewStatus] = useState<IssueStatus>('todo');
  const [newLabel, setNewLabel] = useState('Productivity');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Tab filter
      if (viewTab === 'ACTIVE' && issue.completed) return false;
      if (viewTab === 'DONE' && !issue.completed) return false;
      if (viewTab === 'URGENT' && issue.priority !== 'urgent' && issue.priority !== 'high') return false;

      // Status dropdown filter
      if (statusFilter !== 'all' && issue.status !== statusFilter) return false;

      // Priority dropdown filter
      if (priorityFilter !== 'all' && issue.priority !== priorityFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = issue.code.toLowerCase().includes(q);
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesLabel = issue.label.toLowerCase().includes(q);
        const matchesAssignee = issue.assignee.toLowerCase().includes(q);
        return matchesCode || matchesTitle || matchesLabel || matchesAssignee;
      }

      return true;
    });
  }, [issues, viewTab, statusFilter, priorityFilter, searchQuery]);

  // Focus composer when opened
  useEffect(() => {
    if (isComposerOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isComposerOpen]);

  // Global Keyboard Listener for Linear High-Velocity Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        if (isComposerOpen) {
          setIsComposerOpen(false);
          e.preventDefault();
        } else if (selectedIssueIds.length > 0) {
          setSelectedIssueIds([]);
          e.preventDefault();
        }
        return;
      }

      if (isInputActive) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isComposerOpen) {
          handleCreateIssue();
          e.preventDefault();
        }
        return;
      }

      // 'c' or 'C' opens composer
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsComposerOpen(true);
        return;
      }

      // 'j' or ArrowDown moves cursor down
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveCursorIndex((prev) => Math.min(filteredIssues.length - 1, prev + 1));
        return;
      }

      // 'k' or ArrowUp moves cursor up
      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveCursorIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      // 'x' toggles selection of current issue
      if (e.key === 'x' || e.key === 'X') {
        const current = filteredIssues[activeCursorIndex];
        if (current) {
          e.preventDefault();
          toggleSelectIssue(current.id);
        }
        return;
      }

      // ' ' (Space) toggles completion of current issue
      if (e.key === ' ') {
        const current = filteredIssues[activeCursorIndex];
        if (current) {
          e.preventDefault();
          toggleIssueComplete(current.id);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredIssues, activeCursorIndex, isComposerOpen, selectedIssueIds]);

  const toggleSelectIssue = (id: string) => {
    setSelectedIssueIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIssueIds.length === filteredIssues.length) {
      setSelectedIssueIds([]);
    } else {
      setSelectedIssueIds(filteredIssues.map((i) => i.id));
    }
  };

  const toggleIssueComplete = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const nextCompleted = !i.completed;
          return {
            ...i,
            completed: nextCompleted,
            status: nextCompleted ? 'done' : 'in_progress',
          };
        }
        return i;
      })
    );
  };

  const updateIssueStatus = (id: string, nextStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: nextStatus,
              completed: nextStatus === 'done',
            }
          : i
      )
    );
    addToast(`Issue status changed to ${nextStatus}`, 'success');
  };

  const updateIssuePriority = (id: string, nextPriority: PriorityLevel) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, priority: nextPriority } : i))
    );
    addToast(`Issue priority changed to ${nextPriority}`, 'info');
  };

  // Batch operations
  const handleBatchMarkDone = () => {
    setIssues((prev) =>
      prev.map((i) =>
        selectedIssueIds.includes(i.id) ? { ...i, status: 'done', completed: true } : i
      )
    );
    addToast(`${selectedIssueIds.length} issues marked as Done`, 'success');
    setSelectedIssueIds([]);
  };

  const handleBatchSetPriority = (priority: PriorityLevel) => {
    setIssues((prev) =>
      prev.map((i) =>
        selectedIssueIds.includes(i.id) ? { ...i, priority } : i
      )
    );
    addToast(`Updated priority to ${priority} for ${selectedIssueIds.length} issues`, 'info');
    setSelectedIssueIds([]);
  };

  const handleBatchSetStatus = (status: IssueStatus) => {
    setIssues((prev) =>
      prev.map((i) =>
        selectedIssueIds.includes(i.id)
          ? { ...i, status, completed: status === 'done' }
          : i
      )
    );
    addToast(`Updated status to ${status} for ${selectedIssueIds.length} issues`, 'success');
    setSelectedIssueIds([]);
  };

  const handleBatchDelete = () => {
    setIssues((prev) => prev.filter((i) => !selectedIssueIds.includes(i.id)));
    addToast(`Deleted ${selectedIssueIds.length} issues`, 'rose');
    setSelectedIssueIds([]);
  };

  // Quick Inline Creation
  const handleCreateIssue = () => {
    if (!newTitle.trim()) {
      addToast('Please enter an issue title', 'warning');
      return;
    }

    const nextCode = `SAF-${100 + issues.length + 1}`;
    const newIssue: IssueItem = {
      id: Date.now().toString(),
      code: nextCode,
      title: newTitle.trim(),
      status: newStatus,
      priority: newPriority,
      label: newLabel,
      labelColor: 'purple',
      assignee: 'You',
      date: 'Just now',
      completed: newStatus === 'done',
    };

    setIssues((prev) => [newIssue, ...prev]);
    setNewTitle('');
    setIsComposerOpen(false);
    addToast(`Created ${nextCode}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* 1. WORKFLOW TOOLBAR */}
      <div className="rounded-(--radius-lg) bg-(--bg-card) border border-(--border-hairline) shadow-xs overflow-hidden">
        {/* Top Segment Views & Action Button */}
        <div className="p-4 border-b border-black/[0.05] dark:border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-white/[0.01]">
          {/* View Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['ALL', 'ACTIVE', 'DONE', 'URGENT'] as const).map((tab) => {
              const isActive = viewTab === tab;
              const count = issues.filter((i) => {
                if (tab === 'ACTIVE') return !i.completed;
                if (tab === 'DONE') return i.completed;
                if (tab === 'URGENT') return i.priority === 'urgent' || i.priority === 'high';
                return true;
              }).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setViewTab(tab)}
                  className={`px-3 py-1.5 rounded-(--radius-pill) text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{tab === 'ALL' ? 'All Issues' : tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-(--radius-pill) ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/10'
                        : 'bg-black/[0.05] dark:bg-white/[0.06]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Create Button + Hotkey Guide */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="xs"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsComposerOpen(true)}
            >
              New Issue <Kbd size="xs" className="ml-1">C</Kbd>
            </Button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="px-4 py-3 border-b border-black/[0.05] dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search title, SAF-101, tags..."
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-(--radius-pill) text-xs font-semibold bg-zinc-100 dark:bg-(--bg-elevated) border border-black/[0.05] dark:border-white/[0.04] text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer hover:border-black/20 dark:hover:border-white/10"
                >
                  <Filter className="w-3 h-3 text-zinc-400" />
                  <span className="capitalize">
                    {statusFilter === 'all' ? 'All Statuses' : statusFilter.replace('_', ' ')}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {(['todo', 'in_progress', 'review', 'done', 'backlog', 'canceled'] as IssueStatus[]).map(
                  (st) => (
                    <DropdownMenuItem key={st} onClick={() => setStatusFilter(st)}>
                      <StatusBadge status={st} showLabel={true} />
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-(--radius-pill) text-xs font-semibold bg-zinc-100 dark:bg-(--bg-elevated) border border-black/[0.05] dark:border-white/[0.04] text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer hover:border-black/20 dark:hover:border-white/10"
                >
                  <span className="capitalize">
                    {priorityFilter === 'all' ? 'All Priorities' : priorityFilter}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {(['urgent', 'high', 'medium', 'low', 'none'] as PriorityLevel[]).map((pr) => (
                  <DropdownMenuItem key={pr} onClick={() => setPriorityFilter(pr)}>
                    <PriorityBadge priority={pr} showLabel={true} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 2. INLINE FAST ISSUE COMPOSER (Linear Style) */}
        <AnimatePresence>
          {isComposerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-b border-emerald-500/30 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NEW HIGH-VELOCITY ISSUE</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="p-1 rounded-(--radius-pill) text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  ref={titleInputRef}
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleCreateIssue();
                    }
                  }}
                  placeholder="Issue title (e.g. Calibrate specular rim reflection for cards)..."
                  className="w-full px-3.5 py-2 rounded-(--radius-field) text-sm font-medium bg-(--bg-elevated) border border-black/[0.08] dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-(--text-primary) placeholder:text-zinc-400"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Priority Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-(--radius-sm) text-xs font-medium bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-1.5 cursor-pointer"
                        >
                          <PriorityBadge priority={newPriority} showLabel={true} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {(['urgent', 'high', 'medium', 'low', 'none'] as PriorityLevel[]).map((pr) => (
                          <DropdownMenuItem key={pr} onClick={() => setNewPriority(pr)}>
                            <PriorityBadge priority={pr} showLabel={true} />
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Status Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-(--radius-sm) text-xs font-medium bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-1.5 cursor-pointer"
                        >
                          <StatusBadge status={newStatus} showLabel={true} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {(['todo', 'in_progress', 'review', 'done', 'backlog'] as IssueStatus[]).map((st) => (
                          <DropdownMenuItem key={st} onClick={() => setNewStatus(st)}>
                            <StatusBadge status={st} showLabel={true} />
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Label Tag */}
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Tag..."
                      className="w-28 px-2.5 py-1 rounded-(--radius-sm) text-xs bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.06] text-zinc-800 dark:text-zinc-200 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                      Press <Kbd size="xs">⌘Enter</Kbd> to save
                    </span>
                    <Button variant="primary" size="xs" onClick={handleCreateIssue}>
                      Create Issue
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. LINEAR ISSUE ROWS */}
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.03]">
          {filteredIssues.map((issue, idx) => {
            const isSelected = selectedIssueIds.includes(issue.id);
            const isCursorActive = activeCursorIndex === idx;

            return (
              <div
                key={issue.id}
                onClick={() => {
                  setActiveCursorIndex(idx);
                  toggleIssueComplete(issue.id);
                }}
                className={`group relative px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer select-none ${
                  isCursorActive
                    ? 'bg-zinc-100/70 dark:bg-white/[0.035] shadow-(--accent-bar)'
                    : issue.completed
                    ? 'bg-zinc-50/40 dark:bg-white/[0.008]'
                    : 'hover:bg-zinc-50 dark:hover:bg-white/[0.015]'
                }`}
              >
                {/* Left Side: Checkbox, Status Trigger Dropdown, Code, Title */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Multi-Select Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectIssue(issue.id);
                    }}
                  >
                    <Checkbox
                      size="sm"
                      checked={isSelected}
                      onChange={() => toggleSelectIssue(issue.id)}
                    />
                  </div>

                  {/* Interactive Status Dropdown Menu */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        >
                          <StatusBadge status={issue.status} showLabel={false} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(['backlog', 'todo', 'in_progress', 'review', 'done', 'canceled'] as IssueStatus[]).map(
                          (st) => (
                            <DropdownMenuItem
                              key={st}
                              onClick={() => updateIssueStatus(issue.id, st)}
                            >
                              <StatusBadge status={st} showLabel={true} />
                            </DropdownMenuItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Issue Identifier Code */}
                  <span className="text-xs font-mono font-semibold text-zinc-400 shrink-0">
                    {issue.code}
                  </span>

                  {/* Issue Title */}
                  <span
                    className={`text-xs sm:text-sm font-medium tracking-tight truncate ${
                      issue.completed
                        ? 'line-through text-zinc-400 dark:text-zinc-500'
                        : 'text-(--text-primary)'
                    }`}
                  >
                    {issue.title}
                  </span>
                </div>

                {/* Right Side: Label, Interactive Priority Dropdown, Assignee, Date */}
                <div className="flex items-center gap-2 shrink-0">
                  <Tag size="sm" variant={issue.labelColor}>
                    {issue.label}
                  </Tag>

                  {/* Interactive Priority Dropdown Menu */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        >
                          <PriorityBadge priority={issue.priority} showLabel={false} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(['urgent', 'high', 'medium', 'low', 'none'] as PriorityLevel[]).map((pr) => (
                          <DropdownMenuItem
                            key={pr}
                            onClick={() => updateIssuePriority(issue.id, pr)}
                          >
                            <PriorityBadge priority={pr} showLabel={true} />
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Avatar name={issue.assignee} size="xs" />

                  <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                    {issue.date}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredIssues.length === 0 && (
            <div className="p-10 text-center space-y-2">
              <p className="text-xs font-semibold text-zinc-400">
                No issues match your active filter criteria.
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setViewTab('ALL');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>

        {/* 4. FOOTER WITH LINEAR KEYBOARD GUIDE */}
        <div className="px-5 py-3 border-t border-(--border-hairline) flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50/30 dark:bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd size="xs">J</Kbd> / <Kbd size="xs">K</Kbd> Navigate
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Kbd size="xs">Space</Kbd> Toggle done
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Kbd size="xs">X</Kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <Kbd size="xs">C</Kbd> Quick create
            </span>
          </div>

          <span className="font-mono text-[11px]">
            {issues.filter((i) => i.completed).length} of {issues.length} completed
          </span>
        </div>
      </div>

      {/* 5. FLOATING LIQUID GLASS BATCH ACTION DOCK */}
      <AnimatePresence>
        {selectedIssueIds.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="liquid-glass-dark-dock px-4 py-2 rounded-(--radius-pill) flex items-center gap-2.5 shadow-2xl border border-white/[0.08] backdrop-blur-2xl">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded-(--radius-pill) bg-white/[0.1]">
                {selectedIssueIds.length} Selected
              </span>

              {/* Batch Done */}
              <Button
                variant="primary"
                size="xs"
                icon={<CheckCircle className="w-3.5 h-3.5" />}
                onClick={handleBatchMarkDone}
              >
                Done
              </Button>

              {/* Batch Priority Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="xs">
                    Priority <ChevronDown className="w-3 h-3 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(['urgent', 'high', 'medium', 'low', 'none'] as PriorityLevel[]).map((pr) => (
                    <DropdownMenuItem
                      key={pr}
                      onClick={() => handleBatchSetPriority(pr)}
                    >
                      <PriorityBadge priority={pr} showLabel={true} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Batch Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="xs">
                    Status <ChevronDown className="w-3 h-3 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(['todo', 'in_progress', 'review', 'done', 'canceled'] as IssueStatus[]).map((st) => (
                    <DropdownMenuItem
                      key={st}
                      onClick={() => handleBatchSetStatus(st)}
                    >
                      <StatusBadge status={st} showLabel={true} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete */}
              <button
                type="button"
                onClick={handleBatchDelete}
                className="p-1.5 rounded-(--radius-pill) text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-white/20" />

              {/* Deselect */}
              <button
                type="button"
                onClick={() => setSelectedIssueIds([])}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Esc</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
