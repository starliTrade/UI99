# Contributing to UI99 (@99/ui)

Thanks for helping build a world-class design system! This repo follows a
**ruthless standards-first process** — quality gates are not bureaucracy, they
are the product.

## The golden rule

> Every new component **MUST** pass the audit checklist in
> [`docs/standards.md` §12](docs/standards.md) before merge.

That means, for every interactive primitive:

1. **Five states**: `default / hover / press / focus-visible / disabled`
2. **Keyboard support** matching its WAI-ARIA pattern (radiogroup roving
   tabindex, listbox arrows/type-ahead, Esc dismissal, RTL-aware arrows)
3. **`focus-safa` / `focus-safa-inset`** focus rings — never browser defaults,
   never ad-hoc rings
4. **No hard-coded hex outside tokens** — use `--bg-*`, `--text-*`,
   `--state-*`, `--focus-ring` or the audited token scale
5. **Contrast verified** via the CI gate (`src/test/contrast.test.ts`) —
   new text/background pairs must pass ≥ 4.5:1 (text) / 3:1 (UI)
6. **axe-clean** — render it inside a `describe('is axe-clean')` block and
   keep violations at zero (`src/test/components.test.tsx` is the pattern)

## Workflow

```bash
bun install
bun run dev        # living component showcase + product shell
bun run test       # vitest + jest-axe + contrast gates
bun run lint       # typecheck
bun run lib:build  # npm kit artifacts → dist-kit/
```

### Checklist before opening a PR

- [ ] `bun run test` green (behavioral + axe + contrast)
- [ ] `bun run lint` green
- [ ] Component added to the audit matrix in `docs/ROADMAP.md` §1.1
- [ ] New tokens documented in `src/styles/safa.css` comments and, if
      user-facing, in `docs/standards.md`
- [ ] Touch targets ≥ 44px, RTL checked (`dir="rtl"` smoke test), reduced
      motion respected

## Kit vs. domain code

- `src/components/ui/kit.ts` exports **context-free primitives only** — a
  module reachable from it must import nothing beyond `react`,
  `radix-*`, `motion/react`, `cva/clsx/tailwind-merge`, `lucide-react`.
- Domain composites (toast store, nav chrome, object domain) live outside the
  kit entry and are excluded from the npm package on purpose.
- After touching the kit, run `bun run lib:build` and confirm the bundle
  purity check (no `AppContext`/`AuthContext` references in `dist-kit/index.js`).

## Versioning

Releases are prepared with Changesets (Phase 2.3). Until then, keep
`package.json` version bumps aligned with meaningful milestone commits and
document behavior changes in `docs/ROADMAP.md`.
