/**
 * UI99 — Create Shell & Creative Atelier (Build 02.0)
 * Notes, Concept Ideas, Longform Writing, Sketches, and Fashion Studio / Swatches.
 */

import React from 'react';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp, CreateSubview } from '../../core/context/AppContext';
import { ObjectType } from '../../core/types/objects';
import { SegmentedControl, SegmentOption } from '../ui/SegmentedControl';
import { ObjectCard } from '../ui/ObjectCard';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Toast';
import {
  FileText,
  Lightbulb,
  PenTool,
  Palette,
  Scissors,
  Plus,
} from 'lucide-react';

export function CreateView() {
  const { objects, setSelectedObject } = useObjects();
  const { createSubview, setCreateSubview, openCapture, themeMode } = useApp();
  const isDark = themeMode === 'dark';

  const subviewOptions: SegmentOption<CreateSubview>[] = [
    { value: 'NOTES', label: 'Notes', icon: <FileText className="w-3.5 h-3.5" /> },
    { value: 'IDEAS', label: 'Ideas & Concepts', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { value: 'STUDIO', label: 'Fashion Atelier', icon: <Scissors className="w-3.5 h-3.5" /> },
    { value: 'WRITING', label: 'Essays & Writing', icon: <PenTool className="w-3.5 h-3.5" /> },
    { value: 'DRAWING', label: 'Sketches', icon: <Palette className="w-3.5 h-3.5" /> },
  ];

  const getTargetType = (): ObjectType => {
    switch (createSubview) {
      case 'NOTES':
        return ObjectType.NOTE;
      case 'IDEAS':
        return ObjectType.IDEA;
      case 'STUDIO':
        return ObjectType.FASHION_PROJECT;
      case 'WRITING':
        return ObjectType.NOTE;
      case 'DRAWING':
        return ObjectType.SKETCH;
      default:
        return ObjectType.NOTE;
    }
  };

  const currentType = getTargetType();

  const filteredObjects = objects.filter((o) => {
    if (createSubview === 'STUDIO') {
      return o.type === ObjectType.FASHION_PROJECT || o.type === ObjectType.IDEA;
    }
    return o.type === currentType;
  });

  // Fashion Atelier Color Palette Inspiration
  const atelierPalettes = [
    { name: 'Raw Mulberry Silk', hex: '#FAF5F0', border: 'rgba(255,255,255,0.1)' },
    { name: 'Midnight Charcoal', hex: '#161619', border: 'rgba(255,255,255,0.15)' },
    { name: 'Warm Amber Gold', hex: '#FACC15', border: 'rgba(250,204,21,0.3)' },
    { name: 'Deep Iris Violet', hex: '#A855F7', border: 'rgba(168,85,247,0.3)' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
            Creative Atelier & Studio
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Capture thoughts, design capsules, moodboards, and artistic concepts.
          </p>
        </div>

        <Button
          variant={isDark ? 'white-pill' : 'primary'}
          size="sm"
          onClick={() => openCapture(currentType)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          New {subviewOptions.find((o) => o.value === createSubview)?.label || 'Creation'}
        </Button>
      </div>

      {/* Subview Selector */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <SegmentedControl
          options={subviewOptions}
          value={createSubview}
          onChange={setCreateSubview}
          size="sm"
        />
      </div>

      {/* Special Fashion Atelier Palette Header if in Studio view */}
      {createSubview === 'STUDIO' && (
        <div
          className={`p-4 sm:p-5 rounded-[26px] space-y-3 transition-all ${
            isDark
              ? 'bg-[#0E0F14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_16px_36px_rgba(0,0,0,0.6)]'
              : 'bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_8px_24px_rgba(0,0,0,0.05)] border border-black/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-zinc-200' : 'text-[#111116]'}`}>
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Autumn / Capsule Atelier Swatches
            </span>
            <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-[#8E8E98]'}`}>Curated Palette</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {atelierPalettes.map((p) => (
              <div
                key={p.name}
                className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
                  isDark
                    ? 'bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    : 'bg-black/[0.03] border border-black/[0.04]'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg border shadow-xs shrink-0"
                  style={{ backgroundColor: p.hex, borderColor: p.border }}
                />
                <div className="min-w-0">
                  <span className={`text-xs font-semibold block truncate ${isDark ? 'text-white' : 'text-[#111116]'}`}>{p.name}</span>
                  <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-400' : 'text-[#8E8E98]'}`}>{p.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Object List */}
      {filteredObjects.length === 0 ? (
        <EmptyState
          title={`No ${createSubview.toLowerCase()} yet`}
          description="Every great collection begins with a simple, quiet thought."
          actionLabel={`Add ${createSubview}`}
          onAction={() => openCapture(currentType)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredObjects.map((obj) => (
            <ObjectCard
              key={obj.id}
              object={obj}
              onClick={() => setSelectedObject(obj)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
