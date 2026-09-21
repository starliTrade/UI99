# UI99 (@99/ui) — World-Class Product Roadmap

> هدف نهایی: انتشار دقیقاً مثل shadcn/ui — کتابخانه npm + سایت محصول + CLI registry —
> با کیفیتی که از ممیزی سخت‌گیرانه `docs/standards.md` عبور کند.
>
> قانون کلی: هیچ فاز بدون سبز شدن gate فاز قبل شروع نمی‌شود. هر PR باید چک‌لیست §12 استانداردها را پاس کند.

---

## ✅ Phase 0 — Baseline & Standards Foundation (DONE)

- [x] `docs/standards.md` — 12 سکشن معیار (WCAG 2.2 / Apple HIG / M3 / HCI / API design)
- [x] سیستم فوکوس یکپارچه (`focus-safa` / `focus-safa-inset` + `--focus-ring`)
- [x] State layers متریال ۳ (`bg-state-*`) + توکن‌های motion (duration/easing)
- [x] رفع انیمیشن‌های مرده overlay (tw-animate-css) + باگ double-scale دیالوگ
- [x] a11y هسته: native input برای Checkbox/Radio، aria-live تُست، listbox/option، aria-invalid
- [x] RTL درست برای Switch، hit-area برای Tag

---

## Phase 1 — Ruthless Component Audit (در حال اجرا)

### 1.1 نمودار ممیزی: هر کامپوننت × هر سکشن استاندارد
سیستم نمره‌دهی PASS / FIX / FAIL برای ۳۰+ کامپوننت در `src/components/ui/`.
جدول به‌روز در همین فایل نگهداری می‌شود.

| کامپوننت | WCAG | Focus | States | RTL | Keyboard | وضعیت |
|---|---|---|---|---|---|---|
| Button / IconButton | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Input / Textarea / SearchBar | ✅ | ✅ | ✅ | ⚠️ label RTL | ✅ | PASS |
| Switch | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Checkbox / Radio | ✅ | ✅ | ✅ | ⚠️ | ✅ | PASS |
| Tabs | ✅ | ✅ | ✅ | ⚠️ | ⚠️ arrow-nav Radix | PASS |
| Accordion | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| Dialog / Modal / Sheet | ✅ | ✅ | ✅ | ⚠️ | ✅ | PASS |
| Popover / DropdownMenu / Command | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | PASS |
| Toast | ✅ | n/a | ✅ | ✅ | ✅ Esc + dismiss btn + pause-on-hover | PASS |
| SegmentedControl | ✅ | ✅ | ✅ | ✅ RTL arrows | ✅ roving tabindex + radiogroup | PASS |
| Dropdown (custom select) | ✅ listbox pattern | ✅ | ✅ | ✅ | ✅ Arrows/Type-ahead/Home/End/Esc | PASS |
| Tooltip | ✅ | n/a | ✅ | ⚠️ | ✅ focus + hover trigger | PASS |
| Slider | ✅ aria-valuetext | ✅ | ✅ | ✅ RTL mirror + valuetext | ✅ | PASS |
| Progress / Badge / Kbd | ✅ | n/a | ✅ | ✅ | n/a | PASS (Kbd h-4.5 → h-[18px] fixed) |
| Skeleton | ✅ | n/a | ✅ | ✅ | n/a | PASS |

### 1.2 رفع تخلفات شناخته‌شده
- [x] Dropdown: تبدیل به ARIA combobox کامل یا مهاجرت به Radix Select — Esc/Arrow/Type-ahead/Focus-trap
- [x] SegmentedControl: roving tabindex + Arrow keys + `role="radiogroup"` (RTL-aware)
- [x] Toast: dismiss با Escape، pause-on-hover، سقف ۳ پیام همزمان
- [x] Tooltip: فوکوس‌پذیری trigger (الگوی Radix)، بدون `cursor-default` اجباری
- [x] Slider: RTL معکوس‌شدن track + aria-valuetext
- [x] Kbd: حذف کلاس‌های نامعتبر `h-4.5` / `h-5.5`
- [ ] Sweep نور (light mode) و RTL روی همه ویوها (`src/components/views`, `home`, `shells`)

