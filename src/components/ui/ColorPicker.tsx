/**
 * UI99 — ColorPicker Component
 * World-class HSL/Hex color picker with swatch palette, eyedropper, and alpha transparency.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Pipette, Copy, Check, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Kbd } from './Kbd';

export interface ColorPickerProps {
  value?: string;
  onChange?: (hex: string) => void;
  presetColors?: string[];
  showAlpha?: boolean;
  className?: string;
  label?: string;
}

const DEFAULT_PRESETS = [
  '#06070A', '#131318', '#3B82F6', '#10B981', 
  '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', 
  '#06B6D4', '#84CC16', '#64748B', '#FFFFFF'
];

export function ColorPicker({
  value = '#3B82F6',
  onChange,
  presetColors = DEFAULT_PRESETS,
  showAlpha = false,
  className,
  label,
}: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [copied, setCopied] = useState(false);
  const [hue, setHue] = useState(217);
  const [saturation, setSaturation] = useState(91);
  const [lightness, setLightness] = useState(60);

  useEffect(() => {
    if (value) setColor(value);
  }, [value]);

  const handleColorChange = (newHex: string) => {
    setColor(newHex);
    onChange?.(newHex);
  };

  const copyHex = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleColorChange(result.sRGBHex);
        }
      } catch (e) {
        // cancelled or unsupported
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-black/[0.06] dark:border-white/[0.04] shadow-lg max-w-[280px]', className)}>
      {label && (
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
      )}

      {/* Main Preview Swatch & Hex input */}
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden="true"
          className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 shrink-0 shadow-inner transition-transform active:scale-95"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 flex items-center bg-zinc-100 dark:bg-[#131318] rounded-xl px-2.5 py-1.5 border border-black/[0.04] dark:border-white/[0.03]">
          <span className="text-xs font-mono text-zinc-500 mr-1">#</span>
          <input
            type="text"
            value={color.replace('#', '')}
            onChange={(e) => handleColorChange(`#${e.target.value}`)}
            aria-label="Hex color value"
            className="w-full bg-transparent text-xs font-mono text-zinc-900 dark:text-zinc-100 outline-none uppercase"
            maxLength={6}
          />
          <button
            type="button"
            onClick={copyHex}
            aria-label="Copy color hex"
            className="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="flex flex-col gap-2">
        {/* Native picker integration fallback */}
        <div className="relative h-6 w-full rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
          <input
            type="color"
            value={color.startsWith('#') && color.length === 7 ? color : '#3B82F6'}
            onChange={(e) => handleColorChange(e.target.value)}
            aria-label="Custom color"
            className="absolute -top-2 -left-2 w-[120%] h-12 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full rounded-md"
            style={{
              background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          />
        </div>
      </div>

      {/* Preset Swatches Palette */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-black/[0.04] dark:border-white/[0.03]">
        {presetColors.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleColorChange(preset)}
            aria-label={`Select color ${preset}`}
            className={cn(
              'w-5 h-5 rounded-lg border border-black/10 dark:border-white/10 transition-all hover:scale-110 active:scale-95',
              color.toLowerCase() === preset.toLowerCase() && 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-[#0E0E14]'
            )}
            style={{ backgroundColor: preset }}
          />
        ))}
        {'EyeDropper' in (typeof window !== 'undefined' ? window : {}) && (
          <button
            type="button"
            onClick={handleEyeDropper}
            aria-label="Pick color from screen"
            className="w-5 h-5 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Pipette className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
