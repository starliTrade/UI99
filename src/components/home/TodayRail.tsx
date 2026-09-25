/**
 * UI99 — Obsidian Liquid Glass (SOLG) Unified Date Rail (Build 02.1)
 * Seamless dark depth (#0E0E13) with soft satin selected token (#EDEDEF).
 * iPhone-first touch gestures with centered active scrolling.
 */

import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { Check } from 'lucide-react';

interface TodayRailProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function TodayRail({ selectedDate, onSelectDate }: TodayRailProps) {
  const { isRTL } = useAuth();
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 14 days around today (-4 past days, today, +9 future days)
  const days = React.useMemo(() => {
    const list: Date[] = [];
    const now = new Date();
    for (let i = -4; i <= 9; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isPastDay = (d: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    return check.getTime() < now.getTime();
  };

  const isToday = (d: Date) => {
    return isSameDay(d, new Date());
  };

  const getDayOfWeekName = (date: Date) => {
    if (isRTL) {
      const persianWeekdays = ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج', 'ش'];
      return persianWeekdays[date.getDay() === 0 ? 0 : date.getDay()];
    }
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Auto-scroll selected/today into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  return (
    <div className="w-full relative py-0.5 select-none">
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1.5 px-0.5 scroll-smooth"
      >
        {days.map((d) => {
          const selected = isSameDay(d, selectedDate);
          const today = isToday(d);
          const past = isPastDay(d);

          return (
            <button
              key={d.toISOString()}
              type="button"
              data-selected={selected ? 'true' : 'false'}
              onClick={() => onSelectDate(d)}
              className="group relative shrink-0 flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95"
            >
              {/* Day Label (e.g. Fri, Sat, Sun / امروز) */}
              <span
                className={`text-[10.5px] font-medium tracking-tight mb-1.5 transition-colors ${
                  selected
                    ? isDark ? 'text-[#EDEDEF] font-semibold' : 'text-zinc-950 font-bold'
                    : isDark ? 'text-[#8E8E98] group-hover:text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-900'
                }`}
              >
                {today ? (isRTL ? 'امروز' : 'Today') : getDayOfWeekName(d)}
              </span>

              {/* Circular Pill Token */}
              <div
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                  selected
                    ? isDark
                      ? 'bg-[#EDEDEF] text-[#09090C] shadow-(var(--elevation-1)) font-bold'
                      : 'bg-zinc-950 text-white shadow-(var(--elevation-1)) font-bold'
                    : isDark
                    ? 'bg-[#0E0E13] text-[#8E8E98] border border-white/[0.025] hover:bg-[#131318] hover:text-[#EDEDEF]'
                    : 'bg-white text-zinc-600 border border-black/[0.04] hover:bg-zinc-50 hover:text-zinc-950 shadow-xs'
                }`}
              >
                <span
                  className={`text-sm sm:text-base font-medium tracking-tight ${
                    selected ? 'font-bold' : ''
                  }`}
                >
                  {d.getDate()}
                </span>

                {/* Completed Checkmark Micro-badge for Past Days */}
                {past && !selected && (
                  <span
                    className={`absolute -bottom-0.5 w-3 h-3 rounded-full flex items-center justify-center shadow-xs ${
                      isDark
                        ? 'bg-[#15151B] text-[#8E8E98] border border-white/[0.06]'
                        : 'bg-zinc-100 text-zinc-500 border border-black/[0.06]'
                    }`}
                  >
                    <Check className="w-2 h-2 stroke-[3]" />
                  </span>
                )}

                {/* Today tiny indicator dot if not selected */}
                {today && !selected && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isDark ? 'bg-rose-500 shadow-(var(--glow-rose-sm))' : 'bg-rose-500'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

