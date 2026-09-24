/**
 * UI99 — DiffViewer Component
 * Git diff side-by-side and unified line change viewer with additions and deletions.
 */

import React, { useState } from 'react';
import { Plus, Minus, GitCommit, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface DiffLine {
  type: 'add' | 'delete' | 'normal';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffViewerProps {
  fileName?: string;
  lines: DiffLine[];
  className?: string;
}

export function DiffViewer({
  fileName = 'src/tokens/palette.ts',
  lines,
  className,
}: DiffViewerProps) {
  const [copied, setCopied] = useState(false);

  const additions = lines.filter((l) => l.type === 'add').length;
  const deletions = lines.filter((l) => l.type === 'delete').length;

  const copyDiff = () => {
    const text = lines.map((l) => `${l.type === 'add' ? '+' : l.type === 'delete' ? '-' : ' '} ${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-(--bg-canvas) border border-zinc-200 dark:border-white/[0.06] overflow-hidden text-xs font-mono shadow-sm dark:shadow-lg',
        className
      )}
    >
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-(--bg-card) border-b border-zinc-200 dark:border-white/[0.04]">
        <div className="flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-900 dark:text-zinc-200 font-medium">{fileName}</span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{additions}</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">-{deletions}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={copyDiff}
          aria-label="Copy diff"
          className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Line Content */}
      <div className="divide-y divide-zinc-100 dark:divide-white/[0.02] overflow-x-auto py-1">
        {lines.map((line, idx) => {
          const isAdd = line.type === 'add';
          const isDelete = line.type === 'delete';

          return (
            <div
              key={idx}
              className={cn(
                'flex items-center px-2 py-0.5 leading-relaxed font-mono select-text',
                isAdd && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium',
                isDelete && 'bg-rose-500/10 text-rose-700 dark:text-rose-300 line-through opacity-80',
                !isAdd && !isDelete && 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
              )}
            >
              {/* Line Numbers */}
              <div className="w-8 text-right pr-2 text-[10px] text-zinc-400 dark:text-zinc-600 select-none">
                {line.oldLineNumber || ''}
              </div>
              <div className="w-8 text-right pr-3 text-[10px] text-zinc-400 dark:text-zinc-600 select-none">
                {line.newLineNumber || ''}
              </div>

              {/* Sign */}
              <div className="w-4 select-none font-bold">
                {isAdd ? '+' : isDelete ? '-' : ' '}
              </div>

              {/* Code text */}
              <div className="flex-1 whitespace-pre">{line.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
