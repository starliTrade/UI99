/**
 * UI99 — Personal Memory Moment (A Moment From Your World) (Build 03)
 * Meaningful nostalgia, memories, location traces, and shared reflections.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Sparkles, Quote, Lock, Plus, ArrowUpRight } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface MemoryMomentProps {
  memoryObject?: BaseObject;
  onSelectMemory: (memory: BaseObject) => void;
  onCaptureMemory: () => void;
}

export function MemoryMoment({ memoryObject, onSelectMemory, onCaptureMemory }: MemoryMomentProps) {
  const { isRTL } = useAuth();

  if (!memoryObject) {
    return (
      <div
        onClick={onCaptureMemory}
        className="group relative p-5 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0B0C11] border border-white/[0.025] hover:border-white/[0.06] shadow-(--shadow-card-hover) flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-(--radius-control) bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Heart className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#EDEDEF]">
              {isRTL ? 'گوشه خاطرات و لحظه‌ها' : 'A Moment From Your World'}
            </h4>
            <p className="text-xs text-[#92929B] mt-0.5">
              {isRTL ? 'یک لحظه قشنگ یا خاطره باارزش را ثبت کن' : 'Save a quiet memory or heartfelt moment'}
            </p>
          </div>
        </div>
        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
      </div>
    );
  }

  const location = memoryObject.metadata?.location || 'Côte d’Azur, France';
  const mood = memoryObject.metadata?.mood || 'Serene';
  const season = memoryObject.metadata?.season || 'Autumn';
  const hasSLO = memoryObject.permissions?.allowSLOAccess;

  const dateFormatted = new Date(memoryObject.createdAt).toLocaleDateString(
    isRTL ? 'fa-IR' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div
      onClick={() => onSelectMemory(memoryObject)}
      className="group relative p-5 sm:p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0A0B10] border border-white/[0.025] shadow-(--shadow-card-hover) hover:border-white/[0.06] select-none"
    >
      {/* Violet Ambient Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/[0.06] rounded-(--radius-pill) blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-violet-500/15 text-violet-400">
            <Heart className="w-3 h-3 stroke-[2.2]" />
          </span>
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-violet-300">
            {isRTL ? 'گوشه خاطره‌ها' : 'A Moment From Your World'}
          </span>
        </div>

        {hasSLO && (
          <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-(--radius-pill) bg-rose-500/10 text-rose-300 border border-rose-500/20">
            SLO Shared
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-base sm:text-lg font-bold text-[#EDEDEF] tracking-tight leading-snug">
          "{memoryObject.title}"
        </h3>

        {memoryObject.description && (
          <p className="text-xs text-[#92929B] leading-relaxed font-serif italic line-clamp-2">
            {memoryObject.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-white/[0.025] flex items-center justify-between text-[10.5px] text-[#92929B] relative z-10">
        <div className="flex items-center gap-2">
          <span>📍 {location}</span>
          <span>•</span>
          <span>{dateFormatted}</span>
        </div>

        <span className="text-violet-400 group-hover:underline flex items-center gap-1 font-medium">
          <span>{isRTL ? 'مرور خاطره' : 'Relive'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
