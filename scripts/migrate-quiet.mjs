/**
 * migrate-quiet.mjs — §2.6/§2.9 unification codemod (one-shot, idempotent).
 *
 * The quiet standard (--bg-quiet Δ+6, --bg-quiet-hover, --border-subtle →
 * --border-soft on hover) is the ONE resting surface for canvas-resting
 * secondary controls, chips, and soft panels — in both themes, no dark: fork.
 *
 * Three tiers of roles, per docs/standards.md §2.6:
 *   Tier 1 quiet      — secondary buttons, chips, doc actions  (bg-quiet)
 *   Tier 2 control    — form fields, segmented bars, toggles   (bg-control)  ← untouched
 *   Tier 3/4 surface  — cards, elevated panels                 (bg-card/…)   ← untouched
 *
 * Everything this script rewrites was measured first (2026-09-30 session):
 * 49× subtle+card, 25× subtle+wash, 11× wash+card … and 41 hover forks whose
 * light/dark branches disagreed about the same state. Each replacement below
 * is an exact string so a drifted call site FAILS LOUDLY instead of silently
 * passing. Run: node scripts/migrate-quiet.mjs   (re-run = 0 replacements)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILES = [
  'src/components/ui/Button.tsx',
  'src/components/ui/Tabs.tsx',
  'src/components/ui/TopHeader.tsx',
  'src/components/ui/AllPropsPlayground.tsx',
  'src/components/ui/LinearIssueTracker.tsx',
  'src/components/ui/ColorPicker.tsx',
  'src/components/ui/DropdownButton.tsx',
  'src/components/ui/DropdownMenu.tsx',
  'src/components/ui/Badge.tsx',
  'src/components/ui/EmptyPlaceholder.tsx',
  'src/components/ui/ActivityFeed.tsx',
  'src/components/ui/TokensAuditPlayground.tsx',
  'src/components/views/DesignSystemHomeView.tsx',
  'src/components/views/DocsView.tsx',
  'src/components/views/UIKitView.tsx',
  'src/components/views/FoundationsView.tsx',
  'src/components/views/BlocksView.tsx',
  'src/components/home/RegistryStudio.tsx',
  'src/components/home/ModernLinearHomeView.tsx',
  'src/components/home/studioSpecimens.tsx',
  'src/core/ErrorBoundary.tsx',
];

/* Exact-string rewrite table. Keys must appear verbatim (post-prettier); a
   miss is reported, never guessed around. PRE runs before the generic forks —
   it holds longer strings that contain a generic key as a prefix (e.g. a
   `/50` alpha suffix) where the generic rewrite would leave the suffix
   dangling on a token that has no such form. */
const PRE = [
  // CalendarView unselected day chip (alpha suffix — must not leak into quiet)
  ['bg-(--bg-subtle) dark:bg-(--bg-card)/50 border-(--border-subtle) dark:border-(--border-subtle) hover:bg-(--bg-subtle) dark:hover:bg-(--bg-wash)',
   'bg-(--bg-quiet) border-(--border-subtle) hover:bg-(--bg-quiet-hover)'],
  // Card "compact" surface (alpha suffix)
  ['bg-(--bg-wash) dark:bg-(--bg-surface)/80 border-transparent', 'bg-(--bg-quiet) border-transparent'],
  // SplitButton main arm (text + hover fork ride along)
  ['bg-(--bg-subtle) dark:bg-(--bg-card) text-zinc-900 dark:text-(--text-primary) hover:bg-(--bg-raised) dark:hover:bg-(--bg-card) border border-(--border-soft)',
   'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-soft)'],
];

const RESTING_FORKS = [
  // panel/chip resting fills whose two theme branches disagreed
  ['bg-(--bg-subtle) dark:bg-(--bg-card)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-wash)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-wash) dark:bg-(--bg-card)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-wash) dark:bg-(--bg-wash)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-subtle)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-raised)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-wash) dark:bg-(--bg-raised)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-canvas)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-sunken)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-wash) dark:bg-(--bg-sunken)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-surface)', 'bg-(--bg-quiet)'],
  ['bg-(--bg-raised) dark:bg-(--bg-card)', 'bg-(--bg-quiet)'], // kbd/code chips
  ['bg-zinc-100 hover:bg-(--bg-raised) dark:bg-(--bg-wash) dark:hover:bg-(--bg-raised)', 'bg-(--bg-quiet) hover:bg-(--bg-quiet-hover)'],
  ['bg-(--bg-subtle) dark:bg-(--bg-elevated) text-zinc-900 dark:text-(--text-primary) hover:bg-(--bg-raised) dark:hover:bg-(--bg-card-hover)', 'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary)'],
];

