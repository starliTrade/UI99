#!/usr/bin/env node
/**
 * UI99 — Soft-Continuity Migration (companion to migrate-tokens.mjs)
 *
 * Policy being enforced (docs/standards.md §2.4 "پیوستگی مخملی"):
 *   Every resting surface must sit CLOSE to the canvas; separation is earned
 *   by elevation and state, not by bright fills or hard borders.
 *
 * What this does, mechanically:
 *   1. RAW → TOKEN (dark:). Every `dark:` raw white-alpha (bg/border/divide)
 *      and raw zinc color becomes the nearest ladder token — with a softness
 *      bias, so a value that sits between two tokens rounds DOWN toward the
 *      canvas, not up.
 *   2. RAW → TOKEN (light, line-conditional). Unprefixed `*-black/[α]` classes
 *      are rewritten ONLY on lines that also carry a `dark:` override of the
 *      same property — i.e. lines where the black-alpha is the light-theme
 *      expression. Light uses its OWN biased ladder (the light tokens are not
 *      the dark numbers): 0.04–0.06 borders round DOWN to soft, so light is
 *      never made harder by this migration. Scrims, dots and marks (bg α > 0.1,
 *      any ring) are left alone: they are values, not surfaces.
 *   3. LADDER DEMOTION. Resting fills in ordinary (non-floating) components
 *      drop one step: bg-elevated → bg-card, bg-card-hover → bg-card,
 *      hover:bg-elevated → hover:bg-card-hover. Floating layers (modals,
 *      popovers, toasts, docks…) keep --bg-elevated: they genuinely float.
 *
 * Deliberately NOT touched:
 *   · ring-* alphas (selection/indicator rings are accent values)
 *   · bg alphas > 0.1 (dots, scrims, deliberate emphasis marks)
 *   · any line whose light value would have to move UP a token
 *
 * Usage: node scripts/migrate-softness.mjs [--write]
 *   Without --write, prints per-file diff counts only.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');

const DIRS = [
  'src/components/ui',
  'src/components/views',
  'src/components/home',
  'src/components/shells',
  'src/components/widgets',
];

/** Floating layers genuinely sit above the page — keep --bg-elevated there. */
const FLOATING_FILES = new Set([
  'Modal.tsx', 'AlertDialog.tsx', 'Dialog.tsx', 'Sheet.tsx', 'Popover.tsx',
  'DropdownMenu.tsx', 'Dropdown.tsx', 'DropdownButton.tsx', 'HoverCard.tsx',
  'Tooltip.tsx', 'TooltipPrimitive.tsx', 'Combobox.tsx', 'Command.tsx',
  'CommandBar.tsx', 'Toast.tsx', 'TopHeader.tsx', 'BottomNavigation.tsx',
  'TourGuide.tsx', 'KeyboardShortcutsDialog.tsx',
  'GlobalSearchModal.tsx', 'ObjectDetailModal.tsx', 'SettingsModal.tsx',
  'UniversalCaptureModal.tsx',
]);

/**
 * Ladders. Return null = leave the raw value alone (deliberate accent, or a
 * mapping that would harden the theme). The softness bias lives here:
 * borderline values always round DOWN (toward the canvas), per theme.
 *
 * Dark tokens: border .025/.035/.05 — bg subtle .02 / wash .04 / raised .06
 * Light tokens: border .035/.045/.08 — bg subtle/wash/raised ≈ .025/.04/.06
 */
const DARK_BORDER = (a) =>
  a <= 0.03 ? '--border-subtle' : a <= 0.042 ? '--border-soft' : a <= 0.08 ? '--border-strong' : null;
const DARK_BG = (a) =>
  a <= 0.028 ? '--bg-subtle'
  : a <= 0.05 ? '--bg-wash'
  : a <= 0.08 ? '--bg-raised'
  : a <= 0.1 ? '--state-selected'
  : null;
const LIGHT_BORDER = (a) =>
  a <= 0.045 ? '--border-subtle' : a <= 0.065 ? '--border-soft' : a <= 0.085 ? '--border-strong' : null;
const LIGHT_BG = (a) =>
  a <= 0.045 ? '--bg-subtle'
  : a <= 0.065 ? '--bg-wash'
  : a <= 0.085 ? '--bg-raised'
  : a <= 0.1 ? '--state-selected'
  : null;

const ladder = (prop, theme) =>
  theme === 'dark' ? (prop === 'bg' ? DARK_BG : DARK_BORDER) : prop === 'bg' ? LIGHT_BG : LIGHT_BORDER;

/** Parse a Tailwind alpha: `[0.05]` / `[.05]` / `5` (slash scale) → 0.05 */
const parseAlpha = (intPart, fracPart, slashPart) =>
  slashPart !== undefined ? Number(slashPart) / 100 : Number(`${intPart || '0'}.${fracPart}`);

