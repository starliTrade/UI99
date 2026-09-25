/**
 * UI99 — TagInput Component
 * Multi-tag tokenized chip input with keyboard navigation, backspace deletion, and autocomplete.
 */

import React, { useState, useRef, KeyboardEvent } from 'react';
import { X, Tag as TagIcon, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
  label?: string;
}

export function TagInput({
  tags = [],
  onChange,
  suggestions = ['TypeScript', 'Tailwind', 'React', 'Motion', 'Obsidian', 'DesignSystem', 'Linear'],
  placeholder = 'Add tag and press Enter...',
  maxTags = 12,
  className,
  label,
}: TagInputProps) {
  const [inputVal, setInputVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputVal.toLowerCase()) &&
      !tags.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (tags.length >= maxTags) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;

    onChange([...tags, trimmed]);
    setInputVal('');
    setShowSuggestions(false);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex flex-wrap items-center gap-1.5 p-2 min-h-[42px] rounded-(--radius-field) transition-all duration-150 cursor-text',
          'bg-zinc-50 dark:bg-(--bg-card) text-zinc-900 dark:text-(--text-primary)',
          'border border-black/[0.08] dark:border-white/[0.06] focus-within:border-zinc-500 dark:focus-within:border-white/20',
          className
        )}
      >
        {tags.map((tag, idx) => (
          <span
            key={tag + idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-(--radius-sm) text-xs font-medium bg-zinc-200/80 dark:bg-white/[0.06] text-zinc-800 dark:text-zinc-200 border border-black/[0.04] dark:border-white/[0.04] animate-in fade-in zoom-in-95"
          >
            <TagIcon className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>{tag}</span>
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-(--radius-pill) transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus-visible:outline-none focus-ui99-inset"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            aria-label={label ?? 'Add tag'}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none py-0.5"
          />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && inputVal && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 p-1 rounded-(--radius-field) bg-white dark:bg-(--bg-elevated) border border-black/10 dark:border-white/10 shadow-xl max-h-40 overflow-y-auto">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addTag(s)}
              className="w-full text-left px-3 py-1.5 text-xs rounded-(--radius-sm) hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-zinc-800 dark:text-zinc-200 flex items-center justify-between transition-colors"
            >
              <span>{s}</span>
              <Plus className="w-3 h-3 text-zinc-400" />
            </button>
          ))}        </div>
      )}
    </div>
  );
}
