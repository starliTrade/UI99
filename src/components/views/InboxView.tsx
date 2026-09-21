/**
 * SAFA — Universal Inbox Shell (Build 02.0)
 * Triage raw thoughts, quick captures, and unorganized inputs with AI assistance.
 */

import React, { useState } from 'react';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp } from '../../core/context/AppContext';
import { ObjectType, ObjectStatus } from '../../core/types/objects';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Toast';
import { api } from '../../core/services/apiClient';
import {
  Inbox,
  Sparkles,
  Loader2,
} from 'lucide-react';

export function InboxView() {
  const { objects, updateObject, setSelectedObject } = useObjects();
  const { openCapture, addToast, themeMode } = useApp();
  const isDark = themeMode === 'dark';
  const [isAutoTriaging, setIsAutoTriaging] = useState(false);

  const inboxObjects = objects.filter((o) => o.status === ObjectStatus.INBOX);

  const handleTriageItem = async (id: string, nextType: ObjectType) => {
    try {
      await updateObject(id, {
        type: nextType,
        status: ObjectStatus.ACTIVE,
      });
      addToast(`Converted to ${nextType} and moved to Active`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to triage', 'warning');
    }
  };

  const handleTriageWithAI = async () => {
    if (inboxObjects.length === 0) return;
    setIsAutoTriaging(true);
    let triagedCount = 0;
    try {
      for (const item of inboxObjects) {
        const textToAnalyze = `${item.title}\n${item.description || ''}`;
        const res = await api.understandText(textToAnalyze);
        if (res.success && res.extraction) {
          const suggested = res.extraction.suggestedType as ObjectType;
          await updateObject(item.id, {
            type: ObjectType[suggested as keyof typeof ObjectType] ? suggested : item.type,
            status: ObjectStatus.ACTIVE,
            tags: Array.from(new Set([...(item.tags || []), ...(res.extraction.suggestedTags || [])])),
            metadata: {
              ...item.metadata,
              aiTriaged: true,
            },
          });
          triagedCount++;
        }
      }
      addToast(`AI successfully triaged and organized ${triagedCount} items`, 'purple');
    } catch (err: any) {
      addToast(err.message || 'AI Triage partially failed', 'warning');
    } finally {
      setIsAutoTriaging(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#F2F2F5]' : 'text-[#111116]'}`}>
              Universal Inbox
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                isDark
                  ? 'bg-white/[0.06] text-white/90 border-white/[0.06]'
                  : 'bg-black/[0.05] text-[#111116] border-black/[0.05]'
              }`}
            >
              {inboxObjects.length}
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Everything captured on the fly lands here. Review, connect, and file when ready.
          </p>
        </div>

        {inboxObjects.length > 0 && (
          <Button
            variant={isDark ? 'white-pill' : 'primary'}
            size="sm"
            onClick={handleTriageWithAI}
            disabled={isAutoTriaging}
            icon={
              isAutoTriaging ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              )
            }
          >
            {isAutoTriaging ? 'Triaging with AI...' : 'Triage All with AI'}
          </Button>
        )}
      </div>

      {/* Inbox Items (Linear Triage Feed) */}
      {inboxObjects.length === 0 ? (
        <EmptyState
          title="Inbox Zero • Calm Achieved"
          persianTitle="صندوق ورودی شما خالی و آرام است"
          description="You have triaged all quick captures into their proper places."
          actionLabel="Quick Capture"
          onAction={() => openCapture()}
        />
      ) : (
        <div className="linear-group-container">
          {inboxObjects.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 border-b border-white/[0.03] last:border-b-0 space-y-2.5 transition-colors hover:bg-white/[0.015]"
            >
              <div
                onClick={() => setSelectedObject(item)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span className={`text-[10px] uppercase tracking-wider font-mono font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      Raw Capture
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#5C5C68]' : 'text-[#8E8E98]'}`}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className={`text-[13.5px] sm:text-sm font-medium tracking-tight ${isDark ? 'text-[#EDEDEF]' : 'text-[#111116]'}`}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed font-light ${isDark ? 'text-[#9E9EA8]' : 'text-[#6E6E78]'}`}>
                    {item.description}
                  </p>
                )}
              </div>

              {/* Quick triage actions bar */}
              <div className={`pt-2 flex items-center justify-between flex-wrap gap-2 text-xs`}>
                <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Convert to:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleTriageItem(item.id, ObjectType.TASK)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.04] cursor-pointer transition-all active:scale-95"
                  >
                    Task
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriageItem(item.id, ObjectType.IDEA)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.04] cursor-pointer transition-all active:scale-95"
                  >
                    Idea
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriageItem(item.id, ObjectType.NOTE)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.04] cursor-pointer transition-all active:scale-95"
                  >
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriageItem(item.id, ObjectType.PROJECT)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.04] cursor-pointer transition-all active:scale-95"
                  >
                    Project
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateObject(item.id, { status: ObjectStatus.ACTIVE }).then(() =>
                        addToast('Marked as Active', 'success')
                      )
                    }
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 cursor-pointer transition-all active:scale-95"
                  >
                    Keep as Note
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
