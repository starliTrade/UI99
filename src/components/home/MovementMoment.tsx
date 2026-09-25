/**
 * UI99 — Movement & Fitness Moment (Build 03)
 * Mindful movement, restorative Pilates & gentle streak check-in.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Flame, Check, Sparkles, Plus, Heart } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface MovementMomentProps {
  movementHabit?: BaseObject;
  onSelectHabit: (habit: BaseObject) => void;
  onCheckIn: (habit: BaseObject, e: React.MouseEvent) => void;
  onAddMovement: () => void;
}

export function MovementMoment({
  movementHabit,
  onSelectHabit,
  onCheckIn,
  onAddMovement,
}: MovementMomentProps) {
  const { isRTL } = useAuth();

  if (!movementHabit) {
    return (
      <div
        onClick={onAddMovement}
        className="group relative p-5 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0B0C11] border border-white/[0.025] hover:border-white/[0.06] shadow-(--shadow-card-hover) flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-(--radius-control) bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Activity className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#EDEDEF]">
              {isRTL ? 'حرکت و تندرستی' : 'Movement & Vitality'}
            </h4>
            <p className="text-xs text-[#92929B] mt-0.5">
              {isRTL ? 'آماده یک حرکت کوتاه و کشش بدنی هستی؟' : 'Ready for a little restorative movement?'}
            </p>
          </div>
        </div>
        <span className="p-2 rounded-(--radius-pill) bg-white/[0.03] text-zinc-400 group-hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </span>
      </div>
    );
  }

  const streak = movementHabit.metadata?.streak ?? 18;
  const duration = movementHabit.metadata?.durationMinutes || 30;

  return (
    <div
      onClick={() => onSelectHabit(movementHabit)}
      className="group relative p-5 sm:p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0A0B10] border border-white/[0.025] shadow-(--shadow-card-hover) hover:border-white/[0.06] select-none"
    >
      {/* Warm Ambient Aura */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/[0.06] rounded-(--radius-pill) blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-orange-500/15 text-orange-400">
            <Activity className="w-3 h-3 stroke-[2.2]" />
          </span>
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#EDEDEF]">
            {isRTL ? 'حرکت و تندرستی روزانه' : 'Daily Movement & Vitality'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono font-bold text-orange-400">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streak} {isRTL ? 'روز' : 'days'}</span>
        </div>
      </div>

      {/* Content Body with Check-in Button */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="min-w-0">
          <h4 className="text-base font-bold text-[#EDEDEF] leading-snug truncate">
            {movementHabit.title}
          </h4>
          <p className="text-xs text-[#92929B] mt-0.5 line-clamp-1">
            {movementHabit.description || (isRTL ? 'تمرین ملایم و آرامش عضلات' : `${duration} mins restorative flow`)}
          </p>
        </div>

        {/* Tactile Check-in Pill */}
        <button
          type="button"
          onClick={(e) => onCheckIn(movementHabit, e)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-(--radius-pill) bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/25 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-(--glow-warning-md)"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-semibold">{isRTL ? 'ثبت حرکت' : 'Check-in'}</span>
        </button>
      </div>
    </div>
  );
}
