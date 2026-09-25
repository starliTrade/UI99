/**
 * UI99 — CalendarView Component
 * Interactive month calendar matrix with event chips, today marker, and day cell selection.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  variant?: 'emerald' | 'amber' | 'sapphire' | 'rose';
}

export interface CalendarViewProps {
  month?: string;
  year?: number;
  events?: CalendarEvent[];
  onSelectDay?: (day: number) => void;
  className?: string;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  { id: '1', day: 8, title: 'Sprint 24 Kickoff', variant: 'emerald' },
  { id: '2', day: 14, title: 'Obsidian Design Audit', variant: 'sapphire' },
  { id: '3', day: 22, title: 'Release UI99 v1.0', variant: 'amber' },
  { id: '4', day: 28, title: 'Retrospective', variant: 'rose' },
];

export function CalendarView({
  month = 'September',
  year = 2026,
  events = DEFAULT_EVENTS,
  onSelectDay,
  className,
}: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState(24);
  const daysInMonth = 30;
  const startDayOffset = 2; // Tuesday start

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventVariantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    sapphire: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 rounded-(--radius-lg) bg-white dark:bg-(--bg-card) border border-black/[0.06] dark:border-white/[0.04] shadow-md w-full',
        className
      )}
    >
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.03]">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {month} {year}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            className="p-1 rounded-(--radius-sm) text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="p-1 rounded-(--radius-sm) text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-[11px] font-mono font-medium text-zinc-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Matrix — plain presentation; cells are real buttons with labels */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading blanks */}
        {Array.from({ length: startDayOffset }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-14 rounded-(--radius-field) opacity-0" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const isSelected = selectedDay === dayNum;
          const isToday = dayNum === 24;
          const dayEvents = events.filter((e) => e.day === dayNum);

          return (
            <button
              key={dayNum}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${month} ${dayNum}${isToday ? ', today' : ''}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
              onClick={() => {
                setSelectedDay(dayNum);
                onSelectDay?.(dayNum);
              }}
              className={cn(
                'min-h-[44px] sm:min-h-[58px] p-1 sm:p-1.5 rounded-(--radius-sm) sm:rounded-(--radius-field) border flex flex-col items-start justify-between text-left transition-all duration-150',
                isSelected
                  ? 'bg-zinc-100 dark:bg-white/[0.08] border-black/20 dark:border-white/20 shadow-xs'
                  : 'bg-zinc-50/50 dark:bg-(--bg-elevated)/50 border-black/[0.04] dark:border-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
              )}
            >
              <span
                className={cn(
                  'text-[11px] font-mono font-medium w-5 h-5 flex items-center justify-center rounded-(--radius-pill)',
                  isToday
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black font-bold'
                    : 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                {dayNum}
              </span>

              {/* Event indicators */}
              <div className="w-full flex flex-col gap-0.5 mt-1 overflow-hidden">
                {dayEvents.map((evt) => (
                  <span
                    key={evt.id}
                    className={cn(
                      'text-[9px] px-1 py-0.2 rounded font-medium truncate w-full border',
                      eventVariantStyles[evt.variant || 'emerald']
                    )}
                  >
                    {evt.title}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
