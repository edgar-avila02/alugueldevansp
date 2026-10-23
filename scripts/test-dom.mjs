import * as cheerio from 'cheerio';

async function testUrl(path) {
  const res = await fetch('http://localhost:4321' + path);
  const html = await res.text();
  const $ = cheerio.load(html);
  const badButtons = [];
  $('a.btn, a.btn-chamativo, a.header-cta, a.sticky-cta, a.service-hero-whatsapp-btn, a.btn-whatsapp-cta').each((_, el) => {
    const href = $(el).attr('href');
    if (href !== 'https://alugueldevansp.com/aluguel-de-van-12-lugares-1') {
      badButtons.push(href);
    }
  });
  console.log(path, '-> Botões fora do padrão:', badButtons.length, badButtons);
}

async function main() {
  await testUrl('/aluguel-de-van-12-lugares/guarulhos/aeroporto-de-guarulhos/');
  await testUrl('/aluguel-de-van-12-lugares/guarulhos/centro/');
  await testUrl('/aluguel-de-van-12-lugares/guarulhos/maia/');
  await testUrl('/aluguel-de-van-12-lugares/guarulhos/vila-augusta/');
  await testUrl('/aluguel-de-van-12-lugares-guarulhos/');
}

main().catch(console.error);
