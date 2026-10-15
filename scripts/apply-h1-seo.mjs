import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

// Páginas institucionais com meta estática já perfeita
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
  }
};

// Fallbacks para páginas onde data.h1 estava ausente
const fallbackH1 = {
  'aluguel-de-mini-van-angatuba.json': 'Aluguel de mini van em Angatuba',
  'aluguel-de-van-12-lugares-bela-vista.json': 'Aluguel de van 12 lugares na Bela Vista',
  'aluguel-de-van-12-lugares-sumare.json': 'Aluguel de van 12 lugares em Sumaré',
  'aluguel-de-van-15-lugares-campina-do-monte-alegre.json': 'Aluguel de van 15 lugares em Campina do Monte Alegre',
  'aluguel-de-van-18-lugares-avai.json': 'Aluguel de van 18 lugares em Avaí',
  'aluguel-de-van-18-lugares-guaianases.json': 'Aluguel de van 18 lugares em Guaianases',
  'aluguel-de-van-em-vila-sonia-sp.json': 'Aluguel de van na Vila Sônia',
  'aluguel-de-van-para-passeio-parelheiros.json': 'Aluguel de van para passeio em Parelheiros',
  'aluguel-de-van-para-viagem-fernandopolis.json': 'Aluguel de van para viagem em Fernandópolis'
};

const titleSuffixes = [
  ' | Fretamento Executivo e Transporte em SP',
  ' com Motorista em São Paulo | Frota Moderna',
  ' para Viagens e Eventos | Aluguel de Van SP',
  ' com Motorista | Aluguel de Van SP',
  ' | Fretamento e Transporte em SP',
  ' | Locação de Vans Executivas SP',
  ' em SP | Fretamento e Vans em SP',
  ' em SP | Frota Moderna e Segura',
  ' | Transporte Executivo em SP',
  ' | Fretamento e Locação em SP',
  ' | Fretamento e Vans em SP',
  ' | Transporte Executivo SP',
  ' | Cotação e Orçamento Rápido',
  ' | Cotação e Orçamento Grátis',
  ' em SP | Aluguel de Van SP',
  ': Cotação e Frota em SP',
  ': Cotação e Reserva em SP',
  ': Cotação Rápida e Fácil',
  ': Frota Moderna e Segura',
  ': Fretamento Executivo SP',
  ': Preço e Cotação Online',
  ' | Melhores Preços em SP',
  ' em SP | Frota Executiva',
  ' | Cotação Rápida em SP',
  ' | Cotação Grátis em SP',
  ': Vans Executivas em SP',
  ' | Aluguel de Van SP',
  ': Frota Moderna em SP',
  ' | Vans Executivas SP',
  ': Transporte em SP',
  ' | Frota Moderna SP',
  ' | Cotação Imediata',
  ': Orçamento Grátis',
  ': Cotação Rápida',
  ' | Locação em SP',
  ' em São Paulo SP',
  ' | Aluguel Van SP',
  ': Orçamento SP',
  ' em São Paulo',
  ': Cotação SP',
  ' | Vans SP',
  ' em SP',
  ' - SP',
  ': SP',
  ''
];

export function getCleanH1(data, file) {
  let h1 = (data.h1 || '').replace(/[\u200B-\u200D\uFEFF]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!h1 && fallbackH1[file]) {
    h1 = fallbackH1[file];
  }
  return h1;
}

export function getServiceCategory(slug) {
  const s = slug.toLowerCase();
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
  return 'van-normal';
}

export function generateTitleFromH1(h1) {
  if (h1.length >= 50 && h1.length <= 60) {
    return h1;
  }
  for (const s of titleSuffixes) {
    const candidate = h1 + s;
    if (candidate.length >= 50 && candidate.length <= 60) {
      return candidate;
    }
  }
  throw new Error(`Não conseguiu gerar title para H1 (${h1.length}): "${h1}"`);
}

