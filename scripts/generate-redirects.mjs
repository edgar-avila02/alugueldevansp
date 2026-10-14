import fs from 'node:fs';
import path from 'node:path';
import { WHATSAPP_REDIRECTS } from '../src/lib/whatsapp-links.js';

const lines = [
  '# Cloudflare Pages Redirects - Aluguel de Van SP',
  '# Redirecionamentos para WhatsApp com base na planilha oficial',
  ''
];

// URLs adicionais com variações como zero-width space ou variações com/sem barra
const allRedirects = { ...WHATSAPP_REDIRECTS };

// Adiciona variações comuns do WordPress
allRedirects['/aluguel-de-van\u200B-1'] = WHATSAPP_REDIRECTS['/aluguel-de-van-1'];
allRedirects['/aluguel-de-van-sem-motorista\u200B-1'] = WHATSAPP_REDIRECTS['/aluguel-de-van-sem-motorista-1'];
allRedirects['/aluguel-de-van-para-passeio\u200B-1'] = WHATSAPP_REDIRECTS['/aluguel-de-van-para-passeio-1'];

for (const [source, destination] of Object.entries(allRedirects)) {
  const cleanSource = source.replace(/\/$/, '');
  lines.push(`${cleanSource} ${destination} 302`);
  lines.push(`${cleanSource}/ ${destination} 302`);
}

const content = lines.join('\n') + '\n';
fs.writeFileSync('public/_redirects', content, 'utf8');
console.log(`Generated public/_redirects with ${Object.keys(allRedirects).length * 2} rules.`);
