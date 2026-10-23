import http from 'http';

http.get('http://localhost:4321/teste-pagina-12-lugares/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    console.log('TITLE:', titleMatch ? titleMatch[1] : 'NOT FOUND');
    const h2s = [...data.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('H2s:', JSON.stringify(h2s, null, 2));
    const sections = [...data.matchAll(/<section[^>]*class="([^"]+)"[^>]*>/g)].map(m => m[1]);
    console.log('SECTIONS:', JSON.stringify(sections, null, 2));
  });
});
