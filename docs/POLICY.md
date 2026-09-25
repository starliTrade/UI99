# UI99 — Design Policy

> **What this system is for, what it refuses to be, and how we know whether we kept the promise.**
>
> `docs/standards.md` is the *mechanics* — the numbers, the checklist, the audit.
> This document is the *policy*: the commitments those numbers serve, and the
> line we refuse to cross. Read this before changing a number; read `standards.md`
> before shipping a component.

---

## 0. The one commitment

**A design system is a set of decisions made once, enforced forever — not a set of
good defaults.**

Everything below is downstream of that sentence. It exists because of how this
project actually failed, and it is the single most useful thing we know.

### The failure we are writing against

An audit of the rounded corners looked, at first, like a taste problem. It was not.
The kit shipped **1,050 utility classes that Tailwind silently refused to compile**
— `rounded-(var(--radius-sm))` instead of `rounded-(--radius-sm)`, and
`shadow-(var(--rim-soft), var(--elevation-2))` instead of a named composite.

Nothing threw. TypeScript was clean. Every test passed. The token gate was green.
The codemod reported a triumphant *"1053 values migrated"*. The browser drew square
corners and no elevation at all, and the team spent a cycle debating whether 18px
felt too pointy.

The gate was green because **rule C only matched the `var(--x)` spelling** — the
moment the kit moved to the `(--x)` shorthand, the rule was scanning a string that
no longer existed in the codebase. It had been checking nothing, and saying so
loudly, for weeks.

Three lessons became policy:

1. **A decision nobody enforces is a wish.** See §7 — every clause names its gate.
2. **A gate that cannot fail is worse than no gate**, because it buys false
   confidence. A rule you cannot pass yet should not be switched on; it should be
   written down as pending and left dark.
3. **Silent failure is the only unforgivable sin.** Loud failure is a Tuesday.

---

## 1. Position — where UI99 sits, and why

A design system without a stated position is a component list. Ours:

> **UI99 is born dark and engineered to Apple's restraint. It is opinionated where
> Material is systematic, and it refuses to be a theme.**

We are not trying to be a third dialect in the Material / HIG / shadcn triangle.
We take from each and are explicit about what we reject.

### What we take

| From | What | Why |
|---|---|---|
| **Apple HIG** | Restraint, 44pt targets, continuous corners, motion that explains | Restraint is the part of Apple that survives translation to the web. The rest is iOS. |
| **Material 3** | Shape scale, state layers, elevation as a 5-step ramp, the concentric rule | The most rigorous *system* of visual decisions ever published. We implement its logic, not its surface. |
| **WCAG 2.2** | Non-negotiable. AA floor, AAA on sensitive surfaces | A kit that is beautiful and unreachable is a brochure. |
| **shadcn** | Copy-anywhere DX, tokens-as-source, CLI, registry | The distribution model is the innovation. Owning the source *is* the product. |
| **Radix** | Unstyled, accessible primitives underneath | Correctness we should not re-derive. |

### What we reject — and this is the part that matters

| We reject | Because |
|---|---|
| **"Dark mode = inverted light mode"** | Most kits bolt dark on afterwards and it shows: gray-on-gray borders, harsh focus rings, inaccessible ambers, a light mode that feels like a debug flag. We calibrate both themes independently. |
| **Theming as a runtime value** | A theme that accepts arbitrary hexes has no quality floor. Ours accepts a *documented token set* or nothing. |
| **A scale without a law** | 13 radius steps with no rule for choosing between them is 13 arbitrary decisions, not a system. Every scale here is derived from something. |
| **Component APIs that guess** | If a prop's meaning is "whatever looks right here", it is not an API, it is a leak. Escape hatches must be named and justified. |
| **Decoration that carries no meaning** | Glow, elevation and motion each have a job. If you cannot name the job, it is noise, and noise is a bug. |

---

## 2. Decision ownership — the spine of the whole system

> **A design decision lives in exactly one place: a token, a primitive, or a gate.
> If a call site can make a design decision on its own, that is a bug.**

