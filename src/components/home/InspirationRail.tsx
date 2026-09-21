/**
 * SAFA — Inspiration Rail (Saved For Later & Visual Worlds) (Build 03)
 * Pinterest-style horizontal visual rail for aesthetics, architecture, and moodboards.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image, Compass, ArrowUpRight, Plus, Eye } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface InspirationRailProps {
  items: BaseObject[];
  onSelectItem: (obj: BaseObject) => void;
  onAddInspiration: () => void;
}

export function InspirationRail({ items, onSelectItem, onAddInspiration }: InspirationRailProps) {
  const { isRTL } = useAuth();

  return (
    <div className="space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400">
            <Compass className="w-2.5 h-2.5 stroke-[2.2]" />
          </span>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#92929B]">
            {isRTL ? 'الهام‌های بصری و ایده‌ها' : 'Inspiration & Aesthetics'}
          </h3>
        </div>

        <button
          type="button"
          onClick={onAddInspiration}
          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>{isRTL ? 'ذخیره تصویر' : 'Save Inspiration'}</span>
        </button>
      </div>

      {/* Horizontal Scroll Rail */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-2 px-2 sm:mx-0 sm:px-0">
        {items.length === 0 ? (
          <div
            onClick={onAddInspiration}
            className="w-full min-w-[280px] p-5 rounded-[24px] bg-[#0B0C11] border border-white/[0.025] hover:border-white/[0.06] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center text-zinc-400">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#EDEDEF]">
                  {isRTL ? 'ثبت اولین تصویر الهام‌بخش' : 'Save your first visual mood'}
                </p>
                <p className="text-[10px] text-[#92929B] mt-0.5">
                  {isRTL ? 'معماری، پالت، خطوط و مناظر' : 'Architecture, textures, and landscapes'}
                </p>
              </div>
            </div>
            <Plus className="w-4 h-4 text-emerald-400" />
          </div>
        ) : (
          items.map((item, idx) => {
            const category = item.metadata?.category || 'Aesthetic';
            const location = item.metadata?.location;
            const palette: string[] = item.metadata?.palette || ['#3A3B43', '#8C8C96'];

            return (
              <motion.div
                key={item.id}
                onClick={() => onSelectItem(item)}
                whileHover={{ y: -2 }}
                className="w-56 sm:w-64 shrink-0 snap-start p-4 rounded-[24px] cursor-pointer bg-[#0A0B10] border border-white/[0.025] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_12px_28px_rgba(0,0,0,0.6)] hover:border-white/[0.06] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Visual Mood Card Header with Abstract Gradient/Texture */}
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-[#1C1D26] via-[#101117] to-[#0A0B10] border border-white/[0.05] p-3 flex flex-col justify-between relative overflow-hidden mb-3">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-[#EDEDEF] border border-white/[0.05] backdrop-blur-md">
                        {category}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-white/50" />
                    </div>

                    {/* Palette dots */}
                    <div className="flex items-center gap-1 relative z-10">
                      {palette.map((c, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Abstract Zen line aura */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-[#EDEDEF] line-clamp-1 leading-snug">
                    {item.title}
                  </h4>

                  {location && (
                    <p className="text-[10px] text-[#92929B] mt-0.5 truncate">
                      📍 {location}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.025] flex items-center justify-between text-[10px] text-[#92929B]">
                  <span>{isRTL ? 'مشاهده' : 'View mood'}</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
