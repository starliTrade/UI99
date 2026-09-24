/**
 * UI99 — TreeView Component
 * Recursive hierarchical file and folder tree with chevron toggle, icons, and active node selection.
 */

import React, { useState } from 'react';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Hash,
  Sparkles,
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

function TreeItem({
  node,
  selectedId,
  onSelect,
  level = 0,
}: {
  node: TreeNode;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  level?: number;
}) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === 'folder';
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setOpen(!open);
    }
    onSelect?.(node);
  };

  return (
    <div className="flex flex-col select-none">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        className={cn(
          'flex items-center gap-2 py-1.5 pr-2 rounded-xl text-xs font-mono transition-colors cursor-pointer',
          isSelected
            ? 'bg-zinc-200 dark:bg-white/[0.08] text-zinc-950 dark:text-white font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.03] hover:text-zinc-900 dark:hover:text-zinc-200'
        )}
      >
        {isFolder ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
            >
              <ChevronRight
                className={cn('w-3.5 h-3.5 transition-transform duration-150', open && 'rotate-90')}
              />
            </button>
            {open ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 shrink-0 ml-1">
              {getFileIcon(node.extension)}
            </span>
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && open && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ data, selectedId, onSelect, className }: TreeViewProps) {
  return (
    <div
      className={cn(
        'p-2 rounded-2xl bg-white dark:bg-[#0B0C11] border border-black/[0.06] dark:border-white/[0.04]',
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
        />
      ))}
    </div>
  );
}
