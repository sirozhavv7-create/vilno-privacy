/**
 * Єдиний конфіг сайту «Вільно».
 * Усі плейсхолдери, які треба заповнити руками, — тут.
 */

/** Посилання на Google Play. */
export const PLAY_URL =
  'https://play.google.com/store/apps/details?id=org.kynuty.app'; // ← заміни PACKAGE_TUT на package з app.json

/** Посилання на App Store. Заповнити, коли застосунок вийде на iOS. */
export const APPSTORE_URL = ''; // TODO: https://apps.apple.com/app/id...

/** Перемикач стану iOS: true → кнопка App Store активна, /get веде в App Store. */
export const IOS_LIVE = false;

/** Пошта підтримки (офіційна). */
export const SUPPORT_EMAIL = 'vilno.support@gmail.com';

/** Канонічна адреса сайту. */
export const SITE_URL = 'https://vilno-ua.web.app';

/**
 * Скріншоти застосунку. Поки null — на сторінках акуратні порожні рамки.
 * Щоб підставити реальний скрін: поклади файл у site/public/screens/
 * і вкажи шлях, напр. '/screens/screen-1.webp'.
 */
export const SCREENS = {
  SCREEN_1: '/screens/screen-1.png', // Hero: головний екран з лічильником
  SCREEN_2: '/screens/screen-2.png', // Чат з Вілем
  SCREEN_3: '/screens/screen-3.png', // Вибір продукту / шкали відновлення
  SCREEN_4: null, // резерв
  SCREEN_5: null, // резерв
};

/** Мова за замовчуванням. Для нових локалей: додати підпапку src/pages/<lang>/ і словник у src/i18n/. */
export const DEFAULT_LOCALE = 'uk';

/** Назва застосунку і слоган — використовуються в SEO та OG. */
export const APP_NAME = 'Вільно';
export const TAGLINE = 'Кинь курити. Вільно.';