/**
 * UI \ [99] — DateRangePicker Primitive
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange?: (range: { start: string; end: string }) => void;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  startDate = '2026-09-01',
  endDate = '2026-09-30',
  onChange,
  className = '',
  disabled = false,
}: DateRangePickerProps) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="h-9 px-3 rounded-(--radius-field) bg-white dark:bg-(--bg-surface) border border-zinc-200 dark:border-white/[0.04] text-xs font-mono text-zinc-900 dark:text-white inline-flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-(--bg-elevated) transition-colors cursor-pointer disabled:opacity-50"
      >
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span>{start}</span>
        <ArrowRight className="w-3 h-3 text-zinc-400" />
        <span>{end}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 p-3 rounded-(--radius-control) bg-white dark:bg-(--bg-elevated) border border-zinc-200 dark:border-white/[0.06] shadow-2xl z-50 animate-in fade-in duration-100 space-y-3 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-950 dark:text-white">
            <span>Select Date Range</span>
            <span className="text-[10px] text-emerald-500 font-normal">Active Sprint</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  onChange?.({ start: e.target.value, end });
                }}
                className="w-full px-2 py-1.5 rounded-(--radius-sm) bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-950 dark:text-white text-xs font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">End Date</label>
              <input
                type="date"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  onChange?.({ start, end: e.target.value });
                }}
                className="w-full px-2 py-1.5 rounded-(--radius-sm) bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-950 dark:text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-zinc-100 dark:border-white/[0.04]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-2.5 py-1 rounded-(--radius-sm) bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-mono font-bold hover:opacity-90"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
