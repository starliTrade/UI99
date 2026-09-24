# UI \ [99] Design System — Standards & Audit Reference (Build 02.3)

> معیارهای رسمی ممیزی UI \ [99]. هر ویو، ویجت و کامپوننت جدید قبل از ادغام باید از این چک‌لیست عبور کند.
> منابع: Apple HIG، Material Design 3، WCAG 2.2، پژوهش‌های HCI (Fitts / Hick / Miller / Gestalt)، و الگوهای مرجع shadcn/ui + Radix.

---

## 1. دسترسی‌پذیری (WCAG 2.2 — AA الزامی، AAA در نواحی حساس)

| شاخص | معیار | منبع |
|---|---|---|
| متن بدنه | کنتراست ≥ 4.5:1 | WCAG 1.4.3 |
| متن درشت (≥24px یا ≥19px bold) | کنتراست ≥ 3:1 | WCAG 1.4.6 |
| حداقل هدف لمسی iOS | 44×44pt | Apple HIG |
| حداقل هدف لمسی وب | 24×24 CSS px | WCAG 2.5.8 |
| هدف توصیه‌شده لمسی | 44–48px | Material 3 / Apple |
| placeholder | همان 4.5:1 متن بدنه | WCAG 1.4.3 |
| حالت فوکوس | ≥2px، نسبت کنتراست ≥3:1 با مجاور | WCAG 2.4.11/2.4.13 |
| نشانگر خطا | رنگ + icon/text helper (فقط رنگ ممنوع) | WCAG 1.4.1 |
| انیمیشن خودکار > 5s | قابل توقف/پرهیز | WCAG 2.2.2 |

## 2. رنگ — روانشناسی، انسجام و ریاضیات رنگ

### 2.1 نقش‌های معنایی (Semantic Roles)

| Role | Dark | Light | کاربرد |
|---|---|---|---|
| Primary | `#10B981` | `#059669` | CTA اصلی، completion |
| Destructive | `#F43F5E` | `#E11D48` | حذف، خطا، خطر |
| Warning | `#F59E0B` | `#D97706` | هشدار ملایم، sprint فعال |
| Info | `#3B82F6` | `#2563EB` | cloud sync، اطلاع‌رسانی |
| Insight | `#A855F7` | `#7C3AED` | insight، حافظه، synthesis |
| Neutral | zinc scale | zinc scale | متن، بدنه، پس‌زمینه |

### 2.2 قوانین سفت‌وسخت

1. **رنگ جدید ممنوع بدون ثبت در tokens.** هر رنگ باید در `src/core/tokens/index.ts` و همین doc ثبت شده باشد.
2. **رنگ = بار معنایی.** سبز فقط completion/positive، زرد فقط warning/focus، قرمز فقط destructive/urgent، آبی فقط info/sync، بنفش فقط insight/memory. هیچ‌وقت برعکس.
3. **Accent فقط foreground.** رنگ‌های accent فقط روی foreground (متن/آیکون/دکمه)؛ بک‌گراند accent با alpha ≤ 10%. هیچ بلاک بزرگ رنگ اشباع روی canvas.
4. **هیچ رنگ‌آمیزی روانی تصادفی.** هر استفاده از accent باید rationale روانشناسی معتبر داشته باشد (tokens.ts §psychology).
5. **فاصله روشنایی مرز قابل ادراک:** دو سطح مجاور باید diff روشنایی ≥ حداقل ادراک داشته باشند — UI99 audit: dark ≤ 12% و light ≤ 7% بین canvas و surface.
6. **هیچ hard-coded hex جدید.** فقط token یا palette معتبر Tailwind. hard-code = reject در code review.

## 3. فاصله‌گذاری (Spacing) — ریتم 4px

| Token | px | کاربرد |
|---|---|---|
| space-1 | 4 | gap ریز آیکون/متن |
| space-2 | 8 | gap المان‌های کوچک |
| space-3 | 12 | gap استاندارد آیتم‌ها |
| space-4 | 16 | padding کارت استاندارد |
| space-6 | 24 | padding فرم/کارت بزرگ |
| space-8 | 32 | فاصله سکشن‌ها |
| space-16 | 64 | فاصله هیرو/سکشن اصلی |

**قوانین:**
- هر فاصله مضرب 4px (استثنا: hairline 1px و half-step 2px برای icon-to-text tight pairs).
- Container padding ≥ inner gap همیشه (`auditContainerPadding`).
- gap label↔control فرم: 6–8px؛ gap کارت↔کارت: 8–16px؛ gap سکشن↔سکشن: 32–64px.
- Magic number ممنوع — فقط token.

## 4. تایپوگرافی

| سطح | size/line-height | وزن | کاربرد |
|---|---|---|---|
| Display | 32/38 | semibold | هیرو |
| Title 1 | 20/28 | semibold | عنوان صفحه |
| Title 2 | 16/24 | semibold | عنوان کارت |
| Headline | 14/20 | medium | سرصفحه لیست |
| Body | 14/20 | regular | متن بدنه |
| Subhead | 12/16 | regular | secondary |
| Caption | 11/14 | regular | timestamp/helper (حداقل مطلق 11px) |
| Mono | 12/16 | medium | اعداد/کد/Kbd/badge |

