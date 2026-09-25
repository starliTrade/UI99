# UI \ [99] Design System — Standards & Audit Reference (Build 02.3)

> معیارهای رسمی ممیزی UI \ [99]. هر ویو، ویجت و کامپوننت جدید قبل از ادغام باید از این چک‌لیست عبور کند.
> منابع: Apple HIG، Material Design 3، WCAG 2.2، پژوهش‌های HCI (Fitts / Hick / Miller / Gestalt)، و الگوهای مرجع shadcn/ui + Radix.
>
> **این سند «مکانیزم» است؛ سیاست کجاست؟** سیاست حاکم — اینکه این اعداد برای چه چیزی
> وجود دارند و کجا خط قرمز ماست — در **[`POLICY.md`](POLICY.md)** است. قبل از تغییر یک عدد
> آن را بخوانید؛ قبل از merge یک کامپوننت این را.

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

> **نام‌های واقعی توکن‌ها** (نه `space-1`): مقیاس عددی `--space-*` و چهار
> alias مبتنی بر نیت. ریتم 4px در Tailwind v4 از طریق یک متغیر واحد
> `--spacing: .25rem` **از قبل ساختاری اعمال می‌شود** — `p-4` یعنی
> `calc(var(--spacing) * 4)` = 16px. پس جدول زیر جایگزین ریتم نیست؛
> **زبان نیت** است.

| Token | px | کاربرد |
|---|---|---|
| `--space-hairline` | 2 | فاصله فوق‌العاده تنگه |
| `--space-tight` | 4 | gap ریز آیکون/متن |
| `--space-xs` | 8 | gap المان‌های کوچک |
| `--space-sm` | 12 | gap استاندارد آیتم‌ها |
| `--space-md` | 16 | padding کارت استاندارد |
| `--space-lg` | 20 | — |
| `--space-xl` | 24 | padding فرم/کارت بزرگ |
| `--space-2xl` | 32 | فاصله گروه‌ها |
| `--space-3xl` | 40 | — |
| `--space-4xl` | 56 | فاصله سکشن‌ها |
| `--space-5xl` | 72 | — |
| `--space-6xl` | 96 | فاصله هیرو |

**و چهار alias مبتنی بر نیت — این‌ها هستند که واقعاً باید استفاده شوند:**

| Token | px | کاربرد |
|---|---|---|
| `--space-cluster` | 8 | بین دو آیتم مرتبط در یک گروه |
| `--space-gap` | 12 | بین دو گروه |
| `--space-gutter` | 24 | ریتم افقی سطح صفحه |
| `--space-section` | 56 | ریتم عمودی بین سکشن‌ها |

> **چرا ۸ گام عددی عملاً تکراری‌اند:** `2·4·8·12·16·20·24·32·40` دقیقاً همان
> اعدادی هستند که Tailwind از قبل تولید می‌کند. جایگزینی `p-4` با
> `space-md` حدود ۹۰۰ فراخوان را بدون تغییر یک پیکسل تغییر می‌دهد. سه گام
> `56·72·96` و چهار alias نیت‌محور، تنها بخش‌هایی هستند که ارزش افزوده دارند.

**قوانین:**
- هر فاصله مضرب 4px (استثنا: hairline 1px و half-step 2px برای icon-to-text tight pairs).
- Container padding ≥ inner gap همیشه (`auditContainerPadding`).
- **مقادیر responsive را با alias ثابت جایگزین نکن.** `space-gutter` یک
  `padding-inline` ثابت است؛ اعمال آن روی `px-3 sm:px-6 lg:px-8` گوتر
  واکنش‌گرا را به ۲۴px ثابت تخت می‌کند و موبایل را می‌شکند. aliasها
  برای ریتم static و تکرارشونده‌اند.
- gap label↔control فرم: 6–8px؛ gap کارت↔کارت: 8–16px؛ gap سکشن↔سکشن: 32–64px.
- Magic number ممنوع — فقط token.

