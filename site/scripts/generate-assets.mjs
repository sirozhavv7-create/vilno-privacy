/**
 * Генерація статичних асетів сайту:
 *  - og.png (1200×630) — фон у кольорах бренду + назва + слоган;
 *  - набір фавіконів (favicon-32.png, apple-touch-icon.png, icon-192/512.png)
 *    з favicon.svg (плейсхолдер до появи справжньої іконки застосунку);
 *  - qr-get.svg — статичний QR, що веде на SITE_URL/get.
 *
 * Запуск: npm run generate:assets (з каталогу site/).
 * Перегенеруй після зміни SITE_URL або заміни favicon.svg.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { SITE_URL, APP_NAME, TAGLINE } from '../src/config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

// ---- OG-зображення 1200×630 ----
// Текст рендериться системним шрифтом із кирилицею (DejaVu Sans / еквівалент).
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf8f1"/>
  <circle cx="1120" cy="80" r="260" fill="#e7ecdf"/>
  <circle cx="80" cy="600" r="200" fill="#e7ecdf"/>
  <rect x="80" y="150" width="130" height="130" rx="32" fill="#586b4d"/>
  <path d="M145 253 C145 253 116 233 116 209 C116 194 128 184 140 187 C142 187.6 143.5 188.5 145 190 C146.5 188.5 148 187.6 150 187 C162 184 174 194 174 209 C174 218 170 226 165 232" stroke="#fbf8f1" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M145 253 V211" stroke="#fbf8f1" stroke-width="9" stroke-linecap="round"/>
  <text x="80" y="410" font-family="DejaVu Sans" font-size="76" font-weight="bold" fill="#2a2622">${TAGLINE}</text>
  <text x="80" y="480" font-family="DejaVu Sans" font-size="40" fill="#7a736a">Український застосунок, який допомагає</text>
  <text x="80" y="535" font-family="DejaVu Sans" font-size="40" fill="#7a736a">кинути курити й парити</text>
  <text x="1120" y="580" text-anchor="end" font-family="DejaVu Sans" font-size="36" font-weight="bold" fill="#586b4d">${APP_NAME}</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(pub('og.png'));
console.log('✓ og.png');

// ---- Фавікони з favicon.svg ----
const faviconSvg = await readFile(pub('favicon.svg'));
const sizes = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
for (const [name, size] of sizes) {
  await sharp(faviconSvg, { density: 300 }).resize(size, size).png().toFile(pub(name));
  console.log(`✓ ${name}`);
}

// ---- QR-код на /get ----
const qrSvg = await QRCode.toString(`${SITE_URL}/get`, {
  type: 'svg',
  margin: 0,
  color: { dark: '#2a2622', light: '#ffffff' },
});
await writeFile(pub('qr-get.svg'), qrSvg);
console.log('✓ qr-get.svg ->', `${SITE_URL}/get`);
