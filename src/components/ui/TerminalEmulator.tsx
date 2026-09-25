/**
 * UI99 — TerminalEmulator Component
 * Interactive Obsidian terminal CLI runner with command history, status badges, and syntax highlighting.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Copy, Check, Trash2, CornerDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Kbd } from './Kbd';

export interface TerminalLog {
  id: string;
  command: string;
  output?: string;
  status: 'success' | 'error' | 'pending';
  timestamp: string;
}

export interface TerminalEmulatorProps {
  initialLogs?: TerminalLog[];
  onExecute?: (command: string) => Promise<string | void>;
  className?: string;
}

const DEFAULT_LOGS: TerminalLog[] = [
  {
    id: '1',
    command: 'npx @99/ui add button badge card switch tabs',
    output: '✔ Installed 5 components\n✔ Validated WCAG AAA contrast ratio\n✔ Generated tailwind specular tokens',
    status: 'success',
    timestamp: '10:42:01',
  },
  {
    id: '2',
    command: 'ui99 audit --strict',
    output: 'Obsidian Velvet Tokens: 100% OK\nMathematical Radii Nesting: PASS (Inner = Outer - P)\nSlop Ratio: 0.00%',
    status: 'success',
    timestamp: '10:42:15',
  },
];

export function TerminalEmulator({
  initialLogs = DEFAULT_LOGS,
  onExecute,
  className,
}: TerminalEmulatorProps) {
  const [logs, setLogs] = useState<TerminalLog[]>(initialLogs);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const runCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd || loading) return;

    const newId = Date.now().toString();
    const time = new Date().toTimeString().split(' ')[0];

    if (cmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    setLoading(true);
    setInputVal('');

    setLogs((prev) => [
      ...prev,
      { id: newId, command: cmd, status: 'pending', timestamp: time },
    ]);

    try {
      let result = 'Command executed successfully.';
      if (onExecute) {
        const res = await onExecute(cmd);
        if (res) result = res;
      } else {
        if (cmd.startsWith('add') || cmd.startsWith('npx')) {
          result = `✔ Added component to src/components/ui/`;
        } else if (cmd === 'help') {
          result = `Available commands: add <component>, audit, clear, status, info`;
        } else {
          result = `Executed: ${cmd}`;
        }
      }

      setLogs((prev) =>
        prev.map((l) =>
          l.id === newId ? { ...l, output: result, status: 'success' } : l
        )
      );
    } catch (err: any) {
      setLogs((prev) =>
        prev.map((l) =>
          l.id === newId ? { ...l, output: err?.message || 'Error executing command', status: 'error' } : l
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = logs.map((l) => `$ ${l.command}\n${l.output || ''}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        'rounded-(--radius-control) bg-(--bg-canvas) border border-white/[0.06] text-xs font-mono flex flex-col shadow-xl overflow-hidden w-full',
        className
      )}
    >
      {/* Top Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-(--bg-card) border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-(--radius-pill) bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-(--radius-pill) bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-(--radius-pill) bg-emerald-500/80" />
          </div>
          <span className="text-zinc-400 font-medium ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            ui99-cli ~ v1.0.0
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copyAll}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
            title="Copy terminal session"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="p-1 rounded text-zinc-400 hover:text-rose-400 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output */}
      <div
        ref={containerRef}
        className="p-4 flex flex-col gap-3 min-h-[160px] max-h-[280px] overflow-y-auto divide-y divide-white/[0.02]"
      >
        {logs.map((log) => (
          <div key={log.id} className="pt-2 first:pt-0 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <span className="text-emerald-400 font-bold">$</span>
              <span>{log.command}</span>
              <span className="text-[10px] text-zinc-600 ml-auto">{log.timestamp}</span>
            </div>

            {log.output && (
              <pre className={cn(
                'whitespace-pre-wrap pl-4 text-xs font-mono',
                log.status === 'error' ? 'text-rose-400' : 'text-zinc-400'
              )}>
                {log.output}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Command Input Form */}
      <form
        onSubmit={runCommand}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-(--bg-card) border-t border-white/[0.04]"
      >
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Try 'add button' or 'help'..."
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 outline-none text-xs font-mono"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || loading}
          className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