## 3.1 اندازه آیکون — پنج سایز نوری + دو سایز نقطه

| Token | px | کاربرد |
|---|---|---|
| `--icon-xs` | 12 | هم‌تراز با متن caption، ردیف‌های متراکم جدول |
| `--icon-sm` | 14 | داخل دکمه‌ها و کنترل‌های متراکم |
| `--icon-md` | 16 | **پیش‌فرض**: بدنه، آیتم ناوبری، ردیف لیست |
| `--icon-lg` | 20 | کنترل‌های مستقل، نوار ابزار |
| `--icon-xl` | 24 | نشانه feature، تصویر empty-state |
| `--icon-dot` | 8 | نقطه حضور (presence dot) |
| `--icon-dot-lg` | 10 | همان سیگنال، یک پله بلندتر |

**دو قانون که این مقیاس را نگه می‌دارد:**

1. **مقیاس باید پیش‌فرض خودش را داشته باشد.** نسخه‌ی اول چهار پله بود
   (`12/14/18/24`) و **۱۶px را نداشت** — رایج‌ترین سایز آیکون در کیت با ۳۵۱
   فراخوان. مقیاسی که پرکاربرد‌ترین پله‌اش بی‌نام باشد، مقیاس نیست؛ فقط
   یعنی همه `w-4` می‌نویسند. نردبان از روی اندازه‌های واقعی بازسازی شد.
2. **نقطه، آیکون کوچک نیست.** نقطه‌ها `rounded-pill` توپرِ حضور هستند، نه
   گلیف. اسم جدا دارند و تست تضمین می‌کند همیشه زیر `icon-xs` بمانند.

**دروازه عمداً باریک است:** فقط روی یک جفت `w-N h-N` **روی عنصر کامپوننت**
 firing می‌کند. یک خط جداکننده‌ی ۱۶px یا چک‌باکس ۱۸px، آیکون نیست — و
نام‌گذاری‌شان `icon-md` بدتر از عدد خام است، چون *حکمرانی‌شده به نظر می‌رسد*
در حالی که معنایشان را عوض می‌کند.

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

## 5b. Elevation · Rim · Glow — سیستم سایه (الزامی)

> **چرا این سند وجود دارد:** ممیزی elevation نشان داد کیت **۲۶۶ مقدار
> `shadow-[…]` / `rounded-[Npx]` / `blur-[Npx]` دست‌نویس** در ۶۵ فایل داشت.
> یعنی سایه ۲۶۶ بار تصمیم گرفته شد و هرگز یک بار با هم مقایسه نشد. نتیجه،
> ظاهری «نرم» داشت ولی زبان مشترک نداشت. این سند آن زبان را می‌سازد.

### 5b.1 اصل حاکم

> **سایه یک تصمیم سیستمی است، نه تصمیم call-site.**
> اگر ارقام سایه/شعاع/بلور داخل یک کامپوننت نوشته شود، آنجا یک تصمیم طراحی
> گرفته شده — و دوباره گرفته خواهد شد. `tokens-gate` این را در CI می‌بندد.

### 5b.2 مقیاس Elevation — پنج سطح

| توکن | کاربرد | چرا |
|------|--------|-----|
| `--elevation-0` | سطح صفحه، فلت | پیش‌فرض؛ بدون سایه |
| `--elevation-1` | کارت، آیتم لیست | لیفت حداقلی |
| `--elevation-2` | کارت تعاملی، hover اولیه | حضور بصری |
| `--elevation-3` | کارت hover، sheet، popover | واضح بالای صفحه |
| `--elevation-4` | dropdown، tooltip، drawer | شناور |
| `--elevation-5` | modal، دیالوگ مسدودکننده | بالاترین لایه |

**قواعد:**
- بالاتر از `--elevation-5` وجود ندارد. اگر می‌خواهی چیزی «بیشتر» بالا بیاید،
  **لایه (z-index token) را عوض کن، نه شدت سایه را.**
