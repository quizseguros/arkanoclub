/** Black November 2026.
 *
 *  Não é promoção de preço: nenhum valor muda. São só duas condições, pedidas
 *  pelo Guilherme em 08/11/2026, valendo até o fim do mês:
 *    - frete grátis pra todo o Brasil
 *    - até 6x sem juros nos relógios de até R$ 8 mil
 *
 *  Tudo é conferido no navegador (o arkanoclub.com é export estático): quando a
 *  data passa, faixa, contador, confete e o "6x sem juros" somem sozinhos e o
 *  site volta a ser o de antes, sem republicar. O estado anterior do código
 *  está na tag git `antes-black-november-2026-11-08`.
 */

export const BLACK_NOME = "Black November";

/** Domingo, 08/11/2026, 00:00 no horário de Brasília. */
export const BLACK_INICIO = new Date("2026-11-08T00:00:00-03:00");

/** Encerrada antes: termina na virada de sábado 28/11 pra domingo 29/11/2026,
 *  00:00 no horário de Brasília (pedido de 28/11; antes ia até 30/11). */
export const BLACK_FIM = new Date("2026-11-29T00:00:00-03:00");

/** Teto do parcelamento sem juros: relógio acima disso segue com o
 *  parcelamento normal cadastrado. */
export const BLACK_LIMITE_SEM_JUROS = 8000;
export const BLACK_PARCELAS = 6;

export function blackAtiva(agora: number = Date.now()): boolean {
  return agora >= BLACK_INICIO.getTime() && agora < BLACK_FIM.getTime();
}

/** Valor da parcela sem juros, ou null quando o relógio passa do teto. */
export function parcelaSemJuros(precoFinal: number): number | null {
  if (!precoFinal || precoFinal <= 0 || precoFinal > BLACK_LIMITE_SEM_JUROS) return null;
  return Math.round((precoFinal / BLACK_PARCELAS) * 100) / 100;
}

export type TempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  acabou: boolean;
};

export function tempoRestanteBlack(agora: number = Date.now()): TempoRestante {
  const falta = BLACK_FIM.getTime() - agora;
  if (falta <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, acabou: true };
  const s = Math.floor(falta / 1000);
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
    acabou: false,
  };
}

/** Filtro "só relógios em 6x sem juros" da pronta entrega. O botão do contador
 *  abre `/pronta-entrega?filtro=6x`; se a pessoa já está na página, avisa a
 *  grade por evento, sem recarregar. */
export const BLACK_FILTRO_PARAM = "filtro";
export const BLACK_FILTRO_VALOR = "6x";
export const BLACK_FILTRO_EVENTO = "black-filtro-6x";
export const BLACK_FILTRO_EVENTO_LIMPAR = "black-filtro-6x-limpar";

type ComPrecoBlack = { price: number; promoPrice?: number };

/** Relógio entra no 6x sem juros? Usa o preço que aparece no card. */
export function entraNoSeisX(p: ComPrecoBlack, promoAtiva = false): boolean {
  const final = promoAtiva && p.promoPrice && p.promoPrice > 0 && p.promoPrice < p.price ? p.promoPrice : p.price;
  return parcelaSemJuros(final) !== null;
}
