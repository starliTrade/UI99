/**
 * SAFA — Global Search & Command Foundation (Build 02.0)
 * Fast multi-type search across the Universal Object Graph.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { SearchBar } from '../ui/Input';
import { ObjectType, BaseObject } from '../../core/types/objects';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp } from '../../core/context/AppContext';
import { ArrowRight, Layers } from 'lucide-react';

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, setCurrentTab } = useApp();
  const { objects, setSelectedObject } = useObjects();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    return objects.filter((obj) => {
      if (selectedType !== 'ALL' && obj.type !== selectedType) return false;
      if (!q) return true;
      const titleMatch = obj.title.toLowerCase().includes(q);
      const descMatch = (obj.description || '').toLowerCase().includes(q);
      const tagMatch = obj.tags?.some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch;
    });
  }, [objects, query, selectedType]);

  const typeFilters = [
    { value: 'ALL', label: 'All' },
    { value: ObjectType.TASK, label: 'Tasks' },
    { value: ObjectType.NOTE, label: 'Notes' },
    { value: ObjectType.IDEA, label: 'Ideas' },
    { value: ObjectType.PROJECT, label: 'Projects' },
    { value: ObjectType.BOOK, label: 'Books' },
    { value: ObjectType.MEMORY, label: 'Memories' },
  ];

  const handleSelectObject = (obj: BaseObject) => {
    setSelectedObject(obj);
    setIsSearchOpen(false);
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      title="Search Everything"
      subtitle="Find connected objects, thoughts, tasks, and media"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search input */}
        <SearchBar
          autoFocus
          value={query}
          onChange={setQuery}
          placeholder="Search by title, description, #tags..."
        />

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {typeFilters.map((f) => {
            const isSelected = selectedType === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setSelectedType(f.value)}
                className={`px-3 py-1 text-xs rounded-full transition-all whitespace-nowrap cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white text-[#09090B] font-bold shadow-[0_2px_10px_rgba(255,255,255,0.25)]'
                    : 'bg-[#18181D] text-zinc-400 border border-white/[0.08] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pt-2 border-t border-white/[0.06]">
          {/* Quick Launcher for UI KIT */}
          {(!query || 'ui kit design system linear'.includes(query.toLowerCase())) && (
            <div
              onClick={() => {
                setIsSearchOpen(false);
                setCurrentTab('UIKIT');
              }}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/[0.08] to-transparent border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.12] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">SAFA UI KIT & Design System</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                      LINEAR SPEC
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Comprehensive design tokens, linear issues, surfaces, inputs & feedback
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          )}

          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">
              No objects found matching "{query}"
            </div>
          ) : (
            filteredResults.map((obj) => (
              <div
                key={obj.id}
                onClick={() => handleSelectObject(obj)}
                className="p-3.5 rounded-xl bg-[#18181D] border border-white/[0.08] hover:border-white/20 hover:bg-[#202026] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {obj.type}
                    </span>
                    {obj.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] text-zinc-500 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">{obj.title}</h4>
                  {obj.description && (
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{obj.description}</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
