/**
 * UI99 — CodeBlock (Wave G)
 * Terminal-style code display with copy button and language tag. Syntax
 * highlighting intentionally lightweight: single-accent tint (zero deps);
 * hosts needing full highlighting can swap children for their own renderer.
  * @token Host body is the fixed terminal surface (#0A0B0F) — intentionally theme-constant so code reads identically in both themes.
*/

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  showLineNumbers = false,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0B0F] text-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.4)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </span>
          {filename && <span className="text-[10px] font-mono text-zinc-500">{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
            {language}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer focus-visible:outline-none focus-safa-inset relative after:absolute after:-inset-1 after:content-['']"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-[11px] leading-relaxed font-mono">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {showLineNumbers && (
                <span className="mr-3 inline-block w-6 select-none text-right text-zinc-600">
                  {i + 1}
                </span>
              )}
              {line || ' '}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
