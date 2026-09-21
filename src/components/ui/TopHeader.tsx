/**
 * UI \ [99] — Top Command Bar (Linear-class, transparent)
 * NO background, NO border, NO capsule: the bar is part of the page.
 * Brand wordmark in JetBrains Mono; exactly two unified outline actions
 * (Search ⌘K, Studio ⚙). Ground navigation stays in the bottom dock.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { Moon, Sun, Globe, SlidersHorizontal, Search, ChevronDown, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/** JetBrains Mono wordmark — the "UI / [99]" logotype. */
function BrandMark({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="UI [99] home"
      className="inline-flex items-center font-mono font-bold tracking-tight text-zinc-950 dark:text-white cursor-pointer focus-visible:outline-none focus-safa rounded-md px-1 -mx-1 min-h-[44px]"
    >
      <span className="text-[15px] sm:text-base">UI</span>
      <span className="text-[13px] sm:text-sm text-zinc-400 dark:text-zinc-500 font-normal px-0.5">/</span>
      <span className="text-[15px] sm:text-base">[99]</span>
    </button>
  );
}

export function TopHeader() {
  const {
    setCurrentTab,
    themeMode,
    setThemeMode,
    setIsSearchOpen,
    setIsSettingsOpen,
  } = useApp();
  const { isRTL, toggleRTL } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [isDropdownOpen]);

  /** Unified soft-outline action button — the ONLY chrome on the bar. */
  const actionBtn =
    'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border font-medium text-xs cursor-pointer transition-all active:scale-[0.97] focus-visible:outline-none focus-safa-inset';
  const actionChrome = isDark
    ? 'border-white/[0.08] bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white'
    : 'border-black/[0.09] bg-transparent text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-950';

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-2 bg-transparent border-none select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <BrandMark onClick={() => setCurrentTab('HOME')} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className={`${actionBtn} ${actionChrome}`}
            aria-label="Search (Cmd+K)"
            title="Search ⌘K"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden md:inline text-[10px] font-mono opacity-60">⌘K</span>
          </button>

          {/* Studio dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className={`${actionBtn} ${actionChrome}`}
              aria-expanded={isDropdownOpen}
              aria-label="Studio preferences"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio</span>
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className={`absolute end-0 mt-2 w-64 rounded-2xl p-2 z-50 backdrop-blur-2xl ${
                    isDark
                      ? 'bg-[#0E0E14]/95 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.8)] border border-white/[0.04]'
                      : 'bg-white/95 text-[#111116] shadow-[0_20px_44px_rgba(0,0,0,0.08)] border border-black/[0.04]'
                  }`}
                >
                  {/* Theme */}
                  <div className="p-2 mb-1">
                    <span className="block text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 mb-2 px-1">Theme</span>
                    <div className={`grid grid-cols-2 p-1 rounded-2xl ${isDark ? 'bg-[#060608]' : 'bg-[#F2F2F6]'}`}>
                      <button
                        type="button"
                        onClick={() => setThemeMode('dark')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isDark ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]' : 'text-[#687685] hover:text-[#111116]'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" /> Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setThemeMode('light')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          !isDark ? 'bg-white text-[#111116] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-[#687685] hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                      </button>
                    </div>
                    <p className="mt-2 px-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-600">
                      Porcelain preset installs via registry.
                    </p>
                  </div>

                  <div className={`h-[1px] my-1 ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'}`} />

                  {/* RTL */}
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
                    <span className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-[#8E8E98]" />
                      {isRTL ? 'English (EN)' : 'فارسی (FA)'}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#787885]">{isRTL ? 'FA' : 'EN'}</span>
                  </button>

                  {/* Preferences */}
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
      </div>
    </header>
  );
}
