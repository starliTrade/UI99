/**
 * UI99 — Daily Spending Widget
 * Pixel-perfect implementation of IMG_7886.jpeg:
 * - Ambient illuminated segmented neon circle ring encircling the widget
 * - Squircle container (rounded-[34px]) with 3D glass specular rim
 * - Monospace tracked uppercase header: "TODAY SPENDING"
 * - High-contrast amount: "$192.45" & "78%"
 * - 22-segment glowing rainbow equalizer barcode
 * - Itemized category breakdown with color pills
 */

import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../core/context/AppContext';

interface SpendingItem {
  name: string;
  amount: string;
  colorClass: string;
}

interface SpendingSpectrumCardProps {
  title?: string;
  totalAmount?: string;
  cents?: string;
  percentage?: string;
  items?: SpendingItem[];
}

export function SpendingSpectrumCard({
  title = 'TODAY SPENDING',
  totalAmount = '$192',
  cents = '.45',
  percentage = '78%',
  items = [
    { name: 'Groceries', amount: '$78.46', colorClass: 'bg-[#F97316]' },
    { name: 'Entertainment', amount: '$56.20', colorClass: 'bg-[#A855F7]' },
    { name: 'Transportation', amount: '$33.58', colorClass: 'bg-[#38BDF8]' },
    { name: 'Utilities', amount: '$24.21', colorClass: 'bg-[#34D399]' },
  ],
}: SpendingSpectrumCardProps) {
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';

  // 22 Spectrum Bars with luminous, vibrant spectrum flow
  const spectrumColors = [
    'bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.6)]',
    'bg-[#FB923C] shadow-[0_0_8px_rgba(251,146,60,0.5)]',
    'bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    'bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    'bg-[#F43F5E] shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    'bg-[#EC4899] shadow-[0_0_8px_rgba(236,72,153,0.5)]',
    'bg-[#D946EF] shadow-[0_0_8px_rgba(217,70,239,0.5)]',
    'bg-[#C084FC] shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    'bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    'bg-[#818CF8] shadow-[0_0_8px_rgba(129,140,248,0.5)]',
    'bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    'bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    'bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.5)]',
    'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    'bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.5)]',
    'bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]',
    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]',
    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]',
    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]',
    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]',
  ];

  return (
    <div className="relative w-full">
      {/* Main Card with Sunset Violet Living Aura */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className={`relative z-10 w-full rounded-[28px] p-6 overflow-hidden select-none transition-all duration-300 ${
          isDark
            ? 'bg-[#0B0C11] card-aura-sunset shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.03),0_20px_44px_-10px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_50px_-10px_rgba(0,0,0,0.85)]'
            : 'bg-white card-aura-sunset shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.045] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)]'
        }`}
      >
        {/* Subtle Ambient Sunset Glow at Top Center */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-orange-500/8 via-purple-500/8 to-pink-500/8'}`} />

        {/* Monospace Tracked Header */}
        <span className={`block text-[11px] font-mono tracking-widest uppercase ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
          {title}
        </span>

        {/* Amount & Percentage Row */}
        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className={`text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
              {totalAmount}
            </span>
            <span className={`text-xl sm:text-2xl font-medium ${isDark ? 'text-white/40' : 'text-black/35'}`}>
              {cents}
            </span>
          </div>

          <span className={`text-sm font-semibold tracking-tight ${isDark ? 'text-white/70' : 'text-[#111116]/70'}`}>
            {percentage}
          </span>
        </div>

        {/* 22-Segment Glowing Rainbow Equalizer Barcode */}
        <div className="my-5 flex items-center justify-between gap-1 overflow-hidden">
          {spectrumColors.map((colorClass, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-6 rounded-full ${colorClass} transition-all duration-300 hover:scale-110`}
            />
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2.5 pt-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-3.5 rounded-full ${item.colorClass} shadow-[0_0_8px_currentColor]`} />
                <span className={`font-medium tracking-tight ${isDark ? 'text-[#90909A]' : 'text-[#6E6E78]'}`}>
                  {item.name}
                </span>
              </div>
              <span className={`font-mono font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
