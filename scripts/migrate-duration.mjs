// Migrate raw Tailwind `duration-N` utilities to the measured UI99 ramp.
// Every mapping below is millisecond-identical to what Tailwind already emits
// (`--spacing`-independent: Tailwind's duration scale is 1ms-per-step), so this
// changes no rendered timing. Replacer-function based, so it can never cross a
// `}` boundary and truncate a template literal.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// ms → the token that carries exactly that value.
const MAP = {
  75: 'dur-instant',
  100: 'dur-fast',
  150: 'dur-quick',
  200: 'dur-base',
  300: 'dur-slow',
  400: 'dur-deliberate',
  500: 'dur-lazy',
};

const roots = ['src/components', 'src/core'];
let files = 0;
let sites = 0;
const counts = {};
const touched = [];

for (const root of roots) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        stack.push(p);
        continue;
      }
      if (!/\.tsx?$/.test(e.name)) continue;

      const before = readFileSync(p, 'utf8');
      let local = 0;
      const after = before.replace(/\bduration-(\d+)\b/g, (m, n) => {
        const token = MAP[n];
        if (!token) return m;
        local++;
        return token;
      });

      if (local > 0) {
        writeFileSync(p, after);
        files++;
        sites += local;
        counts[local] = (counts[local] || 0) + 1;
        touched.push(`${p} (${local})`);
      }
    }
  }
}

console.log(`[duration] ${sites} site(s) across ${files} file(s) migrated`);
Object.entries(counts)
  .sort((a, b) => +a[0] - +b[0])
  .forEach(([n, c]) => console.log(`  ${n} file(s) had ${n} site(s)`));
touched.forEach((t) => console.log('  -', t));
