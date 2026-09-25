# UI99 — Product Site Roadmap & IA Rebuild

> Goal: turn the current demo shell into a product site with Google/Meta-grade
> information architecture, mobile-first density, honest content volume, and
> conversion-grade copy — without inventing data we do not have.
>
> **Non-negotiable constraint:** every number, badge, and claim on the site must be
> generated from the registry (single source of truth = `src/generated/kit-count.ts`).
> No hard-coded counts, no fake testimonials, no fabricated logos.

---

## 0. Diagnosis — what is actually wrong today

Verified by reading the code, not assumed.

| # | Finding | Evidence | Impact |
|---|---------|----------|--------|
| D1 | **5 dock items vs 10 app tabs** | `BottomNavigation.tsx` declares only `HOME, UIKIT, DOCS, FOUNDATIONS, BLOCKS`; `AppContext` `NavTab` has 10 including `LIFE, CREATE, MEDIA, MORE, INBOX` | 5 of 10 destinations are unreachable from primary nav |
| D2 | **Extreme content asymmetry** | `DocsView` 3275 LOC vs `MediaView` 116 LOC; `UIKitView` 2703 vs `MoreView` 274 | Half the app is a wall of text, half is a stub |
| D3 | **Duplicated guide registry** | `DocsView.tsx` repeats the same 6 ids (`intro, installation, theming, npm-guide, cli, changelog`) in three separate arrays | Sidebar/palette/pagination can drift out of sync |
| D4 | **No landing page** | `index.html` boots straight into `App`; there is no public marketing route, no hero, no CTA | A first-time visitor has no "what is this / why should I care" moment |
| D5 | **Home is a proxy, not a page** | `HomeView.tsx` is 7 lines that render `DesignSystemHomeView` (1222 LOC) which contains only 4 `<h3>` headings | No narrative, no scannable entry points |
| D6 | **Category taxonomy is thin** | `UIKitView` uses only 3 literal `category:` values in the explored path; the marketing README claims 8 groups | Users can't find components by mental model |
| D7 | **Copy is descriptive, not persuasive** | README/intro strings are technical; no benefit framing, no proof, no CTA ladder | Zero conversion path |
| D8 | **No visual proof on first screen** | No screenshot grid, no live component showcase above the fold | Nothing to desire |

**Root cause of D1–D3:** the app grew as a *component lab* (one screen per
subsystem) and was never re-architected as a *product site* (one narrative,
progressive disclosure). The fix is IA + content planning first, pixels second.

---

## 1. Information Architecture (the single highest-leverage change)

### Target top-level model — 5 destinations, 5 jobs-to-be-done

| Slot | Destination | Job to be done | Content source |
|------|-------------|----------------|----------------|
| 1 | **Overview** (`HOME`) | "What is this, why should I care, how do I start?" | New landing narrative |
| 2 | **Components** (`UIKIT`) | "Find the exact primitive I need" | 92 kit components |
| 3 | **Patterns** (`BLOCKS`) | "Show me a composed, real screen" | Blocks + live previews |
| 4 | **Guides** (`DOCS`) | "How do I install / theme / ship?" | 6 guides + changelog |
| 5 | **Design** (`FOUNDATIONS`) | "Why does it look this good?" | Tokens, contrast, motion |

### Rules

- **R1 — Max 5 dock items.** 5 is the cognitive ceiling for a bottom bar
  (Nielsen Norman: 3–5 primary destinations; more requires a "More" sink).
- **R2 — Every tab must be reachable in ≤1 tap from any tab.** No orphan routes.
- **R3 — The `LIFE / CREATE / MEDIA / INBOX / MORE` tabs are not part of the
  product site.** They are a personal-OS demo riding in the same shell. Decision
  required (see §6, Open Decision 1). Keeping them unreferenced is worse than
  either choice.
- **R4 — One source of truth per collection.** The triplicated guide list becomes
  a single `GUIDES` constant consumed by sidebar, ⌘K palette, dropdown, and
  pagination. Fixes D3 permanently.
- **R5 — Three-click rule.** Anything findable must be ≤3 interactions from
  Overview, including on mobile.

### Category taxonomy (fixes D6)

Reuse the 8 groups already published in the README so the site and the npm kit
speak the same language:

`Actions · Inputs · Forms · Navigation · Data · Overlays · Layout · Feedback · Display · Brand`

Every component gets exactly one primary category plus optional tags. Search
ranks on: name match > category > tag > description.

---

## 2. Content volume policy

