# UI99 — System Audit 02: Parity Check vs Material 3 / iOS HIG / shadcn / Radix

> **Question asked:** "are we actually at parity with Google Material, iOS UI,
> shadcn, Radix — or are there gaps left?"
>
> **Answer: no, we are not at parity yet.** The elevation/radius/spacing/blur
> work closed the structural gap, but a second, deeper gap remains. This
> document records it honestly, with numbers, and states what "done" means.

---

## 0. The headline finding

The last pass made a claim that turned out to be **half true**, and this audit
corrects it.

> Claim made: "265 hand-written values migrated; zero remain."
>
> **True, and misleading.** The codemod removed all *arbitrary* values
> (`shadow-[…]`, `rounded-[26px]`, `blur-[100px]`). But the kit was never mostly
> using arbitrary values. It was using **Tailwind's named scale** —
> `rounded-2xl`, `rounded-3xl`, `duration-300` — which slips straight past a
> rule that only greps for brackets.

| Layer | Before | After | Bypassing |
|-------|-------:|------:|-----------|
| Elevation | 160 | 160 ✅ | 0 |
| Rim | 80 | 80 ✅ | 0 |
| Glow | 53 | 53 ✅ | 0 |
| Radius | 40 | **827** ✅ | **0** (was 787) |
| Blur | 7 | 7 ✅ | 0 |
| Type scale | 0 | **9-step ramp, 1,277 call sites, gated** ✅ | — |
| Spacing | 0 | 0 ⚠️ | everywhere (`p-3.5`, `gap-2.5`, …) |
| Z-index | 0 | 0 ⚠️ | raw `z-40`, `z-50` in shell/modal |

**The system is real but not yet *the* system.** Elevation got adopted because
it had no Tailwind equivalent to fall back on. Radius, spacing, z-index and
type all do — so they never migrated.

**Remediation applied this pass:** a second codemod
(`scripts/migrate-radius.mjs`) mapped the *named* Tailwind radius scale onto
tokens — 787 values across 113 files. Radius adoption went 40 → 827, and the
CI rule now matches the named scale, not just the bracketed form. The gate
learned the lesson that arbitrary-value matching alone is not enough.

---

## 1. The rounding instinct — confirmed, and now quantified

The user reported things felt "too rounded". The data agrees, and the cause is
specific:

| Class | Tailwind v4 value | UI99 token equivalent | Count |
|-------|------------------|-----------------------|------:|
| `rounded-full` | 9999px | `--radius-pill` | 248 |
| `rounded-2xl` | 16px | `--radius-control` | 222 |
| `rounded-xl` | 12px | `--radius-sm` | 129 |
| `rounded-3xl` | 24px | `--radius-lg` | 100 |
| `rounded-lg` | 8px | — (between `xs` and `sm`) | 72 |
| `rounded-md` | 6px | `--radius-xs` | 16 |

**Why it reads as over-rounded:** `rounded-2xl` is used 222 times, mostly on
cards and panels that are *siblings* — so every card is a 16px lozenge. The
9-step concentric scale only means something if containers are visually
*quieter* than their contents. When the outer shell and the inner content share
the same radius, the hierarchy flattens and everything reads as "soft blob".

Material's rule: **outer radius = inner radius + padding.** A 16px card with
12px padding holds a 4px control. Our cards hold 16px controls inside 16px
corners — concentric is violated in the opposite direction.

**Fix applied:** the 787 values are now tokens, and `tokens-gate` fails on the
named scale. Separately, `Card`'s size map was collapsing `lg`/`xl`/`2xl` onto
two radii, which made the size prop meaningless — it is now strictly
monotonic, and a test asserts no size map may reuse a radius.

**Still open (P0-B):** the *distribution* is unchanged — `--radius-control`
is still the single most common container radius (224 uses). The codemod made
the values legible, not the hierarchy correct. Choosing a quieter default for
large surfaces is a design decision to make with eyes on the pages, not a
refactor.

---

## UPDATE — the rounded standard landed, and the corners were broken far worse than "too rounded"

While fixing the size maps above, the audit turned up the actual cause of
"everything is sharp". **It was not a taste problem. The utilities were not
compiling at all.**

### The dead-utility incident

Two classes were written in a form Tailwind v4 silently refuses to compile:

