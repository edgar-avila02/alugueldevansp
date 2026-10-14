import * as cheerio from 'cheerio';

async function main() {
  const url = 'https://alugueldevansp.com/aluguel-de-van/';
  console.log('Fetching', url);
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('--- main#main children ---');
  $('main#main').children().each((_, el) => {
    console.log(el.name, $(el).attr('class') || '', $(el).attr('id') || '');
  });

  console.log('--- #content or .site-content children ---');
  $('#content, .site-content').children().each((_, el) => {
    console.log(el.name, $(el).attr('class') || '', $(el).attr('id') || '');
  });

  console.log('--- elements between main and footer ---');
  $('footer').prevAll().slice(0, 8).each((_, el) => {
    console.log(el.name, $(el).attr('class') || '', $(el).attr('id') || '');
  });

  console.log('--- Search for strings in full HTML ---');
  for (const s of [
    'clientes',
    'dizendo',
    'parceiros',
    'EMTU',
    'WhatsApp',
    'precisa saber',
    'Como fazer',
    'benefícios',
    'veículos disponíveis',
    'Sprinter',
  ]) {
    console.log(`"${s}": ${html.includes(s)}`);
  }
}

main().catch(console.error);
