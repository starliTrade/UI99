/**
 * UI99 — Music Moment (Now / Today in Music) (Build 03)
 * Media-first visual surface showcasing UI99's soundtrack & ambient focus music.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Music, Disc3, Radio, Sparkles, Plus, Volume2 } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface MusicMomentProps {
  songObject?: BaseObject;
  onSelectObject: (obj: BaseObject) => void;
  onCaptureMusic: () => void;
}

export function MusicMoment({ songObject, onSelectObject, onCaptureMusic }: MusicMomentProps) {
  const { isRTL } = useAuth();

  if (!songObject) {
    return (
      <div
        onClick={onCaptureMusic}
        className="group relative p-5 rounded-(var(--radius-xl)) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0B0C11] border border-white/[0.025] hover:border-white/[0.06] shadow-(var(--rim-soft), var(--elevation-3)) flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-400 group-hover:text-rose-400 transition-colors">
            <Music className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#EDEDEF]">
              {isRTL ? 'موسیقی و نوای آرامش' : 'Today in Music'}
            </h4>
            <p className="text-xs text-[#92929B] mt-0.5">
              {isRTL ? 'هنوز موسیقی ثبت نشده — قطعه محبوبت را اضافه کن' : 'Nothing playing yet — save your mood soundtrack'}
            </p>
          </div>
        </div>

        <span className="p-2 rounded-full bg-white/[0.03] text-zinc-400 group-hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </span>
      </div>
    );
  }

  const artist = songObject.metadata?.artist || 'Arvo Pärt';
  const album = songObject.metadata?.album || 'Alina';
  const mood = songObject.metadata?.mood || 'Calm & Contemplative';
  const duration = songObject.metadata?.duration || '9:32';

  return (
    <div
      onClick={() => onSelectObject(songObject)}
      className="group relative p-5 sm:p-6 rounded-(var(--radius-xl)) cursor-pointer overflow-hidden transition-all duration-300 bg-[#090A0F] border border-white/[0.025] shadow-(var(--rim-soft), var(--elevation-3)) hover:border-white/[0.06] select-none"
    >
      {/* Ambient background disc aura */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-rose-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/15 text-rose-400">
            <Music className="w-3 h-3 stroke-[2.2]" />
          </span>
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#EDEDEF]">
            {isRTL ? 'نوای امروز' : 'Today in Music'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[10px] text-rose-300 border border-white/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>{mood}</span>
        </div>
      </div>

      {/* Media Player Showcase */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Vinyl / Cover Art representation */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#1E1C2E] via-[#12131C] to-[#0A0B10] border border-white/[0.08] shadow-(var(--rim-soft), var(--elevation-2)) flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center bg-black/40"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-(var(--glow-rose-sm))" />
          </motion.div>
        </div>

        {/* Track Metadata */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[#EDEDEF] truncate leading-snug">
            {songObject.title}
          </h3>
          <p className="text-xs text-[#92929B] truncate mt-0.5">
            {artist} <span className="text-zinc-600">•</span> {album}
          </p>

          {/* Equalizer Bars Graphic */}
          <div className="flex items-center gap-1 mt-2.5">
            {[40, 75, 55, 90, 60, 80, 45].map((height, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${height * 0.4}%`, `${height}%`, `${height * 0.4}%`] }}
                transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 bg-rose-500/70 rounded-full h-3"
              />
            ))}
            <span className="text-[10px] font-mono text-zinc-500 ml-2 rtl:mr-2 rtl:ml-0">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
