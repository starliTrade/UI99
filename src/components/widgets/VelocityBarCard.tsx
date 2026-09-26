/**
 * UI99 — Income Velocity Pillar Widget
 * Pixel-perfect implementation of IMG_7892.jpeg:
 * - Squircle container (rounded-(--radius-2xl) with 3D glass specular rim
 * - Authentic emerald/cyan glass corner refraction along top-left curve
 * - Typography: "Income", "+ $6,593.00", "▲ 0.23%"
 * - Soft dark matte columns with rounded tops for inactive months
 * - Radiant, luminous neon gradient pillar for "Aug" with ambient glow
 */

import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../core/context/AppContext';

interface VelocityBarCardProps {
  title?: string;
  metric?: string;
  trend?: string;
  bars?: { label: string; heightPercent: number; isHighlighted?: boolean }[];
}

export function VelocityBarCard({
  title = 'Income',
  metric = '+ $6,593.00',
  trend = '0.23%',
  bars = [
    { label: 'Mar', heightPercent: 35 },
    { label: 'Apr', heightPercent: 55 },
    { label: 'May', heightPercent: 28 },
    { label: 'June', heightPercent: 65 },
    { label: 'July', heightPercent: 22 },
    { label: 'Aug', heightPercent: 92, isHighlighted: true },
  ],
}: VelocityBarCardProps) {
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-(--radius-xl) p-6 overflow-hidden transition-all dur-slow select-none ${
        isDark
          ? 'bg-(--bg-card) card-aura-emerald shadow-(--shadow-card)'
          : 'bg-white card-aura-emerald shadow-(--shadow-card) border border-black/[0.045] hover:shadow-(--elevation-3)'
      }`}
    >
      {/* Dynamic Ambient Emerald Light Beam in Top Corner */}
      <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-(--radius-pill) blur-2xl pointer-events-none ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-500/10'}`} />

      {/* Top Header Section */}
      <div className="relative z-content">
        <span className={`type-caption font-semibold uppercase tracking-wider ${isDark ? 'text-[#8E8E98]' : 'text-zinc-600'}`}>
          {title}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <h3 className={`type-heading sm:type-display font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            {metric}
          </h3>
        </div>

        {/* Trend Indicator Pill */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-(--radius-pill) type-caption font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
          <span className="type-micro">▲</span>
          <span>{trend}</span>
        </div>
      </div>

      {/* Pillar Bar Columns */}
      <div className="mt-8 pt-2 flex items-end justify-between gap-2.5 sm:gap-3 h-36 relative z-content">
        {bars.map((bar, i) => {
          if (bar.isHighlighted) {
            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <span className={`type-micro font-bold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  {bar.label}
                </span>
                <div
                  className="w-full max-w-[44px] rounded-(--radius-control) bg-gradient-to-t from-emerald-500 via-emerald-400 to-lime-200 shadow-(--shadow-glow-accent) transition-all dur-lazy group-hover:brightness-110"
                  style={{ height: `${bar.heightPercent}%` }}
                />
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
              <span className={`type-micro font-medium mb-2 tracking-tight ${isDark ? 'text-[#5C5C68]' : 'text-[#8E8E98]'}`}>
                {bar.label}
              </span>
              <div
                className={`w-full max-w-[44px] rounded-(--radius-control) transition-all ${
                  isDark
                    ? 'bg-white/[0.045] hover:bg-white/[0.08] shadow-(--elevation-1)'
                    : 'bg-black/[0.04] hover:bg-black/[0.07]'
                }`}
                style={{ height: `${bar.heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
