/**
 * UI99 — Settings, Profile, SLO & Data Ownership Modal (Build 02.0)
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { api } from '../../core/services/apiClient';
import {
  User,
  HeartHandshake,
  Download,
  ShieldCheck,
  Sparkles,
  LogOut,
} from 'lucide-react';

export function SettingsModal() {
  const { user, updateProfile, logout, isRTL, language, setLanguage } = useAuth();
  const { isSettingsOpen, setIsSettingsOpen, addToast } = useApp();

  const [name, setName] = useState('');
  const [persianName, setPersianName] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('obsidian-dark');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SLO' | 'DATA' | 'AI'>('PROFILE');
  const [sloConfig, setSloConfig] = useState<any>(null);

  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || '');
      setPersianName(user.profile.persianName || '');
      setBio(user.profile.bio || '');
      setTheme(user.profile.themePreference || 'obsidian-dark');
    }
    if (isSettingsOpen) {
      api.getSLO().then((res) => setSloConfig(res.slo)).catch(() => {});
    }
  }, [user, isSettingsOpen]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name,
        persianName,
        bio,
        themePreference: theme as any,
      });
      addToast('Profile preferences saved', 'success');
      setIsSettingsOpen(false);
    } catch (err: any) {
      addToast(err.message || 'Failed to save', 'warning');
    }
  };

  const handleExportData = () => {
    window.open('/api/export', '_blank');
    addToast('Data backup downloaded', 'success');
  };

  const handleToggleSLOAccess = async () => {
    if (!sloConfig) return;
    const nextAccess = sloConfig.defaultAccess === 'NO_ACCESS' ? 'SELECTIVE' : 'NO_ACCESS';
    try {
      const res = await api.updateSLO({ defaultAccess: nextAccess });
      setSloConfig(res.slo);
      addToast(`SLO Access updated: ${nextAccess}`, 'purple');
    } catch (err) {}
  };

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="Settings & Personal OS"
      subtitle="Private by default • Data ownership • Intelligent foundation"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.06] pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'PROFILE', label: 'Profile & Look', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'SLO', label: 'SLO Connection', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
            { id: 'DATA', label: 'Data & Ownership', icon: <Download className="w-3.5 h-3.5" /> },
            { id: 'AI', label: 'AI Intelligence', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-(var(--radius-pill)) text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer select-none ${
                activeTab === t.id
                  ? 'bg-white text-[#09090B] shadow-(var(--elevation-2))'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#18181D] border border-white/[0.08] rounded-(var(--radius-field)) px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">Persian Name (نام به فارسی)</label>
              <input
                type="text"
                dir="rtl"
                value={persianName}
                onChange={(e) => setPersianName(e.target.value)}
                className="w-full bg-[#18181D] border border-white/[0.08] rounded-(var(--radius-field)) px-3 py-2 text-sm text-white font-persian-luxury focus:outline-none focus:border-white/30"
                placeholder="نام نمایشی"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">Personal Intent / Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#18181D] border border-white/[0.08] rounded-(var(--radius-field)) p-3 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Language and RTL */}
            <div className="p-3.5 bg-[#18181D] rounded-(var(--radius-field)) border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Layout Direction & Language</span>
                <span className="text-zinc-400 text-[11px]">English LTR / فارسی راست‌به‌چپ</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-(var(--radius-pill)) text-xs font-semibold border transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-[#09090B] border-transparent shadow-xs'
                      : 'bg-[#222228] text-zinc-400 border-white/[0.06]'
                  }`}
                >
                  EN (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('fa')}
                  className={`px-3 py-1 rounded-(var(--radius-pill)) text-xs font-semibold border transition-all cursor-pointer font-persian-luxury ${
                    language === 'fa'
                      ? 'bg-white text-[#09090B] border-transparent shadow-xs'
                      : 'bg-[#222228] text-zinc-400 border-white/[0.06]'
                  }`}
                >
                  فارسی (RTL)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLO TAB */}
        {activeTab === 'SLO' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#18181D] rounded-(var(--radius-control)) border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-(var(--radius-pill)) bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Special Connection (SLO)</h4>
                    <p className="text-[11px] text-zinc-400">
                      Private by default. SLO has NO access unless you explicitly grant it per object.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-300 font-semibold">Default Permission:</span>
                <button
                  type="button"
                  onClick={handleToggleSLOAccess}
                  className={`px-3 py-1 rounded-(var(--radius-pill)) font-bold text-xs transition-colors ${
                    sloConfig?.defaultAccess === 'NO_ACCESS'
                      ? 'bg-[#222228] text-zinc-300 border border-white/[0.08]'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {sloConfig?.defaultAccess || 'NO_ACCESS'}
                </button>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed text-[11px]">
              When viewing any Photo, Memory, or Project, you can toggle "Allow SLO Access" to share that specific moment with complete authorization control.
            </p>
          </div>
        )}

        {/* DATA OWNERSHIP TAB */}
        {activeTab === 'DATA' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#18181D] rounded-(var(--radius-control)) border border-white/[0.08] space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Total Data Sovereignty</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    All your thoughts, tasks, memories, and graph connections belong exclusively to you. You can export a full, unencrypted JSON backup of the universal object database at any time.
                  </p>
                </div>
              </div>

              <Button
                variant="white-pill"
                size="sm"
                onClick={handleExportData}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Export Full UI99 Archive (.json)
              </Button>
            </div>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'AI' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#18181D] rounded-(var(--radius-control)) border border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>UI99 Intelligence Architecture</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                • Model: <span className="font-mono text-purple-300">gemini-3.8-flash</span> via server-side abstraction.
                <br />• Principle: AI suggests; user controls. No silent mutations.
                <br />• Capabilities: Multilingual understanding (English & Persian), entity classification, tag generation, relationship suggestions.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={logout} className="text-rose-400 hover:bg-rose-500/10">
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
            {activeTab === 'PROFILE' && (
              <Button variant="white-pill" size="sm" onClick={handleSaveProfile}>
                Save Preferences
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
