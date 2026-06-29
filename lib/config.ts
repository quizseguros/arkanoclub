// Número único de WhatsApp usado em todos os CTAs do site.
// Pra trocar o número, edite só este arquivo.
export const WHATSAPP_NUMBER = "5533998202334";

export const WHATSAPP_GRUPO_VIP = "https://bit.ly/GrupoDeOfertasArkanos";

export const INSTAGRAM_URL = "https://instagram.com/arkano.club";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
