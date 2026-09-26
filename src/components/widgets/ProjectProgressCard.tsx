/**
 * UI99 — Project Progress Capsule Widget
 * Pixel-perfect adaptation of IMG_7885.jpeg to the unified obsidian palette:
 * - Ultra-close surface (#101114) matching IMG_7872
 * - Micro-hairline border-white/[0.04]
 * - Luminous gradient neon progress pill with embedded deadline inside the track
 * - Rounded-square collaborator avatars & frosted "More details →" pill action
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../core/context/AppContext';
import { ObjectType } from '../../core/types/objects';

interface ProjectProgressCardProps {
  title?: string;
  category?: string;
  progress?: number;
  dueDate?: string;
  collaboratorsCount?: number;
  collaboratorImages?: string[];
  onClick?: () => void;
}

export function ProjectProgressCard({
  title = 'Project Progress',
  category = 'Onboarding prototype',
  progress = 65,
  dueDate = 'Due July 28',
  collaboratorsCount = 3,
  collaboratorImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  ],
  onClick,
}: ProjectProgressCardProps) {
  const { openCapture, themeMode } = useApp();
  const isDark = themeMode === 'dark';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-(--radius-xl) p-6 overflow-hidden transition-all select-none group ${
        isDark
          ? 'bg-(--bg-card) card-aura-emerald shadow-(--shadow-card)'
          : 'bg-white card-aura-emerald shadow-(--shadow-card) border border-black/[0.045] hover:shadow-(--elevation-3)'
      }`}
    >
      {/* Top-Right Emerald Light Beam */}
      <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-(--radius-pill) blur-2xl pointer-events-none ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-500/10'}`} />

      {/* Top row: Sparkle icon */}
      <div className="flex items-center gap-2 mb-2.5 relative z-content">
        <div
          className={`w-6 h-6 rounded-(--radius-pill) flex items-center justify-center transition-colors ${
            isDark ? 'bg-white/[0.08] text-white/90' : 'bg-black/[0.05] text-black/80'
          }`}
        >
          <svg
            className="w-3.5 h-3.5 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        </div>
      </div>

      {/* Title & Category Capsule Tag */}
      <div className="flex items-center gap-2.5 flex-wrap mb-1 relative z-content">
        <h3 className={`type-body-lg sm:type-body-lg font-semibold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
          {title}
        </h3>
        <span className="px-2.5 py-0.5 rounded-(--radius-pill) type-caption font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
          {category}
        </span>
      </div>

      {/* High-Contrast Percentage */}
      <div className="my-2 flex items-baseline relative z-content">
        <span className={`type-display sm:type-display font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
          {progress}
        </span>
        <span className={`type-title sm:type-heading font-semibold ml-0.5 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
          %
        </span>
      </div>

      {/* Luminous Capsule Progress Track with Embedded Due Date */}
      <div className={`my-4 relative w-full h-11 rounded-(--radius-pill) overflow-hidden p-1 flex items-center shadow-(--elevation-2) relative z-content ${isDark ? 'bg-black/40' : 'bg-black/[0.06]'}`}>
        {/* Harmonious Gradient Filled Pill */}
        <div
          className="h-full rounded-(--radius-pill) bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-300 shadow-(--glow-accent-lg) transition-all dur-progress ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Embedded Deadline Label inside the track on the right */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none type-caption font-semibold tracking-tight ${progress > 75 ? 'text-zinc-950 font-bold' : isDark ? 'text-white drop-shadow-sm' : 'text-zinc-700'}`}>
          {dueDate}
        </div>
      </div>

      {/* Bottom Row: Collaborators & Action Button */}
      <div className="mt-4 pt-1 flex items-end justify-between gap-3 relative z-content">
        <div>
          <span className={`block type-caption font-medium mb-2 tracking-tight ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Collaborators {collaboratorsCount}
          </span>
          <div className="flex items-center gap-1.5">
            {collaboratorImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Collaborator"
                className={`w-8 h-8 rounded-(--radius-sm) object-cover ring-1 ${isDark ? 'ring-white/15' : 'ring-black/10'}`}
              />
            ))}
          </div>
        </div>

        {/* Frosted Action Capsule Pill */}
        <button
          type="button"
          onClick={onClick || (() => openCapture(ObjectType.PROJECT))}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-(--radius-pill) type-caption font-semibold cursor-pointer transition-all active:scale-95 ${
            isDark
              ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white shadow-(--shadow-card)'
              : 'bg-black/[0.05] hover:bg-black/[0.08] text-[#111116] shadow-(--elevation-1)'
          }`}
        >
          <span>More details</span>
          <ArrowRight className="icon-sm" />
        </button>
      </div>
    </motion.div>
  );
}
