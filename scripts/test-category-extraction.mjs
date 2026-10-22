import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/pages';
const testFiles = [
  'aluguel-de-van-sem-motorista-agua-rasa.json',
  'aluguel-de-van-com-motorista-adolfo.json',
  'aluguel-de-van-para-viagem-santos.json',
  'aluguel-de-mini-van-7-lugares-campinas.json',
  'aluguel-de-minivan-7-lugares-agua-rasa.json',
  'aluguel-de-mini-van-adolfo.json',
  'aluguel-de-van-12-lugares-adolfo.json',
  'aluguel-de-van-15-lugares-guarulhos.json',
  'aluguel-de-van-18-lugares-campinas.json',
  'aluguel-de-van-de-carga-agua-rasa.json',
  'aluguel-de-van-furgao-agua-rasa.json',
  'aluguel-de-van-para-passeio-adolfo.json',
  'aluguel-de-van-para-praias-de-bertioga.json',
  'aluguel-de-van-para-casamento-adolfo.json',
  'aluguel-de-van-jandira.json',
  'aluguel-de-van-em-campinas.json',
  'aluguel-de-van.json',
  'aluguel-de-van-com-motorista.json',
  'aluguel-de-van-sem-motorista.json'
];

for (const file of testFiles) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Não existe: ${file}`);
    continue;
  }
  const page = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`[${file}] h1: "${page.h1}" | slug: "${page.path}"`);
}
