# Предлагаемая дизайн-система

## Концепция: "Тёплая элегантность"

Цель — объединить iOS-удобство с тёплой свадебной эстетикой.
Не холодный Apple gray, не перегруженный wedding classic — что-то между.

---

## Единый "дух" каждой вкладки

| Вкладка | Ощущение | Как достичь |
|---------|----------|-------------|
| Главная | Эмоция, история, теплота | Hero с фото, Welcome — крупный italic serif, Contest — скромно |
| История | Иммерсивность, кино | Fullscreen slides без изменений |
| Программа | Чёткость, уверенность | Card-cards, wine/gold accent, никакого Apple gray |
| Гости | Заботливость, простота | Quiz без лишних рюшей, progress чёткий |
| Инфо | Практичность, компактность | Unified card stack, label-header паттерн |

---

## Новые токены (добавить в variables.css)

```css
/* ── Карточки ── */
--card-bg:      rgba(255, 255, 255, 0.72);
--card-blur:    blur(24px) saturate(1.6);
--card-border:  0.5px solid rgba(255, 255, 255, 0.88);

--radius-card:  20px;   /* крупные блоки */
--radius-group: 16px;   /* компактные списки, FAQ items */
--radius-pill:  100px;  /* кнопки, time-pills */

/* ── Тени ── */
--shadow-card:  0 2px 12px rgba(107, 26, 42, 0.06), 0 8px 32px rgba(107, 26, 42, 0.09);
--shadow-group: 0 1px 6px rgba(107, 26, 42, 0.05), 0 4px 20px rgba(107, 26, 42, 0.07);

/* ── Тёплые нейтральные (вместо Apple gray) ── */
--text-warm-dark:   #2C1A1E;   /* основной тёмный (вместо #1C1C1E) */
--text-warm-muted:  #9A8080;   /* вторичный тёплый (вместо #8E8E93) */
--text-warm-faint:  rgba(92, 22, 34, 0.45);  /* очень бледный */

/* ── Section gap ── */
--section-gap: 16px;
```

---

## Паттерны компонентов

### 1. Section label (малый заголовок)
Единый способ назвать секцию:
```css
.label {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-warm-muted);
  padding: 0 4px;
}
```
Используется в: Gifts ✅, Dresscode ✅, Contacts ✅
Нужно добавить в: FAQ, Calendar (вместо serif h2)
НЕ нужно в: Hero, Welcome, Footer (там своя типографика)

### 2. Glass card (основная карточка)
```css
.card {
  background: var(--card-bg);
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  border: var(--card-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
```
Используется в: WeddingTimeline ✅ (26px), TelegramContest (24px), Calendar (20px)
Привести к: `var(--radius-card)` = 20px везде

### 3. Glass group (компактный список)
```css
.group {
  background: var(--card-bg);
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  border: var(--card-border);
  border-radius: var(--radius-group);
  box-shadow: var(--shadow-group);
}
```
Используется в: Contacts ✅ (14px), Gifts card (14px)
Привести к: `var(--radius-group)` = 16px везде

### 4. Gold accent top line (для крупных карт)
```css
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
  opacity: 0.65;
}
```
Используется в: WeddingTimeline ✅, TelegramContest ✅
Добавить в: Calendar card

### 5. Section stack (вертикальный ритм)
В Info и Program вкладках — не секции с индивидуальными padding, а общий контейнер:
```css
/* App.module.css */
.infoStack {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
  padding: var(--section-gap) var(--section-gap) calc(var(--bottomnav-h) + 16px);
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
}
```
Тогда каждая секция (`<Gifts>`, `<Dresscode>`, `<FAQ>`, etc.) убирает свой section padding и просто рендерит контент.

### 6. Primary button (единая кнопка)
Везде разные кнопки. Единый паттерн:
```css
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 20px;
  background: var(--accent-wine);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(107, 26, 42, 0.28);
  transition: opacity 0.2s;
}
.btn:active { opacity: 0.85; }
```
Применить в: Location "Построить маршрут", Calendar "Добавить в календарь", TelegramContest CTA, QuizFunnel "Начать" / "Далее"

### 7. Цвета иконок
- Телефон → `var(--accent-wine)` (не зелёный)
- Машина / навигация → `var(--accent-wine)`
- Telegram → `#0088CC` (бренд, оставить)
- Шеврон → `rgba(107, 26, 42, 0.25)` (приглушённый wine)

---

## Типографическая иерархия

| Уровень | Элемент | Шрифт | Размер | Использование |
|---------|---------|-------|--------|---------------|
| 0 | Имена / декор | `--font-script` | 3–5.5rem | Hero имена, Footer, Timeline дата |
| 1 | Serif accent | `--font-serif` italic | 1.4–2rem | Welcome текст |
| 2 | Section label | `--font-sans` 700 caps | 0.6rem | Все секции в Инфо / Программе |
| 3 | Card title | `--font-sans` 600 | 0.9–1rem | Название события, вопроса |
| 4 | Body | `--font-sans` 400 | 0.78–0.85rem | Описания, подписи |
| 5 | Caption | `--font-sans` 400 | 0.68–0.75rem | Адреса, подписи к иконкам |

---

## Цветовые роли (уточнение)

```
Wine   #6B1A2A → акцент, кнопки, иконки, pill backgrounds
Gold   #D4AF37 → декоративный акцент (линии, chevrons, badges)
Rose   #E8C5C5 → hover states, разделители, фоновые tint
Warm dark  #2C1A1E → основной текст (вместо #1C1C1E)
Warm muted #9A8080 → вторичный текст (вместо #8E8E93)
White glass → карточки (72% white + blur)
```
