// Número único de WhatsApp usado em todos os CTAs do site.
// Pra trocar o número, edite só este arquivo.
export const WHATSAPP_NUMBER = "553399367330";

export const WHATSAPP_GRUPO_VIP = "https://bit.ly/GrupoDeOfertasArkanos";

// Domínio público do site, usado pra montar links de compartilhamento e metadados.
// Configurar NEXT_PUBLIC_SITE_URL na Vercel assim que o domínio final estiver definido.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arkanoclub.vercel.app";

export const INSTAGRAM_URL = "https://instagram.com/arkano.club";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
