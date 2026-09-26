/**
 * UI99 — Travel & Dream Moment (Dreaming About) (Build 03)
 * Travel dreams, wanderlust destinations, and future serene voyages.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Plane, MapPin, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface TravelMomentProps {
  tripObject?: BaseObject;
  onSelectTrip: (trip: BaseObject) => void;
  onAddTrip: () => void;
}

export function TravelMoment({ tripObject, onSelectTrip, onAddTrip }: TravelMomentProps) {
  const { isRTL } = useAuth();

  if (!tripObject) {
    return (
      <div
        onClick={onAddTrip}
        className="group relative p-5 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all dur-slow bg-(--bg-card) border border-white/[0.025] hover:border-white/[0.04] shadow-(--shadow-card-hover) flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-(--radius-control) bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Plane className="icon-lg stroke-[1.8]" />
          </div>
          <div>
            <h4 className="type-body font-semibold text-[#EDEDEF]">
              {isRTL ? 'رویاهای سفر و مکان‌ها' : 'Dreaming About'}
            </h4>
            <p className="type-caption text-[#92929B] mt-0.5">
              {isRTL ? 'مقصد رویایی بعدی‌ات کجاست؟' : 'Where would you love to go next?'}
            </p>
          </div>
        </div>
        <Plus className="icon-md text-zinc-400 group-hover:text-white transition-colors" />
      </div>
    );
  }

  const location = tripObject.metadata?.location || 'Amalfi Coast, Italy';
  const season = tripObject.metadata?.season || 'Spring 2027';
  const wishlist: string[] = tripObject.metadata?.wishlist || [
    'Cliffside studio',
    'Ceramic workshop',
    'Sunset aperitivo',
  ];

  return (
    <div
      onClick={() => onSelectTrip(tripObject)}
      className="group relative p-5 sm:p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all dur-slow bg-(--bg-surface) border border-white/[0.025] shadow-(--shadow-card-hover) hover:border-white/[0.04] select-none"
    >
      {/* Cyan/Teal Ambient Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/[0.05] rounded-(--radius-pill) blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-content">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-cyan-500/15 text-cyan-400">
            <Plane className="icon-xs stroke-[2.2]" />
          </span>
          <span className="type-micro uppercase font-bold tracking-widest text-cyan-300">
            {isRTL ? 'رویای سفر و آرامش' : 'Dreaming About'}
          </span>
        </div>

        <span className="type-micro px-2.5 py-0.5 rounded-(--radius-pill) bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
          {season}
        </span>
      </div>

      {/* Title and Description */}
      <div className="space-y-2 relative z-content">
        <h3 className="type-body-lg sm:type-body-lg font-bold text-[#EDEDEF] tracking-tight leading-snug">
          {tripObject.title}
        </h3>

        {tripObject.description && (
          <p className="type-caption text-[#92929B] leading-relaxed line-clamp-2">
            {tripObject.description}
          </p>
        )}

        {/* Wishlist tags */}
        <div className="pt-2 flex flex-wrap gap-1.5">
          {wishlist.map((item, idx) => (
            <span
              key={idx}
              className="type-micro px-2.5 py-0.5 rounded-(--radius-pill) bg-white/[0.04] text-[#EDEDEF] border border-white/[0.04]"
            >
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-white/[0.025] flex items-center justify-between type-micro text-[#92929B] relative z-content">
        <span>📍 {location}</span>
        <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-medium">
          <span>{isRTL ? 'مشاهده رویا' : 'View Dream'}</span>
          <ArrowUpRight className="icon-xs" />
        </span>
      </div>
    </div>
  );
}
