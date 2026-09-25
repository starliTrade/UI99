# UI \ [99] (@99/ui) — Official Engineering Roadmap

> **چشم‌انداز و هدف:** توسعه یک دیزاین‌سیستم و کتابخانه کامپوننت کلاس جهانی (مشابه shadcn/ui و Radix) با تم Obsidian Dark Velvet و Porcelain Light، دسترس‌پذیری گواهی‌شده WCAG 2.2 AAA، معماری ماژولار بدون وابستگی (Self-contained) و ابزار CLI اختصاصی.
>
> **قانون مهندسی:** تمامی مراحل به ترتیب اولویت منطقی و استانداردهای طراحی چیده شده و هر مرحله با چک‌لیست دقیق ارزیابی و تیک می‌خورد.

---

## 📌 نمای کلی فازهای توسعه (Progress Overview)

| فاز | عنوان فاز | وضعیت | پیشرفت |
|---|---|---|---|
| **Phase 0** | پایه‌ها، توکن‌ها و سیستم فوکوس/کنتراست | ✅ تکمیل شد | 100% |
| **Phase 1** | روستر کامل ۶۵+ کامپوننت پریمیتیو | ✅ تکمیل شد | 100% |
| **Phase 2** | مهندسی پکیج npm و استقلال کامپوننت‌ها | ✅ تکمیل شد | 100% |
| **Phase 3** | ریجستری استاندارد و ابزار اختصاصی CLI | ✅ تکمیل شد | 100% |
| **Phase 4** | داکیومنت تعاملی و Playground زنده کامپوننت‌ها | ✅ تکمیل شد | 100% |
| **Phase 5** | بلوک‌های آماده و تمپلیت‌های سازمانی (Blocks) | ✅ تکمیل شد | 100% |
| **Phase 6** | آماده‌سازی انتشار نهایی، Changesets و پکیج رسمی | 🚀 اولویت جاری | 55% |

---

## ✅ Phase 0 — استانداردهای پایه و سیستم توکن‌ها (DONE)
- [x] تدوین مرجع کامل استانداردها در `docs/standards.md` (WCAG 2.2 / Apple HIG / M3 / HCI laws)
- [x] سیستم فوکوس یکپارچه استاندارد دوحلقه‌ای (`focus-ui99` و `focus-ui99-inset` با فاصله ۲ پیکسلی canvas)
- [x] سیستم لایه‌های وضعیت متریال ۳ (`bg-state-hover`, `bg-state-press`, `bg-state-selected`, `bg-state-drag`)
- [x] سیستم رنگ‌شناسی و روانشناسی رنگ با توکن‌های اختصاصی در `src/core/tokens/index.ts`
- [x] موتور محاسباتی کنتراست و آزمون ریاضی روشنایی در `src/core/tokens/math.ts` (کنتراست AAA بالای ۱۶:۱)
- [x] سیستم حرکت، شتاب و منحنی‌های فنری هماهنگ (`--ease-ui99`, `spring.snappy`, `spring.fluid`)

---

## ✅ Phase 1 — روستر کامل ۶۵+ کامپوننت پریمیتیو (DONE)
- [x] **Wave A (Layout & Feedback):** Separator, Label, Toggle, ToggleGroup, HoverCard, Collapsible, ScrollArea, AspectRatio, FormField/Hint/Error, Alert
- [x] **Wave B (Flows & Data Display):** AlertDialog, RadioGroup, Table, Pagination
- [x] **Wave C (Product Patterns):** Stepper, Timeline, FileUpload
- [x] **Wave D (Charts & Micro-Data):** Sparkline (SVG zero-dep), DonutRing, HeatMapCalendar, StatTile, MeterBar, TrendDelta
- [x] **Wave E (Navigation Advanced):** Menubar, NavigationMenu, Sidebar Primitive, CommandBar
- [x] **Wave F (Interactive Heavyweights):** DatePicker, Combobox (cmdk-driven), TimePicker
- [x] **Wave G (Group, Code & Media):** AvatarStack, CodeBlock, Carousel
- [x] **Wave H (Inputs & Polish Finals):** Rating, OTPInput, CopyButton, Swatch, NumberField
- [x] ماتریس کامل Variant × Size × State برای تمام کامپوننت‌ها با دکمه‌های ریسپانسیو و touch target حداقل ۴۴ پیکسل
- [x] ممیزی دسترس‌پذیری با تخلف صفر (Zero axe-core violations) و سازگاری کامل با کیبورد و RTL

---

