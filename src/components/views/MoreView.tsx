/**
 * SAFA — More Shell (Build 02.0)
 * Memories, Journal Reflection, Connected Graph Map, SLO Hub, and Data Sovereignty.
 */

import React, { useState } from 'react';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { ObjectType } from '../../core/types/objects';
import { ObjectCard } from '../ui/ObjectCard';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
  Heart,
  BookHeart,
  Network,
  HeartHandshake,
  Sparkles,
  Link2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function MoreView() {
  const { objects, setSelectedObject, getRelatedObjects } = useObjects();
  const { openCapture, themeMode, setCurrentTab } = useApp();
  const isDark = themeMode === 'dark';
  const [activeSection, setActiveSection] = useState<'MEMORIES' | 'JOURNAL' | 'GRAPH' | 'SLO'>('MEMORIES');

  const memories = objects.filter((o) => o.type === ObjectType.MEMORY);
  const journals = objects.filter((o) => o.type === ObjectType.JOURNAL_ENTRY);
  const sloSharedObjects = objects.filter((o) => o.permissions?.allowSLOAccess);

  const sections = [
    { value: 'MEMORIES', label: 'Memories', icon: <Heart className="w-3.5 h-3.5" /> },
    { value: 'JOURNAL', label: 'Journal', icon: <BookHeart className="w-3.5 h-3.5" /> },
    { value: 'GRAPH', label: 'Graph Map', icon: <Network className="w-3.5 h-3.5" /> },
    { value: 'SLO', label: 'SLO Hub', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
            Memories, Connections & Insights
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Cherished moments, personal reflections, graph relationships, and SLO access.
          </p>
        </div>

        <Button
          variant={isDark ? 'white-pill' : 'primary'}
          size="sm"
          onClick={() => {
            if (activeSection === 'MEMORIES') openCapture(ObjectType.MEMORY);
            else if (activeSection === 'JOURNAL') openCapture(ObjectType.JOURNAL_ENTRY);
            else openCapture();
          }}
        >
          {activeSection === 'MEMORIES' ? 'Capture Memory' : activeSection === 'JOURNAL' ? 'Write Entry' : 'New Capture'}
        </Button>
      </div>

      {/* Segmented control */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <SegmentedControl
          options={sections as any}
          value={activeSection}
          onChange={setActiveSection as any}
          size="sm"
        />
      </div>

      {/* 1. MEMORIES SECTION */}
      {activeSection === 'MEMORIES' && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
              isDark
                ? 'bg-[#0E0F14] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                : 'bg-white border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                Moments & Memories
              </span>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{memories.length} saved</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {memories.map((m) => (
              <ObjectCard key={m.id} object={m} onClick={() => setSelectedObject(m)} />
            ))}
          </div>
        </div>
      )}

      {/* 2. JOURNAL SECTION */}
      {activeSection === 'JOURNAL' && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
              isDark
                ? 'bg-[#0E0F14] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                : 'bg-white border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-500">
              <BookHeart className="w-4 h-4" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                Personal Reflections & Log
              </span>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{journals.length} reflections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {journals.map((j) => (
              <ObjectCard key={j.id} object={j} onClick={() => setSelectedObject(j)} />
            ))}
          </div>
        </div>
      )}

      {/* 3. GRAPH MAP SECTION */}
      {activeSection === 'GRAPH' && (
        <div
          className={`p-6 rounded-3xl space-y-4 transition-all ${
            isDark
              ? 'bg-[#0E0F14] border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
              : 'bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-amber-500" />
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111116]'}`}>Universal Object Connected Graph</h4>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{objects.length} connected entities</span>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            In SAFA, everything is connected. Ideas inspire projects, tasks belong to goals, books generate notes, and memories link to people.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {objects.slice(0, 6).map((obj) => {
              const rels = getRelatedObjects(obj.id);
              return (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObject(obj)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15]'
                      : 'bg-black/[0.025] border border-black/[0.05] hover:border-black/[0.12]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">
                      {obj.type}
                    </span>
                    <span className={`font-semibold truncate block ${isDark ? 'text-white' : 'text-[#111116]'}`}>{obj.title}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[11px] shrink-0 px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'text-zinc-400 bg-white/[0.06] border-white/[0.08]'
                        : 'text-zinc-600 bg-black/[0.04] border-black/[0.06]'
                    }`}
                  >
                    <Link2 className="w-3 h-3 text-amber-500" />
                    <span>{rels.length} links</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SLO HUB SECTION */}
      {activeSection === 'SLO' && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-3xl space-y-3 transition-all ${
              isDark
                ? 'bg-[#0E0F14] border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                : 'bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111116]'}`}>Special Connection (SLO)</h4>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Strict authorization boundary. Only objects explicitly enabled with "Allow SLO Access" are visible.
                </p>
              </div>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <span className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Currently Shared Items:</span>
              <span className="font-bold bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 text-purple-400">
                {sloSharedObjects.length} objects
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Shared Objects with SLO
            </h4>
            {sloSharedObjects.length === 0 ? (
              <p className={`text-xs p-4 rounded-2xl border text-center ${isDark ? 'text-zinc-400 bg-[#0E0F14] border-white/[0.08]' : 'text-zinc-600 bg-white border-black/[0.05]'}`}>
                No objects are currently shared with SLO. You maintain 100% private custody.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sloSharedObjects.map((o) => (
                  <ObjectCard key={o.id} object={o} onClick={() => setSelectedObject(o)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Universal Design System & UI Kit Banner */}
      <div
        onClick={() => setCurrentTab('UIKIT')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark
            ? 'bg-[#0E0E14]/80 hover:bg-[#14141C] border-white/[0.04] hover:border-emerald-500/30 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]'
            : 'bg-white hover:bg-zinc-50 border-black/[0.04] hover:border-emerald-500/40 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                SAFA UI KIT & Design System
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                Linear Standards
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Full token matrix, tactile Linear issues, obsidian surfaces, glass docks, and input controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className={`text-xs font-medium group-hover:text-emerald-400 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Explore UI Kit
          </span>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