const categoryMiddles = {
  'sem-motorista': [
    'com total autonomia, veículos revisados e total flexibilidade para viagens e traslados.',
    'com liberdade de roteiro, total autonomia e veículos revisados com máxima segurança.',
    'com conforto, veículos revisados e liberdade de horário para passeios e traslados.',
    'com total liberdade de horários, autonomia e frota moderna com revisões em dia.',
    'com veículos higienizados, conforto e autonomia para viagens e demandas da empresa.'
  ],
  'com-motorista': [
    'com motorista qualificado, pontualidade rigorosa e total conforto para viagens e eventos.',
    'com condutor experiente, veículos revisados e pontualidade para eventos e passeios.',
    'com motorista profissional, ar-condicionado e total tranquilidade para seu grupo.',
    'com motorista experiente, pontualidade, segurança e veículos modernos higienizados.',
    'com condutores profissionais, total segurança e pontualidade para toda a família.'
  ],
  'viagem': [
    'com poltronas reclináveis, ar-condicionado e amplo bagageiro para viagens e passeios.',
    'com veículos confortáveis, amplo bagageiro e total segurança na estrada para grupos.',
    'com espaço para bagagens, poltronas confortáveis e veículos revisados para viagens.',
    'com poltronas reclináveis, segurança na estrada e muito espaço para sua família.',
    'com total conforto rodoviário, amplo porta-malas e veículos novos com ar-condicionado.'
  ],
  'minivan-7-lugares': [
    'para 7 passageiros com conforto, espaço para malas e economia em viagens e passeios.',
    'com 7 lugares, ar-condicionado e excelente espaço para passeios familiares e eventos.',
    'com 7 lugares, ótimo custo-benefício e conforto para pequenos grupos e famílias.',
    'com espaço ideal para 7 passageiros, conforto moderno e economia para a família.',
    'com 7 assentos confortáveis, agilidade no trânsito e praticidade para seu grupo.'
  ],
  'minivan': [
    'para pequenos grupos e famílias, com agilidade no trânsito, conforto e economia.',
    'com agilidade urbana, excelente espaço interno e conforto para famílias e passeios.',
    'com economia, agilidade no trânsito e ótimo conforto para passeios e compromissos.',
    'com conforto para a família, praticidade urbana e amplo espaço para passageiros.',
    'com veículos compactos, modernos e confortáveis para viagens em pequenos grupos.'
  ],
  '12-lugares': [
    'para grupos médios com poltronas reclináveis, ar-condicionado e total conforto.',
    'com capacidade para até 12 passageiros, amplo espaço interno e total segurança.',
    'com poltronas confortáveis, ar-condicionado e espaço ideal para viagens em grupo.',
    'com espaço sob medida para 12 pessoas, veículos modernos e conforto absoluto.',
    'com total comodidade para 12 passageiros, ar-condicionado e bagageiro espaçoso.'
  ],
  '15-lugares': [
    'para 15 passageiros com poltronas reclináveis, ar-condicionado e amplo bagageiro.',
    'com 15 lugares, poltronas confortáveis, ar-condicionado e segurança para grupos.',
    'com espaço para até 15 passageiros, poltronas reclináveis e conforto rodoviário.',
    'com capacidade para 15 passageiros, ar-condicionado potente e amplo bagageiro.',
    'com excelente espaço para 15 pessoas, viagens tranquilas e veículos revisados.'
  ],
  '18-lugares': [
    'para grupos de até 18 passageiros com muito conforto, segurança e amplo bagageiro.',
    'com 18 lugares, poltronas confortáveis, ar-condicionado e muito espaço interno.',
    'com capacidade máxima para 18 passageiros, segurança e conforto para viagens longas.',
    'para grandes grupos com poltronas reclináveis, ar-condicionado e total segurança.',
    'com espaço generoso para 18 pessoas, viagens rodoviárias confortáveis e seguras.'
  ],
  'carga': [
    'para transporte ágil de mercadorias, fretes, entregas rápidas e mudanças comerciais.',
    'para transporte seguro de cargas, entregas rápidas e demandas da sua empresa.',
    'com veículos utilitários resistentes e espaço ideal para fretes e transporte de carga.',
    'com amplo compartimento para entregas rápidas, cargas e logística empresarial.',
    'para fretes comerciais e entregas seguras com manutenção mecânica rigorosa em dia.'
  ],
  'furgao': [
    'com compartimento fechado e espaçoso para entregas urbanas, mercadorias e cargas.',
    'com baú espaçoso e protegido para logística rápida, entregas e cargas comerciais.',
    'para transporte seguro de mercadorias com manutenção em dia e agilidade urbana.',
    'com amplo espaço fechado para proteger suas mercadorias e encomendas com segurança.',
    'com espaço generoso para cargas e entregas comerciais com total praticidade em SP.'
  ],
  'passeio': [
    'para excursões, passeios turísticos e viagens em grupo com conforto e segurança.',
    'para city tours, viagens com amigos e passeios em família com máximo conforto.',
    'para passeios turísticos e eventos de lazer com veículos revisados e confortáveis.',
    'para passeios em família e excursões turísticas com conforto e pontualidade.',
    'para passeios inesquecíveis em grupo com ar-condicionado, conforto e segurança.'
  ],
  'praias': [
    'com ar-condicionado potente, amplo bagageiro para malas e cadeiras de praia.',
    'com espaço para malas de praia, ar-condicionado e conforto na descida da serra.',
    'para viagens ao litoral com a família, amplo porta-malas e total segurança.',
    'com conforto para a descida ao litoral, bagageiro amplo e ar-condicionado.',
    'para praias e litoral com espaço para pranchas, malas e conforto para todos.'
  ],
  'casamento': [
    'para transporte sofisticado e pontual de convidados, padrinhos e familiares.',
    'com pontualidade impecável, conforto e segurança para convidados e padrinhos.',
    'para translado elegante e pontual de padrinhos e convidados no grande dia.',
    'com veículos executivos, conforto e pontualidade para familiares e convidados.',
    'com atendimento pontual e veículos confortáveis para o transporte da festa.'
  ],
  'van-normal': [
    'para viagens, eventos, traslados executivos e passeios com conforto e pontualidade.',
    'com veículos modernos, higienizados e confortáveis para grupos e viagens em SP.',
    'para viagens corporativas, eventos familiares e passeios com segurança e conforto.',
    'com motoristas experientes, ar-condicionado e total conforto para seu grupo em SP.',
    'com frota revisada, pontualidade rigorosa e atendimento personalizado para grupos.'
  ]
};

