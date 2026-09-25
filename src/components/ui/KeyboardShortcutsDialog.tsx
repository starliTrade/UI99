/**
 * UI99 — KeyboardShortcutsDialog Component
 * Complete modal table displaying keyboard shortcuts organized by category.
 */

import React from 'react';
import { Command, X, Search, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Kbd } from './Kbd';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog';

export interface ShortcutGroup {
  category: string;
  shortcuts: Array<{
    description: string;
    keys: string[];
  }>;
}

export interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups?: ShortcutGroup[];
}

const DEFAULT_SHORTCUTS: ShortcutGroup[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { description: 'Next issue / row item', keys: ['J', '↓'] },
      { description: 'Previous issue / row item', keys: ['K', '↑'] },
      { description: 'Open Global Command Menu', keys: ['⌘', 'K'] },
      { description: 'Switch to next workspace view', keys: ['G', 'N'] },
    ],
  },
  {
    category: 'Actions & Creation',
    shortcuts: [
      { description: 'Create new issue / item', keys: ['C'] },
      { description: 'Save and submit inline creation', keys: ['⌘', '↵'] },
      { description: 'Toggle task done / completed', keys: ['Space'] },
      { description: 'Toggle multi-selection checkbox', keys: ['X'] },
      { description: 'Open action filter bar', keys: ['F'] },
    ],
  },
  {
    category: 'Application',
    shortcuts: [
      { description: 'Show keyboard shortcuts helper', keys: ['?'] },
      { description: 'Toggle Obsidian Dark / Matte Porcelain', keys: ['⌘', 'D'] },
      { description: 'Close current modal or floating sheet', keys: ['Esc'] },
    ],
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  groups = DEFAULT_SHORTCUTS,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto p-6 rounded-(--radius-lg) bg-white dark:bg-(--bg-elevated) border border-black/10 dark:border-white/[0.04]">
        <DialogHeader className="pb-4 border-b border-black/[0.04] dark:border-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-(--radius-field) bg-zinc-100 dark:bg-white/[0.06] flex items-center justify-center text-zinc-800 dark:text-zinc-200">
              <Command className="icon-md" />
            </div>
            <div>
              <DialogTitle className="type-body-lg font-semibold text-zinc-900 dark:text-white">
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription className="type-caption text-(--text-muted) dark:text-zinc-400">
                High-velocity hotkeys configured for the UI99 workspace.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-4">
          {groups.map((group) => (
            <section key={group.category} aria-label={`${group.category} shortcuts`} className="flex flex-col gap-2.5">
              <h4 className="type-caption font-mono font-semibold uppercase tracking-wider text-(--text-secondary) dark:text-zinc-500">
                {group.category}
              </h4>
              <dl className="flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.03]">
                {group.shortcuts.map((sc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 type-caption text-zinc-700 dark:text-zinc-300"
                  >
                    <dt>{sc.description}</dt>
                    <dd className="flex items-center gap-1">
                      {sc.keys.map((k, kIdx) => (
                        <Kbd key={kIdx} size="sm">
                          {k}
                        </Kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