This is the single rule that makes the rest enforceable. It has a testable
corollary, and the corollary is where the real discipline is:

### The corollary: at the call site you may only choose *from* a scale, never *within* one

| Allowed at a call site | Forbidden at a call site |
|---|---|
| `rounded-(--radius-md)` — pick a rung | `rounded-[19px]` — invent a value |
| `bg-(--bg-card)` — pick a surface | `bg-[#0C0D12]` — invent a surface |
| `text-lg` — pick a size | `text-[13.5px]` — invent a size |
| `p-4` — pick a spacing step | `p-[13px]` — invent a step |

The distinction looks pedantic and is the whole game. **Choosing a rung is a design
decision *the system already made*. Inventing a value is a design decision *you are
making*, 1,053 times, none of them compared to each other.**

That is not a metaphor. The 1,050 dead classes were 1,050 separate, uncompared,
never-validated decisions made at call sites.

### Where the exceptions live, and why they are narrow

Three escapes exist, and each one must be *named in the code*:

- **Theme authoring** — a new theme is allowed to define values. It is not allowed
  to define *decisions* ad hoc; it picks from the scales.
- **Brand surfaces** — a consumer brand may need its own accent ramp. It extends
  the accent axis; it does not redefine elevation, radius, or type.
- **Genuinely novel geometry** — a signature shape is allowed. It is a *token*, it
  is documented in `standards.md`, and it is reviewed as such.

Anything that is not one of these three is a call site making a decision, and the
gate says no.

---

## 3. The five axes

Each axis has: a governing idea, a question it answers, and what it refuses.

> **A sixth, structural axis — stacking.** It was not on this list because it
> was not real: the eight `--z-*` tokens were declared, documented and used
> **zero** times, while 90 raw numbers sat beside them. Two of those numbers
> were genuine bugs. An axis that nothing reads is not an axis, so stacking is
> recorded in §3.6 rather than promoted into the list it was absent from.

### 3.1 Colour — colour is a language, not a palette

**Governing idea:** colour carries *meaning*. If it does not mean anything, it is
decoration and it is rationed.

- **The three-colour law.** 60% velvet canvas · 30% layer surfaces · 10% accent.
  Accent is the scarcest resource in the system, which is what makes it mean
  something when it appears.
- **Intent is not decoration.** An accent colour is only ever allowed to state
  *status, selection, or brand*. It is never allowed to fill a large area for
  prettiness. If a screen needs a big coloured panel, that is a surface token, not
  an accent token.
- **Dark is rim-led; light is ink-tinted.** On near-black, a shadow is nearly
  invisible — so the *edge* (a 1px specular inset) carries the separation, and the
  shadow only does depth. In light mode a card floats on a brighter page, so the
  shadow is short and carries the ink's own hue; neutral grey reads as dirt.
- **State is a token, never a colour.** `bg-state-hover` is calibrated per theme
  (6%/4%/8%/16% white in dark, 4%/3%/6%/10% black in light). You never write
  `hover:bg-white/5`.
- **Colour is never the only signal.** Status also carries an icon or text. This
  is WCAG 1.4.1 and it is not negotiable for a system that ships a colour palette.

**Refuses:** gradients as identity, colour to imply elevation (that is what
elevation is for), and any accent that has not earned a CI contrast number.

### 3.2 Shape — the corner is a function of padding

**Governing idea:** `outer radius = inner radius + the padding between them`.

Full specification and reasoning in `standards.md` §5c. The policy-level claim is
narrower and firmer than the spec:

> **A corner is never chosen by eye, and never by element width. It is chosen by
> the padding it wraps.**

Plus a proportion cap — radius ≤ half the shorter side, except for true
pills/avatars/switches. The cap is what separates a *soft rectangle* from a
*lozenge*, and it is why a 24px chip and a 48px CTA cannot be the same shape.

**Refuses:** arbitrary radii, a radius chosen per call site, and any scale with no
rule for choosing between its rungs.

**Corollary — an icon's size is also optical, and also a decision.** Five steps
(`12 / 14 / 16 / 20 / 24`) plus two named dot sizes. Two rules make it hold:

