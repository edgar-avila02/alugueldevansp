// Cloudflare Pages Function — POST /api/lead
// Substitui o Contact Form 7 / MetForm do WordPress.
//
// Variáveis de ambiente (Pages > Settings > Variables and Secrets):
//   LEAD_WEBHOOK_URL   (opcional) URL que recebe o lead em JSON (Make, Zapier, n8n, Apps Script...)
//   RESEND_API_KEY     (opcional) chave da Resend para enviar e-mail
//   LEAD_TO_EMAIL      destino do e-mail (ex.: contato@alugueldevansp.com)
//   LEAD_FROM_EMAIL    remetente verificado na Resend (ex.: leads@alugueldevansp.com)
// Configure ao menos um canal (webhook e/ou e-mail).

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const clean = (v, max = 2000) => String(v ?? '').replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400);
  }

  // Honeypot: robôs preenchem; respondemos 200 sem processar
  if (clean(data.website)) return json({ ok: true });

  const lead = {
    nome: clean(data.Nome, 120),
    sobrenome: clean(data.Sobrenome, 120),
    email: clean(data['E-mail'], 200),
    telefone: clean(data.Telefone, 40),
    mensagem: clean(data.Mensagem, 3000),
    pagina: clean(data.pagina, 300),
    recebidoEm: new Date().toISOString(),
    ip: request.headers.get('cf-connecting-ip') || null,
  };

  if (!lead.nome || !lead.telefone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return json({ ok: false, error: 'Preencha nome, e-mail válido e telefone.' }, 422);
  }

  const tasks = [];

  if (env.LEAD_WEBHOOK_URL) {
    tasks.push(
      fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      }).then((r) => {
        if (!r.ok) throw new Error('webhook ' + r.status);
      }),
    );
  }

  if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL && env.LEAD_FROM_EMAIL) {
    const html = `<h2>Novo pedido de orçamento</h2>
      <p><b>Nome:</b> ${esc(lead.nome)} ${esc(lead.sobrenome)}</p>
      <p><b>E-mail:</b> ${esc(lead.email)}</p>
      <p><b>Telefone:</b> ${esc(lead.telefone)}</p>
      <p><b>Mensagem:</b><br>${esc(lead.mensagem).replace(/\n/g, '<br>')}</p>
      <p><small>Página: ${esc(lead.pagina)}</small></p>`;
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: env.LEAD_FROM_EMAIL,
          to: [env.LEAD_TO_EMAIL],
          reply_to: lead.email,
          subject: `Novo lead: ${lead.nome} ${lead.sobrenome}`.trim(),
          html,
        }),
      }).then((r) => {
        if (!r.ok) throw new Error('resend ' + r.status);
      }),
    );
  }

  if (!tasks.length) {
    return json({ ok: false, error: 'Nenhum canal de recebimento configurado.' }, 503);
  }

  const results = await Promise.allSettled(tasks);
  if (results.every((r) => r.status === 'rejected')) {
    return json({ ok: false, error: 'Falha ao encaminhar o lead.' }, 502);
  }
  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: 'Método não permitido' }, 405);