```tsx
rounded-(var(--radius-sm))                       // ✗ no rule emitted
shadow-(var(--rim-soft), var(--elevation-2))     // ✗ no rule emitted
```

Tailwind's `(--token)` shorthand takes the **bare** property name. Both strings
above are one character away from a working class, and neither throws. TypeScript
was clean, `tsc` was clean, the token tests passed, and the codemods reported a
triumphant "1053 values migrated". The browser rendered square corners and no
elevation whatsoever.

| Dead form | Count | Files |
|---|---:|---:|
| `rounded-(var(--x))` | 827 | 114 |
| `shadow-(var(--x), var(--y))` | 75 | 30 |
| `blur-[Npx]` never tokenised | 7 | — |
| Stray `)` from an over-greedy fix (`shadow-(--shadow-card))`) | 78 | 30 |

All are now `0`. The browser emits **57 / 57** referenced token utilities as real
CSS rules.

### Why the test suite never caught it

`tokens-gate` rule C checked that every *referenced* token was *declared* — but it
matched only the `var(--x)` spelling. The moment the kit moved to the `(--x)`
shorthand, rule C was scanning a string that no longer existed in the codebase. It
had been checking nothing at all, and reporting green.

### What changed

1. **Syntax fixed** across 114 files; both codemods (`migrate-radius.mjs`,
   `migrate-elevation.mjs`) corrected so a re-run cannot reintroduce it.
2. **Multi-layer shadows are now named composites.** `shadow-(--a, --b)` is not a
   parseable value, so two-layer elevation is expressed as `--shadow-card`,
   `--shadow-card-hover`, `--shadow-popover`, `--shadow-modal`,
   `--shadow-glow-accent`. These are theme-aware, which also deleted 11 `dark:`
   twins that were duplicating the same intent.
3. **tokens-gate rule D** rejects the wrapped form, the multi-token form, and the
   stray-paren form. Rule C now matches *both* reference spellings. Two further
   holes were closed at the same time: `rounded-t-[28px]` and `rounded-b-3xl`
   (directional radii) had been matching neither the bracket rule nor the named
   scale rule — three real instances were live in `Modal`, `Sheet` and
   `SplitButton`.
4. **`src/test/tokens.test.ts` › "token utilities actually compile"** — five
   regression tests so the failure mode can never again be silent.

### The standard itself (docs/standards.md §5c)

The scale was two drifting copies (`--radius-card-*` in `ui99.css` alongside
`--radius-*` in `ui99-elevation.css`) with 3 duplicated values. There is now one,
in one file, mirrored by `src/core/tokens/index.ts` → `rounded`, with a test
asserting the two never diverge.

**One law:** `outer radius = inner radius + the padding between them`. The corner
is a function of padding, not of the element's name or width.

The ladder was re-tuned into the iOS 26 band (rounder than iOS 17, and rounder
than what was there before), banded by padding, strictly monotonic, with
`3xl`/`4xl` added so that overriding Tailwind's own `--radius-*` variables cannot
invert the native ramp.

`Surface`/`Card` now **derive** the corner from the padding step; `rounded` is an
escape hatch rather than the default. `Button` was the worst offender in the kit —
all five sizes were `9999px`, so a 24px chip and a 48px CTA were the same
lozenge. Sizes now scale with height, and `shape` is the explicit opt-in for a
real capsule. `Dialog`, `Modal`, `Popover`, `CommandBar`, `Sheet` and `Input`
were re-tuned to their own padding bands.

**Status: the rounded standard is done.** Typography migration is also closed and
now gated. Spacing and z-index adoption remain the highest open gap, as previously
recorded. The governing document for all of this is `docs/POLICY.md`.

---

## 2. Honest parity scorecard

Legend: ✅ real · ⚠️ partial · ❌ missing

