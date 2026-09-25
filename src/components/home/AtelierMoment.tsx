/**
 * UI99 — Creative & Fashion Atelier Moment (Build 03)
 * Large editorial preview of UI99's fashion projects, textile palettes & design sketches.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Palette, Scissors, ArrowUpRight, Plus, Layers } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface AtelierMomentProps {
  atelierProject?: BaseObject;
  sketchObject?: BaseObject;
  onSelectObject: (obj: BaseObject) => void;
  onNewDesign: () => void;
}

export function AtelierMoment({
  atelierProject,
  sketchObject,
  onSelectObject,
  onNewDesign,
}: AtelierMomentProps) {
  const { isRTL } = useAuth();

  if (!atelierProject) {
    return (
      <div
        onClick={onNewDesign}
        className="group relative p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#0B0C11] border border-white/[0.025] hover:border-white/[0.06] shadow-(--shadow-card-hover)"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-(--radius-control) bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Scissors className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#EDEDEF]">
                {isRTL ? 'کارگاه طراحی و آتلیه' : 'Atelier & Design World'}
              </h4>
              <p className="text-xs text-[#92929B] mt-0.5">
                {isRTL ? 'طرح جدید، پالت رنگ یا الگوی پارچه را ثبت کن' : 'Your next collection or silhouette is waiting'}
              </p>
            </div>
          </div>
          <span className="p-2.5 rounded-(--radius-pill) bg-white/[0.03] text-zinc-400 group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </span>
        </div>
      </div>
    );
  }

  const stage = atelierProject.metadata?.stage || 'Fabric Sourcing & Draping';
  const palette: string[] = atelierProject.metadata?.palette || ['#E7DFD5', '#24242A', '#8F7E6B', '#141418'];
  const fabrics: string[] = atelierProject.metadata?.fabrics || ['Mulberry Silk', 'Merino Wool', 'Raw Linen'];
  const silhouette = atelierProject.metadata?.silhouette || 'Architectural Minimalist';

  return (
    <div
      onClick={() => onSelectObject(atelierProject)}
      className="group relative p-5 sm:p-6 rounded-(--radius-2xl) cursor-pointer overflow-hidden transition-all duration-300 bg-[#090A0E] border border-white/[0.03] shadow-(--shadow-popover) hover:border-white/[0.07] select-none"
    >
      {/* Warm Ambient Amber/Bronze Aura */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-amber-600/[0.07] rounded-(--radius-pill) blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-amber-500/15 text-amber-400">
            <Scissors className="w-3 h-3 stroke-[2.2]" />
          </span>
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-amber-400">
            {isRTL ? 'آتلیه طراحی' : 'Atelier Moment'}
          </span>
        </div>

        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-(--radius-pill) bg-amber-500/10 text-amber-300 border border-amber-500/20">
          {stage}
        </span>
      </div>

      {/* Main Editorial Showcase */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-lg sm:text-xl font-bold text-[#EDEDEF] tracking-tight leading-snug">
          {atelierProject.title}
        </h3>

        {atelierProject.description && (
          <p className="text-xs text-[#92929B] leading-relaxed line-clamp-2">
            {atelierProject.description}
          </p>
        )}

        {/* Swatches & Fabric Composition Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {/* Color Swatches */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-medium mr-1 rtl:ml-1 rtl:mr-0">
              {isRTL ? 'پالت رنگ:' : 'Palette:'}
            </span>
            {palette.map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-(--radius-pill) border border-white/[0.15] shadow-xs"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Silhouette badge */}
          <div className="flex items-center gap-1.5">
            {fabrics.slice(0, 2).map((fabric, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-(--radius-pill) bg-white/[0.04] text-[#EDEDEF] border border-white/[0.04]"
              >
                {fabric}
              </span>
            ))}
          </div>
        </div>

        {/* Optional Linked Sketch preview */}
        {sketchObject && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectObject(sketchObject);
            }}
            className="mt-2 p-3 rounded-(--radius-control) bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-(--radius-pill) bg-amber-400/70" />
              <span className="text-xs text-[#EDEDEF] truncate font-medium">
                {sketchObject.title}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 shrink-0 font-medium">
              {isRTL ? 'مشاهده طرح' : 'View Sketch'} →
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between text-xs text-[#92929B] relative z-10">
        <span className="text-[11px]">{silhouette}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
          <span>{isRTL ? 'ورود به آتلیه' : 'Explore Atelier'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
