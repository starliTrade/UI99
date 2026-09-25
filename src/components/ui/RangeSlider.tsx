/**
 * UI \ [99] — RangeSlider & CheckboxGroup Primitives
 */

import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  disabled?: boolean;
  className?: string;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  className = '',
}: RangeSliderProps) {
  const [minVal, maxVal] = value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    onChange([minVal, val]);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className={`w-full space-y-2 select-none ${className}`}>
      <div className="relative w-full h-5 flex items-center">
        {/* Track */}
        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/[0.06] relative">
          {/* Highlight Range */}
          <div
            className="absolute h-full rounded-full bg-emerald-500"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
        </div>

        {/* Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          disabled={disabled}
          onChange={handleMinChange}
          aria-label="Range minimum"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          disabled={disabled}
          onChange={handleMaxChange}
          aria-label="Range maximum"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
        />

        {/* Custom Visible Thumbs */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-md border border-zinc-300 dark:border-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: `${minPercent}%` }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-md border border-zinc-300 dark:border-white/20 pointer-events-none -translate-x-1/2"
          style={{ left: `${maxPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono text-zinc-500">
        <span>Min: {minVal}</span>
        <span>Max: {maxVal}</span>
      </div>
    </div>
  );
}

export interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value: string[];
  onChange: (val: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

export function CheckboxGroup({
  options,
  value,
  onChange,
  orientation = 'vertical',
  disabled = false,
  className = '',
}: CheckboxGroupProps) {
  const toggleOption = (optVal: string) => {
    if (value.includes(optVal)) {
      onChange(value.filter((v) => v !== optVal));
    } else {
      onChange([...value, optVal]);
    }
  };

  return (
    <div
      className={`flex ${orientation === 'vertical' ? 'flex-col gap-2.5' : 'flex-wrap gap-4'} ${className}`}
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex flex-col">
          <Checkbox
            checked={value.includes(opt.value)}
            disabled={disabled || opt.disabled}
            onChange={() => toggleOption(opt.value)}
            label={opt.label}
          />
          {opt.description && (
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-6">
              {opt.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
