// Crawler de migração WordPress -> Astro (Cloudflare Pages)
// Uso:
//   node scripts/crawl.mjs                    -> rastreia tudo (retoma de onde parou)
//   node scripts/crawl.mjs --sample 12        -> amostra espalhada de 12 URLs
//   node scripts/crawl.mjs --only /contato/   -> uma URL específica
//   node scripts/crawl.mjs --refresh          -> reescreve arquivos já existentes
//   node scripts/crawl.mjs --concurrency 8
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ORIGIN = 'https://alugueldevansp.com';
const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'src/data');
const PAGES_DIR = path.join(DATA_DIR, 'pages');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const args = process.argv.slice(2);
const getArg = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : d;
};
const CONC = Number(getArg('concurrency', 6));
const SAMPLE = Number(getArg('sample', 0));
const ONLY = getArg('only', null);
const REFRESH = args.includes('--refresh');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, 'accept-language': 'pt-BR,pt;q=0.9' },
        redirect: 'follow',
        signal: ctrl.signal,
      });
      if (res.status === 404 || res.status === 410) {
        return { status: res.status, url: res.url, text: '' };
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return { status: res.status, url: res.url, text: await res.text() };
    } catch (e) {
      if (i === tries) throw e;
      await sleep(1500 * i);
    } finally {
      clearTimeout(timer);
    }
  }
}

