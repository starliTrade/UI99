/**
 * UI99 — Unified Velvet Object Card (Build 02.2)
 * Enhanced with iOS-squircle corners (rounded-(var(--radius-lg))), specular top edge (inset 0 1px 1px),
 * luminous glowing progress / streaks and smooth spring micro-physics.
 */

import React from 'react';
import { motion } from 'motion/react';
import { BaseObject, ObjectStatus, ObjectType } from '../../core/types/objects';
import { useObjects } from '../../core/context/ObjectContext';
import { useAuth } from '../../core/context/AuthContext';
import { useIsDark } from './theme';
import { Tag } from './Button';
import {
  CheckCircle2,
  Circle,
  Link2,
  BookOpen,
  Flame,
} from 'lucide-react';

interface ObjectCardProps {
  object: BaseObject;
  onClick?: () => void;
  showRelations?: boolean;
  compact?: boolean;
}

export function ObjectCard({
  object,
  onClick,
  showRelations = true,
}: ObjectCardProps) {
  const { updateObject, getRelatedObjects } = useObjects();
  const { isRTL } = useAuth();
  const isDark = useIsDark();
  const related = getRelatedObjects(object.id);

  const isTask = object.type === ObjectType.TASK;
  const isHabit = object.type === ObjectType.HABIT;
  const isMemory = object.type === ObjectType.MEMORY;
  const isBook = object.type === ObjectType.BOOK;
  const isJournal = object.type === ObjectType.JOURNAL_ENTRY;
  const isProject = object.type === ObjectType.PROJECT;
  const isFashion = object.type === ObjectType.FASHION_PROJECT;
  const isCompleted = object.status === ObjectStatus.COMPLETED;

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateObject(object.id, {
      status: isCompleted ? ObjectStatus.ACTIVE : ObjectStatus.COMPLETED,
    });
  };

  const handleIncrementStreak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const curStreak = object.metadata?.streak || 0;
    await updateObject(object.id, {
      metadata: {
        ...object.metadata,
        streak: curStreak + 1,
        lastCompletedDate: new Date().toISOString().split('T')[0],
      },
    });
  };

  const getTypeBadge = () => {
    switch (object.type) {
      case ObjectType.TASK:
        return { label: isRTL ? 'وظیفه' : 'Task', variant: 'neutral' as const };
      case ObjectType.HABIT:
        return { label: isRTL ? 'آیین' : 'Ritual', variant: 'green' as const };
      case ObjectType.PROJECT:
        return { label: isRTL ? 'پروژه' : 'Project', variant: 'amber' as const };
      case ObjectType.FASHION_PROJECT:
        return { label: isRTL ? 'آتلیه مد' : 'Fashion Atelier', variant: 'amber' as const };
      case ObjectType.MEMORY:
        return { label: isRTL ? 'خاطره' : 'Memory', variant: 'purple' as const };
      case ObjectType.JOURNAL_ENTRY:
        return { label: isRTL ? 'دفترچه' : 'Journal', variant: 'purple' as const };
      case ObjectType.BOOK:
        return { label: isRTL ? 'کتاب' : 'Literature', variant: 'neutral' as const };
      default:
        return { label: object.type.replace('_', ' '), variant: 'neutral' as const };
    }
  };

  const badge = getTypeBadge();

  // 1. Editorial Card for Memory & Journal
  if (isMemory || isJournal) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={onClick}
        className={`group relative p-6 rounded-(var(--radius-xl)) cursor-pointer overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) shadow-(var(--rim-soft), var(--elevation-3)) hover:shadow-(var(--rim-soft), var(--elevation-4))'
            : 'bg-white shadow-(var(--rim-soft), var(--elevation-2)) border border-black/[0.035] hover:border-black/[0.08] hover:shadow-(var(--elevation-2))'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2 relative z-10">
          <Tag variant={badge.variant} size="sm">
            {badge.label}
          </Tag>
          <span className="text-[10px] text-zinc-400 font-mono">
            {new Date(object.createdAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h4 className={`text-base font-semibold tracking-tight leading-snug relative z-10 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          "{object.title}"
        </h4>

        {object.description && (
          <p className={`text-xs mt-2 italic leading-relaxed line-clamp-3 font-serif-luxury relative z-10 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {object.description}
          </p>
        )}

        <div className={`mt-4 flex items-center justify-between pt-3 border-t relative z-10 ${isDark ? 'border-white/[0.04]' : 'border-black/[0.05]'}`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {object.tags?.slice(0, 2).map((t) => (
              <Tag key={t} variant="neutral" size="sm">
                {t}
              </Tag>
            ))}
          </div>
          {showRelations && related.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
              <Link2 className="w-3 h-3" />
              <span>{related.length}</span>
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. Editorial Card for Books
  if (isBook) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={onClick}
        className={`group relative p-5 rounded-(var(--radius-xl)) cursor-pointer flex gap-4 overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) shadow-(var(--rim-soft), var(--elevation-3)) hover:shadow-(var(--rim-soft), var(--elevation-4))'
            : 'bg-white shadow-(var(--rim-soft), var(--elevation-2)) border border-black/[0.035] hover:border-black/[0.08] hover:shadow-(var(--elevation-2))'
        }`}
      >
        <div className={`w-12 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isDark ? 'bg-white/[0.05] text-zinc-400 shadow-(var(--rim-soft), var(--elevation-1))' : 'bg-black/[0.04] text-zinc-600'}`}>
          <BookOpen className="w-4 h-4 stroke-[1.8] text-amber-500" />
          <span className="text-[8px] font-mono mt-1 font-semibold opacity-60">BOOK</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Tag variant={badge.variant} size="sm">
              {badge.label}
            </Tag>
            {object.metadata?.status && (
              <span className="text-[10px] text-zinc-400">
                {object.metadata.status}
              </span>
            )}
          </div>

          <h4 className={`text-sm sm:text-base font-semibold tracking-tight truncate ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            {object.title}
          </h4>

          {object.metadata?.author && (
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              by {object.metadata.author}
            </p>
          )}

          {object.metadata?.rating && (
            <div className="mt-2 text-[10px] text-amber-500 font-semibold">
              ★ {object.metadata.rating} / 5
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // 3. Project & Fashion Atelier Card
  if (isProject || isFashion) {
    const progress = object.metadata?.progress ?? 65;
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={onClick}
        className={`group relative p-6 rounded-(var(--radius-xl)) cursor-pointer overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) card-aura-emerald shadow-(var(--rim-soft), var(--elevation-3)) hover:shadow-(var(--rim-soft), var(--elevation-4))'
            : 'bg-white shadow-(var(--rim-soft), var(--elevation-2)) border border-black/[0.035] hover:border-black/[0.08] hover:shadow-(var(--elevation-2))'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <Tag variant={badge.variant} size="sm">
            {badge.label}
          </Tag>
          <span className="text-xs font-mono text-emerald-500 font-bold">
            {progress}%
          </span>
        </div>

        <h4 className={`text-base font-semibold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          {object.title}
        </h4>

        {object.description && (
          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {object.description}
          </p>
        )}

        {/* Capsule Progress Track */}
        <div className={`mt-4 w-full h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner ${isDark ? 'bg-black/50' : 'bg-black/[0.06]'}`}>
          <div
            className="h-full bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-300 shadow-(var(--glow-accent-md)) rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`mt-4 flex items-center justify-between text-xs pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-black/[0.05]'}`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {object.tags?.slice(0, 2).map((t) => (
              <Tag key={t} variant="neutral" size="sm">
                {t}
              </Tag>
            ))}
          </div>
          {showRelations && related.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
              <Link2 className="w-3 h-3" />
              <span>{related.length} linked</span>
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // 4. Default / Task / Habit Card
  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      onClick={onClick}
      className={`group relative p-4 rounded-(var(--radius-control)) cursor-pointer overflow-hidden select-none border transition-all ${
        isDark
          ? 'bg-(--bg-card) border-white/[0.025] shadow-(var(--rim-soft), var(--elevation-2)) hover:border-white/[0.06] hover:bg-(--bg-card-hover)'
          : 'bg-white border-black/[0.04] shadow-(var(--elevation-1)) hover:border-black/[0.08]'
      } ${isCompleted ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Left Action / Checkbox / Flame */}
        {isTask && (
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`mt-0.5 transition-colors cursor-pointer shrink-0 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            aria-label={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            ) : (
              <Circle className="w-4.5 h-4.5" />
            )}
          </button>
        )}

        {isHabit && (
          <button
            type="button"
            onClick={handleIncrementStreak}
            className="mt-0.5 w-6 h-6 rounded-full bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 flex items-center justify-center shrink-0 transition-transform active:scale-95 border border-orange-500/20 shadow-(var(--glow-warning-sm))"
            title="Check in habit ritual"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <Tag variant={badge.variant} size="sm">
              {badge.label}
            </Tag>

            {object.metadata?.priority === 'high' && (
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                P1
              </span>
            )}

            {isHabit && object.metadata?.streak !== undefined && (
              <span className={`text-[10px] font-mono font-semibold ml-auto flex items-center gap-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                <Flame className="w-3 h-3 fill-current" />
                <span>{object.metadata.streak}d</span>
              </span>
            )}
          </div>

          <h4
            className={`text-[13.5px] sm:text-sm font-medium tracking-tight leading-snug break-words ${
              isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-950 font-medium'
            } ${isCompleted ? 'line-through opacity-50' : ''}`}
          >
            {object.title}
          </h4>

          {object.description && (
            <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed font-light ${isDark ? 'text-(--text-secondary)' : 'text-zinc-600'}`}>
              {object.description}
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {object.tags?.slice(0, 3).map((t) => (
                <Tag key={t} variant="neutral" size="sm">
                  {t}
                </Tag>
              ))}
            </div>

            {showRelations && related.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                <Link2 className="w-3 h-3" />
                <span>{related.length}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
