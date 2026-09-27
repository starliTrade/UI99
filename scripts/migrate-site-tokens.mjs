#!/usr/bin/env node
/**
 * UI99 — site tokeniser
 *
 * The kit is token-driven; the PRODUCT SURFACE around it was not. Views, home
 * sections, widgets and shells chose their colours in JavaScript:
 *
 *     ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E7A]'}
 *
 * That is the same defect as the hard-coded `bg-[#F4F4F6]` on the app root,
 * one level deeper. A hex literal bypasses the token, so the two themes drift
 * apart by hand and no palette change ever reaches them. It is also why the
 * `!important` light-mode band-aid existed at all: with the theme decided in
 * JS, a CSS `dark:` variant cannot reach those call sites, so the only repair
 * available was to repaint their classes from the outside — with a selector
 * that, it turned out, had stopped compiling.
 *
 * Two passes:
 *   1. Every surface/ink hex in a class list becomes its token. This is the
 *      substantive fix and it is theme-reactive on its own.
 *   2. A `isDark ? a : b` whose branches are now identical collapses to `a`.
 *      A ternary that returns the same class twice is a class you have to read
 *      twice to believe, and the system exists so no one has to.
 *
 * Where the two branches genuinely differ, pass 1 has already made them tokens
 * and the codemod reports what is left. Folding those into `dark:` variants is
 * a per-component decision, so it is left visible rather than guessed at — a
 * wrong token is worse than an honest leftover.
 *
 * Idempotent: a second run finds nothing.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/** hex → ladder step. Mirrors src/styles/ui99.css. */
const INK = {
  '#EDEDEF': 'primary', '#EBEBEF': 'primary', '#E2E2E8': 'primary',
  '#F2F2F5': 'primary', '#FFFFFF': 'primary', '#111116': 'primary',
  '#111113': 'primary', '#09090B': 'primary', '#09090C': 'on-fill',
  '#92929B': 'secondary', '#8E8E98': 'secondary', '#9E9EA8': 'secondary',
  '#A1A1AA': 'secondary', '#D4D4D8': 'secondary', '#6E6E78': 'secondary',
  '#D4C5B9': 'secondary', '#90909A': 'secondary', '#8A8A95': 'secondary',
  '#5C5C66': 'muted', '#60606B': 'muted', '#71717A': 'muted', '#85858F': 'muted',
  '#5C5C68': 'muted', '#6E6E7A': 'muted', '#7E7E8A': 'muted', '#9494A0': 'muted',
  '#8E8E99': 'muted', '#B5B5BE': 'muted', '#454550': 'muted',
  '#0C0C0E': 'on-fill', '#060709': 'on-fill', '#06070A': 'on-fill', '#050507': 'on-fill',
};
const SURFACE = {
  '#060709': 'canvas', '#06070A': 'canvas', '#050507': 'canvas',
  '#07080B': 'sunken', '#07080C': 'sunken', '#F0F0F4': 'sunken', '#F1F0EC': 'sunken',
  '#F3F3F6': 'sunken', '#EFEFEA': 'sunken',
  '#090A0E': 'surface', '#0A0B10': 'surface', '#0B0C11': 'surface', '#F8F8FA': 'surface',
  '#0C0D12': 'card', '#0E0E14': 'card', '#0E0F14': 'card', '#131314': 'card',
  '#0D0D12': 'card', '#FFFFFF': 'card', '#0E0E13': 'card', '#15151B': 'card',
  '#0E0F15': 'card', '#131317': 'card', '#18181F': 'card', '#1A1A20': 'card',
  '#1C1C22': 'card', '#1E1E24': 'card', '#1E1E26': 'card', '#20202A': 'card',
  '#FAF9F6': 'canvas', '#F5F5F8': 'canvas', '#FAFAFC': 'canvas', '#F4F4F6': 'canvas',
  '#101117': 'card-hover', '#111117': 'card-hover', '#15151B ': 'card-hover',
  '#171822': 'card-hover', '#181924': 'card-hover', '#F6F5F1': 'card-hover',
  '#F5F5F8 ': 'card-hover',
  '#111218': 'elevated', '#131318': 'elevated', '#16161B': 'elevated',
  '#18181D': 'elevated', '#111114': 'elevated', '#12131C': 'elevated',
  '#141418': 'elevated', '#181820': 'elevated', '#0E0F16': 'elevated',
  '#14141E': 'elevated', '#0E0E13 ': 'elevated', '#12131A': 'elevated',
  '#0B0B0D': 'sunken',
  '#F9F9FB': 'wash', '#F6F6F9': 'wash', '#FAFAFB': 'wash', '#F7F7F8': 'wash',
  '#F6F6F6': 'wash', '#F5F5F5': 'wash', '#F9F9F9': 'wash', '#FAFAFA': 'wash',
  '#F1F1F5': 'raised', '#F2F2F4': 'raised', '#EFEFF3': 'raised',
};
const BORDER = {
  '#F5F5F8': 'subtle', '#0A0B10': 'subtle', '#0B0C11': 'subtle', '#090A0E': 'subtle',
  '#090A0F': 'subtle', '#050507': 'subtle', '#0E0E14': 'soft', '#0E0F14': 'soft',
  '#131318': 'strong', '#18181D': 'strong', '#16161B': 'strong', '#202026': 'strong',
  '#222228': 'strong', '#F2F2F4': 'strong',
};