const keyFor = (p) =>
  p === '/' ? '_home' : decodeURIComponent(p).replace(/^\/|\/$/g, '').replace(/\//g, '__');

// ---------- Sitemap ----------
async function collectUrls() {
  const cache = path.join(DATA_DIR, 'urls.json');
  try {
    return JSON.parse(await fs.readFile(cache, 'utf8'));
  } catch {}
  const idx = await get(ORIGIN + '/sitemap_index.xml');
  const maps = [...idx.text.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const m of maps) {
    const r = await get(m);
    const type = (m.match(/\/([a-z-]+)-sitemap\d*\.xml/) || [, 'other'])[1];
    for (const u of r.text.matchAll(
      /<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g,
    )) {
      urls.push({ url: u[1], path: new URL(u[1]).pathname, lastmod: u[2] || null, type, sitemap: m });
    }
    console.log(`sitemap ${m}: ${urls.length} acumuladas`);
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(cache, JSON.stringify(urls, null, 1));
  return urls;
}

// ---------- Limpeza do HTML ----------
const HOST_RE = /^https?:\/\/(www\.)?alugueldevansp\.com/i;
const localize = (u) => (u ? u.replace(HOST_RE, '') || '/' : u);

const CLASS_MAP = {
  'wp-block-columns': 'columns',
  'wp-block-column': 'column',
  'wp-block-image': 'figure-img',
  'wp-block-table': 'table-wrap',
  'wp-block-buttons': 'btn-row',
  'has-text-align-center': 'text-center',
  'has-text-align-right': 'text-right',
  aligncenter: 'aligncenter',
  alignleft: 'alignleft',
  alignright: 'alignright',
  'wp-block-quote': 'quote',
  'wp-block-embed': 'embed',
};

function rewriteSrcset(v) {
  return v
    .split(',')
    .map((p) => {
      const [u, ...rest] = p.trim().split(/\s+/);
      return [localize(u), ...rest].join(' ');
    })
    .join(', ');
}

const FORM_SEL =
  'form, .metform-form-main-wrapper, .mf-form-wrapper, .wpcf7, [class*="mf-main-wrapper"], [id^="mf-response-props"]';

function clean($, root) {
  root.find('script, style, noscript, link, svg.gb-shape, .gb-shape').remove();
  // formulários -> marcador (tratado no template)
  let forms = 0;
  root.find(FORM_SEL).each((_, el) => {
    if ($(el).parents(FORM_SEL).length) return;
    $(el).replaceWith('<div data-lead-form="1"></div>');
    forms++;
  });
  root.find('a, button').each((_, el) => {
    const cls = ($(el).attr('class') || '').split(/\s+/);
    if (
      cls.some((c) => /^gb-(text|button)/.test(c) || c === 'wp-block-button__link' || c === 'button') &&
      el.name === 'a' &&
      $(el).closest('h1,h2,h3,h4,h5,h6,p,li').length === 0
    ) {
      $(el).attr('data-btn', '1');
    }
  });
  root.find('*').each((_, el) => {
    const $el = $(el);
    const classes = ($el.attr('class') || '')
      .split(/\s+/)
      .map((c) => CLASS_MAP[c])
      .filter(Boolean);
    if ($el.attr('data-btn')) classes.push('btn');
    for (const a of Object.keys(el.attribs || {})) {
      if (a.startsWith('data-') && a !== 'data-lead-form') $el.removeAttr(a);
    }
    $el.removeAttr('style').removeAttr('class').removeAttr('decoding').removeAttr('fetchpriority');
    if (classes.length) $el.attr('class', [...new Set(classes)].join(' '));
    for (const a of ['href', 'src', 'poster']) {
      if ($el.attr(a)) $el.attr(a, localize($el.attr(a)));
    }
    if ($el.attr('srcset')) $el.attr('srcset', rewriteSrcset($el.attr('srcset')));
    if (el.name === 'img' && !$el.attr('loading')) $el.attr('loading', 'lazy');
    if (el.name === 'a' && /^https?:/i.test($el.attr('href') || '')) {
      $el.attr('rel', 'noopener');
    }
  });
  // elementos vazios
  root.find('p, div, section').each((_, el) => {
    const $el = $(el);
    if (!$el.children().length && !$el.text().trim() && !$el.attr('data-lead-form') && !$el.attr('src')) {
      $el.remove();
    }
  });
  return { html: root.html().replace(/\u200b/g, '').trim(), forms };
}

function pairs($, sel, attrName) {
  const out = [];
  $(sel).each((_, e) => {
    const k = $(e).attr(attrName);
    const v = $(e).attr('content');
    if (k && v != null) out.push([k, v]);
  });
  return out;
}

function extract($, req, finalUrl) {
  const art = $('main#main article').first();
  const entry = art.find('.entry-content').first();
  const mainEl = $('main#main').first();
  const target = entry.length ? entry : mainEl;
  const { html, forms } = clean($, target.clone());
  const featured = art.find('.featured-image img, .post-image img').first();
  // H1 pode estar no hero (fora do main) ou no próprio conteúdo
  const h1Text = $('h1').first().text().replace(/\u200b/g, '').trim() || null;
  return {
    url: req.url,
    path: req.path,
    type: req.type,
    lastmod: req.lastmod,
    redirectedTo: new URL(finalUrl).pathname !== req.path ? new URL(finalUrl).pathname : null,
    title: $('title').first().text().trim(),
    description: $('meta[name="description"]').attr('content') || null,
    robots: $('meta[name="robots"]').attr('content') || null,
    canonical: $('link[rel="canonical"]').attr('href') || null,
    og: pairs($, 'meta[property^="og:"], meta[property^="article:"]', 'property'),
    twitter: pairs($, 'meta[name^="twitter:"]', 'name'),
    jsonld: $('script[type="application/ld+json"]')
      .map((_, e) => $(e).text().trim())
      .get(),
    h1InContent: target.find('h1').length > 0,
    h1: h1Text,
    featuredImage: featured.length ? localize(featured.attr('src')) : null,
    hasForm: forms > 0,
    mode: entry.length ? 'entry' : 'main',
    html,
    crawledAt: new Date().toISOString(),
  };
}

function extractChrome($) {
  const walk = (ul) =>
    ul
      .children('li')
      .map((_, li) => {
        const a = $(li).children('a').first();
        const sub = $(li).children('ul.sub-menu');
        return {
          label: a.text().trim(),
          href: localize(a.attr('href')),
          children: sub.length ? walk(sub) : [],
        };
      })
      .get();
  const nav = walk($('#menu-cabecalho').first());
  const footerEl = $('footer.site-footer, .site-footer').first();
  const { html: footerHtml } = footerEl.length ? clean($, footerEl.clone()) : { html: '' };
  const cta = $('.menu-bar-items a').first();
  return {
    nav,
    ctaLabel: cta.text().trim() || 'Entrar em contato',
    ctaHref: localize(cta.attr('href')) || '/solicite-um-orcamento',
    footerHtml,
    icons: $('link[rel="icon"], link[rel="apple-touch-icon"]')
      .map((_, e) => ({ rel: $(e).attr('rel'), href: localize($(e).attr('href')), sizes: $(e).attr('sizes') || null }))
      .get(),
    logo: localize($('.site-logo img').attr('src')),
    siteName: 'aluguel de van sp',
  };
}

// ---------- Execução ----------
async function main() {
  await fs.mkdir(PAGES_DIR, { recursive: true });
  let urls = await collectUrls();
  console.log(`Total no sitemap: ${urls.length}`);
  if (ONLY) urls = urls.filter((u) => u.path === ONLY);
  else if (SAMPLE) {
    const step = Math.max(1, Math.floor(urls.length / SAMPLE));
    urls = urls.filter((_, i) => i % step === 0).slice(0, SAMPLE);
    if (!urls.some((u) => u.path === '/')) urls.unshift(...(await collectUrls()).filter((u) => u.path === '/'));
  }

  const errors = [];
  let done = 0;
  let skipped = 0;
  const queue = [...urls];
  const started = Date.now();

  async function worker() {
    while (queue.length) {
      const req = queue.shift();
      const file = path.join(PAGES_DIR, keyFor(req.path) + '.json');
      if (!REFRESH) {
        try {
          await fs.access(file);
          skipped++;
          continue;
        } catch {}
      }
      try {
        const res = await get(req.url);
        if (res.status !== 200) {
          errors.push({ path: req.path, error: 'HTTP ' + res.status });
          continue;
        }
        const $ = cheerio.load(res.text);
        if (req.path === '/') {
          await fs.writeFile(path.join(DATA_DIR, 'site.json'), JSON.stringify(extractChrome($), null, 1));
        }
        const page = extract($, req, res.url);
        await fs.writeFile(file, JSON.stringify(page, null, 1));
      } catch (e) {
        errors.push({ path: req.path, error: String(e.message || e) });
      }
      done++;
      if (done % 25 === 0) {
        const el = (Date.now() - started) / 1000;
        console.log(
          `[${done + skipped}/${urls.length}] ${(done / el).toFixed(2)} pág/s, erros: ${errors.length}`,
        );
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  await fs.writeFile(path.join(ROOT, 'scripts/crawl-errors.json'), JSON.stringify(errors, null, 1));
  console.log(`Concluído. Novos: ${done}, pulados: ${skipped}, erros: ${errors.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
