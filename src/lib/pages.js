import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function resolvePagesDir() {
  const candidates = [
    path.resolve(process.cwd(), 'src/data/pages'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../src/data/pages'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../src/data/pages'),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/pages'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return path.resolve(process.cwd(), 'src/data/pages');
}

let cache;

/** Carrega todas as páginas extraídas do WordPress (JSON por URL). */
export function loadPages() {
  if (import.meta.env?.PROD && cache) return cache;
  const dir = resolvePagesDir();
  cache = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  return cache;
}

/** '/' -> undefined (home); '/a/b/' -> 'a/b' */
export const slugOf = (p) => (p === '/' ? undefined : decodeURIComponent(p).replace(/^\/|\/$/g, ''));

export const LEAD_FORM = `<form class="lead-form" data-lead novalidate>
  <div class="lead-grid">
    <label><span>Nome</span><input type="text" name="Nome" required autocomplete="given-name" placeholder="Seu nome"></label>
    <label><span>Sobrenome</span><input type="text" name="Sobrenome" required autocomplete="family-name" placeholder="Seu sobrenome"></label>
    <label><span>E-mail</span><input type="email" name="E-mail" required autocomplete="email" placeholder="voce@email.com"></label>
    <label><span>Telefone</span><input type="tel" name="Telefone" required autocomplete="tel" placeholder="(11) 90000-0000"></label>
    <label class="lead-full"><span>Mensagem</span><textarea name="Mensagem" rows="4" placeholder="Conte data, destino e número de passageiros"></textarea></label>
  </div>
  <label class="lead-hp" aria-hidden="true">Não preencha<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  <button class="btn btn-chamativo" type="submit">Solicitar orçamento</button>
  <p class="lead-status" role="status" aria-live="polite"></p>
</form>`;

import * as cheerio from 'cheerio';
import { getButtonHrefForPage, WHATSAPP_REDIRECTS } from './whatsapp-links.js';

export function buildWhatsAppCta(buttonHref) {
  return `<div class="btn-whatsapp-wrapper text-center">
  <a href="${buttonHref}" target="_blank" rel="noopener noreferrer" class="btn-chamativo btn-whatsapp-cta" aria-label="Solicitar orçamento no WhatsApp">
    <svg viewBox="0 0 24 24" class="btn-wa-icon" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
    <span>Solicitar orçamento</span>
  </a>
</div>`;
}

/** Processa o HTML da página: substitui formulário, padroniza botões e substitui imagens antigas de WhatsApp por botões chamativos. */
export function injectForm(html, pagePath = '') {
  if (!html) return html;
  
  const $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });

  // 1. Substitui qualquer imagem legada do botão de WhatsApp por um botão chamativo HTML nativo
  $('img[src*="Botao-de-whatsapp"], img[alt*="whatsapp" i]').each(function () {
    const img = $(this);
    const anchor = img.closest('a');
    let buttonHref = (anchor.attr('href') || '').trim();
    if (buttonHref) {
      buttonHref = buttonHref.replace(/^https?:\/\/(?:www\.)?alugueldevansp\.com/i, '').replace(/\/$/, '');
    }
    if (!buttonHref || buttonHref === '#' || buttonHref.startsWith('javascript:') || !WHATSAPP_REDIRECTS[buttonHref]) {
      buttonHref = getButtonHrefForPage(pagePath);
    } else if (!buttonHref.endsWith('/')) {
      buttonHref += '/';
    }
    const ctaMarkup = buildWhatsAppCta(buttonHref);
    const target = anchor.length ? anchor : img;
    const parent = target.parent();
    if (
      parent.is('figure') ||
      parent.hasClass('figure-img') ||
      (parent.is('p') && parent.children().length === 1 && !parent.text().trim())
    ) {
      parent.replaceWith(ctaMarkup);
    } else {
      target.replaceWith(ctaMarkup);
    }
  });

  // Normaliza quaisquer links que apontam para rotas -1 legadas no corpo do texto
  $('a[href*="-1"]').each(function () {
    const a = $(this);
    let href = (a.attr('href') || '').trim().replace(/^https?:\/\/(?:www\.)?alugueldevansp\.com/i, '').replace(/\/$/, '');
    if (WHATSAPP_REDIRECTS[href]) {
      a.attr('href', href + '/');
      a.attr('target', '_blank');
      a.attr('rel', 'noopener noreferrer');
    }
  });

  // 2. Padroniza qualquer botão ou CTA com a taxonomia 'Solicitar orçamento' e estilo chamativo
  $('a.btn, a[href*="solicite-um-orcamento"], a[href*="contato"]').each(function () {
    const el = $(this);
    const text = el.text().trim().toLowerCase();
    if (
      text.includes('contato') ||
      text.includes('orçamento') ||
      text.includes('solicita') ||
      text.includes('fale') ||
      text.includes('enviar')
    ) {
      el.text('Solicitar orçamento');
      el.addClass('btn-chamativo');
      if (!el.hasClass('btn')) el.addClass('btn');
    }
  });

  // 3. Substitui o placeholder do formulário de lead
  const leadPlaceholder = $('[data-lead-form="1"]');
  if (leadPlaceholder.length) {
    leadPlaceholder.replaceWith(LEAD_FORM);
    
    // Localiza o container de 2 colunas (Informações de Contato + Formulário)
    let curr = $('.lead-form').first();
    while (curr.length && !curr.is('body') && !curr.is('html')) {
      const parent = curr.parent();
      if (!parent.length || parent.is('body') || parent.is('html')) break;
      
      const siblings = parent.children();
      if (siblings.length === 2) {
        const formCol = curr.closest(siblings);
        const infoCol = siblings.not(formCol);
        const text = infoCol.text().toLowerCase();
        if (
          text.includes('orçamento') ||
          text.includes('contato') ||
          text.includes('telefone') ||
          text.includes('endereço') ||
          text.includes('solicite')
        ) {
          parent.addClass('contact-lead-grid');
          infoCol.addClass('contact-info-col');
          formCol.addClass('contact-form-col');
          break;
        }
      }
      curr = parent;
    }
  }

  // 3.5. Estrutura os módulos das páginas de serviço em seções alternadas (Branco / Escuro)
  if (pagePath && pagePath.startsWith('/aluguel-') && pagePath !== '/servicos/') {
    // 1. Bloco de Razões (Escuro - igual à imagem)
    const reasonsH2 = $('h2').filter((_, el) => /razões|escolhem/i.test($(el).text())).first();
    if (reasonsH2.length) {
      const title = reasonsH2.text().trim();
      let desc = '';
      const container = reasonsH2.parents().filter((_, el) => $(el).children('p').length > 0).first();
      if (container.length) {
        const p = container.children('p').first();
        desc = p.text().trim();
        p.remove();
      }
      
      const reasonsSection = `
        <section class="section-dark section-service-reasons">
          <div class="section-head-dark text-center">
            <span class="kicker-gold">Por Que Nos Escolher</span>
            <h2>${title}</h2>
            ${desc ? `<p class="section-sub-dark">${desc}</p>` : ''}
          </div>
        </section>
      `;
      
      const h2Wrap = reasonsH2.closest('div:has(> div > h2, > h2)');
      if (h2Wrap.length) {
        h2Wrap.replaceWith(reasonsSection);
      } else {
        reasonsH2.replaceWith(reasonsSection);
      }
    }

    // 1.6. Bloco de Opções Econômicas / Comparação de Veículos (Branco)
    const econH2 = $('h2').filter((_, el) => /econômicas/i.test($(el).text())).first();
    if (econH2.length) {
      const econTitle = econH2.text().trim();
      let titlesRow = econH2.next();
      let imgsRow = titlesRow.next();
      let specsRow = imgsRow.next();

      const titles = titlesRow.find('h3').map((_, el) => $(el).text().trim()).get();
      const imgs = imgsRow.find('img').map((_, el) => ({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || $(el).attr('title') || ''
      })).get();

      const specs = [];
      specsRow.children('div').each((_, el) => {
        const p = $(el).find('p').first();
        const html = p.html() || '';
        const lines = html.split(/<br\s*\/?>/i).map(l => l.trim()).filter(Boolean);
        specs.push(lines);
      });

      if (titles.length >= 2 && imgs.length >= 2) {
        const buttonHref = getButtonHrefForPage(pagePath);
        const cardsHtml = titles.map((t, idx) => {
          const img = imgs[idx] || {};
          const specLines = Array.isArray(specs[idx]) ? specs[idx] : [];
          const isSpin = /spin/i.test(t);
          const badgeText = isSpin ? 'Econômica • 5 a 7 Lugares' : 'Executiva • 7 Lugares';
          const badgeClass = isSpin ? 'badge-economic-green' : 'badge-economic-gold';
          const defaultAlt = isSpin ? 'Minivan Chevrolet Spin' : 'Minivan Mercedes-Benz';

          const specsHtml = specLines.map(line => {
            let icon = '✓';
            if (/ideal/i.test(line)) icon = '👥';
            else if (/vantagens/i.test(line)) icon = '⚡';
            else if (/destaque/i.test(line)) icon = '⭐';
            else if (/indica/i.test(line)) icon = '🎯';
            return `<li><span class="spec-ico">${icon}</span><span class="spec-text">${line}</span></li>`;
          }).join('');

          return `
            <div class="vehicle-compare-card ${isSpin ? 'card-spin' : 'card-minivan'}">
              <div class="compare-card-top">
                <span class="compare-badge ${badgeClass}">${badgeText}</span>
                <h3 class="compare-card-title">${t}</h3>
              </div>
              <div class="compare-card-img-wrap">
                <img src="${img.src}" alt="${img.alt || defaultAlt}" loading="lazy" />
              </div>
              <ul class="compare-card-specs">
                ${specsHtml}
              </ul>
              <div class="compare-card-action">
                <a href="${buttonHref}" target="_blank" rel="noopener noreferrer" class="btn btn-chamativo compare-btn">
                  Solicitar orçamento
                </a>
              </div>
            </div>
          `;
        }).join('');

        const econSection = `
          <section class="section-light section-economic-options">
            <div class="section-head text-center">
              <span class="badge-pill">Custo-Benefício</span>
              <h2>${econTitle}</h2>
              <p class="section-sub">Modelos compactos e versáteis com excelente dirigibilidade e baixo consumo, ideais para pequenos grupos, famílias e traslados rápidos.</p>
            </div>
            <div class="economic-vehicles-grid">
              ${cardsHtml}
            </div>
          </section>
        `;

        titlesRow.remove();
        imgsRow.remove();
        specsRow.remove();
        econH2.replaceWith(econSection);
      }
    }

    // 1.7. Bloco de Quando Reservar / Preços por Mês (Escuro)
    const bookingH2 = $('h2').filter((_, el) => /quando reservar/i.test($(el).text())).first();
    if (bookingH2.length) {
      const bTitle = bookingH2.text().trim();
      const pElements = [];
      let tableHtml = '';
      let noteHtml = '';
      let ctaHtml = '';

      let curr = bookingH2.next();
      const toRemove = [];
      while (curr.length && !curr.is('h2') && !curr.hasClass('section-light') && !curr.hasClass('section-dark') && !curr.hasClass('contact-lead-grid')) {
        toRemove.push(curr);
        if (curr.is('p')) {
          if (curr.find('em, strong').text().includes('Obs.')) {
            noteHtml = `<p class="booking-note">${curr.html()}</p>`;
          } else {
            pElements.push(curr.text().trim());
          }
        } else if (curr.is('figure') && curr.find('table').length) {
          tableHtml = $.html(curr.find('table'));
        } else if (curr.find('table').length) {
          tableHtml = $.html(curr.is('table') ? curr : curr.find('table'));
        } else if (curr.hasClass('btn-whatsapp-wrapper')) {
          ctaHtml = $.html(curr);
        }
        curr = curr.next();
      }

      toRemove.forEach(el => el.remove());

      const bookingSection = `
        <section class="section-dark section-service-when-to-book">
          <div class="section-head-dark text-center">
            <span class="kicker-gold">Planejamento & Sazonalidade</span>
            <h2>${bTitle}</h2>
            ${pElements.length ? `<p class="section-sub-dark">${pElements.join(' ')}</p>` : ''}
          </div>
          ${tableHtml ? `
            <div class="booking-table-container">
              <div class="booking-table-card">
                ${tableHtml}
              </div>
            </div>
          ` : ''}
          ${noteHtml}
          ${ctaHtml ? `<div class="booking-cta-wrap text-center">${ctaHtml}</div>` : ''}
        </section>
      `;

      bookingH2.replaceWith(bookingSection);
    }

    // 2. Bloco de Dicas (Branco)
    const tipsH2 = $('h2').filter((_, el) => /dicas/i.test($(el).text())).first();
    if (tipsH2.length) {
      const title = tipsH2.text().trim();
      let intro = '';
      const tips = [];
      
      let curr = tipsH2.next();
      const toRemove = [];
      let ctaWrapperHtml = '';

      while (curr.length && !curr.is('h2') && !curr.hasClass('contact-lead-grid') && !curr.hasClass('section-dark')) {
        if (curr.hasClass('btn-whatsapp-wrapper')) {
          ctaWrapperHtml = $.html(curr);
          toRemove.push(curr);
        } else if (curr.is('p')) {
          const rawText = curr.text().trim();
          toRemove.push(curr);
          if (rawText.startsWith('✅') || rawText.startsWith('✔') || rawText.includes(':')) {
            const cleanText = rawText.replace(/^[✅✔\s\-–]+/, '').trim();
            const splitIdx = cleanText.indexOf(':');
            if (splitIdx > -1) {
              tips.push({
                title: cleanText.slice(0, splitIdx).trim(),
                desc: cleanText.slice(splitIdx + 1).trim()
              });
            } else {
              tips.push({ title: 'Dica importante', desc: cleanText });
            }
          } else if (!intro) {
            intro = rawText;
          }
        }
        curr = curr.next();
      }

      toRemove.forEach((el) => el.remove());

      const tipCardsHtml = tips
        .map(
          (t) => `
        <div class="service-tip-card">
          <div class="tip-card-header">
            <span class="tip-check">✓</span>
            <h4>${t.title}</h4>
          </div>
          <p>${t.desc}</p>
        </div>
      `
        )
        .join('');

      const tipsSection = `
        <section class="section-light section-service-tips">
          <div class="section-head text-center">
            <span class="badge-pill">Orientações Úteis</span>
            <h2>${title}</h2>
            ${intro ? `<p class="section-sub">${intro}</p>` : ''}
          </div>
          ${tipCardsHtml ? `<div class="service-tips-grid">${tipCardsHtml}</div>` : ''}
          ${ctaWrapperHtml ? `<div class="tips-cta-wrap text-center">${ctaWrapperHtml}</div>` : ''}
        </section>
      `;

      tipsH2.replaceWith(tipsSection);
    }

    // 3. Envolve o formulário de lead no módulo Escuro
    const leadGrid = $('.contact-lead-grid');
    if (leadGrid.length && !leadGrid.parent().hasClass('section-service-lead')) {
      leadGrid.wrap('<section class="section-dark section-service-lead"></section>');

      const leadH2 = leadGrid.find('h2').first();
      if (leadH2.length && !leadH2.prev().hasClass('kicker-gold')) {
        leadH2.before('<span class="kicker-gold">Cotação Imediata</span>');
      }
    }
  }

  // 4. Estrutura a página de equipe em cards modernos com avatares arredondados
  if (pagePath === '/equipe/') {
    const cards = [];
    $('h2').each(function () {
      const h2 = $(this);
      const titleText = h2.text().trim();
      const parts = titleText.split(/–|-/).map((s) => s.trim());
      const name = parts[0] || '';
      const role = parts.slice(1).join(' – ') || '';

      const figDiv = h2.nextAll('.figure-img').first();
      const img = figDiv.find('img').first();
      const p = figDiv.nextAll('p').first();

      const imgSrc = img.attr('src') || '';
      const imgAlt = img.attr('alt') || name;
      const imgSrcset = img.attr('srcset') || '';
      const bio = p.html() || '';

      cards.push(`
        <article class="team-card">
          <div class="team-avatar-wrap">
            <img src="${imgSrc}" alt="${imgAlt}" ${imgSrcset ? `srcset="${imgSrcset}"` : ''} class="team-avatar" loading="lazy" />
          </div>
          <div class="team-content">
            <h2 class="team-name">${name}</h2>
            ${role ? `<span class="team-role">${role}</span>` : ''}
            <p class="team-bio">${bio}</p>
          </div>
        </article>
      `);
    });

    if (cards.length > 0) {
      const container = `<div class="team-grid">${cards.join('')}</div>`;
      if ($('body').length) {
        $('body').html(container);
      } else {
        $.root().html(container);
      }
    }
  }

  // 5. Moderniza a página de cases (/cases/) com cards divididos e imagens compactas
  if (pagePath === '/cases/') {
    const introParas = [];
    $('h2').first().prevAll('p').each(function () {
      introParas.unshift($(this).html());
    });

    const caseCards = [];
    $('h2').each(function (idx) {
      const h2 = $(this);
      const rawTitle = h2.text().trim();
      const cleanTitle = rawTitle.replace(/^\d+[\s\-\–]+/, '');

      const fig = h2.nextAll('.figure-img').first();
      const img = fig.find('img').first();
      const imgSrc = img.attr('src') || '';
      const imgAlt = img.attr('alt') || cleanTitle;
      const imgSrcset = img.attr('srcset') || '';

      const ul = h2.nextAll('ul').first();
      const details = {};
      ul.find('li').each(function () {
        const li = $(this);
        const strongText = li.find('strong').text().toLowerCase().replace(':', '').trim();
        li.find('strong').remove();
        const val = li.text().trim().replace(/^:\s*/, '');
        details[strongText] = val;
      });

      const caseNumber = String(idx + 1).padStart(2, '0');
      const cliente = details['cliente'] || '';
      const necessidade = details['necessidade'] || '';
      const solucao = details['solução'] || details['solucao'] || '';
      const resultado = details['resultado'] || '';

      caseCards.push(`
        <article class="case-card ${idx % 2 === 1 ? 'case-card--reverse' : ''}">
          <div class="case-visual">
            <div class="case-img-wrap">
              <span class="case-badge">Case #${caseNumber}</span>
              <img src="${imgSrc}" alt="${imgAlt}" ${imgSrcset ? `srcset="${imgSrcset}"` : ''} class="case-img" loading="lazy" />
            </div>
          </div>
          <div class="case-content">
            <h2 class="case-title">${cleanTitle}</h2>
            <div class="case-meta-grid">
              ${cliente ? `
                <div class="case-meta-item">
                  <span class="case-meta-label">Cliente</span>
                  <span class="case-meta-value">${cliente}</span>
                </div>` : ''}
              ${necessidade ? `
                <div class="case-meta-item">
                  <span class="case-meta-label">Desafio / Necessidade</span>
                  <span class="case-meta-value">${necessidade}</span>
                </div>` : ''}
              ${solucao ? `
                <div class="case-meta-item case-meta-solution">
                  <span class="case-meta-label">Solução sob medida</span>
                  <span class="case-meta-value">${solucao}</span>
                </div>` : ''}
            </div>
            ${resultado ? `
              <div class="case-result-box">
                <div class="case-result-header">
                  <span class="case-result-icon" aria-hidden="true">✓</span>
                  <strong>Resultado alcançado</strong>
                </div>
                <p class="case-result-text">${resultado}</p>
              </div>` : ''}
          </div>
        </article>
      `);
    });

    const ctaButtonHref = getButtonHrefForPage(pagePath);
    const bottomCta = `
      <section class="cases-cta-banner">
        <div class="cases-cta-inner">
          <h3>Quer um transporte com essa pontualidade e tranquilidade?</h3>
          <p>Conte com a nossa frota moderna e motoristas experientes para tornar o seu próximo evento ou viagem um verdadeiro sucesso.</p>
          <a href="${ctaButtonHref}" target="_blank" rel="noopener noreferrer" class="btn btn-lg btn-chamativo">
            Solicitar orçamento agora
          </a>
        </div>
      </section>
    `;

    const htmlOutput = `
      <div class="cases-page-wrap">
        ${introParas.length ? `
          <div class="cases-intro-card">
            <div class="cases-intro-grid">
              <div class="cases-intro-col-left">
                <span class="badge-pill">Experiência Comprovada</span>
                <p class="cases-intro-lead">${introParas[0]}</p>
              </div>
              <div class="cases-intro-col-right">
                ${introParas[1] ? `<p class="cases-intro-body">${introParas[1]}</p>` : ''}
                ${introParas[2] ? `
                  <div class="cases-intro-callout">
                    <span class="cases-callout-icon" aria-hidden="true">✓</span>
                    <p class="cases-intro-sub">${introParas[2]}</p>
                  </div>` : ''}
              </div>
            </div>
          </div>` : ''}
        <div class="cases-list">
          ${caseCards.join('')}
        </div>
        ${bottomCta}
      </div>
    `;

    if ($('body').length) {
      $('body').html(htmlOutput);
    } else {
      $.root().html(htmlOutput);
    }
  }

  // 6. Moderniza a página Sobre Nós (/sobre-nos/) com layout moderno, stats e imagem contida
  if (pagePath === '/sobre-nos/') {
    const ctaButtonHref = getButtonHrefForPage(pagePath);
    const aboutHtml = `
      <div class="about-page-wrap">
        <!-- Barra de Destaques / Estatísticas -->
        <section class="about-stats-bar" aria-label="Estatísticas da empresa">
          <div class="about-stat-item">
            <span class="about-stat-num">+12</span>
            <span class="about-stat-label">Anos de Experiência</span>
          </div>
          <div class="about-stat-item">
            <span class="about-stat-num">+1.500</span>
            <span class="about-stat-label">Clientes e Grupos Atendidos</span>
          </div>
          <div class="about-stat-item">
            <span class="about-stat-num">24h</span>
            <span class="about-stat-label">Atendimento e Plantão</span>
          </div>
          <div class="about-stat-item">
            <span class="about-stat-num">100%</span>
            <span class="about-stat-label">Segurança e Conforto</span>
          </div>
        </section>

        <!-- Nossa História (Split Grid) -->
        <section class="about-story-section">
          <div class="about-story-grid">
            <div class="about-story-content">
              <span class="badge-pill">Nossa Trajetória</span>
              <h2 class="about-section-title">Mais de uma década conectando pessoas com segurança e excelência</h2>
              <p class="about-lead">
                Nossa empresa é especializada no aluguel de vans em São Paulo, com uma sólida experiência de 12 anos no mercado. Nos dedicamos a oferecer serviços de transporte de qualidade, priorizando a segurança, o conforto e a pontualidade rigorosa dos nossos passageiros.
              </p>
              <div class="about-values-list">
                <div class="about-value-item">
                  <span class="about-check-icon" aria-hidden="true">✓</span>
                  <div>
                    <strong>Segurança e Regulamentação</strong>
                    <p>Veículos cadastrados nos órgãos competentes (EMTU, ARTESP, ANTT e SPTrans) com revisões mecânicas rigorosas.</p>
                  </div>
                </div>
                <div class="about-value-item">
                  <span class="about-check-icon" aria-hidden="true">✓</span>
                  <div>
                    <strong>Pontualidade Rigorosa</strong>
                    <p>Planejamento prévio de itinerários para que seu embarque e desembarque ocorram sempre no horário combinado.</p>
                  </div>
                </div>
                <div class="about-value-item">
                  <span class="about-check-icon" aria-hidden="true">✓</span>
                  <div>
                    <strong>Conforto e Frota Moderna</strong>
                    <p>Vans higienizadas, equipadas com ar-condicionado de alta potência, assentos reclináveis e espaço adequado para malas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-story-visual">
              <div class="about-img-card">
                <img 
                  src="/wp-content/uploads/2025/03/Ilustracao-de-uma-van-em-Sao-Paulo.webp" 
                  alt="Ilustração de uma van em São Paulo" 
                  class="about-img" 
                  loading="lazy"
                  width="480"
                  height="340"
                />
                <div class="about-img-tag">
                  <span class="about-img-badge">✨ Tradição e Confiança desde 2014</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Nossos Serviços -->
        <section class="about-services-section">
          <div class="about-section-header">
            <span class="badge-pill">Nossas Soluções</span>
            <h2 class="about-section-title">Serviços Especializados para sua Demanda</h2>
            <p class="about-section-sub">Atendimento flexível com condutores experientes para empresas, famílias e grupos.</p>
          </div>
          <div class="about-services-grid">
            <div class="about-service-card">
              <div class="service-card-icon">🏢</div>
              <h3>Transporte Corporativo</h3>
              <p>Deslocamento executivo para feiras, congressos, visitas técnicas e transporte contínuo de colaboradores.</p>
            </div>
            <div class="about-service-card">
              <div class="service-card-icon">🌴</div>
              <h3>Turismo e Lazer</h3>
              <p>Viagens em grupo, passeios turísticos na capital paulista e viagens relaxantes para o litoral e interior.</p>
            </div>
            <div class="about-service-card">
              <div class="service-card-icon">✈️</div>
              <h3>Transfers e Aeroportos</h3>
              <p>Receptivos pontuais nos aeroportos de Guarulhos (GRU), Congonhas (CGH) e Viracopos (VCP).</p>
            </div>
            <div class="about-service-card">
              <div class="service-card-icon">🎉</div>
              <h3>Eventos e Festas</h3>
              <p>Transporte privativo para casamentos, formaturas, festivais e shows com retorno seguro e tranquilo para todos.</p>
            </div>
          </div>
        </section>

        <!-- Por que Escolher a Aluguel de Van SP (O Que Você Ganha) -->
        <section class="about-diff-section">
          <div class="about-section-header">
            <span class="badge-pill">Diferenciais</span>
            <h2 class="about-section-title">O Que Você Ganha Escolhendo a Aluguel de Van SP</h2>
            <p class="about-section-sub">Priorizamos a segurança e a comodidade dos nossos clientes para garantir viagens sem preocupações.</p>
          </div>
          <div class="about-diff-grid">
            <div class="about-diff-card">
              <div class="diff-card-badge">12 Anos</div>
              <h3>Experiência Comprovada</h3>
              <p>Com 12 anos de atuação no mercado de transporte, temos o conhecimento e a expertise necessários para garantir um serviço de qualidade e lidar com diferentes demandas.</p>
            </div>
            <div class="about-diff-card">
              <div class="diff-card-badge">+1.500 Clientes</div>
              <h3>Clientes Satisfeitos</h3>
              <p>Mais de 1500 clientes satisfeitos atestam a qualidade e confiabilidade dos nossos serviços. As avaliações positivas nos motivam a aprimorar constantemente cada trajeto.</p>
            </div>
            <div class="about-diff-card">
              <div class="diff-card-badge">Exclusivo</div>
              <h3>Serviço Personalizado e Confiável</h3>
              <p>Oferecemos um atendimento personalizado, adaptado às suas necessidades. Nossos motoristas são profissionais experientes, comprometidos com conforto e discrição.</p>
            </div>
          </div>
        </section>

        <!-- Banner CTA Final -->
        <section class="about-cta-banner">
          <div class="about-cta-inner">
            <h3>Pronto para planejar sua viagem com total tranquilidade?</h3>
            <p>Entre em contato conosco e receba uma cotação sob medida em poucos minutos sem qualquer compromisso.</p>
            <a href="${ctaButtonHref}" target="_blank" rel="noopener noreferrer" class="btn btn-lg btn-chamativo">
              Solicitar orçamento no WhatsApp
            </a>
          </div>
        </section>
      </div>
    `;

    if ($('body').length) {
      $('body').html(aboutHtml);
    } else {
      $.root().html(aboutHtml);
    }
  }

  // 7. Moderniza a página de Contato (/contato/) com central de atendimento, canais diretos e mapa
  if (pagePath === '/contato/') {
    const ctaButtonHref = getButtonHrefForPage(pagePath);
    const contactHtml = `
      <div class="contact-page-wrap">
        <!-- Cabeçalho de Atendimento -->
        <div class="contact-header-card">
          <span class="badge-pill">Central de Atendimento 24h</span>
          <h2 class="contact-header-title">Fale com a Aluguel de Van SP</h2>
          <p class="contact-header-sub">
            Estamos prontos para atender você a qualquer momento. Tire dúvidas, consulte itinerários e solicite seu orçamento rápido e sem compromisso.
          </p>
        </div>

        <!-- Grade Principal: Canais de Contato + Formulário Rápido -->
        <div class="contact-main-grid">
          <!-- Coluna 1: Canais Diretos -->
          <div class="contact-cards-col">
            <!-- Card WhatsApp Destaque -->
            <div class="contact-channel-card contact-channel-whatsapp">
              <div class="channel-status-pill">
                <span class="status-dot"></span> Atendimento 24h • Resposta em minutos
              </div>
              <div class="channel-body">
                <div class="channel-icon-wrap channel-icon-whatsapp">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div class="channel-info">
                  <span class="channel-label">WhatsApp Oficial</span>
                  <span class="channel-value">(11) 97541-3120</span>
                  <p class="channel-desc">Envie sua mensagem e receba o orçamento personalizado direto no seu WhatsApp.</p>
                </div>
              </div>
              <a href="${ctaButtonHref}" target="_blank" rel="noopener noreferrer" class="channel-action-whatsapp">
                Chamar no WhatsApp agora
              </a>
            </div>

            <!-- Ligação Telefônica -->
            <div class="contact-channel-card">
              <div class="channel-body">
                <div class="channel-icon-wrap">📞</div>
                <div class="channel-info">
                  <span class="channel-label">Ligação Telefônica</span>
                  <span class="channel-value">(11) 97541-3120</span>
                  <p class="channel-desc">Central de atendimento por voz para reservas e informações imediatas.</p>
                </div>
              </div>
              <a href="tel:+5511975413120" class="channel-action-outline">
                Ligar para (11) 97541-3120
              </a>
            </div>

            <!-- E-mail Corporativo -->
            <div class="contact-channel-card">
              <div class="channel-body">
                <div class="channel-icon-wrap">✉️</div>
                <div class="channel-info">
                  <span class="channel-label">E-mail Corporativo</span>
                  <span class="channel-value">contato@alugueldevansp.com</span>
                  <p class="channel-desc">Para solicitações formais de empresas, licitações, faturamento e propostas.</p>
                </div>
              </div>
              <a href="mailto:contato@alugueldevansp.com" class="channel-action-outline">
                Enviar e-mail
              </a>
            </div>

            <!-- Base Operacional -->
            <div class="contact-channel-card">
              <div class="channel-body">
                <div class="channel-icon-wrap">📍</div>
                <div class="channel-info">
                  <span class="channel-label">Base Operacional</span>
                  <span class="channel-value">Av. Magalhães de Castro, 12.000</span>
                  <p class="channel-desc">Cidade Jardim, São Paulo – SP, CEP 05502-001</p>
                </div>
              </div>
              <a href="https://maps.google.com/?q=Av.+Magalh%C3%A3es+de+Castro,+12000+-+Cidade+Jardim,+S%C3%A3o+Paulo+-+SP" target="_blank" rel="noopener noreferrer" class="channel-action-outline">
                Ver no Google Maps
              </a>
            </div>
          </div>

          <!-- Coluna 2: Formulário / Cotação Rápida WhatsApp -->
          <div class="contact-form-col">
            <div class="contact-quote-card">
              <div class="quote-card-header">
                <span class="badge-pill">Cotação Rápida</span>
                <h3>Simule seu Orçamento</h3>
                <p>Preencha os campos abaixo para abrir uma conversa no WhatsApp com os detalhes já preenchidos:</p>
              </div>
              <form class="contact-quick-form" id="contactQuickForm" onsubmit="event.preventDefault(); window.sendQuickContactQuote();">
                <div class="form-group">
                  <label for="contactQuoteName">Seu Nome / Empresa *</label>
                  <input type="text" id="contactQuoteName" class="form-input" placeholder="Ex: Maria Oliveira" required />
                </div>
                <div class="form-group">
                  <label for="contactQuoteService">Tipo de Serviço *</label>
                  <select id="contactQuoteService" class="form-select" required>
                    <option value="Aluguel de van com motorista">Aluguel de van com motorista</option>
                    <option value="Aluguel de van para viagem">Aluguel de van para viagem</option>
                    <option value="Aluguel de van sem motorista">Aluguel de van sem motorista</option>
                    <option value="Transporte Corporativo">Transporte Corporativo</option>
                    <option value="Transfer Aeroporto (GRU/CGH/VCP)">Transfer Aeroporto</option>
                    <option value="Eventos, Casamentos e Shows">Eventos e Casamentos</option>
                    <option value="Mini Van (7 lugares)">Mini Van (7 lugares)</option>
                    <option value="Van de Carga ou Furgão">Van de Carga / Furgão</option>
                  </select>
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label for="contactQuoteOrigin">Ponto de Partida *</label>
                    <input type="text" id="contactQuoteOrigin" class="form-input" placeholder="Ex: Av. Paulista, SP" required />
                  </div>
                  <div class="form-group">
                    <label for="contactQuoteDest">Destino *</label>
                    <input type="text" id="contactQuoteDest" class="form-input" placeholder="Ex: Guarujá, Campinas..." required />
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label for="contactQuotePass">Nº de Passageiros</label>
                    <input type="text" id="contactQuotePass" class="form-input" placeholder="Ex: 12 pessoas" />
                  </div>
                  <div class="form-group">
                    <label for="contactQuoteDate">Data Prevista</label>
                    <input type="date" id="contactQuoteDate" class="form-input" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="contactQuoteNotes">Observações adicionais (opcional)</label>
                  <textarea id="contactQuoteNotes" class="form-textarea" rows="2" placeholder="Ex: Horário de ida e volta, paradas extras..."></textarea>
                </div>
                <button type="submit" class="btn btn-chamativo btn-block">
                  Solicitar Cotação no WhatsApp
                </button>
                <div class="form-footnote">
                  🔒 Cotação 100% gratuita, sem compromisso e com resposta ágil.
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Mapa de Localização Interativo -->
        <section class="contact-map-section">
          <div class="contact-map-header">
            <span class="badge-pill">Localização Estratégica</span>
            <h3>Nossa Base em São Paulo</h3>
            <p>Localização privilegiada na Marginal Pinheiros (Cidade Jardim) com acesso rápido a todas as regiões da Grande São Paulo e principais rodovias.</p>
          </div>
          <div class="contact-map-wrap">
            <iframe 
              title="Localização Aluguel de Van SP"
              src="https://maps.google.com/maps?q=Av.+Magalh%C3%A3es+de+Castro,+12000+-+Cidade+Jardim,+S%C3%A3o+Paulo+-+SP&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="360" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </section>

        <!-- Perguntas Frequentes sobre Contato -->
        <section class="contact-faq-section">
          <div class="contact-faq-header">
            <span class="badge-pill">Dúvidas Frequentes</span>
            <h3>Perguntas Rápidas sobre Atendimento e Reservas</h3>
          </div>
          <div class="contact-faq-grid">
            <div class="contact-faq-card">
              <h4>Como funciona a solicitação de orçamento?</h4>
              <p>É muito simples: basta clicar no botão de WhatsApp ou preencher os dados acima. Nossa equipe calcula a rota e envia o valor detalhado em poucos minutos.</p>
            </div>
            <div class="contact-faq-card">
              <h4>A empresa atende fora do horário comercial?</h4>
              <p>Sim! Nossa central e equipe de motoristas operam 24 horas por dia, 7 dias por semana, inclusive em feriados e finais de semana.</p>
            </div>
            <div class="contact-faq-card contact-faq-card--center">
              <h4>Qual a antecedência recomendada para agendar?</h4>
              <p>Quanto antes você reservar, melhor para garantir a disponibilidade do veículo exato que você precisa. Para finais de semana e feriados, sugerimos ao menos 3 a 5 dias de antecedência.</p>
            </div>
          </div>
        </section>
      </div>

      <script is:inline>
        window.sendQuickContactQuote = function() {
          var name = document.getElementById('contactQuoteName') ? document.getElementById('contactQuoteName').value : '';
          var service = document.getElementById('contactQuoteService') ? document.getElementById('contactQuoteService').value : 'Aluguel de van';
          var origin = document.getElementById('contactQuoteOrigin') ? document.getElementById('contactQuoteOrigin').value : '';
          var dest = document.getElementById('contactQuoteDest') ? document.getElementById('contactQuoteDest').value : '';
          var pass = document.getElementById('contactQuotePass') ? document.getElementById('contactQuotePass').value : '';
          var date = document.getElementById('contactQuoteDate') ? document.getElementById('contactQuoteDate').value : '';
          var notes = document.getElementById('contactQuoteNotes') ? document.getElementById('contactQuoteNotes').value : '';

          var text = 'Olá! Gostaria de um orçamento no Aluguel de Van SP:';
          if (name) text += '\\n• Nome: ' + name;
          text += '\\n• Serviço: ' + service;
          if (origin) text += '\\n• Origem: ' + origin;
          if (dest) text += '\\n• Destino: ' + dest;
          if (pass) text += '\\n• Passageiros: ' + pass;
          if (date) text += '\\n• Data: ' + date;
          if (notes) text += '\\n• Obs: ' + notes;

          var url = 'https://wa.me/5511975413120?text=' + encodeURIComponent(text);
          window.open(url, '_blank');
        };
      </script>
    `;

    if ($('body').length) {
      $('body').html(contactHtml);
    } else {
      $.root().html(contactHtml);
    }
  }

  // Otimização de Imagens para Performance e LCP
  const allImages = $('img');
  if (allImages.length > 0) {
    const firstImg = allImages.first();
    firstImg.removeAttr('loading');
    firstImg.attr('fetchpriority', 'high');
    firstImg.attr('decoding', 'async');

    allImages.slice(1).each(function () {
      const img = $(this);
      if (!img.attr('loading')) img.attr('loading', 'lazy');
      if (!img.attr('decoding')) img.attr('decoding', 'async');
    });
  }

  return $('body').length ? $('body').html() : $.html();
}

export function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
}
