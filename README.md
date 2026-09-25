<div align="center">

# UI99 — `@99/ui`

**The velvet-obsidian React component kit.**
shadcn-grade DX · WCAG 2.2-audited · axe-clean · RTL-first · Tailwind v4

[![tests](https://img.shields.io/badge/tests-144%2F144-green)](#development) [![axe](https://img.shields.io/badge/axe--core-0%20violations-brightgreen)](#accessibility) [![contrast](https://img.shields.io/badge/contrast-WCAG%20AAA%20verified-blue)](#design-tokens) [![ci](https://img.shields.io/badge/CI-typecheck%20%C2%B7%20tests%20%C2%B7%20registry%20%C2%B7%20pack-blueviolet)](.github/workflows/ci.yml) [![license](https://img.shields.io/badge/license-MIT-black)](LICENSE)

[Getting started](#getting-started) · [Components](#components) · [Theming](#theming) · [Accessibility](#accessibility) · [Releases](docs/RELEASE.md) · [Roadmap](docs/ROADMAP.md)

</div>

---

## Why UI99

Most dark-mode kits are an afterthought: gray-on-gray borders, harsh focus rings,
inaccessible ambers, and light mode that feels like a debug flag. **UI99 is the
inverse** — a design system born in *Obsidian Dark* and engineered to the
ruthless standards of Apple HIG, Material 3, and WCAG 2.2:

- **Velvet surfaces, not slabs.** Hairline borders (`rgba(255,255,255,0.025)`),
  sub-pixel specular rim lighting, deep diffused shadows — glass that melts into
  the canvas instead of sitting on it.
- **A real focus system.** Double-ring `focus-ui99` (2px ring + 2px canvas gap)
  implementing WCAG 2.4.11/2.4.13 Focus Appearance — consistent across every
  interactive primitive, with an inset variant for nested pills and rows.
- **Material 3 state layers as tokens.** `bg-state-hover/press/selected/drag`
  — calibrated per theme (6%/4%/8%/16% white in dark, 4%/3%/6%/10% black in light).
- **Color psychology with receipts.** Every accent has a *role* and a *rationale*
  — and passes a CI contrast gate (`22 token pairs ≥ 4.5:1/3:1`, AAA text 16:1+).
- **Copy-anywhere primitives.** Zero app-context dependencies: theme is observed
  from the DOM, so a component pasted into any React app just works.

## Getting started

```bash
bun add @99/ui
```

```tsx
import { Button, Switch, SegmentedControl } from '@99/ui';
import '@99/ui/styles.css'; // tokens — or '@99/ui/dark.css' for a no-JS default theme
```

### Structural tokens — the part that makes it a *system*

A design system is not a palette. It is the set of decisions made **once**.

| Layer | Scale |
|-------|-------|
| Elevation | `--elevation-0…5` — five levels, plus six ready composites (`--shadow-card`, `--shadow-popover`, `--shadow-modal`, …) |
| Rim | `--rim-subtle / soft / strong / crisp` — the 1px specular edge that separates glass from canvas |
| Glow | `--glow-{accent,rose,warning,danger,focus,current}-{sm,md,lg}` — accent aura, deliberately **three** levels |
| Radius | 9-step concentric scale (`--radius-xs…2xl`, `--radius-sheet`, `--radius-pill`) |
| Spacing | 4px grid + intent aliases (`--space-cluster`, `--space-gutter`, `--space-section`) |
| Blur | `--blur-sm/md/lg/ambient` |
| Z-index | every layer named (`--z-dock`, `--z-modal`, `--z-toast`, …) |

Dark and light are calibrated separately: dark is rim-led with deep diffuse
shadows (a shadow is nearly invisible on near-black), light is short and
**ink-tinted** rather than neutral grey.

**This is enforced, not documented-and-hoped-for.** `tokens:gate` fails CI on a
hardcoded hex, an arbitrary `shadow-[…]` / `rounded-[Npx]` / `blur-[Npx]`, or a
reference to a token that was never declared. The audit that motivated it found
266 hand-written values across 65 files — now zero.

Theme protocol — toggle a class on `<html>` (default: dark):

```ts
document.documentElement.classList.replace('dark', 'light');
```

> Prefer owning the source, shadcn-style? The registry + CLI ship inside the
> package:
>
> ```bash
> npx @99/ui init            # components.json
> npx @99/ui add button card # copy the source, you own the code
> ```
>
> The npm package is built from this repo with `bun run lib:build`
> (ESM + CJS + TypeScript declarations + three stylesheets + CLI + registry).

## Components

**94 components** in the npm kit (97 registry items including `utils`, `theme` + both token themes). The count is generated — `KIT_COMPONENT_COUNT` in `src/generated/kit-count.ts` — and can never drift from the registry.

**Actions** Button · IconButton · Tag · Avatar · Toggle · ToggleGroup · CopyButton
**Inputs** Input · Textarea · SearchBar · Switch · Checkbox · RadioGroup · Dropdown · Slider · Pin/OTPInput · Rating · NumberField · DatePicker · TimePicker · Combobox · FileUpload
**Forms** Label · Field/Hint/Error
**Navigation** SegmentedControl · Breadcrumb · Tabs · Accordion · Pagination · Menubar · NavigationMenu · Sidebar · CommandBar
**Data** Badge · PriorityBadge · StatusBadge · Kbd · Progress · Skeleton · Table · Sparkline · DonutRing · HeatMapCalendar · StatTile · MeterBar · TrendDelta · Timeline · Stepper
**Overlays** Dialog · AlertDialog · Modal · Sheet · Popover · DropdownMenu · Command · Tooltip · HoverCard
**Layout** Separator · ScrollArea · AspectRatio · Card/Surface · Collapsible
**Feedback** EmptyState · LoadingState · Alert
**Display** AvatarStack · CodeBlock · Carousel · Swatch
**Brand** UI99Wordmark

Every primitive ships with the five-state contract
(`default / hover / press / focus-visible / disabled`), keyboard support, and the
`focus-ui99` ring. The full audit matrix lives in
[`docs/ROADMAP.md` §1.1](docs/ROADMAP.md).

## Theming

Tokens are plain CSS custom properties — no runtime, no JS branching:

| Layer | Where |
|---|---|
| Source of truth | `src/styles/ui99.css` (scoped `.dark` / `.light`) |
| State layers & focus | `--state-*`, `--focus-ring` |
| Motion | `--duration-*` (75–400ms, HIG band), `--ease-ui99` |
| Surfaces | `--bg-canvas/surface/card/elevated` |

Import `@99/ui/styles.css` and drive everything with two classes.

## Accessibility

- **axe-core CI gate** — every audited primitive renders with **zero violations**
- **Contrast gate** — computed with the same math the tokens use
  (`src/core/tokens/math.ts`); light-mode `amber` was demoted `600 → 700` by this gate
- **Keyboard parity** — radiogroup roving tabindex, RTL-aware arrows,
  listbox/combobox patterns, Esc dismissal, pause-on-hover toasts (WCAG 2.2.1)
- **Touch targets ≥ 44px** (Apple HIG) with hit-area proxies for dense UI

## Development

```bash
bun install
bun run dev              # product app + living component showcase
bun run test             # vitest + axe + contrast gates
bun run lint             # typecheck
bun run lib:build        # npm kit → dist-kit/ (ESM/CJS/d.ts/CSS/CLI/registry)
bun run registry:build   # regenerate public/registry.json from source
bun run tokens:gate      # CI: no hardcoded hex / arbitrary elevation / undeclared token
```

## License

[MIT](LICENSE)
