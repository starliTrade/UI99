/**
 * UI99 — Unified Velvet Object Card (Build 02.2)
 * Enhanced with iOS-squircle corners (rounded-(--radius-lg), specular top edge (inset 0 1px 1px),
 * luminous glowing progress / streaks and smooth spring micro-physics.
 */

import React from 'react';
import { motion } from 'motion/react';
import { useIsDark } from './theme';
import { Tag } from './Button';
import {
  CheckCircle2,
  Circle,
  Link2,
  BookOpen,
  Flame,
} from 'lucide-react';

/**
 * The minimal shape this card actually reads. Declared structurally rather than
 * imported from a domain model, so any host record that *looks like* an object
 * can be rendered — the card is a pattern, not a binding to one schema.
 */
export interface ObjectCardRecord {
  id: string;
  type: string;
  status: string;
  title: string;
  description?: string;
  /** ISO 8601. */
  createdAt: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

/** A patch the card can emit. The host decides how (and whether) to persist it. */
export interface ObjectCardPatch {
  status?: string;
  metadata?: Record<string, any>;
}

export interface ObjectCardTypeBadge {
  label: string;
  variant: 'neutral' | 'green' | 'amber' | 'purple';
}

export interface ObjectCardProps {
  object: ObjectCardRecord;
  onClick?: () => void;
  showRelations?: boolean;
  /** Number of related records. The card never queries this itself. */
  relatedCount?: number;
  /** Persist a patch. Absent → the card renders read-only. */
  onUpdate?: (id: string, patch: ObjectCardPatch) => void | Promise<void>;
  /** Drives label locale. Defaults to LTR. */
  isRTL?: boolean;
  /** Override the built-in type vocabulary (extends, never replaces wholesale). */
  typeLabels?: Record<string, ObjectCardTypeBadge>;
}

const DEFAULT_TYPE_LABELS: Record<string, { en: string; fa: string; variant: ObjectCardTypeBadge['variant'] }> = {
  TASK: { en: 'Task', fa: 'وظیفه', variant: 'neutral' },
  HABIT: { en: 'Ritual', fa: 'آیین', variant: 'green' },
  PROJECT: { en: 'Project', fa: 'پروژه', variant: 'amber' },
  FASHION_PROJECT: { en: 'Fashion Atelier', fa: 'آتلیه مد', variant: 'amber' },
  MEMORY: { en: 'Memory', fa: 'خاطره', variant: 'purple' },
  JOURNAL_ENTRY: { en: 'Journal', fa: 'دفترچه', variant: 'purple' },
  BOOK: { en: 'Literature', fa: 'کتاب', variant: 'neutral' },
};

export function ObjectCard({
  object,
  onClick,
  showRelations = true,
  relatedCount = 0,
  onUpdate,
  isRTL = false,
  typeLabels,
}: ObjectCardProps) {
  const isDark = useIsDark();
  const related = { length: relatedCount };

  const isTask = object.type === 'TASK';
  const isHabit = object.type === 'HABIT';
  const isMemory = object.type === 'MEMORY';
  const isBook = object.type === 'BOOK';
  const isJournal = object.type === 'JOURNAL_ENTRY';
  const isProject = object.type === 'PROJECT';
  const isFashion = object.type === 'FASHION_PROJECT';
  const isCompleted = object.status === 'COMPLETED';

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdate) return;
    void onUpdate(object.id, { status: isCompleted ? 'ACTIVE' : 'COMPLETED' });
  };

  const handleIncrementStreak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdate) return;
    const curStreak = object.metadata?.streak || 0;
    void onUpdate(object.id, {
      metadata: {
        ...object.metadata,
        streak: curStreak + 1,
        lastCompletedDate: new Date().toISOString().split('T')[0],
      },
    });
  };

  const getTypeBadge = (): ObjectCardTypeBadge => {
    const override = typeLabels?.[object.type];
    if (override) return override;
    const known = DEFAULT_TYPE_LABELS[object.type];
    if (known) {
      return { label: isRTL ? known.fa : known.en, variant: known.variant };
    }
    return { label: object.type.replace(/_/g, ' '), variant: 'neutral' };
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
        className={`group relative p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) shadow-(--shadow-card)'
            : 'bg-white shadow-(--shadow-card) border border-(--border-hairline) hover:border-(--border-soft) hover:shadow-(--elevation-2)'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-(--radius-pill) blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2 relative z-content">
          <Tag variant={badge.variant} size="sm">
            {badge.label}
          </Tag>
          <span className="type-micro text-(--text-secondary) font-mono">
            {new Date(object.createdAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h4 className={`type-body-lg font-semibold tracking-tight leading-snug relative z-content ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          "{object.title}"
        </h4>

        {object.description && (
          <p className={`type-caption mt-2 italic leading-relaxed line-clamp-3 font-serif-luxury relative z-content ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {object.description}
          </p>
        )}

        <div className={`mt-4 flex items-center justify-between pt-3 border-t relative z-content ${isDark ? 'border-white/[0.04]' : 'border-black/[0.05]'}`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {object.tags?.slice(0, 2).map((t) => (
              <Tag key={t} variant="neutral" size="sm">
                {t}
              </Tag>
            ))}
          </div>
          {showRelations && related.length > 0 && (
            <span className="inline-flex items-center gap-1 type-micro text-(--text-secondary)">
              <Link2 className="icon-xs" />
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
        className={`group relative p-5 rounded-(--radius-xl) cursor-pointer flex gap-4 overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) shadow-(--shadow-card)'
            : 'bg-white shadow-(--shadow-card) border border-(--border-hairline) hover:border-(--border-soft) hover:shadow-(--elevation-2)'
        }`}
      >
        <div className={`w-12 h-16 rounded-(--radius-control) flex flex-col items-center justify-center shrink-0 ${isDark ? 'bg-white/[0.05] text-(--text-secondary) shadow-(--shadow-card)' : 'bg-black/[0.04] text-zinc-600'}`}>
          <BookOpen className="icon-md stroke-[1.8] text-amber-500" />
          <span className="type-micro font-mono mt-1 font-semibold opacity-60">BOOK</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Tag variant={badge.variant} size="sm">
              {badge.label}
            </Tag>
            {object.metadata?.status && (
              <span className="type-micro text-(--text-secondary)">
                {object.metadata.status}
              </span>
            )}
          </div>

          <h4 className={`type-body sm:type-body-lg font-semibold tracking-tight truncate ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            {object.title}
          </h4>

          {object.metadata?.author && (
            <p className={`type-caption mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              by {object.metadata.author}
            </p>
          )}

          {object.metadata?.rating && (
            <div className="mt-2 type-micro text-amber-500 font-semibold">
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
        className={`group relative p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden select-none ${
          isDark
            ? 'bg-(--bg-card) card-aura-emerald shadow-(--shadow-card)'
            : 'bg-white shadow-(--shadow-card) border border-(--border-hairline) hover:border-(--border-soft) hover:shadow-(--elevation-2)'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <Tag variant={badge.variant} size="sm">
            {badge.label}
          </Tag>
          <span className="type-caption font-mono text-emerald-500 font-bold">
            {progress}%
          </span>
        </div>

        <h4 className={`type-body-lg font-semibold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          {object.title}
        </h4>

        {object.description && (
          <p className={`type-caption mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {object.description}
          </p>
        )}

        {/* Capsule Progress Track */}
        <div className={`mt-4 w-full h-2.5 rounded-(--radius-pill) overflow-hidden p-0.5 shadow-inner ${isDark ? 'bg-black/50' : 'bg-black/[0.06]'}`}>
          <div
            className="h-full bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-300 shadow-(--glow-accent-md) rounded-(--radius-pill) transition-all dur-lazy"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`mt-4 flex items-center justify-between type-caption pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-black/[0.05]'}`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {object.tags?.slice(0, 2).map((t) => (
              <Tag key={t} variant="neutral" size="sm">
                {t}
              </Tag>
            ))}
          </div>
          {showRelations && related.length > 0 && (
            <span className="inline-flex items-center gap-1 type-micro text-(--text-secondary)">
              <Link2 className="icon-xs" />
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
      className={`group relative p-4 rounded-(--radius-control) cursor-pointer overflow-hidden select-none border transition-all ${
        isDark
          ? 'bg-(--bg-card) border-white/[0.025] shadow-(--shadow-card) hover:border-white/[0.06] hover:bg-(--bg-card-hover)'
          : 'bg-white border-black/[0.04] shadow-(--elevation-1) hover:border-black/[0.08]'
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
            className="mt-0.5 w-6 h-6 rounded-(--radius-pill) bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 flex items-center justify-center shrink-0 transition-transform active:scale-95 border border-orange-500/20 shadow-(--glow-warning-sm)"
            title="Check in habit ritual"
          >
            <Flame className="icon-sm fill-current" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <Tag variant={badge.variant} size="sm">
              {badge.label}
            </Tag>

            {object.metadata?.priority === 'high' && (
              <span className="type-micro uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                P1
              </span>
            )}

            {isHabit && object.metadata?.streak !== undefined && (
              <span className={`type-micro font-mono font-semibold ml-auto flex items-center gap-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                <Flame className="icon-xs fill-current" />
                <span>{object.metadata.streak}d</span>
              </span>
            )}
          </div>

          <h4
            className={`type-body sm:type-body font-medium tracking-tight leading-snug break-words ${
              isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-950 font-medium'
            } ${isCompleted ? 'line-through opacity-50' : ''}`}
          >
            {object.title}
          </h4>

          {object.description && (
            <p className={`type-caption mt-0.5 line-clamp-2 leading-relaxed font-light ${isDark ? 'text-(--text-secondary)' : 'text-zinc-600'}`}>
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
              <span className="inline-flex items-center gap-1 type-micro text-(--text-muted)">
                <Link2 className="icon-xs" />
                <span>{related.length}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
