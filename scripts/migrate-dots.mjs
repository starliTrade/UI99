/**
 * UI99 — status-dot migration (one-shot codemod)
 *
 * The icon codemod deliberately skipped everything under 12px. Most of that is
 * correct — but a `w-2 h-2 rounded-(--radius-pill)` element is not an
 * off-scale icon, it is a *status dot*: a filled circle whose only job is to
 * say "this is present". That is a role the scale should name, so it does.
 *
 * The `rounded-pill` requirement is what makes this safe: a checkbox at
 * `w-4.5 h-4.5` is also roundish and must NOT be touched.
 *
 * Usage:  node scripts/migrate-dots.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dry = process.argv.includes('--dry');

const MAP = { 'w-2 h-2': 'icon-dot', 'w-2.5 h-2.5': 'icon-dot-lg' };

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });

let sites = 0;
const report = [];

for (const file of walk(join(root, 'src'))) {
  if (file.includes('/test/')) continue;
  const src = readFileSync(file, 'utf8');
  let out = src;
  let hits = 0;

  for (const [pair, token] of Object.entries(MAP)) {
    // Match a className ATTRIBUTE, capturing the delimiter, and rewrite only
    // inside the literal. The earlier version matched `[^"`]*` and ran past the
    // closing brace of a `${...}` expression, eating it and producing
    // `className={`…`}}` — a syntax error. Capturing the delimiter and
    // requiring it to close the literal keeps the rewrite inside the string.
    out = out.replace(
      /className=\{`([^`]*)`\}|className="([^"]*)"|className=\{'([^']*)'\}/g,
      (full, tpl, dq, sq) => {
        const classes = tpl ?? dq ?? sq;
        if (classes === undefined) return full;
        if (!classes.includes(pair)) return full;
        if (!classes.includes('rounded-(--radius-pill)')) return full;
        if (new RegExp(`(?:^|\\s)${token}(?=\\s|$)`).test(classes)) return full;
        hits++;
        const next = classes.replace(pair, token).replace(/\s+/g, ' ').trim();
        if (tpl !== undefined) return `className={\`${next}\`}`;
        if (sq !== undefined) return `className={'${next}'}`;
        return `className="${next}"`;
      },
    );
  }

  if (hits > 0) {
    sites += hits;
    report.push(`  ${file.replace(root + '/', '')} — ${hits}`);
    if (!dry) writeFileSync(file, out);
  }
}

console.log(
  dry
    ? `[dry] would rewrite ${sites} status dots`
    : `[dots] rewrote ${sites} status dots`,
);
console.log(report.join('\n'));
