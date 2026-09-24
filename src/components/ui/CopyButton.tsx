/**
 * UI99 — CopyButton (Wave H)
 * Clipboard affordance with icon morph (copy → check) and aria-live
 * announcement. Self-contained timer cleanup.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CopyButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function CopyButton({ text, label = 'Copy', size = 'sm', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer',
        'border border-black/[0.06] bg-white text-zinc-600 hover:bg-black/[0.03]',
        'dark:border-white/[0.06] dark:bg-(--bg-elevated) dark:text-(--text-secondary) dark:hover:bg-white/[0.05]',
        'focus-visible:outline-none focus-ui99-inset',
        size === 'sm' ? 'h-8 px-2.5' : 'h-10 px-3.5',
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}