### 1.3 گیت‌های خودکار (CI-blocking) — ✅ هسته فعال است
- [x] Vitest + @testing-library/react — ۱۳ تست رفتاری هسته (render, interaction, roving tabindex, toast cap)
- [x] jest-axe روی کامپوننت‌های هسته (الگو: shadcn — تخلف صفر) + matcher سازگار vitest
- [x] اسکریپت کنتراست CI با `src/core/tokens/math.ts` → assert جفت‌های متن/بک‌گراند ≥ 4.5:1 (۲۲ جفت)
- [x] Mock پایدار motion/react برای jsdom (`src/test/motionMock.tsx`)
- [ ] ماتریس کامل تست: dark×light × LTR×RTL (الان dark/LTR پوشش داده شده)
- [ ] تست رفتاری برای ۱۵ کامپوننت باقی‌مانده (Progress, Skeleton, Badge…)
- [ ] (اختیاری فاز ۲) Visual regression با Playwright screenshots

> **نتیجه واقعی گیت‌ها (اولین اجرا):** ۲ باگ واقعی گرفت — (۱) توکن `muted` روشن و
> `amber-600` زیر آستانه 4.5:1/3:1 بودند → اصلاح شدند؛ (۲) `addToast/removeToast`
> در `AppProvider` بدون `useCallback` بودند → حلقه بی‌نهایت برای هر مصرف‌کننده‌ای که
> در dependency افکت استفاده‌شان می‌کرد → اصلاح شد. ۳۸/۳۸ تست سبز.

**Exit criteria:** جدول بالا تماماً PASS + CI سبز + axe صفر تخلف.

---

## Phase 2 — Package Engineering (npm-ready)

### 2.1 کامپوننت‌ها باید self-contained شوند ⚠️ (بزرگ‌ترین refactor)
الان ۱۵ کامپوننت به `useApp()` (کانتکست اپ) وابسته‌اند برای theme.
- [x] حذف وابستگی `useApp` از primitives → `src/components/ui/theme.ts` با `useIsDark()`
  (`useSyncExternalStore` + MutationObserver روی کلاس `.dark`/`.light` ریشه — reactive به سوییچ تم اپ،
  SSR-safe، بدون context) — **۱۳ primitive جدا شد** (Accordion, Badge, Breadcrumb, Checkbox, Dropdown,
  Kbd, ObjectCard, Progress, SafaBrandLogo, SegmentedControl, Skeleton, Slider, Switch + TokensAuditPlayground)
- [x] مرز معماری مستند شد: Toast (الگوی shadcn Toaster)، TopHeader، BottomNavigation کامپوزیت‌های
  app-level می‌مانند (nav/toast state ذاتاً context-دارند)؛ LinearIssueTracker فقط `addToast` می‌گیرد
- [ ] مهاجرت تدریجی JS branching → CSS variables (`.dark`/`.light`) برای حذف رندرهای دوبل کلاس‌ها
- [ ] حذف هر business logic / import از بیرون `src/components/ui`
- [ ] فرمول پذیرش: هر فایل کامپوننت فقط `react` + `radix-*` + `motion/react` + `clsx`/`tailwind-merge` + `lucide-react`

### 2.2 Build کتابخانه — ✅ DONE
- [x] Vite lib mode (`vite.config.lib.ts` جدا از اپ): ESM + CJS از entry خالص `kit.ts` — 72KB / 15KB gzip، صفر ارجاع به context های اپ (تأیید با grep gate)
- [x] `d.ts` با `tsc -p tsconfig.lib.json` (emitDeclarationOnly) → `dist-kit/types`
- [x] manifest پابلیش تولیدی (`scripts/build-kit-manifest.mjs`): exports map، types، sideEffects فقط CSS، peerDeps react 18/19
- [x] Ship CSS: `safa.css` (منبع واحد `src/styles/safa.css`) + `dark.css`/`light.css` تولیدی (no-JS default با استخراج بلوک‌ها در build time)
- [x] `npm pack --dry-run` تمیز: ۳۶ فایل، 64KB — شامل CLI و registry snapshot

