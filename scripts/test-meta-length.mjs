import { DEFAULT_BAIRROS_RAW, buildBairrosList } from './generate-guarulhos-bairros.mjs';

function getOptimizedMeta(bairroName, serviceName = 'Aluguel de Van') {
  const isAeroporto = /aeroporto/i.test(bairroName);
  const prep = isAeroporto ? 'no' : (/^(jardim|morro|porto)/i.test(bairroName) ? 'no' : 'em');
  
  // Title
  let title = isAeroporto
    ? `${serviceName} no ${bairroName} | Orçamento Rápido SP`
    : `${serviceName} ${prep} ${bairroName}, Guarulhos | Orçamento SP`;
  
  if (title.length > 60) {
    title = `${serviceName} ${prep} ${bairroName}, Guarulhos | Orçamento`;
  }
  if (title.length > 60) {
    title = `${serviceName} ${prep} ${bairroName} | Guarulhos SP`;
  }

  // Description
  let desc = '';
  if (isAeroporto) {
    desc = `Aluguel de van no ${bairroName} para viagens, eventos e transfers executivos. Veículos modernos com motorista e pontualidade. Peça seu orçamento gratuito!`;
  } else {
    desc = `Aluguel de van ${prep} ${bairroName}, Guarulhos com motorista para viagens, eventos e transfers. Veículos novos e pontualidade. Peça seu orçamento gratuito!`;
    if (desc.length > 158) {
      desc = `Aluguel de van ${prep} ${bairroName}, Guarulhos para viagens e eventos corporativos. Veículos modernos e seguros com motorista. Peça seu orçamento gratuito!`;
    }
    if (desc.length > 158) {
      desc = `Aluguel de van ${prep} ${bairroName}, Guarulhos para viagens e eventos. Veículos modernos com motorista e segurança. Peça seu orçamento gratuito!`;
    }
  }

  return { title, desc, titleLen: title.length, descLen: desc.length };
}

const bairros = buildBairrosList(DEFAULT_BAIRROS_RAW);
console.log('Resultados para os 43 bairros:');
let anyTitleExceeded = false;
let anyDescExceeded = false;

for (const b of bairros) {
  const meta = getOptimizedMeta(b.name);
  if (meta.titleLen > 60 || meta.titleLen < 45) anyTitleExceeded = true;
  if (meta.descLen > 160 || meta.descLen < 140) anyDescExceeded = true;
  console.log(`[${b.name}] Title (${meta.titleLen}): "${meta.title}"`);
  console.log(`         Desc  (${meta.descLen}): "${meta.desc}"`);
}

console.log('\nAlgum título fora da faixa (45-60)?', anyTitleExceeded);
console.log('Alguma descrição fora da faixa (140-160)?', anyDescExceeded);
