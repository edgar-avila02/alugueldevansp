# Rascunhos de Layouts UX para Páginas de Serviço

Esta pasta guarda os modelos e rascunhos de design desenvolvidos para modernizar as páginas de serviço do site **Aluguel de Van SP**.

---

## 📂 Arquivos Disponíveis

1. **`opcao-1-clean-executiva.astro` (Opção 1)**
   - **URL de teste local:** `http://localhost:4321/aluguel-de-van-para-passeio-novo/`
   - **Conceito:** Layout Clean, corporativo moderno, claro com toques em verde e coral, focado em alta legibilidade e conversão direta.
   - **Destaques:**
     - Hero em 2 colunas com selos de garantia e botão WhatsApp chamativo;
     - Barra de confiança com 4 pilares (climatização, poltronas soft, economia, pontualidade);
     - Vitrine da frota em cards modernos com especificações técnicas;
     - Seção de dicas em cartões visuais destacados;
     - Prova social com depoimentos reais e fotos;
     - Formulário integrado de orçamento + dados completos de contato (endereço na Cidade Jardim, telefone, e-mail).

2. **`opcao-2-dark-luxo-experiencia.astro` (Opção 2)**
   - **URL de teste local:** `http://localhost:4321/aluguel-de-van-para-passeio-novo-1/`
   - **Conceito:** Dark Mode Sofisticado / Turismo de Primeira Classe / Experiência Imersiva (estilo Airbnb Luxe / Blacklane).
   - **Destaques:**
     - Hero imersivo com gradiente esmeralda e dourado, com **Simulador de Orçamento Imediato no topo**;
     - Barra de certificações e órgãos reguladores (ANTT, EMTU, SPTrans);
     - Seção de roteiros por tipo de experiência (Família & Crianças, Amigos & Praia, Gastronomia & Rota do Vinho);
     - Infográfico comparativo: **1 Van Executiva vs 3 ou 4 Carros** (evidenciando economia e zero estresse);
     - Vitrine VIP horizontal com destaques de itens de luxo e botão de cotação direta por veículo;
     - Jornada de contratação em 3 passos simples;
     - FAQ em acordeão expansível.

---

## 🛠️ Como aplicar nas páginas de serviço definitivas

Quando você escolher a opção preferida (ou uma combinação de elementos das duas):
1. O template pode ser integrado ao componente dinâmico principal (`src/pages/[...slug].astro` ou componentes dedicados como `ServiceLandingExtras.astro`).
2. Os dados de cada serviço ou cidade serão injetados automaticamente.
