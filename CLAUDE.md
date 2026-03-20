# CLAUDE.md
## Свадебный сайт — IGOR & KATSIARYNA (Юрастовы)

> **Читать ПЕРВЫМ перед любой задачей.**
> Этот файл — единственный источник правды о проекте. Обновлять после каждого изменения.

---

## 🎯 О проекте

Мобильный свадебный сайт-приглашение в **акварельном стиле**, архитектура — tab-shell (как нативное приложение).

| | |
|---|---|
| Жених | Игорь Юрастов |
| Невеста | **Екатерина** Юрастова |
| Дата | **24 апреля 2026, 16:00** |
| Место | **GRAND CHALET, д. Большие Новосёлки, ул. Садовая 37Б** |
| Трансфер | автобус от метро Восток в **14:30** |

Ощущение: **нежность, романтика, судьба, взросление, семейное тепло.**

---

## ⚙️ Технологии

```
React 18 + TypeScript + Vite
CSS Modules (НЕ inline, НЕ styled-components)
Framer Motion  — анимации появления, stagger, parallax, AnimatePresence
lucide-react   — иконки
canvas-confetti — конфетти (QuizFunnel)
ics            — генерация .ics файла (Calendar)
```

```bash
npm install && npm run dev
```

---

## 📁 Реальная структура (актуально на 20.03.2026)

```
src/
 ├── app/
 │   ├── App.tsx             ← точка входа, таб-навигация
 │   └── App.module.css
 │
 ├── shared/
 │   ├── assets/
 │   │   ├── детское игорь.png       ✅ подключено в Hero
 │   │   ├── детское екатерина.png   ✅ подключено в Hero
 │   │   ├── знакомство.JPG          ✅ StoryGallery
 │   │   ├── первое свидание.PNG     ✅ StoryGallery
 │   │   ├── начало отношений.jpg    ✅ StoryGallery
 │   │   ├── армия.jpg               ✅ StoryGallery
 │   │   ├── воссоединение.jpg       ✅ StoryGallery
 │   │   └── предложение.JPG         ✅ StoryGallery
 │   └── styles/
 │       ├── variables.css   ← все CSS-токены
 │       └── global.css
 │
 ├── sections/
 │   ├── Hero/               ✅ готово — детские фото + SVG декор
 │   ├── Welcome/            ✅ готово — word-by-word анимация
 │   ├── TelegramContest/    ✅ готово — конкурс «Горько!»
 │   ├── StoryGallery/       ✅ готово — горизонтальная галерея
 │   ├── WeddingTimeline/    ✅ готово — программа дня
 │   ├── Location/           ✅ готово — карта + транспорт
 │   ├── Calendar/           ✅ готово — .ics скачивание
 │   ├── QuizFunnel/         ✅ готово — 9-шаговая форма гостей
 │   ├── Gifts/              ✅ готово
 │   ├── Dresscode/          ✅ готово
 │   ├── FAQ/                ✅ готово — accordion
 │   ├── Contacts/           ⚠️  placeholder телефоны
 │   ├── GuestBook/          ✅ готово
 │   └── Footer/             ✅ готово
 │
 ├── components/
 │   ├── Background/         ✅ parallax лепестки
 │   ├── AppBar/             ✅ обратный отсчёт
 │   ├── BottomNav/          ✅ 5 табов с pill-анимацией
 │   ├── RingsLogo/          ✅ SVG кольца
 │   ├── MusicPlayer/        ✅ фиксированный плеер
 │   ├── CoupleLines/        ✅ GSAP SVG-линии
 │   ├── ScrollLine/         ✅ прогресс-бар
 │   └── Header/             (не используется в App.tsx)
 │
 └── main.tsx
```

---

## 🗂 Таб-структура App.tsx

| Таб | id | SCROLLABLE | Секции |
|---|---|---|---|
| Главная | `home` | `true` | Hero → Welcome → TelegramContest |
| История | `story` | `false` | StoryGallery (свой горизонтальный скролл) |
| Программа | `day` | `false` | WeddingTimeline → Location → Calendar |
| Гости | `rsvp` | `false` | QuizFunnel (управляет скроллом сам) |
| Инфо | `info` | `true` | Gifts → Dresscode → FAQ → Contacts → Footer |

**Важно:** `screenFixed` = `overflow: hidden; overscroll-behavior: none; touch-action: none`
Секции Story/QuizFunnel перезаписывают `touch-action` для своих scroll-элементов.

