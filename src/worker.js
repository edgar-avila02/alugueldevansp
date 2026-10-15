import { onRequestPost } from '../functions/api/lead.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Rota da API para envio do formulário de lead
    if (url.pathname === '/api/lead' && request.method === 'POST') {
      return onRequestPost({ request, env });
    }

    // Todas as outras rotas são entregues diretamente pelos arquivos estáticos do Astro (dist/)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Assets binding não encontrado', { status: 500 });
  },
};
