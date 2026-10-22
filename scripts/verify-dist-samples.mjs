import fs from 'node:fs';

const pages = [
  'dist/aluguel-de-van-15-lugares-bananal/index.html',
  'dist/aluguel-de-van-sem-motorista-agua-rasa/index.html',
  'dist/aluguel-de-van-de-carga-agua-rasa/index.html',
  'dist/aluguel-de-van-para-viagem-santos/index.html',
  'dist/aluguel-de-van-com-motorista-moema/index.html',
  'dist/aluguel-de-van-em-agua-rasa-sp/index.html'
];

for (const p of pages) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

    console.log(`=== ${p} ===`);
    console.log(`Title (${titleMatch ? titleMatch[1].length : 0} chars): ${titleMatch ? titleMatch[1] : 'N/A'}`);
    console.log(`Desc (${descMatch ? descMatch[1].length : 0} chars): ${descMatch ? descMatch[1] : 'N/A'}`);
    console.log(`Desc tem reticências?: ${descMatch && descMatch[1].includes('...') ? 'SIM' : 'NÃO'}`);
    console.log(`OG Title: ${ogTitle ? ogTitle[1] : 'N/A'}`);
  } else {
    console.log(`File not found: ${p}`);
  }
}