const TOKENS = {
  text: {
    primary: '--text-primary', secondary: '--text-secondary',
    muted: '--text-muted', 'on-fill': '--text-on-fill',
  },
  bg: {
    canvas: '--bg-canvas', surface: '--bg-surface', card: '--bg-card',
    'card-hover': '--bg-card-hover', elevated: '--bg-elevated', sunken: '--bg-sunken',
    subtle: '--bg-subtle', wash: '--bg-wash', raised: '--bg-raised',
  },
  border: { subtle: '--border-subtle', soft: '--border-soft', strong: '--border-strong' },
};

/** Pass 1 — one class → its token, or null when no token covers it. */
function tokenizeClass(cls) {
  let m = cls.match(/^((?:[a-z0-9\[\]&#>:/.-]+:)*)text-\[#([0-9A-Fa-f]{6})\](.*)$/);
  if (m) {
    const step = INK['#' + m[2].toUpperCase()];
    return step ? `${m[1]}text-(${TOKENS.text[step]})${m[3]}` : null;
  }
  m = cls.match(/^((?:[a-z0-9\[\]&#>:/.-]+:)*)bg-\[#([0-9A-Fa-f]{6})\](.*)$/);
  if (m) {
    const step = SURFACE['#' + m[2].toUpperCase()];
    return step ? `${m[1]}bg-(${TOKENS.bg[step]})${m[3]}` : null;
  }
  m = cls.match(/^((?:[a-z0-9\[\]&#>:/.-]+:)*)(border|border-[xytrbl])-\[#([0-9A-Fa-f]{6})\](.*)$/);
  if (m) {
    const step = BORDER['#' + m[3].toUpperCase()];
    return step ? `${m[1]}${m[2]}-(${TOKENS.border[step]})${m[4]}` : null;
  }
  return null;
}

function tokenizeList(list) {
  let changed = false;
  // Split on interpolations FIRST and never look inside one.
  //
  // A class list is `literal ${expr} literal`, and the expr may itself contain
  // a quoted class string — `${isDark ? 'text-[#8E8E98]' : 'text-[#6E7A]'}`. An
  // earlier version tokenised the whole run on whitespace, ate the `${`, and
  // left `${text-(--text-secondary)}` behind: a TypeScript error, in six
  // files, from a whitespace split. Interpolations are opaque here.
  const out = list
    .split(/(\$\{[^}]*\})/)
    .map((seg) => {
      if (seg.startsWith('${')) return seg; // opaque — hands off
      const t = seg
        .split(/\s+/)
        .map((cls) => {
          if (!cls) return cls;
          const k = tokenizeClass(cls);
          if (k && k !== cls) { changed = true; return k; }
          return cls;
        })
        .filter(Boolean)
        .join(' ');
      return t;
    })
    .join(' ');
  return { out, changed };
}

// Any quoted run that contains an arbitrary-value colour class. Restricting
// this to single quotes only reached the JS ternaries; the bulk of the site
// writes `className="..."` in double quotes, which is why the first run
// converted 37 of ~360. The pattern itself (text-[#hex] / bg-[#hex] /
// border-[#hex]) only occurs in class lists, so matching inside any quoting
// style cannot touch prose — a sentence that happens to say #EDEDEF does not
// spell it as a Tailwind class.
const STRING = /(['"`])([^'"`\n]*#[0-9A-Fa-f]{6}[^'"`\n]*)\1/g;
const TERNARY = /(\$\{)?isDark\s*\?\s*'([^']*)'\s*:\s*'([^']*)'\s*(\})?/g;

let tokenized = 0;
let collapsed = 0;
let changedFiles = 0;
const left = [];

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (extname(p) === '.tsx') yield p;
  }
}

for (const file of walk('src')) {
  const src = readFileSync(file, 'utf8');

  // ── Pass 1: tokenise inside single-quoted class strings only.
  let out = src.replace(STRING, (m, q, body) => {
    if (!/#[0-9A-Fa-f]{6}/.test(body)) return m;
    const { out: list, changed } = tokenizeList(body);
    if (!changed) return m;
    const n = (body.match(/#[0-9A-Fa-f]{6}/g) ?? []).length;
    tokenized += n;
    return `${q}${list}${q}`;
  });

  // ── Pass 2: collapse a ternary whose branches are now the same.
  out = out.replace(TERNARY, (m, dollar, a, b, close) => {
    if (a === b) {
      collapsed += 1;
      return `${dollar ?? ''}'${a}'${close ?? ''}`;
    }
    if (!a.includes('#') && !b.includes('#') && a !== b) left.push(`${file}: isDark ? '${a}' : '${b}'`);
    return m;
  });

  if (out !== src) {
    writeFileSync(file, out);
    changedFiles += 1;
  }
}

console.log(
  `site tokeniser: ${tokenized} surface/ink hexes → tokens, ${collapsed} theme ternaries collapsed, ${changedFiles} files`,
);
console.log(
  `${left.length} ternaries still fork the theme in JavaScript — both branches are tokens now, so folding them into \`dark:\` variants is a per-component call and is left visible rather than guessed at.`,
);
for (const l of left.slice(0, 10)) console.log('  ' + l);
if (left.length > 10) console.log(`  … and ${left.length - 10} more`);
