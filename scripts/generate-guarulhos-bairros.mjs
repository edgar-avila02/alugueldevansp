import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src/data/pages');
const URLS_PATH = path.join(ROOT, 'src/data/urls.json');

// Normalizador de slug padrão
export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parênteses
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Lista oficial dos 43 bairros de Guarulhos
export const DEFAULT_BAIRROS_RAW = [
  'Aeroporto de Guarulhos',
  'Água Azul',
  'Água Chata',
  'Aracília',
  'Bananal',
  'Bela Vista',
  'Bom Clima',
  'Bonsucesso',
  'Cabuçu',
  'Cabuçu de Cima',
  'Capelinha',
  'Cecap',
  'Centro',
  'Cocaia',
  'Cumbica',
  'Fátima',
  'Gopoúva',
  'Invernada',
  'Itapegica',
  'Jardim Presidente Dutra',
  'Lavras',
  'Macedo',
  'Maia',
  'Mato das Cobras',
  'Monte Carmelo',
  'Morro Grande',
  'Morros',
  'Paraventi',
  'Picanço',
  'Pimentas',
  'Ponte Grande',
  'Porto da Igreja',
  'Sadokim',
  'São João',
  'Taboão',
  'Torres Tibagy',
  'Tranquilidade',
  'Várzea do Palácio',
  'Vila Any (antigo Itaim)',
  'Vila Augusta',
  'Vila Barros',
  'Vila Galvão',
  'Vila Rio'
];

export function buildBairrosList(rawList) {
  return rawList.map((item) => {
    const raw = item.trim();
    let name = raw;
    let slug = slugify(raw);
    
    if (raw.toLowerCase() === 'aeroporto' || raw.toLowerCase().includes('aeroporto de guarulhos')) {
      name = 'Aeroporto de Guarulhos';
      slug = 'aeroporto-de-guarulhos';
    } else if (raw.toLowerCase().includes('vila any')) {
      name = 'Vila Any';
      slug = 'vila-any';
    }

    return { raw, name, slug };
  });
}

export function buildBairrosGridHtml(allBairros, serviceSlug, serviceName, currentSlug = '') {
  const links = allBairros
    .map((b) => {
      const isCurrent = b.slug === currentSlug;
      const href = `/${serviceSlug}/guarulhos/${b.slug}/`;
      return `    <a href="${href}" class="bairro-pill-link${isCurrent ? ' is-current' : ''}" title="${serviceName} em ${b.name}, Guarulhos">${b.name}</a>`;
    })
    .join('\n');

  return `
<section class="bairros-local-section" aria-label="Bairros atendidos em Guarulhos">
  <div class="bairros-local-head">
    <h2>Atendimento de ${serviceName} em outros bairros de Guarulhos</h2>
    <p>Nossa frota atende com rapidez e pontualidade passageiros e empresas em toda a cidade. Escolha seu bairro para ver detalhes e solicitar cotação:</p>
  </div>
  <div class="bairros-local-grid">
${links}
  </div>
</section>
`;
}

export function getPrep(bairroName) {
  const b = bairroName.trim();
  if (/^aeroporto/i.test(b)) return 'no';
  if (/^(jardim|morro|porto|monte|paraventi|mato)/i.test(b)) return 'no';
  if (/^(vila|água|agua|ponte|várzea|varzea|capelinha|bela vista|invernada|tranquilidade)/i.test(b)) return 'na';
  return 'em';
}