---

## 🎨 СКИЛ: Дизайн-система (актуальные токены)

### Цвета (variables.css)
```css
--bg-color:          #FDF0EE   /* тёплый розово-кремовый фон */
--text-primary:      #5C1622
--text-secondary:    #8B3A4A
--accent-gold:       #C9A227
--accent-wine:       #6B1A2A   /* бордо — главный акцент */
--accent-rose:       #EDD0D0
--accent-rose-dark:  #D6AFAF
--accent-dusty-rose: #C4959A
--accent-blue:       #B8D4E3
--accent-green:      #C5D5C0
--text-warm-dark:    #2C1A1E
--text-warm-muted:   #9A8080
--divider-warm:      rgba(107, 26, 42, 0.10)
```

### Шрифты
```css
--font-script: 'Great Vibes', cursive       /* декоративные имена, Hero, Footer */
--font-serif:  'Playfair Display', serif    /* заголовки секций h2 */
--font-sans:   'Montserrat', sans-serif     /* весь остальной текст */
```
> ⚠️ В CLAUDE.md ранее было неверно — `--font-serif` это **Playfair Display**, не Great Vibes.

### Spacing (актуально)
```css
--spacing-xs:  4px
--spacing-sm:  8px
--spacing-md:  16px
--spacing-lg:  36px    /* ← было 24, увеличено пользователем */
--spacing-xl:  40px
--spacing-xxl: 64px
```

### Скругления
```css
--radius-card:  2rem    /* крупные блоки */
--radius-group: 2rem    /* списки, FAQ */
--radius-pill:  100px   /* кнопки, бейджи */
--border-radius-sm:   10px
--border-radius-md:   18px
--border-radius-lg:   26px
--border-radius-full: 9999px
```

### App shell — высоты
```css
--appbar-h:    calc(env(safe-area-inset-top, 0px) + 72px)
--bottomnav-h: calc(env(safe-area-inset-bottom, 0px) + 80px)
--screen-h:    calc(100dvh - var(--appbar-h) - var(--bottomnav-h))
```

---

## ✨ СКИЛ: Framer Motion анимации

### Стандартные variants
```ts
const slideFromLeft  = { hidden: { opacity: 0, x: -44 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }
const slideFromRight = { hidden: { opacity: 0, x: 44  }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }
const fadeUp         = { hidden: { opacity: 0, y: 28  }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.32 } } }
const container      = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const scaleIn        = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } } }
```

### Паттерн секции с whileInView
```tsx
<motion.div
  variants={container}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-60px' }}
>
  <motion.h2 variants={fadeUp}>...</motion.h2>
  <motion.div variants={scaleIn}>...</motion.div>
</motion.div>
```

### Паттерн Hero (animate, не whileInView)
```tsx
<motion.div variants={container} initial="hidden" animate="visible">
```
Hero использует `animate` (не `whileInView`) — появляется сразу при загрузке.

### AnimatePresence для переключения состояний
```tsx
<AnimatePresence mode="wait" initial={false}>
  {condition ? (
    <motion.span key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      Вариант А
    </motion.span>
  ) : (
    <motion.span key="b" ...>Вариант Б</motion.span>
  )}
</AnimatePresence>
```

---

## 🌸 СКИЛ: Паттерн SVG-декораций (используется в Hero, Calendar, Location, Welcome, WeddingTimeline, QuizFunnel)

### Структура слоя декораций
```tsx
{/* всегда aria-hidden, pointer-events: none, z-index: 0 */}
<div className={styles.decor} aria-hidden="true">
  <div className={styles.decorRings}><RingsSvg /></div>
  <div className={styles.decorPetal1}><PetalSvg fill="rgba(232,197,197,0.45)" angle={-15} /></div>
  <div className={styles.decorSparkle1}><SparkleSvg /></div>
  <div className={styles.decorHeart1}><HeartSvg /></div>
</div>

{/* контент секции — z-index: 1 */}
<motion.div className={styles.container} ...>
```

