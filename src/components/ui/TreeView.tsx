/**
 * UI99 — TreeView Component
 * Recursive hierarchical file and folder tree with chevron toggle, icons, and active node selection.
 *
 * A11y: WAI-ARIA tree pattern — role="tree"/"treeitem"/"group", aria-expanded on
 * folders, aria-selected on the active node, roving tabindex with arrow-key
 * navigation (Up/Down move, Right expands, Left collapses), Enter/Space select.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Hash,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
  /** Accessible name for the tree region. */
  label?: string;
}

function getFileIcon(extension?: string) {
  switch (extension) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
    case 'json':
      return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
    case 'css':
      return <Hash className="w-3.5 h-3.5 text-emerald-400" />;
    default:
      return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
  }
}

interface TreeItemProps {
  node: TreeNode;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  level?: number;
  /** Shared registry of refs to every rendered row (flattened document order). */
  rowRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  openState: Map<string, boolean>;
  toggleOpen: (id: string) => void;
}

function TreeItem({
  node,
  selectedId,
  onSelect,
  level = 0,
  rowRefs,
  openState,
  toggleOpen,
}: TreeItemProps) {
  const isFolder = node.type === 'folder';
  const isOpen = isFolder ? openState.get(node.id) ?? true : false;
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleOpen(node.id);
    }
    onSelect?.(node);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isFolder) toggleOpen(node.id);
      onSelect?.(node);
      return;
    }
    if (e.key === 'ArrowRight' && isFolder && !isOpen) {
      e.preventDefault();
      toggleOpen(node.id);
      return;
    }
    if (e.key === 'ArrowLeft' && isFolder && isOpen) {
      e.preventDefault();
      toggleOpen(node.id);
    }
  };

  const children = isFolder && isOpen ? node.children : undefined;

  return (
    <div className="flex flex-col select-none">
      <div
        ref={(el) => {
          if (el) rowRefs.current.set(node.id, el);
          else rowRefs.current.delete(node.id);
        }}
        role="treeitem"
        aria-level={level + 1}
        aria-selected={isSelected}
        aria-expanded={isFolder ? isOpen : undefined}
        tabIndex={-1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        className={cn(
          'flex items-center gap-2 py-1.5 pr-2 rounded-(--radius-field) text-xs font-mono transition-colors cursor-pointer outline-none',
          'focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
          isSelected
            ? 'bg-zinc-200 dark:bg-white/[0.08] text-zinc-950 dark:text-white font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:text-zinc-900 dark:hover:text-zinc-200'
        )}
      >
        {isFolder ? (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen(node.id);
              }}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
            >
              <ChevronRight
                className={cn('w-3.5 h-3.5 transition-transform duration-150', isOpen && 'rotate-90')}
              />
            </button>
            {isOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
          </>
        ) : (
          <span className="w-3.5 h-3.5 shrink-0 ml-1">
            {getFileIcon(node.extension)}
          </span>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {children && (
        <div role="group" className="flex flex-col">
          {children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
              rowRefs={rowRefs}
              openState={openState}
              toggleOpen={toggleOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ data, selectedId, onSelect, className, label = 'File tree' }: TreeViewProps) {
  // Open-state is lifted so arrow-key collapse/expand stays in sync across rows.
  const [openState, setOpenState] = useState<Map<string, boolean>>(() => new Map());
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleOpen = useCallback((id: string) => {
    setOpenState((prev) => {
      const next = new Map(prev);
      next.set(id, !(prev.get(id) ?? true));
      return next;
    });
  }, []);

  /** Flattened visible row ids in document order — the navigation axis. */
  const getVisibleRowIds = useCallback((): string[] => {
    const ids: string[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        ids.push(n.id);
        if (n.type === 'folder' && (openState.get(n.id) ?? true) && n.children) {
          walk(n.children);
        }
      }
    };
    walk(data);
    return ids;
  }, [data, openState]);

  const handleNavKey = useCallback(
    (e: React.KeyboardEvent) => {
      const rows = getVisibleRowIds();
      const current = document.activeElement as HTMLElement | null;
      const currentId = current?.getAttribute('data-tree-id') ?? undefined;
      // Fall back to first row when nothing is focused yet.
      const idx = currentId ? rows.findIndex((r) => {
        const el = rowRefs.current.get(r);
        return el === current;
      }) : -1;

      const focusRow = (id: string) => {
        const el = rowRefs.current.get(id);
        if (el) {
          el.focus();
          el.setAttribute('data-tree-id', id);
        }
      };

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = rows[Math.min(idx + 1, rows.length - 1)] ?? rows[0];
        if (next) focusRow(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = rows[Math.max(idx - 1, 0)] ?? rows[0];
        if (prev) focusRow(prev);
      }
    },
    [getVisibleRowIds],
  );

  return (
    <div
      role="tree"
      aria-label={label}
      onKeyDown={handleNavKey}
      className={cn(
        'p-2 rounded-(--radius-control) bg-white dark:bg-(--bg-card) border border-black/[0.06] dark:border-white/[0.04]',
        'flex flex-col gap-0.5 overflow-hidden',
        className
      )}
    >
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          level={0}
          rowRefs={rowRefs}
          openState={openState}
          toggleOpen={toggleOpen}
        />
      ))}
    </div>
  );
}
