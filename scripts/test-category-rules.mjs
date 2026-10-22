import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

// Função para identificar a categoria exata da página
export function getPageCategory(slug, h1 = '') {
  const s = slug.toLowerCase();
  
  if (s === 'home' || s === '_home' || s === '') return 'home';
  if (s === 'blog') return 'blog';
  if (s === 'cases') return 'cases';
  if (s === 'contato') return 'contato';
  if (s === 'duvidas') return 'duvidas';
  if (s === 'equipe') return 'equipe';
  if (s === 'perguntas-frequentes') return 'perguntas-frequentes';
  if (s === 'politica-de-privacidade-de-dados') return 'politica';
  if (s === 'quanto-custa-o-aluguel-de-uma-van') return 'quanto-custa';
  if (s === 'servicos') return 'servicos';
  if (s === 'sobre-nos') return 'sobre-nos';
  if (s === 'termos-de-servicos') return 'termos';
  if (s === 'van-tem-quantos-lugares') return 'quantos-lugares';

  // Categorias específicas ordenadas da mais longa/específica para a mais geral
  if (s.startsWith('aluguel-de-van-sem-motorista')) return 'sem-motorista';
  if (s.startsWith('aluguel-de-van-com-motorista')) return 'com-motorista';
  if (s.startsWith('aluguel-de-van-para-viagem')) return 'viagem';
  if (s.startsWith('aluguel-de-mini-van-7-lugares') || s.startsWith('aluguel-de-minivan-7-lugares')) return 'minivan-7-lugares';
  if (s.startsWith('aluguel-de-mini-van') || s.startsWith('aluguel-de-minivan')) return 'minivan';
  if (s.startsWith('aluguel-de-van-12-lugares')) return '12-lugares';
  if (s.startsWith('aluguel-de-van-15-lugares')) return '15-lugares';
  if (s.startsWith('aluguel-de-van-18-lugares')) return '18-lugares';
  if (s.startsWith('aluguel-de-van-de-carga')) return 'carga';
  if (s.startsWith('aluguel-de-van-furgao')) return 'furgao';
  if (s.startsWith('aluguel-de-van-para-passeio')) return 'passeio';
  if (s.startsWith('aluguel-de-van-para-praias')) return 'praias';
  if (s.startsWith('aluguel-de-van-para-casamento')) return 'casamento';
  
  // Se for aluguel de van normal (inclui aluguel-de-van-em-* e aluguel-de-van-*)
  if (s.startsWith('aluguel-de-van')) return 'van-normal';

  return 'outros';
}

// Extrai o nome limpo do local a partir do H1 ou slug
export function extractLocationName(h1, slug) {
  if (!h1) return '';
  // Limpa prefixos comuns do H1
  let loc = h1
    .replace(/^aluguel de vans? sem motorista (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? com motorista (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para viagens? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:com )?7 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de mini ?vans? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?12 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?15 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:com )?18 lugares (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? de carga (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? furgão (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para passeios? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para praias? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? para casamentos? (?:em |no |na |de )?/i, '')
    .replace(/^aluguel de vans? (?:em |no |na |de )?/i, '')
    .trim();

  // Se o resultado for igual ao início ou vazio
  if (!loc || loc.toLowerCase() === 'aluguel de van' || loc.toLowerCase() === 'serviços') {
    return '';
  }
  return loc;
}

console.log('Testando funções de mapeamento...');
console.log('sem-motorista:', getPageCategory('aluguel-de-van-sem-motorista-agua-rasa'));
console.log('com-motorista:', getPageCategory('aluguel-de-van-com-motorista-campinas'));
console.log('carga:', getPageCategory('aluguel-de-van-de-carga-agua-rasa'));
console.log('normal:', getPageCategory('aluguel-de-van-jandira'));
console.log('normal em:', getPageCategory('aluguel-de-van-em-campinas'));
console.log('viagem:', getPageCategory('aluguel-de-van-para-viagem-santos'));
console.log('15 lugares:', getPageCategory('aluguel-de-van-15-lugares-guarulhos'));
