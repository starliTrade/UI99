# SAFA Design System & Engineering Rules

## 1. Core Visual Identity & Theme Mode
- **Default Theme**: Strictly **Dark Mode (Obsidian Dark)** locked across all platforms, contexts, and views.
- **Root Background**: `#06070A` (velvet obsidian black).
- **Surface Layer 1 (Containers & Cards)**: `#0B0C11` to `#0E0E14`.
- **Surface Layer 2 (Elevated & Modals)**: `#131318` with subtle backdrop blur.
- **Text Hierarchy**:
  - Primary text: `#EDEDEF` / `#FFFFFF` (High contrast, refined typography).
  - Secondary text: `#92929B` / `#8E8E98`.
  - Muted/Tertiary: `rgba(255, 255, 255, 0.45)`.

## 2. Border & Shadow System (Ultra-Soft & Diffused)
- **Strict Prohibition**: Never use bright, thick, or stark white/gray solid borders (e.g. avoid `border-zinc-700` or `border-white/20`).
- **Standard Card Borders**:
  - Outer hairline: `border: 1px solid rgba(255, 255, 255, 0.025)` or `border-white/[0.025]`.
  - Inner top rim highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`.
- **Shadow Profile**:
  - Ambient deep diffusion: `0 18px 40px -10px rgba(0, 0, 0, 0.65)`.
  - Hover elevation: `0 22px 48px -10px rgba(0, 0, 0, 0.8)`.

## 3. Liquid Glass Standards (Docks, Floating Capsules & Navigation)
- **Dock Base (`.liquid-glass-dark-dock`)**:
  - Background: `rgba(14, 14, 19, 0.52)`.
  - Backdrop Filter: `blur(18px) saturate(170%)`.
  - Border: `1px solid rgba(255, 255, 255, 0.03)`.
  - Inner Top Highlight: `inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.04)`.
  - Outer Shadow: `0 20px 48px -12px rgba(0, 0, 0, 0.7)`.
- **Active Navigation Cushion (`glassCushionActive`)**:
  - Material: `bg-white/[0.045]`.
  - Inner Rim: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]`.
  - Blend: Must seamlessly nest into the parent capsule with velvet softness; no harsh white blocks or high-contrast background slabs.

## 4. Header & Branding Standards
- **Top Header**: Minimalist, sticky translucent bar with `SafaBrandLogo`.
- **SAFA Logo Component (`SafaBrandLogo.tsx`)**:
  - Background: Dashed/stitched serif outline `SAFA`.
  - Foreground: Solid vector calligraphy `صفا` with diamond nuqta dot.
- **Top Header Action Buttons**:
  - Translucent capsule styling: `bg-[#0E0E14]/75`, `backdrop-blur-xl`, `border-white/[0.025]`.

## 5. Rules for All Future Components & Features
- All newly created views, widgets, cards, modals, sheets, and inputs MUST adhere strictly to the tokens above.
- Always use the unified `ObjectCard`, `Card`, `SegmentedControl`, or matching CSS utility classes (`material-obsidian-card`, `liquid-glass-dark-dock`).
- Maintain mobile-first responsive touch targets (minimum 44px) and smooth springs with `motion/react`.

## 6. Standards & Audit Reference (Mandatory)
- The full, ruthless standards list (WCAG 2.2, Apple HIG, Material 3, HCI laws, API design) lives in `docs/standards.md`.
- Every new component MUST pass the audit checklist in `docs/standards.md` §12 before merge: five component states (default/hover/press/focus-visible/disabled), keyboard support, `focus-safa`/`focus-safa-inset` focus rings, no hard-coded hex outside tokens, and contrast verification via `src/core/tokens/math.ts`.
