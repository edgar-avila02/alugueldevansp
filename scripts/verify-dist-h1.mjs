import fs from 'node:fs';
import * as cheerio from 'cheerio';

const distPaths = [
  'dist/aluguel-de-mini-van-amparo/index.html',
  'dist/aluguel-de-mini-van-7-lugares-amparo/index.html',
  'dist/aluguel-de-van-15-lugares-pinheiros/index.html',
  'dist/aluguel-de-van-com-motorista-campinas/index.html',
  'dist/aluguel-de-van-para-casamento-adolfo/index.html',
  'dist/aluguel-de-van-sem-motorista-osasco/index.html',
  'dist/aluguel-de-mini-van-angatuba/index.html'
];

for (const p of distPaths) {
  if (!fs.existsSync(p)) {
    console.log('Arquivo não encontrado:', p);
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const $ = cheerio.load(html);
  const h1Text = $('h1').first().text().trim();
  const title = $('title').text().trim();
  const desc = $('meta[name="description"]').attr('content') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDesc = $('meta[property="og:description"]').attr('content') || '';
  console.log('==================================================');
  console.log('PATH:', p);
  console.log('H1:', h1Text);
  console.log('TITLE (' + title.length + ' chars):', title);
  console.log('DESC  (' + desc.length + ' chars):', desc);
  console.log('OG:TITLE == TITLE ?', ogTitle === title);
  console.log('OG:DESC  == DESC  ?', ogDesc === desc);
}
