// Gera os sitemaps com os MESMOS nomes do Rank Math (sitemap_index.xml, post-sitemap.xml,
// page-sitemap1..N.xml, category-sitemap.xml, metform-form-sitemap.xml), a partir de src/data/urls.json,
// incluindo apenas URLs que existem no build. Roda automaticamente antes do build.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://alugueldevansp.com';
const urls = JSON.parse(await fs.readFile(path.join(ROOT, 'src/data/urls.json'), 'utf8'));
const pagesDir = path.join(ROOT, 'src/data/pages');
const existing = new Set((await fs.readdir(pagesDir)).map((f) => f.replace(/\.json$/, '')));
const keyFor = (p) => (p === '/' ? '_home' : decodeURIComponent(p).replace(/^\/|\/$/g, '').replace(/\//g, '__'));

const esc = (s) => s.replace(/&/g, '&amp;');
const urlset = (items) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  items
    .map((u) => `\t<url>\n\t\t<loc>${esc(u.url)}</loc>${u.lastmod ? `\n\t\t<lastmod>${u.lastmod}</lastmod>` : ''}\n\t</url>`)
    .join('\n') +
  `\n</urlset>\n`;

// preserva a divisão original dos sitemaps (cada arquivo = um bloco do sitemap_index original)
const groups = new Map();
for (const u of urls) {
  if (!existing.has(keyFor(u.path))) continue;
  const name = path.basename(u.sitemap);
  if (!groups.has(name)) groups.set(name, []);
  groups.get(name).push(u);
}

const out = path.join(ROOT, 'public');
const index = [];
for (const [name, items] of groups) {
  await fs.writeFile(path.join(out, name), urlset(items));
  const last = items.map((i) => i.lastmod).filter(Boolean).sort().at(-1);
  index.push(`\t<sitemap>\n\t\t<loc>${ORIGIN}/${name}</loc>${last ? `\n\t\t<lastmod>${last}</lastmod>` : ''}\n\t</sitemap>`);
}
await fs.writeFile(
  path.join(out, 'sitemap_index.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${index.join('\n')}\n</sitemapindex>\n`,
);
// sitemap.xml único com TODAS as páginas (https://alugueldevansp.com/sitemap.xml)
const all = [...groups.values()].flat();
await fs.writeFile(path.join(out, 'sitemap.xml'), urlset(all));
console.log(`Sitemaps gerados: ${groups.size} arquivos, ${all.length} URLs (+ sitemap.xml único)`);
