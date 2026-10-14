// Baixa todas as imagens referenciadas nas páginas extraídas e as salva em public/,
// mantendo exatamente o mesmo caminho /wp-content/uploads/... (preserva SEO de imagens).
// Uso: node scripts/images.mjs [--concurrency 10]
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src/data/pages');
const PUBLIC = path.join(ROOT, 'public');
const ORIGIN = 'https://alugueldevansp.com';
const ci = process.argv.indexOf('--concurrency');
const CONC = ci > -1 ? Number(process.argv[ci + 1]) : 10;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36';

const IMG_RE = /\/wp-content\/uploads\/[^\s"'<>(),]+?\.(?:webp|png|jpe?g|gif|svg|avif|ico|pdf)/gi;

const found = new Set();
const add = (t) => {
  for (const m of t.matchAll(IMG_RE)) found.add(decodeURI(m[0]));
};

for (const f of await fs.readdir(PAGES_DIR)) {
  if (f.endsWith('.json')) add(await fs.readFile(path.join(PAGES_DIR, f), 'utf8'));
}
add(await fs.readFile(path.join(ROOT, 'src/data/site.json'), 'utf8'));
// imagens usadas direto no layout
for (const extra of [
  '/wp-content/uploads/2022/01/Logo-aluguel-de-van-sp-sem-fundo.webp',
  '/wp-content/uploads/2022/01/Cadeado-do-certificado-SSL.webp',
]) found.add(extra);

const list = [...found].sort();
console.log(`${list.length} imagens únicas`);

const errors = [];
let done = 0;
let skipped = 0;
const queue = [...list];

async function worker() {
  while (queue.length) {
    const p = queue.shift();
    const dest = path.join(PUBLIC, p);
    try {
      await fs.access(dest);
      skipped++;
      continue;
    } catch {}
    let ok = false;
    for (let i = 1; i <= 3 && !ok; i++) {
      try {
        const res = await fetch(ORIGIN + encodeURI(p), { headers: { 'user-agent': UA } });
        if (res.status === 404) {
          errors.push({ p, error: '404' });
          ok = true;
          break;
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const buf = Buffer.from(await res.arrayBuffer());
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, buf);
        ok = true;
      } catch (e) {
        if (i === 3) errors.push({ p, error: String(e.message || e) });
        else await new Promise((r) => setTimeout(r, 1000 * i));
      }
    }
    done++;
    if (done % 100 === 0) console.log(`baixadas ${done} (puladas ${skipped}) de ${list.length}`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
await fs.writeFile(path.join(ROOT, 'scripts/images-errors.json'), JSON.stringify(errors, null, 1));
console.log(`Concluído: ${done} baixadas, ${skipped} já existiam, ${errors.length} erros`);
