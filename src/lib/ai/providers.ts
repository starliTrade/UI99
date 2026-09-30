/**
 * Provider layer — one OpenAI-compatible client, four free entry points.
 *
 * BYOK architecture: the key lives in the browser's localStorage, goes
 * straight from the user's machine to the provider over fetch, and is never
 * sent anywhere else (there is no server in this product). This is exactly
 * the OpenRouter Playground / AI Studio posture — the only one compatible
 * with a static Vite site and a zero-cost product.
 *
 * Every listed provider is free-tier, no credit card:
 *   Groq       ~1000 req/day, Llama 3.3 70B (~320 tok/s)  ← default
 *   OpenRouter  50 req/day across 20+ free models
 *   Cerebras   ~1M tokens/day, Llama 3.3 70B
 *   Gemini      20–1500 req/day (OpenAI-compat endpoint)
 */

import { buildSystemPrompt, type DnaOptions } from './dna';

export type ProviderId = 'groq' | 'openrouter' | 'cerebras' | 'gemini';

export interface ProviderInfo {
  id: ProviderId;
  label: string;
  faLabel: string;
  baseUrl: string;
  /** Default model id for the provider's free tier. */
  model: string;
  models: string[];
  keyUrl: string;
  freeTier: string;
  faFreeTier: string;
}

export const PROVIDERS: Record<ProviderId, ProviderInfo> = {
  groq: {
    id: 'groq',
    label: 'Groq',
    faLabel: 'گروک',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    keyUrl: 'https://console.groq.com/keys',
    freeTier: '~1,000 req/day · no card',
    faFreeTier: '۱٬۰۰۰ درخواست/روز · بدون کارت',
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    faLabel: 'اوپن‌روتر',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'qwen/qwen-2.5-72b-instruct:free',
    ],
    keyUrl: 'https://openrouter.ai/keys',
    freeTier: '50 req/day · 20+ free models',
    faFreeTier: '۵۰ درخواست/روز · بیش از ۲۰ مدل رایگان',
  },
  cerebras: {
    id: 'cerebras',
    label: 'Cerebras',
    faLabel: 'سربراس',
    baseUrl: 'https://api.cerebras.ai/v1',
    model: 'llama-3.3-70b',
    models: ['llama-3.3-70b', 'llama3.1-8b'],
    keyUrl: 'https://cloud.cerebras.ai',
    freeTier: '~1M tokens/day · no card',
    faFreeTier: '~۱M توکن/روز · بدون کارت',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    faLabel: 'جمنای',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash'],
    keyUrl: 'https://aistudio.google.com/app/apikey',
    freeTier: '20–1,500 req/day',
    faFreeTier: '۲۰ تا ۱٬۵۰۰ درخواست/روز',
  },
};

export const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];

/* ───────────────────────────── key vault (local) ──────────────────────── */

const KEY_PREFIX = 'ui99.ai.key.';
const MODEL_PREFIX = 'ui99.ai.model.';

export const getKey = (p: ProviderId): string =>
  typeof localStorage === 'undefined' ? '' : localStorage.getItem(KEY_PREFIX + p) ?? '';

export const setKey = (p: ProviderId, key: string): void => {
  if (typeof localStorage === 'undefined') return;
  if (key) localStorage.setItem(KEY_PREFIX + p, key.trim());
  else localStorage.removeItem(KEY_PREFIX + p);
};

export const getModel = (p: ProviderId): string =>
  (typeof localStorage !== 'undefined' && localStorage.getItem(MODEL_PREFIX + p)) || PROVIDERS[p].model;

export const setModel = (p: ProviderId, model: string): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MODEL_PREFIX + p, model);
};

/* ─────────────────────────────── streaming chat ───────────────────────── */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateArgs {
  provider: ProviderId;
  history: ChatTurn[];
  dna: DnaOptions;
  temperature?: number;
  signal?: AbortSignal;
  onDelta?: (chunk: string) => void;
}

export class ProviderError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

