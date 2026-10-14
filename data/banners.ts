import { WHATSAPP_GRUPO_VIP } from "@/lib/config";

// Banners com a arte final do Guilherme.
export type Banner = {
  id: string;
  image: string | null;
  alt: string;
  /** link começando com "/" abre na mesma aba; externo abre em aba nova */
  link?: string;
  /** só aparece enquanto a campanha de Dia dos Pais estiver valendo */
  promoOnly?: boolean;
  /** sai do ar durante a campanha e volta sozinho quando ela acaba */
  ocultoNaPromo?: boolean;
};

export const banners: Banner[] = [
  {
    id: "dia-dos-pais",
    image: "/img/banners/diadospais-banner.webp",
    alt: "Super descontos de Dia dos Pais, dias 8 e 9 de agosto. Promocao Arkano Club com descontos em produtos a pronta entrega e frete gratis para todo o Brasil.",
    link: "/pronta-entrega",
    promoOnly: true,
  },
  // Os quatro de sempre saem do ar durante o Dia dos Pais (Gabriel pediu em
  // 07/08/2026 pra deixar só o banner da campanha) e voltam sozinhos quando ela
  // acaba — sem eles o carrossel ficaria vazio depois de 09/08.
  {
    id: "garantia-autenticidade",
    image: "/img/banners/garantia-autenticidade.webp",
    alt: "Garantia e autenticidade. Toda peca passa por analise de validacao antes de sair do estoque.",
    ocultoNaPromo: true,
  },
  {
    id: "grupo-vip",
    image: "/img/banners/lancamentos-grupo-vip.webp",
    alt: "Lancamentos da semana. Pecas novas chegando direto pro grupo VIP antes do feed.",
    link: WHATSAPP_GRUPO_VIP,
    ocultoNaPromo: true,
  },
  {
    id: "vendeu-comprou-trocou",
    image: "/img/banners/vendeu-comprou-trocou.webp",
    alt: "Vendeu, comprou, trocou. Venda seu relogio usado com a gente.",
    ocultoNaPromo: true,
  },
  {
    id: "relogio-do-seu-sonho",
    image: "/img/banners/relogio-do-seu-sonho.webp",
    alt: "O relogio do seu sonho voce encontra aqui. Furlan Marri Cornes de Vache Blue Sector.",
    ocultoNaPromo: true,
  },
];
