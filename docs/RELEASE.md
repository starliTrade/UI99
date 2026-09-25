# Release Checklist — @99/ui

The publish path is fully gated. Run these in order; any red step stops the
release.

```bash
bun run lint              # typecheck
bun run test              # behavioral + axe + contrast + audit matrix
bun run tokens:gate       # zero hard-coded surface/ink hexes in kit code
bun run registry:build    # regenerate public/registry.json from source scan
bun run registry:validate # schema + catalog + meta.a11y + dangling refs
bun run lib:build         # ESM/CJS/d.ts/4 stylesheets/CLI/registry → dist-kit/
node scripts/audit-package.mjs   # publish-readiness (exports, files, peerDeps…)
cd dist-kit && npm pack --dry-run
```

Then ship:

```bash
bun run changeset          # describe the change
bun run version-packages   # bump version + CHANGELOG.md
bun run lib:build          # rebuild with the new version baked in
cd dist-kit && npm publish
```

## CI gates (already wired — .github/workflows/ci.yml)

1. Typecheck
2. Token adherence gate (`tokens:gate`)
3. Tests (`vitest` + axe matrix + contrast math)
4. Registry validation (`registry:build` + `registry:validate`)
5. Kit build + `npm pack --dry-run`
6. Publish-readiness audit (`audit-package.mjs`)
