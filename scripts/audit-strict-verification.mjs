import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let total = files.length;
let titleErrors = [];
let descErrors = [];
let categoryMismatchErrors = [];
let ogErrors = [];
let twitterErrors = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const slug = file.replace(/\.json$/, '');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const t = data.title || '';
  const d = data.description || '';

  // Regra de tamanho
  if (t.length < 50 || t.length > 60) {
    titleErrors.push({ file, len: t.length, title: t });
  }

  // Descrição: aceitamos até 160 (página institucional ou local)
  if (d.length < 140 || d.length > 160) {
    descErrors.push({ file, len: d.length, desc: d });
  }

  // Verificação de categoria estrita
  if (slug.includes('sem-motorista')) {
    if (t.toLowerCase().includes('com motorista') || d.toLowerCase().includes('com motorista')) {
      categoryMismatchErrors.push({ file, reason: 'Página sem-motorista contém "com motorista"' });
    }
  }

  if (slug.includes('de-carga') || slug.includes('furgao')) {
    if (t.toLowerCase().includes('com motorista') || d.toLowerCase().includes('com motorista')) {
      categoryMismatchErrors.push({ file, reason: 'Página de carga/furgão contém "com motorista"' });
    }
  }

  if (slug.startsWith('aluguel-de-van-em-') || (slug.startsWith('aluguel-de-van-') && !slug.includes('motorista') && !slug.includes('viagem') && !slug.includes('lugares') && !slug.includes('carga') && !slug.includes('furgao') && !slug.includes('passeio') && !slug.includes('praias') && !slug.includes('casamento') && !slug.includes('mini'))) {
    if (t.toLowerCase().includes('com motorista') || d.toLowerCase().includes('com motorista')) {
      categoryMismatchErrors.push({ file, reason: 'Página de van normal contém "com motorista"' });
    }
  }

  // Checar OG e Twitter
  if (Array.isArray(data.og)) {
    const ogTitle = data.og.find(x => x[0] === 'og:title');
    const ogDesc = data.og.find(x => x[0] === 'og:description');
    if (ogTitle && ogTitle[1] !== t) ogErrors.push({ file, field: 'og:title' });
    if (ogDesc && ogDesc[1] !== d) ogErrors.push({ file, field: 'og:description' });
  }

  if (Array.isArray(data.twitter)) {
    const twTitle = data.twitter.find(x => x[0] === 'twitter:title');
    const twDesc = data.twitter.find(x => x[0] === 'twitter:description');
    if (twTitle && twTitle[1] !== t) twitterErrors.push({ file, field: 'twitter:title' });
    if (twDesc && twDesc[1] !== d) twitterErrors.push({ file, field: 'twitter:description' });
  }
}

console.log('=== RELATÓRIO DE AUDITORIA ESTRITA DE DISCO ===');
console.log(`Total de arquivos auditados: ${total}`);
console.log(`Erros de tamanho de Título (50-60): ${titleErrors.length}`);
console.log(`Erros de tamanho de Meta Description (140-160): ${descErrors.length}`);
console.log(`Erros de Mismatch de Categoria ("com motorista" em páginas indevidas): ${categoryMismatchErrors.length}`);
console.log(`Erros de sincronização com OpenGraph: ${ogErrors.length}`);
console.log(`Erros de sincronização com Twitter Card: ${twitterErrors.length}`);

if (titleErrors.length > 0) {
  console.log('\nExemplos de erros de título:', titleErrors.slice(0, 5));
}
if (descErrors.length > 0) {
  console.log('\nExemplos de erros de descrição:', descErrors.slice(0, 5));
}
if (categoryMismatchErrors.length > 0) {
  console.log('\nExemplos de mismatch de categoria:', categoryMismatchErrors.slice(0, 5));
}
