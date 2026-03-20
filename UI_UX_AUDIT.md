# UI/UX Аудит — Свадебный сайт Игоря & Катерины
**Дата:** 19 марта 2026
**Стек:** React 18 + TypeScript + Vite, CSS Modules, Framer Motion, GSAP
**Устройства:** mobile-first (320–480px), tablet (481–768px), desktop (900px+)

---

## Общая оценка: **B+**
Сайт обладает сильной дизайн-системой, цельной эстетикой и качественными анимациями. Главные пробелы — доступность (ARIA, контраст), отсутствие визуальной обратной связи в формах и незакрытые placeholder-данные перед публикацией.

---

## 1. Дизайн-система

### ✅ Сильные стороны
- Единый цветовой язык: бордо (#6B1A2A) + розовый (#EDD0D0) + золото (#C9A227) — читается как свадебный стиль
- Glassmorphism применён последовательно во всех карточках и навигации
- CSS-токены покрывают все слои: цвета, шрифты, отступы, тени, стекло
- `clamp()` для типографики — правильный выбор для fluid-scaling

### ⚠️ Проблемы
| # | Проблема | Файл | Приоритет |
|---|----------|------|-----------|
| 1 | Шрифт `--font-serif` указан как `Playfair Display` в vars, но в CLAUDE.md написан `Marck Script` — расхождение документации | `variables.css` | Low |
| 2 | Глобальный `transition: background-color border-color` на `*` создаёт jank при тяжёлых анимациях | `global.css:35` | Medium |
| 3 | Описаны 7 accent-переменных, реально используется 5 — `--accent-blue`, `--accent-green` висят мёртвым грузом | `variables.css` | Low |
| 4 | Брейкпойнт 900px — единственный для десктопа. Промежуток 768–900px не покрыт — планшеты в серой зоне | все секции | Medium |

### Рекомендации
- Убрать `transition: ...` из `* {}`, применять точечно через `--transition-smooth` там, где нужно
- Добавить брейкпойнт `768px` для tablet-промежутка
- Удалить неиспользуемые переменные или оставить как задел с комментарием `/* reserved */`

---

## 2. AppBar (шапка)

**Файлы:** `AppBar.tsx`, `AppBar.module.css`

### ✅ Сильные стороны
- Floating glass pill (`border-radius: 20px`, `blur(40px) saturate(1.9)`) — чистый iOS-стиль
- Тройная колонка `grid-template-columns: 1fr auto 1fr` — симметрия монограммы
- Счётчик дней с badge-стилем органично вписан справа
- `env(safe-area-inset-top)` + отступ 10px — правильная работа с iPhone notch

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Заголовок `.title` при `opacity: 0.75` на светлом фоне — вероятное нарушение WCAG AA (4.5:1) | `AppBar.module.css:25` | 🔴 High |
| 2 | Emoji 🎉 в countdown не скрыт от скринридеров | `AppBar.tsx:23` | 🟡 Medium |
| 3 | Нет `:focus-visible` стилей на хедере | — | 🟡 Medium |
| 4 | Шрифт `.title` 0.72rem = ~10.8px — слишком мелко на 320px | `AppBar.module.css:22` | 🟡 Medium |

### Рекомендации
```css
/* Исправление контраста */
.title { opacity: 0.9; }

/* Emoji для a11y */
<span aria-hidden="true">🎉</span>

/* Минимальный размер шрифта */
.title { font-size: max(0.72rem, 11px); }
```

---

## 3. BottomNav (нижняя навигация)

**Файлы:** `BottomNav.tsx`, `BottomNav.module.css`

### ✅ Сильные стороны
- Floating pill с `border-radius: 22px` + стекло — iOS tab bar ощущение
- Анимированный pill через `layoutId="nav-pill"` + spring physics — отзывчивый feedback
- `min-height: 58px` покрывает стандарт touch target 44px
- Цвет inactive: `--accent-dusty-rose`, active: `--accent-wine` — читаемая иерархия

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Нет `aria-current="page"` на активном элементе — скринридеры не видят текущую вкладку | `BottomNav.tsx:26–50` | 🔴 High |
| 2 | Label 0.6rem = ~9px на мобильном — ниже минимально читаемого | `BottomNav.module.css:80` | 🟡 Medium |
| 3 | На desktop max-width 480px — тесновато при большом экране | `BottomNav.module.css:92` | 🟢 Low |
| 4 | `translate: -50% -50%` на `.pill` — нестандартное свойство, нужен префикс или `transform` | `BottomNav.module.css:55` | 🟡 Medium |

### Рекомендации
```tsx
// aria-current для активной вкладки
<button
  aria-current={active ? 'page' : undefined}
  aria-label={s.label}
>

// Замена translate на transform для совместимости
.pill {
  transform: translate(-50%, -50%);
  /* убрать: translate: -50% -50%; */
}
```

---

## 4. Hero (главный экран)

**Файлы:** `Hero.tsx`, `Hero.module.css`

### ✅ Сильные стороны
- Spring-анимации с правильным easing создают органичное появление
- Плейсхолдеры портретов со стилизованными иконками + имена — полноценный skeleton
- Адаптив: column на mobile (кольца → фото → текст), row на desktop
- Scroll hint анимируется с `repeatType: "reverse"` — ненавязчиво привлекает взгляд вниз

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Scroll hint стрелка `↓` не имеет `aria-label` | `Hero.tsx` | 🟡 Medium |
| 2 | Портреты — div, а не `<img>` с alt — когда появятся реальные фото нужно добавить alt | `Hero.tsx` | 🟡 Medium |
| 3 | Gap между портретами на desktop — фиксированный, не масштабируется с экраном | `Hero.module.css` | 🟢 Low |
| 4 | Нет `prefers-reduced-motion` для scroll hint анимации | — | 🟡 Medium |

### Рекомендации
```tsx
// Scroll hint
<motion.div aria-label="Прокрутите вниз">↓</motion.div>

// Реальные портреты (когда придут ассеты)
<img src={igorPhoto} alt="Игорь в детстве" className={styles.portrait} />

// CSS
@media (prefers-reduced-motion: reduce) {
  .scrollHint { animation: none; }
}
```

---

## 5. Welcome (текст приветствия)

**Файлы:** `Welcome.tsx`, `Welcome.module.css`

### ✅ Сильные стороны
- GSAP word-by-word reveal с scrub создаёт кинематографичный эффект
- `gsap.timeline.kill()` в cleanup — правильная работа с памятью
- Italic styling усиливает поэтичный тон

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | `scrub: 2` — 2-секундный лаг скролла может ощущаться вялым на слабых устройствах | `Welcome.tsx` | 🟡 Medium |
| 2 | Word-splitting в useEffect вызывает Layout Shift при гидратации | `Welcome.tsx` | 🟡 Medium |
| 3 | Минимальный font-size 1.2rem на мобильном — недостаточно для длинного поэтического текста | `Welcome.module.css` | 🟡 Medium |
| 4 | GSAP + ScrollTrigger не отключается при `prefers-reduced-motion` | — | 🟡 Medium |

### Рекомендации
```tsx
// Уменьшить scrub
scrub: 1,  // вместо 2

// prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!prefersReduced) { /* GSAP анимация */ }

// CSS
.text { font-size: clamp(1.35rem, 4vw, 2rem); }
```

---

## 6. StoryGallery (карусель историй)

**Файлы:** `StoryGallery.tsx`, `StoryGallery.module.css`

### ✅ Сильные стороны
- Keyboard navigation (ArrowLeft/Right) — хорошая доступность для десктопа
- Множественные методы навигации: стрелки + точки + свайп
- 55/45 split image/text создаёт визуальный баланс

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Нет `aria-live="polite"` — смена слайда не анонсируется скринридерам | `StoryGallery.tsx` | 🔴 High |
| 2 | Текущий слайд определяется по scroll offset — нестабильно при быстром свайпе | `StoryGallery.tsx` | 🟡 Medium |
| 3 | Год (opacity 0.08) — декоративный элемент, но слишком невидимый | `StoryGallery.module.css` | 🟢 Low |
| 4 | Нет `role="region"` с именем для карусели | — | 🟡 Medium |

### Рекомендации
```tsx
// ARIA live region
<div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
  Слайд {activeIndex + 1} из {slides.length}: {slides[activeIndex].title}
</div>

// Увеличить год opacity
.year { opacity: 0.15; }

// region
<section role="region" aria-label="История пары">
```

---

## 7. WeddingTimeline (программа дня)

**Файлы:** `WeddingTimeline.tsx`, `WeddingTimeline.module.css`

### ✅ Сильные стороны
- На десктопе компактные glass-карточки с hover-lift — красиво и информативно
- Таймлайн-коннектор с `min-height` + `linear-gradient` — визуальный flow
- Иконки событий добавляют personality

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | `.item:last-child .connLine { display: none }` — хрупко при изменении порядка событий | `WeddingTimeline.module.css:88` | 🟢 Low |
| 2 | Временны́е метки (1rem/0.9rem) — мелко на 320px экране | `WeddingTimeline.module.css` | 🟡 Medium |
| 3 | Иконки emoji не скрыты через `aria-hidden` | `WeddingTimeline.tsx` | 🟡 Medium |
| 4 | Десктоп: нет scroll-индикатора когда контент выходит за пределы колонки | — | 🟡 Medium |

### Рекомендации
```tsx
// emoji в aria-hidden
<span aria-hidden="true" className={styles.icon}>{event.icon}</span>

// CSS: min time font
.time { font-size: max(0.9rem, 14px); }

// Scroll fade вместо hidden overflow
.section {
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}
```

---

## 8. Location (место проведения)

**Файлы:** `Location.tsx`, `Location.module.css`

### ✅ Сильные стороны
- Map iframe с `title` атрибутом — правильная доступность
- Кнопка маршрута открывает Яндекс/Google Maps — good fallback
- Address card с glassmorphism + иконкой — читаемо

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Двойное открытие навигаторов (Yandex + Google) в одном обработчике — может открыть оба сразу | `Location.tsx` | 🔴 High |
| 2 | Координаты карты не верифицированы — в CLAUDE.md стоит флаг "уточнить" | `Location.tsx` | 🔴 High |
| 3 | Нет кнопки копирования адреса — пользователь не может легко передать адрес другим | — | 🟡 Medium |
| 4 | На мобильном map aspect-ratio 16/9 занимает ~56% высоты экрана | `Location.module.css` | 🟡 Medium |

### Рекомендации
```tsx
// Один навигатор через выбор
const openMaps = () => {
  const choice = confirm('Открыть в Яндекс.Картах?')
  const url = choice ? YANDEX_URL : GOOGLE_URL
  window.open(url, '_blank')
}

// Копирование адреса
<button onClick={() => navigator.clipboard.writeText(ADDRESS)}>
  Скопировать адрес
</button>

// Уточнить координаты у пользователя перед публикацией!
```

---

## 9. QuizFunnel (квиз-воронка)

**Файлы:** `QuizFunnel.tsx`, `QuizFunnel.module.css`

### ✅ Сильные стороны
- 9-шаговая игровая воронка с прогресс-баром и эмодзи — высокая вовлечённость
- Автопереход при выборе карточки (300ms delay) — плавный UX
- Условные поля (аллергии только при "Да") — не перегружает форму
- Spring transitions между шагами — ощущение нативного приложения
- localStorage для повторных визитов — умная защита от дублей
- Telegram отправка с аналитикой (IP, устройство, время) — ценные данные

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | `canAdvance() = false` → кнопка "Далее" просто неактивна без объяснения — пользователь не понимает что делать | `QuizFunnel.tsx` | 🔴 High |
| 2 | `.nextDisabled` — `opacity: 0.38` может не пройти контраст WCAG AA | `QuizFunnel.module.css` | 🟡 Medium |
| 3 | Нет предупреждения при навигации назад через браузер (потеря данных) | — | 🟡 Medium |
| 4 | `alreadyDone === true` показывает "Обновить данные" но данные не восстанавливаются из хранилища | `QuizFunnel.tsx:step 0` | 🟡 Medium |
| 5 | Нет `aria-describedby` связывающего hint с input | — | 🟡 Medium |
| 6 | Аналитика (IP) собирается при каждом submit — если пользователь переотправляет, счётчик визитов удваивается | `analytics.ts` | 🟢 Low |

### Рекомендации
```tsx
// Подсказка под кнопкой при disabled
{!canAdvance() && (
  <p className={styles.navError} role="alert">
    {step === 1 && 'Введите своё имя'}
    {step === 3 && 'Введите номер телефона (минимум 7 цифр)'}
  </p>
)}

// Восстановление данных из localStorage
const savedData = JSON.parse(localStorage.getItem('quiz_data') || 'null')
const [data, setData] = useState<QuizData>(savedData ?? EMPTY)

// Сохранять при каждом шаге
useEffect(() => {
  localStorage.setItem('quiz_data', JSON.stringify(data))
}, [data])

// Предупреждение о потере данных
useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    if (step > 0 && step < 10) e.preventDefault()
  }
  window.addEventListener('beforeunload', handler)
  return () => window.removeEventListener('beforeunload', handler)
}, [step])
```

---

## 10. GuestBook (книга пожеланий)

**Файлы:** `GuestBook.tsx`, `GuestBook.module.css`

### ✅ Сильные стороны
- Живой feed сообщений с AnimatePresence — настоящее ощущение активного пространства
- Telegram-интеграция: каждое пожелание дублируется в канал — ключевая функция работает
- Стеклянные карточки с gold left-border — визуально элегантно

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Нет `<label>` для input/textarea — только placeholder — нарушение WCAG | `GuestBook.tsx:49–64` | 🔴 High |
| 2 | Тихая ошибка при пустой форме — нет визуальной обратной связи | `GuestBook.tsx:27` | 🔴 High |
| 3 | Данные не сохраняются: перезагрузка = всё пропало (ожидаемо без backend, но важно объяснить пользователю) | — | 🟡 Medium |
| 4 | Textarea `resize` не ограничен — может сломать layout | `GuestBook.module.css` | 🟡 Medium |
| 5 | Новое сообщение добавляется в начало массива, но нет автоскролла к нему | `GuestBook.tsx:29` | 🟡 Medium |

### Рекомендации
```tsx
// Labels (visually hidden — не ломает дизайн)
<label htmlFor="gb-name" className={styles.srOnly}>Ваше имя</label>
<input id="gb-name" ... />

// Валидация с визуальным feedback
const [errors, setErrors] = useState({ name: false, text: false })
// CSS: .inputError { border-color: red; }

// Ограничить resize
.textarea { resize: vertical; max-height: 200px; }
```

---

## 11. RSVP (форма подтверждения)

**Файлы:** `RSVP.tsx`, `RSVP.module.css`

### ✅ Сильные стороны
- Dual-режим: Telegram-ссылка + классическая форма — охват обоих типов пользователей
- Конфетти при успешной отправке — эмоциональный момент
- Условные поля (список гостей, аллергии) — не перегружает форму

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Форма дублирует функционал QuizFunnel — два RSVP механизма сбивают с толку | архитектура | 🔴 High |
| 2 | Ошибки валидации только меняют border — нет текста ошибки | `RSVP.tsx` | 🔴 High |
| 3 | Пульсирующая анимация Telegram кнопки (infinite loop 2.2s) — отвлекает от контента | `RSVP.module.css` | 🟡 Medium |
| 4 | Добавление гостя не фокусирует новый input — пользователь не понимает что произошло | `RSVP.tsx` | 🟡 Medium |
| 5 | 7+ полей без прогресс-индикатора — пользователь не знает сколько ещё осталось | — | 🟡 Medium |

### Рекомендации
- **Архитектурное решение**: RSVP и QuizFunnel выполняют одну функцию — оставить только QuizFunnel как primary RSVP, RSVP использовать как backup или убрать совсем
- Добавить `useRef` на вновь добавляемый guest input → `ref.current.focus()`
- Либо объединить оба компонента в единый сценарий

---

## 12. Gifts (подарки)

**Файлы:** `Gifts.tsx`, `Gifts.module.css`

### ✅ Сильные стороны
- Честное и тёплое сообщение — без намёков на конкретные подарки (если такова задумка)
- Минималистичный дизайн карточки не отвлекает

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Секция очень короткая — занимает ~10% viewport, ощущается незаконченной | — | 🟡 Medium |
| 2 | Иконка сердца lucide менее тёплая, чем ❤️ emoji — стиль немного выбивается | `Gifts.tsx` | 🟢 Low |
| 3 | Нет возможности добавить вишлист / реквизиты если передумают | — | 🟢 Low |

---

## 13. FAQ (часто задаваемые вопросы)

**Файлы:** `FAQ.tsx`, `FAQ.module.css`

### ✅ Сильные стороны
- Гладкое раскрытие через AnimatePresence + height: 0 → auto
- Rotation chevron (180°) при открытии — классическая, понятная интеракция

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Кнопки accordion не обрабатывают `Enter`/`Space` клавиши | `FAQ.tsx` | 🔴 High |
| 2 | Нет `:focus-visible` стиля на кнопках | `FAQ.module.css` | 🔴 High |
| 3 | Нет `role="list"` и `role="listitem"` на accordion | `FAQ.tsx` | 🟡 Medium |
| 4 | Нет `aria-expanded` на кнопках | `FAQ.tsx` | 🟡 Medium |

### Рекомендации
```tsx
// Полный ARIA для accordion
<button
  aria-expanded={openIndex === i}
  aria-controls={`faq-answer-${i}`}
  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggle(i) }}
>

<div
  id={`faq-answer-${i}`}
  role="region"
  aria-labelledby={`faq-btn-${i}`}
>

// Focus style
.question:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
```

---

## 14. Contacts (контакты)

**Файлы:** `Contacts.tsx`, `Contacts.module.css`

### ✅ Сильные стороны
- `<a href="tel:...">` обеспечивает нативный звонок на мобильных
- Hover-анимация карточек (`scale(1.03)`, `y: -4`) — интерактивная обратная связь

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | **КРИТИЧНО:** Номера телефонов — placeholder "+375 (XX) XXX-XX-XX" | `Contacts.tsx` | 🔴 Blocker |
| 2 | Нет копирования в буфер для не-мобильных пользователей | — | 🟡 Medium |
| 3 | Email отсутствует (нет `<a href="mailto:...">`) | `Contacts.tsx` | 🟡 Medium |

---

## 15. Footer

**Файлы:** `Footer.tsx`, `Footer.module.css`

### ✅ Сильные стороны
- Great Vibes для имён — согласован с Hero и монограммой в AppBar
- Тонкий градиент под секцией создаёт визуальное завершение страницы

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | Маленький gap между элементами (spacing-md = 16px) — тесновато на больших экранах | `Footer.module.css` | 🟢 Low |
| 2 | Нет года или даты — пользователь не видит когда сайт актуален | — | 🟢 Low |

---

## 16. Performance

### ✅ Сильные стороны
- Framer Motion использует `transform/opacity` — GPU-accelerated анимации
- CSS Modules исключают утечки стилей и мёртвый CSS
- Lazy-рендеринг экранов (только активный tab рендерит контент)

### ⚠️ Проблемы
| # | Проблема | Деталь | Приоритет |
|---|----------|--------|-----------|
| 1 | StoryGallery пересчитывает activeSlide на каждый scroll event — нет debounce | `StoryGallery.tsx` | 🟡 Medium |
| 2 | GuestBook рендерит все сообщения без виртуализации — при 100+ записях тормоза | `GuestBook.tsx` | 🟢 Low |
| 3 | Нет `@media (prefers-reduced-motion)` — люди с вестибулярными расстройствами получают все анимации | глобально | 🟡 Medium |
| 4 | Нет стратегии оптимизации изображений (WebP, srcset) — подготовиться до загрузки фото | — | 🟡 Medium |

### Рекомендации
```css
/* global.css — добавить в конец */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 17. Доступность (Accessibility) — Сводная таблица

| Компонент | Проблема | Стандарт | Приоритет |
|-----------|----------|----------|-----------|
| AppBar | Контраст `.title` (opacity 0.75) | WCAG 2.1 AA (4.5:1) | 🔴 |
| BottomNav | Нет `aria-current="page"` | WCAG 4.1.3 | 🔴 |
| StoryGallery | Нет `aria-live` | WCAG 4.1.3 | 🔴 |
| GuestBook | Нет `<label>` | WCAG 1.3.1 | 🔴 |
| FAQ | Нет `aria-expanded`, нет keyboard | WCAG 2.1.1, 4.1.2 | 🔴 |
| QuizFunnel | Нет ошибок для disabled кнопки | WCAG 3.3.1 | 🔴 |
| Hero | `↓` без `aria-label` | WCAG 2.4.6 | 🟡 |
| Весь сайт | Нет `:focus-visible` | WCAG 2.4.7 | 🟡 |
| Весь сайт | Нет `prefers-reduced-motion` | WCAG 2.3.3 | 🟡 |
| Contacts | placeholder-номера | — | 🔴 Blocker |

---

## 18. Перед публикацией — Обязательный чеклист

```
[ ] Заменить placeholder телефоны в Contacts.tsx
[ ] Верифицировать координаты GRAND CHATEL на карте
[ ] Заполнить .env.local: BOT_TOKEN, CHAT_ID, CHANNEL_URL
[ ] Добавить реальные портреты в /assets/portraits/
[ ] Добавить реальные фото в StoryGallery
[ ] Настроить Telegram бота — протестировать отправку
[ ] Добавить реальную музыку в MusicPlayer
[ ] Проверить .ics файл в iOS Calendar и Google Calendar
[ ] Протестировать на iPhone SE (375px) и Samsung Galaxy (360px)
[ ] Протестировать QuizFunnel от начала до конца
[ ] Убедиться что Telegram channel URL ведёт на правильный канал
```

---

## 19. Итог по приоритетам

### 🔴 Критичные (исправить до публикации)
1. Заменить placeholder контакты — пользователи не смогут позвонить
2. Верифицировать координаты карты
3. Добавить `aria-current="page"` в BottomNav
4. Добавить `<label>` в GuestBook форму
5. Добавить `aria-expanded` + keyboard в FAQ
6. Исправить контраст AppBar title (opacity → 0.9)
7. Добавить inline-ошибки в QuizFunnel и RSVP
8. Настроить env-переменные Telegram

### 🟡 Важные (в течение недели)
1. `prefers-reduced-motion` глобально
2. `:focus-visible` для всех кнопок и ссылок
3. `aria-live` для StoryGallery
4. Восстановление данных квиза из localStorage
5. Дебаунс scroll-listener в StoryGallery
6. Двойное открытие навигаторов в Location → выбор
7. Убрать или интегрировать RSVP (дублирует QuizFunnel)
8. Кнопка копирования адреса
9. Ограничить resize textarea
10. Tablet брейкпойнт 768px в variables.css

### 🟢 Желательные (polish before wedding)
1. Виртуализация GuestBook при 50+ сообщениях
2. Стратегия WebP + srcset для фотографий
3. Вариативные цвета аватаров по имени (hash)
4. Убрать неиспользуемые CSS переменные
5. Удалить дублирующий `* { transition }` из global.css
6. Footer: добавить дату/год

---

*Аудит проведён на основе полного чтения исходного кода. Для полноты — рекомендуется дополнительное ручное тестирование на реальных устройствах и использование Lighthouse + axe DevTools.*