### 2.3 نسخه‌دهی
- [ ] Changesets → CHANGELOG.md + semver خودکار
- [ ] برندینگ پکیج: نام نهایی (@99/ui یا safa-ui)، description، keywords، repository

**Exit criteria:** `npm publish --dry-run` تمیز + نصب smoke در اپ خالی موفق.

---

## Phase 3 — shadcn-style Registry + CLI — ✅ DONE

- [x] `public/registry.json` با schema کامل shadcn — **تولید از سورس** (`scripts/build-registry.mjs`):
  ۲۷ آیتم (۲۵ registry:ui + 1 registry:lib `utils` + 1 registry:theme `safa-theme`)،
  dependencies از importهای واقعی، content اینلاین، registryDependencies انتقالی (button→utils، segmented→theme، feedback→button)، kebab-case
- [x] CLI صفر-وابستگی (`scripts/cli.mjs` → bin `ui99` داخل پکیج): `init` (components.json)،
  `add` (رزولوشن انتقالی + کپی به target path + نصب با PM شناسایی‌شده + `--dry-run`)، `list`
- [x] Hosted registry: GitHub raw (`REGISTRY_URL` override با env) + snapshot داخل پکیج برای offline
- [x] Smoke تست واقعی: پروژه تمیز → `add button segmented-control` → ۴ فایل + ۵ dep صحیح
- [ ] Preset themes اضافی (porcelain به‌عنوان registry:theme جدا) — ساختار آماده است

**Exit criteria:** یک پروژه Vite خالی با `ui99 init && ui99 add button dialog` زیر ۲ دقیقه آماده است.

---

## Phase 4 — Docs & Product Website

- [ ] ارتقای UIKitView به docs کامل: صفحه per-component (پیش‌نمایش زنده + کد کپی + جدول props + نکات a11y + لینک به سکشن استاندارد مرتبط)
- [ ] Foundations: صفحات داده‌محور از `docs/standards.md` (رنگ/تایپوگرافی/فاصله/موشن/فوکوس) با پیش‌نمایش تعاملی TokensAuditPlayground
- [ ] صفحه npm install + CLI + registry usage
- [ ] Search (cmdk) در docs + زبان EN/FA + تم‌سوئیچ
- [ ] Deploy سایت (static) روی Freebuff hosting + دامنه + OG images

**Exit criteria:** سایت داکیومنت لایو، لینک‌شده از README و npm.

---

## Phase 5 — Launch & Governance

- [ ] README.md حرفه‌ای (EN): hero، install، preview GIF، badge‌ها (npm/CI/coverage/PRs welcome)
- [ ] LICENSE (MIT) + CONTRIBUTING.md + CODE_OF_CONDUCT.md + issue templates
- [ ] GitHub Actions: PR → typecheck+test+axe+contrast+build؛ main → changesets release + npm publish (NPM_TOKEN) + deploy docs
- [ ] releases: `v1.0.0` روی npm + GitHub Release notes
- [ ] Announce: Twitter/X، Reddit r/reactjs، HackerNews Show، Vazir/فارسی کمیونیتی‌ها

**Exit criteria:** `npm i @99/ui` برای عموم + سایت لایو + CI خودکار از این به بعد نگهبان کیفیت.

---

## نگه‌داشت پیوسته (همیشگی)

- هر PR جدید UI → چک‌لیست `docs/standards.md` §12 (اجباری، AGENTS.md §6)
- هر کامپوننت جدید → ورود به جدول Phase 1.1 قبل از merge
- هر تغییر توکن → به‌روزرسانی همزمان: `tokens/index.ts` + `index.css` + `docs/standards.md`
- Versioning: semver سخت‌گیرانه؛ breaking change فقط با changeset + migration note
