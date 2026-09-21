/**
 * SAFA — Universal Capture Shell (Build 02.0)
 * "Put anything here" — Fast capture with server-side AI extraction & structured object validation.
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Button';
import { ObjectType, ObjectStatus, ObjectSource } from '../../core/types/objects';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp } from '../../core/context/AppContext';
import { useAuth } from '../../core/context/AuthContext';
import { api } from '../../core/services/apiClient';
import { AIExtractResult } from '../../core/types/ai';
import {
  Sparkles,
  CheckSquare,
  FileText,
  Lightbulb,
  ArrowRight,
  Loader2,
  Heart,
} from 'lucide-react';

export function UniversalCaptureModal() {
  const { isCaptureOpen, setIsCaptureOpen, captureDefaultType, addToast } = useApp();
  const { createObject } = useObjects();
  const { isRTL } = useAuth();

  const [rawText, setRawText] = useState('');
  const [selectedType, setSelectedType] = useState<ObjectType>(ObjectType.NOTE);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiResult, setAiResult] = useState<AIExtractResult | null>(null);
  const [destination, setDestination] = useState<'INBOX' | 'ACTIVE'>('INBOX');

  useEffect(() => {
    if (captureDefaultType) {
      setSelectedType(captureDefaultType);
    } else {
      setSelectedType(ObjectType.NOTE);
    }
    if (isCaptureOpen) {
      setRawText('');
      setTags([]);
      setAiResult(null);
      setDestination('INBOX');
    }
  }, [isCaptureOpen, captureDefaultType]);

  const handleAiUnderstand = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await api.understandText(rawText);
      if (res.success && res.extraction) {
        setAiResult(res.extraction);
        if (res.extraction.suggestedType && ObjectType[res.extraction.suggestedType as keyof typeof ObjectType]) {
          setSelectedType(res.extraction.suggestedType as ObjectType);
        }
        if (res.extraction.suggestedTags?.length) {
          setTags(Array.from(new Set([...tags, ...res.extraction.suggestedTags])));
        }
        addToast(isRTL ? 'هوش مصنوعی صفا یادداشت را تحلیل کرد' : 'SAFA AI analyzed your capture', 'purple');
      }
    } catch (err: any) {
      addToast(err.message || 'AI analysis unavailable', 'warning');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = async () => {
    if (!rawText.trim()) return;

    try {
      const title = aiResult?.cleanTitle || rawText.trim().split('\n')[0].slice(0, 80);
      const description = aiResult?.cleanDescription || (rawText.trim().split('\n').length > 1 ? rawText.trim() : '');

      await createObject({
        type: selectedType,
        status: destination === 'INBOX' ? ObjectStatus.INBOX : ObjectStatus.ACTIVE,
        title,
        description,
        source: ObjectSource.MANUAL,
        tags: tags.length ? tags : ['quick-capture'],
        metadata: {
          capturedVia: 'universal-capture-modal',
          rawPrompt: rawText,
          aiConfidence: aiResult?.confidence,
        },
      });

      addToast(
        isRTL
          ? 'شیء جدید با موفقیت ثبت شد'
          : `Captured to ${destination === 'INBOX' ? 'Universal Inbox' : 'Active Workspace'}`,
        'success'
      );

      setIsCaptureOpen(false);
    } catch (err: any) {
      addToast(err.message || 'Failed to capture object', 'warning');
    }
  };

  const quickTypes = [
    { type: ObjectType.TASK, label: isRTL ? 'وظیفه' : 'Task', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { type: ObjectType.NOTE, label: isRTL ? 'یادداشت' : 'Note', icon: <FileText className="w-3.5 h-3.5" /> },
    { type: ObjectType.IDEA, label: isRTL ? 'ایده' : 'Idea', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { type: ObjectType.MEMORY, label: isRTL ? 'خاطره' : 'Memory', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal
      isOpen={isCaptureOpen}
      onClose={() => setIsCaptureOpen(false)}
      title={isRTL ? 'ثبت سریع صفا' : 'Universal Fast Capture'}
      subtitle={isRTL ? 'هر فکری، وظیفه‌ای یا الهامی را سریع بنویسید' : 'Put anything here — thoughts, tasks, ideas, inspiration'}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Main capture textarea */}
        <div className="relative">
          <textarea
            autoFocus
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              isRTL
                ? 'چه فکری در ذهن دارید؟ (مثال: بررسی پارچه‌های ابریشمی برای کلکسیون فردا #طراحی)'
                : "What's on your mind? (e.g. 'Review raw silk fabric swatches by tomorrow #design')"
            }
            className="w-full bg-[#18181D] border border-white/[0.08] rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 resize-none transition-all shadow-inner"
          />

          {/* AI Understand Trigger inside textarea box */}
          {rawText.trim().length > 5 && (
            <div className="absolute bottom-3 right-3">
              <Button
                variant="dark-pill"
                size="xs"
                onClick={handleAiUnderstand}
                disabled={isExtracting}
                icon={
                  isExtracting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  )
                }
              >
                {isExtracting ? (isRTL ? 'تحلیل...' : 'Analyzing...') : (isRTL ? 'تحلیل هوشمند' : 'AI Understand')}
              </Button>
            </div>
          )}
        </div>

        {/* AI Extraction Preview Card if parsed */}
        {aiResult && (
          <div className="p-3.5 rounded-2xl bg-purple-950/25 border border-purple-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isRTL ? 'پیشنهاد هوش مصنوعی صفا' : 'AI Suggested Classification'}
              </span>
              <span className="text-[10px] bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-500/40 text-purple-200">
                {Math.round(aiResult.confidence * 100)}%
              </span>
            </div>
            <div className="text-white">
              <span className="font-bold text-zinc-400">{isRTL ? 'عنوان:' : 'Title:'}</span> {aiResult.cleanTitle}
            </div>
            {aiResult.cleanDescription && (
              <div className="text-zinc-300">
                <span className="font-bold text-zinc-400">{isRTL ? 'توضیحات:' : 'Context:'}</span> {aiResult.cleanDescription}
              </div>
            )}
          </div>
        )}

        {/* Quick Type Selection */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            {isRTL ? 'نوع شیء' : 'Object Type'}
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {quickTypes.map((t) => {
              const isSelected = selectedType === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setSelectedType(t.type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-white text-[#09090B] shadow-[0_2px_10px_rgba(255,255,255,0.25)]'
                      : 'bg-[#18181D] text-zinc-400 border border-white/[0.08] hover:text-white'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags input */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            {isRTL ? 'برچسب‌ها و زمینه' : 'Tags & Context'}
          </label>
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {tags.map((t) => (
              <Tag key={t} label={t} variant="purple" onRemove={() => handleRemoveTag(t)} />
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={isRTL ? 'برچسب را تایپ کنید و Enter بزنید...' : 'Type tag and press Enter...'}
            className="w-full bg-[#18181D] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Destination Option */}
        <div className="pt-3 flex items-center justify-between border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold">{isRTL ? 'مقصد:' : 'Destination:'}</span>
            <button
              type="button"
              onClick={() => setDestination(destination === 'INBOX' ? 'ACTIVE' : 'INBOX')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                destination === 'INBOX'
                  ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {destination === 'INBOX'
                ? (isRTL ? 'صندوق ورودی (بررسی بعداً)' : 'Raw Inbox')
                : (isRTL ? 'مستقیم به فعال' : 'Direct to Active')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCaptureOpen(false)}>
              {isRTL ? 'انصراف' : 'Cancel'}
            </Button>
            <Button
              variant="white-pill"
              size="sm"
              onClick={handleSave}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isRTL ? 'ثبت' : 'Capture'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
