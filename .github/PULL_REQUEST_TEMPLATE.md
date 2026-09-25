<!-- UI99 PR template — every merge clears the docs/standards.md §12 audit. -->

## What & why

<!-- One or two sentences: what changes and why it matters. -->

## Audit checklist (docs/standards.md §12)

- [ ] `bun run test` green — behavioral + axe + contrast gates
- [ ] `bun run lint` green (typecheck)
- [ ] `bun run tokens:gate` green — zero hard-coded surface/ink hexes
- [ ] `bun run registry:build && bun run registry:validate` green
      (if the roster changed)
- [ ] Five states implemented: default / hover / press / focus-visible / disabled
- [ ] Keyboard support matches the WAI-ARIA pattern (RTL-aware)
- [ ] `focus-ui99` / `focus-ui99-inset` rings — no ad-hoc rings
- [ ] 44px touch targets for interactive elements
- [ ] Dual-theme verified (Obsidian Dark + Porcelain Light)
- [ ] Registry item metadata updated (title/description/category/meta.a11y)
      via `bun run registry:build` — the gate fails on drift

## Screens / evidence

<!-- For visual changes: before/after in both themes. For API changes: the
     generated JSX from the All-Props Playground. -->
