import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

function cat(slug) {
  const s = slug.toLowerCase();
  if (s.includes('sem-motorista')) return 'sem-motorista';
  if (s.includes('com-motorista')) return 'com-motorista';
  if (s.includes('para-viagem')) return 'viagem';
  if (s.includes('7-lugares')) return 'minivan-7';
  if (s.includes('mini-van') || s.includes('minivan')) return 'minivan';
  if (s.includes('12-lugares')) return '12';
  if (s.includes('15-lugares')) return '15';
  if (s.includes('18-lugares')) return '18';
  if (s.includes('de-carga')) return 'carga';
  if (s.includes('furgao')) return 'furgao';
  if (s.includes('para-passeio')) return 'passeio';
  if (s.includes('para-praias')) return 'praias';
  if (s.includes('para-casamento')) return 'casamento';
  if (s.startsWith('aluguel-de-van')) return 'van-normal';
  return 'institucional';
}

const get = (html, re) => { const m = html.match(re); return m ? m[1] : ''; };
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const problems = [];
const files = walk(DIST);
for (const f of files) {
  const rel = path.relative(DIST, path.dirname(f)).replace(/\\/g, '/');
  const slug = rel || 'home';
  const c = cat(slug);
  if (c === 'institucional') continue;
  const html = fs.readFileSync(f, 'utf8');
  const title = decode(get(html, /<title>([^<]*)<\/title>/i));
  const desc = decode(get(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i));
  const ogt = decode(get(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i));
  const ogd = decode(get(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i));
  const h1 = decode(get(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '').trim());
  const meta = `${title} || ${desc}`.toLowerCase();
  const issues = [];

  if (title.length < 50 || title.length > 60) issues.push(`title ${title.length}`);
  if (desc.length < 140 || desc.length > 160) issues.push(`desc ${desc.length}`);
  if (ogt && ogt !== title) issues.push('og:title difere');
  if (ogd && ogd !== desc) issues.push('og:desc difere');
  if (c !== 'com-motorista' && meta.includes('com motorista')) issues.push('"com motorista" indevido');
  if (c !== 'sem-motorista' && meta.includes('sem motorista')) issues.push('"sem motorista" indevido');
  if (c !== 'carga' && c !== 'furgao' && meta.includes('de carga')) issues.push('"de carga" indevido');
  if (/\.\.\.$/.test(desc)) issues.push('desc truncada');
  if (/\s{2,}/.test(title) || /\s{2,}/.test(desc)) issues.push('espaços duplos');
  if (/ em (para|de|com|sem) /i.test(title)) issues.push('local mal extraído');

  // H1 coerente com a categoria
  const h = h1.toLowerCase();
  if (c !== 'com-motorista' && h.includes('com motorista')) issues.push(`H1 indevido: ${h1}`);

  if (issues.length) problems.push({ slug, c, title, desc, h1, issues });
}

console.log(`Páginas HTML analisadas: ${files.length}`);
console.log(`Páginas com problema: ${problems.length}`);
const byIssue = {};
for (const p of problems) for (const i of p.issues) { const k = i.split(':')[0].replace(/\d+/g, 'N'); byIssue[k] = (byIssue[k] || 0) + 1; }
console.log(byIssue);
for (const p of problems.slice(0, 40)) {
  console.log(`\n[${p.c}] /${p.slug}/ -> ${p.issues.join(' | ')}`);
  console.log(`  T(${p.title.length}): ${p.title}`);
  console.log(`  D(${p.desc.length}): ${p.desc}`);
  console.log(`  H1: ${p.h1}`);
}