### Inline SVG-примитивы (копировать в каждую секцию, не импортировать между секциями)
```tsx
const RingsSvg = () => (
  <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="52" cy="45" r="38" stroke="currentColor" strokeWidth="5" />
    <circle cx="88" cy="45" r="38" stroke="currentColor" strokeWidth="5" opacity="0.65" />
  </svg>
)
const SparkleSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
  </svg>
)
const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)
const PetalSvg = ({ fill = 'rgba(232,197,197,0.45)', angle = 0 }: { fill?: string; angle?: number }) => (
  <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <ellipse cx="25" cy="35" rx="13" ry="26" fill={fill} transform={`rotate(${angle} 25 35)`} />
  </svg>
)
```

### CSS-шаблон декор-слоя
```css
/* Keyframes — всегда дублировать в файле, не импортировать */
@keyframes floatUpDown { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(8deg); } }
@keyframes floatSlow   { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-7px) rotate(-4deg); } }
@keyframes sparkleSpin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.12); } 100% { transform: rotate(360deg) scale(1); } }
@keyframes heartDrift  { 0%,100% { transform: translateY(0) scale(1) rotate(-5deg); opacity: 0.65; } 50% { transform: translateY(-12px) scale(1.08) rotate(5deg); opacity: 1; } }
@keyframes ringPulse   { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.70; } }

.decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.decorRings {
  position: absolute;
  top: -20px; right: -30px;
  width: 160px;
  color: rgba(107, 26, 42, 0.08);
  animation: ringPulse 6s ease-in-out infinite;
}
.decorPetal1 {
  position: absolute;
  bottom: 10%; left: 4%;
  width: 42px;
  animation: floatUpDown 7s ease-in-out infinite 0.5s;
}
.decorSparkle1 {
  position: absolute;
  top: 8px; left: 12px;
  width: 20px;
  color: rgba(201, 162, 39, 0.5);
  animation: sparkleSpin 5.5s linear infinite;
}
```

---

## 💎 СКИЛ: Градиентные кнопки с shimmer (стандарт проекта)

```css
@keyframes shimmer {
  0%   { left: -100%; }
  100% { left: 200%; }
}

.primaryBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 54px;
  padding: 0 var(--spacing-xl);
  width: 100%;
  background: linear-gradient(135deg, var(--accent-wine) 0%, #5C1020 100%);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 20px rgba(107, 26, 42, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
  transition: opacity 0.2s, transform 0.12s;
  min-height: 44px;  /* touch target */
}
.primaryBtn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
  animation: shimmer 2.8s infinite 0.4s;
  pointer-events: none;
}
.primaryBtn:active { transform: scale(0.97); }

/* Gold variant (success/done state) */
.primaryBtnGold {
  background: linear-gradient(135deg, var(--accent-gold) 0%, #9A7018 100%);
  box-shadow: 0 4px 16px rgba(201, 162, 39, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.primaryBtnGold::after { display: none; }
```

---

## 🏷️ СКИЛ: Section label badge (метка раздела)

```tsx
<motion.div className={styles.sectionLabel} variants={fadeUp}>
  <CalendarDays size={13} strokeWidth={2} />
  Сохранить дату
</motion.div>
```

```css
.sectionLabel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-warm-muted);
  padding: 4px 10px;
  background: rgba(107, 26, 42, 0.05);
  border-radius: var(--radius-pill);
  border: 1px solid rgba(107, 26, 42, 0.08);
  align-self: flex-start;
}
```

---

## 📏 СКИЛ: Декоративный разделитель (divider с гемом)

```tsx
<div className={styles.dividerRow}>
  <span className={styles.dividerLine} />
  <span className={styles.dividerGem}>✦</span>
  <span className={styles.dividerLine} />
</div>
```

```css
.dividerRow { display: flex; align-items: center; gap: 10px; width: 200px; }
.dividerLine { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, rgba(107,26,42,0.20), transparent); }
.dividerGem  { font-size: 0.7rem; color: var(--accent-gold); line-height: 1; }
```

---

## 📱 СКИЛ: Адаптив и Safari-fix

### Брейкпоинты
```
Mobile:  до 480px (приоритет — сайт для телефонов)
Tablet:  481px – 768px
Desktop: от 769px   (max-width: 480px на .app)
```

### Safari iOS — обязательные правила
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
```css
/* global.css */
html { background-color: var(--bg-color); overscroll-behavior: none; }
body { overflow: hidden; overscroll-behavior: none; }

/* App.module.css */
.app { height: 100dvh; overflow: hidden; overscroll-behavior: none; touch-action: pan-y; }

/* screenFixed — для табов без вертикального скролла */
.screenFixed { overflow: hidden; overscroll-behavior: none; touch-action: none; }

/* внутри screenFixed — если нужен горизонтальный свайп */
.track { touch-action: pan-x; overscroll-behavior-x: contain; }
```

