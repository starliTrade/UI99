/**
 * SAFA — Streak & Habit Widget
 * Pixel-perfect adaptation of IMG_7882.jpeg to the unified obsidian palette:
 * - Ultra-close surface (#101114)
 * - Micro-hairline border-white/[0.04]
 * - Glowing warm flame icon
 * - 7-day circular streak row with luminous check pills (Mon-Sun)
 * - Goal tracker with high-contrast metric & glowing neon progress bar
 */

import React from 'react';
import { motion } from 'motion/react';
import { Flame, Footprints, Check } from 'lucide-react';
import { useApp } from '../../core/context/AppContext';

interface StreakHabitCardProps {
  streakDays?: number;
  currentValue?: number;
  targetValue?: number;
  unitLabel?: string;
  metricLabel?: string;
  completedDays?: number[];
  currentDayIndex?: number;
}

export function StreakHabitCard({
  streakDays = 32,
  currentValue = 6825,
  targetValue = 10000,
  unitLabel = '',
  metricLabel = 'STEPS',
  completedDays = [0, 1, 2],
  currentDayIndex = 3,
}: StreakHabitCardProps) {
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const percent = Math.min(100, Math.round((currentValue / targetValue) * 100));

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-[28px] p-6 overflow-hidden transition-all select-none ${
        isDark
          ? 'bg-[#0B0C11] card-aura-ruby shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03),0_20px_44px_-10px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_50px_-10px_rgba(0,0,0,0.85)]'
          : 'bg-white card-aura-ruby shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.045] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]'
      }`}
    >
      {/* Dynamic Warm Ambient Light Beam in Corner */}
      <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-rose-500/15' : 'bg-rose-500/10'}`} />

      {/* Header: Flame & Footprints */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Radiant Flame Icon */}
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-300 flex items-center justify-center shadow-[0_0_16px_rgba(249,115,22,0.5)]">
            <Flame className="w-4.5 h-4.5 text-white fill-white stroke-none" />
          </div>

          <div>
            <span className={`block text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-white/60' : 'text-black/50'}`}>
              STREAK
            </span>
            <span className={`text-lg sm:text-xl font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
              {streakDays} <span className={`text-xs font-semibold ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>DAYS</span>
            </span>
          </div>
        </div>

        <Footprints className={`w-5 h-5 -rotate-12 ${isDark ? 'text-white/40' : 'text-black/30'}`} />
      </div>

      {/* 7-Day Circular Streak Tokens */}
      <div className="my-5 pt-1 relative z-10">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {dayNames.map((day, idx) => {
            const isCompleted = completedDays.includes(idx);
            const isToday = idx === currentDayIndex;

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                {/* Circular Token */}
                <div
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-emerald-500 to-lime-300 text-zinc-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : isToday
                      ? 'ring-2 ring-emerald-400 bg-emerald-500/10 text-transparent shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                      : isDark
                      ? 'bg-white/[0.05] text-transparent'
                      : 'bg-black/[0.04] text-transparent'
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                {/* Day Label */}
                <span
                  className={`text-[11px] font-medium tracking-tight ${
                    isToday ? (isDark ? 'text-white font-bold' : 'text-[#111116] font-bold') : (isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]')
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Metric Section */}
      <div className={`mt-4 pt-3 border-t relative z-10 ${isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'}`}>
        <div className="flex items-baseline justify-between mb-1.5">
          <div>
            <span className={`block text-[10px] font-bold tracking-wider uppercase mb-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
              {metricLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
                {currentValue.toLocaleString()}
              </span>
              <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                /{targetValue.toLocaleString()}
              </span>
            </div>
          </div>

          <span className="text-sm font-semibold text-emerald-500 tracking-tight">
            {percent}%
          </span>
        </div>

        {/* Luminous Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.4)] transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
