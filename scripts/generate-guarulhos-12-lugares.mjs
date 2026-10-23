import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src/data/pages');
const URLS_PATH = path.join(ROOT, 'src/data/urls.json');

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

export function getPrep(bairroName) {
  const b = bairroName.trim();
  if (/^aeroporto/i.test(b)) return 'no';
  if (/^(jardim|morro|porto|monte|paraventi|mato|centro|bom clima|cecap|taboão|tabao|maia)/i.test(b)) return 'no';
  if (/^(vila|água|agua|ponte|várzea|varzea|capelinha|bela vista|invernada|tranquilidade)/i.test(b)) return 'na';
  return 'em';
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

export function getOptimizedMeta(bairroName, serviceName = 'Aluguel de Van 12 Lugares') {
  const isAeroporto = /aeroporto/i.test(bairroName);
  const prep = getPrep(bairroName);

  const h1 = isAeroporto
    ? `${serviceName} no ${bairroName}`
    : `${serviceName} ${prep} ${bairroName} - Guarulhos`;

  const titleCandidates = isAeroporto
    ? [
        `Aluguel de Van 12 Lugares no ${bairroName} | SP`,
        `Aluguel de Van 12 Lugares no ${bairroName} SP`,
        `Aluguel de Van 12 Lugares no ${bairroName} | Orçamento`,
        `Aluguel de Van 12 Lugares no ${bairroName} | Cotação SP`,
        `Aluguel de Van 12 Lugares no ${bairroName} | Frota SP`
      ]
    : [
        `Aluguel de Van 12 Lugares ${prep} ${bairroName}, Guarulhos | SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Guarulhos SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName}, Guarulhos SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} em Guarulhos | SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName}, Guarulhos | Cotação`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName}, Guarulhos | Orçamento`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Orçamento Rápido`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Cotação Rápida SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Guarulhos`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Orçamento SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Cotação SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Locação SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Vans em SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | Frota SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | SP Cotação`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} - Guarulhos SP`,
        `Aluguel de Van 12 Lugares ${prep} ${bairroName} | SP`
      ];

  let title = titleCandidates.find((t) => t.length >= 50 && t.length <= 60);
  if (!title) {
    const base = `Aluguel de Van 12 Lugares ${prep} ${bairroName}`;
    const suffixes = [
      ', Guarulhos | SP',
      ' | Guarulhos SP',
      ', Guarulhos SP',
      ' | Guarulhos',
      ' | Orçamento SP',
      ' | Cotação SP',
      ' | Frota SP',
      ' | Vans SP',
      ' | SP'
    ];
    for (const s of suffixes) {
      const cand = `${base}${s}`;
      if (cand.length >= 50 && cand.length <= 60) {
        title = cand;
        break;
      }
    }
    if (!title) {
      let cand = `${base} | SP`;
      if (cand.length > 60) cand = cand.slice(0, 60);
      title = cand;
    }
  }

  const baseDescs = isAeroporto
    ? [
        `Aluguel de van 12 lugares no ${bairroName} para viagens, eventos e transfers executivos com total conforto e pontualidade.`,
        `Aluguel de van 12 lugares no ${bairroName} para viagens e transfers executivos com veículos modernos e revisados.`,
        `Aluguel de van 12 lugares no ${bairroName} com ar-condicionado, poltronas confortáveis e segurança para seu grupo.`
      ]
    : [
        `Aluguel de van 12 lugares ${prep} ${bairroName}, Guarulhos para grupos médios com poltronas reclináveis, ar-condicionado e total conforto.`,
        `Aluguel de van 12 lugares ${prep} ${bairroName}, Guarulhos para viagens, eventos e transfers com veículos modernos e pontualidade.`,
        `Aluguel de van 12 lugares ${prep} ${bairroName}, Guarulhos com conforto, ar-condicionado e segurança para todos os passageiros.`
      ];

  const ctas = [
    ' Peça agora seu orçamento gratuito hoje!',
    ' Solicite seu orçamento gratuito hoje!',
    ' Peça seu orçamento gratuito hoje mesmo!',
    ' Solicite sua cotação gratuita hoje!',
    ' Peça seu orçamento gratuito agora!',
    ' Peça sua cotação gratuita hoje!',
    ' Solicite seu orçamento gratuito!',
    ' Peça seu orçamento gratuito!',
    ' Solicite sua cotação hoje!',
    ' Peça seu orçamento hoje!'
  ];

  let desc = '';
  for (const b of baseDescs) {
    for (const c of ctas) {
      const cand = `${b}${c}`;
      if (cand.length >= 140 && cand.length <= 160) {
        desc = cand;
        break;
      }
    }
    if (desc) break;
  }

  if (!desc) {
    desc = `${baseDescs[0]} Solicite seu orçamento gratuito!`;
    if (desc.length > 160) desc = desc.slice(0, 160);
  }

  return { title, desc, h1 };
}

export async function generate12LugaresGuarulhos() {
  const serviceName = 'Aluguel de Van 12 Lugares';
  const serviceSlug = 'aluguel-de-van-12-lugares';
  const whatsappUrl = 'https://alugueldevansp.com/aluguel-de-van-12-lugares-1';

  console.log(`\nIniciando geração das páginas de Guarulhos para: "${serviceName}" (slug: "${serviceSlug}")...`);

  // Carregar o template oficial de 12 lugares
  const templatePath = path.join(PAGES_DIR, 'aluguel-de-van-12-lugares.json');
  const templateContent = await fs.readFile(templatePath, 'utf8');
  const templatePage = JSON.parse(templateContent);

  const allBairros = buildBairrosList(DEFAULT_BAIRROS_RAW);
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

    const { title: pageTitle, desc: pageDesc, h1: pageH1 } = getOptimizedMeta(bairro.name, serviceName);

    // Validação estrita de limites
    if (pageTitle.length < 50 || pageTitle.length > 60) {
      console.warn(`[AVISO TITLE] ${bairro.name}: "${pageTitle}" (${pageTitle.length} chars)`);
    }
    if (pageDesc.length < 140 || pageDesc.length > 160) {
      console.warn(`[AVISO DESC] ${bairro.name}: "${pageDesc}" (${pageDesc.length} chars)`);
    }

    let html = templatePage.html;

    // 1. Substituir os 3 Benefícios do Hero Card Superior
    html = html.replace(
      /Espaço ideal para grupos médios com conforto/g,
      `Atendimento ágil em ${bairro.name} e região`
    );
    html = html.replace(
      /Perfeita para famílias, pequenos grupos de turismo ou equipes de trabalho, com assentos individuais e circulação interna facilitada\./g,
      `Vans de 12 lugares prontas para embarque rápido na região de ${bairro.name} e em toda Guarulhos, com pontualidade e segurança.`
    );

    html = html.replace(
      /Conforto superior em longas distâncias/g,
      'Logística e conforto para seu grupo'
    );
    html = html.replace(
      /Poltronas confortáveis, ar-condicionado de alta potência e isolamento acústico para trajetos longos sem cansaço excessivo\./g,
      `Mantenha passageiros reunidos em viagens, eventos e transfers saindo de ${bairro.name}, com poltronas reclináveis e ar-condicionado.`
    );

    html = html.replace(
      /Capacidade para bagagens e equipamentos/g,
      'Motoristas experientes e segurança total'
    );
    html = html.replace(
      /Amplo compartimento para malas grandes, instrumentos ou materiais de evento, preservando o conforto dos passageiros\./g,
      `Veículos 100% regulamentados e higienizados com condutores profissionais que conhecem bem os acessos de ${bairro.name} e Guarulhos.`
    );

    // 2. Substituir o bloco de Razões
    html = html.replace(
      /Razões pelas quais os viajantes escolhem o Aluguel de Van SP/g,
      `Razões para escolher van 12 lugares em ${bairro.name}`
    );
    html = html.replace(
      /Viajantes escolhem alugar vans em SP por motivos como conforto, economia em grupo, praticidade nos deslocamentos, motoristas profissionais, segurança reforçada, flexibilidade de horários e roteiros, veículos revisados e atendimento personalizado\. É uma solução ideal para turismo, eventos e viagens corporativas\.&nbsp;/g,
      `Viajantes e empresas em ${bairro.name}, Guarulhos, escolhem nossas vans de 12 lugares por motivos como conforto executivo, economia comprovada para grupos médios, flexibilidade de horários, motoristas capacitados e veículos novos revisados. É a solução ideal para transfers, turismo e viagens corporativas saindo de ${bairro.name}.`
    );

    // 3. Substituir o bloco de Dicas
    html = html.replace(
      /As melhores dicas para alugar uma van de 12 lugares/g,
      `Dicas para alugar van 12 lugares em ${bairro.name}`
    );
    html = html.replace(
      /Aqui estão algumas sugestões valiosas para quem está considerando alugar uma van 12 lugares\./g,
      `Confira orientações úteis para planejar sua locação de van 12 lugares na região de ${bairro.name}, em Guarulhos.`
    );
    html = html.replace(
      /se for uma viagem longa ou com paradas específicas, avise a empresa\. Isso ajuda na escolha do modelo e evita cobranças extras\./g,
      `planeje o roteiro com paradas para garantir agilidade e tranquilidade no embarque e desembarque em ${bairro.name}.`
    );
    html = html.replace(
      /se o grupo levar muitas malas, verifique se há compartimento extra ou possibilidade de rebatimento de bancos\./g,
      'avalie o volume de bagagens dos 12 passageiros para organizar a disposição das malas com máximo conforto.'
    );
    html = html.replace(
      /principalmente em feriados ou alta temporada, vans são muito procuradas\. Reservar cedo garante disponibilidade e melhores preços\./g,
      `garanta a reserva da van 12 lugares em ${bairro.name} com antecedência, especialmente em feriados e fins de semana.`
    );

    // 4. Substituir todos os links de CTA para o link oficial requerido pelo usuário
    html = html.replace(/href=["']\/aluguel-de-van-12-lugares-1\/?["']/g, `href="${whatsappUrl}"`);
    html = html.replace(/href=["']\/aluguel-de-van-1\/?["']/g, `href="${whatsappUrl}"`);
    html = html.replace(/href=["']https:\/\/alugueldevansp\.com\/aluguel-de-van-1\/?["']/g, `href="${whatsappUrl}"`);

    // 5. Inserir a Seção de Linkagem Interna dos Bairros (após substituição de CTAs para não afetar os links)
    const bairrosGridHtml = buildBairrosGridHtml(allBairros, serviceSlug, serviceName, bairro.slug);
    const tipsEndMarker = 'class="aligncenter" loading="lazy"></a></p>';
    if (html.includes(tipsEndMarker)) {
      html = html.replace(tipsEndMarker, `${tipsEndMarker}\n${bairrosGridHtml}`);
    } else {
      html += `\n${bairrosGridHtml}`;
    }

    // 6. Substituir o bloco de Orçamento e Contato
    html = html.replace(
      /Solicite seu orçamento/g,
      `Solicite seu orçamento gratuito em ${bairro.name}`
    );
    html = html.replace(
      /Encontre o plano ideal para o que você precisa, com preços que cabem no seu bolso\. Fique por dentro e garanta um serviço de qualidade\./g,
      `Encontre o plano ideal para sua locação em ${bairro.name}, Guarulhos, com condições transparentes e atendimento rápido via WhatsApp ou formulário.`
    );

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
        text = text.replaceAll('https://alugueldevansp.com/aluguel-de-van-12-lugares/', pageUrl);
        text = text.replaceAll(templatePage.title, pageTitle);
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
      title: pageTitle,
      titleLength: pageTitle.length,
      descLength: pageDesc.length,
      testUrl: `http://localhost:4321${pagePath}`
    });
  }

  // Atualizar também a página polo aluguel-de-van-12-lugares-guarulhos.json
  const guarulhosMainPath = path.join(PAGES_DIR, 'aluguel-de-van-12-lugares-guarulhos.json');
  try {
    let mainGuarulhosHtml = templatePage.html;
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Espaço ideal para grupos médios com conforto/g, 'Atendimento em toda a cidade de Guarulhos');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Perfeita para famílias, pequenos grupos de turismo ou equipes de trabalho, com assentos individuais e circulação interna facilitada\./g, 'Vans de 12 lugares modernas com ar-condicionado e poltronas reclináveis para atender passageiros e empresas em Guarulhos.');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Conforto superior em longas distâncias/g, 'Logística prática e traslados para aeroportos e eventos');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Poltronas confortáveis, ar-condicionado de alta potência e isolamento acústico para trajetos longos sem cansaço excessivo\./g, 'Conexão direta para o Aeroporto Internacional de Guarulhos, viagens rodoviárias, feiras corporativas e passeios com vans 12 lugares.');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Capacidade para bagagens e equipamentos/g, 'Motoristas profissionais e veículos homologados');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Amplo compartimento para malas grandes, instrumentos ou materiais de evento, preservando o conforto dos passageiros\./g, 'Segurança regulamentada pela EMTU, ANTT e Artesp para deslocamentos tranquilos dentro e fora de Guarulhos.');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Razões pelas quais os viajantes escolhem o Aluguel de Van SP/g, 'Razões para escolher van 12 lugares em Guarulhos');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Viajantes escolhem alugar vans em SP por motivos como conforto, economia em grupo, praticidade nos deslocamentos, motoristas profissionais, segurança reforçada, flexibilidade de horários e roteiros, veículos revisados e atendimento personalizado\. É uma solução ideal para turismo, eventos e viagens corporativas\.&nbsp;/g, 'Viajantes e empresas em Guarulhos escolhem nossos serviços de van 12 lugares por motivos como pontualidade britânica, flexibilidade de itinerários e conforto incomparável.');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/As melhores dicas para alugar uma van de 12 lugares/g, 'Dicas para alugar van 12 lugares em Guarulhos');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Aqui estão algumas sugestões valiosas para quem está considerando alugar uma van 12 lugares\./g, 'Confira orientações importantes para planejar sua locação de van 12 lugares em Guarulhos com segurança e agilidade.');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Solicite seu orçamento/g, 'Solicite seu orçamento gratuito em Guarulhos');
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/Encontre o plano ideal para o que você precisa, com preços que cabem no seu bolso\. Fique por dentro e garanta um serviço de qualidade\./g, 'Encontre a opção ideal para seu grupo com valores justos e atendimento rápido via WhatsApp.');

    mainGuarulhosHtml = mainGuarulhosHtml.replace(/href=["']\/aluguel-de-van-12-lugares-1\/?["']/g, `href="${whatsappUrl}"`);
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/href=["']\/aluguel-de-van-1\/?["']/g, `href="${whatsappUrl}"`);
    mainGuarulhosHtml = mainGuarulhosHtml.replace(/href=["']https:\/\/alugueldevansp\.com\/aluguel-de-van-1\/?["']/g, `href="${whatsappUrl}"`);

    const mainBairrosGrid = buildBairrosGridHtml(allBairros, serviceSlug, serviceName, '');
    const tipsEndMarker = 'class="aligncenter" loading="lazy"></a></p>';
    if (mainGuarulhosHtml.includes(tipsEndMarker)) {
      mainGuarulhosHtml = mainGuarulhosHtml.replace(tipsEndMarker, `${tipsEndMarker}\n${mainBairrosGrid}`);
    } else {
      mainGuarulhosHtml += `\n${mainBairrosGrid}`;
    }

    const updatedGuarulhosMain = {
      ...templatePage,
      url: 'https://alugueldevansp.com/aluguel-de-van-12-lugares-guarulhos/',
      path: '/aluguel-de-van-12-lugares-guarulhos/',
      title: 'Aluguel de van 12 lugares em Guarulhos | Fretamento em SP',
      description: 'Aluguel de van 12 lugares em Guarulhos para viagens, eventos, transfers e passeios com conforto e pontualidade. Peça sua cotação rápida e sem compromisso!',
      canonical: 'https://alugueldevansp.com/aluguel-de-van-12-lugares-guarulhos/',
      robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
      h1: 'Aluguel de van 12 lugares em Guarulhos',
      lastmod: nowIso,
      html: mainGuarulhosHtml
    };
    await fs.writeFile(guarulhosMainPath, JSON.stringify(updatedGuarulhosMain, null, 1), 'utf8');
    console.log(`Página matriz de Guarulhos (/aluguel-de-van-12-lugares-guarulhos/) atualizada com sucesso!`);
  } catch (err) {
    console.warn('Aviso ao atualizar página polo de Guarulhos:', err.message);
  }

  // Salvar urls.json
  await fs.writeFile(URLS_PATH, JSON.stringify(urls, null, 1), 'utf8');
  console.log(`urls.json atualizado com as novas URLs.`);

  console.log(`\nSucesso! Todas as ${generatedRoutes.length} páginas de 12 lugares foram geradas.`);
  return generatedRoutes;
}

// Executar se chamado diretamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate12LugaresGuarulhos()
    .then((routes) => {
      console.log(`Concluído! Total: ${routes.length} rotas geradas.`);
    })
    .catch((err) => {
      console.error('Erro na geração:', err);
      process.exit(1);
    });
}
