import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { injectForm } from '../src/lib/pages.js';

const pagesDir = path.resolve('src/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json') && f.startsWith('aluguel-'));

let total = 0;
let errors = [];

for (const file of files) {
  total++;
  const data = JSON.parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  const processedHtml = injectForm(data.html, data.path);
  const $ = cheerio.load(processedHtml);

  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headings.push($(el).prop('tagName').toUpperCase());
  });

  // O H1 vem do template (heroTitle)
  const fullHierarchy = ['H1', ...headings];

  // Verifica se há salto de nível (ex: H1 -> H3, H2 -> H4)
  for (let i = 0; i < fullHierarchy.length - 1; i++) {
    const curr = parseInt(fullHierarchy[i].replace('H', ''), 10);
    const next = parseInt(fullHierarchy[i + 1].replace('H', ''), 10);
    // Não pode aumentar mais de 1 nível (ex: curr=1, next=3 é salto; curr=2, next=4 é salto)
    if (next > curr + 1) {
      errors.push({
        file,
        issue: `Salto ilegal de nível: ${fullHierarchy[i]} -> ${fullHierarchy[i + 1]} na posição ${i}`
      });
      break;
    }
  }
}

console.log(`=== AUDITORIA DE HIERARQUIA DE HEADINGS ===`);
console.log(`Total de páginas de serviço auditadas: ${total}`);
console.log(`Páginas sem saltos de nível (100% hierárquicas): ${total - errors.length}`);
console.log(`Erros de hierarquia encontrados: ${errors.length}`);
if (errors.length > 0) {
  console.log('Amostra de erros:', errors.slice(0, 10));
}
