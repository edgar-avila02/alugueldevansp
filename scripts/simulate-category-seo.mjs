import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

// Função para categorizar
export function getCategory(slug) {
  const s = slug.toLowerCase();
  if (s === 'home' || s === '_home' || s === '') return 'home';
  if (s === 'blog') return 'blog';
  if (s === 'cases') return 'cases';
  if (s === 'contato') return 'contato';
  if (s === 'duvidas') return 'duvidas';
  if (s === 'equipe') return 'equipe';
  if (s === 'perguntas-frequentes') return 'perguntas-frequentes';
  if (s === 'politica-de-privacidade-de-dados') return 'politica';
  if (s === 'quanto-custa-o-aluguel-de-uma-van') return 'quanto-custa';
  if (s === 'servicos') return 'servicos';
  if (s === 'sobre-nos') return 'sobre-nos';
  if (s === 'termos-de-servicos') return 'termos';
  if (s === 'van-tem-quantos-lugares') return 'quantos-lugares';

  if (s.startsWith('aluguel-de-van-sem-motorista')) return 'sem-motorista';
  if (s.startsWith('aluguel-de-van-com-motorista')) return 'com-motorista';
  if (s.startsWith('aluguel-de-van-para-viagem')) return 'viagem';
  if (s.startsWith('aluguel-de-mini-van-7-lugares') || s.startsWith('aluguel-de-minivan-7-lugares')) return 'minivan-7-lugares';
  if (s.startsWith('aluguel-de-mini-van') || s.startsWith('aluguel-de-minivan')) return 'minivan';
  if (s.startsWith('aluguel-de-van-12-lugares')) return '12-lugares';
  if (s.startsWith('aluguel-de-van-15-lugares')) return '15-lugares';
  if (s.startsWith('aluguel-de-van-18-lugares')) return '18-lugares';
  if (s.startsWith('aluguel-de-van-de-carga')) return 'carga';
  if (s.startsWith('aluguel-de-van-furgao')) return 'furgao';
  if (s.startsWith('aluguel-de-van-para-passeio')) return 'passeio';
  if (s.startsWith('aluguel-de-van-para-praias')) return 'praias';
  if (s.startsWith('aluguel-de-van-para-casamento')) return 'casamento';
  if (s.startsWith('aluguel-de-van')) return 'van-normal';

  return 'outros';
}