export function getOptimizedMeta(bairroName, serviceName = 'Aluguel de Van') {
  const isAeroporto = /aeroporto/i.test(bairroName);
  const prep = getPrep(bairroName);
  
  // Title otimizado para CTR e limite do Google (50 a 60 caracteres)
  let title = isAeroporto
    ? `${serviceName} no ${bairroName} | Orçamento Rápido SP`
    : `${serviceName} ${prep} ${bairroName}, Guarulhos | Orçamento SP`;
  
  if (title.length > 60) {
    title = `${serviceName} ${prep} ${bairroName}, Guarulhos | Orçamento`;
  }
  if (title.length > 60) {
    title = `${serviceName} ${prep} ${bairroName} | Guarulhos SP`;
  }

  // Description otimizada com CTA persuasivo (144 a 156 caracteres)
  let desc = '';
  if (isAeroporto) {
    desc = `Aluguel de van no ${bairroName} para viagens, eventos e transfers executivos. Veículos novos, conforto e segurança. Peça seu orçamento gratuito!`;
  } else {
    desc = `Aluguel de van ${prep} ${bairroName}, Guarulhos com motorista para viagens, eventos e transfers. Veículos novos e pontualidade. Peça seu orçamento gratuito!`;
    if (desc.length > 157) {
      desc = `Aluguel de van ${prep} ${bairroName}, Guarulhos para viagens e eventos. Veículos modernos com motorista e pontualidade. Peça seu orçamento gratuito!`;
    }
  }

  const h1 = isAeroporto
    ? `${serviceName} no ${bairroName}`
    : `${serviceName} ${prep} ${bairroName} - Guarulhos`;

  return { title, desc, h1 };
}

