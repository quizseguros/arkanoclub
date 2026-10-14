// Número único de WhatsApp usado em todos os CTAs do site.
// Pra trocar o número, edite só este arquivo.
export const WHATSAPP_NUMBER = "553399367330";

// Convite direto do grupo. Era um bit.ly que estava caindo no lugar errado
// (Guilherme, 06/08/2026) — link do WhatsApp na mão, sem encurtador no meio.
export const WHATSAPP_GRUPO_VIP =
  "https://chat.whatsapp.com/DmLHmZhtgpjL13audR5cuo?s=cl&p=i&mlu=0&amv=0";

// Domínio público do site, usado pra montar links de compartilhamento e metadados.
// Configurar NEXT_PUBLIC_SITE_URL na Vercel assim que o domínio final estiver definido.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arkanoclub.vercel.app";

export const INSTAGRAM_URL = "https://instagram.com/arkano.club";

// Abas pausadas a pedido do Guilherme (13/10/2026): o site fica só com Pronta
// entrega, Quem Somos e Grupo VIP. Pra religar uma aba, troque pra true.
// As páginas continuam existindo, só saem do menu, do rodapé, do chat e da home.
export const ABA_CATALOGO = false;
export const ABA_VENDER_RELOGIO = false;
export const ABA_FOUNDERS = false;

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
