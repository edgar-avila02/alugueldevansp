import * as cheerio from 'cheerio';

async function testUrl(url) {
  console.log(`\nTestando: ${url}`);
  const res = await fetch(url);
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('Title:', $('title').text());
  console.log('H1:', $('h1').text());
  console.log('Has Hero Card (.service-hero-card):', $('.service-hero-card').length > 0);
  console.log('Has Reasons (.section-service-reasons):', $('.section-service-reasons').length > 0);
  console.log('Has Tips (.section-service-tips):', $('.section-service-tips').length > 0);
  console.log('Has Bairros Grid (.bairros-local-section):', $('.bairros-local-section').length > 0);
  console.log('Total Bairros links:', $('.bairros-local-grid a').length);
  console.log('Has Lead Form (.section-service-lead):', $('.section-service-lead').length > 0);
  console.log('Has Testimonials (.section-testimonials):', $('.section-testimonials').length > 0);
  console.log('Has Know/FAQ (.section-know):', $('.section-know').length > 0);
}

await testUrl('http://localhost:4321/aluguel-de-van/guarulhos/vila-augusta/');
await testUrl('http://localhost:4321/aluguel-de-van/guarulhos/aeroporto-de-guarulhos/');
await testUrl('http://localhost:4321/aluguel-de-van-em-guarulhos/');
