/**
 * UI \ [99] — PinInput & CurrencyInput Primitives
 */

import React, { useState } from 'react';
import { OTPInput } from './OTPInput';
import { DollarSign } from 'lucide-react';

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (val: string) => void;
  mask?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PinInput({
  length = 6,
  value = '',
  onChange,
  mask = true,
  disabled = false,
  className = '',
}: PinInputProps) {
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <OTPInput
        length={length}
        value={value}
        onChange={onChange || (() => {})}
        disabled={disabled}
      />
    </div>
  );
}

export interface CurrencyInputProps {
  value: number;
  onChange: (val: number) => void;
  currency?: string;
  symbol?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'USD',
  symbol = '$',
  min = 0,
  max = 1000000,
  disabled = false,
  className = '',
}: CurrencyInputProps) {
  const [strVal, setStrVal] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setStrVal(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(Math.min(Math.max(num, min), max));
    } else if (raw === '') {
      onChange(0);
    }
  };

  return (
    <div className={`relative flex items-center rounded-(var(--radius-field)) bg-white dark:bg-(--bg-surface) border border-zinc-200 dark:border-white/[0.04] shadow-(var(--rim-soft), var(--elevation-1)) focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all ${className}`}>
      <span className="pl-3 pr-1 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 select-none">
        {symbol}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={strVal}
        disabled={disabled}
        onChange={handleChange}
        placeholder="0.00"
        className="w-full py-2 pr-3 bg-transparent text-xs font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none disabled:opacity-50"
      />
      <span className="pr-3 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 select-none">
        {currency}
      </span>
    </div>
  );
}