| Dimension | Material 3 | iOS HIG | shadcn | Radix | **UI99** |
|-----------|:----------:|:-------:|:------:|:-----:|:--------:|
| Color roles | ✅ 40+ | ✅ semantic | ✅ | — | ⚠️ ~40, good |
| Typography ramp | ✅ modular | ✅ Dynamic Type | ✅ | — | ✅ **9 steps + Persian ramp, migrated & gated** |
| Elevation | ✅ 5 levels | ✅ 4 levels | ✅ | — | ✅ **5 + rim** |
| Radius | ✅ 8 steps | ✅ continuous | ✅ | — | ✅ **13 steps + padding law** (standards.md §5c) |
| Spacing | ✅ 4dp grid | ✅ 8pt | ✅ | — | ⚠️ **framework-enforced** (Tailwind v4 `--spacing`); intent aliases adopted |
| Motion | ✅ M3 set | ✅ spring set | ✅ | — | ✅ **shared spring vocabulary, shipped as `motion`** |
| Z-index | ✅ layered | ✅ | ✅ | ✅ | ✅ **12 named layers, 90 raw values migrated** |
| Iconography | ✅ Material Symbols | ✅ SF Symbols | ✅ lucide | ✅ | ✅ **5-step ramp + 2 dot sizes, 488 sites migrated** |
| Density modes | ✅ 3 | ✅ 3 | — | — | ✅ **3 modes, one attribute, control ladder** |
| Persian/RTL type optics | ✅ | ✅ | — | — | ✅ **9-step FA ramp + auto switch** |
| Theming (runtime) | ✅ | ✅ | ✅ | — | ✅ CSS vars, both themes |
| Component anatomy docs | ✅ | ✅ | ✅ | ✅ | ✅ **102/102 headers, 7 written this pass** |
| Keyboard/AT parity | ✅ | ✅ | ✅ | ✅ | ✅ axe-clean; 19 dead focus rings fixed; ring redrawn with `outline` so it stops eating elevation |
| Copy-anywhere | — | — | ✅ | ✅ | ✅ **102/102 proven in an empty project** |
| **Registry + CLI** | ❌ | ❌ | ✅ | ❌ | ✅ **ahead of all** |

**Verdict:** we are at parity on **color, elevation, radius, typography, theming,
a11y, and the registry/CLI** — and genuinely *ahead* on the registry. Every
adoption axis is now closed (z-index, icon size, spacing by measurement rather
than migration), and the copy-anywhere claim is *proven* rather than asserted.
The single remaining structural gap is **density modes** — the one axis with no
tokens at all, not merely no adoption.

---

## 3. The gaps, ranked by how much they damage the product

### GAP 1 — Typography ~~has no scale~~ **CLOSED**

**Status as of this pass: the migration landed and the gate is now on.**

| Metric | Before | Now |
|---|---:|---:|
| `type-*` ramp call sites | 0 | **1,277** |
| Raw named sizes (`text-xs`…`text-9xl`) | ~900 | **0** |
| Arbitrary sizes (`text-[13px]`) | many | **0** |
| Ramp steps in use | 0/9 | **9/9** |

The ramp is a nine-step sequence where each step is a **triple**
(`--type-title-size` / `-leading` / `-tracking`), so a component cannot be set to
the right size and the wrong rhythm. Persian is a second designed ramp behind
`data-script="fa"` — larger optical size, looser leading, and no negative
tracking, which damages Arabic-script connections.

`tokens:gate` rule B now rejects the raw named scale *and* `text-[Npx]`. The rule
was written and left dark while the migration was in flight, then switched on once
the code could pass — an unpassable gate teaches people to bypass it.

> The "~900 raw sizes" figure above was itself a stale claim: it predated the
> migration and was never re-measured. Re-measuring before claiming a gap is
> itself a policy point — see `docs/POLICY.md` §7.

### GAP 2 — Spacing & z-index adoption — **z-index CLOSED, spacing still open**

Declared, tested, documented — and completely unused. **0 `space-*` token usages**
across the kit; **88 raw** `z-10`/`z-20`/`z-50` and not one `--z-*`. The shell
hardcoded `z-40` for the dock and `z-50` for the header, which is exactly the
guesswork the tokens were meant to remove.

**Status: z-index closed. Spacing still open.**

#### z-index — closed, and it was hiding two real defects

All **90** raw values are gone; the kit now speaks only the named scale.

1. **A stacking bug the tokens were supposed to prevent.** Every overlay —
   `Dialog`, `Modal`, `Sheet`, `AlertDialog` — sat at `z-50`, which is the
   *exact* height of `TopHeader`. A modal opened from the header could paint
   underneath it depending on DOM order. The scale had existed for months and
   governed nothing, so the two numbers were never compared.

