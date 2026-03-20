# Поэтапный план правок

---

## Phase 1 — Токены и фундамент
> Самое важное. Всё остальное строится на этом.
> Затрагивает: `variables.css` → cascade effect на все секции

### 1.1 Добавить новые токены в variables.css
- `--card-bg`, `--card-blur`, `--card-border`
- `--radius-card: 20px`, `--radius-group: 16px`, `--radius-pill: 100px`
- `--shadow-card`, `--shadow-group`
- `--text-warm-dark: #2C1A1E`, `--text-warm-muted: #9A8080`
- `--section-gap: 16px`

### 1.2 Заменить все Apple-цвета на свадебные
Найти и заменить во ВСЕХ .module.css:
- `#1C1C1E` → `var(--text-warm-dark)`
- `#8E8E93` → `var(--text-warm-muted)`
- `#C7C7CC` → `rgba(107, 26, 42, 0.25)` (шевроны)
- Зелёные `#34C759` (phone icon, free badge) → `var(--accent-wine)`
- `rgba(52,199,89,...)` (phone icon bg) → `rgba(107, 26, 42, 0.08)`

### 1.3 Исправить AppBar монограмму
- "И & Е" → "И & К" (Катерина, не Екатерина латиницей)

---

## Phase 2 — Структура Info tab
> Ритм и единообразие Инфо.
> Затрагивает: `App.tsx`, `App.module.css`, все секции Инфо

### 2.1 Добавить infoStack в App.module.css + App.tsx
- `.infoStack` с `display: flex; flex-direction: column; gap: 16px; padding: ...`
- Обернуть `active === 4` в `<div className={styles.infoStack}>`

### 2.2 Убрать индивидуальный section-padding у секций в Инфо
- `Gifts.module.css` — убрать padding с `.section`, оставить только внутренний padding `.card`
- `Dresscode.module.css` — то же самое
- `Contacts.module.css` — то же самое
- `Footer.module.css` — подогнать padding-bottom

### 2.3 Переделать FAQ под новый стиль
- Убрать большой serif title "Вопросы и ответы"
- Добавить small label "ВОПРОСЫ"
- Переделать items на `var(--radius-group)` и `var(--shadow-group)` и `var(--card-bg)`
- Chevron цвет: gold → `rgba(107, 26, 42, 0.4)` (wine приглушённый)

### 2.4 Унифицировать border-radius в Gifts, Dresscode, Contacts
- Все `14px` → `var(--radius-group)` = 16px

---

## Phase 3 — Программа и детали
> Программа tab + мелкие fix по всему сайту.

### 3.1 dayStack для Программы
- Добавить `.dayStack` в App.module.css аналогично infoStack
- Обернуть WeddingTimeline + Location + Calendar в `.dayStack` вместо `.dayRow`
- Все три секции в единой вертикальной колонке с gap

### 3.2 WeddingTimeline
- Заменить event title color `#1C1C1E` → `var(--text-warm-dark)`
- Заменить event desc color `#8E8E93` → `var(--text-warm-muted)`
- `border-radius: 26px` → `var(--radius-card)` = 20px

### 3.3 Location
- Заменить venue/transport text colors `#1C1C1E`, `#8E8E93` → warm
- Chevron `#C7C7CC` → wine мuted
- Free badge: зелёный → wine (`background: rgba(107,26,42,0.08); color: var(--accent-wine); border: 1px solid rgba(107,26,42,0.2)`)
- ChevronRight у venue (ложный affordance) → убрать или сделать ссылкой

### 3.4 Calendar
- Добавить gold top accent `::before` на карту
- `border-radius: 20px` → `var(--radius-card)`
- Кнопка "Добавить" → unified button style

### 3.5 TelegramContest
- `border-radius: 24px` → `var(--radius-card)` = 20px
- Проверить цвета текста
- CTA кнопка → unified button style

### 3.6 Welcome
- Шрифт для длинного текста: `--font-script` → `--font-serif` italic

### 3.7 QuizFunnel — мелкие правки
- Progress bar: добавить "Шаг N из 8" текст
- Option cards: подогнать border-radius к `var(--radius-group)`
- Focus ring на inputs: `outline: 2px solid var(--accent-wine); outline-offset: 2px`
- Back кнопка: добавить ChevronLeft иконку

### 3.8 Dresscode — упростить палитру
- Сократить с 18 кружков до 9 (3 ряда × 3 цвета — самые характерные)
- Или добавить row-label над каждым рядом

---

## Приоритет

| # | Задача | Влияние | Сложность |
|---|--------|---------|-----------|
| 1 | Phase 1.1 Токены | 🔴 Высокое | 🟢 Низкая |
| 2 | Phase 1.2 Apple colors → warm | 🔴 Высокое | 🟢 Низкая |
| 3 | Phase 2.3 FAQ редизайн | 🟠 Среднее | 🟡 Средняя |
| 4 | Phase 2.1-2.2 infoStack | 🟠 Среднее | 🟢 Низкая |
| 5 | Phase 3.3 Location fix | 🟠 Среднее | 🟢 Низкая |
| 6 | Phase 3.2 Timeline fix | 🟡 Низкое | 🟢 Низкая |
| 7 | Phase 3.1 dayStack | 🟡 Низкое | 🟢 Низкая |
| 8 | Phase 3.4-3.5 Calendar/TG | 🟡 Низкое | 🟢 Низкая |
| 9 | Phase 1.3 Монограмма | 🟢 Мелкое | 🟢 Минута |
| 10 | Phase 3.6 Welcome шрифт | 🟡 Низкое | 🟢 Низкая |
| 11 | Phase 3.7 QuizFunnel | 🟡 Низкое | 🟡 Средняя |
| 12 | Phase 3.8 Dresscode palette | 🟡 Низкое | 🟢 Низкая |

---

## Что НЕ трогать

- StoryGallery — уникальный immersive стиль, пусть остаётся отдельным
- Hero — placeholder portraits, менять после получения фото
- Footer — свой градиент, это правильно для закрывающей секции
- QuizFunnel — full-screen wizard логика, стиль сделаем в Phase 3
- AppBar/BottomNav glass — уже хорошо
