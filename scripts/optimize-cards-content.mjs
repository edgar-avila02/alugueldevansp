import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const dir = 'src/data/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let updatedCount = 0;

// Dicionário de otimização por título
const OPTIMIZED_MAP = {
  // 1. Viagem (o do print do usuário)
  'Praticidade e união do grupo': (orig, city) => 
    city 
      ? `Viaje com todo o grupo reunido em um só veículo em ${city}, garantindo integração, facilidade logística e horários alinhados, sem atrasos.`
      : `Viaje com todo o grupo reunido em um só veículo, garantindo integração, facilidade logística e horários alinhados, sem atrasos ou desencontros.`,
  
  'Ideal para diferentes tipos de viagem': (orig, city) =>
    city
      ? `Solução versátil e confortável em ${city} para passeios em família, turismo, eventos corporativos, traslados e excursões.`
      : `Solução versátil e confortável para passeios em família, turismo, eventos corporativos, traslados, shows e excursões.`,
  
  'Liberdade para montar seu roteiro': (orig, city) =>
    city
      ? `Autonomia total para definir horários, rotas e paradas em ${city} no seu ritmo, com máxima flexibilidade e tranquilidade.`
      : `Autonomia total para definir horários, rotas e paradas no seu próprio ritmo, aproveitando cada momento com liberdade e tranquilidade.`,

  // 2. Mini van 7 lugares
  'Ideal para famílias ou pequenos grupos': (orig, city) =>
    `Acomoda até 7 passageiros com conforto, sendo ideal para famílias, passeios e traslados sem precisar dividir em vários carros.`,
  'Mais conforto e espaço interno': (orig, city) =>
    `Bancos reclináveis, ar-condicionado eficiente e porta-malas espaçoso para uma viagem leve e agradável até em trajetos longos.`,
  'Economia e agilidade': (orig, city) =>
    `Mais econômico do que abastecer e pagar pedágio de dois veículos, além da facilidade para manobrar e estacionar em centros urbanos.`,

  // 3. Mini van
  'Versatilidade para diferentes tipos de viagem': (orig, city) =>
    `Veículo sob medida para passeios familiares, traslados para aeroportos, city tours e eventos com bagagens bem acomodadas.`,
  'Economia com conforto': (orig, city) =>
    `Excelente equilíbrio entre custo e comodidade para pequenos grupos, dividindo despesas de combustível e pedágios.`,
  'Agilidade no trânsito e facilidade para estacionar': (orig, city) =>
    `Praticidade de um carro compacto com o espaço de um veículo de grupo, facilitando o trânsito urbano e o estacionamento.`,

  // 4. Van 12 lugares
  'Espaço ideal para grupos médios com conforto': (orig, city) =>
    `Perfeita para famílias, pequenos grupos de turismo ou equipes de trabalho, com assentos individuais e circulação interna facilitada.`,
  'Conforto superior em longas distâncias': (orig, city) =>
    `Poltronas confortáveis, ar-condicionado de alta potência e isolamento acústico para trajetos longos sem cansaço excessivo.`,
  'Capacidade para bagagens e equipamentos': (orig, city) =>
    `Amplo compartimento para malas grandes, instrumentos ou materiais de evento, preservando o conforto dos passageiros.`,

  // 5. Van 15 lugares
  'Ideal para grupos grandes, com mais conforto': (orig, city) =>
    `Transporte até 15 passageiros com assentos reclináveis, espaço generoso e climatização completa em um único veículo.`,
  'Logística prática e mais organização': (orig, city) =>
    `Mantenha o grupo pontual e reunido em viagens, excursões ou eventos corporativos, evitando atrasos e desencontros.`,
  'Versatilidade para diversos tipos de viagem': (orig, city) =>
    `Atende com excelência casamentos, confraternizações, turismo religioso e traslados para shows com segurança e pontualidade.`,

  // 6. Van 18 lugares
  'Capacidade máxima para grupos grandes': (orig, city) =>
    `A melhor opção para grandes grupos em excursões, eventos e viagens escolares, mantendo todos integrados do início ao fim.`,
  'Economia no transporte coletivo': (orig, city) =>
    `Custo por passageiro muito mais vantajoso do que alugar vários carros, dividindo combustível, pedágios e estacionamentos.`,
  'Logística eficiente e mais conforto': (orig, city) =>
    `Coordenação simplificada de saída, paradas e horários com ar-condicionado duplo, poltronas acolchoadas e porta-malas amplo.`,

  // 7. Van com motorista
  'Zero preocupações com direção': (orig, city) =>
    `Motoristas profissionais experientes que cuidam de rotas, trânsito e estacionamento para você relaxar e curtir a viagem.`,
  'Mais segurança e experiência na estrada': (orig, city) =>
    `Condutores treinados em direção defensiva, habilitados e pontuais, garantindo uma viagem tranquila e segura para todos.`,
  'Ideal para grupos, eventos e turismo': (orig, city) =>
    `Logística perfeita para eventos sociais, corporativos e turismo, mantendo o grupo pontual e sem preocupações ao volante.`,

  // 8. Furgão e Carga
  'Excelente capacidade de carga com segurança': (orig, city) =>
    `Compartimento fechado e espaçoso para transportar caixas, mercadorias e equipamentos com total proteção contra impactos e clima.`,
  'Mais agilidade em áreas urbanas': (orig, city) =>
    `Dimensões compactas que facilitam a circulação e estacionamento em centros urbanos onde caminhões possuem restrições.`,
  'Economia para serviços pontuais ou sazonais': (orig, city) =>
    `Elimine despesas fixas com IPVA, seguro e manutenção, alugando apenas no período de maior demanda da sua operação.`,
  'Redução de custos fixos': (orig, city) =>
    `Evite gastos com manutenção, seguro, IPVA e depreciação pagando apenas pelo tempo de uso da sua demanda.`,
  'Flexibilidade na locação': (orig, city) =>
    `Alugue por dia, semana ou mês, conforme sua necessidade para demandas temporárias, picos de vendas ou entregas sazonais.`,
  'Espaço ideal para mercadorias': (orig, city) =>
    `Amplo compartimento de carga para transportar mercadorias, caixas, móveis ou equipamentos com segurança e organização.`,

  // 9. Passeio
  'Mais conforto': (orig, city) =>
    `Poltronas acolchoadas, ar-condicionado potente e amplo espaço interno, proporcionando uma viagem agradável para todo o grupo.`,
  'Economia para o grupo': (orig, city) =>
    `Divisão prática dos custos de locação, combustível e pedágios entre todos os passageiros, tornando a viagem muito mais acessível.`,
  'Mais organização': (orig, city) =>
    `Embarque e desembarque integrados para manter todos os passageiros juntos, evitando desencontros e atrasos no roteiro.`,

  // 10. Sem motorista
  'Liberdade e flexibilidade': (orig, city) =>
    `Autonomia total sobre o roteiro, horários e paradas para viajar de forma independente e com o seu próprio ritmo.`,
  'Economia extra no orçamento': (orig, city) =>
    `Sem custo de motorista profissional, tornando a locação ainda mais acessível para grupos com condutor habilitado.`,
  'Mais privacidade para o grupo': (orig, city) =>
    `Ambiente 100% privativo e descontraído para curtir a estrada exclusivamente com a família, amigos ou equipe.`,

  // 11. Aluguel de van (geral)
  'Economia para grupos': (orig, city) =>
    `Viaje junto e divida os custos de locação, combustível e pedágios, garantindo uma opção muito mais econômica do que vários carros.`,
  'Mais conforto e espaço': (orig, city) =>
    `Amplo espaço interno, poltronas reclináveis, ar-condicionado potente e porta-malas generoso para uma viagem sem aperto.`,
  'Segurança': (orig, city) =>
    `Veículos revisados e higienizados com opção de motorista profissional para uma viagem tranquila, pontual e segura.`,

  // 12. Casamentos
  'Pontualidade no evento': (orig, city) =>
    `Todos os convidados chegam juntos e no horário combinado diretamente na cerimônia ou recepção, evitando atrasos e desencontros.`,
  'Conforto para os convidados': (orig, city) =>
    city
      ? `Alugar uma van para casamento em ${city} garante uma viagem muito mais confortável e tranquila para todos os seus convidados.`
      : `Transporte climatizado e espaçoso para que amigos e padrinhos aproveitem a celebração com total tranquilidade.`,
  'Economia para grupos de convidados': (orig, city) =>
    `Excelente relação custo-benefício compartilhado entre famílias e convidados, superando múltiplos carros ou aplicativos.`
};

