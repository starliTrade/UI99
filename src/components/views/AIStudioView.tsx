/**
 * AIStudioView — chat → UI99, the generative surface of the product.
 *
 * Posture: a ChatGPT-class entry (one big input, zero chrome) that resolves
 * into a four-zone studio: conversation, live preview, code, and spec — with
 * theme/direction controls that re-render the ARTIFACT, not the page. BYOK:
 * a free key unlocks live generation; without one the deterministic demo
 * engine keeps the studio honest and usable.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Loader2,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { useApp } from '../../core/context/AppContext';
import { Button } from '../ui/Button';
import {
  PROVIDERS,
  PROVIDER_IDS,
  ProviderError,
  demoGenerate,
  generate,
  getKey,
  getModel,
  setKey,
  setModel,
  type ChatTurn,
  type ProviderId,
} from '../../lib/ai/providers';

/* ─────────────────────────── artifact extraction ──────────────────────── */

const FENCE = /```(\w+)?\n?([\s\S]*?)```/g;

export interface Artifact {
  html: string;
  jsx: string;
  intent: string;
  variants: string[];
}

/** Splits a model answer into its html / jsx / spec parts. */
export function parseArtifact(text: string): Artifact {
  const blocks: Record<string, string> = {};
  for (const m of text.matchAll(FENCE)) {
    const lang = (m[1] ?? 'text').toLowerCase();
    if (!blocks[lang]) blocks[lang] = m[2].trim();
  }
  const prose = text.replace(FENCE, '').trim();
  const intent = /(?:^|\n)\s*[-*]\s*\*\*intent\*\*:\s*(.+)/i.exec(prose)?.[1]?.trim() ?? '';
  const variants = [...prose.matchAll(/(?:^|\n)\s*[-*]\s*\*\*variants?\*\*:\s*(.+)/gi)]
    .map((m) => m[1].trim())
    .join('\n')
    .split(/\n|\d\)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8 && !/^\*\*/.test(s))
    .slice(0, 3);
  return { html: blocks.html ?? '', jsx: blocks.jsx ?? '', intent, variants };
}

/** Wraps generated markup into a self-contained srcdoc for the sandbox. */
export function buildSrcdoc(html: string, theme: 'dark' | 'light', dir: 'rtl' | 'ltr'): string {
  const body = html.replace(/<link[^>]*ui99\.css[^>]*>/i, '');
  return `<!doctype html><html class="${theme}" data-theme="${theme}" dir="${dir}">
<head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/starliTrade/UI99@main/src/styles/ui99.css">
<style>html,body{margin:0;background:var(--bg-canvas);color:var(--text-primary);font-family:'Inter','Vazirmatn',sans-serif;min-height:100vh}</style>
</head><body>${body}</body></html>`;
}

/* ────────────────────────────── settings sheet ────────────────────────── */

function SettingsPanel({ onClose, isRTL }: { onClose: () => void; isRTL: boolean }): React.ReactNode {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const fa = isRTL;

  const save = () => {
    for (const [p, v] of Object.entries(drafts)) setKey(p as ProviderId, v);
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <div className="absolute end-0 top-12 z-modal w-[min(92vw,420px)] rounded-(--radius-control) bg-(--bg-elevated) border border-(--border-soft) shadow-(--elevation-3) p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="type-body font-semibold text-(--text-primary)">
          {fa ? 'کلیدهای رایگان (فقط روی همین مرورگر)' : 'Free keys (this browser only)'}
        </span>
        <button onClick={onClose} aria-label={fa ? 'بستن' : 'Close'} className="p-1 rounded-(--radius-sm) hover:bg-(--bg-quiet-hover) text-(--text-muted) cursor-pointer">
          <X className="icon-sm" />
        </button>
      </div>
      <p className="type-caption text-(--text-secondary) leading-relaxed">
        {fa
          ? 'کلید در localStorage ذخیره می‌شود و مستقیم از مرورگرِ تو به سرویس‌دهنده می‌رود — به هیچ سروری ارسال نمی‌شود. همه‌ی گزینه‌ها رایگان‌اند و کارت نمی‌خواهند.'
          : 'Keys live in localStorage and travel straight from your browser to the provider — never to a server. All options are free, no card required.'}
      </p>
      {PROVIDER_IDS.map((id) => {
        const info = PROVIDERS[id];
        return (
          <label key={id} className="block space-y-1">
            <span className="flex items-center justify-between">
              <span className="type-caption font-mono font-medium text-(--text-primary)">{info.label}</span>
              <a
                href={info.keyUrl}
                target="_blank"
                rel="noreferrer"
                className="type-micro font-mono text-(--text-secondary) hover:text-(--text-primary) inline-flex items-center gap-1"
              >
                {fa ? 'گرفتن کلید' : 'get key'}
                <ExternalLink className="icon-xs" />
              </a>
            </span>
            <input
              type="password"
              defaultValue={getKey(id)}
              onChange={(e) => setDrafts((d) => ({ ...d, [id]: e.target.value }))}
              placeholder={fa ? info.faFreeTier : info.freeTier}
              className="w-full min-h-[40px] px-3 rounded-(--radius-field) bg-(--bg-elevated) border border-(--border-strong) text-(--text-primary) type-caption font-mono focus-ui99"
            />
          </label>
        );
      })}
      <Button variant="primary" size="sm" fullWidth onClick={save}>
        {saved ? (fa ? 'ذخیره شد' : 'Saved') : fa ? 'ذخیره‌ی کلیدها' : 'Save keys'}
      </Button>
    </div>
  );
}