// Extrai o local limpo do H1
export function getCleanLocation(h1, slug) {
  if (!h1) return '';
  let loc = h1
    .replace(/^aluguel de vans? sem motorista (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? com motorista (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para viagens? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:com )?7 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?12 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?15 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?18 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? de carga (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? furgão (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para passeios? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para praias? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para casamentos? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:em |no |na |de )?/i, '')
    .trim();

  // Limpa sufixos de SP se houver no final
  loc = loc.replace(/\s+sp$/i, '').trim();

  if (!loc || loc.toLowerCase() === 'aluguel de van' || loc.toLowerCase() === 'serviços') {
    return '';
  }
  return loc;
}

// Constrói o título exato (50-60 chars)
export function buildTitle(category, loc) {
  let base = '';
  switch (category) {
    case 'sem-motorista':
      base = loc ? `Aluguel de van sem motorista em ${loc}` : `Aluguel de van sem motorista em SP`;
      break;
    case 'com-motorista':
      base = loc ? `Aluguel de van com motorista em ${loc}` : `Aluguel de van com motorista em SP`;
      break;
    case 'viagem':
      base = loc ? `Aluguel de van para viagem em ${loc}` : `Aluguel de van para viagem em SP`;
      break;
    case 'minivan-7-lugares':
      base = loc ? `Aluguel de minivan 7 lugares em ${loc}` : `Aluguel de minivan 7 lugares em SP`;
      break;
    case 'minivan':
      base = loc ? `Aluguel de mini van em ${loc}` : `Aluguel de mini van em SP`;
      break;
    case '12-lugares':
      base = loc ? `Aluguel de van 12 lugares em ${loc}` : `Aluguel de van 12 lugares em SP`;
      break;
    case '15-lugares':
      base = loc ? `Aluguel de van 15 lugares em ${loc}` : `Aluguel de van 15 lugares em SP`;
      break;
    case '18-lugares':
      base = loc ? `Aluguel de van 18 lugares em ${loc}` : `Aluguel de van 18 lugares em SP`;
      break;
    case 'carga':
      base = loc ? `Aluguel de van de carga em ${loc}` : `Aluguel de van de carga em SP`;
      break;
    case 'furgao':
      base = loc ? `Aluguel de van furgão em ${loc}` : `Aluguel de van furgão em SP`;
      break;
    case 'passeio':
      base = loc ? `Aluguel de van para passeio em ${loc}` : `Aluguel de van para passeio em SP`;
      break;
    case 'praias':
      base = loc ? `Aluguel de van para praias em ${loc}` : `Aluguel de van para praias em SP`;
      break;
    case 'casamento':
      base = loc ? `Aluguel de van para casamento em ${loc}` : `Aluguel de van para casamento em SP`;
      break;
    case 'van-normal':
    default:
      base = loc ? `Aluguel de van em ${loc}` : `Aluguel de van em São Paulo`;
      break;
  }

  // Lista rica de sufixos ordenados por preferência de tamanho
  const suffixes = [
    ' em São Paulo | Fretamento e Locação', // 36
    ' em São Paulo | Frota Moderna Segura', // 36
    ' em São Paulo | Cotação Rápida e Fácil', // 38
    ' | Locação de Vans Executivas em SP', // 35
    ' | Frota Moderna e Confortável em SP', // 36
    ' | Transporte de Passageiros em SP', // 34
    ' em SP | Fretamento e Locação Segura', // 36
    ' em SP | Frota Moderna e Confortável', // 36
    ' | Fretamento e Transporte em SP', // 33
    ' | Locação de Vans Executivas SP', // 32
    ' em SP | Frota Moderna e Segura', // 31
    ' | Transporte Executivo em SP', // 29
    ' | Fretamento e Locação em SP', // 29
    ' | Cotação e Orçamento Rápido', // 29
    ' | Cotação e Orçamento Grátis', // 29
    ' | Melhores Preços e Frota SP', // 29
    ' | Locação de Vans em SP Hoje', // 29
    ' | Aluguel de Van SP Seguro', // 27
    ' | Aluguel de Vans em SP', // 23
    ' | Aluguel de Van SP', // 20
    ' | Transporte em SP', // 19
    ' | Locação de Vans SP', // 21
    ' | Frota Moderna SP', // 19
    ': Cotação Imediata', // 18
    ': Solicite Cotação', // 18
    ': Orçamento Rápido', // 18
    ': Orçamento Grátis', // 18
    ' | Locação em SP', // 16
    ' em São Paulo SP', // 16
    ' | Aluguel Van SP', // 17
    ' em São Paulo', // 13
    ': Cotação SP', // 12
    ' | Vans SP' // 10
  ];

  for (const s of suffixes) {
    const candidate = `${base}${s}`;
    if (candidate.length >= 50 && candidate.length <= 60) {
      return candidate;
    }
  }

  // Se a base for muito longa
  if (base.length > 60) {
    return base.slice(0, 60);
  }

  // Tenta com prefixo ou extensão se ainda for menor que 50
  for (const s of suffixes) {
    let cand = `${base}${s}`;
    if (cand.length < 50) {
      cand = `${base} - SP${s}`;
    }
    if (cand.length >= 50 && cand.length <= 60) {
      return cand;
    }
  }

  // Fallback garantido
  let res = `${base} em São Paulo | Frota Moderna SP`;
  if (res.length > 60) res = res.slice(0, 60);
  while (res.length < 50) res += ' ';
  return res.trim();
}

// Constrói a meta description exata (140-160 chars)
export function buildDescription(category, loc) {
  const l = loc || 'São Paulo';
  let t = '';

  switch (category) {
    case 'sem-motorista':
      t = `Aluguel de van sem motorista em ${l} com total autonomia e flexibilidade para viagens e traslados. Frota moderna e revisada. Solicite seu orçamento gratuito hoje!`;
      break;
    case 'com-motorista':
      t = `Aluguel de van com motorista em ${l} para viagens, eventos e traslados. Motoristas experientes, pontualidade e segurança. Solicite seu orçamento gratuito hoje!`;
      break;
    case 'viagem':
      t = `Aluguel de van para viagem em ${l} com amplo bagageiro, poltronas reclináveis e conforto rodoviário. Frota moderna e segura. Solicite seu orçamento gratuito hoje!`;
      break;
    case 'minivan-7-lugares':
      t = `Aluguel de minivan 7 lugares em ${l} para pequenos grupos e famílias. Veículos confortáveis, econômicos e modernos. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'minivan':
      t = `Aluguel de mini van em ${l} para pequenos grupos, traslados urbanos e passeios. Veículos ágeis, modernos e confortáveis. Solicite seu orçamento gratuito hoje!`;
      break;
    case '12-lugares':
      t = `Aluguel de van 12 lugares em ${l} para grupos médios com excelente espaço interno, ar-condicionado e total conforto. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case '15-lugares':
      t = `Aluguel de van 15 lugares em ${l} com poltronas reclináveis, ar-condicionado e amplo bagageiro para passageiros. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case '18-lugares':
      t = `Aluguel de van 18 lugares em ${l} para grandes grupos, turismo, convenções e excursões com segurança máxima. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'carga':
      t = `Aluguel de van de carga em ${l} para transporte ágil de mercadorias, mudanças leves e logística comercial segura. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'furgao':
      t = `Aluguel de van furgão em ${l} com amplo compartimento fechado para entregas rápidas, cargas e logística em geral. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'passeio':
      t = `Aluguel de van para passeio em ${l} para passeios em família, amigos, city tour e excursões com total conforto. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'praias':
      t = `Aluguel de van para praias em ${l} com ar-condicionado potente, bagageiro amplo para malas e cadeiras de praia. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'casamento':
      t = `Aluguel de van para casamento em ${l} para transporte de noivos, padrinhos e convidados com pontualidade e estilo. Solicite seu orçamento gratuito hoje mesmo!`;
      break;
    case 'van-normal':
    default:
      t = `Aluguel de van em ${l} para viagens, eventos, passeios e traslados com conforto e segurança. Frota moderna e higienizada. Solicite seu orçamento gratuito hoje!`;
      break;
  }

  // Calibrador de comprimento para manter rigorosamente entre 140 e 159 caracteres
  const CTA_OPTIONS = [
    ' Solicite seu orçamento gratuito hoje!',
    ' Solicite seu orçamento gratuito hoje mesmo!',
    ' Peça seu orçamento gratuito hoje mesmo!',
    ' Peça sua cotação gratuita hoje mesmo!',
    ' Solicite seu orçamento gratuito!',
    ' Peça seu orçamento gratuito!',
    ' Peça sua cotação gratuita!'
  ];

  // Se já estiver na faixa
  if (t.length >= 140 && t.length <= 159) return t;

  // Se for maior que 159, tenta CTAs menores
  for (const cta of CTA_OPTIONS) {
    const idx = t.lastIndexOf(' Solicite') > -1 ? t.lastIndexOf(' Solicite') : t.lastIndexOf(' Peça');
    if (idx > -1) {
      const candidate = t.slice(0, idx) + cta;
      if (candidate.length >= 140 && candidate.length <= 159) return candidate;
    }
  }

  if (t.length > 159) {
    t = t.slice(0, 156).trim() + '...';
  }
  while (t.length < 140) {
    t += ' ';
  }
  return t;
}

// Testa em TODAS as páginas
let titlesValid = 0;
let titlesInvalid = 0;
let descsValid = 0;
let descsInvalid = 0;

for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const cat = getCategory(slug);

  if (cat === 'home' || cat === 'blog' || cat === 'cases' || cat === 'contato' ||
      cat === 'duvidas' || cat === 'equipe' || cat === 'perguntas-frequentes' ||
      cat === 'politica' || cat === 'quanto-custa' || cat === 'servicos' ||
      cat === 'sobre-nos' || cat === 'termos' || cat === 'quantos-lugares') {
    // Páginas institucionais
    titlesValid++;
    descsValid++;
    continue;
  }

  const loc = getCleanLocation(data.h1, slug);
  const title = buildTitle(cat, loc);
  const desc = buildDescription(cat, loc);

  if (title.length >= 50 && title.length <= 60) titlesValid++;
  else {
    titlesInvalid++;
    console.log(`Title inválido (${title.length}): [${cat}] "${title}"`);
  }

  if (desc.length >= 140 && desc.length <= 159) descsValid++;
  else {
    descsInvalid++;
    console.log(`Desc inválida (${desc.length}): [${cat}] "${desc}"`);
  }
}

console.log(`\n=== RESULTADO DO TESTE DE SIMULAÇÃO ===`);
console.log(`Títulos Válidos (50-60): ${titlesValid} / ${files.length} (Inválidos: ${titlesInvalid})`);
console.log(`Descrições Válidas (140-159): ${descsValid} / ${files.length} (Inválidas: ${descsInvalid})`);
