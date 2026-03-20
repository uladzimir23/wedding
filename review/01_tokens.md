# Аудит дизайн-токенов

---

## 1. Шрифты

### Задекларировано в variables.css
```
--font-script: 'Great Vibes'      → декоративные заголовки, имена
--font-serif:  'Playfair Display'  → заголовки секций
--font-sans:   'Montserrat'        → основной текст
```

### Реальное использование в секциях

| Секция | Заголовок | Тело | Проблема |
|--------|-----------|------|----------|
| Hero | `--font-script` (Great Vibes) имена, `--font-serif` date | — | ✅ ок |
| Welcome | `--font-script` (весь текст) | `--font-script` | ⚠️ Script для длинного текста — нечитаемо |
| WeddingTimeline header | `--font-script` "24 апреля" | `--font-sans` | ✅ ок |
| WeddingTimeline events | `--font-sans` | `--font-sans` | ✅ ок |
| Location | `--font-sans` везде | `--font-sans` | ✅ ок |
| TelegramContest | `--font-serif`? / `--font-sans`? | — | ❓ нужна проверка |
| FAQ | `--font-serif` заголовок | `--font-sans` | ⚠️ Большой serif h2 — старый стиль |
| Gifts | `--font-sans` | `--font-sans` | ✅ ок |
| Dresscode | `--font-sans` label | `--font-sans` | ✅ ок |
| Contacts | `--font-sans` | `--font-sans` | ✅ ок |
| Footer | `--font-script` (имена) | `--font-sans` | ✅ ок |

### Вывод
- **Welcome**: скрипт нечитаем для 4 строк текста → нужен `--font-serif` с letter-spacing
- **FAQ**: h2 с serif не соответствует новым секциям → заменить на small uppercase label
- **Принцип**: `--font-script` только для имён пары и числа/даты (Hero, WeddingTimeline header, Footer)

---

## 2. Цвета

### Задекларировано
```
--text-primary:   #5C1622   (глубокий бургунди)
--text-secondary: #8B3A4A   (светлее бургунди)
--accent-wine:    #6B1A2A
--accent-gold:    #D4AF37
--accent-rose:    #E8C5C5
```

### Реальное использование

| Секция | Основной текст | Вторичный | Проблема |
|--------|---------------|-----------|----------|
| Hero | `var(--text-primary)` | `var(--text-secondary)` | ✅ |
| WeddingTimeline | `#1C1C1E` (Apple dark) | `#8E8E93` (Apple gray) | ❌ Чужие цвета |
| Location | `#1C1C1E` | `#8E8E93` | ❌ Чужие цвета |
| Contacts | `#1C1C1E` | `#8E8E93` | ❌ Чужие цвета |
| Gifts | `#1C1C1E` | `#8E8E93` | ❌ Чужие цвета |
| Dresscode note | `#8E8E93` | — | ❌ Apple gray |
| FAQ | `var(--text-primary)` | `var(--text-secondary)` | ✅ |
| Footer | `var(--accent-wine)` | — | ✅ |
| Calendar header | `#1C1C1E` body | — | ❌ |
| TelegramContest | `var(--text-primary)` / `#1C1C1E` mix | — | ❌ |

### Проблема: два разных текстовых мира
- **Свадебный**: `#5C1622`, `#8B3A4A` → тёплый, богатый, романтичный
- **Apple iOS**: `#1C1C1E`, `#8E8E93` → холодный, системный, нейтральный

### Решение
Заменить все `#1C1C1E` и `#8E8E93` на свадебные цвета:
```
#1C1C1E → var(--text-primary)    [#5C1622]  — или компромисс #2C1A1E (тёплый тёмный)
#8E8E93 → var(--text-secondary)  [#8B3A4A]  — или #9A8080 (тёплый серо-розовый)
```

---

## 3. Glassmorphism — хаос

Разные карточки, разная прозрачность:

| Компонент | background opacity | blur | border | border-radius |
|-----------|-------------------|------|--------|---------------|
| BottomNav | 0.72 | 40px | rgba(255,255,255,0.65) | 22px |
| AppBar | — | 40px | rgba(255,255,255,0.5) | 50px |
| WeddingTimeline card | 0.68 | 28px | rgba(255,255,255,0.84) | 26px |
| Location sheet | 0.92 | 28px | rgba(255,255,255,0.9) | — |
| TelegramContest card | 0.52 | 20px | rgba(255,255,255,0.75) | 24px |
| Gifts card | 0.78 | 20px | rgba(255,255,255,0.9) | 14px |
| Dresscode palette | 0.78 | 20px | rgba(255,255,255,0.9) | 14px |
| Contacts group | 0.78 | 20px | rgba(255,255,255,0.9) | 14px |
| FAQ item | 0.45 | 12px | rgba(232,197,197,0.35) | var(--border-radius-lg) |
| Calendar widget | — | — | — | 20px |

### Стандарт (предложение)
Два уровня карточек:

**Card (основная)** — для крупного контента:
```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(24px) saturate(1.6);
border: 0.5px solid rgba(255, 255, 255, 0.88);
border-radius: 20px;
box-shadow: 0 2px 12px rgba(107, 26, 42, 0.06), 0 8px 32px rgba(107, 26, 42, 0.09);
```

**Row/Group (компактная)** — для списков, FAQ, Contacts:
```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(24px) saturate(1.6);
border: 0.5px solid rgba(255, 255, 255, 0.88);
border-radius: 16px;
box-shadow: 0 1px 6px rgba(107, 26, 42, 0.05), 0 4px 20px rgba(107, 26, 42, 0.07);
```

---

## 4. Border-radius

| Место | Текущее значение |
|-------|-----------------|
| BottomNav | 22px |
| AppBar | 50px (pill) |
| WeddingTimeline | 26px |
| Location container | 20px |
| Location sheet | нет (container clips) |
| TelegramContest | 24px |
| Gifts card | 14px |
| Dresscode palette | 14px |
| Contacts group | 14px |
| FAQ items | `var(--border-radius-lg)` = 24px |
| Calendar | 20px |

### Проблема
5 разных значений: 14 / 20 / 22 / 24 / 26px — глаз не привыкает ни к чему.

### Стандарт
```
--radius-card: 20px   → большие карточки (Timeline, Location, Calendar, TelegramContest)
--radius-group: 16px  → сгруппированные списки (Contacts, FAQ items, Gifts card)
--radius-pill: 100px  → кнопки, time-pills, навигация
```

---

## 5. Отступы секций (spacing rhythm)

Текущая ситуация в Info tab (active === 4):

| Секция | padding-top | padding-bottom |
|--------|------------|----------------|
| Gifts | `--spacing-md` (16px) | 0 |
| Dresscode | `--spacing-md` (16px) | 0 |
| FAQ | `--spacing-xl` (40px) | — (старый стиль) |
| Contacts | 0 | `--spacing-md` (16px) |
| Footer | — | 160px |

FAQ выбивается огромным padding-top. Нет консистентного вертикального ритма.

### Стандарт
Все секции в скролл-контейнере должны иметь одинаковый gap. Лучший подход — убрать padding с секций и поставить `gap` на контейнере.

**Для Info tab** — обернуть в `<div className={styles.infoStack}>` с `display: flex; flex-direction: column; gap: 16px; padding: 16px 16px 24px`.

**Для Program tab** — аналогично.
