/**
 * UI99 — World-Class Obsidian Glass Top Navigation Bar
 *
 * - Precision Geometric Brandmark & High-Performance Typography
 * - Ultra-thin frosted glass rim with sub-pixel specular highlight
 * - Direct quick-action controls: GitHub, Theme Toggle, Language & Studio Settings
 * - Full responsive touch ergonomics & WCAG 2.2 contrast compliance
 *
 * ── Why every piece of app state is a prop ────────────────────────────────
 * This used to read `useApp()` / `useAuth()` directly, which made it
 * impossible to install: a copied header in a consumer's project imported
 * contexts that do not exist there, and the failure only appeared at
 * `npx @99/ui add top-header` — never in this repo's build or tests, because
 * here the contexts always exist.
 *
 * State now arrives as props, every one with a working default, so the common
 * case still renders with zero configuration and the component is copy-anywhere.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Globe, SlidersHorizontal, Settings, SquareArrowOutUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TopHeaderProps {
  /** Active tab id — any string; the header just marks the matching item. */
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  themeMode?: 'dark' | 'light';
  onThemeChange?: (mode: 'dark' | 'light') => void;
  onOpenSettings?: () => void;
  onToggleRTL?: () => void;
  isRTL?: boolean;
  /** Rendered in the live capsule. Omit to hide it. */
  version?: string;
  githubUrl?: string;
}

export function TopHeader({
  currentTab = 'HOME',
  onNavigate,
  themeMode = 'dark',
  onThemeChange,
  onOpenSettings,
  onToggleRTL,
  isRTL = false,
  version,
  githubUrl = 'https://github.com/starliTrade/UI99',
}: TopHeaderProps = {}) {
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
    <header className="sticky top-0 z-header w-full bg-transparent border-none shadow-none select-none transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        
        {/* ══════════════════════════════════════════════════════════════
            1 · LEFT: Precision Geometric Brandmark & Wordmark
           ══════════════════════════════════════════════════════════════ */}
        <button
          type="button"
          onClick={() => onNavigate?.('HOME')}
          aria-label="UI99 Design System Home"
          className="group inline-flex items-center gap-2.5 cursor-pointer transition-transform active:scale-[0.98] focus-ui99"
        >
          {/* Obsidian Jewel Geometric Emblem */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-(--radius-field) bg-zinc-900 dark:bg-(--bg-elevated) border border-black/10 dark:border-white/[0.06] shadow-(--shadow-card) overflow-hidden transition-all group-hover:border-emerald-500/40 dark:group-hover:border-emerald-400/40">
            {/* Subtle internal emerald specular reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-white transition-transform group-hover:scale-105 dur-base"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer bevel polygon */}
              <path
                d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                className="text-(--text-secondary) dark:text-zinc-400 group-hover:text-emerald-400 transition-colors"
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
            <div className="flex items-center type-body sm:type-body-lg tracking-[-0.03em] leading-none select-none">
              <span className="font-bold text-zinc-950 dark:text-(--text-primary) transition-colors">
                UI
              </span>
              <span className="mx-1 type-caption sm:type-body font-light text-(--text-secondary) dark:text-zinc-600 select-none">
                \
              </span>
              <span className="inline-flex items-center text-zinc-800 dark:text-zinc-200">
                <span className="text-(--text-secondary) dark:text-zinc-600 font-light">[</span>
                <span className="px-0.5 font-bold text-zinc-950 dark:text-(--text-primary)">
                  99
                </span>
                <span className="text-(--text-secondary) dark:text-zinc-600 font-light">]</span>
              </span>
            </div>

            {/* Version capsule — the number is a prop, not a generated import.
                A consumer's header has no registry to scan, and importing
                `../../generated/kit-count` would have broken the install the same
                way the contexts did. */}
            {version && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-(--radius-xs) bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.03] type-micro font-mono text-(--text-muted) dark:text-zinc-400 leading-none">
                <span className="w-1.5 h-1.5 rounded-(--radius-pill) bg-emerald-500 shrink-0" />
                <span>v{version}</span>
              </div>
            )}
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
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-(--radius-field) border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] type-caption font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
          >
            <SquareArrowOutUpRight className="icon-sm" />
            <span>GitHub</span>
          </a>

          {/* Language Quick Toggle (FA / EN) */}
          <button
            type="button"
            onClick={() => onToggleRTL?.()}
            aria-label="Toggle language direction"
            title={isRTL ? 'Switch to English' : 'تغییر به فارسی'}
            className="relative h-8 px-2.5 rounded-(--radius-field) flex items-center justify-center gap-1 border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] type-caption font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer active:scale-95 focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
          >
            <Globe className="icon-sm text-(--text-secondary) dark:text-zinc-500" />
            <span className="type-micro">{isRTL ? 'FA' : 'EN'}</span>
          </button>

          {/* Settings & Tokens Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="relative h-8 w-8 rounded-(--radius-field) flex items-center justify-center border border-zinc-200/80 dark:border-white/[0.04] bg-zinc-100/60 dark:bg-white/[0.025] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer active:scale-95 group focus-ui99 after:absolute after:-inset-1.5 after:content-['']"
              aria-label="Studio Preferences"
              title="Studio Preferences"
            >
              <Settings className="icon-sm transition-transform dur-slow group-hover:rotate-45" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                  className="absolute end-0 mt-2 w-56 rounded-(--radius-control) p-2 z-popover backdrop-blur-2xl bg-white/95 dark:bg-(--bg-card)/95 text-zinc-900 dark:text-white shadow-(--elevation-3) shadow-(--shadow-popover) border border-zinc-200 dark:border-white/[0.03]"
                >
                  <div className="p-1.5 mb-1">
                    <span className="block type-micro font-bold font-mono uppercase tracking-wider text-(--text-secondary) dark:text-zinc-500 mb-1.5 px-1">
                      Quick Switch
                    </span>
                    <div className="grid grid-cols-2 p-0.5 rounded-(--radius-field) bg-zinc-100 dark:bg-(--bg-sunken) border border-zinc-200/60 dark:border-white/[0.03]">
                      <button
                        type="button"
                        onClick={() => onThemeChange?.('dark')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-(--radius-sm) type-caption font-mono font-medium cursor-pointer transition-all focus-ui99-inset ${
                          isDark
                            ? 'bg-zinc-800 text-white shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        <Moon className="icon-xs text-(--text-muted)" /> Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => onThemeChange?.('light')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-(--radius-sm) type-caption font-mono font-medium cursor-pointer transition-all focus-ui99-inset ${
                          !isDark
                            ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Sun className="icon-xs text-amber-500" /> Light
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] my-1 bg-zinc-200/70 dark:bg-white/[0.03]" />

                  {/* Studio Tokens Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings?.();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-(--radius-field) type-caption font-medium cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus-ui99-inset"
                  >
                    <SlidersHorizontal className="icon-sm text-(--text-muted) dark:text-zinc-400" />
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

