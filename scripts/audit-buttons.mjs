import * as cheerio from 'cheerio';
import { DEFAULT_BAIRROS_RAW, buildBairrosList } from './generate-guarulhos-12-lugares.mjs';

async function main() {
  const bairros = buildBairrosList(DEFAULT_BAIRROS_RAW);
  let totalBadButtons = 0;
  let checkedPages = 0;

  for (const b of bairros) {
    const path = `/aluguel-de-van-12-lugares/guarulhos/${b.slug}/`;
    const res = await fetch('http://localhost:4321' + path);
    const html = await res.text();
    const $ = cheerio.load(html);

    $('a.btn, a.btn-chamativo, a.header-cta, a.sticky-cta, a.service-hero-whatsapp-btn, a.btn-whatsapp-cta').each((_, el) => {
      const href = $(el).attr('href');
      if (href !== 'https://alugueldevansp.com/aluguel-de-van-12-lugares-1') {
        console.log(`[AVISO] ${path} -> Botão com href incorreto: ${href}`);
        totalBadButtons++;
      }
    });

    // Confirma que os pills de bairros NÃO foram afetados e mantêm link para os respectivos bairros
    const pillCount = $('.bairro-pill-link').length;
    if (pillCount !== 43) {
      console.log(`[AVISO PILLS] ${path} -> Pills count: ${pillCount}`);
    }

    checkedPages++;
  }

  console.log(`AUDITORIA TOTAL: ${checkedPages} páginas verificadas. Botões com link incorreto: ${totalBadButtons}.`);
}

main().catch(console.error);