- **A scale must contain its own default.** The first draft was four rungs and
  skipped 16px — the most common icon in the kit, 351 call sites. A scale whose
  most-used rung is unnamed is not a scale; it just means everyone writes `w-4`.
- **A dot is not a small icon.** Presence dots are `rounded-pill` filled circles
  and carry their own names (`icon-dot`), asserted to stay below `icon-xs`. A
  named size should describe a *role*, and "presence" is a role; "8px" is not.

**Refuses:** raw `w-N h-N` on a component, and applying an icon token to a
layout box — a 16px divider named `icon-md` would look governed while quietly
changing what it means.

### 3.3 Typography — a size is a triple, never a number

**Governing idea:** a type step is `size + leading + tracking`, shipped together.

A design system that owns font-size but delegates line-height to the browser has
not designed typography; it has outsourced the vertical rhythm. Our nine steps
each carry all three, which means a component can never accidentally be *set
correctly and spaced wrongly*.

**Persian is a first-class citizen, not a translation layer.** Arabic script needs
genuinely different type: a larger optical size at the same nominal px, looser
leading, and **no negative tracking** — which damages the connections between
letters and is the single most common way a Persian UI looks amateur. The
`data-script="fa"` ramp is not a scale factor applied afterwards; it is a second
designed ramp.

**Refuses:** raw `text-[Npx]`, a size without its leading, and one ramp pretending
to serve both scripts.

### 3.4 Motion — motion explains, it does not perform

**Governing idea:** every animation answers *"what just changed, and what may I do
next?"*

- **Duration is semantic.** `fast` (120ms) is feedback you caused. `base` (180ms) is
  a small overlay. `slow` (280ms) is a dialog or sheet. `deliberate` (400ms) is a
  page-level change. A duration outside this vocabulary is a decision the system
  did not make.
- **Enter fast, exit faster.** The eye is already looking where the thing is going.
- **One signature ease.** `cubic-bezier(0.16, 1, 0.3, 1)` is ours and is used
  everywhere. A system with a different easing per component has no motion
  identity.
- **Nothing loops, nothing moves for decoration.** An ambient animation must state
  what it is reporting. A gradient that drifts on its own is noise.
- **Reduced motion is not a degraded mode.** It is a supported mode with the same
  information. Removing the animation must never remove the *meaning* it carried.

**Refuses:** decorative motion, per-component easings, and any animation whose
purpose cannot be stated in one sentence.

### 3.5 Density — the system has one density, and it is generous

**Governing idea:** UI99 is a *desktop-first, touch-legal* system. We do not ship a
compact mode, and that is a decision.

The alternative — every component exposing `density="compact" | "default"` —
doubles the surface area, doubles the test matrix, and produces a kit where half
the variants are unmaintained. Instead:

- The base rhythm is generous enough to be touch-legal (44px targets).
- Dense contexts (tables, code, dashboards) get **dedicated components** —
  `DataTable`, `CodeBlock`, `TerminalEmulator` — that are honest about being dense,
  rather than a compact flag smeared across 94 components.
- Touch targets stay legal even where the *visual* box is smaller. The hit area
  and the painted box are allowed to differ, and the hit area is the one the
  accessibility floor governs.

**Refuses:** a global density switch. This is the axis we are most likely to
revisit, and we revisit it as components, never as a flag.

### 3.6 Stacking — order is a decision, not a number

**Governing idea:** *z-index answers “what is on top of what”, and that question
has a small number of answers, so it gets a name per answer.*

- **Twelve named layers, ascending by intent, never by number.** `base` ·
  `content` · `sticky` · `raised` · `floating` · `dock` · `header` · `overlay` ·
  `modal` · `popover` · `toast` · `tooltip`.
- **`content` exists because a pattern repeated 57 times is a decision.** Content
  lifted above its own decorative background inside a card is not “z-10”; it is
  a recurring, nameable situation. Borrowing `sticky` for it would have been a
  small lie that multiplied.