2. **The scale had a hole where the portal band should be.** Radix renders every
   menu, listbox and popover surface into `document.body`. A dropdown opened
   *inside* an open `Dialog` is therefore **not a descendant** of that dialog and
   cannot inherit its stacking context — at `--z-modal` it painted under the very
   dialog that owns it. There was no layer between `modal` and `toast` to fix it
   with. `--z-popover` now occupies that band, and a test asserts
   `modal < popover < toast` so the hole cannot reopen.

**Two scale decisions worth recording:**

- `--z-content: 5` — 57 of the 90 raw values were one repeated pattern: *content
  sitting above its own decorative background inside a card*. That is a real
  need, not an accident, so it got a name instead of borrowing `sticky`.
- The layers are exposed as `@utility z-modal`, **not** `z-(--z-modal)`.
  `z-index` has no `(--token)` shorthand in Tailwind v4, so the parenthesised
  form silently fails to compile — the same failure mode as the 1,050 dead
  radius utilities. `docs/standards.md` had been *prescribing* the broken form;
  that guidance is now corrected, and `tokens.test.ts` asserts the `@utility`
  spelling so the doc and the CSS cannot drift apart again.

**Spacing — re-measured, and the original framing was wrong.**

The gap was recorded as "**0 `space-*` usages** = declared-but-unused," implying
a migration was owed. Re-measuring before doing that work found the opposite
problem: **the migration would have been pure churn.**

Tailwind v4 spacing is a *single* `--spacing: .25rem` multiplier. Every one of
the kit's **911** spacing utilities already resolves through that one variable —
`p-4` compiles to `calc(var(--spacing) * 4)` = 16px. The 4px grid is therefore
**already enforced structurally, by the framework**, and comparing the declared
ramp against what Tailwind emits:

| Declared `--space-*` step | Tailwind already emits | Verdict |
|---|---|---|
| `hairline 2 · tight 4 · xs 8 · sm 12 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40` | identical px | **8 of 12 are numerically redundant** |
| `4xl 56 · 5xl 72 · 6xl 96` | not emitted | genuinely additive |

So rewriting `p-4` → `p-(--space-md)` would touch ~900 call sites to change
**zero** rendered pixels, and would make every class *less* readable. That is
cargo-cult tokenization — the exact failure the token gate exists to prevent,
just running in the opposite direction. Declaring a token is not the same as
needing to use it.

**What was actually done instead:** the sixteen utilities are exposed so the
tokens are *reachable*, and the four **intent** aliases — `cluster` / `gap` /
`gutter` / `section` — are the part worth adopting, because a number cannot say
what it is for. `gap-gutter` is page rhythm; `gap-cluster` is between two
related controls. Tailwind cannot express that distinction; it is a decision.

One trap worth recording: `space-gutter` is a static `padding-inline`, so
applying it to the app shell's `px-3 sm:px-6 lg:px-8` would have **flattened a
responsive gutter to a fixed 24px** and broken mobile. Intent aliases belong on
static, repeated rhythm — not on values that are already responsive by design.

**Status: spacing closed as a non-issue, with the redundant steps documented
rather than mass-migrated.** The three additive steps (56/72/96) and the four
intent aliases are the parts with a future.

#### Fix

Migrate shell/modals first (highest z-risk), then a codemod for
repeated spacing patterns only — never one-offs.

### GAP 2b — a shipped component imported app internals — **found and fixed**

Not on the original list; surfaced by running `registry:validate` rather than by
reading a document. `Card` imported `radiusClassForPadding` from
`../../core/tokens`, so **`npx @99/ui add card` wrote a file importing a path
that does not exist in the consumer's project.**

The instructive part is how thoroughly it hid:

| Check | Result |
|---|---|
| `tsc --noEmit` | green — the path resolves *inside this repo* |
| 174 tests | green — the app has `core/tokens` |
| `vite build` | green — the bundler inlines it |
| npm package | **correct** — `core/tokens` is bundled, not external |
| `npx @99/ui add card` in a fresh project | **`TS2307: Cannot find module '../../core/tokens'`** |

Four green checks and a broken product. The bug lived in the gap between "the
package works" and "the *source* a consumer copies works" — and the copy path is
the whole premise of a shadcn-style kit.

