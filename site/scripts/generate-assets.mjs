/**
 * Генерація статичних асетів сайту:
 *  - og.png (1200×630) — фон у кольорах бренду + іконка застосунку + слоган;
 *  - набір фавіконів (favicon-32.png, apple-touch-icon.png, icon-192/512.png)
 *    зі справжньої іконки застосунку public/icon.png;
 *  - стиснені скріншоти з public/screens/ (.webp + оптимізований .png);
 *  - qr-get.svg — статичний QR, що веде на SITE_URL/get.
 *
 * Запуск: npm run generate:assets (з каталогу site/).
 * Перегенеруй після зміни SITE_URL або заміни public/icon.png.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { SITE_URL, APP_NAME, TAGLINE, SCREENS } from '../src/config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

/** Джерело всіх іконок — справжня іконка застосунку. */
const SOURCE_ICON = pub('icon.png');

// ---- Фавікони з icon.png ----
const sizes = [
  ['favicon-32.png', 32],
  ['logo-64.png', 64], // логотип у шапці (32 CSS px, 2× для retina)
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
for (const [name, size] of sizes) {
  await sharp(SOURCE_ICON).resize(size, size).png().toFile(pub(name));
  console.log(`✓ ${name}`);
}

// ---- OG-зображення 1200×630 ----
// Іконка застосунку зі скругленими кутами + текст системним шрифтом із кирилицею.
const ICON_BOX = 130;
const ICON_X = 80;
const ICON_Y = 150;

const roundedIcon = await sharp(SOURCE_ICON)
  .resize(ICON_BOX, ICON_BOX)
  .composite([
    {
      input: Buffer.from(
        `<svg width="${ICON_BOX}" height="${ICON_BOX}"><rect width="${ICON_BOX}" height="${ICON_BOX}" rx="32" fill="#fff"/></svg>`
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const ogBackground = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf8f1"/>
  <circle cx="1120" cy="80" r="260" fill="#e7ecdf"/>
  <circle cx="80" cy="600" r="200" fill="#e7ecdf"/>
  <text x="80" y="410" font-family="DejaVu Sans" font-size="76" font-weight="bold" fill="#2a2622">${TAGLINE}</text>
  <text x="80" y="480" font-family="DejaVu Sans" font-size="40" fill="#6d675e">Український застосунок, який допомагає</text>
  <text x="80" y="535" font-family="DejaVu Sans" font-size="40" fill="#6d675e">кинути курити й парити</text>
  <text x="1120" y="580" text-anchor="end" font-family="DejaVu Sans" font-size="36" font-weight="bold" fill="#586b4d">${APP_NAME}</text>
</svg>`;

await sharp(Buffer.from(ogBackground))
  .composite([{ input: roundedIcon, top: ICON_Y, left: ICON_X }])
  .png()
  .toFile(pub('og.png'));
console.log('✓ og.png');

// ---- Скріншоти застосунку ----
// Джерело — файли public/screens/screen-N.png (як їх поклали в репо).
// Кожен стискається під веб: .webp для сучасних браузерів і оптимізований
// .png як фолбек. Ширина 600 px покриває 2× для слота 280 px на сторінці.
const SCREEN_WIDTH = 560; // 2× слота 280 px
for (const path of Object.values(SCREENS)) {
  if (!path) continue;
  const file = pub(path.replace(/^\//, ''));
  const source = await readFile(file);
  const base = sharp(source).resize({ width: SCREEN_WIDTH, withoutEnlargement: true });

  await base.clone().webp({ quality: 80 }).toFile(file.replace(/\.png$/, '.webp'));
  // PNG перезаписуємо на місці: далі скрипт бере його ж як джерело,
  // тож повторні прогони не погіршують якість (PNG — без втрат).
  const png = await base.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
  await writeFile(file, png);
  console.log(`✓ ${path} (+ .webp)`);
}

// ---- QR-код на /get ----
const qrSvg = await QRCode.toString(`${SITE_URL}/get`, {
  type: 'svg',
  margin: 0,
  color: { dark: '#2a2622', light: '#ffffff' },
});
await writeFile(pub('qr-get.svg'), qrSvg);
console.log('✓ qr-get.svg ->', `${SITE_URL}/get`);
