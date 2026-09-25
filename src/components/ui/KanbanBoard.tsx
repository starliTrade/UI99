/**
 * UI99 — KanbanBoard Component
 * Minimalist sprint Kanban column board with draggable issue status transitions.
 */

import React, { useState } from 'react';
import { Plus, MoreHorizontal, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PriorityBadge, StatusBadge, PriorityLevel, IssueStatus } from './Badge';

export interface KanbanCardItem {
  id: string;
  title: string;
  status: IssueStatus;
  priority: PriorityLevel;
  assignee?: string;
  estimate?: number;
}

export interface KanbanBoardProps {
  cards?: KanbanCardItem[];
  onCardMove?: (cardId: string, newStatus: IssueStatus) => void;
  onAddCard?: (status: IssueStatus) => void;
  className?: string;
}

const DEFAULT_CARDS: KanbanCardItem[] = [
  { id: '1', title: 'Velvet token contrast engine & WCAG AAA testing', status: 'in_progress', priority: 'urgent', estimate: 3 },
  { id: '2', title: 'Mathematical nested border radii calculation', status: 'in_progress', priority: 'high', estimate: 5 },
  { id: '3', title: 'Linear hotkey J/K cursor selection bindings', status: 'todo', priority: 'high', estimate: 2 },
  { id: '4', title: 'Zero-slop container padding harmonization', status: 'done', priority: 'medium', estimate: 1 },
  { id: '5', title: 'Port component playground to live Tailwind sandbox', status: 'backlog', priority: 'low', estimate: 8 },
];

const COLUMNS: Array<{ id: IssueStatus; label: string; count?: number }> = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Todo' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export function KanbanBoard({
  cards = DEFAULT_CARDS,
  onCardMove,
  onAddCard,
  className,
}: KanbanBoardProps) {
  const [items, setItems] = useState<KanbanCardItem[]>(cards);

  const moveCard = (id: string, newStatus: IssueStatus) => {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    onCardMove?.(id, newStatus);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-x-auto pb-4',
        className
      )}
    >
      {COLUMNS.map((col) => {
        const colCards = items.filter((c) => c.status === col.id);

        return (
          <div
            key={col.id}
            aria-label={`${col.label} column`}
            className="flex flex-col gap-3 rounded-(--radius-control) bg-zinc-100/60 dark:bg-(--bg-card) p-3 border border-black/[0.04] dark:border-white/[0.03] min-w-[240px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={col.id} showLabel={false} />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-(--radius-pill) bg-zinc-200 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400">
                  {colCards.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddCard?.(col.id)}
                aria-label={`Add card to ${col.label}`}
                className="p-1 rounded-(--radius-sm) text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cards List — the only accessibility `list` in the column,
                so its children are strictly `listitem` (axe-clean). */}
            <div role="list" aria-label={`${col.label} column, ${colCards.length} cards`} className="flex flex-col gap-2 min-h-[140px]">
              {colCards.map((card) => (
                <div
                  key={card.id}
                  role="listitem"
                  aria-label={`${card.title}, ${card.priority} priority, ${card.status}`}
                  className="p-3 rounded-(--radius-field) bg-white dark:bg-(--bg-elevated) border border-black/[0.06] dark:border-white/[0.04] shadow-xs hover:border-black/15 dark:hover:border-white/10 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={card.priority} showLabel={false} />
                    {card.estimate && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        {card.estimate} pts
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                    {card.title}
                  </p>

                  {/* Status Quick Cycle on Hover */}
                  <div
                    role="toolbar"
                    aria-label={`Move ${card.title} to another column`}
                    className="flex items-center gap-1 pt-1 opacity-40 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                  >
                    {COLUMNS.map((targetCol) => (
                      <button
                        key={targetCol.id}
                        type="button"
                        onClick={() => moveCard(card.id, targetCol.id)}
                        disabled={card.status === targetCol.id}
                        aria-label={`Move ${card.title} to ${targetCol.label}`}
                        aria-pressed={card.status === targetCol.id}
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors',
                          card.status === targetCol.id
                            ? 'bg-zinc-200 dark:bg-white/10 text-zinc-900 dark:text-white font-bold'
                            : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500'
                        )}
                      >
                        {targetCol.label.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
