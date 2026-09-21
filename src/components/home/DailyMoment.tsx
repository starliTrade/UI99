/**
 * SAFA — Today's Emotional Moment (Build 03.2 - Open Editorial Reflection)
 * Unboxed, seamless editorial quote & reflection flowing directly on the canvas.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Feather, RefreshCw, Quote } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { DAILY_INTENTIONS } from './homeSpotlight';

export function DailyMoment() {
  const { isRTL } = useAuth();
  const [index, setIndex] = useState(0);

  const current = DAILY_INTENTIONS[index % DAILY_INTENTIONS.length];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % DAILY_INTENTIONS.length);
  };

  return (
    <div className="relative py-3 px-3 sm:px-4 select-none group">
      {/* Soft Editorial Left/Right Border Accent */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Subtle Vertical Rose-Gold Pillar */}
        <div className="w-[2px] self-stretch rounded-full bg-gradient-to-b from-rose-500/50 via-rose-500/20 to-transparent shrink-0 mt-1" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Header & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-400/90 text-xs font-medium">
              <Feather className="w-3 h-3" />
              <span className="text-[11px] font-semibold tracking-wide text-zinc-300">
                {isRTL ? 'نیت و نجوای امروز' : "Today's Intention"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
              title={isRTL ? 'ورق زدن نیت' : 'Next intention'}
              aria-label="Next intention"
            >
              <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-45" />
            </button>
          </div>

          {/* Intimate Quote Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="space-y-1.5"
            >
              <p className="text-[13.5px] sm:text-base text-[#EDEDEF] leading-relaxed font-serif tracking-wide italic">
                «{isRTL ? current.textFa : current.textEn}»
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#92929B] pt-1">
                <span className="font-medium text-zinc-400">
                  {isRTL ? current.author : 'SAFA Sanctuary Reflection'}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">
                  {index + 1} / {DAILY_INTENTIONS.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
