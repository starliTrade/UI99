/**
 * UI99 — Life Shell (Build 02.0)
 * Calm productivity: Tasks, Calendar rhythm, Reminders, Goals, Habits, and Projects.
 */

import React, { useState } from 'react';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp, LifeSubview } from '../../core/context/AppContext';
import { ObjectType, ObjectStatus } from '../../core/types/objects';
import { SegmentedControl, SegmentOption } from '../ui/SegmentedControl';
import { ObjectCard } from '../ui/ObjectCard';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Toast';
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Bell,
  Target,
  Flame,
  FolderKanban,
  Plus,
} from 'lucide-react';

export function LifeView() {
  const { objects, setSelectedObject } = useObjects();
  const { lifeSubview, setLifeSubview, openCapture, themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE');

  const subviewOptions: SegmentOption<LifeSubview>[] = [
    { value: 'TASKS', label: 'Tasks', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { value: 'HABITS', label: 'Habits', icon: <Flame className="w-3.5 h-3.5" /> },
    { value: 'PROJECTS', label: 'Projects', icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { value: 'GOALS', label: 'Goals', icon: <Target className="w-3.5 h-3.5" /> },
    { value: 'REMINDERS', label: 'Reminders', icon: <Bell className="w-3.5 h-3.5" /> },
    { value: 'CALENDAR', label: 'Schedule', icon: <CalendarIcon className="w-3.5 h-3.5" /> },
  ];

  const getTargetType = (): ObjectType => {
    switch (lifeSubview) {
      case 'TASKS':
        return ObjectType.TASK;
      case 'HABITS':
        return ObjectType.HABIT;
      case 'PROJECTS':
        return ObjectType.PROJECT;
      case 'GOALS':
        return ObjectType.GOAL;
      case 'REMINDERS':
        return ObjectType.REMINDER;
      case 'CALENDAR':
        return ObjectType.EVENT;
      default:
        return ObjectType.TASK;
    }
  };

  const currentType = getTargetType();

  const filteredObjects = objects.filter((o) => {
    if (o.type !== currentType) return false;
    if (filterStatus === 'ACTIVE') return o.status === ObjectStatus.ACTIVE;
    if (filterStatus === 'COMPLETED') return o.status === ObjectStatus.COMPLETED;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Subviews Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
            Life & Productivity
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Organize tasks, habits, and long-term milestones with calm clarity.
          </p>
        </div>

        <Button
          variant={isDark ? 'white-pill' : 'primary'}
          size="sm"
          onClick={() => openCapture(currentType)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          New {subviewOptions.find((o) => o.value === lifeSubview)?.label.slice(0, -1) || 'Item'}
        </Button>
      </div>

      {/* Subview Selector */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <SegmentedControl
          options={subviewOptions}
          value={lifeSubview}
          onChange={setLifeSubview}
          size="sm"
        />
      </div>

      {/* Status Filter for tasks/projects */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 p-1 rounded-full transition-all ${
            isDark
              ? 'bg-[#0E0E13] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
              : 'bg-white border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          }`}
        >
          {(['ACTIVE', 'COMPLETED', 'ALL'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === s
                  ? isDark
                    ? 'bg-white text-black shadow-xs'
                    : 'bg-[#111116] text-white shadow-xs'
                  : isDark
                  ? 'text-[#8E8E98] hover:text-white'
                  : 'text-[#6E6E78] hover:text-[#111116]'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <span className={`text-xs font-mono ${isDark ? 'text-[#5C5C68]' : 'text-[#8E8E98]'}`}>
          {filteredObjects.length} {filteredObjects.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Object List / Grid (Linear-style Inset Grouped Feed for Tasks/Habits) */}
      {filteredObjects.length === 0 ? (
        <EmptyState
          title={`No ${lifeSubview.toLowerCase()} found`}
          description={`Start capturing and tracking your ${lifeSubview.toLowerCase()} in UI99.`}
          actionLabel={`Add ${subviewOptions.find((o) => o.value === lifeSubview)?.label || 'Item'}`}
          onAction={() => openCapture(currentType)}
        />
      ) : lifeSubview === 'TASKS' || lifeSubview === 'HABITS' ? (
        <div className="linear-group-container">
          {filteredObjects.map((obj) => {
            const isCompleted = obj.status === ObjectStatus.COMPLETED;
            const isTask = obj.type === ObjectType.TASK;
            const isHabit = obj.type === ObjectType.HABIT;

            return (
              <div
                key={obj.id}
                onClick={() => setSelectedObject(obj)}
                className={`linear-group-row cursor-pointer ${
                  isCompleted ? 'opacity-40' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {isTask && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle task
                        obj.status = isCompleted ? ObjectStatus.ACTIVE : ObjectStatus.COMPLETED;
                      }}
                      className="p-1 text-zinc-500 hover:text-white transition-colors shrink-0 cursor-pointer"
                      aria-label="Toggle Complete"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-4.5 h-4.5 text-emerald-400" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded border border-zinc-600 hover:border-zinc-300" />
                      )}
                    </button>
                  )}

                  {isHabit && (
                    <div className="w-6 h-6 rounded-full bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs sm:text-[13.5px] font-medium tracking-tight truncate ${
                          isDark ? 'text-[#EDEDEF]' : 'text-zinc-900'
                        } ${isCompleted ? 'line-through text-zinc-500' : ''}`}
                      >
                        {obj.title}
                      </span>
                      {obj.metadata?.priority === 'high' && (
                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                          P1
                        </span>
                      )}
                    </div>
                    {obj.description && (
                      <p className={`text-[11px] truncate mt-0.5 font-light ${isDark ? 'text-[#8E8E98]' : 'text-zinc-500'}`}>
                        {obj.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-3 rtl:mr-3 rtl:ml-0">
                  {isHabit && obj.metadata?.streak !== undefined && (
                    <span className="text-xs font-mono font-semibold text-orange-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-current" />
                      {obj.metadata.streak}d
                    </span>
                  )}
                  {obj.tags?.[0] && (
                    <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500">
                      #{obj.tags[0]}
                    </span>
                  )}
                  <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {new Date(obj.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
