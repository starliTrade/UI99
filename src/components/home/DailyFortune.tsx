/**
 * UI99 — Daily Fortune / Fal (فال) (Build 03)
 * Playful daily fortune, poetic whisper & constellation reveal.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Eye, RefreshCw, Star } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { DAILY_FORTUNES } from './homeSpotlight';

export function DailyFortune() {
  const { isRTL } = useAuth();
  const [fortuneIndex, setFortuneIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const fortune = DAILY_FORTUNES[fortuneIndex % DAILY_FORTUNES.length];

  const handleNextFortune = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(false);
    setTimeout(() => {
      setFortuneIndex((prev) => (prev + 1) % DAILY_FORTUNES.length);
      setIsRevealed(true);
    }, 200);
  };

  return (
    <div
      onClick={() => setIsRevealed(!isRevealed)}
      className="group relative p-5 sm:p-6 rounded-[28px] cursor-pointer overflow-hidden transition-all duration-300 bg-[#090A0F] border border-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_18px_40px_-10px_rgba(0,0,0,0.7)] hover:border-white/[0.06] select-none"
    >
      {/* Celestial Background Nebula Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-rose-500/[0.06] rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 text-xs">
            {fortune.symbol}
          </span>
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-violet-300">
            {isRTL ? 'فال و نجوا' : 'Daily Fortune & Whisper'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] text-[#92929B] border border-white/[0.04]">
            {isRTL ? 'سرگرمی و دلگرمی' : 'Playful'}
          </span>

          <button
            type="button"
            onClick={handleNextFortune}
            className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
            title={isRTL ? 'فال دیگر' : 'Another fortune'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Flip / Reveal Zone */}
      <div className="relative min-h-[96px] flex items-center justify-center my-1 z-10">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full py-4 text-center flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] group-hover:scale-105 transition-transform text-violet-300">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <p className="text-xs font-medium text-[#EDEDEF] tracking-wide">
                {isRTL ? 'برای گشودن نجوای امروز لمس کنید' : 'Tap to reveal today’s whisper'}
              </p>
              <span className="text-[10px] text-[#92929B]">
                {isRTL ? fortune.categoryFa : fortune.categoryEn}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="w-full space-y-2.5"
            >
              <p className="text-sm font-medium text-[#EDEDEF] leading-relaxed tracking-wide font-persian-luxury">
                "{isRTL ? fortune.whisperFa : fortune.whisperEn}"
              </p>

              {fortune.hafezVerse && isRTL && (
                <div className="text-xs text-violet-300/80 italic font-serif text-left rtl:text-right pt-1">
                  ~ {fortune.hafezVerse}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.025] text-[10px] text-[#92929B] relative z-10">
        <span>{isRTL ? 'نیت قلبی' : 'Personal delight moment'}</span>
        <span className="text-violet-400 font-medium group-hover:underline">
          {isRevealed ? (isRTL ? 'بستن' : 'Close') : isRTL ? 'گشودن فال' : 'Reveal'}
        </span>
      </div>
    </div>
  );
}