const ctaList = [
  'Peça sua cotação rápida e sem compromisso!', // 42 chars
  'Garanta já sua reserva com o melhor preço!', // 42 chars
  'Solicite seu orçamento gratuito hoje mesmo!', // 43 chars
  'Peça seu orçamento gratuito online agora!', // 41 chars
  'Solicite seu orçamento gratuito hoje!', // 37 chars
  'Peça sua cotação gratuita hoje mesmo!', // 37 chars
  'Solicite seu orçamento gratuito agora!', // 38 chars
  'Peça sua cotação rápida e reserve agora!', // 40 chars
  'Solicite sua cotação rápida agora mesmo!', // 40 chars
  'Peça já seu orçamento gratuito com a gente!', // 43 chars
  'Solicite um orçamento gratuito sem custo!', // 41 chars
  'Peça sua cotação gratuita agora mesmo!', // 38 chars
  'Solicite sua cotação rápida hoje mesmo!', // 39 chars
  'Peça seu orçamento e viaje com conforto!', // 40 chars
  'Solicite sua cotação e reserve agora!', // 37 chars
  'Faça sua cotação rápida e viaje seguro!', // 39 chars
  'Entre em contato e reserve sua van hoje!', // 39 chars
  'Consulte valores e garanta sua reserva!', // 39 chars
  'Peça sua cotação sem compromisso agora!', // 39 chars
  'Solicite orçamento e viaje com segurança!', // 41 chars
  'Peça seu orçamento gratuito e reserve já!', // 41 chars
  'Solicite sua cotação online agora mesmo!', // 40 chars
  'Peça sua cotação online hoje mesmo!', // 35 chars
  'Solicite seu orçamento rápido hoje!', // 35 chars
  'Peça seu orçamento gratuito hoje!', // 33 chars
  'Peça seu orçamento grátis agora!', // 32 chars
  'Solicite sua cotação gratuita!', // 30 chars
  'Faça sua cotação online agora!', // 30 chars
  'Peça sua cotação online agora!', // 30 chars
  'Reserve sua van agora mesmo!', // 27 chars
  'Solicite sua cotação hoje!', // 26 chars
  'Peça seu orçamento agora!', // 25 chars
  'Solicite seu orçamento!', // 23 chars
  'Peça sua cotação já!', // 20 chars
  'Faça sua cotação já!', // 20 chars
  'Reserve sua van hoje!', // 21 chars
  'Peça seu orçamento!', // 19 chars
  'Consulte valores já!', // 20 chars
  'Reserve agora mesmo!' // 19 chars
];

