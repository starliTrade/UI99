/**
 * UI99 — RichTextEditorBar Component
 * Floating velvet toolbar for rich text editing with hotkey indicators.
 */

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Kbd } from './Kbd';

export interface RichTextEditorBarProps {
  onFormat?: (type: string) => void;
  className?: string;
  activeFormats?: string[];
}

export function RichTextEditorBar({
  onFormat,
  className,
  activeFormats = [],
}: RichTextEditorBarProps) {
  const [activeList, setActiveList] = useState<string[]>(activeFormats);

  const toggleFormat = (key: string) => {
    setActiveList((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    onFormat?.(key);
  };

  const buttons = [
    { key: 'bold', label: 'Bold', icon: Bold, shortcut: '⌘B' },
    { key: 'italic', label: 'Italic', icon: Italic, shortcut: '⌘I' },
    { key: 'underline', label: 'Underline', icon: Underline, shortcut: '⌘U' },
    { key: 'strikethrough', label: 'Strike', icon: Strikethrough },
    { type: 'separator' },
    { key: 'code', label: 'Code', icon: Code, shortcut: '⌘E' },
    { key: 'quote', label: 'Quote', icon: Quote },
    { type: 'separator' },
    { key: 'bullet', label: 'Bullet List', icon: List },
    { key: 'number', label: 'Numbered List', icon: ListOrdered },
    { type: 'separator' },
    { key: 'align-left', label: 'Left', icon: AlignLeft },
    { key: 'align-center', label: 'Center', icon: AlignCenter },
    { key: 'align-right', label: 'Right', icon: AlignRight },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 p-1 rounded-(--radius-control) bg-white/95 dark:bg-(--bg-elevated)/90 backdrop-blur-xl',
        'border border-black/[0.06] dark:border-white/[0.04] shadow-(--elevation-3)',
        className
      )}
    >
      {buttons.map((btn, idx) => {
        if (btn.type === 'separator') {
          return <div key={idx} className="w-[1px] h-4 bg-(--bg-raised) dark:bg-white/[0.06] mx-1" />;
        }
        const Icon = btn.icon!;
        const isActive = activeList.includes(btn.key!);

        return (
          <button
            key={btn.key}
            type="button"
            onClick={() => toggleFormat(btn.key!)}
            title={btn.label}
            className={cn(
              'p-1.5 rounded-(--radius-sm) transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-white',
              isActive
                ? 'bg-(--bg-raised) dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-xs font-semibold'
                : 'hover:bg-(--bg-subtle) dark:hover:bg-white/[0.04]'
            )}
          >
            <Icon className="icon-md" />
          </button>
        );
      })}
    </div>
  );
}
