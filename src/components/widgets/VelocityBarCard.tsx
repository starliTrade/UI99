/**
 * SAFA — Income Velocity Pillar Widget
 * Pixel-perfect implementation of IMG_7892.jpeg:
 * - Squircle container (rounded-[34px]) with 3D glass specular rim
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
      className={`relative rounded-[28px] p-6 overflow-hidden transition-all duration-300 select-none ${
        isDark
          ? 'bg-[#0B0C11] card-aura-emerald shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03),0_20px_44px_-10px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_50px_-10px_rgba(0,0,0,0.85)]'
          : 'bg-white card-aura-emerald shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.045] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]'
      }`}
    >
      {/* Dynamic Ambient Emerald Light Beam in Top Corner */}
      <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-500/10'}`} />

      {/* Top Header Section */}
      <div className="relative z-10">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#8E8E98]' : 'text-zinc-600'}`}>
          {title}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            {metric}
          </h3>
        </div>

        {/* Trend Indicator Pill */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
          <span className="text-[10px]">▲</span>
          <span>{trend}</span>
        </div>
      </div>

      {/* Pillar Bar Columns */}
      <div className="mt-8 pt-2 flex items-end justify-between gap-2.5 sm:gap-3 h-36 relative z-10">
        {bars.map((bar, i) => {
          if (bar.isHighlighted) {
            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <span className={`text-[11px] font-bold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  {bar.label}
                </span>
                <div
                  className="w-full max-w-[44px] rounded-2xl bg-gradient-to-t from-emerald-500 via-emerald-400 to-lime-200 shadow-[0_0_24px_rgba(52,211,153,0.5),0_0_8px_rgba(163,230,53,0.3)] transition-all duration-500 group-hover:brightness-110"
                  style={{ height: `${bar.heightPercent}%` }}
                />
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
              <span className={`text-[11px] font-medium mb-2 tracking-tight ${isDark ? 'text-[#5C5C68]' : 'text-[#8E8E98]'}`}>
                {bar.label}
              </span>
              <div
                className={`w-full max-w-[44px] rounded-2xl transition-all ${
                  isDark
                    ? 'bg-white/[0.045] hover:bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
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