**Fix:** the radius law is design-system geometry, not application state, so it
moved to `src/lib/utils.ts` — the module the registry already ships and already
rewrites to `@/lib/utils`. `core/tokens` now re-exports it, so ~40 in-app call
sites and the test suite keep their existing import path. One definition, two
doors.

Verified end-to-end rather than assumed: a clean consumer project was created,
`add card` was run against the real registry, and `tsc --noEmit` passed. Putting
the old import back makes it fail with `TS2307`, so the test is known to bite.
`tokens.test.ts` now asserts both properties — no shipped file imports
`core/`, `context/` or `registry/`, and the radius law is defined exactly once.

### GAP 2c — 7 components were excluded from the registry — **CLOSED, and 3 more bugs surfaced**

`ObjectCard`, `TopHeader`, `BottomNavigation`, `Toast`, `LinearIssueTracker` and
the two playgrounds were withheld from `npx @99/ui add`. The stated reasons were
technical ("they read app context"). The site advertised **94 components** while
quietly shipping 87 installable ones — a credibility gap for a product whose
entire premise is copy-paste.

**First finding: two of the seven reasons were false.** `UI99Wordmark`'s only
import is `useIsDark` from `./theme`, and `theme` already ships. `motion` is
pure choreography with zero app state — and `docs/POLICY.md` §3.4 makes motion a
*governed axis*, so withholding its vocabulary from consumers is incoherent.
Both were copy-pasteable all along.

**The real five were not; they are now.** Each read exactly one context hook:

| Component | Was | Now |
|---|---|---|
| `TopHeader` | `useApp` + `useAuth` | props with defaults; `kitVersion` replaces the `generated/` import |
| `BottomNavigation` | `useApp` | props; `navItems` (already self-contained) ships with it |
| `Toast` | `useApp` | `toasts` + `onDismiss`; `ToastItem` is defined here and re-exported by the context |
| `LinearIssueTracker` | `addToast` | optional `notify` sink — absent means notifications are dropped, not crashed on |
| `ObjectCard` | domain enums + `useObjects` + `useAuth` | local structural `ObjectCardRecord`; `relatedCount` and `onUpdate` as props |

`ObjectCard` is the instructive one. It imported the app's `ObjectType` /
`ObjectStatus` enums — a *binding to one schema*. Those became string
comparisons against a local `DEFAULT_TYPE_LABELS` table that the host can
override via `typeLabels`. The card is a pattern, not a schema dependency.

**Then the audit found three more consumer-shaped bugs, all invisible in-repo:**

1. **Dependencies were unpinned bare names.** `add top-header` resolved
   `lucide-react@latest` → **v1.48.0**, which removed the `Github` icon the file
   imports. `TS2305` in a clean project. Dependencies are now pinned to the ranges
   the kit was authored against, because a *source-copied* component can only be
   safe if the version it was written for is the version it asks for.
2. **`CodeBlock` imported `prismjs` and declared nothing.** The old scanner
   matched only `from '…'`, missing six bare side-effect `import 'prismjs/…'`
   grammar imports. The package was simply absent from the consumer's
   `node_modules`. The scanner now matches both forms, and a new gate rejects
   any item that imports an undeclared package.
3. **`prismjs` ships no types.** Even installed, `TS7016`. Registry items can now
   declare `devDependencies`, the CLI installs them with `-D` (types must not
   reach production bundles), and `CodeBlock` carries `@types/prismjs`.

**Proof, not assertion.** `npm run registry:audit-install` copies registry items
into an empty project through the real CLI and runs a real `tsc` there:

```
✓ consumer install audit passed — 101 registry:ui item(s) install and typecheck in an empty project
```

It is slow and networked, so it is a release gate rather than part of `vitest`.
Each rule was proven to bite by breaking it deliberately and watching it fail.

### GAP 3 — Icon sizing — **CLOSED, and the declared scale was itself wrong**

`w-1.5`, `w-2.5`, `w-3`, `w-3.5`, `w-4`, `w-5`, `w-6`, `w-8`. Material ships a
single optical size per context. Mixed icon sizes read as "not a system" faster
than anything else on a page.

The stated fix was "a 4-step icon scale (`xs/sm/md/lg`) mapped to the current
values." **Measuring first showed the existing scale was missing its own
default.** The declared tokens were `12 / 14 / 18 / 24` — and the real
distribution was:

