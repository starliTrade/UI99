/**
 * UI99 — Living Hero (Living Atmosphere & Depth Signature) (Build 04)
 * SLE (UI99 Living Experience) + SOLG (UI99 Obsidian Liquid Glass).
 * Restores a quiet, jewelry-like, celestial depth sculpture with layered glass,
 * organic light breathing, contextual greetings, and universal capture.
 */

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Plus, Sun, Moon, Sunrise, Sunset, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { UI99Wordmark } from '../ui/UI99Wordmark';

interface LivingHeroProps {
  selectedDate: Date;
  onOpenCapture: () => void;
}

export function LivingHero({ selectedDate, onOpenCapture }: LivingHeroProps) {
  const { user, isRTL } = useAuth();
  const { themeMode } = useApp();
  const prefersReducedMotion = useReducedMotion();

  const now = new Date();
  const hour = now.getHours();
  const dayIndex = selectedDate.getDay();

  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const dateFormatted = selectedDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Contextual poetic greeting and microcopy variations
  const contextData = useMemo(() => {
    // Variations based on time of day and day of week
    if (hour >= 5 && hour < 12) {
      const morningMicrocopies = [
        {
          fa: 'امروز یه جای قشنگ و آرام برای خودت باز کن.',
          en: 'Make a little serene space for yourself today.',
        },
        {
          fa: 'صبح تازه، نور ملایم و فرصتی برای خلق زیبایی.',
          en: 'Fresh morning light and quiet room for creation.',
        },
        {
          fa: 'با طمأنینه شروع کن؛ امروز جریان توست.',
          en: 'Begin softly; today moves at your own rhythm.',
        },
      ];
      const copy = morningMicrocopies[dayIndex % morningMicrocopies.length];
      return {
        greeting: { fa: 'صبح به‌خیر', en: 'Good morning, UI99' },
        microcopy: copy,
        icon: Sunrise,
        auraColor: 'from-rose-500/10 via-amber-500/5 to-transparent',
        accentGlow: 'rgba(244,63,94,0.18)',
      };
    } else if (hour >= 12 && hour < 17) {
      const afternoonMicrocopies = [
        {
          fa: 'خلوت آتلیه، ایده‌های زنده و ریتم متمرکز.',
          en: 'Atelier sanctuary, living ideas, and focused rhythm.',
        },
        {
          fa: 'فرصتی برای پرداختن به طرح‌ها و الهام‌های امروز.',
          en: 'A moment to tend to your designs and aesthetics.',
        },
        {
          fa: 'وسط روز، یک دم‌نوش گرم و پیگیری آنچه دوست داری.',
          en: 'Midday stillness, warm tea, and what you love.',
        },
      ];
      const copy = afternoonMicrocopies[dayIndex % afternoonMicrocopies.length];
      return {
        greeting: { fa: 'عصر به‌خیر', en: 'Good afternoon, UI99' },
        microcopy: copy,
        icon: Sun,
        auraColor: 'from-amber-500/10 via-rose-500/5 to-transparent',
        accentGlow: 'rgba(245,158,11,0.16)',
      };
    } else if (hour >= 17 && hour < 21) {
      const eveningMicrocopies = [
        {
          fa: 'نور غروب و نوای آرام موسیقی در فضای شخصی‌ات.',
          en: 'Dusk light and ambient music in your personal space.',
        },
        {
          fa: 'بذار کم‌کم شلوغی‌های روز از ذهنت فاصله بگیره.',
          en: 'Let the noise of the day gently dissolve away.',
        },
        {
          fa: 'مرور زیباترین لحظه‌ها و ثبت خاطرات خوش.',
          en: 'Reflecting on graceful moments and fond memories.',
        },
      ];
      const copy = eveningMicrocopies[dayIndex % eveningMicrocopies.length];
      return {
        greeting: { fa: 'غروب به‌خیر', en: 'Good evening, UI99' },
        microcopy: copy,
        icon: Sunset,
        auraColor: 'from-violet-500/12 via-rose-500/6 to-transparent',
        accentGlow: 'rgba(168,85,247,0.18)',
      };
    } else {
      const nightMicrocopies = [
        {
          fa: 'شب آرام، سکوت دلنشین و ورق زدن یک کتاب یا رویا.',
          en: 'Peaceful night, quiet sanctuary, and space to dream.',
        },
        {
          fa: 'ذهنت رو به خلوت و آرامش بسپار؛ فردا پر از روشنایی است.',
          en: 'Surrender to soft stillness; tomorrow holds light.',
        },
        {
          fa: 'زمانی برای گوش دادن به نوای درون و استراحت عمیق.',
          en: 'A time for inner stillness and restorative rest.',
        },
      ];
      const copy = nightMicrocopies[dayIndex % nightMicrocopies.length];
      return {
        greeting: { fa: 'شب آرام', en: 'Peaceful night, UI99' },
        microcopy: copy,
        icon: Moon,
        auraColor: 'from-indigo-500/12 via-violet-500/6 to-transparent',
        accentGlow: 'rgba(99,102,241,0.16)',
      };
    }
  }, [hour, dayIndex]);

  const TimeIcon = contextData.icon;

  return (
    <section className="relative w-full pt-2 pb-1 select-none">
      {/* 1. Subtle Celestial Ambient Halo */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-xl h-44 bg-gradient-to-b ${contextData.auraColor} rounded-(--radius-pill) blur-3xl pointer-events-none opacity-80`}
      />

      {/* 2. Living Atmosphere Container */}
      <div className="relative p-5 sm:p-6 rounded-(--radius-xl) bg-[#0A0B10]/90 border border-white/[0.025] shadow-(--shadow-card-hover) backdrop-blur-xl overflow-hidden transition-all dur-slow">
        
        {/* Soft Background Silk Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-content flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left: Typography & Context */}
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Context Date Badge & Status */}
            <div className="flex items-center gap-2 type-caption text-[#92929B] font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-(--radius-pill) bg-white/[0.03] border border-white/[0.035]">
                <TimeIcon className="icon-sm text-rose-400" />
                <span className="text-zinc-300">{dateFormatted}</span>
              </span>
              {isToday && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-(--radius-pill) bg-rose-500 opacity-75" />
                  <span className="relative inline-flex rounded-(--radius-pill) h-2 w-2 bg-rose-500 shadow-(--glow-rose-sm)" />
                </span>
              )}
            </div>

            {/* Main Greeting */}
            <h1 className="type-title sm:type-heading font-bold tracking-tight text-[#EDEDEF] leading-snug">
              {isRTL ? contextData.greeting.fa : contextData.greeting.en}
            </h1>

            {/* Contextual Editorial Microcopy */}
            <p className="type-caption sm:type-body text-[#92929B] leading-relaxed font-light line-clamp-2 max-w-xl">
              {isRTL ? contextData.microcopy.fa : contextData.microcopy.en}
            </p>
          </div>

          {/* Right: Layered Organic Depth Sculpture & Universal Capture */}
          <div className="flex items-center gap-3.5 shrink-0 self-end md:self-center">
            
            {/* Jewelry-like Depth Orb Emblem */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-(--radius-pill) bg-gradient-to-br from-[#1A1A24] via-[#0E0E14] to-[#07070A] border border-white/[0.06] shadow-(--elevation-2) flex items-center justify-center overflow-hidden shrink-0 group">
              
              {/* Subtle orbital ring animation */}
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 rounded-(--radius-pill) border border-dashed border-white/[0.08]"
              />

              {/* Glowing diamond nuqta point */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 1, 0.7],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute icon-dot rounded-(--radius-pill) bg-rose-400/80 shadow-(--glow-rose-md)"
              />

              {/* Inner satin glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
              
              <Sparkles className="icon-sm text-white/40 group-hover:text-rose-300 transition-colors relative z-content" />
            </div>

            {/* Quick Capture Capsule */}
            <button
              type="button"
              onClick={onOpenCapture}
              className="group flex items-center gap-2 px-4 py-2 rounded-(--radius-pill) bg-gradient-to-r from-white/[0.06] to-white/[0.03] hover:from-white/[0.1] hover:to-white/[0.05] text-[#EDEDEF] border border-white/[0.05] hover:border-white/[0.1] shadow-(--shadow-card) backdrop-blur-xl transition-all active:scale-95 cursor-pointer shrink-0"
              title={isRTL ? 'ثبت سریع ایده، یادداشت یا کار' : 'Quick Capture'}
              aria-label="Universal Capture"
            >
              <Plus className="icon-sm text-rose-400 group-hover:rotate-90 transition-transform dur-base" />
              <span className="type-caption font-semibold tracking-wide">
                {isRTL ? 'ثبت سریع' : 'Capture'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
