/**
 * UI99 — Linear-Native Modern Mobile Shell for Home View
 * High-velocity, ultra-crisp, zero card fatigue, true iOS native feeling.
 */

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { useObjects } from '../../core/context/ObjectContext';
import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';
import { TodayRail } from '../home/TodayRail';
import {
  composeHomeExperience,
  getTimeOfDay,
  HomeCompositionResult,
} from '../home/homeComposition';

export function ModernLinearHomeView() {
  const { user, isRTL } = useAuth();
  const { openCapture, setIsSearchOpen, setCurrentTab } = useApp();
  const { objects, updateObject, setSelectedObject } = useObjects();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeSegment, setActiveSegment] = useState<'FOCUS' | 'STUDIO' | 'ALL'>('FOCUS');

  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const composition: HomeCompositionResult = useMemo(() => {
    return composeHomeExperience({
      currentTime: now,
      selectedDate,
      isToday,
      dayOfWeek: selectedDate.getDay(),
      timeOfDay: getTimeOfDay(now),
      objects,
    });
  }, [objects, selectedDate, isToday]);

  const handleToggleTask = async (task: BaseObject, e: React.MouseEvent) => {
    e.stopPropagation();
    const isDone = task.status === ObjectStatus.COMPLETED;
    try {
      await updateObject(task.id, {
        status: isDone ? ObjectStatus.ACTIVE : ObjectStatus.COMPLETED,
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleIncrementHabit = async (habit: BaseObject, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStreak = habit.metadata?.streak ?? 0;
    try {
      await updateObject(habit.id, {
        metadata: {
          ...habit.metadata,
          streak: currentStreak + 1,
          lastCheckedDate: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Failed to increment habit:', err);
    }
  };

  const activeTasks = composition.activeTasks || [];
  const activeHabits = composition.activeHabits || [];
  const timelineItems = composition.scheduledTimelineItems || [];
  const focusObject = composition.focusObject;
  const atelierProject = composition.atelierProject;

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-5 pb-32 pt-1 select-none space-y-5">
      {/* 1. Header Micro-Stream (Linear Status Bar) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.035] border border-white/[0.04]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-mono tracking-tight text-zinc-300">
              {isToday ? (isRTL ? 'امروز' : 'Today') : selectedDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <span className="text-[11px] font-medium text-[#8E8E98]">
            {activeTasks.length} {isRTL ? 'کار باقی‌مانده' : 'tasks in flow'}
          </span>
        </div>

        {/* Quick Linear Search & Capture triggers */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            title={isRTL ? 'جستجو' : 'Search (⌘K)'}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => openCapture()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-semibold text-xs transition-all active:scale-95 shadow-[0_2px_12px_rgba(255,255,255,0.2)] hover:bg-zinc-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isRTL ? 'جدید' : 'New'}</span>
          </button>
        </div>
      </div>

      {/* 2. Today Calendar Rail (Ultra-Clean Fluid Strip) */}
      <div className="pt-0.5">
        <TodayRail selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* 3. Linear Segmented Control Pill */}
      <div className="flex items-center justify-center p-1 rounded-xl bg-[#090A0E] border border-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
        <div className="grid grid-cols-3 gap-1 w-full text-center">
          <button
            type="button"
            onClick={() => setActiveSegment('FOCUS')}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSegment === 'FOCUS'
                ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {isRTL ? 'جریان و تمرکز' : 'Focus & Flow'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('STUDIO')}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSegment === 'STUDIO'
                ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {isRTL ? 'آتلیه و الهام' : 'Atelier & Mood'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('ALL')}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSegment === 'ALL'
                ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {isRTL ? 'همه برنامه‌ها' : 'Schedule'}
          </button>
        </div>
      </div>

      {/* 4. CONTENT SECTIONS (NO CARD FATIGUE - INSET GROUPED) */}
      {activeSegment === 'FOCUS' && (
        <div className="space-y-4">
          {/* Primary Focus Milestone (Linear Issue Style Hero Strip) */}
          {focusObject && (
            <div
              onClick={() => setSelectedObject(focusObject)}
              className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0E0F15] to-[#0A0B10] border border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_12px_32px_-8px_rgba(0,0,0,0.6)] cursor-pointer hover:border-white/[0.08] transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">
                    {isRTL ? 'تمرکز شاخص امروز' : 'Core Objective'}
                  </span>
                </div>

                {focusObject.metadata?.progress !== undefined && (
                  <span className="text-[11px] font-mono text-zinc-400">
                    {focusObject.metadata.progress}%
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-[#EDEDEF] tracking-tight mb-1">
                {focusObject.title}
              </h3>

              {focusObject.description && (
                <p className="text-xs text-[#8E8E98] line-clamp-1 font-light">
                  {focusObject.description}
                </p>
              )}
            </div>
          )}

          {/* Active Tasks Group */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <span>{isRTL ? 'کارهای آماده اقدام' : 'Active Tasks'}</span>
              <span className="font-mono text-[10px]">{activeTasks.length}</span>
            </div>

            <div className="linear-group-container">
              {activeTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  {isRTL ? 'هیچ کار بازی برای این روز نیست.' : 'No active tasks for today. Calm achieved.'}
                </div>
              ) : (
                activeTasks.map((task) => {
                  const isDone = task.status === ObjectStatus.COMPLETED;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedObject(task)}
                      className={`linear-group-row cursor-pointer ${isDone ? 'opacity-35' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => handleToggleTask(task, e)}
                          className="p-0.5 text-zinc-500 hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                          ) : (
                            <Circle className="w-4.5 h-4.5 text-zinc-600 hover:text-zinc-300" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[13px] sm:text-sm font-medium tracking-tight truncate text-[#EDEDEF] ${
                                isDone ? 'line-through text-zinc-500' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.metadata?.priority === 'high' && (
                              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                P1
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-[11px] text-[#8E8E98] truncate font-light mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
                        {task.tags?.[0] && (
                          <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-600">
                            #{task.tags[0]}
                          </span>
                        )}
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Habit Rituals Group */}
          {activeHabits.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <span>{isRTL ? 'آیین‌ها و ریتم روزانه' : 'Rituals & Streaks'}</span>
                <span className="font-mono text-[10px]">{activeHabits.length}</span>
              </div>

              <div className="linear-group-container">
                {activeHabits.map((habit) => {
                  const streak = habit.metadata?.streak ?? 0;
                  return (
                    <div
                      key={habit.id}
                      onClick={() => setSelectedObject(habit)}
                      className="linear-group-row cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => handleIncrementHabit(habit, e)}
                          className="w-6 h-6 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <span className="text-[13px] sm:text-sm font-medium tracking-tight text-[#EDEDEF] truncate block">
                            {habit.title}
                          </span>
                          <p className="text-[11px] text-[#8E8E98] truncate font-light mt-0.5">
                            {habit.description || (isRTL ? 'آیین تکرارشونده' : 'Daily ritual')}
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
        </div>
      )}

      {/* STUDIO & ATELIER SEGMENT */}
      {activeSegment === 'STUDIO' && (
        <div className="space-y-4">
          {atelierProject && (
            <div
              onClick={() => setSelectedObject(atelierProject)}
              className="p-4 rounded-2xl bg-[#0B0C11] border border-white/[0.03] shadow-[0_12px_32px_rgba(0,0,0,0.5)] cursor-pointer hover:border-white/[0.06] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Atelier Project
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {atelierProject.metadata?.stage || 'In Progress'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#EDEDEF]">
                  {atelierProject.title}
                </h3>
                {atelierProject.description && (
                  <p className="text-xs text-[#8E8E98] mt-1 font-light">
                    {atelierProject.description}
                  </p>
                )}
              </div>

              {atelierProject.metadata?.palette && (
                <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03]">
                  <span className="text-[10px] text-zinc-500">Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {atelierProject.metadata.palette.map((c: string, i: number) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Music & Restorative items */}
          <div className="linear-group-container">
            <div
              onClick={() => {
                if (composition.songObject) setSelectedObject(composition.songObject);
                else openCapture();
              }}
              className="linear-group-row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#EDEDEF] block">
                    {composition.songObject?.title || (isRTL ? 'نوای موسیقی امروز' : 'Soundtrack')}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-light">
                    {composition.songObject?.metadata?.artist || 'Arvo Pärt • Spiegel im Spiegel'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
            </div>

            <div
              onClick={() => {
                if (composition.movementHabit) setSelectedObject(composition.movementHabit);
                else openCapture();
              }}
              className="linear-group-row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#EDEDEF] block">
                    {composition.movementHabit?.title || (isRTL ? 'حرکت و پیلاتس' : 'Daily Movement')}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-light">
                    {isRTL ? '۱۸ روز استمرار • کشش ملایم' : '18-day streak • Restorative'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE SCHEDULE SEGMENT */}
      {activeSegment === 'ALL' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            <span>{isRTL ? 'برنامه زمانی روز' : 'Timeline Agenda'}</span>
            <span className="font-mono text-[10px]">{timelineItems.length}</span>
          </div>

          <div className="linear-group-container">
            {timelineItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.objectId) {
                    const obj = objects.find((o) => o.id === item.objectId);
                    if (obj) setSelectedObject(obj);
                  }
                }}
                className={`linear-group-row ${item.objectId ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-[11px] font-mono text-zinc-500 w-12 text-right rtl:text-left shrink-0">
                    {item.time}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-[#EDEDEF] truncate block">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-[11px] text-[#8E8E98] truncate font-light block">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/[0.04] text-zinc-500 shrink-0">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
