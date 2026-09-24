/**
 * UI99 — World-Class Obsidian Glass Top Navigation Bar
 *
 * - Precision Geometric Brandmark & High-Performance Typography
 * - Ultra-thin frosted glass rim with sub-pixel specular highlight
 * - Direct quick-action controls: GitHub, Theme Toggle, Language & Studio Settings
 * - Full responsive touch ergonomics & WCAG 2.2 contrast compliance
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { Moon, Sun, Globe, SlidersHorizontal, Settings, Github, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TopHeader() {
  const {
    setCurrentTab,
    themeMode,
    setThemeMode,
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

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent border-none shadow-none select-none transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        
        {/* ══════════════════════════════════════════════════════════════
            1 · LEFT: Precision Geometric Brandmark & Wordmark
           ══════════════════════════════════════════════════════════════ */}
        <button
          type="button"
          onClick={() => setCurrentTab('HOME')}
          aria-label="UI99 Design System Home"
          className="group inline-flex items-center gap-2.5 cursor-pointer focus-visible:outline-none transition-transform active:scale-[0.98]"
        >
          {/* Obsidian Jewel Geometric Emblem */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 dark:bg-(--bg-elevated) border border-black/10 dark:border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden transition-all group-hover:border-emerald-500/40 dark:group-hover:border-emerald-400/40">
            {/* Subtle internal emerald specular reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-white transition-transform group-hover:scale-105 duration-200"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer bevel polygon */}
              <path
                d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                className="text-zinc-400 dark:text-zinc-400 group-hover:text-emerald-400 transition-colors"
              />
              {/* Inner core facet */}
              <circle
                cx="12"
                cy="12"
                r="2.2"
                className="fill-emerald-400 dark:fill-emerald-400"
              />
            </svg>
          </div>

          {/* Clean High-Prestige Wordmark with UI \\ [99] */}
          <div className="flex items-center gap-1.5 font-['Inter',_'Plus_Jakarta_Sans',_sans-serif]">
            <div className="flex items-center text-[15px] sm:text-[16px] tracking-[-0.03em] leading-none select-none">
              <span className="font-bold text-zinc-950 dark:text-(--text-primary) transition-colors">
                UI
              </span>
              <span className="mx-1 text-[13px] sm:text-[14px] font-light text-zinc-400 dark:text-zinc-600 select-none">
                \
              </span>
              <span className="inline-flex items-center text-zinc-800 dark:text-zinc-200">
                <span className="text-zinc-400 dark:text-zinc-600 font-light">[</span>
                <span className="px-0.5 font-bold text-zinc-950 dark:text-(--text-primary)">
                  99
                </span>
                <span className="text-zinc-400 dark:text-zinc-600 font-light">]</span>
              </span>
            </div>

            {/* Version / Live Capsule */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.03] text-[10px] font-mono text-zinc-500 dark:text-zinc-400 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>v2.0</span>
            </div>
          </div>
        </button>

        {/* ══════════════════════════════════════════════════════════════
            2 · RIGHT: Unified Fast-Action Glass Capsule
           ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* GitHub Quick Link */}
          <a
            href="https://github.com/starliTrade/UI99"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Language Quick Toggle (FA / EN) */}
          <button
            type="button"
            onClick={toggleRTL}
            aria-label="Toggle language direction"
            title={isRTL ? 'Switch to English' : 'تغییر به فارسی'}
            className="h-8 px-2.5 rounded-xl flex items-center justify-center gap-1 border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span className="text-[11px]">{isRTL ? 'FA' : 'EN'}</span>
          </button>

          {/* Settings & Tokens Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="h-8 w-8 rounded-xl flex items-center justify-center border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer active:scale-95 focus-visible:outline-none group"
              aria-label="Studio Preferences"
              title="Studio Preferences"
            >
              <Settings className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                  className="absolute end-0 mt-2 w-56 rounded-2xl p-2 z-50 backdrop-blur-2xl bg-white/95 dark:bg-(--bg-card)/95 text-zinc-900 dark:text-white shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_20px_48px_rgba(0,0,0,0.85)] border border-zinc-200 dark:border-white/[0.03]"
                >
                  <div className="p-1.5 mb-1">
                    <span className="block text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 px-1">
                      Quick Switch
                    </span>
                    <div className="grid grid-cols-2 p-0.5 rounded-xl bg-zinc-100 dark:bg-(--bg-sunken) border border-zinc-200/60 dark:border-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => setThemeMode('dark')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all ${
                          isDark
                            ? 'bg-zinc-800 text-white shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        <Moon className="w-3 h-3 text-zinc-300" /> Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setThemeMode('light')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition-all ${
                          !isDark
                            ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-500" /> Light
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] my-1 bg-zinc-200/70 dark:bg-white/[0.03]" />

                  {/* Studio Tokens Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-800 dark:text-zinc-200"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Design Tokens Inspector</span>
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