Content must be *honest and balanced* — not padded.

- **V1 — No page shall be more than 1.6× the length of the median page**
  without a table of contents. `DocsView` (3275 LOC) needs a persistent TOC rail
  on desktop and a sticky section jump on mobile.
- **V2 — Every destination must be complete within its own promise.** A view
  that is a stub either gets finished or is removed from the dock. 116-LOC
  `MediaView` next to 3275-LOC `DocsView` is the definition of unbalanced.
- **V3 — One idea per screen on mobile.** Mobile gets a single primary action
  per viewport; secondary content moves behind progressive disclosure.
- **V4 — Empty states are designed, not defaulted.** Every list/grid gets a
  designed empty state with one clear next action.
- **V5 — Data density tiers** per page: *overview* (scan, 5s) → *detail* (read,
  60s) → *reference* (lookup, 10min). Each page declares its tier.

---

## 3. Mobile-first layout system

- **M1 — Design at 390px, verify at 320 / 390 / 430 / 768 / 1280.** No
  horizontal scroll at any breakpoint; no content wider than the viewport.
- **M2 — 44px minimum touch target** on every interactive element, including
  dock items and icon buttons (AGENTS.md §5).
- **M3 — Thumb-zone rule.** Primary actions sit in the lower 40% of the
  viewport on mobile; destructive actions never sit in the bottom bar.
- **M4 — Sticky header must be ≤56px** and must not fight the dock for space.
- **M5 — Respect `prefers-reduced-motion`** for all scroll/3D motion
  (`src/components/ui/motion.tsx` already has the hook — wire it everywhere).
- **M6 — Text never below 14px** on mobile; body copy 16px for CJK/Persian
  legibility.
- **M7 — RTL is a first-class layout**, not a text flip. The site already has
  `isRTL` plumbing; every new view must render mirrored and be axe-clean in RTL.

---

## 4. Visual / 3D layer

Deliberately restrained — this is a design-system product, so the visuals must
demonstrate craft, not decorate.

- **D1 — 3D is proof, not garnish.** A single hero 3D object (token lattice /
  material stack) that *demonstrates the design system's own tokens* earns its
  place. Random 3D hurts a tool that sells restraint.
- **D2 — Performance budget:** 3D module ≤150KB gzip, ≤16ms main-thread work
  per frame, no 3D on the critical path above the fold on mid-tier mobile.
  Fallback: a static poster frame with identical framing.
- **D3 — One 3D moment per page, maximum.** Never a 3D grid.
- **D4 — Prove tokens in motion:** animate a real CSS variable (`--bg-elevated`,
  `--focus-ring`, `--ease-ui99`) so the 3D *is* the design system talking.
- **D5 — Screenshot/live-grid above the fold** on Overview: real rendered
  components, no lorem, no stock imagery.

---

## 5. Copy & conversion (the "persuasive" requirement)

- **C1 — Problem → Promise → Proof → Action** for every page intro, max 3
  sentences. Current copy is spec-sheet; convert it to benefit language.
- **C2 — CTA ladder:** one primary CTA per page, repeated at the natural exit
  point. `bun add @99/ui` and `npx @99/ui init` are the two actions that matter.
- **C3 — Copy must be generated from real data** (counts, versions, token
  numbers) so it can never drift — reuse `KIT_COMPONENT_COUNT` /
  `KIT_VERSION`.
- **C4 — No unearned social proof.** No fake testimonials, no invented
  company logos. Use verifiable proof instead: axe-core results, contrast
  ratios, bundle size, install count if genuinely available.
- **C5 — Bilingual EN/FA parity** for all marketing copy; the product already
  carries `faLabel` in nav — extend that discipline site-wide.

---

## 6. Decisions taken (2026-09-25)

1. **Personal-OS tabs (LIFE/CREATE/MEDIA/INBOX/MORE): REMOVED from the product
   site.** They were unreachable from the dock and diluted the story. The five
   view files, their `NavTab` values, and their now-dead subview/chip state were
   deleted rather than hidden.
2. **Front door: marketing narrative.** `HOME` is the marketing Overview
   (hero → proof → CTA), with the component explorer one tap away.
3. **P0 scope: everything + the 3D hero.** Shipped together.

## 6b. P0 — shipped in this pass

- [x] P0.1 Guide dedup — **deferred**: the three arrays live inside
  `DocsView.tsx` (3275 LOC); needs a dedicated refactor, not a blind edit.