const HOVER_FORKS = [
  ['hover:bg-(--bg-subtle) dark:hover:bg-(--bg-wash)', 'hover:bg-(--bg-quiet-hover)'],
  ['hover:bg-(--bg-subtle) dark:hover:bg-(--bg-subtle)', 'hover:bg-(--bg-quiet-hover)'],
  ['hover:bg-(--bg-subtle) dark:hover:bg-(--bg-raised)', 'hover:bg-(--bg-quiet-hover)'],
  ['hover:bg-(--bg-wash) dark:hover:bg-(--bg-wash)', 'hover:bg-(--bg-quiet-hover)'],
  ['hover:bg-(--bg-subtle) dark:hover:bg-(--bg-card)', 'hover:bg-(--bg-quiet-hover)'],
];

/* Hand-rolled control fills that are exact per call site (rest → quiet pair). */
const POINTS = [
  // TopHeader: three secondary header controls
  ['border border-(--border-soft) bg-(--bg-control) hover:bg-(--state-hover) type-caption font-mono text-(--text-secondary)',
   'border border-(--border-subtle) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) type-caption font-mono text-(--text-secondary)'],
  ['border border-(--border-soft) bg-(--bg-control) hover:bg-(--state-hover) text-(--text-secondary)',
   'border border-(--border-subtle) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) text-(--text-secondary)'],
  // RegistryStudio ActionButton + compact rail button
  ['rounded-(--radius-sm) bg-(--bg-control) border border-(--border-soft) text-(--text-secondary) hover:bg-(--state-hover)',
   'rounded-(--radius-sm) bg-(--bg-quiet) border border-(--border-subtle) hover:border-(--border-soft) text-(--text-secondary) hover:bg-(--bg-quiet-hover)'],
  ['text-(--text-secondary) bg-(--bg-control) border border-(--border-soft) hover:text-(--text-primary) hover:bg-(--state-hover)',
   'text-(--text-secondary) bg-(--bg-quiet) border border-(--border-subtle) hover:border-(--border-soft) hover:text-(--text-primary) hover:bg-(--bg-quiet-hover)'],
  // ErrorBoundary retry CTA
  ['rounded-full border border-(--border-soft) bg-(--bg-control) px-6',
   'rounded-full border border-(--border-subtle) bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) px-6'],
  // DocsView accessibility info panels (soft panels, Tier 1 chrome)
  ['bg-(--bg-control) border border-(--border-soft) dark:border-(--border-subtle) space-y-2',
   'bg-(--bg-quiet) border border-(--border-subtle) space-y-2'],
  // studioSpecimens trigger demos
  ['type-caption bg-(--bg-subtle) border border-(--border-subtle) text-(--text-primary) cursor-pointer',
   'type-caption bg-(--bg-quiet) hover:bg-(--bg-quiet-hover) border border-(--border-subtle) hover:border-(--border-soft) text-(--text-secondary) hover:text-(--text-primary) cursor-pointer'],
  // LinearIssueTracker pill triggers
  ['bg-(--bg-quiet) border border-(--border-soft) text-(--text-secondary) flex items-center gap-1 cursor-pointer hover:border-black/20 dark:hover:border-white/10',
   'bg-(--bg-quiet) border border-(--border-subtle) text-(--text-secondary) flex items-center gap-1 cursor-pointer hover:border-(--border-soft)'],
  // AllPropsPlayground component tab (inactive arm)
  ['bg-(--bg-quiet) text-(--text-secondary) hover:bg-state-hover',
   'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover)'],
  // UIKitView CLI install box (hero-adjacent)
  ['bg-(--bg-wash) dark:bg-(--bg-surface) border border-(--border-soft) dark:border-(--border-subtle) type-caption font-mono text-zinc-800 dark:text-zinc-200',
   'bg-(--bg-quiet) border border-(--border-subtle) type-caption font-mono text-zinc-800 dark:text-zinc-200'],
];

