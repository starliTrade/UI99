/**
 * AI Studio — the genome and the parser are the product's load-bearing logic;
 * the view is chrome. These tests lock BOTH halves of the promise:
 *   1. the DNA prompt actually contains the real token names and the real
 *      numeric laws (if ui99.css drifts, these fail);
 *   2. a model answer / demo answer parses into previewable html + spec.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildSystemPrompt, DNA_TOKENS, DNA_LAWS, dnaAudit } from '../lib/ai/dna';
import { parseArtifact, buildSrcdoc } from '../components/views/AIStudioView';
import { demoGenerate, PROVIDERS, PROVIDER_IDS, getKey } from '../lib/ai/providers';

const SHEETS = ['src/styles/ui99.css', 'src/styles/ui99-elevation.css'] as const;
const allTokensCss = SHEETS.map((f) => readFileSync(resolve(process.cwd(), f), 'utf8')).join('\n');
const ui99css = allTokensCss;

describe('AI DNA — the genome is real', () => {
  it('only promises tokens that exist in ui99.css', () => {
    const missing: string[] = [];
    for (const group of Object.values(DNA_TOKENS)) {
      for (const t of group) {
        if (t.startsWith('--') && !ui99css.includes(`${t}:`)) missing.push(t);
      }
    }
    expect(missing, `DNA promises tokens the CSS never declared: ${missing.join(', ')}`).toEqual([]);
  });

  it('the system prompt carries the quiet law with its real numbers', () => {
    const p = buildSystemPrompt({ lang: 'en' });
    expect(p).toContain('--bg-quiet');
    expect(p).toContain('--border-subtle');
    expect(p).toContain('NEVER a dark: fork');
    expect(p.includes('min-h-[44px]') || p.includes('\u226544px')).toBe(true);
  });

  it('the laws state the touch floor and the bidi rule', () => {
    const all = DNA_LAWS.join(' ');
    expect(all).toMatch(/44px/);
    expect(all).toMatch(/RTL/);
    expect(all).toMatch(/zero hard-coded hex/i);
  });

  it('injects the registry catalog with real component names', () => {
    const p = buildSystemPrompt({ lang: 'fa' });
    expect(p).toContain('### <button>');
    expect(p).toContain('### <card>');
    const audit = dnaAudit();
    expect(audit.components).toBeGreaterThan(50);
    expect(audit.laws).toBeGreaterThanOrEqual(10);
  });
});

describe('AI Studio — artifact parsing', () => {
  it('splits a well-formed answer into html, jsx and spec', () => {
    const raw = [
      'intro line',
      '```html',
      '<div class="x">hi</div>',
      '```',
      '```jsx',
      'export const A = () => <div />;',
      '```',
      '- **intent**: a profile card on the quiet tier',
      '- **variants**: denser / elevated / horizontal',
      '- **tokens**: --bg-quiet --border-subtle',
    ].join('\n');
    const a = parseArtifact(raw);
    expect(a.html).toContain('<div');
    expect(a.jsx).toContain('export const A');
    expect(a.intent).toContain('profile card');
    expect(a.variants.length).toBeGreaterThan(0);
  });

  it('the demo generator produces a compliant, previewable artifact', () => {
    const raw = demoGenerate('یه کارت پروفایل خفن با آواتار', 'fa');
    const a = parseArtifact(raw);
    expect(a.html).toContain('demo-root');
    // the demo must obey the house laws, not just render
    expect(a.html).toContain('var(--bg-quiet)');
    expect(a.html).not.toMatch(/(?<![\w-])#[0-9a-fA-F]{6}\b/);
    expect(a.html).toContain('min-height:44px');
    expect(a.intent.length).toBeGreaterThan(10);
  });

  it('the sandbox doc wraps the artifact with the real token sheet and the chosen theme', () => {
    const doc = buildSrcdoc('<div class="demo-root">x</div>', 'light', 'rtl');
    expect(doc).toContain('class="light"');
    expect(doc).toContain('dir="rtl"');
    expect(doc).toContain('ui99.css');
    expect(doc).not.toContain('demo-root" style');
  });

  it('never keeps a provider key in the bundle or a default key in storage', () => {
    for (const id of PROVIDER_IDS) {
      expect(getKey(id)).toBe('');
      expect(PROVIDERS[id].keyUrl).toMatch(/^https:/);
    }
  });
});
