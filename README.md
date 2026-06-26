# Flora

Навчальний проєкт у рамках курсу UMT. Автор — Коломієць Тарас Павлович.

## Скоупи

- **Скоуп 1 (поточний)** — статична HTML/CSS-верстка за Figma-макетом, mobile-first адаптив, деплой на GitHub Pages.
- **Скоуп 2** — інтерактивний шар: ретина, модальні вікна з формами, динамічні списки через axios + json-server, пагінація/фільтрація.
- **Скоуп 3** — власний backend (окремий репозиторій).

## Посилання

- **Figma-макет:** https://www.figma.com/design/2Tj16H7IO7dq1ViTvIh57V/Flora?node-id=8203-59903
- **Жива сторінка (GitHub Pages):** https://kolomiiets-taras.github.io/UMT-markup-practice_P1-Kolomiiets-Taras/

## Локальний запуск

**1. Статичний сервер для фронтенду:**

```bash
npx serve .
# або
python3 -m http.server 5500
```

**2. Mock API (json-server) — потрібен для динамічних списків (скоуп 2):**

```bash
npx json-server --watch db.json --port 3001
# або
npm run json-server
```

API стартує на `http://localhost:3001`. `js/api.js` ходить туди за `/bouquets`, `/topSellers`, `/testimonials`.
Без json-server сторінка показує fallback-повідомлення про помилку у списках, решта верстки працює.

## Інструменти розробки

```bash
npm install              # поставити dev-залежності (Prettier)
npm run format           # відформатувати весь код
npm run format:check     # перевірити форматування
```

## Структура

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js          # ініціалізація AOS + мобільне меню
├── images/
│   ├── icons.svg        # SVG-спрайт
│   └── *.jpg            # фото (оригінал з Figma, ~480 KB разом)
├── favicon.ico
├── package.json
└── README.md
```

## Реалізовано (Скоуп 1)

- Семантична розмітка: один `<h1>`, `<header>/<main>/<footer>`, `<nav>` лише в хедері.
- Mobile-first адаптив через `@media (min-width: ...)` для **375 / 768 / 1440 px**, без горизонтальної прокрутки від 320 px.
- Контейнер `.container` шириною 1336 px з адаптивним padding.
- Усі кольори, шрифти, радіуси та переходи — у CSS-змінних (`:root`).
- Шрифти Roboto + Hanuman підключені одним посиланням з Google Fonts.
- `modern-normalize` + базовий reset, `box-sizing: border-box` глобально.
- SVG-спрайт у `images/icons.svg`, іконки через `<svg><use href="..."></use></svg>`.
- Мобільне меню: бургер відкриває, хрестик/Escape закриває, блокує прокрутку `<body>`, перемикає клас `.is-open` (на десктопі приховане).
- Hover/focus переходи 250 ms `cubic-bezier(0.4, 0, 0.2, 1)`, властивості перелічені явно.
- Бібліотека анімацій **AOS** (Animate On Scroll) на 2 декоративних елементах: `hero__media` (fade-left) і `about__media` (fade-up).
- Жодного `!important`, жодного `transition: all`.
- HTML проходить W3C Nu Validator без помилок.
- Console чиста.
- Без фіксованих `height` на блоках з контентом.

## Деплой на GitHub Pages

1. Створити репозиторій на GitHub з назвою `UMT-markup-practice_P1-Kolomiiets-Taras` (за вимогою курсу).

2. Ініціалізувати git та запушити:

```bash
git init -b main
git add .
git commit -m "Scope 1: HTML/CSS markup of the Flora homepage"
git remote add origin https://github.com/<your-username>/UMT-markup-practice_P1-Kolomiiets-Taras.git
git push -u origin main
```

3. У налаштуваннях репозиторію → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` / folder: `/ (root)`

4. Через ~1 хвилину GitHub Pages дасть URL виду `https://<your-username>.github.io/UMT-markup-practice_P1-Kolomiiets-Taras/`. Додати його у поле **About** репозиторію.

5. Перевірити PageSpeed Insights: https://pagespeed.web.dev/.

## Валідація

- **HTML:** https://validator.w3.org/nu/?doc=URL — має пройти без помилок.
- **CSS:** https://jigsaw.w3.org/css-validator/validator?uri=URL — має пройти без помилок.
- **PageSpeed:** ≥ 70% за всіма показниками (Performance / Accessibility / Best Practices / SEO).
