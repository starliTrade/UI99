/**
 * UI99 — Execution Section (Productivity & Rituals Layer) (Build 04)
 * Calm, focused execution foundation: Focus, Schedule Timeline, Tasks & Habit Rituals.
 * Strictly uses real Object Graph data.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Clock,
  CheckCircle2,
  Circle,
  Flame,
  ArrowUpRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';
import { DailyTimeline } from './DailyTimeline';
import { TimelineScheduleItem } from './homeComposition';

interface ExecutionSectionProps {
  selectedDate: Date;
  objects: BaseObject[];
  timelineItems: TimelineScheduleItem[];
  focusObject?: BaseObject;
  activeTasks: BaseObject[];
  activeHabits: BaseObject[];
  onSelectObject: (obj: BaseObject) => void;
  onToggleTask: (task: BaseObject, e: React.MouseEvent) => void;
  onIncrementHabit: (habit: BaseObject, e: React.MouseEvent) => void;
  onOpenCapture: () => void;
}

export function ExecutionSection({
  selectedDate,
  objects,
  timelineItems,
  focusObject,
  activeTasks,
  activeHabits,
  onSelectObject,
  onToggleTask,
  onIncrementHabit,
  onOpenCapture,
}: ExecutionSectionProps) {
  const { isRTL } = useAuth();

  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  return (
    <section className="space-y-4 select-none pt-2">
      {/* Section Title */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-rose-500" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#92929B]">
            {isRTL ? 'جریان کارهای امروز و آیین‌ها' : 'Today’s Focus & Flow'}
          </h3>
        </div>

        <button
          type="button"
          onClick={onOpenCapture}
          className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" />
          <span>{isRTL ? 'ثبت کار / آیین' : 'Add Item'}</span>
        </button>
      </div>

      {/* 1. Today's Primary Focus Card (if available) */}
      {focusObject && (
        <div
          onClick={() => onSelectObject(focusObject)}
          className="group relative p-5 sm:p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0A0B10] border border-white/[0.03] shadow-(--shadow-card-hover) hover:border-white/[0.07]"
        >
          {/* Subtle amber aura */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.05] rounded-(--radius-pill) blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-amber-500/15 text-amber-400">
                <Target className="w-3 h-3 stroke-[2.2]" />
              </span>
              <span className="text-[10.5px] uppercase font-bold tracking-widest text-amber-400">
                {isRTL ? 'تمرکز اصلی روز' : "Today's Core Focus"}
              </span>
            </div>

            {focusObject.metadata?.progress !== undefined && (
              <span className="text-xs font-mono font-bold text-amber-400">
                {focusObject.metadata.progress}%
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#EDEDEF] tracking-tight leading-snug mb-1">
            {focusObject.title}
          </h3>

          {focusObject.description && (
            <p className="text-xs text-[#92929B] leading-relaxed line-clamp-2 mb-3 font-normal">
              {focusObject.description}
            </p>
          )}

          {/* Progress bar if project */}
          {focusObject.metadata?.progress !== undefined && (
            <div className="w-full h-1.5 rounded-(--radius-pill) overflow-hidden p-0.5 bg-black/50 mb-3.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-(--radius-pill) transition-all duration-500 shadow-(--glow-warning-md)"
                style={{ width: `${focusObject.metadata.progress}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.025] text-xs text-[#92929B] relative z-10">
            <div className="flex items-center gap-1.5">
              {focusObject.tags?.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-(--radius-pill) text-[9.5px] font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.04]"
                >
                  #{t}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
              <span>{isRTL ? 'مشاهده' : 'Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* 2. Daily Schedule & Real-Time Timeline */}
      <DailyTimeline
        selectedDate={selectedDate}
        isToday={isToday}
        timelineItems={timelineItems}
        objects={objects}
        onSelectObject={onSelectObject}
        onOpenCapture={onOpenCapture}
      />

      {/* 3. Action Items & Rituals List (Linear-style Inset Grouped Feed) */}
      {(activeTasks.length > 0 || activeHabits.length > 0) && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#92929B]">
              {isRTL ? 'کارهای آماده اقدام و آیین‌ها' : 'Active Items & Rituals'}
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">
              {activeTasks.length + activeHabits.length} {isRTL ? 'مورد' : 'items'}
            </span>
          </div>

          <div className="linear-group-container">
            {/* Active Tasks Rows */}
            {activeTasks.slice(0, 5).map((task) => {
              const isCompleted = task.status === ObjectStatus.COMPLETED;
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectObject(task)}
                  className={`linear-group-row cursor-pointer ${
                    isCompleted ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => onToggleTask(task, e)}
                      className="p-1 text-zinc-500 hover:text-white transition-colors shrink-0 cursor-pointer"
                      aria-label="Toggle Complete"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-zinc-500 hover:text-zinc-200" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs sm:text-[13px] font-medium tracking-tight truncate text-[#EDEDEF] ${
                            isCompleted ? 'line-through text-zinc-500' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.metadata?.priority === 'high' && (
                          <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                            P1
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-[#8E8E98] truncate mt-0.5 font-light">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
                    {task.tags?.[0] && (
                      <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500">
                        #{task.tags[0]}
                      </span>
                    )}
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                  </div>
                </div>
              );
            })}

            {/* Active Habit rituals Rows */}
            {activeHabits.slice(0, 3).map((habit) => {
              const streak = habit.metadata?.streak ?? 0;
              return (
                <div
                  key={habit.id}
                  onClick={() => onSelectObject(habit)}
                  className="linear-group-row cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => onIncrementHabit(habit, e)}
                      className="w-6 h-6 rounded-(--radius-pill) bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 flex items-center justify-center shrink-0 transition-transform active:scale-90 border border-orange-500/20 shadow-(--glow-warning-sm) cursor-pointer"
                      title="Check-in habit ritual"
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-[13px] font-medium tracking-tight text-[#EDEDEF] truncate block">
                        {habit.title}
                      </span>
                      <p className="text-[11px] text-[#8E8E98] truncate mt-0.5 font-light">
                        {habit.description || (isRTL ? 'آیین روزانه' : 'Daily ritual streak')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-orange-400 shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{streak}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
