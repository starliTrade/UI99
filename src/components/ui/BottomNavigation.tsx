/**
 * UI99 — Liquid-Glass Capsule Dock
 * Five destinations, one per job-to-be-done. Items come from `navItems.ts`
 * (single source of truth, guarded by the navigation test). 44px touch targets,
 * velvet active cushion, reduced-motion honoured.
 */

import React from 'react';
import { LayoutGrid, Layers, LayoutTemplate, BookOpen, Palette, Search } from 'lucide-react';
import { useApp, NavTab } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { motion, useReducedMotion } from 'motion/react';
import { NAV_ITEMS } from './navItems';

const ICONS: Record<NavTab, React.ComponentType<{ className?: string }>> = {
  HOME: LayoutGrid,
  UIKIT: Layers,
  BLOCKS: LayoutTemplate,
  DOCS: BookOpen,
  FOUNDATIONS: Palette,
};

export function BottomNavigation() {
  const { currentTab, setCurrentTab, setIsSearchOpen, themeMode } = useApp();
  const { isRTL } = useAuth();
  const prefersReduced = useReducedMotion();
  const isDark = themeMode === 'dark';

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-3 sm:px-6 pb-safe pt-1 pointer-events-none flex justify-center items-center mb-2.5 sm:mb-3.5 w-full"
      dir="ltr"
    >
      <div className="pointer-events-auto flex items-center justify-center gap-1.5 w-full max-w-[380px] mx-auto">
        <div
          className={`relative flex-1 flex items-center justify-between p-0.5 sm:p-1 rounded-(--radius-pill) select-none transition-all duration-300 ${
            isDark ? 'liquid-glass-dark-dock' : 'liquid-glass-light-dock'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.tab;
            const Icon = ICONS[item.tab];

            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setCurrentTab(item.tab)}
                className="group relative flex-1 min-h-[44px] py-1.5 px-1 rounded-(--radius-pill) cursor-pointer flex flex-col items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
                title={isRTL ? item.faIntent : item.intent}
                aria-label={isRTL ? item.faLabel : item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId={prefersReduced ? undefined : 'glassCushionActive'}
                    className={`absolute inset-0.5 rounded-(--radius-pill) ${
                      isDark
                        ? 'bg-white/[0.04] shadow-(--shadow-card)'
                        : 'liquid-glass-light-active-cushion'
                    }`}
                    transition={{ type: 'spring', stiffness: 460, damping: 38 }}
                  />
                )}

                <span className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${
                      isActive
                        ? isDark
                          ? 'stroke-(--text-primary) stroke-[2]'
                          : 'stroke-zinc-950 stroke-[2]'
                        : isDark
                          ? 'stroke-(--text-muted) group-hover:stroke-zinc-300 stroke-[1.6]'
                          : 'stroke-zinc-500 group-hover:stroke-zinc-800 stroke-[1.6]'
                    }`}
                  />
                  <span
                    className={`font-mono text-[8.5px] sm:text-[9.5px] tracking-tight transition-colors duration-150 whitespace-nowrap ${
                      isActive
                        ? isDark
                          ? 'text-(--text-primary) font-semibold'
                          : 'text-zinc-950 font-semibold'
                        : isDark
                          ? 'text-(--text-muted) group-hover:text-zinc-200 font-normal'
                          : 'text-zinc-500 group-hover:text-zinc-900 font-normal'
                    }`}
                  >
                    {isRTL ? item.faLabel : item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={`relative min-w-[44px] min-h-[44px] w-10 h-10 rounded-(--radius-pill) active:scale-95 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