/** Streams a completion, calling onDelta per chunk. Returns the full text. */
export async function generate({
  provider,
  history,
  dna,
  temperature = 0.7,
  signal,
  onDelta,
}: GenerateArgs): Promise<string> {
  const info = PROVIDERS[provider];
  const key = getKey(provider);
  if (!key) throw new ProviderError('missing-key');

  const res = await fetch(`${info.baseUrl}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(provider === 'openrouter'
        ? { 'X-Title': 'UI99 Studio' }
        : {}),
    },
    body: JSON.stringify({
      model: getModel(provider),
      stream: true,
      temperature,
      messages: [
        { role: 'system', content: buildSystemPrompt(dna) },
        ...history.map((t) => ({ role: t.role, content: t.content })),
      ],
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new ProviderError(
      res.status === 401 ? 'bad-key' : res.status === 429 ? 'rate-limit' : `http-${res.status}`,
      res.status,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data:')) continue;
      const payload = t.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = json.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          full += delta;
          onDelta?.(delta);
        }
      } catch {
        /* keep-alive comment or partial line — ignore */
      }
    }
  }
  return full;
}

/* ─────────────────────────────── demo engine ──────────────────────────── */

/**
 * The offline generator. Not a mock of the network — a real, deterministic
 * composer that reads the request's keywords and assembles a compliant UI99
 * document from the token set. The studio is fully usable with zero keys;
 * the AI providers upgrade the experience instead of gating it.
 */
export function demoGenerate(prompt: string, lang: 'fa' | 'en'): string {
  const p = prompt.toLowerCase();
  const wants = (...k: string[]) => k.some((x) => p.includes(x));
  const fa = lang === 'fa';

  const isTable = wants('جدول', 'table', 'دیتا', 'data', 'متریک', 'metric', 'داشبورد', 'dashboard');
  const isForm = wants('فرم', 'form', 'لاگین', 'login', 'ثبت', 'sign', 'ورود');
  const isProfile = wants('پروفایل', 'profile', 'کارت', 'card', 'کاربر', 'user', 'آواتار', 'avatar');
  const isPricing = wants('قیمت', 'pricing', 'پلن', 'plan');

  const body = isTable
    ? demoTable(fa)
    : isForm
      ? demoForm(fa)
      : isPricing
        ? demoPricing(fa)
        : demoProfile(fa);

  return `${'```html'}
<!-- demo generation · ${new Date().toISOString().slice(0, 10)} · composed from the UI99 token set -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/starliTrade/UI99@main/src/styles/ui99.css">
${body}
${'```'}

${'```jsx'}
// React flavor — same object, kit-native
import { Card, Button, Badge, Input } from '@99/ui';
${demoJsx(isTable, isForm, isProfile, isPricing)}
${'```'}

- **intent**: ${fa ? 'نسخه‌ی نمایشی: ترکیب سطح quiet (Δ+6) با نردبان توکن‌های واقعی — با اتصال کلید، هوش مصنوعی همین خواسته را زنده تولید می‌کند.' : 'Demo generation: the quiet surface (Δ+6) composed from the real token ladder — connect a free key and the model renders this wish live.'}
- **variants**: ${fa ? '۱) متراکم‌تر با type-caption ۲) حالت elevated با سایه‌ی شناوری ۳) چیدمان افقی برای نوار ابزار' : '1) Denser: type-caption scale 2) Elevated: float shadow tier 3) Horizontal toolbar layout'}
- **tokens**: --bg-quiet · --border-subtle · --border-soft · --text-primary · --text-secondary · --radius-control · type-body · type-caption`;
}

const shell = (fa: boolean, inner: string) => `<div class="demo-root" ${fa ? 'dir="rtl"' : 'dir="ltr"'} style="padding:var(--space-lg);background:var(--bg-canvas);min-height:100vh;font-family:inherit;color:var(--text-primary)">
<style>
  .demo-root { --demo-gap: var(--space-md); }
  .demo-card { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-control); padding:var(--space-lg); max-width:420px; box-shadow:var(--shadow-card,0 1px 2px rgba(0,0,0,.3)); }
  .demo-chip { background:var(--bg-quiet); border:1px solid var(--border-subtle); border-radius:var(--radius-pill); padding:4px 12px; font-size:12px; color:var(--text-secondary); }
  .demo-chip:hover { background:var(--bg-quiet-hover); border-color:var(--border-soft); color:var(--text-primary); }
  .demo-title { font-size:16px; font-weight:600; letter-spacing:-0.02em; color:var(--text-primary); }
  .demo-sub { font-size:13px; color:var(--text-secondary); line-height:1.6; }
  .demo-btn { min-height:44px; padding:0 var(--space-lg); border-radius:var(--radius-field); background:var(--bg-quiet); color:var(--text-secondary); border:1px solid var(--border-subtle); cursor:pointer; transition:all 180ms; font-size:14px; }
  .demo-btn:hover { background:var(--bg-quiet-hover); color:var(--text-primary); border-color:var(--border-soft); }
  .demo-btn-primary { background:var(--ink-fill); color:var(--text-on-fill); border-color:transparent; }
  .demo-field { min-height:44px; background:var(--bg-elevated); border:1px solid var(--border-strong); border-radius:var(--radius-field); padding:0 var(--space-md); color:var(--text-primary); width:100%; font-size:14px; }
  .demo-row { display:flex; align-items:center; gap:var(--space-md); }
  .demo-avatar { width:48px; height:48px; border-radius:var(--radius-pill); background:var(--bg-quiet); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); font-weight:600; }
  .demo-th { font-size:12px; color:var(--text-muted); text-align:start; padding:8px 12px; border-bottom:1px solid var(--border-subtle); }
  .demo-td { font-size:14px; color:var(--text-secondary); padding:10px 12px; border-bottom:1px solid var(--border-subtle); }
  .demo-td:first-child { color:var(--text-primary); }
