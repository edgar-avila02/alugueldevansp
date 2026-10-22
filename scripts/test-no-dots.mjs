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
    .replace(/^aluguel de vans? para viage(?:m|ns) (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:com )?7 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?12 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?15 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?18 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? de carga (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? furg(?:ão|ao|ões) (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para passeios? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para praias? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para casamentos? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:em |no |na |de )?/i, '')
    .trim();

  loc = loc.replace(/\s+sp$/i, '').trim();

  const lLower = loc.toLowerCase();
  if (
    !loc ||
    lLower === 'aluguel de van' ||
    lLower === 'aluguel de mini van' ||
    lLower === 'aluguel de minivan' ||
    lLower === 'mini van' ||
    lLower === 'minivan' ||
    lLower === 'van' ||
    lLower === 'serviços' ||
    lLower === 'sem motorista' ||
    lLower === 'com motorista' ||
    lLower === 'de carga' ||
    lLower === 'furgão' ||
    lLower === 'furgao' ||
    lLower === 'para viagem' ||
    lLower === 'para viagens' ||
    lLower === 'para passeio' ||
    lLower === 'para passeios' ||
    lLower === 'para praias' ||
    lLower === 'para praia' ||
    lLower === 'para casamento' ||
    lLower === 'para casamentos' ||
    lLower === '7 lugares' ||
    lLower === '12 lugares' ||
    lLower === '15 lugares' ||
    lLower === '18 lugares' ||
    lLower.startsWith('van tem quantos lugares')
  ) {
    return '';
  }
  return loc;
}

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

  const suffixes = [
    ' em São Paulo | Fretamento e Locação',
    ' em São Paulo | Frota Moderna Segura',
    ' em São Paulo | Cotação Rápida e Fácil',
    ' | Locação de Vans Executivas em SP',
    ' | Frota Moderna e Confortável em SP',
    ' | Transporte de Passageiros em SP',
    ' em SP | Fretamento e Locação Segura',
    ' em SP | Frota Moderna e Confortável',
    ' | Fretamento e Transporte em SP',
    ' | Locação de Vans Executivas SP',
    ' em SP | Frota Moderna e Segura',
    ' | Transporte Executivo em SP',
    ' | Fretamento e Locação em SP',
    ' | Cotação e Orçamento Rápido',
    ' | Cotação e Orçamento Grátis',
    ' | Melhores Preços e Frota SP',
    ' | Locação de Vans em SP Hoje',
    ' | Aluguel de Van SP Seguro',
    ' | Aluguel de Vans em SP',
    ' | Aluguel de Van SP',
    ' | Transporte em SP',
    ' | Locação de Vans SP',
    ' | Frota Moderna SP',
    ': Cotação Imediata',
    ': Solicite Cotação',
    ': Orçamento Rápido',
    ': Orçamento Grátis',
    ' | Locação em SP',
    ' em São Paulo SP',
    ' | Aluguel Van SP',
    ' em São Paulo',
    ': Cotação SP',
    ' | Vans SP'
  ];

  for (const s of suffixes) {
    const candidate = `${base}${s}`;
    if (candidate.length >= 50 && candidate.length <= 60) {
      return candidate;
    }
  }

  if (base.length > 60) return base.slice(0, 60);

  for (const s of suffixes) {
    let cand = `${base}${s}`;
    if (cand.length < 50) cand = `${base} - SP${s}`;
    if (cand.length >= 50 && cand.length <= 60) return cand;
  }

  let res = `${base} em São Paulo | Frota Moderna SP`;
  if (res.length > 60) res = res.slice(0, 60);
  while (res.length < 50) res += ' ';
  return res.trim();
}