/* Engine internals (Button.tsx / Tabs.tsx) — exact per variant. */
const ENGINE = [
  // dark-pill becomes the quiet pill (§2.6: secondary ON an elevated parent)
  [`        'dark-pill':
          'bg-(--bg-control) text-(--text-primary) hover:bg-(--state-hover) border border-(--border-soft) shadow-(--shadow-card)',`,
   `        // §2.6 — "dark-pill" was a control wearing an opaque card fill on an
        // elevated parent; the quiet pair is theme-agnostic there too.
        'dark-pill':
          'bg-(--bg-quiet) text-(--text-secondary) hover:bg-(--bg-quiet-hover) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-soft) shadow-xs',`],
  // Tag neutral + rose variants
  [`    neutral:
      'bg-(--bg-control) text-(--text-secondary) border border-(--border-soft)',`,
   `    neutral:
      'bg-(--bg-quiet) text-(--text-secondary) border border-(--border-subtle) hover:border-(--border-soft)',`],
  [`    rose:
      'bg-(--bg-control) text-(--text-secondary) font-medium border border-(--border-soft)',`,
   `    rose:
      'bg-(--bg-quiet) text-(--text-secondary) font-medium border border-(--border-subtle) hover:border-(--border-soft)',`],
  // Avatar letter tile
  ['rounded-(--radius-pill) bg-(--bg-control) text-(--text-secondary) flex items-center justify-center font-medium ring-1',
   'rounded-(--radius-pill) bg-(--bg-quiet) text-(--text-secondary) flex items-center justify-center font-medium ring-1'],
  // Tabs segmented bar container
  [`      'inline-flex items-center justify-center p-1 rounded-(--radius-control) bg-(--bg-control) text-(--text-secondary) border border-(--border-soft)',`,
   `      'inline-flex items-center justify-center p-1 rounded-(--radius-control) bg-(--bg-quiet) text-(--text-secondary) border border-(--border-subtle)',`],
];

/* The audit panel must display the values the tokens actually resolve to. */
const SPECS = [
  ['<div>&Delta; +12</div>', '<div>&Delta; +36</div>'],
  ['<div>&Delta; +18</div>', '<div>&Delta; +21</div>'],
  ['<div>&Delta; +24</div>', '<div>&Delta; +37</div>'],
];

/* POST runs after the generic forks — it pairs the fresh quiet fill with the
   border pair the call site still carries, at sites whose border fork the
   standard also retires (decorative chips). */
const POST = [
  // Feedback / Toast decorative icon wells
  ['bg-(--bg-quiet) border border-(--border-soft) dark:border-(--border-strong) text-(--text-secondary) flex items-center justify-center mb-3',
   'bg-(--bg-quiet) border border-(--border-subtle) text-(--text-secondary) flex items-center justify-center mb-3'],
];

let total = 0;
import { readdirSync } from 'node:fs';
const ROOTS = ['src/components', 'src/core', 'src/lib'];
const files = [];
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx')) files.push(p);
  }
}
ROOTS.forEach((r) => walk(r));
for (const p of files) {
  let s;
  try { s = readFileSync(p, 'utf8'); } catch { continue; }
  const before = s;
  let n = 0;
  for (const table of [PRE, RESTING_FORKS, HOVER_FORKS, POINTS, ENGINE, SPECS, POST]) {
    for (const [oldStr, newStr] of table) {
      let idx;
      while ((idx = s.indexOf(oldStr)) !== -1) {
        s = s.slice(0, idx) + newStr + s.slice(idx + oldStr.length);
        n++;
      }
    }
  }
  if (n) { writeFileSync(p, s); console.log(`  ${String(n).padStart(3)}  ${p}`); total += n; }
  else if (s !== before) { console.log(`  ???  ${f} changed without counts`); }
}
console.log(total ? `\n✓ ${total} replacement(s)` : '\n✓ nothing to do (already migrated)');