- **`popover` exists because of where the DOM puts things.** Radix renders every
  menu, listbox and popover surface into `document.body`. A dropdown opened
  *inside* an open Dialog is therefore **not a descendant** of that dialog and
  cannot inherit its stacking context. The portal band must sit above `modal`,
  or the menu paints under the dialog that owns it. This is the kind of fact a
  scale cannot express and a number cannot survive.
- **The scale is exhaustive and it is a test.** Any raw numeral is a failure, not
  a style choice — a wrong stacking order renders silently, and a page that looks
  *almost* right is harder to catch in review than one that is obviously broken.

**Refuses:** `z-[9999]` as a “just put it on top” escape hatch, and any layer
added for a single component. If a component needs a thirteenth layer, the
question is whether it is a new *kind* of surface — not whether it is inconvenient.

---

## 4. API and composition doctrine

**Governing idea:** primitives are for reuse, patterns are for recognition, and the
line between them must be visible in the file tree.

- **A primitive owns behaviour; a pattern owns layout.** `Dialog` owns focus
  trapping, scroll locking, and escape handling. What goes *inside* it is not its
  business. A primitive that also dictates its contents is a pattern wearing a
  primitive's clothes, and it cannot be reused where it does not fit.
- **Variants are a closed set.** `variant="ghost" | "outline" | "solid"` is a set
  the system maintains and tests. `variant="ghostish"` is not a variant, it is a
  bug report.
- **Escape hatches are named and documented.** `rounded` on `Surface` and `shape`
  on `Button` exist because a closed system occasionally meets a real case. Each is
  documented with *when to reach for it*. An undocumented escape hatch is how a
  closed set quietly becomes an open one.
- **Copy-anywhere is a hard requirement.** No primitive may depend on app context.
  Theme is observed from the DOM; a component pasted into any React app must work
  with no provider, no wrapper, and no import from this app.
- **Composition over configuration, to a documented limit.** Three boolean props
  that are only ever used together are one prop. Nine boolean props are a config
  object pretending to be a component.

---

## 5. Accessibility — the floor, not the feature

**Governing idea:** WCAG 2.2 AA is the floor. AAA on sensitive surfaces. There is
no "accessible tier" of this kit.

- Every interactive primitive ships with all five states: default, hover, press,
  focus-visible, disabled.
- Focus is a *system*, not a style: the double-ring `focus-ui99` (2px ring + 2px
  canvas gap) implements WCAG 2.4.11/2.4.13 Focus Appearance, with `focus-ui99-inset`
  for nested pills and rows where an outer ring would clip.
- Colour is never the only signal.
- The whole-shell axe pass is a test, not a review step.

**The rule that matters:** an accessibility fix is never deferred to a later
sprint. If a primitive ships violating the floor, it does not ship. The audit
matrix found three real a11y bugs in already-"done" components; that is the
expected rate, and the gate is what makes it a number instead of a surprise.

---

## 6. The quality boundary — what blocks a merge

> **A clause in this document that is not enforced by a gate is not policy. It is a
> sentiment. Sentiments do not block merges.**

| # | Policy | Enforced by | Fails on |
|---|---|---|---|
| 1 | No hardcoded surface/ink hexes in the kit | `tokens:gate` rule A | Any `#RRGGBB` in a class |
| 2 | Structure is tokens, not arbitrary values | `tokens:gate` rule B | `shadow-[…]`, `rounded-[…]`, `blur-[…]`, `text-[Npx]`, and the **named** Tailwind scale — bare *and* directional |
| 3 | Every referenced token is declared | `tokens:gate` rule C | A typo'd `(--radius-mdd)` — checked in **both** reference spellings |
| 4 | Every utility actually compiles | `tokens:gate` rule D + `tokens.test.ts` | `(--x)` wrapped in `var()`, multi-token shorthands, stray `)` |
| 5 | Radius is complete, monotonic, and padding-derived | `tokens.test.ts` | A flat ladder step, a second scale, a size map that reuses a corner |
| 6 | Contrast holds | `contrast.test.ts` | 22 token pairs below 4.5:1 / 3:1 |
| 7 | Primitives are accessible | `axecore`, `audit-matrix` | Any axe violation |
| 8 | The shell boots and is axe-clean | `app-shell-smoke` | A crash or a violation at `<App />` |
| 9 | The published kit is coherent | `registry:validate` | Schema, catalog, a11y metadata, dangling refs |
| 10 | The published artifact is correct | `audit-package.mjs` | Missing files, bad manifest, a broken `exports` map |

