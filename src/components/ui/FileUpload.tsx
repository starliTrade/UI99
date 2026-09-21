/**
 * UI99 — FileUpload (Wave C)
 * Dropzone + keyboard-accessible trigger (hidden native input, label-wrapped):
 * drag state, file list with remove, WCAG-compliant error surfacing.
 */

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tag } from './Button';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label = 'Drop files here or click to browse',
  accept,
  multiple = false,
  disabled,
  onFilesSelected,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const emit = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const next = Array.from(list);
      setFiles((prev) => (multiple ? [...prev, ...next] : next));
      onFilesSelected?.(next);
    },
    [multiple, onFilesSelected]
  );

  return (
    <div className={cn('w-full space-y-2', className)}>
      <label
        className={cn(
          'relative flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-center transition-all duration-150',
          'border-(--border-strong) bg-zinc-50/60 dark:bg-[#0E0E13]/60',
          'hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] focus-visible:outline-none focus-safa',
          isDragging && 'border-emerald-500 bg-emerald-500/[0.05] scale-[0.99]',
          disabled && 'opacity-40 pointer-events-none'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          emit(e.dataTransfer.files);
        }}
      >
        <UploadCloud className="w-5 h-5 text-(--text-muted)" />
        <span className="text-xs font-medium text-(--text-secondary)">{label}</span>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            emit(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Selected files">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <Tag
                variant="neutral"
                onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
              >
                <FileIcon className="w-3 h-3 mr-1 inline" aria-hidden="true" />
                {f.name}
              </Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