### Правило высот
- Используй `100dvh` (не `100vh`) — учитывает Safari chrome
- Для контента внутри shell: `height: var(--screen-h)`
- `env(safe-area-inset-top/bottom)` включены в `--appbar-h` / `--bottomnav-h`

---

## 🧩 СКИЛ: Шаблон новой секции

```
sections/MySection/
  ├── MySection.tsx
  ├── MySection.module.css
  └── index.ts   ← export { default } from './MySection'
```

```tsx
import { motion } from 'framer-motion'
import styles from './MySection.module.css'

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const fadeUp    = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

const MySection = () => (
  <section className={styles.section} id="my-section">
    <div className={styles.decor} aria-hidden="true">
      {/* SVG декорации */}
    </div>
    <motion.div
      className={styles.container}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.div className={styles.sectionLabel} variants={fadeUp}>
        {/* icon + label */}
      </motion.div>
      {/* контент */}
    </motion.div>
  </section>
)
export default MySection
```

---

## 🐛 Известные баги и TODO

| Приоритет | Файл | Проблема |
|---|---|---|
| 🔴 HIGH | `Hero.module.css` L369-374 | Nested `img { }` внутри `.portraitFrame` — невалидный CSS Modules синтаксис, не применяется |
| 🟡 MED | `Contacts.tsx` L23,36 | Placeholder телефоны `+375 (XX) XXX-XX-XX` — заменить на реальные |
| 🟡 MED | `Calendar.tsx` L36 | ICS duration 8h (событие до 24:00), должно быть 7h (до 23:00) |
| 🟡 MED | `Location.tsx` L23-24 | Координаты карты — уточнить что это GRAND CHALET |
| 🟢 LOW | `Dresscode.module.css` L62-63 | `.note { padding-top }` перезаписывается следующим `padding` |
| 🟢 LOW | `Wishes.tsx` | Mock-данные, Telegram URL — заглушка `https://t.me/your_group` |
| 🟢 LOW | `FAQ.tsx` | Закомментированные вопросы — убрать или раскомментировать |

---

## 📌 Правила работы (обязательно)

1. **CSS Modules везде** — `Component.module.css` рядом с `Component.tsx`
2. **SVG-примитивы** — определять inline в каждом файле (не импортировать между секциями)
3. **Шрифт для имён/крупных текстов** — `var(--font-script)` (Great Vibes)
4. **Шрифт для UI** — `var(--font-sans)` (Montserrat)
5. **TypeScript** — типизировать все пропсы через `interface`, не `any`
6. **Touch targets** — кнопки минимум `44px` по высоте (`min-height: 44px`)
7. **Ассеты** — не генерировать fake base64. Принимать файлы от пользователя
8. **Имена** — всегда **Екатерина** (не Катерина), **GRAND CHALET** (не Chatel)
9. **100dvh** — не `100vh`. Высоты через `var(--screen-h)` или `100dvh`
10. **После правки** — обновить таблицу багов выше

---

## 📅 История изменений

| Дата | Что сделано |
|---|---|
| 17.03.2026 | Создан стартер. Написан CLAUDE.md со всеми скилами. |
| 19.03.2026 | Переработан стиль всех секций (паддинги, SVG декор, градиентные кнопки). QuizFunnel — полный редизайн. Hero + Welcome — редизайн. WeddingTimeline, Location, Calendar — новый стиль. |
| 19.03.2026 | Safari fix: viewport-fit=cover, overscroll-behavior, 100dvh, --bg-color определён, safe-area в --appbar-h/--bottomnav-h. |
| 19.03.2026 | Hero: подключены детские фото Игоря и Екатерины. Kicker/tagline — Great Vibes, переставлены вокруг фоток. |
| 20.03.2026 | Исправлено GRAND CHATEL → GRAND CHALET во всех файлах. Катерина → Екатерина везде. |
| 20.03.2026 | Fix Safari scroll: screenFixed touch-action:none, body overflow:hidden, StoryGallery touch-action:pan-x. |
| 20.03.2026 | CLAUDE.md полностью переписан — актуальная структура, реальный статус, расширенные скилы. |
