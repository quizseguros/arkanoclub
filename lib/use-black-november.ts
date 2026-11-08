"use client";

import { useEffect, useState } from "react";
import {
  BLACK_FILTRO_EVENTO,
  BLACK_FILTRO_EVENTO_LIMPAR,
  BLACK_FILTRO_PARAM,
  BLACK_FILTRO_VALOR,
  blackAtiva,
} from "./black-november";

/** `?black=1` liga a campanha fora da data, só rodando local (mesma regra do
 *  `?promo=1` do Dia dos Pais: no site real a query é ignorada). */
function previaLocal(): boolean {
  if (typeof window === "undefined") return false;
  const ehLocal = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  if (!ehLocal) return false;
  return new URLSearchParams(window.location.search).has("black");
}

/** Diz se a Black November está no ar, checando no navegador. Começa `false`
 *  pra bater com o HTML do export estático e liga depois de montar. */
export function useBlackAtiva(): boolean {
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    const calcular = () => setAtiva(previaLocal() || blackAtiva());
    calcular();
    // aba aberta atravessando a meia-noite do dia 30 desliga sozinha
    const timer = setInterval(calcular, 30000);
    return () => clearInterval(timer);
  }, []);

  return ativa;
}

/** Filtro "só relógios em 6x sem juros", compartilhado pelas listas
 *  (pronta entrega e sob encomenda). Liga pelo `?filtro=6x` na URL ou pelo
 *  evento que o botão do contador dispara; fora da campanha nunca liga. */
export function useFiltroSeisX(rolarAte?: string): [boolean, () => void] {
  const blackAtiva = useBlackAtiva();
  const [ligado, setLigado] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get(BLACK_FILTRO_PARAM) === BLACK_FILTRO_VALOR) {
      setLigado(true);
      // chegou pelo link já filtrado: desce até a lista
      if (rolarAte) setTimeout(() => document.getElementById(rolarAte)?.scrollIntoView({ behavior: "smooth" }), 600);
    }
    const ligar = () => setLigado(true);
    const desligar = () => setLigado(false);
    window.addEventListener(BLACK_FILTRO_EVENTO, ligar);
    window.addEventListener(BLACK_FILTRO_EVENTO_LIMPAR, desligar);
    return () => {
      window.removeEventListener(BLACK_FILTRO_EVENTO, ligar);
      window.removeEventListener(BLACK_FILTRO_EVENTO_LIMPAR, desligar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // limpar desliga em todas as listas da página e tira o ?filtro=6x da barra
  const limpar = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete(BLACK_FILTRO_PARAM);
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(BLACK_FILTRO_EVENTO_LIMPAR));
  };

  return [ligado && blackAtiva, limpar];
}
