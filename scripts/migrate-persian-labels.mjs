#!/usr/bin/env node
/**
 * UI99 — Persian label codemod: `font-mono` → `font-ui` where the text is prose
 *
 * The mono voice is for identifiers, commands and code. It is NOT for a label,
 * a chip, a section heading or an empty-state message — and in this system those
 * very elements render Persian, because a studio that shows component names
 * also shows the words around them.
 *
 * Why it matters is not aesthetic. JetBrains Mono has no Arabic glyphs, so a
 * Persian label on a `font-mono` element falls through the whole stack to the
 * operating system. That fallback is silent, it varies by machine, and nothing
 * in the markup hints that it happened — which is exactly the report that came
 * back: "the text is Persian but the Persian font is not applied."
 *
 * `font-ui` is the same family as body text, so the Persian face is chosen by
 * the same rule as everywhere else and the fallback question never arises.
 *
 * The test for "does this element render Persian" is deliberately conservative:
 * a `font-mono` class list is only rewritten when Persian script appears in
 * the element's own JSX neighbourhood, AND the element is not an identifier
 * context (a `<code>` element, a `dir="ltr"` run, a `data-*` selector). A wrong
 * rewrite turns a code chip into prose; a missed one leaves one label to fix by
 * hand, which is a far cheaper mistake and stays visible.
 *
 * Idempotent.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const FA = /[\u0600-\u06FF]/;

let changed = 0;
let files = 0;
const kept = [];

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (extname(p) === '.tsx') yield p;
  }
}

for (const file of walk('src')) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let touched = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/font-mono/.test(line)) continue;

    // The element spans from its opening tag to its closing one; look at that
    // whole span, not the line, because a class list and its Persian text are
    // routinely on different lines.
    const start = line.lastIndexOf('<', i);
    if (start < 0) continue;
    const tag = line.slice(start);
    const tagName = (tag.match(/^<([A-Za-z][\w.]*)/) ?? [])[1];
    let end = i;
    if (tagName) {
      while (end < lines.length && !lines[end].includes(`</${tagName}>`) && end < i + 12) end++;
    }
    const span = lines.slice(Math.max(0, start >= 0 ? i - 2 : 0), Math.min(lines.length, end + 1)).join('\n');
    if (!FA.test(span)) continue;

    // Identifiers stay mono. A code element, an LTR run, or a data attribute
    // is a name/value being displayed, not prose.
    if (/<code\b/.test(span) || /dir="ltr"/.test(span) || /data-[a-z-]+=/.test(span)) {
      kept.push(`${file}:${i + 1}: <${tagName}> keeps font-mono (identifier context)`);
      continue;
    }

    if (!line.includes('font-mono')) continue;
    lines[i] = line.replace(/\bfont-mono\b/g, 'font-ui');
    changed += 1;
    touched = true;
  }

  if (touched) {
    writeFileSync(file, lines.join('\n'));
    files += 1;
  }
}

console.log(`persian labels: ${changed} elements moved font-mono → font-ui across ${files} files`);
console.log(`${kept.length} kept font-mono on purpose — an identifier, not prose:`);
for (const k of kept.slice(0, 12)) console.log('  ' + k);
if (kept.length > 12) console.log(`  … and ${kept.length - 12} more`);
