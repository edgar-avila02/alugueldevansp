import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

const staticMeta = {
  '_home.json': {
    title: 'Aluguel de Van em SP com Motorista | Aluguel de Van SP', // 54 chars
    desc: 'Alugue vans executivas em São Paulo com motorista para viagens, eventos e traslados. Frota moderna, conforto e segurança. Solicite seu orçamento gratuito!' // 155 chars
  },
  'blog.json': {
    title: 'Blog Aluguel de Van SP: Dicas de Viagens e Transporte', // 53 chars
    desc: 'Acompanhe o blog da Aluguel de Van SP e confira dicas de roteiros, turismo, fretamento de vans executivas e economia em viagens em grupo. Acesse agora!' // 152 chars
  },
  'cases.json': {
    title: 'Cases de Sucesso em Transporte | Aluguel de Van SP', // 50 chars
    desc: 'Confira nossos cases de sucesso em transporte executivo, eventos e viagens em São Paulo. Clientes satisfeitos com pontualidade e total segurança. Veja!' // 153 chars
  },
  'contato.json': {
    title: 'Fale Conosco: Atendimento 24h e Aluguel de Van em SP', // 52 chars
    desc: 'Entre em contato com a Aluguel de Van SP. Atendimento 24 horas por WhatsApp, telefone ou e-mail para orçamentos e reservas rápidas. Fale conosco agora!' // 153 chars
  },
  'duvidas.json': {
    title: 'Dúvidas Frequentes sobre Aluguel de Vans em São Paulo', // 53 chars
    desc: 'Tire todas as suas dúvidas sobre locação de vans em SP: preços, modelos de 7 a 20 lugares, motoristas profissionais e condições de reserva. Saiba mais!' // 152 chars
  },
  'equipe.json': {
    title: 'Conheça Nossa Equipe de Motoristas | Aluguel de Van SP', // 54 chars
    desc: 'Conheça a equipe da Aluguel de Van SP: motoristas experientes, habilitados e comprometidos com a sua segurança, conforto e pontualidade na viagem. Veja!' // 153 chars
  },
  'perguntas-frequentes.json': {
    title: 'Perguntas Frequentes: Aluguel de Van em SP com Motorista', // 56 chars
    desc: 'Respostas para as principais perguntas sobre aluguel de van em São Paulo: viagens, eventos, transfers executivos e reservas rápidas. Peça seu orçamento!' // 154 chars
  },
  'politica-de-privacidade-de-dados.json': {
    title: 'Política de Privacidade de Dados | Aluguel de Van SP', // 52 chars
    desc: 'Confira a política de privacidade e proteção de dados da Aluguel de Van SP. Saiba como tratamos suas informações com total segurança, respeito e sigilo.' // 154 chars
  },
  'quanto-custa-o-aluguel-de-uma-van.json': {
    title: 'Aluguel de Vans em SP: Compare Preços com e Sem Condutor', // 56 chars
    desc: 'Descubra quanto custa alugar uma van em SP. Compare preços de diárias com e sem motorista, veja fatores que influenciam o valor e solicite seu orçamento!' // 154 chars
  },
  'servicos.json': {
    title: 'Serviços de Aluguel de Vans em SP: Conforto e Segurança', // 55 chars
    desc: 'Conheça todos os nossos serviços de aluguel de vans em SP: viagens, eventos, casamentos, traslados corporativos e diárias com motorista. Peça sua cotação!' // 156 chars
  },
  'sobre-nos.json': {
    title: 'Sobre Nós: 12 Anos em Transporte e Aluguel de Van SP', // 53 chars
    desc: 'Conheça a história da Aluguel de Van SP: mais de 12 anos de experiência em transporte executivo, frota regulamentada e pontualidade. Peça seu orçamento!' // 154 chars
  },
  'termos-de-servicos.json': {
    title: 'Termos de Serviços e Condições | Aluguel de Van SP', // 50 chars
    desc: 'Conheça os termos de serviços e condições de locação da Aluguel de Van SP. Diretrizes claras para garantir transparência, segurança e uma viagem perfeita.' // 155 chars
  },
  'van-tem-quantos-lugares.json': {
    title: 'Van Tem Quantos Lugares? Conheça os Modelos Principais', // 54 chars
    desc: 'Descubra quantos lugares tem uma van: conheça as capacidades de 7, 12, 15, 18 e 20 passageiros e escolha o modelo ideal para sua viagem. Confira o guia!' // 153 chars
  },
  'aluguel-de-van.json': {
    title: 'Aluguel de Vans em SP com Motorista | Cotação Imediata', // 53 chars
    desc: 'Aluguel de vans executivas em São Paulo para viagens, eventos corporativos e traslados. Veículos confortáveis com motorista profissional. Peça orçamento!' // 155 chars
  },
  'aluguel-de-van-com-motorista.json': {
    title: 'Aluguel de Van com Motorista em SP: Viagens e Eventos', // 53 chars
    desc: 'Viaje sem preocupações com o aluguel de van com motorista em SP. Condutores experientes, pontualidade rigorosa e conforto para seu grupo. Peça cotação já!' // 155 chars
  },
  'aluguel-de-van-sem-motorista.json': {
    title: 'Aluguel de Van sem Motorista em SP: Autonomia e Conforto', // 56 chars
    desc: 'Alugue van sem motorista em São Paulo com total liberdade de roteiro para passeios e demandas da sua empresa. Veículos revisados e seguros. Reserve já!' // 153 chars
  },
  'aluguel-de-van-para-viagem.json': {
    title: 'Aluguel de Van para Viagem em SP: Litoral e Interior', // 52 chars
    desc: 'Aluguel de van para viagens intermunicipais e interestaduais saindo de SP. Poltronas reclináveis, ar-condicionado e amplo bagageiro. Peça seu orçamento!' // 154 chars
  },
  'aluguel-de-van-para-passeio.json': {
    title: 'Aluguel de Van para Passeio em SP com Motorista Privativo', // 57 chars
    desc: 'Aproveite passeios turísticos, city tours e excursões em grupo com o aluguel de van para passeio em SP. Segurança, pontualidade e conforto. Reserve agora!' // 155 chars
  },
  'aluguel-de-van-para-praias.json': {
    title: 'Aluguel de Van para Praias e Litoral saindo de São Paulo', // 56 chars
    desc: 'Transporte exclusivo para praias do litoral norte e sul de SP. Alugue vans completas com motorista e viaje com a família sem estresse. Solicite proposta!' // 155 chars
  },
  'aluguel-de-van-para-casamento.json': {
    title: 'Aluguel de Van para Casamento em SP: Traslado Seguro', // 52 chars
    desc: 'Garanta o transporte seguro dos seus convidados em casamentos e festas em SP. Pontualidade, van executiva e tranquilidade para o grande dia. Consulte-nos!' // 156 chars
  },
  'aluguel-de-mini-van.json': {
    title: 'Aluguel de Minivan em SP: Conforto para Famílias e Grupos', // 57 chars
    desc: 'Aluguel de minivan moderna em São Paulo. Veículos econômicos, espaçosos e confortáveis para viagens familiares, traslados e aeroportos. Peça seu orçamento!' // 156 chars
  },
  'aluguel-de-minivan.json': {
    title: 'Aluguel de Minivan em SP: Conforto para Famílias e Grupos', // 57 chars
    desc: 'Aluguel de minivan moderna em São Paulo. Veículos econômicos, espaçosos e confortáveis para viagens familiares, traslados e aeroportos. Peça seu orçamento!' // 156 chars
  },
  'aluguel-de-mini-van-7-lugares.json': {
    title: 'Aluguel de Minivan 7 Lugares em SP: Espaço e Praticidade', // 56 chars
    desc: 'Alugue minivan de 7 lugares em São Paulo com máximo conforto e economia. Ideal para viagens em família, transfers e compromissos executivos. Reserve já!' // 153 chars
  },
  'aluguel-de-minivan-7-lugares.json': {
    title: 'Aluguel de Minivan 7 Lugares em SP: Espaço e Praticidade', // 56 chars
    desc: 'Alugue minivan de 7 lugares em São Paulo com máximo conforto e economia. Ideal para viagens em família, transfers e compromissos executivos. Reserve já!' // 153 chars
  },
  'aluguel-de-van-12-lugares.json': {
    title: 'Aluguel de Van 12 Lugares em SP com Motorista: Cotação', // 54 chars
    desc: 'Alugue vans de 12 lugares em São Paulo para passeios, viagens e eventos. Conforto, ar-condicionado e motoristas qualificados. Peça seu orçamento gratuito!' // 156 chars
  },
  'aluguel-de-van-15-lugares.json': {
    title: 'Aluguel de Van 15 Lugares em SP: Transporte de Grupos', // 53 chars
    desc: 'Precisa transportar até 15 passageiros? Alugue vans de 15 lugares em SP com poltronas reclináveis e amplo espaço para malas. Solicite um orçamento rápido!' // 156 chars
  },
  'aluguel-de-van-18-lugares.json': {
    title: 'Aluguel de Van 18 Lugares em SP: Conforto para Grupos', // 53 chars
    desc: 'Aluguel de vans executivas de 18 lugares em São Paulo. A melhor solução para grupos maiores em viagens, congressos e excursões com segurança. Reserve já!' // 155 chars
  },
  'aluguel-de-van-de-carga.json': {
    title: 'Aluguel de Van de Carga em SP: Transporte e Entregas', // 52 chars
    desc: 'Aluguel de van de carga em São Paulo para entregas rápidas, mercadorias, fretes e mudanças comerciais. Praticidade e segurança para seu negócio. Contate!' // 154 chars
  },
  'aluguel-de-van-furgao.json': {
    title: 'Aluguel de Van Furgão em SP: Logística e Cargas Rápidas', // 55 chars
    desc: 'Precisa transportar cargas em São Paulo? Alugue van furgão com manutenção em dia, espaço ideal e custo-benefício garantido para sua empresa. Reserve agora!' // 156 chars
  }
};

