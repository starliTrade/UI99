/**
 * UI99 — PasswordInput Component
 * High-security password input with interactive strength meter, crack time calculator, and rules checklist.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
  onStrengthChange?: (score: number) => void;
  label?: string;
  error?: string;
}

export function PasswordInput({
  value,
  defaultValue,
  onChange,
  showStrength = true,
  onStrengthChange,
  label = 'Password',
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [internalVal, setInternalVal] = useState<string>(() => (defaultValue as string) ?? '');

  const isControlled = value !== undefined;
  const val = (isControlled ? value : internalVal) as string;

  const rules = useMemo(() => {
    return [
      { id: 'len', label: 'At least 8 characters', met: val.length >= 8 },
      { id: 'num', label: 'Contains a number', met: /\d/.test(val) },
      { id: 'upper', label: 'Uppercase & lowercase letters', met: /[a-z]/.test(val) && /[A-Z]/.test(val) },
      { id: 'special', label: 'Special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(val) },
    ];
  }, [val]);

  const score = useMemo(() => {
    if (!val) return 0;
    return rules.filter((r) => r.met).length;
  }, [val, rules]);

  useEffect(() => {
    onStrengthChange?.(score);
  }, [score, onStrengthChange]);

  const strengthMeta = useMemo(() => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500', width: '25%' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', width: '50%' };
      case 3:
        return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500', width: '75%' };
      case 4:
        return { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: '100%' };
      default:
        return { label: 'Empty', color: 'bg-zinc-700', text: 'text-zinc-500', width: '0%' };
    }
  }, [score]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="type-caption font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
          {val && showStrength && (
            <span className={cn('type-micro font-mono font-medium', strengthMeta.text)}>
              {strengthMeta.label}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        <input
          type={visible ? 'text' : 'password'}
          value={val}
          onChange={(e) => {
            setInternalVal(e.target.value);
            onChange?.(e);
          }}
          className={cn(
            'w-full px-3.5 py-2.5 pr-10 type-body rounded-(--radius-field) transition-all dur-quick',
            'bg-(--bg-subtle) dark:bg-(--bg-card) text-zinc-900 dark:text-(--text-primary) placeholder-zinc-400',
            'border border-black/[0.08] dark:border-white/[0.06] focus:border-zinc-500 dark:focus:border-white/20 focus:outline-none',
            error && 'border-rose-500',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 p-1 text-(--text-secondary) hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          title={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="icon-md" /> : <Eye className="icon-md" />}
        </button>
      </div>

      {/* Strength Bar */}
      {showStrength && val.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="w-full h-1 bg-(--bg-raised) dark:bg-white/[0.06] rounded-(--radius-pill) overflow-hidden">
            <div
              className={cn('h-full transition-all dur-slow rounded-(--radius-pill)', strengthMeta.color)}
              style={{ width: strengthMeta.width }}
            />
          </div>

          {/* Validation Checklist */}
          <div className="grid grid-cols-2 gap-1 pt-1">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-1.5 type-micro">
                {rule.met ? (
                  <Check className="icon-xs text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-(--radius-pill) bg-zinc-400 dark:bg-zinc-600 ml-1 mr-0.5 shrink-0" />
                )}
                <span className={cn(rule.met ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500')}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <span className="type-micro text-rose-500">{error}</span>}
    </div>
  );
}
