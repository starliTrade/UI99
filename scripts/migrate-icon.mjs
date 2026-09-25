/**
 * UI99 — icon-size migration (one-shot codemod)
 *
 * Rewrites raw `w-N h-N` pairs on **icon elements only** to the five optical
 * `icon-*` sizes. Deliberately narrow: a blind find/replace of `w-4 h-4` would
 * also hit layout boxes (a 16px-wide divider, a 16px-tall avatar), and an icon
 * token applied to a non-icon is worse than a raw number, because it looks
 * governed while changing meaning.
 *
 * What counts as an icon here:
 *   · a JSX element whose tag is Capitalised (a component — in this kit, lucide)
 *   · optionally overridden per-file via ICON_TAGS for local icon components
 *
 * Usage:  node scripts/migrate-icon.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dry = process.argv.includes('--dry');

/** Tailwind numeral → optical token. Only sizes the scale actually declares. */
const MAP = {
  3: 'icon-xs', // 12px
  3.5: 'icon-sm', // 14px
  4: 'icon-md', // 16px — the default
  5: 'icon-lg', // 20px
  6: 'icon-xl', // 24px
};

/**
 * Local components that render an icon. Anything imported from `lucide-react`
 * is caught by the Capitalised-tag rule already; this is for in-repo ones.
 */
const ICON_TAGS = new Set(['UI99Wordmark', 'SafaBrandLogo', 'UI99Logo']);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });

let touchedFiles = 0;
let touchedSites = 0;
const report = [];

for (const file of walk(join(root, 'src'))) {
  if (file.includes('/test/')) continue;
  const src = readFileSync(file, 'utf8');
  let out = src;
  let hits = 0;

  // Match a JSX element with a className, capturing the tag and the class list.
  out = out.replace(
    /<([A-Z][A-Za-z0-9]*)\b([^>]*?)className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g,
    (full, tag, attrs, dq, tpl, sq) => {
      if (!ICON_TAGS.has(tag) && !/^[A-Z]/.test(tag)) return full;
      const classes = dq ?? tpl ?? sq;
      if (!classes) return full;

      // Only a matched w/h PAIR on the same element is an icon box.
      const w = classes.match(/(?:^|\s)w-([0-9.]+)(?=\s|$)/);
      const h = classes.match(/(?:^|\s)h-([0-9.]+)(?=\s|$)/);
      if (!w || !h || w[1] !== h[1]) return full;

      const token = MAP[w[1]];
      if (!token) return full; // 2 / 2.5 / 7 / 8 … are dots or art, not icons

      // Drop the pair, add the token — unless the token is already there.
      if (new RegExp(`(?:^|\\s)${token}(?=\\s|$)`).test(classes)) return full;

      const next = classes
        .replace(/(?:^|\s)w-[0-9.]+(?=\s|$)/, ' ')
        .replace(/(?:^|\s)h-[0-9.]+(?=\s|$)/, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      hits++;

      const rebuilt = `${token} ${next}`.trim();
      if (dq) return `<${tag}${attrs}className="${rebuilt}"`;
      if (tpl) return `<${tag}${attrs}className={\`${rebuilt}\`}`;
      return `<${tag}${attrs}className={'${rebuilt}'}`;
    },
  );

  if (hits > 0) {
    touchedFiles++;
    touchedSites += hits;
    report.push(`  ${file.replace(root + '/', '')} — ${hits}`);
    if (!dry) writeFileSync(file, out);
  }
}

console.log(
  dry
    ? `[dry] would rewrite ${touchedSites} icon sizes across ${touchedFiles} files`
    : `[icon] rewrote ${touchedSites} icon sizes across ${touchedFiles} files`,
);
console.log(report.join('\n'));
