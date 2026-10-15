// @ts-check
import { defineConfig } from 'astro/config';

// URLs idênticas ao WordPress: com barra final e /slug/index.html (Cloudflare Pages)
import { WHATSAPP_REDIRECTS } from './src/lib/whatsapp-links.js';

/** @type {Record<string, import('astro').RedirectConfig>} */
const redirects = {};
for (const [src, dest] of Object.entries(WHATSAPP_REDIRECTS)) {
  const canonical = src.replace(/\/$/, '') + '/';
  redirects[canonical] = { status: 302, destination: dest };
}

export default defineConfig({
  site: 'https://alugueldevansp.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  redirects,
});
