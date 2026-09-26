/**
 * UI99 — Daily Timeline & Real-Time Schedule Track (Build 04)
 * Strictly REAL Object Graph Projection.
 * Zero fabricated schedule items.
 * Shows scheduled events, time-locked tasks, deadlines, or a beautiful poetic invitation.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Check, Sparkles, Plus, Calendar, ArrowUpRight } from 'lucide-react';
import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { TimelineScheduleItem } from './homeComposition';

interface DailyTimelineProps {
  selectedDate: Date;
  isToday: boolean;
  timelineItems?: TimelineScheduleItem[];
  objects?: BaseObject[];
  onSelectObject?: (object: BaseObject) => void;
  onOpenCapture?: () => void;
}

export function DailyTimeline({
  selectedDate,
  isToday,
  timelineItems = [],
  objects = [],
  onSelectObject,
  onOpenCapture,
}: DailyTimelineProps) {
  const { isRTL } = useAuth();
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Update live clock every 30 seconds when viewing today
  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => {
      setNowTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [isToday]);

  const currentHour = nowTime.getHours();
  const currentMinute = nowTime.getMinutes();
  const currentTimeFormatted = nowTime.toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const getCategoryBadge = (cat: TimelineScheduleItem['category']) => {
    switch (cat) {
      case 'STUDIO':
        return {
          label: isRTL ? 'آتلیه' : 'Atelier',
          className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        };
      case 'RITUAL':
        return {
          label: isRTL ? 'آیین' : 'Ritual',
          className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        };
      case 'REST':
        return {
          label: isRTL ? 'آرامش' : 'Rest',
          className: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        };
      case 'PERSONAL':
        return {
          label: isRTL ? 'خاطره' : 'Personal',
          className: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        };
      default:
        return {
          label: isRTL ? 'روزمره' : 'Life',
          className: 'bg-white/[0.04] text-zinc-300 border-white/[0.04]',
        };
    }
  };

  const handleItemClick = (item: TimelineScheduleItem) => {
    if (!onSelectObject || !item.objectId) return;
    const found = objects.find((o) => o.id === item.objectId);
    if (found) {
      onSelectObject(found);
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="icon-sm text-zinc-400" />
          <h3 className="type-micro font-semibold uppercase tracking-wider text-[#92929B]">
            {isRTL ? 'جریان و برنامه روز' : 'Daily Schedule & Rhythm'}
          </h3>
        </div>

        {isToday && (
          <div className="flex items-center gap-1.5 type-micro font-medium text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-(--radius-pill) h-2 w-2 bg-rose-500 shadow-(--glow-rose-sm)" />
            </span>
            <span className="font-mono">{currentTimeFormatted}</span>
          </div>
        )}
      </div>

      {/* Timeline Items or Beautiful Empty State */}
      {timelineItems.length === 0 ? (
        /* Graceful Poetic Empty State */
        <div
          onClick={onOpenCapture}
          className="group relative p-5 sm:p-6 rounded-(--radius-lg) bg-(--bg-surface) border border-white/[0.025] hover:border-white/[0.05] shadow-(--shadow-card) transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-(--radius-pill) bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-400 group-hover:text-rose-400 transition-colors shrink-0">
              <Calendar className="icon-md" />
            </div>
            <div>
              <p className="type-caption sm:type-body font-medium text-[#EDEDEF] leading-relaxed">
                {isRTL
                  ? 'امروز هنوز چیزی در برنامه‌ات ثبت نشده.'
                  : 'Nothing scheduled for this day yet.'}
              </p>
              <p className="type-micro text-[#92929B] mt-0.5 font-light">
                {isRTL
                  ? 'شاید وقت خوبیه برای اینکه روزت رو خودت بسازی ✦'
                  : 'A quiet, unhurried space to shape your day ✦'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-(--radius-pill) bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.04] type-caption font-medium shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="icon-sm text-rose-400" />
            <span>{isRTL ? 'ثبت برنامه' : 'Add Event'}</span>
          </button>
        </div>
      ) : (
        <div className="linear-group-container">
          {timelineItems.map((item, index) => {
            const itemTotalMinutes = item.hour * 60 + item.minute;
            const currentTotalMinutes = currentHour * 60 + currentMinute;
            const badge = getCategoryBadge(item.category);

            const showNowBefore =
              isToday &&
              index > 0 &&
              currentTotalMinutes >
                timelineItems[index - 1].hour * 60 + timelineItems[index - 1].minute &&
              currentTotalMinutes <= itemTotalMinutes;

            return (
              <React.Fragment key={item.id}>
                {/* NOW Indicator */}
                {showNowBefore && (
                  <div className="relative flex items-center gap-3 px-4 py-1.5 bg-rose-500/[0.04] border-y border-rose-500/20">
                    <div className="w-12 text-right rtl:text-left shrink-0">
                      <span className="type-micro font-mono font-bold text-rose-400 tracking-wider">
                        NOW
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-(--radius-pill) bg-rose-500 shadow-(--glow-rose-sm) shrink-0" />
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-rose-500/30 via-rose-500/10 to-transparent rtl:bg-gradient-to-l" />
                  </div>
                )}

                {/* Timeline Item Row */}
                <div
                  onClick={() => handleItemClick(item)}
                  className={`linear-group-row ${
                    item.objectId ? 'cursor-pointer' : ''
                  } ${item.isCompleted ? 'opacity-40' : ''}`}
                >
                  {/* Time */}
                  <div className="w-12 text-right rtl:text-left shrink-0">
                    <span className="type-micro font-mono font-medium text-[#8E8E98]">
                      {item.time}
                    </span>
                  </div>

                  {/* Node icon */}
                  <div className="px-2 shrink-0">
                    {item.isCompleted ? (
                      <div className="w-4 h-4 rounded-(--radius-pill) bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-(--radius-pill) flex items-center justify-center border border-white/15 bg-white/[0.02]">
                        <div className="w-1 h-1 rounded-(--radius-pill) bg-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-2 rtl:pl-2 rtl:pr-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`type-caption sm:type-caption font-medium tracking-tight text-[#EDEDEF] truncate ${
                          item.isCompleted ? 'line-through text-zinc-500' : ''
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`type-micro uppercase font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {item.description && (
                      <p className="type-micro mt-0.5 leading-relaxed truncate text-[#8E8E98] font-light">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.objectId && (
                    <ArrowUpRight className="icon-sm text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