</style>
${inner}
</div>`;

const demoProfile = (fa: boolean) =>
  shell(
    fa,
    `<div class="demo-card">
  <div class="demo-row" style="gap:var(--space-md)">
    <div class="demo-avatar">ع</div>
    <div style="min-width:0">
      <div class="demo-title">${fa ? 'سارا محمدی' : 'Sara Mohammadi'}</div>
      <div class="demo-sub">${fa ? 'مهندس ارشد محصول' : 'Staff Product Engineer'}</div>
    </div>
    <span class="demo-chip" style="margin-inline-start:auto">${fa ? 'آنلاین' : 'online'}</span>
  </div>
  <p class="demo-sub" style="margin:var(--space-md) 0">${fa ? 'روی سیستم طراحی و ابزارهای توسعه‌دهنده کار می‌کند؛ عاشق جزئیات زیرپیکسلی.' : 'Design systems and developer tooling; obsessive about sub-pixel details.'}</p>
  <div class="demo-row" style="gap:var(--space-sm)">
    <button class="demo-btn demo-btn-primary">${fa ? 'دنبال کردن' : 'Follow'}</button>
    <button class="demo-btn">${fa ? 'پیام' : 'Message'}</button>
  </div>
</div>`,
  );

const demoForm = (fa: boolean) =>
  shell(
    fa,
    `<div class="demo-card" style="max-width:360px">
  <div class="demo-title">${fa ? 'ورود به حساب' : 'Sign in'}</div>
  <p class="demo-sub" style="margin:6px 0 var(--space-md)">${fa ? 'با حساب کاری‌ات ادامه بده.' : 'Continue with your work account.'}</p>
  <div style="display:grid;gap:var(--space-sm)">
    <input class="demo-field" placeholder="${fa ? 'ایمیل کاری' : 'work email'}" />
    <input class="demo-field" type="password" placeholder="${fa ? 'گذرواژه' : 'password'}" />
    <button class="demo-btn demo-btn-primary" style="width:100%">${fa ? 'ورود' : 'Continue'}</button>
    <button class="demo-btn" style="width:100%">${fa ? 'درخواست دسترسی' : 'Request access'}</button>
  </div>
</div>`,
  );

const demoTable = (fa: boolean) =>
  shell(
    fa,
    `<div class="demo-card" style="max-width:560px;padding:0;overflow:hidden">
  <div style="padding:var(--space-md) var(--space-lg);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-subtle)">
    <div class="demo-title">${fa ? 'متریک‌های این هفته' : 'This week’s metrics'}</div>
    <span class="demo-chip">${fa ? 'زنده' : 'live'}</span>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr>
      <th class="demo-th">${fa ? 'سرویس' : 'Service'}</th><th class="demo-th">${fa ? 'درخواست' : 'Requests'}</th><th class="demo-th">${fa ? 'خطا' : 'Errors'}</th>
    </tr></thead>
    <tbody>
      ${[['API', '48,201', '0.02%'], ['Web', '21,744', '0.00%'], ['Edge', '96,310', '0.11%']]
        .map(([a, b, c]) => `<tr><td class="demo-td">${a}</td><td class="demo-td">${b}</td><td class="demo-td">${c}</td></tr>`)
        .join('')}
    </tbody>
  </table>
</div>`,
  );

const demoPricing = (fa: boolean) =>
  shell(
    fa,
    `<div style="display:flex;gap:var(--space-md);flex-wrap:wrap;justify-content:center">
  ${[
    [fa ? 'پایه' : 'Starter', '0$', false],
    [fa ? 'استودیو' : 'Studio', '19$', true],
    [fa ? 'سازمانی' : 'Org', '99$', false],
  ]
    .map(
      ([name, price, hot]) => `<div class="demo-card" style="${hot ? 'border-color:var(--border-soft);background:var(--bg-elevated)' : ''}">
    ${hot ? `<span class="demo-chip">${fa ? 'پیشنهاد ما' : 'most popular'}</span>` : ''}
    <div class="demo-title" style="margin-top:${hot ? 'var(--space-sm)' : '0'}">${name}</div>
    <div style="font-size:28px;font-weight:700;letter-spacing:-0.03em;color:var(--text-primary);margin:8px 0">${price}</div>
    <button class="demo-btn ${hot ? 'demo-btn-primary' : ''}" style="width:100%">${fa ? 'انتخاب' : 'Choose'}</button>
  </div>`,
    )
    .join('')}
</div>`,
  );

const demoJsx = (table: boolean, form: boolean, profile: boolean, pricing: boolean): string =>
  table
    ? `export function MetricsPanel() {
  return (
    <Card variant="quiet">
      <table>…</table>
    </Card>
  );
}`
    : form
      ? `export function SignIn() {
  return (
    <Card className="max-w-sm">
      <Input placeholder="work email" />
      <Input type="password" placeholder="password" />
      <Button variant="primary" fullWidth>Continue</Button>
    </Card>
  );
}`
      : pricing
        ? `export function PricingRow() {
  return (
    <div className="flex gap-4">
      {plans.map((p) => <Card key={p.name} variant="quiet">…</Card>)}
    </div>
  );
}`
        : `export function ProfileCard() {
  return (
    <Card className="max-w-sm">
      <Avatar initial="S" />
      <Button variant="primary">Follow</Button>
      <Button variant="secondary">Message</Button>
    </Card>
  );
}`;