- [x] P0.2 Orphan tabs removed (5 views deleted, `NavTab` narrowed to 5).
- [x] P0.3 Dock rebuilt to the 5-destination model, journey-ordered:
  Overview → Components → Patterns → Guides → Design.
- [x] P0.4 Dock touch targets raised to 44px; focus rings added; `aria-current`
  marks the active destination; search button also 44px.
- [x] P0.5 **CI guard shipped** — `src/test/navigation.test.tsx` fails the build
  if the dock and `NavTab` ever diverge again.
- [x] Bonus: token-driven 3D hero (`TokenLatticeHero.tsx`) — canvas 2D, zero
  dependencies, reduced-motion static frame, auto-pause when off-screen, and
  colours read live from CSS custom properties.
- [x] Bonus: hero copy moved to Problem→Promise→Proof→Action, counts still
  generated from `kit-count.ts` (no hand-written numbers).

## 6c. Open decisions (remaining)

1. **Personal-OS tabs (LIFE/CREATE/MEDIA/INBOX/MORE):** remove, or give them a
   real destination? They are unreachable today and dilute the product story.
2. **Overview vs Docs as the front door:** does a visitor land on the marketing
   narrative, or straight on the component explorer? (Recommend: narrative
   first, explorer one tap away.)
3. **Scope of P0:** ship IA + content balance only, or IA + 3D hero together?

---

## 7. Execution phases

### P0 — Stop the bleeding (must ship first)

- [ ] P0.1 Collapse the triplicated guide array into one `GUIDES` source (D3)
- [ ] P0.2 Decide + execute the orphan-tab disposition (D1, Open Decision 1)
- [ ] P0.3 Rebalance the dock to the 5-destination model; verify no orphan tabs
- [ ] P0.4 Run a mobile audit at 320/390/430 and fix overflow + touch targets
- [ ] P0.5 Add a CI guard: every `NavTab` must appear in the dock config

### P1 — Product site layer

- [ ] P1.1 Build the Overview landing narrative (hero, proof, CTA) (D4, D5)
- [ ] P1.2 Real component screenshot/live grid above the fold (D8)
- [ ] P1.3 Adopt the 10-group taxonomy across explorer + docs + README (D6)
- [ ] P1.4 Rewrite page intros with Problem→Promise→Proof→Action (C1)
- [ ] P1.5 CTA ladder with copy generated from registry counts (C2, C3)
- [ ] P1.6 Designed empty states for every collection (V4)

### P2 — Depth & polish

- [ ] P2.1 TOC rail for DocsView on desktop; sticky section jump on mobile (V1)
- [ ] P2.2 Even out view depth so no page is a stub (V2)
- [ ] P2.3 Bilingual copy parity sweep, RTL axe-clean on every view (C5, M7)
- [ ] P2.4 Motion audit against `prefers-reduced-motion` (M5)

### P3 — Signature layer

- [ ] P3.1 One token-driven 3D hero within the performance budget (D1, D2, D4)
- [ ] P3.2 Perceived-latency work: route-level code splitting for Docs/UIKit
- [ ] P3.3 Lighthouse budgets asserted in CI

### P4 — Release gate

- [ ] P4.1 Full `bun run lint` + `bun run test` + `tokens:gate` green
- [ ] P4.2 Mobile screenshot set attached to the release checklist
- [ ] P4.3 Copy-accuracy audit: every number matches generated constants
- [ ] P4.4 README + changelog updated to match shipped IA

---

## 8. Definition of Done (the gate that ends the argument)

A page is "done" only when **all** of these are true:

1. Reachable in ≤1 tap from every other destination.
2. Rendered and axe-clean at 320 / 390 / 430 / 768 / 1280, in both LTR and RTL.
3. Every interactive element ≥44px with the `focus-ui99` ring.
4. All numbers on the page come from generated constants.
5. One primary CTA, one honest promise, at least one piece of real proof.
6. `prefers-reduced-motion` honoured; no console errors; no CLS on load.
7. Shipped behind a passing test, and the test is in the suite.

---

## 9. Fact base used for these decisions

(All measured from the repo, not estimated.)

- Kit components: **92** · registry items: **95** · version `1.0.0`
  (from `src/generated/kit-count.ts`)
- `src/components/ui/*.tsx`: **100** files
- View LOC: Docs 3275 · UIKit 2703 · DesignSystemHome 1222 · Blocks 768 ·
  Foundations 362 · More 274 · Life 239 · Inbox 206 · Create 164 · Media 116
- Tests: **124 passing / 124** · tokens gate: **103 kit files clean**