for (const file of files) {
  const filePath = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let html = json.html || '';

  // Verifica se o arquivo tem algum dos títulos
  let hasAnyTitle = false;
  for (const title of Object.keys(OPTIMIZED_MAP)) {
    if (html.includes(title)) {
      hasAnyTitle = true;
      break;
    }
  }

  if (!hasAnyTitle) continue;

  // Extrair possível cidade do nome do arquivo ou do h1
  // Ex: aluguel-de-van-para-casamento-adolfo.json -> Adolfo
  let detectedCity = null;
  const matchCityInH2 = html.match(/em ([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[a-z]{1,3})?(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)*)/);
  if (matchCityInH2 && matchCityInH2[1] && !['SP', 'São Paulo', 'Fevereiro', 'alta temporada'].includes(matchCityInH2[1])) {
    detectedCity = matchCityInH2[1].trim();
  }

  const $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });
  let modified = false;

  $('h2, h3').each((_, el) => {
    const headingText = $(el).text().trim();
    if (OPTIMIZED_MAP[headingText]) {
      // Encontrar o parágrafo associado
      // O parágrafo pode estar logo após o heading, ou no irmão do pai
      let p = $(el).next('p');
      if (!p.length) {
        p = $(el).parent().find('p').first();
      }
      if (!p.length) {
        p = $(el).parent().next().find('p').first();
      }
      if (!p.length) {
        p = $(el).closest('div').find('p').first();
      }

      if (p.length) {
        const origText = p.text().trim();
        // Verificar se havia cidade mencionada no parágrafo original
        let city = detectedCity;
        const matchCityInP = origText.match(/em ([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)*)/);
        if (matchCityInP && matchCityInP[1]) {
          city = matchCityInP[1].trim();
        }

        const newText = OPTIMIZED_MAP[headingText](origText, city);
        if (newText && newText !== origText) {
          p.text(newText);
          modified = true;
        }
      }
    }
  });

  if (modified) {
    // Pegar o body html gerado pelo cheerio
    const newHtml = $('body').html() || $.html();
    json.html = newHtml;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 1), 'utf8');
    updatedCount++;
  }
}

console.log(`Successfully updated ${updatedCount} pages with optimized harmonic card texts!`);
