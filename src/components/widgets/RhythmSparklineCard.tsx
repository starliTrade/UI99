/**
 * UI99 — Ethereum Sparkline Widget
 * Pixel-perfect implementation of IMG_7716.jpeg:
 * - Squircle container (rounded-[34px]) with 3D glass specular rim
 * - Authentic sapphire/ice-blue glass reflection along top-right curve
 * - Ethereum diamond icon & typography
 * - Sparkline with vertical micro guides
 * - Floating dark tooltip pill with $68.22, date, hairline connector & glowing dot
 */

import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../core/context/AppContext';

interface RhythmSparklineCardProps {
  title?: string;
  subtitle?: string;
  value?: string;
  trend?: string;
  tooltipValue?: string;
  tooltipDate?: string;
}

export function RhythmSparklineCard({
  title = 'Ethereum',
  subtitle = 'ETH',
  value = '$2,593.16',
  trend = '0.23%',
  tooltipValue = '$68.22',
  tooltipDate = '16 Sep, 2024',
}: RhythmSparklineCardProps) {
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-[28px] p-6 overflow-hidden transition-all duration-300 select-none ${
        isDark
          ? 'bg-[#0B0C11] card-aura-sapphire shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03),0_20px_44px_-10px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_50px_-10px_rgba(0,0,0,0.85)]'
          : 'bg-white card-aura-sapphire shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.045] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]'
      }`}
    >
      {/* Top-Right Sapphire Ambient Light Beam */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-blue-500/15' : 'bg-blue-500/10'}`} />

      {/* Top Header: Brand & Diamond Icon */}
      <div className="relative z-10 flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white'
              : 'bg-black/[0.06] text-[#111116]'
          }`}
        >
          <svg className={`w-3.5 h-3.5 ${isDark ? 'fill-white' : 'fill-[#111116]'}`} viewBox="0 0 24 24">
            <path d="M12 1.5L4.5 12.25L12 16.5L19.5 12.25L12 1.5Z" opacity="0.85" />
            <path d="M12 17.5L4.5 13.5L12 23.5L19.5 13.5L12 17.5Z" />
          </svg>
        </div>

        <div>
          <h4 className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
            {title}
          </h4>
          <span className={`text-[11px] font-mono tracking-wider uppercase ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            {subtitle}
          </span>
        </div>
      </div>

      {/* Main Metric & Green Trend */}
      <div className="mt-3 relative z-10">
        <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
          {value}
        </h3>
        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
          <span className="text-[10px]">▲</span>
          <span>{trend}</span>
        </div>
      </div>

      {/* Organic Crypto Chart with Vertical Micro Guidelines & Floating Tooltip */}
      <div className="mt-6 relative h-32 w-full z-10">
        {/* Subtle Vertical Guidelines */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-[0.05]">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className={`w-[1px] h-full ${isDark ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>

        {/* Floating Tooltip with Vertical Hairline & Subtle Dot on Peak */}
        <div className="absolute left-[50%] top-2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
          <div
            className={`px-3.5 py-1.5 rounded-xl backdrop-blur-md text-center transition-all ${
              isDark
                ? 'bg-[#14151C]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_20px_rgba(0,0,0,0.6)] text-white'
                : 'bg-white/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_6px_16px_rgba(0,0,0,0.08)] border border-black/[0.04] text-[#111116]'
            }`}
          >
            <span className={`block text-[11px] font-mono font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
              {tooltipValue}
            </span>
            <span className={`block text-[9px] font-medium ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
              {tooltipDate}
            </span>
          </div>
          <div className={`w-[1px] h-4 ${isDark ? 'bg-gradient-to-b from-white/30 to-white/10' : 'bg-gradient-to-b from-black/20 to-black/5'}`} />
          <div className={`w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] ring-2 ${isDark ? 'ring-[#0E0F14]' : 'ring-white'}`} />
        </div>

        {/* Organic Sparkline SVG Curve with luminous gradient */}
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 300 90"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={isDark ? '0.15' : '0.12'} />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 65 Q 25 64 45 70 T 85 65 T 115 72 T 130 35 L 140 42 L 150 28 L 160 48 L 170 38 L 185 54 L 200 42 L 220 64 L 250 48 L 280 60 L 300 45 L 300 90 L 0 90 Z"
            fill="url(#chartFill)"
          />
          <path
            d="M 0 65 Q 25 64 45 70 T 85 65 T 115 72 T 130 35 L 140 42 L 150 28 L 160 48 L 170 38 L 185 54 L 200 42 L 220 64 L 250 48 L 280 60 L 300 45"
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}
