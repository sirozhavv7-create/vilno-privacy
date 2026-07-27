# Сайт «Вільно» (site/)

Маркетинговий сайт застосунку «Вільно». Статичний, на [Astro](https://astro.build),
без клієнтських фреймворків — JS лише на `/get` (визначення платформи) і на
лендінгу (банер «iOS скоро»).

## Команди

Усі команди виконуються з каталогу `site/`:

| Команда | Що робить |
| --- | --- |
| `npm install` | встановити залежності |
| `npm run dev` | дев-сервер на `localhost:4321` |
| `npm run build` | збірка у `site/dist` |
| `npm run preview` | переглянути збірку локально |
| `npm run generate:assets` | перегенерувати og.png, фавікони та QR-код |

## Деплой (Firebase Hosting)

`firebase.json` у корені репозиторію вже налаштований (`public: site/dist`,
`cleanUrls: true`). З кореня репо:

```bash
cd site && npm install && npm run build && cd ..
firebase deploy --only hosting
```

## Структура

```
site/
├── firebase.json          (у корені репо) — hosting
├── src/
│   ├── config.mjs         ← ЄДИНИЙ конфіг: усі плейсхолдери тут
│   ├── data/faq.mjs       питання FAQ (повний список + міні-FAQ лендінгу)
│   ├── i18n/uk.mjs        спільні UI-рядки (для майбутніх локалей)
│   ├── layouts/Base.astro SEO, OG, canonical, JSON-LD, фавікони
│   ├── components/        Header, Footer, Logo, StoreButtons, Screen
│   ├── content/blog/      markdown-статті блогу
│   └── pages/             / /get /faq /privacy /terms /blog 404
├── scripts/generate-assets.mjs   генерація og/фавіконів/QR
└── public/                статичні файли (robots.txt, іконки, og.png, QR)
```

### iOS: перемикання «Скоро» → «Живий»

У `src/config.mjs` вписати `APPSTORE_URL` і поставити `IOS_LIVE = true`.
Після цього кнопка App Store стане активною, а `/get` вестиме iOS-користувачів
в App Store.

### Локалі (на майбутнє)

Сайт зараз однією мовою (`uk`, з `config.mjs → DEFAULT_LOCALE`). Щоб додати
локаль: створити словник `src/i18n/<lang>.mjs` з тими самими ключами, підпапку
сторінок `src/pages/<lang>/` і передавати мову в `Base.astro`.

## Lighthouse

Прогін від 2026-07-27 (mobile, локальний прев'ю збірки):

| Сторінка | Perf | A11y | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 |
| `/faq` | 100 | 100 | 100 | 100 |
| `/privacy` | 100 | 100 | 100 | 100 |
| `/terms` | 100 | 100 | 100 | 100 |
| `/blog` | 100 | 100 | 100 | 100 |
| `/get` (desktop) | 100 | 100 | 100 | 69* |

\* `/get` навмисно має `noindex` (вимога ТЗ) — Lighthouse знімає бали SEO саме
за це; у mobile-режимі сторінка одразу редіректить у стор, тому міряти її треба
в desktop-режимі.

## Що лишилось заповнити руками

1. **`src/config.mjs`:**
   - `PLAY_URL` — справжній package id у Google Play;
   - `SITE_URL` — справжній `https://<project>.web.app` (після зміни виконати
     `npm run generate:assets`, щоб QR і robots.txt* вказували куди треба);
   - `APPSTORE_URL` + `IOS_LIVE = true` — коли вийде iOS;
   - `SUPPORT_EMAIL` — зараз пошта з політики конфіденційності, за потреби замінити.
2. **Скріншоти:** SCREEN_1–3 уже підставлені (`public/screens/`). Щоб додати
   нові або замінити наявні: поклади PNG у `public/screens/`, впиши шлях у
   `SCREENS` у `config.mjs` і виконай `npm run generate:assets` — скрипт стисне
   файл під веб (ширина 560 px) і зробить `.webp`-версію поруч.
3. **`public/robots.txt`** — адреса sitemap у ньому статична, оновити разом із `SITE_URL`.
4. **Текст умов використання** — замінити блок `[ВСТАВИТИ ТЕКСТ]` у
   `src/pages/terms.astro`.
5. **Іконка застосунку** — справжня іконка лежить у `public/icon.png` і є
   джерелом для логотипа в шапці, фавіконів та og.png. Якщо іконка зміниться:
   заміни цей файл і виконай `npm run generate:assets`.