export function generateDescFromH1(h1, category) {
  const middles = categoryMiddles[category] || categoryMiddles['van-normal'];
  for (const mid of middles) {
    for (const cta of ctaList) {
      const candidate = `${h1} ${mid} ${cta}`;
      if (candidate.length >= 140 && candidate.length <= 160) {
        return candidate;
      }
    }
  }
  for (const mid of categoryMiddles['van-normal']) {
    for (const cta of ctaList) {
      const candidate = `${h1} ${mid} ${cta}`;
      if (candidate.length >= 140 && candidate.length <= 160) {
        return candidate;
      }
    }
  }
  throw new Error(`Não conseguiu gerar desc para H1 (${h1.length}): "${h1}"`);
}

console.log(`Aplicando SEO baseado em H1 em ${files.length} páginas...`);

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let title = '';
  let desc = '';

  if (staticMeta[file]) {
    title = staticMeta[file].title;
    desc = staticMeta[file].desc;
  } else {
    const h1 = getCleanH1(data, file);
    if (!data.h1 && fallbackH1[file]) {
      data.h1 = fallbackH1[file];
    }
    const cat = getServiceCategory(file.replace('.json', ''));
    title = generateTitleFromH1(h1);
    desc = generateDescFromH1(h1, cat);
  }

  // Validação estrita
  if (title.length < 50 || title.length > 60) {
    throw new Error(`Title fora do range (${title.length}) em ${file}: "${title}"`);
  }
  if (desc.length < 140 || desc.length > 160) {
    throw new Error(`Desc fora do range (${desc.length}) em ${file}: "${desc}"`);
  }

  data.title = title;
  data.description = desc;

  // Atualiza Open Graph
  if (Array.isArray(data.og)) {
    for (const item of data.og) {
      if (Array.isArray(item)) {
        if (item[0] === 'og:title') item[1] = title;
        if (item[0] === 'og:description') item[1] = desc;
      }
    }
  }

  // Atualiza Twitter Card
  if (Array.isArray(data.twitter)) {
    for (const item of data.twitter) {
      if (Array.isArray(item)) {
        if (item[0] === 'twitter:title') item[1] = title;
        if (item[0] === 'twitter:description') item[1] = desc;
      }
    }
  }

  // Atualiza JSON-LD (Schema.org)
  if (Array.isArray(data.jsonld)) {
    data.jsonld = data.jsonld.map(jStr => {
      try {
        const schema = JSON.parse(jStr);
        if (schema['@graph'] && Array.isArray(schema['@graph'])) {
          for (const node of schema['@graph']) {
            if (node['@type'] === 'WebPage') {
              if (node.name) node.name = title;
              if (node.description) node.description = desc;
            }
            if (node['@type'] === 'Article') {
              if (node.headline) node.headline = title;
              if (node.name) node.name = title;
              if (node.description) node.description = desc;
            }
          }
        }
        return JSON.stringify(schema);
      } catch {
        return jStr;
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 1), 'utf8');
  updatedCount++;
}

console.log(`\n=== SUCESSO TOTAL ===`);
console.log(`Páginas atualizadas e gravadas com sucesso: ${updatedCount}`);