- هر کامپوننت در هر لحظه فقط **یک** سطح elevation دارد. `hover:` می‌تواند
  یک پله بالاتر برود (`--shadow-card` → `--shadow-card-hover`).

### 5b.3 Rim — لبه‌ی اسپکولار

در تم تیره، سایه تقریباً نامرئی است (سطح تقریباً سیاه است). چیزی که کارت را از
بوم جدا می‌کند، **rim** است — یک خط نور ۱ پیکسلی روی لبه‌ی بالا، مثل فلز
برس‌خورده زیر یک منبع نور نرم.

| توکن | شدت |
|------|------|
| `--rim-subtle` | ۰٫۰۳۵ — تقریباً نامرئی |
| `--rim-soft` | ۰٫۰۵ — پیش‌فرض کارت |
| `--rim-strong` | ۰٫۰۸ — کارت hover |
| `--rim-crisp` | rim + خط ۱px دور تا — glass و overlay |

**قانون:** کانتینر بدون rim بماند فلت (`--rim-*` نداشته باشد). rim یک تصمیم
است، نه تزئین پیش‌فرض.

### 5b.4 Glow — هاله‌ی لهجه (نه elevation!)

Glow با سایه فرق دارد: سایه می‌گوید «این بالاست»، glow می‌گوید «این زنده/فعال
است». **هرگز** این دو را قاطی نکن.

سه سطح فقط — و این محدودیت عمدی است:

| توکن | شعاع | کاربرد |
|------|------|--------|
| `--glow-*-sm` | ۶px | نشانگر وضعیت، نقطه فعال |
| `--glow-*-md` | ۱۴px | کنترل فعال |
| `--glow-*-lg` | ۲۸px | حالت زنده/ضبط |

- `--glow-accent-*` (emerald) · `--glow-rose-*` · `--glow-warning-*` ·
  `--glow-danger-*` · `--glow-focus-*` · `--glow-current-*` (برای داده‌محور،
  رنگ از خود عنصر)
- **قانون:** هرگز شعاع glow را دستی ننویس. سطح را انتخاب کن، شعاع توکن است.
- در تم روشن glow به سایه رنگی زیر عنصر تبدیل می‌شود و شعاعش نصف می‌شود.

### 5b.5 ترکیب‌های آماده (Shadow Composites)

برای موارد پرتکرار، ترکیب‌ها توکن شده‌اند:

| توکن | = rim + elevation |
|-------|-------------------|
| `--shadow-card` | rim-soft + elevation-2 |
| `--shadow-card-hover` | rim-strong + elevation-3 |
| `--shadow-popover` | rim-crisp + elevation-4 |
| `--shadow-modal` | rim-crisp + elevation-5 |
| `--shadow-inset-well` | فرورفتگی (ورودی‌ها، جعبه‌های sunken) |
| `--shadow-pressed` | حالت فشرده |

### 5b.6 Radius — به §5c ارجاع داده شد

