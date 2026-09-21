/**
 * UI \ [99] — Floating Glass Command Bar (Linear-class nav)
 * Detached capsule: logo | links | actions. Scroll-aware morph (transparent
 * → glass + hairline + shadow), shared-layout active cushion (layoutId) that
 * glides between items, 44px targets, full keyboard support.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { SafaBrandLogo } from './SafaBrandLogo';
import {
  Moon,
  Sun,
  Globe,
  SlidersHorizontal,
  Search,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

// Ground navigation lives in the bottom dock (mobile-first product shell);
// the top bar stays a calm brand + actions capsule (shadcn/Linear posture).

export function TopHeader() {
  const {
    setCurrentTab,
    themeMode,
    setThemeMode,
    setIsSearchOpen,
    setIsSettingsOpen,
  } = useApp();
  const { user, isRTL, toggleRTL } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = themeMode === 'dark';

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const pillBase = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all active:scale-95 min-h-[38px] text-xs font-mono';
  const pillChrome = isDark
    ? 'bg-[#0E0E14]/85 hover:bg-[#14141A] text-zinc-300 hover:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.035)] border border-white/[0.04]'
    : 'bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 border border-black/[0.05]';

  return (
    <div className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-2 pointer-events-none select-none">
      <motion.header
        initial={false}
        animate={{
          y: scrolled ? -2 : 0,
          boxShadow: scrolled
            ? isDark
              ? '0 18px 40px -12px rgba(0,0,0,0.7)'
              : '0 18px 40px -12px rgba(0,0,0,0.18)'
            : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className={`max-w-4xl mx-auto flex items-center justify-between gap-2 rounded-2xl sm:rounded-full px-2.5 py-1.5 pointer-events-auto backdrop-blur-2xl saturate-150 transition-colors duration-300 ${
          scrolled
            ? isDark
              ? 'bg-[#0B0C11]/72 border border-white/[0.06] shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.05)]'
              : 'bg-white/78 border border-black/[0.05] shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.8)]'
            : isDark
              ? 'bg-[#06070A]/45 border border-transparent'
              : 'bg-white/45 border border-transparent'
        }`}
      >
        {/* Left: brand + desktop links */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button
            type="button"
            onClick={() => setCurrentTab('HOME')}
            className="flex items-center group cursor-pointer focus:outline-none transition-transform active:scale-95 rounded-full"
            title="UI \ [99] — Home"
            aria-label="UI \ [99] Home"
          >
            <SafaBrandLogo size="md" />
          </button>

          {/* Ground nav intentionally omitted — bottom dock owns navigation */}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className={`${pillBase} ${pillChrome}`}
            title="Quick search (Cmd+K)"
            aria-label="Quick search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-500 dark:text-zinc-400">⌘K</span>
          </button>

          {/* Settings & Theme Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`${pillBase} ${pillChrome}`}
              aria-expanded={isDropdownOpen}
              aria-label="Settings and Preferences"
            >
              <span className={`text-xs font-semibold tracking-tight ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                {user?.profile?.name || 'Studio'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 rounded-3xl p-2 z-50 backdrop-blur-2xl ${
                    isDark
                      ? 'bg-[#0E0E14]/95 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.8)] border border-white/[0.04]'
                      : 'bg-white/95 text-[#111116] shadow-[0_20px_44px_rgba(0,0,0,0.08)] border border-black/[0.04]'
                  }`}
                >
                  <div className="p-2 mb-1">
                    <span className="block text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 mb-2 px-1">
                      Theme Mode
                    </span>
                    <div className={`grid grid-cols-2 p-1 rounded-2xl ${isDark ? 'bg-[#060608]' : 'bg-[#F2F2F6]'}`}>
                      <button
                        type="button"
                        onClick={() => setThemeMode('dark')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isDark
                            ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]'
                            : 'text-[#787885] hover:text-[#111116]'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setThemeMode('light')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          !isDark
                            ? 'bg-white text-[#111116] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                            : 'text-[#787885] hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                      </button>
                    </div>
                  </div>

                  <div className={`h-[1px] my-1 ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`} />

                  <button
                    type="button"
                    onClick={() => {
                      toggleRTL();
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-white/[0.06] text-[#D8D8E0]' : 'hover:bg-black/[0.04] text-[#333338]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-[#8E8E98]" />
                      <span>{isRTL ? 'English (EN - Default)' : 'فارسی (FA)'}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#787885]">
                      {isRTL ? 'FA' : 'EN'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-white/[0.06] text-[#D8D8E0]' : 'hover:bg-black/[0.04] text-[#333338]'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#8E8E98]" />
                    <span>Preferences</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
