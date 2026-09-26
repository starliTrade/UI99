/**
 * UI99 — Reading & Book Moment (Build 03)
 * Current book, reading progress, and quote reflections.
 */

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Bookmark, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import { BaseObject } from '../../core/types/objects';
import { useAuth } from '../../core/context/AuthContext';

interface ReadingMomentProps {
  bookObject?: BaseObject;
  onSelectBook: (book: BaseObject) => void;
  onAddBook: () => void;
}

export function ReadingMoment({ bookObject, onSelectBook, onAddBook }: ReadingMomentProps) {
  const { isRTL } = useAuth();

  if (!bookObject) {
    return (
      <div
        onClick={onAddBook}
        className="group relative p-5 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all dur-slow bg-(--bg-card) border border-white/[0.025] hover:border-white/[0.04] shadow-(--shadow-card-hover) flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-(--radius-control) bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BookOpen className="icon-lg stroke-[1.8]" />
          </div>
          <div>
            <h4 className="type-body font-semibold text-[#EDEDEF]">
              {isRTL ? 'کتابخانه و خلوت مطالعه' : 'Reading & Sanctuary'}
            </h4>
            <p className="type-caption text-[#92929B] mt-0.5">
              {isRTL ? 'کتابی که این روزها می‌خوانی را اضافه کن' : 'Add a book you are currently immersed in'}
            </p>
          </div>
        </div>
        <Plus className="icon-md text-zinc-400 group-hover:text-white transition-colors" />
      </div>
    );
  }

  const author = bookObject.metadata?.author || 'Junichiro Tanizaki';
  const progressPages = bookObject.metadata?.progressPages || 64;
  const rating = bookObject.metadata?.rating || 5;

  return (
    <div
      onClick={() => onSelectBook(bookObject)}
      className="group relative p-5 sm:p-6 rounded-(--radius-xl) cursor-pointer overflow-hidden transition-all dur-slow bg-(--bg-surface) border border-white/[0.025] shadow-(--shadow-card-hover) hover:border-white/[0.04] select-none"
    >
      {/* Sapphire/Blue Ambient Aura */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/[0.05] rounded-(--radius-pill) blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-content">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-(--radius-pill) bg-blue-500/15 text-blue-400">
            <BookOpen className="icon-xs stroke-[2.2]" />
          </span>
          <span className="type-micro uppercase font-bold tracking-widest text-[#EDEDEF]">
            {isRTL ? 'کتابخانه و مطالعه' : 'Currently Reading'}
          </span>
        </div>

        <span className="type-micro font-mono px-2 py-0.5 rounded-(--radius-pill) bg-blue-500/10 text-blue-300 border border-blue-500/20">
          p. {progressPages}
        </span>
      </div>

      {/* Book Metadata */}
      <div className="flex items-start gap-4 relative z-content">
        <div className="w-12 h-16 rounded-(--radius-field) bg-gradient-to-br from-[#1E2235] via-[#10131F] to-[#0A0B10] border border-white/[0.04] shadow-(--elevation-2) flex items-center justify-center shrink-0">
          <Bookmark className="icon-lg text-blue-300" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="type-body-lg font-bold text-[#EDEDEF] leading-snug truncate">
            {bookObject.title}
          </h3>
          <p className="type-caption text-[#92929B] truncate mt-0.5">
            {author}
          </p>

          {bookObject.description && (
            <p className="type-caption text-zinc-400 font-serif italic line-clamp-2 mt-1.5 leading-relaxed">
              "{bookObject.description}"
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-white/[0.025] flex items-center justify-between type-micro text-[#92929B] relative z-content">
        <span>{isRTL ? 'هنر زیبایی‌شناسی ژاپنی' : 'Aesthetics & Light'}</span>
        <span className="text-blue-400 group-hover:underline flex items-center gap-1 font-medium">
          <span>{isRTL ? 'جزئیات کتاب' : 'Book Details'}</span>
          <ArrowUpRight className="icon-xs" />
        </span>
      </div>
    </div>
  );
}
