/**
 * UI99 — Daily Spending Widget
 * Pixel-perfect implementation of IMG_7886.jpeg:
 * - Ambient illuminated segmented neon circle ring encircling the widget
 * - Squircle container (rounded-(--radius-2xl) with 3D glass specular rim
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
    'bg-[#F97316] shadow-(--glow-warning-sm)',
    'bg-[#FB923C] shadow-(--glow-warning-sm)',
    'bg-[#F59E0B] shadow-(--glow-warning-sm)',
    'bg-[#FBBF24] shadow-(--glow-warning-sm)',
    'bg-[#F43F5E] shadow-(--glow-rose-sm)',
    'bg-[#EC4899] shadow-(--glow-rose-sm)',
    'bg-[#D946EF] shadow-(--glow-rose-sm)',
    'bg-[#C084FC] shadow-(--glow-accent-sm)',
    'bg-[#A855F7] shadow-(--glow-accent-sm)',
    'bg-[#818CF8] shadow-(--glow-accent-sm)',
    'bg-[#6366F1] shadow-(--glow-accent-sm)',
    'bg-[#3B82F6] shadow-(--glow-accent-sm)',
    'bg-[#38BDF8] shadow-(--glow-accent-sm)',
    'bg-[#22D3EE] shadow-(--glow-accent-sm)',
    'bg-[#2DD4BF] shadow-(--glow-accent-sm)',
    'bg-[#34D399] shadow-(--glow-accent-sm)',
    'bg-[#10B981] shadow-(--glow-accent-sm)',
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
        className={`relative z-content w-full rounded-(--radius-xl) p-6 overflow-hidden select-none transition-all dur-slow ${
          isDark
            ? 'bg-(--bg-card) card-aura-sunset shadow-(--shadow-card)'
            : 'bg-white card-aura-sunset shadow-(--shadow-card) border border-black/[0.045] hover:shadow-(--elevation-3)'
        }`}
      >
        {/* Subtle Ambient Sunset Glow at Top Center */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 rounded-(--radius-pill) blur-2xl pointer-events-none ${isDark ? 'bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-orange-500/8 via-purple-500/8 to-pink-500/8'}`} />

        {/* Monospace Tracked Header */}
        <span className={`block type-micro font-mono tracking-widest uppercase ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
          {title}
        </span>

        {/* Amount & Percentage Row */}
        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className={`type-display sm:type-display font-bold tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-[#111116]'}`}>
              {totalAmount}
            </span>
            <span className={`type-title sm:type-heading font-medium ${isDark ? 'text-white/40' : 'text-black/35'}`}>
              {cents}
            </span>
          </div>

          <span className={`type-body font-semibold tracking-tight ${isDark ? 'text-white/70' : 'text-[#111116]/70'}`}>
            {percentage}
          </span>
        </div>

        {/* 22-Segment Glowing Rainbow Equalizer Barcode */}
        <div className="my-5 flex items-center justify-between gap-1 overflow-hidden">
          {spectrumColors.map((colorClass, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-6 rounded-(--radius-pill) ${colorClass} transition-all dur-slow hover:scale-110`}
            />
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2.5 pt-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between type-caption sm:type-body">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-3.5 rounded-(--radius-pill) ${item.colorClass} shadow-(--glow-current-sm)`} />
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