مقیاس Radius اکنون یک استاندارد کامل و مستند است: **[§5c](#5c-rounded--استاندارد-گردی-الزامی)**.
از جایگزینی دوباره‌ی این بخش بپرهیزید — مقیاس فقط در
`src/styles/ui99-elevation.css` §RADIUS و `src/core/tokens/index.ts` → `rounded`
تعریف می‌شود.

### 5b.7 Accent Bar

`--accent-bar` نوار وضعیت ۲px روی لبه‌ی ردیف است. پیش‌تر
`inset 2px 0 0 0 #10B981` دستی نوشته شده بود و نامی نداشت.

### 5b.8 چه چیزی دیگر ممنوع است

| ممنوع | درست |
|-------|------|
| `shadow-[0_20px_48px_rgba(0,0,0,0.7)]` | `shadow-(--elevation-4)` |
| `rounded-[26px]` | `rounded-(--radius-xl)` |
| `blur-[100px]` | `blur-(--blur-ambient)` |
| `z-[9999]` | `z-modal` |
| `w-4 h-4` روی یک آیکون | `icon-md` |
| `w-2 h-2 rounded-pill` | `icon-dot` |
| گام فاصله بدون توکن | `--space-*` |

> **تفاوت مهم با بقیه سطرهای جدول:** `shadow` و `rounded` و `blur` از
> short-hand پارانتزی `(--token)` استفاده می‌کنند، ولی **`z-index` این short-hand
> را ندارد**. نوشتن `z-(--z-modal)` بی‌صدا کامپایل *نمی‌شود* — دقیقاً همان
> باگی که در بخش ۵ (incident رادیوس) ۱٬۰۵۰ کلاس را از کار انداخت. برای همین
> لایه‌ها با `@utility` تعریف شده‌اند و شکل درستشان `z-modal` است.

## 5c. Rounded — استاندارد گردی (الزامی)

> «رِندِر» یک تصمیم سلیقه‌ای نیست. یک تابع از **پدینگ** است.

### 5c.1 قانون واحد

```
outer radius  =  inner radius  +  فاصله‌ی پدینگ بین آن‌ها
```

همان قانون iOS HIG و Material 3. یعنی گوشه **هرگز** با چشم انتخاب نمی‌شود و
هرگز تابعی از پهنای عنصر نیست — تابعی از پدینگ است. به همین دلیل وقتی یک کارت
داخل یک کارت داخل یک sheet قرار می‌گیرد، تودرتویی (concentricity) **خودکار** و
بدون اینکه کسی به آن فکر کند حفظ می‌شود.

دو محدودیت، هر دو الزامی:

1. **تودرتویی (نesting):** گوشه از پدینگ مشتق می‌شود. ↑↑
2. **سقف تناسب (proportion):** شعاع ≤ نصف ضلع کوتاه‌تر عنصر — مگر آنکه واقعاً
   pill/avatar/switch باشد. این قانون ضدّ «همه گرد گرد» است.

### 5c.2 مقیاس ۱۳ پله‌ای

| توکن | px | باند پدینگ | کاربرد |
|---|---:|---|---|
| `--radius-none` | 0 | — | flush، ردیف جدول، رسانه‌ی لبه‌به‌لبه |
| `--radius-xs` | 8 | ۱–۴ | کنترل‌های میکرو ۱۶–۲۴px، تگ، نقطه‌ی وضعیت |
| `--radius-sm` | 12 | ۶–۸ | کنترل ۲۸–۳۲px، چیپ، دکمه‌ی کوچک |
| `--radius-field` | 14 | ۱۰–۱۲ | input، جست‌وجو، combobox |
| `--radius-control` | 18 | ۱۴–۱۶ | کنترل ۴۰–۴۴px: دکمه، toggle، ردیف |
| `--radius-md` | 22 | ۱۶–۲۰ | **کارت — سطح پیش‌فرض** |
| `--radius-lg` | 26 | ۲۰–۲۴ | کارت بزرگ، پنل، popover |
| `--radius-xl` | 32 | ۲۴–۳۲ | sheet، drawer، پنل hero |
| `--radius-2xl` | 36 | ۳۲–۳۶ | modal، side panel |
| `--radius-sheet` | 40 | ۳۶–۴۴ | bottom sheet، دیالوگ موبایل |
| `--radius-3xl` | 48 | ۴۴–۵۶ | sheet تمام‌صفحه |
| `--radius-4xl` | 64 | ۵۶+ | billboard |
| `--radius-pill` | 9999 | — | pill، آواتار، badge، switch — پایانی تعریفاً |

مقادیر در باند iOS 26 می‌نشینند (گردتر از iOS 17) — این هویت «velvet obsidian» است.

> `3xl`/`4xl` فقط برای یک دلیل وجود دارند: ما عمداً متغیرهای `--radius-*` خودِ
> Tailwind را override می‌کنیم. اگر آن‌ها تعریف نشوند، `rounded-3xl` روی ۲۴px
> Tailwind می‌افتد که **کوچک‌تر** از `2xl` ما (۳۶px) می‌شود.

### 5c.3 منبع حقیقت واحد

دو نسخه از این مقیاس وجود داشت (`--radius-card-*` در `ui99.css` در کنار
`--radius-*` در `ui99-elevation.css`) و به‌مرور از هم فاصله گرفتند. حالا فقط یکی
هست:

- **مرورگر** می‌خواند ← `src/styles/ui99-elevation.css` §RADIUS
- **کد** می‌خواند ← `src/core/tokens/index.ts` → `rounded`

تست `tokens.test.ts` تضمین می‌کند این دو هرگز از هم جدا نمی‌افتند.

### 5c.4 چطور استفاده کنیم

```tsx
// درست — گوشه از پدینگ مشتق می‌شود
<Surface padding="lg" />        // → rounded-(--radius-lg)  (۲۶px)

// فقط وقتی یک تصمیم شکلی واقعی است
<Surface padding="lg" rounded="pill" />
```

`Surface`/`Card` پروپ `rounded` را به‌عنوان **escape hatch** نگه می‌دارد، نه
به‌عنوان حالت عادی. `Button` هم یک escape hatch دارد: پروپ `shape`
(`pill` / `rounded` / `square`). اندازه‌ی پیش‌فرض همیشه از قانون می‌آید.

### 5c.5 سینتکس — تنها راه درست

```tsx
rounded-(--radius-sm)        // ✓ کامپایل می‌شود
rounded-(var(--radius-sm))   // ✗ هیچ قانونی تولید نمی‌کند
```

Shorthand توکن در Tailwind v4 **نام خام** پراپرتی را می‌گیرد، نه `var()`.
شکل دوم یک رشته‌ی متفاوت است که Tailwind آن را به یک مقدار تجزیه می‌کند و
**بی‌صدا** هیچ CSS تولید نمی‌کند.

همین برای سایه است — `shadow-(--a, --b)` مقدار قابل تجزه نیست:

```tsx
shadow-(var(--rim-soft), var(--elevation-2))   // ✗ بی‌اثر
shadow-(--shadow-card)                        // ✓ ترکیب نام‌دار
```

> **چرا این یک ریشه‌ی واقعی بود:** حدود ۱۰۵۰ کلاس بی‌اثر (۸۲۷ radius + ۲۱۹
> shadow + ۷ blur) در ۱۱۴ فایل منتشر شده بود. TypeScript تمیز بود، همه‌ی تست‌ها
> پاس می‌شدند، فقط مرورگر گوشه‌های تیز و بدون سایه رندر می‌کرد. قانون D در
> `scripts/tokens-gate.mjs` و تست `token utilities actually compile` هر دو
> شکل مرده را رد می‌کنند.

### 5c.6 چه چیزی ممنوع است

- انتخاب گوشه بدون پدینگ («چون به نظر بهتر می‌آید» ← دلیل شکست سیستم بود)
- `rounded-(var(--x))` یا هر شکل چندتوکنیِ un-named
- تکرار یک شعاع در دو پله‌ی اندازه — مگر پله‌های کف (`none`/`xs`) که برای
  عناصر زیر ۲۸px وجود دارند، یا دو پله با ارتفاع یکسان
- داشتن بیش از یک جای تعریف برای مقیاس

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
7. `bun run tokens:gate` — سه قانون خودکار: hex ممنوع، مقدار ساختاری دلخواه
   (`shadow-[…]` / `rounded-[Npx]` / `blur-[Npx]`)، و ارجاع به توکن اعلام‌نشده.
8. `bun run registry:build && bun run registry:validate` — رجیستری و شمارش.
