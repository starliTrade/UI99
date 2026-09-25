/**
 * UI99 — App Context (Build 02.0)
 * Global UI navigation, modals, theme mode (Obsidian Dark / Matte Light), and state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ObjectType } from '../types/objects';

export type NavTab = 'HOME' | 'UIKIT' | 'DOCS' | 'FOUNDATIONS' | 'BLOCKS' | 'LIFE' | 'CREATE' | 'MEDIA' | 'MORE' | 'INBOX';
export type LifeSubview = 'TASKS' | 'CALENDAR' | 'REMINDERS' | 'GOALS' | 'HABITS' | 'PROJECTS';
export type CreateSubview = 'NOTES' | 'IDEAS' | 'WRITING' | 'DRAWING' | 'STUDIO';
export type MediaSubview = 'PHOTOS' | 'VIDEOS' | 'MUSIC' | 'BOOKS' | 'MOVIES';
export type ThemeMode = 'dark' | 'light';
export type QuickChip = 'ALL' | 'DASHBOARD' | 'REMINDERS' | 'PROGRESS';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'rose' | 'amber' | 'purple';
  durationMs?: number;
}

interface AppContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  /** Component selected from home explorer → UIKit opens focused on it. */
  focusComponent: string | null;
  setFocusComponent: (slug: string | null) => void;
  lifeSubview: LifeSubview;
  setLifeSubview: (subview: LifeSubview) => void;
  createSubview: CreateSubview;
  setCreateSubview: (subview: CreateSubview) => void;
  mediaSubview: MediaSubview;
  setMediaSubview: (subview: MediaSubview) => void;
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
  activeChip: QuickChip;
  setActiveChip: (chip: QuickChip) => void;
  prioritySearch: string;
  setPrioritySearch: (val: string) => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'rose' | 'amber' | 'purple') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [focusComponent, setFocusComponent] = useState<string | null>(null);
  const [lifeSubview, setLifeSubview] = useState<LifeSubview>('TASKS');
  const [createSubview, setCreateSubview] = useState<CreateSubview>('NOTES');
  const [mediaSubview, setMediaSubview] = useState<MediaSubview>('PHOTOS');
  const [isCaptureOpen, setIsCaptureOpen] = useState<boolean>(false);
  const [captureDefaultType, setCaptureDefaultType] = useState<ObjectType | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'fluid' | 'iphone-frame'>('fluid');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Default to Obsidian Dark permanently locked across the platform
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ui99_theme_mode');
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

  const [activeChip, setActiveChip] = useState<QuickChip>('ALL');
  const [prioritySearch, setPrioritySearch] = useState<string>('');

  // All context functions are memoized: consumers rely on stable identities
  // in effect dependency arrays (an unstable addToast causes infinite update
  // loops in any consumer syncing state inside useEffect).
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('ui99_theme_mode', mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ui99_theme_mode', next);
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
        lifeSubview,
        setLifeSubview,
        createSubview,
        setCreateSubview,
        mediaSubview,
        setMediaSubview,
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
        activeChip,
        setActiveChip,
        prioritySearch,
        setPrioritySearch,
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
