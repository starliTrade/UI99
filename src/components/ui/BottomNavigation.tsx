/**
 * SAFA — Ultra-Refined Frosted Liquid-Glass Capsule Dock & Companion Action
 * Authentic Liquid Glassmorphism:
 * - Ultra-subtle, whisper-thin border with velvety seamless fusion
 * - Soft, understated active indicator with smooth spring motion
 * - Curated luxury icon set from lucide-react (LayoutGrid, Compass, SquarePen, Waves, Inbox, Search)
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
          className={`w-[16.5px] h-[16.5px] transition-colors duration-200 ${
            active
              ? isDark
                ? 'stroke-[#EDEDEF] stroke-[1.9]'
                : 'stroke-zinc-900 stroke-[1.9]'
              : isDark
              ? 'stroke-[#85858F] group-hover:stroke-zinc-300 stroke-[1.5]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.5]'
          }`}
        />
      ),
    },
    {
      tab: 'UIKIT',
      label: 'UI Kit',
      faLabel: 'کیت اجزا',
      icon: (active: boolean) => (
        <Layers
          className={`w-[16.5px] h-[16.5px] transition-colors duration-200 ${
            active
              ? isDark
                ? 'stroke-[#EDEDEF] stroke-[1.9]'
                : 'stroke-zinc-900 stroke-[1.9]'
              : isDark
              ? 'stroke-[#85858F] group-hover:stroke-zinc-300 stroke-[1.5]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.5]'
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
          className={`w-[16.5px] h-[16.5px] transition-colors duration-200 ${
            active
              ? isDark
                ? 'stroke-[#EDEDEF] stroke-[1.9]'
                : 'stroke-zinc-900 stroke-[1.9]'
              : isDark
              ? 'stroke-[#85858F] group-hover:stroke-zinc-300 stroke-[1.5]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.5]'
          }`}
        />
      ),
    },
    {
      tab: 'FOUNDATIONS',
      label: 'Tokens',
      faLabel: 'پایه‌ها',
      icon: (active: boolean) => (
        <Palette
          className={`w-[16.5px] h-[16.5px] transition-colors duration-200 ${
            active
              ? isDark
                ? 'stroke-[#EDEDEF] stroke-[1.9]'
                : 'stroke-zinc-900 stroke-[1.9]'
              : isDark
              ? 'stroke-[#85858F] group-hover:stroke-zinc-300 stroke-[1.5]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.5]'
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
          className={`w-[16.5px] h-[16.5px] transition-colors duration-200 ${
            active
              ? isDark
                ? 'stroke-[#EDEDEF] stroke-[1.9]'
                : 'stroke-zinc-900 stroke-[1.9]'
              : isDark
              ? 'stroke-[#85858F] group-hover:stroke-zinc-300 stroke-[1.5]'
              : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.5]'
          }`}
        />
      ),
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 px-4 sm:px-6 pb-safe pt-1 pointer-events-none flex justify-center items-center mb-2.5 sm:mb-4 w-full"
      dir="ltr"
    >
      <div className="pointer-events-auto flex items-center justify-center gap-2 w-full max-w-[440px] mx-auto">
        {/* Full-width Slim Liquid Glass Capsule Dock */}
        <div
          className={`relative flex-1 flex items-center justify-between p-1 rounded-full select-none transition-all duration-300 ${
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
                className="group relative flex-1 min-h-[44px] py-1 px-1 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-200 active:scale-95"
                title={isRTL ? item.faLabel : item.label}
                aria-label={item.label}
              >
                {/* Ultra-soft, understated active cushion with velvet warmth */}
                {isActive && (
                  <motion.div
                    layoutId="glassCushionActive"
                    className={`absolute inset-0.5 rounded-full ${
                      isDark
                        ? 'bg-white/[0.035] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]'
                        : 'liquid-glass-light-active-cushion'
                    }`}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  {item.icon(isActive)}
                  <span
                    className={`text-[9.5px] sm:text-[10px] leading-tight tracking-tight transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? isDark ? 'text-[#EDEDEF] font-medium' : 'text-zinc-900 font-medium'
                        : isDark ? 'text-[#85858F] group-hover:text-zinc-300 font-normal' : 'text-zinc-500 group-hover:text-zinc-800 font-normal'
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
          className={`relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-full active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
            isDark
              ? 'liquid-glass-dark-dock hover:bg-[#14141E]/60 text-[#85858F] hover:text-[#EDEDEF]'
              : 'liquid-glass-light-dock hover:bg-white/50 text-zinc-600 hover:text-zinc-900'
          }`}
          title="Search & Spotlight"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5 stroke-[1.9]" />
        </button>
      </div>
    </nav>
  );
}