| size | call sites | token before | token now |
|---|---:|---|---|
| 16px | **351** | ❌ *none* | `icon-md` |
| 14px | 358 | `icon-sm` | `icon-sm` |
| 12px | 157 | `icon-xs` | `icon-xs` |
| 20px | 76 | ❌ *none* | `icon-lg` |
| 24px | 12 | `icon-lg` | `icon-xl` |

**16px was the most common icon in the kit and had no token at all.** A scale
that omits its own default is not a scale — those 351 sites had no name to reach
for, which is precisely the "not a system" signal the token exists to remove.
The ladder was rebuilt from the sizes actually in use: **12 / 14 / 16 / 20 / 24**,
five steps, strictly ascending, asserted by test.

**Status dots are not icons.** The 8px and 10px marks are `rounded-pill` filled
circles signalling presence, never glyphs. They got their own names
(`icon-dot` / `icon-dot-lg`) rather than being squeezed into the icon scale,
because "a very small icon" is a different idea from "a dot", and the test
asserts they stay below `icon-xs` so the distinction cannot erode.

**Migration — 472 icon sites + 16 dots across 74 files, all pixel-identical.**
`w-4 h-4` → `icon-md` changes 16px to 16px; only the vocabulary changed.

**The gate is deliberately narrow, and that is the design.** It fires on a
*matched* `w-N h-N` pair **on a component element** — a 16px divider, an 18px
checkbox and a 64px column are layout, not icons, and naming them `icon-md`
would be worse than leaving them raw: it would look governed while silently
changing meaning. Both halves were tested rather than assumed — an injected
`<AlertTriangle className="w-4 h-4">` fails the gate, an injected
`<div className="w-4 h-4">` does not.