**قوانین:**
- هر متن بدنه روی canvas تیره دقیقاً: `#EDEDEF` (primary)، `#92929B` (secondary)، `#5C5C68` (muted).
- متن فارسی: `font-persian`، بدون letter-spacing منفی (حروف چسبیده)، `rtl:text-right` در بلوک‌های RTL.
- متن روی تصویر: scrim با opacity ≥ 55% + AA contrast.
- عرض سطر متن 45–75 کاراکتر (66 ایده‌آل).

## 5. شکل (Radius & Concentricity)

- Concentricity: `r_inner = r_outer − padding` (تابع `calculateConcentricRadius`).
- هیچ surface با radius صفر (به‌جز hairline dividers).
- Full pill فقط: دکمه‌ها، chips، segmented control، status pills.
- Nested surfaces باید concentric باشند (Material 3 shape nesting).

## 6. حرکت (Motion)

### 6.1 Durations (باند Apple HIG 150–500ms + M3 scale)

| تعامل | Duration | Easing |
|---|---|---|
| Hover/press feedback | 120–180ms | `--ease-ui99` |
| Overlays (dialog/sheet/dropdown) | 180–280ms | `--ease-ui99` |
| Tab/page transitions | 280–400ms | `--ease-standard` |
| Skeleton shimmer | 1.2–1.6s loop | linear |
| Toast auto-dismiss | 3–5s | M3 guidance |

### 6.2 Springs
- `spring.snappy` (480/32) — micro-interactions press/hover
- `spring.gentle` (380/28) — layout transitions
- `spring.fluid` (320/24) — layoutId pills/segmented control

### 6.3 Reduced Motion
- تمام انیمیشن‌های تکرارشونده در `prefers-reduced-motion` خاموش یا ≤ 0.01ms (index.css).
- انیمیشن خودکار بدون کنترل کاربر > 5s ممنوع (WCAG 2.2.2).

## 7. ابعاد هدف لمسی

- آیکون‌ب Button ≥ 40×40 (اگر مطلقاً کوچک‌تر، hit-area proxy: pseudo-element بزرگ‌تر).
- Bottom nav icon: 44×44 حداقل.
- حداقل 8px فاصله بین دو target مجاور.
- Slider: h-5 hit area + native `<input type=range>` overlay (الگوی صحیح UI99).

## 8. حالت‌های اجزا (Component States)

### 8.1 پنج حالت اساسی
1. **Default** — حالت پایه
2. **Hover** — `bg-state-hover` (6% white در dark / 4% black در light)
3. **Press/Active** — `active:scale-[0.97]` + press feedback
4. **Focus-visible** — `focus-ui99` double-ring (canvas-gap + emerald ring)
5. **Disabled** — `opacity-40`، بدون feedback تعاملی، cursor-not-allowed

### 8.2 Form Fields
- `aria-invalid`، `aria-describedby` برای helper/error.
- Error: رنگ rose + icon/text helper — نه فقط border.
- readOnly vs disabled: readOnly قابل‌فوکوس ولی non-editable؛ disabled خارج از tab order و submit.
- Error + disabled همزمان: error باید خوانا بماند.

## 9. Overlay (Dialog / Sheet / Popover / Dropdown / Toast)

| قاعده | معیار |
|---|---|
| Focus trap + restore | Radix handles |
| Esc / arrow key nav | Radix handles |
| aria-modal + Title | الزامی |
| Backdrop | scrim ≥ 60% + blur 12–24px |
| Overlay animation | 180–280ms، dismiss با Esc/outside-click همیشه فعال |
| Toast | 3–5s auto-dismiss + dismissible |

## 10. Layout & HCI Laws

- **Fitts's Law:** primary CTA نزدیک‌ترین و بزرگ‌ترین هدف. (ACM CHI)
- **Hick's Law / Miller 7±2:** گزینه‌های تصمیم per view ≤ 7±2؛ لیست‌های طولانی باید گروه‌بندی/جستجو داشته باشند.
- **Gestalt Proximity:** gap داخل گروه < gap بین گروه‌ها.
- Text truncation: line-clamp-2 + `title` attr برای متن کامل (الگوی Linear).
- **Gestalt similarity:** اجزای هم‌نقش هم‌استایل.

## 11. API Design (shadcn/Radix-grade)

- Compound components (Radix style) برای اجزای قابل ترکیب.
- **صفر business logic در UI primitives** — presentational فقط.
- One-way data flow، controlled با explicit props + callbacks.
- TypeScript strict: discriminated unions، بدون `any` در public API.
- forwardRef + displayName + spreadable props + `cn()` merge.
- نام‌گذاری props با convention Radix (`onCheckedChange`) + alias legacy مستند.

## 12. فرآیند ممیزی (Audit Process)

هر PR که UI را تغییر می‌دهد:
1. `bun tsc --noEmit` (type safety).
2. چک‌لیست سکشن‌های 1–11 per-component.
3. تست کیبورد-only: Tab / Shift+Tab / ← → ↑ ↓ / Enter / Space / Escape.
4. تست دو تم (dark/light) × دو جهت (LTR/RTL) × دو viewport (375px / 1440px).
5. Contrast spot-check با `calculateContrastRatio` از `src/core/tokens/math.ts`.
6. کنترل اینکه تغییرات از token system خارج نشده (no hard-coded hex).
