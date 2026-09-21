/**
 * SAFA — Unified Velvet Dropdown / Select Component (Build 02.2)
 * Dual-theme (Obsidian / Matte Porcelain) with tactile spring animations.
 */

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../core/context/AppContext';

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
  const { themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

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

  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm';

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          className={`block text-xs font-semibold mb-1.5 ${
            isDark ? 'text-[#92929B]' : 'text-zinc-700'
          }`}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl font-medium transition-all duration-150 cursor-pointer select-none focus-safa ${sizeClass} ${
          isDark
            ? 'bg-[#131317] text-[#EDEDEF] border border-white/[0.06] hover:border-white/[0.14] shadow-xs'
            : 'bg-white text-zinc-900 border border-black/[0.08] hover:border-black/[0.18] shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={`absolute left-0 right-0 mt-1.5 p-1 rounded-2xl z-50 backdrop-blur-2xl shadow-xl overflow-hidden ${
              isDark
                ? 'bg-[#0E0E14]/95 border border-white/[0.07] shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                : 'bg-white/95 border border-black/[0.06] shadow-[0_16px_36px_rgba(0,0,0,0.08)]'
            }`}
          >
            <div
              className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5"
              role="listbox"
              aria-label={label}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left rtl:text-right focus-safa-inset ${
                      isSelected
                        ? isDark
                          ? 'bg-white/[0.08] text-white font-semibold'
                          : 'bg-black/[0.05] text-zinc-950 font-semibold'
                        : isDark
                        ? 'text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                        : 'text-zinc-700 hover:bg-black/[0.03] hover:text-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <div className="truncate">
                        <div>{option.label}</div>
                        {option.description && (
                          <div
                            className={`text-[10px] ${
                              isDark ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
