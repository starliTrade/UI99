// Prepend anatomy documentation to components whose header is missing.
// Hand-written, not generated: a header that restates the code is noise, and
// this kit's constitution (AGENTS.md §6) requires a documented audit checklist
// per component. Idempotent — skips any file that already opens with a docblock.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HEADERS = {
  CheckboxGroup: `/**
 * UI99 — Checkbox Group
 *
 * ANATOMY   CheckboxGroup ▸ label ▸ [Checkbox] ▸ description ▸ error
 * STATES    default · hover · focus-visible (focus-ui99) · disabled · error
 * TOKENS    --radius-field, --border-subtle, --text-secondary, --accent
 * A11Y      role="group" + aria-labelledby on the fieldset; each option is a
 *            real <button role="checkbox" aria-checked> with roving focus.
 * KEYBOARD  Tab enters the group · Space toggles · arrows move between options
 *            (roving tabindex, so the group is one tab stop).
 */`,

  Command: `/**
 * UI99 — Command Palette
 *
 * ANATOMY   Command ▸ [cmdk] ▸ [CommandInput] ▸ [CommandList] ▸ [CommandItem]
 * STATES    default · focus-visible · empty-result · selected · disabled
 * TOKENS    --bg-popover, --shadow-popover, --radius-xl, --text-muted
 * A11Y      role="dialog" + aria-modal, combobox/listbox pattern from cmdk;
 *            result count announced via aria-live.
 * KEYBOARD  Cmd/Ctrl-K or "/" opens · arrows move the active item · Enter runs
 *            · Escape closes and restores focus to the trigger.
 */`,

  CurrencyInput: `/**
 * UI99 — Currency Input
 *
 * ANATOMY   Input ▸ symbol ▸ editable field ▸ locale hint
 * STATES    default · hover · focus-visible (focus-ui99) · invalid · disabled
 * TOKENS    --bg-elevated, --radius-pill, --text-primary, --focus-ring
 * A11Y      <input inputMode="decimal"> with an explicit label; the symbol is
 *            aria-hidden so the field announces only the value.
 * KEYBOARD  Native numeric entry · arrows step · Escape reverts to the last
 *            committed value.
 */`,

  DataTable: `/**
 * UI99 — Data Table
 *
 * ANATOMY   DataTable ▸ toolbar (search) ▸ header row ▸ body rows ▸ empty state
 * STATES    default · hover (row) · focus-visible (cell focus-ui99) · selected
 *            · empty · loading
 * TOKENS    --bg-elevated, --radius-field, --border-subtle, --text-muted
 * A11Y      Real <table> semantics with scope="col" headers; the search field
 *            is a labelled textbox, not a bare input.
 * KEYBOARD  Tab traverses the toolbar, arrow keys move between cells when
 *            focus is in the grid (WAI-ARIA grid pattern).
 * DENSITY   Row rhythm follows --density-scale; data-density="compact" is the
 *            mode this component exists to serve.
 */`,

  DateRangePicker: `/**
 * UI99 — Date Range Picker
 *
 * ANATOMY   DateRangePicker ▸ [start field] ▸ "→" ▸ [end field] ▸ calendar
 * STATES    default · hover · focus-visible (focus-ui99) · invalid (end < start)
 *            · disabled
 * TOKENS    --bg-elevated, --radius-field, --accent, --border-subtle
 * A11Y      Each field is a labelled input; the calendar is a grid with
 *            aria-selected on days and a live announcement of the range.
 * KEYBOARD  Arrows move by day/week · PageUp/Down by month · Enter selects ·
 *            Escape closes the calendar and returns focus to the field.
 */`,

  Dialog: `/**
 * UI99 — Dialog
 *
 * ANATOMY   Dialog ▸ overlay ▸ [DialogContent] ▸ [DialogTitle] ▸ [DialogDescription]
 *            ▸ [DialogClose]
 * STATES    default · open · focus-visible (focus-ui99) · disabled
 * TOKENS    --bg-canvas, --bg-elevated, --shadow-modal, --radius-xl, --z-modal
 * A11Y      Radix Dialog: role="dialog" aria-modal="true", focus trapped on
 *            open and restored to the trigger on close, body scroll locked.
 * KEYBOARD  Escape closes · Tab cycles within · arrows move within menus.
 * LAYER     --z-modal, deliberately ABOVE --z-header: an overlay that paints
 *            under the sticky header is a bug, not a style (see docs §3.3).
 */`,

  DropdownButton: `/**
 * UI99 — Dropdown Button
 *
 * ANATOMY   DropdownButton ▸ [LinkButton trigger] ▸ caret ▸ [DropdownMenu]
 * STATES    default · hover · focus-visible (focus-ui99) · open · disabled
 * TOKENS    --bg-elevated, --radius-control, --accent, --shadow-popover
 * A11Y      aria-haspopup="menu" + aria-expanded on the trigger; the menu is a
 *            real role="menu" with managed focus.
 * KEYBOARD  Enter/Space/ArrowDown opens · arrows move · Enter activates ·
 *            Escape closes and returns focus to the trigger.
 */`,

  DropdownMenu: `/**
 * UI99 — Dropdown Menu
 *
 * ANATOMY   DropdownMenu ▸ [DropdownMenuTrigger] ▸ [DropdownMenuContent]
 *            ▸ [DropdownMenuItem] ▸ [DropdownMenuSeparator] ▸ [DropdownMenuLabel]
 * STATES    default · hover · focus-visible (focus-ui99) · open · selected
 *            · destructive · disabled
 * TOKENS    --bg-popover, --shadow-popover, --radius-md, --border-subtle
 * A11Y      Radix menu semantics: role="menu"/"menuitem", typeahead enabled,
 *            focus moved into the content on open and restored on close.
 * KEYBOARD  Arrows move · Home/End jump · type to search · Escape closes.
 * LAYER     Portalled to document.body, so it cannot inherit the trigger's
 *            stacking context — that is why --z-popover exists above
 *            --z-modal (docs §3.3).
 */`,

  FloatingActionButton: `/**
 * UI99 — Floating Action Button
 *
 * ANATOMY   FloatingActionButton ▸ icon ▸ optional label ▸ optional badge
 * STATES    default · hover · focus-visible (focus-ui99) · pressed · disabled
 * TOKENS    --accent, --glow-accent-md, --radius-pill, --z-floating
 * A11Y      aria-label is required (the control is icon-only by default);
 *            the badge count is exposed via aria-label, not only visually.
 * KEYBOARD  Native button · Enter/Space activate.
 * TOUCH     Extended FAB is 56px tall — above the 44px floor in every density
 *            mode including compact.
 */`,

  LinkButton: `/**
 * UI99 — Link Button
 *
 * ANATOMY   LinkButton ▸ optional leading icon ▸ label
 * STATES    default · hover · focus-visible (focus-ui99) · active · disabled
 * TOKENS    --accent, --text-primary, --radius-control
 * A11Y      Renders <a> when href is present and <button> otherwise, so the
 *            role always matches the behaviour. External links get
 *            rel="noopener noreferrer" and an announced "opens in new tab".
 * KEYBOARD  Native element semantics; Enter activates.
 */`,

  MetricCard: `/**
 * UI99 — Metric Card
 *
 * ANATOMY   MetricCard ▸ label ▸ value ▸ delta ▸ optional sparkline
 * STATES    default · hover (elevation lift) · focus-visible (focus-ui99) ·
 *            loading (skeleton) · error
 * TOKENS    --bg-card, --shadow-card, --radius-xl, --text-primary
 * A11Y      The delta is not colour-only: it carries a ▲/▼ glyph AND a
 *            sr-only word ("up"/"down") so the direction survives greyscale.
 * KEYBOARD    Not interactive by default; when onClick is supplied it becomes
 *            a button and joins the tab order.
 */`,

  PinInput: `/**
 * UI99 — PIN / OTP Input
 *
 * ANATOMY   PinInput ▸ N cells ▸ hidden aggregate input ▸ optional timer
 * STATES    default · hover · focus-visible (focus-ui99) · filled · error ·
 *            disabled · paste
 * TOKENS    --bg-elevated, --radius-sm, --accent, --focus-ring
 * A11Y      One real input carries the value; the cells are aria-hidden, so a
 *            screen reader reads a single field rather than N empty boxes.
 * KEYBOARD  Digits · Backspace · ArrowLeft/Right · paste distributes across
 *            cells and fires onComplete.
 */`,

  Popover: `/**
 * UI99 — Popover
 *
 * ANATOMY   Popover ▸ [PopoverTrigger] ▸ [PopoverAnchor] ▸ [PopoverContent]
 * STATES    default · open · focus-visible (focus-ui99) · closed
 * TOKENS    --bg-popover, --shadow-popover, --radius-lg, --border-subtle
 * A11Y      Radix Popover: non-modal, focus moves in on open and returns to
 *            the trigger on close; Escape dismisses.
 * KEYBOARD  Enter/Space toggles · Escape closes · Tab moves out naturally
 *            (non-modal — the surrounding page stays reachable).
 */`,

  RangeSlider: `/**
 * UI99 — Range Slider
 *
 * ANATOMY   RangeSlider ▸ track ▸ filled range ▸ [start thumb] ▸ [end thumb]
 * STATES    default · hover · focus-visible (focus-ui99) · dragging · disabled
 *            · at-min · at-max
 * TOKENS    --accent, --bg-sunken, --radius-pill, --focus-ring
 * A11Y      Two native range inputs kept in the DOM for semantics, visually
 *            merged; aria-valuetext carries the formatted value so "1400" is
 *            not announced as a bare number.
 * KEYBOARD  Arrows step · PageUp/Down jump by 10 · Home/End to the bounds ·
 *            the focused thumb is the only one in the tab order.
 */`,

  Sheet: `/**
 * UI99 — Sheet
 *
 * ANATOMY   Sheet ▸ overlay ▸ [SheetContent] ▸ grabber ▸ [SheetTitle] ▸ close
 * STATES    default · open · focus-visible (focus-ui99) · disabled
 * TOKENS    --bg-elevated, --shadow-modal, --radius-sheet, --z-modal
 * A11Y      Radix Dialog with the same trap/restore contract as Dialog; on
 *            mobile the sheet is the primary surface, so the title is required.
 * KEYBOARD  Escape closes · Tab cycles within · drag handle is decorative and
 *            aria-hidden (the close button is the keyboard path).
 * LAYER     --z-modal, above --z-header by design (docs §3.3).
 */`,

  Spinner: `/**
 * UI99 — Spinner
 *
 * ANATOMY   Spinner ▸ rotating arc ▸ optional label
 * STATES    default · loading · subtle · on-dark · disabled (frozen, dimmed)
 * TOKENS    --accent, --text-muted, --radius-pill
 * A11Y      role="status" with an sr-only label; decorative instances set
 *            aria-hidden so a busy region is not announced N times.
 * KEYBOARD  Not focusable — a spinner is an output, not a control.
 * MOTION    Rotation is the one animation a reduced-motion user should still
 *            see paused: it is wrapped so prefers-reduced-motion stops it
 *            rather than leaving a frozen-but-"loading" affordance ambiguous.
 */`,

  SplitButton: `/**
 * UI99 — Split Button
 *
 * ANATOMY   SplitButton ▸ [primary action] ▸ divider ▸ [trigger ▸ menu]
 * STATES    default · hover · focus-visible (focus-ui99) · open · disabled
 * TOKENS    --bg-elevated, --accent, --radius-control, --shadow-popover
 * A11Y      Two independent controls, not one: the primary action and the
 *            menu trigger each carry their own accessible name, and the
 *            divider is aria-hidden.
 * KEYBOARD  Tab reaches both · Enter runs the primary · ArrowDown on the
 *            trigger opens the menu · Escape closes it.
 */`,

  Tabs: `/**
 * UI99 — Tabs
 *
 * ANATOMY   Tabs ▸ [TabsList] ▸ [TabsTrigger] ▸ [TabsContent]
 * STATES    default · hover · focus-visible (focus-ui99) · active · disabled
 * TOKENS    --radius-control, --bg-sunken, --accent, --text-secondary
 * A11Y      Radix Tabs: role="tablist"/"tab"/"tabpanel" with aria-controls and
 *            aria-selected wired; the indicator is a layout effect, never the
 *            only signal of the active tab.
 * KEYBOARD  Arrows move and activate (automatic activation) · Home/End jump to
 *            the first/last tab.
 */`,

  TooltipPrimitive: `/**
 * UI99 — Tooltip Primitive
 *
 * ANATOMY   TooltipProvider ▸ TooltipRoot ▸ TooltipTrigger ▸ TooltipContent
 * STATES    default · open · focus-visible (focus-ui99) · disabled
 * TOKENS    --bg-popover, --text-primary, --radius-sm, --z-tooltip
 * A11Y      Radix Tooltip: role="tooltip" referenced by aria-describedby.
 *            A tooltip is NEVER the only home for information — it is
 *            unavailable to touch users, so anything essential must also exist
 *            in the surface itself.
 * KEYBOARD  Focus opens · Escape dismisses immediately.
 * LAYER     --z-tooltip, the top of the stack: a tooltip must never be
 *            occluded by the overlay it describes.
 */`,
};

let written = 0;
const skipped = [];

for (const [name, header] of Object.entries(HEADERS)) {
  const path = join('src/components/ui', `${name}.tsx`);
  const src = readFileSync(path, 'utf8');
  if (/^\s*\/\*\*/.test(src)) {
    skipped.push(name);
    continue;
  }
  writeFileSync(path, `${header}\n\n${src}`);
  written++;
  console.log(`  + ${name}.tsx`);
}

console.log(`[anatomy] ${written} header(s) added, ${skipped.length} already documented`);
if (skipped.length) console.log('  skipped:', skipped.join(', '));
