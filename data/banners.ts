import { WHATSAPP_GRUPO_VIP } from "@/lib/config";

// Banners com a arte final do Guilherme.
export type Banner = {
  id: string;
  image: string | null;
  alt: string;
  link?: string;
};

export const banners: Banner[] = [
  {
    id: "garantia-autenticidade",
    image: "/img/banners/garantia-autenticidade.png",
    alt: "Garantia e autenticidade. Toda peca passa por analise de validacao antes de sair do estoque.",
  },
  {
    id: "grupo-vip",
    image: "/img/banners/lancamentos-grupo-vip.png",
    alt: "Lancamentos da semana. Pecas novas chegando direto pro grupo VIP antes do feed.",
    link: WHATSAPP_GRUPO_VIP,
  },
  {
    id: "vendeu-comprou-trocou",
    image: "/img/banners/vendeu-comprou-trocou.png",
    alt: "Vendeu, comprou, trocou. Venda seu relogio usado com a gente.",
  },
  {
    id: "relogio-do-seu-sonho",
    image: "/img/banners/relogio-do-seu-sonho.png",
    alt: "O relogio do seu sonho voce encontra aqui. Furlan Marri Cornes de Vache Blue Sector.",
  },
];