## ✅ Phase 2 — معماری پکیج مستقل و خروجی کتابخانه (DONE)
- [x] استقلال کامل کامپوننت‌های UI از Context اپلیکیشن (استفاده از `useIsDark` با DOM observation)
- [x] پیکربندی بیلد دوگانه کتابخانه با Vite (`vite.config.lib.ts`) تولید ESM و CJS
- [x] تولید خودکار تایپ‌های تایپ‌اسکریپت (`dist-kit/types`)
- [x] تولید استایل‌شیت‌های مستقل (`ui99.css`, `dark.css`, `light.css`, `porcelain.css`)
- [x] تایید صحت خروجی و پکیجینگ بدون خطا با `npm pack --dry-run`

---

## ✅ Phase 3 — ریجستری و ابزار خط فرمان CLI (DONE)
- [x] تولید ساختار ریجستری مطابق استاندارد shadcn در `public/registry.json`
- [x] اسکریپت بیلد خودکار ریجستری بر مبنای سورس واقعی (`scripts/build-registry.mjs`)
- [x] پیاده‌سازی کامل ابزار CLI صفر-وابستگی (`scripts/cli.mjs`) با دستورات `init`، `add`، `list`
- [x] تست موفق اضافه کردن کامپوننت‌ها به پروژه‌های خارجی به همراه وابستگی‌های انتقالی (Transitive dependencies)

---

## 🚀 Phase 4 — داکیومنت، کاتالوگ و پلی‌گراند زنده تعاملی (DONE ✅)
- [x] بازطراحی نمای داکیومنت (`DocsView.tsx`) با ساختار مدرن ۳ ستونه و سایدبار چسبان
- [x] پیاده‌سازی پنل پیش‌نمایش زنده با تغییر آنی پارامترها (Interactive Live Props Playground)
- [x] امکان کپی کد CLI (`npx @99/ui add ...`)، نصب پکیج و کپی سورس‌کد
- [x] جستجوی زنده در کامپوننت‌ها بر اساس دسته‌بندی و نام
- [x] بخش رسمی دسترسی‌پذیری و مشخصات ناوبری کیبورد (WCAG 2.2 AAA & Keyboard Specs)
- [x] کنترل‌های تعاملی Live Props برای دکمه‌ها، ورودی‌ها، سوییچ‌ها، اسلایدرها و المان‌های پیشرفته

---

## ⚡ Phase 5 — بلوک‌های آماده و تمپلیت‌های سازمانی (Blocks) (DONE ✅)
- [x] پیاده‌سازی کامپوزیت‌های سطح برنامه: Issue Tracker خطی، داشبورد فعالیت، پنل احراز هویت
- [x] ایجاد بخش اختصاصی Blocks (`BlocksView.tsx`) شامل ماژول‌های آماده:
  - Linear Issue Tracker Workflow
  - SSO & Credentials Auth Card Block
  - Tiered Pricing & Plans Matrix Block
  - Real-time Analytics & Deck Block
  - Security & Permissions Settings Panel Block
- [x] سوئیچ لحظه‌ای بین حالت Preview زنده و Code Snippet آماده برای کپی
- [x] هماهنگی ۱۰۰٪ با تم‌های Obsidian Dark و Porcelain Light

---

## ⚡ Phase 6.1 — Sprint 1: توکنایزیشن کامل کیت (Tokenization Sweep) (DONE ✅)
- [x] اسویپ ۷۷ فایل: حذف hex های هاردکد از روستر ۹۲ کامپوننت → `--bg-*` / `--text-*` / `--state-*` / `--border-*`
- [x] افزودن جفت توکن «جوهری» (ink-fill duality) به `src/styles/ui99.css`:
  - `--ink-fill` (روشن: `#111116` جوهر · تاریک: `#EDEDEF` پرسلن) و `--ink-on-fill`
- [x] رفع رگرسیون تم روشن در Button.primary، IconButton.primary/white، Tooltip، white-pill — فیل در تم روشن جوهر تیره شد (قبلاً `--bg-card-hover` خاکستری کم‌کنتراست بود)
- [x] کاپیتول قانون: `bg-(--bg-*)` برای سطح و `--ink-fill` برای فیل معکوس؛ هرگز `text-(--bg-*)` برای متن روی فیل
- [x] توکن‌های intent معنایی: `--intent-rose/-emerald` + `--rose-tint` — پاکسازی ۷ hex از Badge.destructive و شاخه‌های Button destructive/success/rose با حفظ جفت‌های کنتراست تأییدشده
- [x] گیت‌های CI سبز: ۸۵/۸۵ تست (vitest + axe-core + contrast)، `tsc -b` تمیز، registry rebuild ۹۵ آیتم
- [x] **گیت اسکریپتی متصل به CI**: `tokens:gate` (۱۰۳ فایل پاک، لیست ممنوع شامل intent hex ها) + کدمود `tokens:migrate`؛ در `.github/workflows/ci.yml` و `package.json`

