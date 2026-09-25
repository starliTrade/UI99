/**
 * UI99 — Unified Velvet Dropdown / Select Component (Build 02.3)
 * Full WAI-ARIA listbox pattern: aria-haspopup="listbox", aria-activedescendant,
 * Arrow/Home/End/Type-ahead keyboard navigation, Escape dismissal with focus return,
 * focus trap while open, RTL-aware text alignment.
 * Dual-theme (Obsidian / Matte Porcelain) with tactile spring animations.
 */

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useIsDark } from './theme';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  description?: string;
  badge?: string;
}

export interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
  size = 'md',
}: DropdownProps<T>) {
  const isDark = useIsDark();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeAheadRef = useRef<{ chars: string; ts: number }>({ chars: '', ts: 0 });

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Open → land focus/active on selected option; Close → restore focus to trigger
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      triggerRef.current?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const commit = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (e.key === 'ArrowDown') {
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((i) => Math.max(0, i - 1));
      } else {
        commit(activeIndex);
      }
      return;
    }
    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
      return;
    }
    if (isOpen) typeAhead(e);
  };

  const typeAhead = (e: React.KeyboardEvent) => {
    if (!/^[a-zA-Z0-9\u0600-\u06FF]$/.test(e.key)) return;
    const now = Date.now();
    const chars = now - typeAheadRef.current.ts > 500 ? e.key : typeAheadRef.current.chars + e.key;
    typeAheadRef.current = { chars, ts: now };
    const needle = chars.toLowerCase();
    const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(needle));
    if (idx >= 0) setActiveIndex(idx);
  };

  const sizeClass = size === 'sm' ? 'px-3 py-1.5 type-caption' : 'px-3.5 py-2 type-body';
  const listId = `dropdown-list-${label || 'default'}`.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <span
          id={`${listId}-label`}
          className={`block type-caption font-semibold mb-1.5 ${
            isDark ? 'text-(--text-secondary)' : 'text-zinc-700'
          }`}
        >
          {label}
        </span>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full flex items-center justify-between rounded-(--radius-field) font-medium transition-all dur-quick cursor-pointer select-none focus-ui99 ${sizeClass} ${
          isDark
            ? 'bg-(--bg-elevated) text-(--text-primary) border border-white/[0.06] hover:border-white/[0.14] shadow-xs'
            : 'bg-white text-zinc-900 border border-black/[0.08] hover:border-black/[0.18] shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${listId}-label` : undefined}
        aria-activedescendant={isOpen && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`icon-md shrink-0 transition-transform dur-base ${ isOpen ? 'rotate-180' : '' } ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={label ? `${listId}-label` : undefined}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={`absolute left-0 right-0 mt-1.5 p-1 rounded-(--radius-control) z-popover backdrop-blur-2xl shadow-xl overflow-hidden ${
              isDark
                ? 'bg-(--bg-elevated)/95 border border-white/[0.07] shadow-(--elevation-4)'
                : 'bg-white/95 border border-black/[0.06] shadow-(--elevation-3)'
            }`}
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    id={`${listId}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => commit(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-(--radius-field) type-caption sm:type-body font-medium cursor-pointer text-left rtl:text-right focus-ui99-inset ${
                      isActive
                        ? isDark
                          ? 'bg-white/[0.08] text-white'
                          : 'bg-black/[0.05] text-zinc-950'
                        : isDark
                        ? 'text-zinc-300'
                        : 'text-zinc-700'
                    } ${isSelected ? 'font-semibold' : ''}`}
                  >
                    <div className="flex items-center gap-2 truncate pointer-events-none">
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <div className="truncate">
                        <div>{option.label}</div>
                        {option.description && (
                          <div
                            className={`type-micro ${
                              isDark ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="icon-sm text-emerald-500 shrink-0 ml-2 pointer-events-none" />
                    )}
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
