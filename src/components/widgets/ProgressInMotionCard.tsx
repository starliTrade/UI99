/**
 * UI99 — Progress in Motion Card
 * Pixel-perfect implementation of the hero momentum widget from IMG_7872.jpeg:
 * - Ultra-close dark obsidian background (#101114)
 * - Faint micro-hairline border-white/[0.04]
 * - Amber/yellow capsule pill "79% complete"
 * - Segmented battery/progress ticks with glowing emerald segments
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface ProgressInMotionCardProps {
  title?: string;
  subtitle?: string;
  momentumText?: string;
  percent?: number;
  totalSegments?: number;
  completedSegments?: number;
}

export function ProgressInMotionCard({
  title = 'Progress in motion',
  subtitle = 'Momentum',
  momentumText = "You're on a roll! 4 days strong.",
  percent = 79,
  totalSegments = 16,
  completedSegments = 12,
}: ProgressInMotionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-(--radius-xl) bg-[#12131A] border border-white/[0.045] p-6 overflow-hidden transition-all shadow-(--elevation-2) hover:border-white/[0.07] select-none"
    >
      {/* Top Row: Icon, Title & Status Pill */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center text-white/70">
            <TrendingUp className="w-4 h-4 text-white/80" />
          </div>
          <h3 className="text-base font-semibold tracking-tight text-[#F2F2F5]">
            {title}
          </h3>
        </div>

        {/* Percentage Capsule Pill */}
        <span className="px-3 py-1 rounded-(--radius-pill) text-xs font-medium bg-amber-400/[0.12] text-amber-300 border border-amber-400/20 tracking-tight shrink-0">
          {percent}% complete
        </span>
      </div>

      {/* Momentum Text */}
      <div className="mb-4">
        <span className="block text-[11px] font-medium text-[#8E8E98] tracking-tight">
          {subtitle}
        </span>
        <p className="text-xs text-[#8E8E98] font-medium tracking-tight mt-0.5">
          {momentumText}
        </p>
      </div>

      {/* Segmented Horizontal Equalizer / Battery Ticks */}
      <div className="flex items-center gap-1.5 pt-1 overflow-hidden">
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isFilled = idx < completedSegments;
          return (
            <div
              key={idx}
              className={`h-4.5 w-2 rounded-(--radius-pill) transition-all duration-300 ${
                isFilled
                  ? 'bg-emerald-400/90 shadow-(--glow-accent-sm)'
                  : 'bg-white/[0.05]'
              }`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
