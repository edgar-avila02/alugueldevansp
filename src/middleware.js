import { defineMiddleware } from 'astro:middleware';
import { WHATSAPP_REDIRECTS } from './lib/whatsapp-links.js';

export const onRequest = defineMiddleware((context, next) => {
  const rawPath = decodeURIComponent(context.url.pathname).replace(/[\u200B-\u200D\uFEFF]/g, '');
  const clean = rawPath.replace(/\/$/, '');
  const dest = WHATSAPP_REDIRECTS[clean] || WHATSAPP_REDIRECTS[clean + '/'];
  if (dest) {
    return context.redirect(dest, 302);
  }
  return next();
});
