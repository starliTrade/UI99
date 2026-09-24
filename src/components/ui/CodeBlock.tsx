/**
 * UI99 — CodeBlock (World-Class Syntax Highlighted Code Viewer)
 * 
 * Clean, modern IDE terminal with:
 * - Bespoke Dual Syntax Tokens (Obsidian Dark & Clean Porcelain Light)
 * - Single clean Tab Header (No toy macOS dots or duplicate bars)
 * - Line numbering, Word Wrap toggle, and Instant Clipboard copy
 * - Ultra-sleek hairline specular borders
 */

import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import {
  Check,
  Copy,
  Terminal,
  FileCode,
  WrapText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: 'tsx' | 'typescript' | 'ts' | 'jsx' | 'javascript' | 'js' | 'bash' | 'sh' | 'json' | 'css' | string;
  filename?: string;
  showLineNumbers?: boolean;
  showChrome?: boolean;
  maxHeight?: string | number;
  className?: string;
  highlightLines?: number[];
  allowCollapse?: boolean;
  defaultCollapsed?: boolean;
}

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  showLineNumbers = true,
  showChrome = true,
  maxHeight = '480px',
  className = '',
  highlightLines = [],
  allowCollapse = false,
  defaultCollapsed = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Normalize language for Prism
  const normalizedLang = useMemo(() => {
    const l = (language || 'tsx').toLowerCase();
    if (l === 'ts') return 'typescript';
    if (l === 'js') return 'javascript';
    if (l === 'sh') return 'bash';
    if (l === 'shell') return 'bash';
    return l;
  }, [language]);

  // Generate highlighted HTML tokens
  const highlightedCode = useMemo(() => {
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.tsx || Prism.languages.javascript;
      return Prism.highlight(code.trim(), grammar, normalizedLang);
    } catch {
      return code.trim();
    }
  }, [code, normalizedLang]);

  // Split into lines for line numbers & highlighting
  const lines = useMemo(() => {
    return highlightedCode.split('\n');
  }, [highlightedCode]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBash = normalizedLang === 'bash' || normalizedLang === 'sh';
  const lineCount = lines.length;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-2xl',
        'border border-zinc-200/80 dark:border-white/[0.045]',
        'bg-[#FBFBFC] dark:bg-[#07080B]',
        'shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.75)]',
        'transition-all duration-200',
        className
      )}
    >
      {/* Top Header Tab Bar */}
      {showChrome && (
        <div className="flex items-center justify-between border-b border-zinc-200/70 dark:border-white/[0.04] bg-zinc-100/70 dark:bg-[#090A0E] px-3 sm:px-3.5 py-1.5 sm:py-2 select-none min-w-0">
          {/* Active File Tab */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.06] shadow-xs min-w-0">
              {isBash ? (
                <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              )}
              <span className="text-[11px] sm:text-xs font-mono font-medium text-zinc-900 dark:text-zinc-200 truncate">
                {filename || (isBash ? 'Terminal' : `${normalizedLang.toUpperCase()}`)}
              </span>
            </div>

            {/* Line Count Tag */}
            <span className="hidden xs:inline-flex items-center text-[10px] font-mono text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-white/[0.03] shrink-0">
              {lineCount} lines
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* Word wrap toggle */}
            <button
              type="button"
              onClick={() => setWordWrap(!wordWrap)}
              title={wordWrap ? 'Disable wrap' : 'Enable word wrap'}
              aria-label="Toggle word wrap"
              className={cn(
                'hidden sm:inline-flex items-center justify-center p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border',
                wordWrap
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-white dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.06] border-zinc-200/70 dark:border-white/[0.03]'
              )}
            >
              <WrapText className="w-3 h-3" />
            </button>

            {/* Language Tag */}
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              {normalizedLang}
            </span>

            {/* Copy Button */}
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border shrink-0',
                copied
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs'
                  : 'bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.08] border-zinc-200/80 dark:border-white/[0.05]'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[11px] hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Code View Canvas */}
      <div
        className={cn(
          'overflow-x-auto p-3.5 sm:p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed text-zinc-800 dark:text-[#EDEDEF]',
          isCollapsed ? 'max-h-[160px] overflow-hidden' : ''
        )}
        style={{
          maxHeight: isCollapsed ? '160px' : maxHeight || '500px',
        }}
      >
        <pre className={cn('font-mono m-0 p-0 bg-transparent', wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre')}>
          <code className={cn(`language-${normalizedLang}`, 'font-mono block')}>
            {lines.map((lineHtml, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLines.includes(lineNum);

              return (
                <div
                  key={idx}
                  className={cn(
                    'table-row hover:bg-zinc-200/30 dark:hover:bg-white/[0.03] transition-colors group/line',
                    isHighlighted && 'bg-emerald-500/10 -mx-4 px-4'
                  )}
                >
                  {showLineNumbers && (
                    <span
                      className="table-cell select-none text-right pr-3.5 sm:pr-4 text-[11px] text-zinc-400 dark:text-zinc-600 group-hover/line:text-zinc-600 dark:group-hover/line:text-zinc-400 font-mono w-7 sm:w-9 shrink-0 align-top transition-colors"
                      aria-hidden="true"
                    >
                      {lineNum}
                    </span>
                  )}
                  <span
                    className="table-cell font-mono code-token-render align-top"
                    dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                  />
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Collapsed Overlay Gradient & Expand Toggle */}
      {allowCollapse && lineCount > 12 && (
        <div
          className={cn(
            'flex items-center justify-center p-2 border-t border-zinc-200/60 dark:border-white/[0.03] bg-zinc-100/80 dark:bg-[#0A0B10]/90 backdrop-blur-md',
            isCollapsed && 'absolute inset-x-0 bottom-0 pt-10 bg-gradient-to-t from-white dark:from-[#07080C] via-white/90 dark:via-[#07080C]/90 to-transparent'
          )}
        >
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.06] transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Expand Full Code ({lineCount} lines)</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                <span>Collapse Code</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
