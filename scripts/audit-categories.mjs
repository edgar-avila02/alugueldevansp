import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const prefixCounts = {};
const samplesByPrefix = {};

for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  
  // Vamos identificar o prefixo de serviço
  let matchedPrefix = 'outros';
  
  const prefixes = [
    'aluguel-de-van-sem-motorista',
    'aluguel-de-van-com-motorista',
    'aluguel-de-van-para-viagem',
    'aluguel-de-mini-van-7-lugares',
    'aluguel-de-mini-van',
    'aluguel-de-van-12-lugares',
    'aluguel-de-van-15-lugares',
    'aluguel-de-van-18-lugares',
    'aluguel-de-van-de-carga',
    'aluguel-de-van-furgao',
    'aluguel-de-van-para-passeio',
    'aluguel-de-van-para-praias',
    'aluguel-de-van-para-casamento',
    'aluguel-de-van-em',
    'aluguel-de-van'
  ];

  for (const p of prefixes) {
    if (slug.startsWith(p)) {
      matchedPrefix = p;
      break;
    }
  }

  prefixCounts[matchedPrefix] = (prefixCounts[matchedPrefix] || 0) + 1;
  if (!samplesByPrefix[matchedPrefix]) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    samplesByPrefix[matchedPrefix] = {
      slug,
      title: data.title,
      description: data.description
    };
  }
}

console.log('=== DISTRIBUIÇÃO DAS CATEGORIAS DE PÁGINAS ===');
for (const [prefix, count] of Object.entries(prefixCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`\nCategoria [${prefix}]: ${count} páginas`);
  console.log(`  Exemplo Slug: ${samplesByPrefix[prefix].slug}`);
  console.log(`  Exemplo Title: ${samplesByPrefix[prefix].title}`);
  console.log(`  Exemplo Desc: ${samplesByPrefix[prefix].description}`);
}
