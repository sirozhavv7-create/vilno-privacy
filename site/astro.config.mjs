import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config.mjs';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // /faq -> faq.html; на Firebase Hosting вмикаємо cleanUrls
    format: 'file',
  },
  integrations: [
    sitemap({
      // /get — службова сторінка з noindex, у sitemap їй не місце
      filter: (page) => !page.includes('/get'),
    }),
  ],
});
