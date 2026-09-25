/**
 * UI99 — App Context (Build 02.0)
 * Global UI navigation, modals, theme mode (Obsidian Dark / Matte Light), and state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ObjectType } from '../types/objects';
import { safeGetItem, safeSetItem } from '../safeStorage';

/**
 * Product-site destinations — exactly five, one per job-to-be-done.
 * Personal-OS tabs (LIFE/CREATE/MEDIA/MORE/INBOX) were removed from the
 * product site: they were unreachable from the dock and diluted the story.
 * See docs/PRODUCT-SITE-ROADMAP.md §1.
 *
 * The literal lives in components/ui/navItems.ts (the shipped kit); re-exported
 * here so consumers of the context use the identical type.
 */
export type { NavTab } from '../../components/ui/navItems';
export type ThemeMode = 'dark' | 'light';

import type { NavTab } from '../../components/ui/navItems';

export type { ToastItem } from '../../components/ui/Toast';
import type { ToastItem } from '../../components/ui/Toast';

interface AppContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  /** Component selected from home explorer → UIKit opens focused on it. */
  focusComponent: string | null;
  setFocusComponent: (slug: string | null) => void;
  isCaptureOpen: boolean;
  setIsCaptureOpen: (open: boolean) => void;
  captureDefaultType: ObjectType | null;
  openCapture: (type?: ObjectType) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  viewMode: 'fluid' | 'iphone-frame';
  setViewMode: (mode: 'fluid' | 'iphone-frame') => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'rose' | 'amber' | 'purple') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [focusComponent, setFocusComponent] = useState<string | null>(null);
  const [isCaptureOpen, setIsCaptureOpen] = useState<boolean>(false);
  const [captureDefaultType, setCaptureDefaultType] = useState<ObjectType | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'fluid' | 'iphone-frame'>('fluid');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Default to Obsidian Dark permanently locked across the platform.
  // safeGetItem: storage access can throw in blocked contexts (preview iframes,
  // private browsing) — an exception inside the initializer blanks the app.
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = safeGetItem('ui99_theme_mode');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    // Dual protocol: the legacy .dark/.light classes AND the standard
    // data-theme attribute (daisyUI/Tailwind v4 convention, audit P2.8).
    const theme = themeMode === 'dark' ? 'dark' : 'light';
    root.classList.add(theme);
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      body.classList.add('bg-[#06070A]', 'text-[#EDEDEF]');
      body.classList.remove('bg-[#F4F4F6]', 'text-[#111113]');
    } else {
      body.classList.add('bg-[#F4F4F6]', 'text-[#111113]');
      body.classList.remove('bg-[#06070A]', 'text-[#EDEDEF]');
    }
  }, [themeMode]);

  // All context functions are memoized: consumers rely on stable identities
  // in effect dependency arrays (an unstable addToast causes infinite update
  // loops in any consumer syncing state inside useEffect).
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    safeSetItem('ui99_theme_mode', mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      safeSetItem('ui99_theme_mode', next);
      return next;
    });
  }, []);

  const openCapture = useCallback((type?: ObjectType) => {
    setCaptureDefaultType(type || null);
    setIsCaptureOpen(true);
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: 'info' | 'success' | 'warning' | 'rose' | 'amber' | 'purple' = 'rose'
    ) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      const newToast: ToastItem = { id, message, type };
      setToasts((prev) => [...prev, newToast]);
      // Auto-dismiss timing lives in <ToastContainer> so it can pause on
      // hover/focus (WCAG 2.2.1 Timing Adjustable).
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        focusComponent,
        setFocusComponent,
        isCaptureOpen,
        setIsCaptureOpen,
        captureDefaultType,
        openCapture,
        isSearchOpen,
        setIsSearchOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        viewMode,
        setViewMode,
        themeMode,
        setThemeMode,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