export async function generatePages({
  serviceName = 'Aluguel de Van',
  serviceSlug = 'aluguel-de-van',
  bairrosRaw = DEFAULT_BAIRROS_RAW
} = {}) {
  console.log(`\nIniciando geração com o NOVO LAYOUT para o serviço: "${serviceName}" (slug: "${serviceSlug}")...`);
  
  // Utiliza o NOVO layout de aluguel-de-van-15-lugares como matriz oficial de design
  const templatePath = path.join(PAGES_DIR, 'aluguel-de-van-15-lugares.json');
  const templateContent = await fs.readFile(templatePath, 'utf8');
  const templatePage = JSON.parse(templateContent);

  const allBairros = buildBairrosList(bairrosRaw);
  console.log(`Total de bairros para gerar: ${allBairros.length}`);

  const nowIso = new Date().toISOString();
  const generatedRoutes = [];

  // Ler urls.json
  let urls = [];
  try {
    urls = JSON.parse(await fs.readFile(URLS_PATH, 'utf8'));
  } catch (err) {
    console.warn('Aviso: urls.json não pôde ser lido diretamente:', err.message);
  }
  const existingUrlPaths = new Set(urls.map((u) => u.path));

  for (const bairro of allBairros) {
    const pagePath = `/${serviceSlug}/guarulhos/${bairro.slug}/`;
    const pageUrl = `https://alugueldevansp.com${pagePath}`;
    const fileKey = `${serviceSlug}__guarulhos__${bairro.slug}.json`;
    const targetFile = path.join(PAGES_DIR, fileKey);

    // Meta tags otimizadas para SEO Local de Alta Performance
    const { title: pageTitle, desc: pageDesc, h1: pageH1 } = getOptimizedMeta(bairro.name, serviceName);

    // Clonar o HTML do NOVO layout e adaptar dinamicamente para o bairro
    let html = templatePage.html;

    // 1. Substituir os 3 Benefícios do Hero Card Superior
    html = html.replace(
      /Ideal para grupos grandes, com mais conforto/g,
      `Atendimento ágil em ${bairro.name} e região`
    );
    html = html.replace(
      /Transporte até 15 passageiros com assentos reclináveis, espaço generoso e climatização completa em um único veículo\./g,
      `Frota moderna e pronta para embarque rápido na região de ${bairro.name} e em toda Guarulhos, com pontualidade garantida.`
    );

    html = html.replace(
      /Logística prática e mais organização/g,
      'Logística prática e conforto para seu grupo'
    );
    html = html.replace(
      /Mantenha o grupo pontual e reunido em viagens, excursões ou eventos corporativos, evitando atrasos e desencontros\./g,
      `Mantenha passageiros reunidos em viagens, eventos e transfers saindo de ${bairro.name}, com poltronas reclináveis e ar-condicionado.`
    );

    html = html.replace(
      /Versatilidade para diversos tipos de viagem/g,
      'Motoristas experientes e segurança total'
    );
    html = html.replace(
      /Atende com excelência casamentos, confraternizações, turismo religioso e traslados para shows com segurança e pontualidade\./g,
      `Veículos 100% regulamentados e higienizados com condutores profissionais que conhecem bem os acessos de ${bairro.name} e Guarulhos.`
    );

    // 2. Substituir o bloco de Razões (Por que nos escolher - Escuro)
    html = html.replace(
      /Razões pelas quais os viajantes escolhem o Aluguel de Van SP/g,
      `Razões pelas quais os viajantes escolhem ${serviceName} em ${bairro.name}`
    );
    html = html.replace(
      /Viajantes escolhem alugar vans em SP por motivos como conforto, economia em grupo, praticidade nos deslocamentos, motoristas profissionais, segurança reforçada, flexibilidade de horários e roteiros, veículos revisados e atendimento personalizado\. É uma solução ideal para turismo, eventos e viagens corporativas\.&nbsp;/g,
      `Viajantes e empresas em ${bairro.name}, Guarulhos, escolhem nossos serviços de van por motivos como conforto executivo, economia comprovada para grupos, flexibilidade total de horários e roteiros, motoristas capacitados e veículos novos rigorosamente revisados. É a solução perfeita para traslados, turismo, festas e viagens corporativas saindo de ${bairro.name}.`
    );

    // 3. Substituir o bloco de Dicas (Orientações Úteis - Branco)
    html = html.replace(
      /As melhores dicas para alugar uma van de 15 lugares/g,
      `As melhores dicas para alugar van em ${bairro.name}`
    );
    html = html.replace(
      /Aqui estão algumas sugestões valiosas para quem está considerando alugar uma van de 15 lugares\./g,
      `Aqui estão algumas sugestões valiosas para quem deseja alugar uma van com tranquilidade na região de ${bairro.name}, em Guarulhos.`
    );
    html = html.replace(
      /além de evitar preocupações com trânsito e legislação, motoristas profissionais conhecem rotas e oferecem mais conforto ao grupo\./g,
      `além de evitar desgastes com o trânsito da Grande SP, motoristas experientes garantem segurança e pontualidade no embarque em ${bairro.name}.`
    );
    html = html.replace(
      /calcule os quilômetros que serão rodados, o número de passageiros e o tempo de uso\. Isso ajuda a escolher o modelo ideal e evitar custos extras\./g,
      'avalie o roteiro e o perfil do grupo para escolher entre minivans ou vans de 12, 15 e 18 lugares com o bagageiro adequado.'
    );
    html = html.replace(
      /principalmente em feriados ou alta temporada, vans são muito procuradas\. Reservar cedo garante disponibilidade e melhores preços\./g,
      `garanta a disponibilidade da van em ${bairro.name} com antecedência, especialmente em fins de semana, datas comemorativas e alta temporada.`
    );

    // 4. Inserir a Seção de Linkagem Interna dos Bairros logo após o fechamento das dicas
    const bairrosGridHtml = buildBairrosGridHtml(allBairros, serviceSlug, serviceName, bairro.slug);
    const tipsEndMarker = 'class="aligncenter" loading="lazy"></a></p>';
    if (html.includes(tipsEndMarker)) {
      html = html.replace(tipsEndMarker, `${tipsEndMarker}\n${bairrosGridHtml}`);
    } else {
      html += `\n${bairrosGridHtml}`;
    }

    // 5. Substituir o bloco de Orçamento e Contato (Cotação Imediata - Escuro)
    html = html.replace(
      /Solicite seu orçamento/g,
      `Solicite seu orçamento gratuito em ${bairro.name}`
    );
    html = html.replace(
      /Encontre o plano ideal para o que você precisa, com preços que cabem no seu bolso\. Fique por dentro e garanta um serviço de qualidade\./g,
      `Encontre o plano ideal para sua locação em ${bairro.name}, Guarulhos, com condições transparentes e atendimento rápido via WhatsApp ou formulário.`
    );

    // 6. Substituir todos os links de CTA para o link oficial requerido pelo usuário
    html = html.replaceAll('/aluguel-de-van-de-15-lugares-1', 'https://alugueldevansp.com/aluguel-de-van-1');
    html = html.replaceAll('/aluguel-de-van-oficial-1', 'https://alugueldevansp.com/aluguel-de-van-1');
    html = html.replaceAll('/aluguel-de-van-1/', 'https://alugueldevansp.com/aluguel-de-van-1');
    html = html.replaceAll('href="/aluguel-de-van-1"', 'href="https://alugueldevansp.com/aluguel-de-van-1"');

    // Atualizar OpenGraph
    const og = (templatePage.og || []).map(([k, v]) => {
      if (k === 'og:title') return [k, pageTitle];
      if (k === 'og:description') return [k, pageDesc];
      if (k === 'og:url') return [k, pageUrl];
      if (k === 'og:updated_time') return [k, nowIso];
      return [k, v];
    });

    // Atualizar Twitter
    const twitter = (templatePage.twitter || []).map(([k, v]) => {
      if (k === 'twitter:title') return [k, pageTitle];
      if (k === 'twitter:description') return [k, pageDesc];
      return [k, v];
    });

    // Atualizar JSON-LD Schema
    const jsonld = (templatePage.jsonld || []).map((raw) => {
      try {
        let text = raw;
        text = text.replaceAll('https://alugueldevansp.com/aluguel-de-van-15-lugares/', pageUrl);
        text = text.replaceAll('Aluguel de van 15 lugares com Motorista | Aluguel de Van SP', pageTitle);
        text = text.replaceAll(templatePage.description, pageDesc);
        return text;
      } catch (e) {
        return raw;
      }
    });

    const newPageData = {
      ...templatePage,
      url: pageUrl,
      path: pagePath,
      title: pageTitle,
      description: pageDesc,
      canonical: pageUrl,
      robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
      h1: pageH1,
      h1InContent: false,
      lastmod: nowIso,
      og,
      twitter,
      jsonld,
      html
    };

    await fs.writeFile(targetFile, JSON.stringify(newPageData, null, 1), 'utf8');

    // Registrar no urls.json se não existir
    if (!existingUrlPaths.has(pagePath)) {
      urls.push({
        url: pageUrl,
        path: pagePath,
        lastmod: nowIso,
        type: 'page',
        sitemap: 'https://alugueldevansp.com/page-sitemap1.xml'
      });
      existingUrlPaths.add(pagePath);
    }

    generatedRoutes.push({
      bairro: bairro.name,
      slug: bairro.slug,
      path: pagePath,
      testUrl: `http://localhost:4321${pagePath}`
    });
  }

  // Atualizar também a página principal de Guarulhos (/aluguel-de-van-em-guarulhos/) para o novo layout!
  const guarulhosMainPath = path.join(PAGES_DIR, 'aluguel-de-van-em-guarulhos.json');
  let mainGuarulhosHtml = templatePage.html;
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Ideal para grupos grandes, com mais conforto/g, 'Atendimento em toda a cidade de Guarulhos');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Transporte até 15 passageiros com assentos reclináveis, espaço generoso e climatização completa em um único veículo\./g, 'Frota completa de vans executivas e utilitárias com pontualidade para atender passageiros e empresas em Guarulhos.');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Logística prática e mais organização/g, 'Logística prática e traslados para aeroportos e eventos');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Mantenha o grupo pontual e reunido em viagens, excursões ou eventos corporativos, evitando atrasos e desencontros\./g, 'Conexão direta para o Aeroporto Internacional de Guarulhos, viagens rodoviárias, feiras corporativas e passeios.');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Versatilidade para diversos tipos de viagem/g, 'Motoristas profissionais e veículos homologados');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Atende com excelência casamentos, confraternizações, turismo religioso e traslados para shows com segurança e pontualidade\./g, 'Segurança regulamentada pela EMTU, ANTT e Artesp para deslocamentos tranquilos dentro e fora de Guarulhos.');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Razões pelas quais os viajantes escolhem o Aluguel de Van SP/g, 'Razões pelas quais os viajantes escolhem Aluguel de Van em Guarulhos');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Viajantes escolhem alugar vans em SP por motivos como conforto, economia em grupo, praticidade nos deslocamentos, motoristas profissionais, segurança reforçada, flexibilidade de horários e roteiros, veículos revisados e atendimento personalizado\. É uma solução ideal para turismo, eventos e viagens corporativas\.&nbsp;/g, 'Viajantes e empresas em Guarulhos escolhem nossos serviços de van por motivos como pontualidade britânica, flexibilidade de itinerários e conforto incomparável.');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/As melhores dicas para alugar uma van de 15 lugares/g, 'Dicas para alugar van em Guarulhos');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Aqui estão algumas sugestões valiosas para quem está considerando alugar uma van de 15 lugares\./g, 'Confira orientações importantes para planejar sua locação em Guarulhos com segurança e agilidade.');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Solicite seu orçamento/g, 'Solicite seu orçamento gratuito em Guarulhos');
  mainGuarulhosHtml = mainGuarulhosHtml.replace(/Encontre o plano ideal para o que você precisa, com preços que cabem no seu bolso\. Fique por dentro e garanta um serviço de qualidade\./g, 'Encontre a opção ideal para seu grupo com valores justos e atendimento rápido via WhatsApp.');

  mainGuarulhosHtml = mainGuarulhosHtml.replaceAll('/aluguel-de-van-de-15-lugares-1', 'https://alugueldevansp.com/aluguel-de-van-1');
  mainGuarulhosHtml = mainGuarulhosHtml.replaceAll('/aluguel-de-van-oficial-1', 'https://alugueldevansp.com/aluguel-de-van-1');
  mainGuarulhosHtml = mainGuarulhosHtml.replaceAll('/aluguel-de-van-1/', 'https://alugueldevansp.com/aluguel-de-van-1');
  mainGuarulhosHtml = mainGuarulhosHtml.replaceAll('href="/aluguel-de-van-1"', 'href="https://alugueldevansp.com/aluguel-de-van-1"');

  const mainBairrosGrid = buildBairrosGridHtml(allBairros, serviceSlug, serviceName, '');
  const tipsEndMarker = 'class="aligncenter" loading="lazy"></a></p>';
  if (mainGuarulhosHtml.includes(tipsEndMarker)) {
    mainGuarulhosHtml = mainGuarulhosHtml.replace(tipsEndMarker, `${tipsEndMarker}\n${mainBairrosGrid}`);
  } else {
    mainGuarulhosHtml += `\n${mainBairrosGrid}`;
  }

  const updatedGuarulhosMain = {
    ...templatePage,
    url: 'https://alugueldevansp.com/aluguel-de-van-em-guarulhos/',
    path: '/aluguel-de-van-em-guarulhos/',
    title: 'Aluguel de Van em Guarulhos | Fretamento e Transporte em SP',
    description: 'Aluguel de Van em Guarulhos para viagens, eventos, traslados executivos e passeios com conforto e pontualidade. Peça sua cotação rápida e sem compromisso!',
    canonical: 'https://alugueldevansp.com/aluguel-de-van-em-guarulhos/',
    robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
    h1: 'Aluguel de Van em Guarulhos',
    lastmod: nowIso,
    html: mainGuarulhosHtml
  };
  await fs.writeFile(guarulhosMainPath, JSON.stringify(updatedGuarulhosMain, null, 1), 'utf8');
  console.log(`Página matriz de Guarulhos atualizada para o NOVO LAYOUT com a malha de ${allBairros.length} bairros!`);

  // Salvar urls.json
  await fs.writeFile(URLS_PATH, JSON.stringify(urls, null, 1), 'utf8');
  console.log(`urls.json atualizado com as novas URLs.`);

  console.log(`\nSucesso! Todas as ${generatedRoutes.length} páginas foram convertidas para o NOVO LAYOUT!`);
  return generatedRoutes;
}

// Executar se chamado via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const serviceName = process.argv[2] || 'Aluguel de Van';
  const serviceSlug = process.argv[3] || 'aluguel-de-van';
  generatePages({ serviceName, serviceSlug })
    .then((routes) => {
      console.log(`Processo concluído com êxito! Total: ${routes.length} páginas geradas.`);
    })
    .catch((err) => {
      console.error('Erro na geração:', err);
      process.exit(1);
    });
}