const servicePrefixes = [
  'aluguel-de-mini-van-7-lugares', 'aluguel-de-minivan-7-lugares', 'aluguel-de-mini-van', 'aluguel-de-minivan',
  'aluguel-de-van-12-lugares', 'aluguel-de-van-15-lugares', 'aluguel-de-van-18-lugares',
  'aluguel-de-van-com-motorista', 'aluguel-de-van-sem-motorista', 'aluguel-de-van-para-casamento',
  'aluguel-de-van-para-passeio', 'aluguel-de-van-para-praias', 'aluguel-de-van-para-viagem',
  'aluguel-de-van-de-carga', 'aluguel-de-van-furgao', 'aluguel-de-van'
];

function normalizeAscii(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function extractLocation(data, file) {
  const slug = file.replace('.json', '');
  let matchedPrefix = servicePrefixes.find(sp => slug.startsWith(sp + '-'));
  if (!matchedPrefix) return null;

  let localSlug = slug.slice(matchedPrefix.length + 1);
  if (localSlug.startsWith('em-')) localSlug = localSlug.slice(3);
  localSlug = localSlug.replace(/-\d+$/, '');
  if (localSlug === 'consolidacao') localSlug = 'consolacao';

  const localSlugAscii = normalizeAscii(localSlug);

  const rawTitle = (data.title || '').replace(/[\u200B-\u200D\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim();
  const rawH1 = (data.h1 || '').replace(/[\u200B-\u200D\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanTitle = rawTitle.replace(/\s*[-–|]\s*aluguel de van.*$/i, '').trim();

  for (const source of [cleanTitle, rawH1]) {
    if (!source) continue;
    const words = source.split(/\s+/);
    for (let len = words.length; len >= 1; len--) {
      for (let start = 0; start <= words.length - len; start++) {
        const candidate = words.slice(start, start + len).join(' ').replace(/^[,\-–:\s]+|[,\-–:\s]+$/g, '');
        if (normalizeAscii(candidate) === localSlugAscii) {
          return candidate;
        }
      }
    }
  }

  return localSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const titleSuffixes = [
  ' com motorista | Aluguel de Van SP',
  ' com motorista | Transporte em SP',
  ' com motorista | Frota executiva',
  ' com motorista | Cotação imediata',
  ' com motorista | Conforto em SP',
  ' com motorista: cotação rápida',
  ' com motorista: frota em SP',
  ' com motorista: viagens e eventos',
  ' com motorista | Reserve em SP',
  ' com motorista | Orçamento grátis',
  ' com motorista | Orçamento rápido',
  ' com motorista | Cotação grátis',
  ' com motorista: transporte em SP',
  ' com motorista: van executiva SP',
  ' com motorista | Vans executivas',
  ' com motorista | Preço e cotação',
  ' com motorista: conforto e preço',
  ' com motorista: conforto em SP',
  ' com motorista | Cotação online',
  ' com motorista | Diárias em SP',
  ' com motorista: reserve online',
  ' com motorista: reserve em SP',
  ' com motorista | Aluguel em SP',
  ' com motorista: cotação online',
  ' com motorista | Van em SP',
  ' com motorista: Van em SP',
  ' com motorista | Cotação',
  ' com motorista: Cotação',
  ' com motorista | Orçamento',
  ' com motorista: Orçamento',
  ' com motorista | Preço',
  ' com motorista: Preço',
  ' com motorista: SP',
  ' com motorista | SP',
  ' com motorista',
  ' | Transporte executivo em SP',
  ': transporte executivo em SP',
  ' | Frota executiva e conforto',
  ': frota executiva e conforto',
  ' | Transporte executivo',
  ': transporte executivo',
  ' | Conforto e segurança',
  ': conforto e segurança',
  ' | Frota executiva em SP',
  ': frota executiva em SP',
  ' | Vans executivas em SP',
  ': vans executivas em SP',
  ' | Orçamento rápido em SP',
  ': orçamento rápido em SP',
  ' | Cotação rápida em SP',
  ': cotação rápida em SP',
  ' | Faça sua cotação em SP',
  ': faça sua cotação em SP',
  ' | Reserve sua van em SP',
  ': reserve sua van em SP',
  ' | Cotação imediata em SP',
  ' | Vans executivas novas',
  ': vans executivas novas',
  ' | Conforto e pontualidade',
  ': conforto e pontualidade',
  ' | Fretamento executivo',
  ': fretamento executivo',
  ' | Frota moderna em SP',
  ': frota moderna em SP',
  ' | Diárias executivas',
  ': diárias executivas',
  ' | Cotação imediata',
  ': cotação imediata',
  ' | Orçamento rápido',
  ': orçamento rápido',
  ' | Frota executiva',
  ': frota executiva',
  ' | Vans executivas',
  ': vans executivas',
  ' | Cotação rápida',
  ': cotação rápida',
  ' | Reserve sua van',
  ': reserve sua van',
  ' | Orçamento grátis',
  ': orçamento grátis',
  ' | Diárias em SP',
  ': diárias em SP',
  ' | Preço e cotação',
  ': preço e cotação',
  ' | Cotação online',
  ': cotação online',
  ' | Cotação em SP',
  ': cotação em SP',
  ' | Viagens em SP',
  ': viagens em SP',
  ' | Eventos em SP',
  ': eventos em SP',
  ' | Aluguel em SP',
  ': aluguel em SP',
  ' | Van em SP',
  ': van em SP',
  ' em SP',
  ' | SP',
  ': SP'
];

function generateLocalTitle(localName) {
  const prefix = `Aluguel de van em ${localName}`;
  for (const s of titleSuffixes) {
    const candidate = prefix + s;
    if (candidate.length >= 50 && candidate.length <= 60) {
      return candidate;
    }
  }

  const prefixDirect = `Aluguel de van ${localName}`;
  for (const s of titleSuffixes) {
    const candidate = prefixDirect + s;
    if (candidate.length >= 50 && candidate.length <= 60) {
      return candidate;
    }
  }

  throw new Error(`Título fora do range para localidade: "${localName}"`);
}

const p1List = [
  (loc) => `Aluguel de van em ${loc} com motorista para viagens, eventos e traslados.`,
  (loc) => `Aluguel de van em ${loc} com motorista profissional para eventos e passeios.`,
  (loc) => `Procurando aluguel de van em ${loc}? Vans executivas com motorista em SP.`,
  (loc) => `Precisa de aluguel de van em ${loc}? Veículos confortáveis com motorista.`,
  (loc) => `Serviço de aluguel de van em ${loc} com motorista, conforto e pontualidade.`,
  (loc) => `Alugue van executiva em ${loc} com motorista para viagens e eventos em SP.`,
  (loc) => `Aluguel de van em ${loc}: transporte executivo seguro com motorista em SP.`,
  (loc) => `Aluguel de van em ${loc} com motorista, ar-condicionado e total segurança.`
];

const p2List = [
  'Frota moderna e pontualidade.',
  'Frota moderna, conforto e total segurança.',
  'Veículos executivos com total segurança e conforto.',
  'Veículos revisados e atendimento de qualidade.',
  'Pontualidade rigorosa e atendimento exclusivo.',
  'Veículos novos com ar-condicionado e conforto.',
  'Conforto absoluto, segurança e pontualidade.',
  'Frota regulamentada e motoristas qualificados.',
  'Conforto para grupos e viagens familiares.',
  'Segurança, pontualidade e veículos modernos.',
  'Conforto e segurança para seu grupo.',
  'Atendimento ágil e total segurança.',
  'Frota moderna.',
  ''
];

const p3List = [
  'Solicite seu orçamento gratuito hoje!',
  'Solicite seu orçamento gratuito agora!',
  'Peça seu orçamento gratuito agora mesmo!',
  'Peça sua cotação rápida e sem compromisso!',
  'Solicite sua cotação rápida e segura!',
  'Faça sua cotação online sem compromisso!',
  'Garanta já sua reserva com o melhor preço!',
  'Reserve com a Aluguel de Van SP agora mesmo!',
  'Entre em contato e receba sua cotação hoje!',
  'Solicite seu orçamento com a nossa equipe!',
  'Peça seu orçamento gratuito sem compromisso!',
  'Fale conosco e faça sua cotação imediata!',
  'Faça sua cotação online e reserve já!',
  'Solicite sua cotação rápida agora mesmo!',
  'Peça seu orçamento gratuito online agora!',
  'Peça sua cotação rápida e reserve agora!',
  'Solicite um orçamento gratuito sem custo!',
  'Fale conosco e garanta sua reserva hoje!',
  'Peça sua cotação rápida agora com a gente!',
  'Solicite sua proposta rápida e gratuita!',
  'Peça seu orçamento e viaje com conforto!',
  'Solicite sua cotação e reserve agora!',
  'Faça sua cotação rápida e viaje seguro!',
  'Entre em contato e reserve sua van hoje!',
  'Consulte valores e garanta sua reserva!',
  'Peça sua cotação sem compromisso agora!',
  'Solicite orçamento e viaje com segurança!',
  'Peça seu orçamento gratuito e reserve já!',
  'Solicite sua cotação online agora mesmo!',
  'Peça sua cotação agora sem compromisso!',
  'Solicite sua cotação rápida hoje mesmo!',
  'Peça seu orçamento e viaje tranquilo!',
  'Reserve já sua van com o melhor preço!',
  'Peça sua cotação online hoje mesmo!',
  'Solicite seu orçamento rápido hoje!',
  'Peça seu orçamento grátis agora!',
  'Solicite sua cotação gratuita!',
  'Faça sua cotação online agora!',
  'Peça sua cotação online agora!',
  'Reserve sua van agora mesmo!',
  'Solicite sua cotação hoje!',
  'Peça seu orçamento agora!',
  'Solicite seu orçamento!',
  'Peça sua cotação já!',
  'Faça sua cotação já!',
  'Reserve sua van hoje!',
  'Peça seu orçamento!',
  'Consulte valores já!',
  'Reserve agora mesmo!'
];

function generateLocalDesc(localName) {
  for (const p1Fn of p1List) {
    const p1 = p1Fn(localName);
    for (const p2 of p2List) {
      for (const p3 of p3List) {
        let combined = p2 ? `${p1} ${p2} ${p3}` : `${p1} ${p3}`;
        combined = combined.replace(/\s+/g, ' ').trim();
        if (combined.length >= 140 && combined.length <= 160) {
          return combined;
        }
      }
    }
  }
  throw new Error(`Não conseguiu gerar descrição para: "${localName}"`);
}

console.log(`Iniciando atualização de SEO para ${files.length} páginas...`);

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let newTitle = '';
  let newDesc = '';

  if (staticMeta[file]) {
    newTitle = staticMeta[file].title;
    newDesc = staticMeta[file].desc;
  } else {
    const localName = extractLocation(data, file);
    newTitle = generateLocalTitle(localName);
    newDesc = generateLocalDesc(localName);
  }

  // Validação estrita
  if (newTitle.length < 50 || newTitle.length > 60) {
    throw new Error(`Title fora do range (${newTitle.length}) em ${file}: "${newTitle}"`);
  }
  if (newDesc.length < 140 || newDesc.length > 160) {
    throw new Error(`Desc fora do range (${newDesc.length}) em ${file}: "${newDesc}"`);
  }

  data.title = newTitle;
  data.description = newDesc;

  // Atualiza Open Graph
  if (Array.isArray(data.og)) {
    for (const item of data.og) {
      if (Array.isArray(item)) {
        if (item[0] === 'og:title') item[1] = newTitle;
        if (item[0] === 'og:description') item[1] = newDesc;
      }
    }
  }

  // Atualiza Twitter Card
  if (Array.isArray(data.twitter)) {
    for (const item of data.twitter) {
      if (Array.isArray(item)) {
        if (item[0] === 'twitter:title') item[1] = newTitle;
        if (item[0] === 'twitter:description') item[1] = newDesc;
      }
    }
  }

  // Atualiza JSON-LD (Schema.org) se presente
  if (Array.isArray(data.jsonld)) {
    data.jsonld = data.jsonld.map(jStr => {
      try {
        const schema = JSON.parse(jStr);
        if (schema['@graph'] && Array.isArray(schema['@graph'])) {
          for (const node of schema['@graph']) {
            if (node['@type'] === 'WebPage') {
              if (node.name) node.name = newTitle;
              if (node.description) node.description = newDesc;
            }
            if (node['@type'] === 'Article') {
              if (node.headline) node.headline = newTitle;
              if (node.name) node.name = newTitle;
              if (node.description) node.description = newDesc;
            }
          }
        }
        return JSON.stringify(schema);
      } catch (err) {
        return jStr;
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 1), 'utf8');
  updatedCount++;
}

console.log(JSON.stringify({
  success: true,
  updatedCount,
  message: `Todas as ${updatedCount} páginas foram atualizadas com sucesso e validadas!`
}, null, 2));