## ⚡ Phase 4.2 — Sprint 3: پلی‌گراند All-Props (DONE ✅)
- [x] `AllPropsPlayground.tsx` — آزمایشگاه زنده props برای ۷ پریمیتیو سنگین: DataTable (جستجو/مرتب‌سازی/صفحه‌بندی)، Combobox (ایجاد آپشن)، Slider، Switch، PasswordInput، OTPInput، DatePicker
- [x] کنترل‌های props زنده + JSaX تولیدی قابل کپی لحظه‌ای (الگوی TokensAuditPlayground)، گره به بخش Sandbox در UIKitView
- [x] خودِ پلی‌گراند هم از گیت توکن عبور کرد — کیت ۱۰۰٪ بدون hex سطح/جوهر

## ⚡ Phase 5.2 — Blocks v2 (DONE ✅)
- [x] اسنیپت کد Pricing Matrix کامل شد (۳ پلن، توگل سالانه/ماهانه، badge و CTA) — تب Code دیگر استاب نیست
- [x] بلوک Analytics & Deck به پریمیتیوهای واقعی کیت مهاجرت کرد: StatTile + Sparkline + DonutRing + MeterBar + TrendDelta (پریویو و اسنیپت هم‌خوان)

## ⏳ Phase 6 — انتشار رسمی، نسخه‌بندی و حاکمیت پروژه (Final Release) (گام بعدی)
- [x] راه‌اندازی سیستم خودکار نسخه‌بندی Changesets (`.changeset/` + workflow CI موجود)
- [x] بخش Changelog & Releases در داکس سایت (گاید ششم؛ نسخه از `KIT_VERSION` تولیدشده — بدون درفت با پکیج)
- [ ] انتشار رسمی نسخه ۱.۰.۰ روی رجیستری عمومی npm (`@99/ui`) — نیازمند OTP/دسترسی `npm publish` با اکانت سازمانی
- [x] نهایی‌سازی فایل‌های README، CONTRIBUTING و راهنمای مشارکت عمومی
- [ ] تست نهایی E2E و ممیزی کیفی در محیط‌های مختلف

## ⚡ Audit Sweep (External Audit Pass — P0→P4 DONE ✅)
- [x] **P0.1** مانیفست publish-ready: `files` whitelist کامل، `exports` map (۸ مسیر شامل porcelain + tailwind)، `peerDependencies`، `sideEffects:["**/*.css"]`، ۲۸ runtime dep از منبع مشترک `scripts/kit-deps.mjs` + گیت CI `audit-package.mjs`
- [x] **P0.2** رجیستری shadcn-grade v2.1: ۹۲ کامپوننت با `title/description/category/keywords` (از registryData.ts + fallbackهای کوری‌شده) و `meta.a11y` (پنج حالت + پترن کیبورد + WCAG + RTL)؛ گیت ضد-drift در build-registry
- [x] **P0.3** CLI v2 پلاگ‌بل: زنجیره رزولوشن (flag → components.json → env → repo checkout → bundled snapshot → published URL)، `--registry/--force/--json/--dry-run`، `search`، `resolvedPaths` + remap ایمپورت به alias میزبان
- [x] **P1.4** All-Props Playground: ۷ → ۳۱ کامپوننت سنگین با کنترل props زنده و JSX تولیدی کپی‌شدنی
- [x] **P1.5** ماتریس ممیزی: ۲۰ پریمیتیو axe-clean + گیت disabled (۱۵ کامپوننت) + گیت focus-ui99 — ۳ فیکس a11y واقعی (TagInput aria، RangeSlider aria، Combobox aria-label، گارد disabled در Checkbox) — 122/122 تست سبز
- [x] **P1.6** گیت CI: `registry:validate` (schema + catalog + meta.a11y + dangling refs + کف ۹۵ آیتم) و `audit-package.mjs`
- [x] **P2.7** دروازه کلاس‌های semantic Tailwind v4: `@99/ui/tailwind.css` (ui-btn/ui-card/ui-input/ui-badge از توکن‌ها) در پکیج
- [x] **P2.8** پروتکل دوگانه تم: `data-theme` روی ریشه کنار `.dark/.light` + سوییچر تم کاربر موجود
- [x] **P3.9** SEO: title/description/keywords/canonical/robots/OG/Twitter کامل، JSON-LD SoftwareApplication، `robots.txt`، `sitemap.xml`
- [x] **P3.10** ⌘K Command Palette در DocsView (پرش به ۹۹ سکشن با cmdk کیت خودمان)
- [x] **P3.11** Live Theme Lab (Porcelain↔Obsidian) در FoundationsView با سویچ زنده توکن‌ها
- [x] **P3.12** mobile drawer داکس (Sheet + جستجو) — موجود و تأییدشده
- [x] **P4.13** گوورنس: قالب‌های issue (bug/component-proposal)، قالب PR با چک‌لیست §12، CONTRIBUTING (گیت‌ها + قرارداد متادیتای رجیستری + Changesets)، `docs/RELEASE.md`
