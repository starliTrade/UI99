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
| **Phase 6** | آماده‌سازی انتشار نهایی، Changesets و پکیج رسمی | 🚀 اولویت جاری | 40% |

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

## ⏳ Phase 6 — انتشار رسمی، نسخه‌بندی و حاکمیت پروژه (Final Release) (گام بعدی)
- [ ] راه‌اندازی سیستم خودکار نسخه‌بندی Changesets
- [ ] انتشار رسمی نسخه ۱.۰.۰ روی رجیستری عمومی npm (`@99/ui`)
- [ ] نهایی‌سازی فایل‌های README، CONTRIBUTING و راهنمای مشارکت عمومی
- [ ] تست نهایی E2E و ممیزی کیفی در محیط‌های مختلف