### Stated but not yet enforced — the honest gap list

These are policy commitments with **no gate today**. They are written down so the
gap is visible rather than assumed away, and they are the standing argument for
turning a gate on.

| Commitment | Status | Turn the gate on when |
|---|---|---|
| Z-index is named, not numeric | **✅ now enforced** — 90 raw values migrated to 12 named layers; a test fails on any raw numeral | Already on |
| Icon size is optical, not numeric | **✅ now enforced** — 472 icons + 16 dots migrated, pixel-identical. The gate fires only on a matched `w-N h-N` pair on a component, so layout boxes are never caught | Already on |
| Spacing is a 4px scale with intent aliases | **✅ now true, and deliberately not migrated.** Tailwind v4's single `--spacing: .25rem` already enforces the grid, and 9 of 12 declared numeric steps duplicate values it emits — migrating ~900 call sites would change zero pixels. The four *intent* aliases are the load-bearing part. | Already true; the redundant steps are documented, not mass-applied |
| A shadow is never the only separation cue | Not machine-checkable | We find a formulation that is |
| Density is a decision, not a flag | By construction (no flag exists) | n/a — holds by absence |
| Every advertised component is installable | **✅ now enforced** — a module is excludable only if it is not *installable*, never merely because it is not a primitive. `registry:validate` rejects any item importing an undeclared package; `registry:audit-install` copies items into an empty project and typechecks them there. 101/101 pass. | Already on |

> **The spacing row is the one worth reading twice.** It was written here as a
> failure ("0 token usages") and it was *wrong* — the metric was wrong, not the
> code. "Not using our token" is only a defect when the token does something the
> framework does not. For z-index it did: the values were ungated, and two of
> them were real stacking bugs. For spacing it did not, because the framework
> already owned the decision. Declaring a token is not a reason to use it, and
> the honest move was to measure first and then decline the work.
> See `docs/PARITY-AUDIT.md` §GAP 2.

> **The installability row encodes the same lesson in its purest form.** Seven
> components were excluded from the registry as "app-coupled". Two of the seven
> reasons were simply false — they had never been coupled to anything. The five
> that were real are now decoupled, and the proof is not a policy sentence: an
> empty project, a real `add`, a real `tsc`. Three separate consumer-only bugs
> surfaced that way, including unpinned dependencies that resolved
> `lucide-react@1` and removed an icon the kit imported. **A gate that runs
> inside the repo cannot see the failure mode where the artefact leaves the
> repo.** `tsc`, 178 tests, the build and the npm bundle were all green while
> the product was broken for every consumer.

> **Why a rule stays dark until it can pass:** an unpassable gate teaches teams to
> bypass gates. Rule C is the cautionary tale in reverse — it was *on*, it was
> *green*, and it was checking nothing. Both failure modes are real. Ours is to
> write the rule down, mark it pending, and switch it on when the code is ready.

---

## 7. How policy changes

Policy is not edited in the same PR as the code it describes.

1. **Propose** — a clause, the problem it solves, and *the gate that will enforce
   it*. A clause with no gate is a wish (§6); it may enter the document, but it
   enters the pending table, not the enforcement table.
2. **Land the gate dark** — write the rule, run it, and accept that it fails.
3. **Migrate the code** until it passes.
4. **Switch it on** and move the row into the enforcement table.
5. **Retiring a rule is also a proposal.** Dead policy is worse than none — it
   teaches people the document is decorative.

### The standing question for every change

> *"Is this a decision the system should have made once, or one that genuinely
> belongs to the person using it?"*

Almost every design-system argument is really this question wearing a disguise.
