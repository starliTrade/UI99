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
| Toast | ✅ | n/a | ✅ | ✅ | ❌ dismiss key | **FIX** |
| SegmentedControl | ✅ | ✅ | ✅ | ⚠️ | ❌ roving tabindex | **FIX** |
| Dropdown (custom select) | ⚠️ | ✅ | ✅ | ⚠️ | ❌ Esc/Arrow/Trap | **FIX** |
| Tooltip | ⚠️ | n/a | ✅ | ⚠️ | ❌ focus trigger | **FIX** |
| Slider | ✅ | ✅ | ✅ | ❌ RTL track | ✅ | **FIX** |
| Progress / Badge / Kbd | ✅ | n/a | ✅ | ✅ | n/a | PASS (Kbd: کلاس‌های نامعتبر h-4.5) |
| Skeleton | ✅ | n/a | ✅ | ✅ | n/a | PASS |

### 1.2 رفع تخلفات شناخته‌شده
- [ ] Dropdown: تبدیل به ARIA combobox کامل یا مهاجرت به Radix Select — Esc/Arrow/Type-ahead/Focus-trap
- [ ] SegmentedControl: roving tabindex + Arrow keys + `role="radiogroup"`
- [ ] Toast: dismiss با Escape، pause-on-hover، سقف ۳ پیام همزمان
- [ ] Tooltip: فوکوس‌پذیری trigger (الگوی Radix)، بدون `cursor-default` اجباری
- [ ] Slider: RTL معکوس‌شدن track + aria-valuetext
- [ ] Kbd: حذف کلاس‌های نامعتبر `h-4.5` / `h-5.5` (Tailwind v4 Accepts arbitrary؛ استاندارد: h-4/h-5)
- [ ] Sweep نور (light mode) و RTL روی همه ویوها (`src/components/views`, `home`, `shells`)

### 1.3 گیت‌های خودکار (CI-blocking)
- [ ] Vitest + @testing-library/react — تست رفتاری برای هر کامپوننت (render, interaction, controlled)
- [ ] jest-axe روی هر کامپوننت (الگو: shadcn — تخلف صفر)
- [ ] اسکریپت کنتراست CI با استفاده از `src/core/tokens/math.ts` → assert تمام جفت‌های متن/بک‌گراند ≥ 4.5:1
- [ ] ماتریس تست: dark×light × LTR×RTL
- [ ] (اختیاری فاز ۲) Visual regression با Playwright screenshots

**Exit criteria:** جدول بالا تماماً PASS + CI سبز + axe صفر تخلف.

---

## Phase 2 — Package Engineering (npm-ready)

### 2.1 کامپوننت‌ها باید self-contained شوند ⚠️ (بزرگ‌ترین refactor)
الان ۱۵ کامپوننت به `useApp()` (کانتکست اپ) وابسته‌اند برای theme.
- [ ] حذف وابستگی `useApp` از primitives → استایل با CSS variables (`.dark`/`.light` classes) + `data-theme`، نه JS branching
- [ ] حذف هر business logic / import از بیرون `src/components/ui`
- [ ] فرمول پذیرش: هر فایل کامپوننت فقط `react` + `radix-*` + `motion/react` + `clsx`/`tailwind-merge` + `lucide-react`

### 2.2 Build کتابخانه
- [ ] Vite lib mode (یا tsdown): خروجی ESM + CJS + `d.ts` (tsc --emitDeclarationOnly یا api-extractor)
- [ ] `package.json` پابلیش: `exports` map، `types`، `sideEffects: false`، `files: ["dist"]`، peerDeps (react ^18||^19, react-dom, tailwindcss ^4)
- [ ] Ship `safa.css`: تمام CSS variables توکن‌ها به صورت یک stylesheet importable + Tailwind v4 `@theme` preset
- [ ] تست `npm pack` → نصب تمیز در پروژه Vite خالی (smoke script)

### 2.3 نسخه‌دهی
- [ ] Changesets → CHANGELOG.md + semver خودکار
- [ ] برندینگ پکیج: نام نهایی (@99/ui یا safa-ui)، description، keywords، repository

**Exit criteria:** `npm publish --dry-run` تمیز + نصب smoke در اپ خالی موفق.

---

## Phase 3 — shadcn-style Registry + CLI

- [ ] ارتقای `public/registry.json` به schema کامل shadcn registry (هر کامپوننت: files, dependencies, registryDependencies, cssVars, docs)
- [ ] CLI: `npx ui99 add button` → fetch registry → نصب deps → کپی سورس در پروژه کاربر (چون کپی-سورس است، مثل shadcn کاربر مالک کد می‌شود)
- [ ] Hosted registry (GitHub raw / docs site) + کش CDN
- [ ] Preset themes در registry: `obsidian` (پیش‌فرض) / `porcelain` + سواپ accent
- [ ] `components.json` استاندارد برای پروژه‌های مصرف‌کننده + generator آن (`ui99 init`)

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
