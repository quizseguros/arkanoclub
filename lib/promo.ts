/** Campanha de Dia dos Pais 2026.
 *
 *  O preço promocional de cada relógio vem do painel (campo "Preço promocional"
 *  no cadastro) — aqui fica só a janela da campanha e as contas de exibição.
 *  Quando a data passa, o site volta sozinho pro preço cheio: nada de mexer em
 *  código nem republicar o arkanoclub.com pra encerrar a promoção.
 */

export const PROMO_NOME = "Dia dos Pais";

/** Sábado, 08/08/2026, 00:00 no horário de Brasília. O Guilherme encurtou a
 *  campanha em 07/08: era 7, 8 e 9, virou só 8 e 9. */
export const PROMO_INICIO = new Date("2026-08-08T00:00:00-03:00");

/** Domingo, 09/08/2026, 23:59:59 no horário de Brasília. O fuso vai escrito no
 *  texto de propósito: o visitante pode estar em qualquer lugar, e a promoção
 *  tem que começar e acabar na mesma hora pra todo mundo. */
export const PROMO_FIM = new Date("2026-08-09T23:59:59-03:00");

export function promoAtiva(agora: number = Date.now()): boolean {
  return agora >= PROMO_INICIO.getTime() && agora < PROMO_FIM.getTime();
}

type ComPreco = { price: number; promoPrice?: number };

/** Preço de campanha do relógio, ou null quando ele não está em promoção.
 *  Só considera desconto de verdade — promoPrice acima do preço cheio é
 *  tratado como erro de cadastro e ignorado. */
export function precoPromocional(p: ComPreco): number | null {
  if (!p.promoPrice || p.promoPrice <= 0) return null;
  if (p.promoPrice >= p.price) return null;
  return p.promoPrice;
}

/** Desconto arredondado pra exibir no selo ("25% OFF"). */
export function percentualDesconto(precoCheio: number, promo: number): number {
  return Math.round((1 - promo / precoCheio) * 100);
}

export type TempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  acabou: boolean;
};

export function tempoRestante(agora: number = Date.now()): TempoRestante {
  const falta = PROMO_FIM.getTime() - agora;
  if (falta <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, acabou: true };

  const segundosTotais = Math.floor(falta / 1000);
  return {
    dias: Math.floor(segundosTotais / 86400),
    horas: Math.floor((segundosTotais % 86400) / 3600),
    minutos: Math.floor((segundosTotais % 3600) / 60),
    segundos: segundosTotais % 60,
    acabou: false,
  };
}
