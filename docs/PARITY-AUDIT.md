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
| Type scale | 0 | **tokens + utilities declared** ⚠️ | ~900 raw sizes (P0-A) |
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

## 2. Honest parity scorecard

Legend: ✅ real · ⚠️ partial · ❌ missing

| Dimension | Material 3 | iOS HIG | shadcn | Radix | **UI99** |
|-----------|:----------:|:-------:|:------:|:-----:|:--------:|
| Color roles | ✅ 40+ | ✅ semantic | ✅ | — | ⚠️ ~40, good |
| Typography ramp | ✅ modular | ✅ Dynamic Type | ✅ | — | ⚠️ **9-step ramp declared; migration open** |
| Elevation | ✅ 5 levels | ✅ 4 levels | ✅ | — | ✅ **5 + rim** |
| Radius | ✅ 8 steps | ✅ continuous | ✅ | — | ✅ **9 steps** (unused) |
| Spacing | ✅ 4dp grid | ✅ 8pt | ✅ | — | ❌ **tokens exist, 0 adoption** |
| Motion | ✅ M3 set | ✅ spring set | ✅ | — | ⚠️ tokens exist, `duration-300` everywhere |
| Z-index | ✅ layered | ✅ | ✅ | ✅ | ❌ **tokens exist, 0 adoption** |
| Iconography | ✅ Material Symbols | ✅ SF Symbols | ✅ lucide | ✅ | ⚠️ lucide but **7 mixed sizes** |
| Density modes | ✅ 3 | ✅ 3 | — | — | ❌ **none** |
| Persian/RTL type optics | ✅ | ✅ | — | — | ✅ **9-step FA ramp + auto switch** |
| Theming (runtime) | ✅ | ✅ | ✅ | — | ✅ CSS vars, both themes |
| Component anatomy docs | ✅ | ✅ | ✅ | ✅ | ⚠️ 94/101 headers, no anatomy |
| Keyboard/AT parity | ✅ | ✅ | ✅ | ✅ | ✅ axe-clean, focus rings |
| Copy-anywhere | — | — | ✅ | ✅ | ✅ zero app deps |
| **Registry + CLI** | ❌ | ❌ | ✅ | ❌ | ✅ **ahead of all** |

**Verdict:** we are at parity on **color, elevation, radius definition, theming,
a11y, and the registry/CLI** — and genuinely *ahead* on the registry. We are
**behind** on typography, spacing adoption, z-index adoption, icon sizing, and
density.

---

## 3. The gaps, ranked by how much they damage the product

### GAP 1 — Typography has no scale (highest)

11 raw Tailwind sizes, zero named tokens, no line-height pairing, no modular
ratio. Material defines a 15-step ramp; iOS scales with Dynamic Type. Ours is
"whatever Tailwind gave us".

**Does:** every page re-decides type. Nothing scales coherently, and RTL
Persian (Vazirmatn needs larger sizes at the same nominal px) has no hook.

**Fix:** a 7-step ramp with a *pair* per step (`size` + `line-height` +
`tracking`), then migrate the 11 raw sizes onto it.

### GAP 2 — Spacing & z-index tokens have zero adoption

Declared, tested, documented — and completely unused. The shell still hardcodes
`z-40` for the dock and `z-50` for the header, which is exactly the guesswork
the tokens were meant to remove.

**Fix:** migrate shell/modals first (highest z-risk), then a codemod for
repeated spacing patterns only — never one-offs.

### GAP 3 — Icon sizing is 7 different values

`w-1.5`, `w-2.5`, `w-3`, `w-3.5`, `w-4`, `w-5`, `w-6`, `w-8`. Material ships a
single optical size per context. Mixed icon sizes read as "not a system" faster
than anything else on a page.

**Fix:** a 4-step icon scale (`xs/sm/md/lg`) mapped to the current values, and a
gate on new ones.

### GAP 4 — No density modes

Material (compact/comfortable) and iOS both let a user trade whitespace for
information density. Ours is fixed. For a data-heavy kit — tables, forms,
dashboards — this is a real capability gap, not a nicety.

**Fix:** a `--density-*` multiplier on the spacing tokens + one data attribute.
Cheap once spacing tokens are actually adopted.

### GAP 5 — Over-rounding, as measured above

**Fix:** tighten the container default and enforce the Material nesting rule.

### GAP 6 — No component anatomy documentation

94/101 files have a header comment, but nothing documents slot structure, state
matrix, or token usage. shadcn and Radix both ship per-component anatomy.

**Fix:** a generated anatomy table in the registry (`registryData.ts` already
carries a11y metadata; slots/states are the missing half).

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
| Typography | ✅ | ❌ migration open | ⚠️ rule staged | ✅ |
| Spacing | ✅ | ❌ | ❌ | ✅ |
| Z-index | ✅ | ❌ | ❌ | ✅ |
| Icon size | ✅ | ❌ | ❌ | ✅ |
| Density | ❌ | ❌ | ❌ | ❌ |

**Four of eight rows are now complete** (up from two). Three more have their
tokens declared and tested but adoption outstanding. One — density — is a
capability that does not exist yet at all.

---

## 5. Recommended order (before page-by-page audit)

Page-by-page auditing before this is finished would produce component-by-
component workarounds for a system that is still moving. Close these first —
each one makes the page audit faster and the result durable:

- ~~**P0-B · Radius adoption + de-rounding**~~ — adoption **done** (787 → 827,
  gate now covers the named scale, duplicate-radius test added). What remains
  is a visual pass on container defaults with the pages open.
- **P0-A · Typography migration** — the ramp is built and tested; migrating the
  ~900 call sites needs per-site judgement (is this `text-xs` a caption, or
  genuinely micro?) and must not be automated blindly.
- **P0-C · Z-index + shell spacing adoption** — small, high-risk-if-skipped.
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

- Kit components: 94 · registry items: 97 · `src/components/ui/*.tsx`: 101
- Token declarations: 127 (CSS) + 63 (type/icon) · tests: 154 passing · gate: 105 files clean
- Elevation 160 · rim 80 · glow 53 · **radius 827 (was 40)** · blur 7
- Radius bypass: **0 (was 787)** · spacing bypass: all · z-index bypass: all
- Type sizes: 9-step ramp declared, ~900 raw usages pending migration
- Icon sizes: 4 declared (`xs/sm/md/lg`), 7 raw sizes pending migration
- Kit files with header docs: 94/101