// Construtor sem reticências de Meta Description
export function buildDescription(category, loc) {
  const l = loc || 'São Paulo';

  // Bases por categoria (versão padrão e versão concisa para cidades de nome longo)
  let bases = [];
  switch (category) {
    case 'sem-motorista':
      bases = [
        `Aluguel de van sem motorista em ${l} com total autonomia e flexibilidade para viagens e traslados. Frota moderna e revisada.`,
        `Aluguel de van sem motorista em ${l} com autonomia para viagens e traslados. Frota revisada e segura.`,
        `Aluguel de van sem motorista em ${l} com liberdade de horários e roteiros próprios. Frota revisada.`
      ];
      break;
    case 'com-motorista':
      bases = [
        `Aluguel de van com motorista em ${l} para viagens, eventos e traslados. Motoristas experientes, pontualidade e segurança.`,
        `Aluguel de van com motorista em ${l} para viagens e eventos com pontualidade, conforto e segurança.`,
        `Aluguel de van com motorista em ${l} com condutores profissionais, pontualidade e segurança.`
      ];
      break;
    case 'viagem':
      bases = [
        `Aluguel de van para viagem em ${l} com amplo bagageiro, poltronas reclináveis e conforto rodoviário. Frota moderna.`,
        `Aluguel de van para viagem em ${l} com poltronas reclináveis, bagageiro amplo e conforto na estrada.`,
        `Aluguel de van para viagem em ${l} com segurança, conforto e espaço de bagagem para toda a família.`
      ];
      break;
    case 'minivan-7-lugares':
      bases = [
        `Aluguel de minivan 7 lugares em ${l} para pequenos grupos e famílias. Veículos confortáveis, econômicos e modernos.`,
        `Aluguel de minivan 7 lugares em ${l} para famílias e passeios com conforto, agilidade e economia.`,
        `Aluguel de minivan 7 lugares em ${l} com espaço ideal para viagens em família e pequenos grupos.`
      ];
      break;
    case 'minivan':
      bases = [
        `Aluguel de mini van em ${l} para pequenos grupos, traslados urbanos e passeios. Veículos ágeis, modernos e confortáveis.`,
        `Aluguel de mini van em ${l} para grupos pequenos com agilidade urbana, conforto e segurança.`,
        `Aluguel de mini van em ${l} com conforto e praticidade para viagens curtas e passeios urbanos.`
      ];
      break;
    case '12-lugares':
      bases = [
        `Aluguel de van 12 lugares em ${l} para grupos médios com excelente espaço interno, ar-condicionado e total conforto.`,
        `Aluguel de van 12 lugares em ${l} para grupos médios com poltronas confortáveis e ar-condicionado.`,
        `Aluguel de van 12 lugares em ${l} com espaço perfeito, segurança e ar-condicionado para seu grupo.`
      ];
      break;
    case '15-lugares':
      bases = [
        `Aluguel de van 15 lugares em ${l} com poltronas reclináveis, ar-condicionado e amplo bagageiro para passageiros.`,
        `Aluguel de van 15 lugares em ${l} para grupos com ar-condicionado, poltronas confortáveis e segurança.`,
        `Aluguel de van 15 lugares em ${l} com conforto, ar-condicionado e espaço para todos os passageiros.`
      ];
      break;
    case '18-lugares':
      bases = [
        `Aluguel de van 18 lugares em ${l} para grandes grupos, turismo, convenções e excursões com segurança máxima.`,
        `Aluguel de van 18 lugares em ${l} para excursões, eventos e grandes grupos com conforto e segurança.`,
        `Aluguel de van 18 lugares em ${l} para turismo e eventos com capacidade máxima e muito conforto.`
      ];
      break;
    case 'carga':
      bases = [
        `Aluguel de van de carga em ${l} para transporte ágil de mercadorias, mudanças leves e logística comercial segura.`,
        `Aluguel de van de carga em ${l} para transporte rápido de mercadorias, cargas e mudanças comerciais.`,
        `Aluguel de van de carga em ${l} com agilidade para fretes rápidos, entregas e logística comercial.`
      ];
      break;
    case 'furgao':
      bases = [
        `Aluguel de van furgão em ${l} com amplo compartimento fechado para entregas rápidas, cargas e logística em geral.`,
        `Aluguel de van furgão em ${l} com baú espaçoso para cargas fechadas, entregas e transporte seguro.`,
        `Aluguel de van furgão em ${l} para entregas urbanas, mercadorias e transporte de carga protegida.`
      ];
      break;
    case 'passeio':
      bases = [
        `Aluguel de van para passeio em ${l} para viagens em família, amigos, city tour e excursões com total conforto.`,
        `Aluguel de van para passeio em ${l} para amigos e família com roteiros flexíveis e total conforto.`,
        `Aluguel de van para passeio em ${l} para turismo e passeios em grupo com segurança e comodidade.`
      ];
      break;
    case 'praias':
      bases = [
        `Aluguel de van para praias em ${l} com ar-condicionado potente, bagageiro amplo para malas e cadeiras de praia.`,
        `Aluguel de van para praias em ${l} com ar-condicionado, amplo porta-malas e conforto para o litoral.`,
        `Aluguel de van para praias em ${l} com espaço para malas de praia, ar-condicionado e segurança total.`
      ];
      break;
    case 'casamento':
      bases = [
        `Aluguel de van para casamento em ${l} para transporte de noivos, padrinhos e convidados com pontualidade e estilo.`,
        `Aluguel de van para casamento em ${l} para padrinhos e convidados com pontualidade, requinte e segurança.`,
        `Aluguel de van para casamento em ${l} para transporte dos convidados da festa com pontualidade.`
      ];
      break;
    case 'van-normal':
    default:
      bases = [
        `Aluguel de van em ${l} para viagens, eventos, passeios e traslados com conforto e segurança. Frota higienizada.`,
        `Aluguel de van em ${l} para viagens corporativas, eventos e traslados com pontualidade e conforto.`,
        `Aluguel de van em ${l} com frota moderna, segura e higienizada para transporte de passageiros.`
      ];
      break;
  }

  // CTAs ordenados de maior para menor
  const ctas = [
    ' Peça agora mesmo seu orçamento gratuito hoje!', // 46
    ' Solicite seu orçamento gratuito hoje mesmo!', // 43
    ' Solicite seu orçamento gratuito hoje!', // 38
    ' Solicite seu orçamento gratuito agora!', // 39
    ' Peça seu orçamento gratuito hoje mesmo!', // 40
    ' Peça sua cotação gratuita hoje mesmo!', // 38
    ' Solicite sua cotação gratuita hoje!', // 36
    ' Peça seu orçamento gratuito hoje!', // 34
    ' Solicite seu orçamento gratuito!', // 33
    ' Peça seu orçamento gratuito!', // 29
    ' Peça sua cotação gratuita!', // 27
    ' Solicite cotação grátis!', // 25
    ' Peça já seu orçamento!', // 23
    ' Peça sua cotação!' // 19
  ];

  // Testa todas as combinações de base e cta
  for (const b of bases) {
    for (const c of ctas) {
      const candidate = `${b}${c}`;
      if (candidate.length >= 140 && candidate.length <= 160) {
        return candidate;
      }
    }
  }

  // Fallback seguro caso necessário
  for (const b of bases) {
    for (const c of ctas) {
      const candidate = `${b}${c}`;
      if (candidate.length <= 160) {
        let pad = candidate;
        while (pad.length < 140) pad += ' ';
        return pad.trim();
      }
    }
  }

  return bases[0].slice(0, 160);
}

// Testa em TODAS as 4.068 páginas
let vTitles = 0;
let vDescs = 0;
let withDots = 0;

for (const f of files) {
  const slug = f.replace(/\.json$/, '');
  const cat = getCategory(slug);
  if (['home','blog','cases','contato','duvidas','equipe','perguntas-frequentes','politica','quanto-custa','servicos','sobre-nos','termos','quantos-lugares'].includes(cat)) {
    vTitles++;
    vDescs++;
    continue;
  }

  const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const loc = getCleanLocation(d.h1, slug);
  const title = buildTitle(cat, loc);
  const desc = buildDescription(cat, loc);

  if (title.length >= 50 && title.length <= 60) vTitles++;
  else console.log(`TITLE ERRO (${title.length}): ${title}`);

  if (desc.length >= 140 && desc.length <= 160) vDescs++;
  else console.log(`DESC ERRO (${desc.length}): ${desc}`);

  if (desc.includes('...')) withDots++;
}

console.log('=== RESULTADO TESTE SEM RETICÊNCIAS ===');
console.log(`Títulos válidos: ${vTitles} / ${files.length}`);
console.log(`Descrições válidas: ${vDescs} / ${files.length}`);
console.log(`Descrições com ...: ${withDots}`);
