/**
 * UI99 — Ultra-Refined Frosted Liquid-Glass Capsule Dock
 * Compact sizing, JetBrains Mono typography, and velvet active cushion
 */

import React from 'react';
import { LayoutGrid, Layers, BookOpen, Palette, LayoutTemplate, Search } from 'lucide-react';
import { useApp, NavTab } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { motion } from 'motion/react';

export function BottomNavigation() {
  const { currentTab, setCurrentTab, setIsSearchOpen, themeMode } = useApp();
  const { isRTL } = useAuth();
  const isDark = themeMode === 'dark';

  const navItems: {
    tab: NavTab;
    label: string;
    faLabel: string;
    icon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      tab: 'HOME',
      label: 'Home',
      faLabel: 'خانه',
      icon: (active: boolean) => (
        <LayoutGrid
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            active
              ? isDark
                ? 'stroke-(--text-primary) stroke-[2]'
                : 'stroke-zinc-950 stroke-[2]'
              : isDark
              ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
          }`}
        />
      ),
    },
    {
      tab: 'UIKIT',
      label: 'UI Kit',
      faLabel: 'کیت',
      icon: (active: boolean) => (
        <Layers
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            active
              ? isDark
                ? 'stroke-(--text-primary) stroke-[2]'
                : 'stroke-zinc-950 stroke-[2]'
              : isDark
              ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
          }`}
        />
      ),
    },
    {
      tab: 'DOCS',
      label: 'Docs',
      faLabel: 'مستندات',
      icon: (active: boolean) => (
        <BookOpen
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            active
              ? isDark
                ? 'stroke-(--text-primary) stroke-[2]'
                : 'stroke-zinc-950 stroke-[2]'
              : isDark
              ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
          }`}
        />
      ),
    },
    {
      tab: 'FOUNDATIONS',
      label: 'Tokens',
      faLabel: 'توکن‌ها',
      icon: (active: boolean) => (
        <Palette
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            active
              ? isDark
                ? 'stroke-(--text-primary) stroke-[2]'
                : 'stroke-zinc-950 stroke-[2]'
              : isDark
              ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
          }`}
        />
      ),
    },
    {
      tab: 'BLOCKS',
      label: 'Blocks',
      faLabel: 'قالب‌ها',
      icon: (active: boolean) => (
        <LayoutTemplate
          className={`w-3.5 h-3.5 transition-colors duration-150 ${
            active
              ? isDark
                ? 'stroke-(--text-primary) stroke-[2]'
                : 'stroke-zinc-950 stroke-[2]'
              : isDark
              ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
          }`}
        />
      ),
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 px-3 sm:px-6 pb-safe pt-1 pointer-events-none flex justify-center items-center mb-2.5 sm:mb-3.5 w-full"
      dir="ltr"
    >
      <div className="pointer-events-auto flex items-center justify-center gap-1.5 w-full max-w-[380px] mx-auto">
        {/* Compact Liquid Glass Capsule Dock */}
        <div
          className={`relative flex-1 flex items-center justify-between p-0.5 sm:p-1 rounded-full select-none transition-all duration-300 ${
            isDark
              ? 'liquid-glass-dark-dock'
              : 'liquid-glass-light-dock'
          }`}
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;

            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setCurrentTab(item.tab)}
                className="group relative flex-1 min-h-[36px] sm:min-h-[38px] py-1 px-1 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none"
                title={isRTL ? item.faLabel : item.label}
                aria-label={item.label}
              >
                {/* Ultra-soft, understated active cushion with velvet warmth */}
                {isActive && (
                  <motion.div
                    layoutId="glassCushionActive"
                    className={`absolute inset-0.5 rounded-full ${
                      isDark
                        ? 'bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                        : 'liquid-glass-light-active-cushion'
                    }`}
                    transition={{ type: 'spring', stiffness: 460, damping: 38 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  {item.icon(isActive)}
                  <span
                    className={`font-mono text-[8.5px] sm:text-[9.5px] tracking-tight transition-colors duration-150 whitespace-nowrap ${
                      isActive
                        ? isDark ? 'text-(--text-primary) font-semibold' : 'text-zinc-950 font-semibold'
                        : isDark ? 'text-(--text-muted) group-hover:text-zinc-200 font-normal' : 'text-zinc-500 group-hover:text-zinc-900 font-normal'
                    }`}
                  >
                    {isRTL ? item.faLabel : item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Companion Circular Liquid Glass Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={`relative min-w-[36px] min-h-[36px] sm:min-w-[38px] sm:min-h-[38px] w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full active:scale-95 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none ${
            isDark
              ? 'liquid-glass-dark-dock hover:bg-(--bg-elevated)/70 text-(--text-muted) hover:text-(--text-primary)'
              : 'liquid-glass-light-dock hover:bg-white/60 text-zinc-600 hover:text-zinc-950'
          }`}
          title="Search & Spotlight (⌘K)"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5 stroke-[1.8]" />
        </button>
      </div>
    </nav>
  );
}