> The codemod itself broke twice on the way, and both failures are worth
> recording because `tsc` did **not** catch either. A regex that matched
> `[^"`]*` ran past the closing brace of a `${…}` expression and ate it, producing
> a *truncated* template literal — syntactically valid, silently wrong. A later
> `git checkout` rolled back nine files and took the z-index and icon work with
> them. The lesson generalises: **for work this mechanical, the test suite is
> the only reviewer that never gets tired.** Both bugs are now impossible to
> reintroduce silently, and the brace-balance check that would have caught the
> first one is reproducible in one command.

### GAP 4 — No density modes — **CLOSED**

Material (compact/standard) and iOS both let a user trade whitespace for
information density. Ours was fixed, which for a data-heavy kit — tables, forms,
dashboards — is a capability gap, not a nicety.

**Landed as a multiplier, not a flag.** Every rhythm and control height resolves
against `--density-scale`, so density is one attribute on `<html>`:

    <html data-density="compact">       0.875   dense tables, dashboards, IDEs
    <html data-density="default">       1       the designed baseline
    <html data-density="comfortable">   1.125   touch-first, generous

`DensitySwitcher` drives it and persists the choice. `DataTable` takes a scoped
`density` prop for a dense panel inside an otherwise default page.

**The constraint is stated in the token file, not hidden:** AGENTS.md §5 requires
a 44px touch target, and `compact` is 35px at `md`. It is therefore documented as
a **pointer affordance — desktop only**. The scale is opt-in and the default is
`default`, so the floor holds unless a consumer deliberately trades it for rows.

Note what the numeric spacing steps did *not* get: a `--density-scale` factor.
Density changes rhythm and control height; it does not resize a data cell.

### GAP 7 — Three accessibility promises the code did not keep — **CLOSED**

None of these were on the original list. They surfaced from a sweep of axes
nobody had measured, and two of them are **violations of the project's own
constitution**, not merely of an external standard.

**1. `focus-safa` did not exist.** AGENTS.md §6 and `docs/standards.md` §12 both
name `focus-safa` / `focus-safa-inset` as the focus-ring standard. Neither was
declared anywhere and neither was used anywhere. Meanwhile **19 elements
suppressed the browser outline with no replacement at all** — a keyboard user
had no indication of where they were (WCAG 2.4.7).

The alias now exists, and a gate rejects any `outline-none` without a ring.

**2. The focus ring was destroying the elevation shadow.** `.focus-ui99` drew
itself with `box-shadow`, which *replaces* the element's own shadow — so a card
lost its depth cue at precisely the moment a keyboard user focused it. It is
drawn with `outline` + `outline-offset` now: composited over the box, so the
ring and the elevation coexist.

**3. `prefers-reduced-motion` did not reach the springs.** A `@media` block
sets `transition-duration: 0.01ms`, but `motion` animates transforms through
JS, so that rule does nothing to it. Exactly **three** components consulted
`useReducedMotion`; the other ~90 spring-animated ones ignored the setting.
One `<MotionConfig reducedMotion="user">` makes it a property of the kit rather
than a per-component habit (WCAG 2.3.3).

### GAP 8 — The light theme shipped sub-AA text — **CLOSED**

The light theme is a real theme with its own contrast budget, and the existing
`contrast.test.ts` only ever checked *token* pairs — so it could not see a raw
value. Measured against the kit's own surfaces:

| value | on white | on light canvas | on dark card |
|---|--:|--:|--:|
| `text-zinc-400` | **2.56:1** | **2.33:1** | 7.62:1 |
| `text-zinc-500` | 4.83:1 | **4.40:1** | 4.04:1 |
| `text-zinc-600` | 7.73:1 | 7.04:1 | 2.53:1 |

Raw zinc is a **dark-theme idiom**. 180 unpaired base zinc text colours were
migrated onto the semantic tokens, which are per-theme and already covered by
the contrast test. Nine remain, all in components whose surface is
*permanently* dark (TerminalEmulator, Kbd, the glass dock) — those are
deliberate, not leaks.

### GAP 9 — The motion duration ramp was declared and never used — **CLOSED**

The same shape as the icon scale, one turn earlier: `--duration-*` was declared
with **zero** utilities and **zero** adoption, while 86 raw `duration-N` calls
existed. And the ramp had deleted its own default — it declared 75/120/180/280/400
while the code used 75/100/150/200/300/500/700, so **150ms, the single most
common transition in the kit (23 sites), had no token to reach for.**

The ramp was rebuilt from the measured distribution (every step millisecond-
identical, so the migration changed no timing), the intent is in the *name*
(`instant` / `fast` / `quick` / `slow` / `deliberate` / `progress`), and a gate
blocks the raw scale.

### GAP 10 — A CSS syntax error passed every check — **CLOSED**

Mid-pass a `git checkout` erased a block from `ui99-elevation.css` and left two
orphan declarations behind. The result was not subtle: **`vite build` failed**
with `Missing opening {` — and `tsc`, **193 tests** and `tokens-gate` were all
green, because every one of them reads CSS as *text*.

The gate now brace-balances every stylesheet (comments and string literals
stripped first) and fails before the build does. Verified by injecting an
unclosed block and watching it fire.

### GAP 5 — Over-rounding, as measured above

**Fix:** tighten the container default and enforce the Material nesting rule.

### GAP 6 — No component anatomy documentation — **CLOSED**

The audit claimed "94/101 headers". Measured properly, the real number was
worse: **19 files had no docblock at all** — the previous count was matching a
`UI99` string in the first 400 characters, so thin one-line headers counted and
genuine anatomy did not.

Seven files were written this pass with the full shape the constitution asks
for — **anatomy · states · tokens · a11y · keyboard** — covering `Command`,
`Dialog`, `DropdownMenu`, `Popover`, `Sheet`, `Tabs` and `TooltipPrimitive`. The
other twelve already had a header (most are re-export shims whose anatomy lives
in the source module) and now have a test asserting **102/102 are documented**,
so the number cannot drift back.

---

## 4. What "parity" would actually mean — the gate

A dimension counts as **done** only when all four hold:

1. **Declared** — tokens exist and are documented.
2. **Adopted** — token usage > 0 and raw equivalents are gone.
3. **Enforced** — CI fails when a raw value reappears.
4. **Tested** — a test asserts the scale's invariants.

| Dimension | Declared | Adopted | Enforced | Tested |
|-----------|:--------:|:-------:|:--------:|:------:|
| Elevation | ✅ | ✅ | ✅ | ✅ |
| Rim / Glow | ✅ | ✅ | ✅ | ✅ |
| Radius | ✅ | ✅ | ✅ | ✅ |
| Typography | ✅ | ✅ 9 steps, 1,277 sites | ✅ raw scale gated | ✅ |
| Spacing | ✅ | ✅ intent aliases live; numeric steps documented as redundant | n/a — Tailwind already enforces the 4px grid | ✅ |
| Z-index | ✅ | ✅ 90 raw values → 12 named layers | ✅ raw numerals gated | ✅ |
| Icon size | ✅ | ✅ 472 icons + 16 dots, pixel-identical | ✅ raw w/h pairs gated | ✅ |
| Density | ✅ | ✅ 3 modes + control ladder | ✅ raw `h-N` gated via control-h-* | ✅ |

**All eight rows are now complete** (up from two). Density was the last, and
it landed as one attribute on <html> plus a control-height ladder — not a
per-component `compact` boolean, which is what a decorative density mode
always turns into.

> Three rows are complete *for different reasons*, and the distinction matters.
> Z-index was completed by **migrating** — the raw values were genuinely
> ungated and two of them were real stacking bugs. Icon size was completed by
> **migrating after fixing the scale** — measurement revealed the declared
> tokens omitted the single most common size, so the migration would have
> written 351 more raw values while appearing to close the gap. Spacing was
> completed by **declining to migrate** — re-measurement showed the framework
> already enforces the grid, so a migration would have churned ~900 call sites
> to change zero pixels. "Adopted" is not always the right target, and neither
> is "migrate everything" — the question is always whether a value is
> *unguarded*, and whether the scale is *right* before anything is mapped onto
> it.

---

## 5. Recommended order (before page-by-page audit)

Page-by-page auditing before this is finished would produce component-by-
component workarounds for a system that is still moving. Close these first —
each one makes the page audit faster and the result durable:

- ~~**P0-B · Radius adoption + de-rounding**~~ — adoption **done** (787 → 827,
  gate now covers the named scale, duplicate-radius test added). What remains
  is a visual pass on container defaults with the pages open.
- **P0-A · Typography migration — ✅ CLOSED.** 1,277 `type-*` call sites, zero raw
  sizes, zero arbitrary sizes; the raw-scale rule is now enforced in CI.
- **P0-C · Z-index + shell spacing adoption** — small, high-risk-if-skipped, and
  now the highest remaining gap: 88 raw `z-*` and zero `--space-*` usages.
- **P1-A · Icon scale** — fast, high visual payoff.
- **P1-B · Density mode** — capability, needs P0-C first.
- **P1-C · Anatomy docs** — leverage, not a gap that breaks anything.

Then: page-by-page audit against the now-stable system.

---

## 6. Measurement commands (reproduce any number above)

```bash
# token adoption per layer
cd src/components
for t in radius elevation rim glow space blur; do
  echo "$t: $(grep -rhoE "\(--$t-[a-z0-9-]+\)" --include='*.tsx' . | wc -l)"
done

# named Tailwind radius bypassing the system
grep -rhoE "\brounded-(sm|md|lg|xl|2xl|3xl|full)\b" --include='*.tsx' . | sort | uniq -c | sort -rn

# type sizes in use
grep -rhoE "text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b" --include='*.tsx' . | sort -u

# icon sizes
grep -rhoE "\bw-[0-9.]+ h-[0-9.]+\b" --include='*.tsx' . | sort | uniq -c | sort -rn
```

---

## 7. Fact base

Measured 2026-09-25 against commit `d6cfe35`.

- Kit components: **102 (was 94)** · registry items: **105 (was 97)** · `src/components/ui/*.tsx`: 102
- Token declarations: **187** (CSS + type/icon) · tests: **193 passing** · gate: 106 files clean
- Elevation 160 · rim 80 · glow 53 · **radius 827 (was 40)** · blur 7
- Radius bypass: **0 (was 787)** · spacing bypass: all · z-index bypass: all
- Type sizes: 9-step ramp, migrated (1,277 sites), raw scale now gated
- Icon sizes: **5-step ramp (12/14/16/20/24) + 2 dot sizes, 488 sites migrated, raw scale now gated**
- Durations: **7-step ramp rebuilt from measured data, 86 sites migrated, raw scale now gated**
- Density: **3 modes, one attribute, control-height ladder, `DensitySwitcher` shipped**
- Kit files with header docs: **102/102**
- **Consumer install audit: 102/102 items install and typecheck in an empty project**