// dark:border-white/[0.04] · dark:border-white/5 · dark:bg-white/10 …
const DARK_ALPHA_RE =
  /\bdark:((?:[a-z-]+:)*)(border|divide|bg)-white\/(?:\[0?(\d*)\.?(\d+)\]|(\d+)\b)/g;
const mapDarkAlpha = (_m, pfx, prop, intP, fracP, slashP) => {
  const tok = ladder(prop, 'dark')(parseAlpha(intP, fracP, slashP));
  return tok ? `dark:${pfx}${prop}-(${tok})` : _m;
};

const DARK_RULES = [
  { re: DARK_ALPHA_RE, sub: mapDarkAlpha },
  // raw zinc — dark idiom that bypassed the semantic text/border tokens
  { re: /\bdark:((?:[a-z-]+:)*)text-zinc-(?:300|400)\b/g, sub: (_m, pfx) => `dark:${pfx}text-(--text-secondary)` },
  { re: /\bdark:((?:[a-z-]+:)*)text-zinc-(?:500|600)\b/g, sub: (_m, pfx) => `dark:${pfx}text-(--text-muted)` },
  { re: /\bdark:((?:[a-z-]+:)*)border-zinc-(?:700|800)\b/g, sub: (_m, pfx) => `dark:${pfx}border-(--border-soft)` },
  { re: /\bdark:((?:[a-z-]+:)*)border-zinc-600\b/g, sub: (_m, pfx) => `dark:${pfx}border-(--border-strong)` },
  { re: /\bdark:((?:[a-z-]+:)*)divide-zinc-(?:700|800)\b/g, sub: (_m, pfx) => `dark:${pfx}divide-(--border-soft)` },
  { re: /\bdark:((?:[a-z-]+:)*)bg-zinc-900\b/g, sub: (_m, pfx) => `dark:${pfx}bg-(--bg-surface)` },
  { re: /\bdark:((?:[a-z-]+:)*)bg-zinc-800\b/g, sub: (_m, pfx) => `dark:${pfx}bg-(--bg-card)` },
];

// Light-side: unprefixed/breakpoint black-alpha, only on lines with a dark twin.
const LIGHT_ALPHA_RE =
  /\b((?:[a-z-]+:)*)(border|divide|bg)-black\/(?:\[0?(\d*)\.?(\d+)\]|(\d+)\b)/g;

// ── Ladder demotion (non-floating files only) ────────────────────────────────
const DEMOTION = [
  { re: /\bdark:((?:[a-z-]+:)*)bg-\(--bg-elevated\)/g, sub: (_m, pfx) => `dark:${pfx}bg-(--bg-card)` },
  { re: /\bdark:((?:[a-z-]+:)*)bg-\(--bg-card-hover\)/g, sub: (_m, pfx) => `dark:${pfx}bg-(--bg-card)` },
];

const collect = (dir) =>
  readdirSync(resolve(root, dir))
    .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map((f) => `${dir}/${f}`);

/** A light-side raw has a dark: twin of the same property on this line? */
const hasDarkTwin = (line, prop) =>
  line.includes('dark:') && new RegExp(`\\bdark:(?:[a-z-]+:)*${prop}-`).test(line);

let total = 0;
const changedFiles = [];

for (const dir of DIRS) {
  for (const rel of collect(dir)) {
    const path = resolve(root, rel);
    const before = readFileSync(path, 'utf8');
    const file = rel.split('/').pop();
    const floating = FLOATING_FILES.has(file);

    const lines = before.split('\n').map((line) => {
      let out = line;
      for (const { re, sub } of DARK_RULES) out = out.replace(re, sub);
      // Light-side black-alpha → token, only where a dark: twin exists, so the
      // dark rendering of the line can never change. The light ladder is
      // down-biased; out-of-ladder values (scrims, emphasis) stay raw.
      for (const prop of ['border', 'divide', 'bg']) {
        if (!hasDarkTwin(out, prop)) continue;
        out = out.replace(LIGHT_ALPHA_RE, (_m, pfx, prop2, intP, fracP, slashP) => {
          if (prop2 !== prop) return _m;
          const tok = ladder(prop2, 'light')(parseAlpha(intP, fracP, slashP));
          return tok ? `${pfx}${prop2}-(${tok})` : _m;
        });
      }
      return out;
    });

    let src = lines.join('\n');
    if (!floating) for (const { re, sub } of DEMOTION) src = src.replace(re, sub);

    if (src !== before) {
      total++;
      changedFiles.push(rel);
      if (WRITE) writeFileSync(path, src);
    }
  }
}

console.log(
  `${WRITE ? 'WROTE' : 'DRY '} · ${total} file(s) changed${WRITE ? '' : ' (dry run — pass --write)'}`,
);
for (const f of changedFiles) console.log('  ' + f);
