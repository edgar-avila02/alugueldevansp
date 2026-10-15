import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

let total = 0;
let titlePassed = 0;
let descPassed = 0;
let ogPassed = 0;
let twitterPassed = 0;

let minTitle = 999, maxTitle = 0;
let minDesc = 999, maxDesc = 0;

const errors = [];
const sampleAudit = [];

const trackedSlugs = [
  '_home.json',
  'sobre-nos.json',
  'contato.json',
  'equipe.json',
  'cases.json',
  'servicos.json',
  'aluguel-de-van.json',
  'aluguel-de-van-com-motorista.json',
  'aluguel-de-mini-van-7-lugares.json',
  'aluguel-de-van-12-lugares.json',
  'aluguel-de-van-com-motorista-campinas.json',
  'aluguel-de-van-santos.json',
  'aluguel-de-minivan-7-lugares-moema.json',
  'aluguel-de-van-15-lugares-pinheiros.json',
  'aluguel-de-van-para-viagem-sorocaba.json',
  'aluguel-de-mini-van-7-lugares-aguas-de-lindoia.json'
];

for (const file of files) {
  total++;
  const filePath = path.join(pagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const t = data.title || '';
  const d = data.description || '';
  const tLen = t.length;
  const dLen = d.length;

  if (tLen < minTitle) minTitle = tLen;
  if (tLen > maxTitle) maxTitle = tLen;
  if (dLen < minDesc) minDesc = dLen;
  if (dLen > maxDesc) maxDesc = dLen;

  let fileHasError = false;

  if (tLen >= 50 && tLen <= 60) {
    titlePassed++;
  } else {
    fileHasError = true;
    errors.push({ file, issue: `Título fora do limite [50, 60]: ${tLen} chars ("${t}")` });
  }

  if (dLen >= 140 && dLen <= 160) {
    descPassed++;
  } else {
    fileHasError = true;
    errors.push({ file, issue: `Descrição fora do limite [140, 160]: ${dLen} chars ("${d}")` });
  }

  // Verifica OG
  const ogTitle = data.og?.find(([k]) => k === 'og:title')?.[1];
  const ogDesc = data.og?.find(([k]) => k === 'og:description')?.[1];
  if (ogTitle === t && ogDesc === d) {
    ogPassed++;
  }

  // Verifica Twitter
  const twTitle = data.twitter?.find(([k]) => k === 'twitter:title')?.[1];
  const twDesc = data.twitter?.find(([k]) => k === 'twitter:description')?.[1];
  if (twTitle === t && twDesc === d) {
    twitterPassed++;
  }

  if (trackedSlugs.includes(file)) {
    sampleAudit.push({
      file,
      url: data.url || data.path,
      title: t,
      titleLength: tLen,
      titleStatus: tLen >= 50 && tLen <= 60 ? '✓ VÁLIDO (50-60)' : '✗ INVÁLIDO',
      description: d,
      descriptionLength: dLen,
      descriptionStatus: dLen >= 140 && dLen <= 160 ? '✓ VÁLIDO (140-160)' : '✗ INVÁLIDO',
    });
  }
}

const report = {
  resumoAuditoria: {
    totalPaginasAuditadas: total,
    titulosValidos: `${titlePassed} de ${total} (${((titlePassed / total) * 100).toFixed(2)}%)`,
    descricoesValidas: `${descPassed} de ${total} (${((descPassed / total) * 100).toFixed(2)}%)`,
    faixaTitulosEncontrada: `De ${minTitle} a ${maxTitle} caracteres (Regra: 50 a 60)`,
    faixaDescricoesEncontrada: `De ${minDesc} a ${maxDesc} caracteres (Regra: 140 a 160)`,
    ogSincronizado: `${ogPassed} de ${total}`,
    twitterSincronizado: `${twitterPassed} de ${total}`,
    errosEncontrados: errors.length
  },
  amostraEvidencias: sampleAudit
};

console.log(JSON.stringify(report, null, 2));
fs.writeFileSync('scripts/relatorio-auditoria-seo.json', JSON.stringify(report, null, 2), 'utf8');