/* ────────────────────────────── the view ──────────────────────────────── */

type Phase = 'idle' | 'streaming' | 'error';
type StudioTab = 'preview' | 'code';

export function AIStudioView() {
  const { isRTL } = useAuth();
  const { addToast } = useApp();
  const fa = isRTL;

  const [prompt, setPrompt] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [streamText, setStreamText] = useState('');
  const [provider, setProvider] = useState<ProviderId>('groq');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [history, setHistory] = useState<Artifact[]>([]); // generation 0..n
  const [genIndex, setGenIndex] = useState(-1);
  const [studioTab, setStudioTab] = useState<StudioTab>('preview');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewDir, setPreviewDir] = useState<'rtl' | 'ltr'>(isRTL ? 'rtl' : 'ltr');
  const [copied, setCopied] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const hasKey = getKey(provider).length > 0;

  const current = genIndex >= 0 ? history[genIndex] : null;
  const streamingArtifact = useMemo(
    () => (phase === 'streaming' ? parseArtifact(streamText) : null),
    [phase, streamText],
  );
  const shown = streamingArtifact ?? current;

  useEffect(() => {
    const saved = localStorage.getItem('ui99.ai.provider') as ProviderId | null;
    if (saved && PROVIDERS[saved]) setProvider(saved);
  }, []);

  const chooseProvider = (id: ProviderId) => {
    setProvider(id);
    localStorage.setItem('ui99.ai.provider', id);
  };

  const run = useCallback(
    async (text: string, base: ChatTurn[]) => {
      const userTurn: ChatTurn = { role: 'user', content: text };
      const next = [...base, userTurn];
      setTurns(next);
      setPrompt('');
      setPhase('streaming');
      setStreamText('');

      const finish = (artifact: Artifact, raw: string) => {
        setHistory((h) => {
          const trimmed = h.slice(0, genIndex + 1);
          return [...trimmed, artifact];
        });
        setGenIndex((i) => i + 1);
        setPhase('idle');
        setStreamText('');
        setTurns((t) => [...t, { role: 'assistant', content: raw }]);
      };

      if (!getKey(provider)) {
        // Demo engine — instant, deterministic, honest about being demo.
        setTimeout(() => {
          const raw = demoGenerate(text, fa ? 'fa' : 'en');
          finish(parseArtifact(raw), raw);
        }, 350);
        return;
      }

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const raw = await generate({
          provider,
          history: next,
          dna: { lang: fa ? 'fa' : 'en' },
          signal: ctrl.signal,
          onDelta: (d) => setStreamText((s) => s + d),
        });
        finish(parseArtifact(raw), raw);
      } catch (e) {
        if (ctrl.signal.aborted) {
          setPhase('idle');
          return;
        }
        setPhase('error');
        const msg =
          e instanceof ProviderError
            ? e.message === 'bad-key'
              ? fa
                ? 'کلید نامعتبر است — از تنظیمات بررسیش کن.'
                : 'Invalid key — check Settings.'
              : e.message === 'rate-limit'
                ? fa
                  ? 'سقف رایگان امروز پر شد — فردا دوباره، یا سرویس دیگر را انتخاب کن.'
                  : 'Daily free quota reached — try tomorrow or switch provider.'
                : e.message
            : fa
              ? 'خطای شبکه.'
              : 'Network error.';
        addToast(msg, 'rose');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, fa, genIndex, history, addToast],
  );

  const submit = () => {
    const text = prompt.trim();
    if (!text || phase === 'streaming') return;
    void run(text, turns);
  };

  const copyCode = () => {
    const code = studioTab === 'preview' ? (shown?.html ?? '') : (shown?.jsx ?? shown?.html ?? '');
    void navigator.clipboard.writeText(code);
    setCopied(true);
    addToast(fa ? 'کپی شد' : 'Copied', 'success');
    setTimeout(() => setCopied(false), 1200);
  };

  const download = () => {
    if (!shown?.html) return;
    const blob = new Blob([buildSrcdoc(shown.html, previewTheme, previewDir)], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ui99-artifact.html';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ─────────────────────────── empty state ─────────────────────────── */
  if (turns.length === 0) {
    return (
      <div dir={fa ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-2">
        <div className="w-14 h-14 rounded-(--radius-pill) bg-(--bg-quiet) border border-(--border-subtle) flex items-center justify-center mb-6 shadow-(--elevation-2)">
          <Sparkles className="icon-lg text-(--text-secondary)" />
        </div>
        <h1 className="type-heading font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
          {fa ? 'چه چیزی بسازم؟' : 'What should we build?'}
        </h1>
        <p className="type-body text-zinc-600 dark:text-(--text-secondary) mb-8 max-w-md">
          {fa
            ? 'خواسته‌ات را بنویس — یک کارت، یک فرم، یک صفحه. خروجی با توکن‌ها و قوانین خود UI99 تولید می‌شود.'
            : 'Describe the thing — a card, a form, a page. Output is generated under UI99’s own tokens and laws.'}
        </p>

        <div className="w-full relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            autoFocus
            placeholder={fa ? 'مثلاً: یه کارت پروفایل با آواتار، بج وضعیت و دو دکمه…' : 'e.g. a profile card with avatar, status badge and two actions…'}
            className="w-full resize-none rounded-(--radius-control) bg-(--bg-card) border border-(--border-soft) p-4 pe-12 type-body text-(--text-primary) placeholder-(--text-muted) focus-ui99 shadow-(--shadow-card)"
          />
          <button
            onClick={submit}
            disabled={!prompt.trim()}
            aria-label={fa ? 'ساخت' : 'Generate'}
            className="absolute bottom-3 end-3 w-9 h-9 rounded-(--radius-pill) bg-(--ink-fill) text-(--text-on-fill) flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-transform active:scale-95"
          >
            <ArrowUp className="icon-sm" />
          </button>
        </div>

        {/* Suggested seeds — one tap to first artifact */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {(fa
            ? ['یه کارت پروفایل خفن', 'فرم ورود مخملی', 'جدول متریک با وضعیت زنده', 'سه پلن قیمت‌گذاری']
            : ['A bold profile card', 'A soft sign-in form', 'A live metrics table', 'Three pricing tiers']
          ).map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="min-h-[40px] px-3 rounded-(--radius-pill) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) hover:border-(--border-soft) type-caption text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mt-8 type-micro font-mono text-(--text-muted)">
          {fa
            ? 'بدون کلید هم کار می‌کند (حالت دمو) · با کلید رایگان، زنده تولید می‌شود'
            : 'Works keyless (demo mode) · add a free key for live generation'}
        </p>
      </div>
    );
  }

  /* ─────────────────────────── studio state ─────────────────────────── */
  const lastUser = [...turns].reverse().find((t) => t.role === 'user')?.content ?? '';

  return (
    <div dir={fa ? 'rtl' : 'ltr'} className="flex flex-col gap-3">
      {/* ── 1 · conversation strip ── */}
      <div className="rounded-(--radius-control) bg-(--bg-card) border border-(--border-subtle) p-3 sm:p-4 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="type-caption font-semibold text-(--text-primary) truncate max-w-[60%]">
            {fa ? 'درخواست: ' : 'Request: '}
            <span className="font-normal text-(--text-secondary)">{lastUser}</span>
          </span>
          <div className="flex items-center gap-1">
            {/* provider capsule */}
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => chooseProvider(e.target.value as ProviderId)}
                aria-label={fa ? 'انتخاب سرویس' : 'Provider'}
                className="h-8 ps-2 pe-7 rounded-(--radius-field) bg-(--bg-quiet) border border-(--border-subtle) hover:border-(--border-soft) type-micro font-mono text-(--text-secondary) cursor-pointer appearance-none focus-ui99"
              >
                {PROVIDER_IDS.map((id) => (
                  <option key={id} value={id}>
                    {PROVIDERS[id].label}
                    {getKey(id) ? '' : fa ? ' (دمو)' : ' (demo)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="icon-xs absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-muted)" />
            </div>
            {/* settings */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen((v) => !v)}
                aria-label={fa ? 'تنظیمات کلیدها' : 'Key settings'}
                className={`h-8 w-8 rounded-(--radius-field) flex items-center justify-center border transition-colors cursor-pointer focus-ui99 ${
                  hasKey
                    ? 'bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border-(--border-subtle) text-(--text-secondary)'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                }`}
              >
                <KeyRound className="icon-sm" />
              </button>
              {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} isRTL={fa} />}
            </div>
            {/* restart */}
            <button
              onClick={() => {
                setTurns([]);
                setHistory([]);
                setGenIndex(-1);
                setStreamText('');
              }}
              aria-label={fa ? 'شروع تازه' : 'New session'}
              title={fa ? 'شروع تازه' : 'New session'}
              className="h-8 w-8 rounded-(--radius-field) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) flex items-center justify-center cursor-pointer focus-ui99"
            >
              <RotateCcw className="icon-sm" />
            </button>
          </div>
        </div>

        {/* generation chips (history rail) */}
        {history.length > 1 && (
          <div className="flex items-center gap-1 flex-wrap">
            {history.map((_, i) => (
              <button
                key={i}
                onClick={() => setGenIndex(i)}
                aria-label={`Generation ${i + 1}`}
                aria-pressed={genIndex === i}
                className={`h-6 min-w-6 px-1 rounded-(--radius-xs) type-micro font-mono border transition-colors cursor-pointer ${
                  genIndex === i
                    ? 'bg-(--ink-fill) text-(--text-on-fill) border-transparent'
                    : 'bg-(--bg-quiet) text-(--text-secondary) border-(--border-subtle) hover:border-(--border-soft)'
                }`}
              >
                {fa ? Number(i + 1).toLocaleString('fa-IR') : i + 1}
              </button>
            ))}
          </div>
        )}

        {current?.intent && (
          <p className="type-caption text-(--text-secondary) leading-relaxed">{current.intent}</p>
        )}
      </div>

      {/* ── 2 · the studio box ── */}
      <div className="rounded-(--radius-control) bg-(--bg-card) border border-(--border-subtle) overflow-hidden">
        {/* studio toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-(--border-subtle) bg-(--bg-surface)">
          <div className="flex items-center gap-1 p-0.5 rounded-(--radius-field) bg-(--bg-quiet) border border-(--border-subtle)">
            {(['preview', 'code'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStudioTab(t)}
                aria-pressed={studioTab === t}
                className={`h-7 px-3 rounded-(--radius-field) type-caption font-medium transition-colors cursor-pointer ${
                  studioTab === t
                    ? 'bg-(--bg-elevated) text-(--text-primary) shadow-xs'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                {t === 'preview' ? (fa ? 'پیش‌نمایش' : 'Preview') : 'Code'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {/* artifact theme */}
            <button
              onClick={() => setPreviewTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={fa ? 'تمِ پیش‌نمایش' : 'Preview theme'}
              className="h-8 w-8 rounded-(--radius-field) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) flex items-center justify-center cursor-pointer focus-ui99"
            >
              {previewTheme === 'dark' ? <Moon className="icon-sm" /> : <Sun className="icon-sm" />}
            </button>
            {/* artifact direction */}
            <button
              onClick={() => setPreviewDir((d) => (d === 'rtl' ? 'ltr' : 'rtl'))}
              aria-label={fa ? 'جهت پیش‌نمایش' : 'Preview direction'}
              className="h-8 px-2 rounded-(--radius-field) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) type-micro font-mono text-(--text-secondary) hover:text-(--text-primary) cursor-pointer focus-ui99"
            >
              {previewDir.toUpperCase()}
            </button>
            <span className="w-px h-5 bg-(--border-subtle) mx-1" aria-hidden="true" />
            <button
              onClick={copyCode}
              aria-label={fa ? 'کپی کد' : 'Copy code'}
              className="h-8 w-8 rounded-(--radius-field) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) flex items-center justify-center cursor-pointer focus-ui99"
            >
              {copied ? <Check className="icon-sm text-emerald-500" /> : <Copy className="icon-sm" />}
            </button>
            <button
              onClick={download}
              aria-label={fa ? 'دانلود' : 'Download'}
              className="h-8 w-8 rounded-(--radius-field) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) flex items-center justify-center cursor-pointer focus-ui99"
            >
              <Download className="icon-sm" />
            </button>
          </div>
        </div>

        {/* stage */}
        {studioTab === 'preview' ? (
          <div className="relative min-h-[420px] bg-(--bg-sunken)">
            {shown?.html ? (
              <iframe
                key={`${genIndex}-${previewTheme}-${previewDir}`}
                title={fa ? 'پیش‌نمایش زنده' : 'Live preview'}
                srcDoc={buildSrcdoc(shown.html, previewTheme, previewDir)}
                sandbox="allow-scripts"
                className="w-full h-[min(70vh,640px)] border-0"
              />
            ) : (
              <div className="min-h-[420px] flex flex-col items-center justify-center gap-3 text-(--text-muted)">
                {phase === 'streaming' ? (
                  <>
                    <Loader2 className="icon-lg animate-spin" />
                    <span className="type-caption font-mono">{fa ? 'در حال ساخت…' : 'composing…'}</span>
                  </>
                ) : (
                  <span className="type-caption">{fa ? 'هنوز خروجی نیست' : 'No artifact yet'}</span>
                )}
              </div>
            )}
            {phase === 'streaming' && shown?.html && (
              <div className="absolute bottom-3 end-3 flex items-center gap-2 px-2 py-1 rounded-(--radius-pill) bg-(--bg-elevated)/90 border border-(--border-soft) type-micro font-mono text-(--text-secondary)">
                <Loader2 className="icon-xs animate-spin" />
                {fa ? 'به‌روزرسانی زنده…' : 'streaming…'}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <pre
              dir="ltr"
              className="p-4 overflow-auto max-h-[min(70vh,640px)] type-micro font-mono text-(--text-secondary) leading-relaxed whitespace-pre-wrap"
            >
              {shown?.html || shown?.jsx || (phase === 'streaming' ? streamText : '') || '…'}
            </pre>
            {streamingArtifact?.jsx && (
              <div className="px-4 pb-3">
                <div className="type-micro font-mono text-(--text-muted) mb-1">JSX / @99/ui</div>
                <pre dir="ltr" className="p-3 rounded-(--radius-md) bg-(--bg-sunken) border border-(--border-subtle) type-micro font-mono text-(--text-secondary) overflow-auto whitespace-pre-wrap">
                  {streamingArtifact.jsx}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3 · next-direction chips (the model's own suggestions) ── */}
      {current?.variants?.length ? (
        <div className="flex flex-wrap gap-2">
          {current.variants.map((v) => (
            <button
              key={v}
              onClick={() => void run(v, turns)}
              disabled={phase === 'streaming'}
              className="min-h-[36px] px-3 rounded-(--radius-pill) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) hover:border-(--border-soft) type-caption text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer disabled:opacity-40 text-start"
            >
              {v}
            </button>
          ))}
        </div>
      ) : null}

      {/* ── 4 · composer ── */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          disabled={phase === 'streaming'}
          placeholder={fa ? 'تغییرش بده: متراکم‌تر، تیره‌تر، با نوار ابزار…' : 'Iterate: denser, darker, add a toolbar…'}
          className="w-full resize-none rounded-(--radius-control) bg-(--bg-card) border border-(--border-soft) p-3 pe-12 type-body text-(--text-primary) placeholder-(--text-muted) focus-ui99 disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={!prompt.trim() || phase === 'streaming'}
          aria-label={fa ? 'ارسال' : 'Send'}
          className="absolute bottom-2.5 end-2.5 w-9 h-9 rounded-(--radius-pill) bg-(--ink-fill) text-(--text-on-fill) flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-transform active:scale-95"
        >
          {phase === 'streaming' ? <Loader2 className="icon-sm animate-spin" /> : <ArrowUp className="icon-sm" />}
        </button>
      </div>
    </div>
  );
}
