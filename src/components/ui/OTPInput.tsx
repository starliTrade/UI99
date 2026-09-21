/**
 * UI99 — OTPInput (Wave H)
 * Fixed-length one-time-code entry: auto-advance, backspace retreat,
 * paste distribution, complete callback. Password-manager friendly
 * (single hidden input pattern avoided for simplicity — cells are real
 * inputs with inputMode="numeric").
 */

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OTPInput({ length = 6, value, onChange, onComplete, disabled = false, className = '' }: OTPInputProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string>('');
  const code = controlled ? value : internal;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setCode = (next: string) => {
    const clamped = next.slice(0, length);
    if (!controlled) setInternal(clamped);
    onChange?.(clamped);
    if (clamped.length === length) onComplete?.(clamped);
  };

  const handleCell = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return;
    const arr = code.padEnd(length, ' ').split('');
    let cursor = index;
    for (const ch of digits) {
      if (cursor >= length) break;
      arr[cursor] = ch;
      cursor += 1;
    }
    setCode(arr.join('').replace(/ /g, ''));
    refs.current[Math.min(cursor, length - 1)]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = code.split('');
      if (arr[index]) {
        arr.splice(index, 1);
        setCode(arr.join(''));
      } else if (index > 0) {
        arr.splice(index - 1, 1);
        setCode(arr.join(''));
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '');
    if (text) setCode(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)} role="group" aria-label="One-time code">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={code[i] ?? ''}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleCell(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            'h-12 w-10 rounded-xl border bg-white text-center text-lg font-semibold text-zinc-950 transition-colors',
            'dark:bg-[#131318] dark:text-[#EDEDEF]',
            'border-(--border-strong)',
            'hover:border-black/[0.18] dark:hover:border-white/[0.2]',
            'focus-visible:outline-none focus-safa-inset focus-visible:border-black/[0.3] dark:focus-visible:border-white/[0.35]',
            code[i] && 'border-black/[0.3] dark:border-white/[0.3]',
            disabled && 'cursor-not-allowed opacity-45'
          )}
        />
      ))}
    </div>
  );
}
