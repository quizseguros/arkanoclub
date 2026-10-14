"use client";

import { useEffect, useState } from "react";
import { promoAtiva } from "./promo";

/** Modo de prévia: `?promo=1` liga a campanha antes da data de início.
 *
 *  Só vale rodando local (localhost). No arkanoclub.com e na Vercel a query é
 *  ignorada de propósito — senão qualquer visitante poderia abrir a promoção
 *  antes da hora só chutando a URL, e comprar por um preço que ainda não vale. */
function previaLocal(): boolean {
  if (typeof window === "undefined") return false;
  const ehLocal = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  if (!ehLocal) return false;
  return new URLSearchParams(window.location.search).has("promo");
}

/** Diz se a campanha está no ar, checando no navegador.
 *
 *  O arkanoclub.com é export estático: se essa conta rodasse no build, a página
 *  ficaria congelada em "promoção ativa" pra sempre. Por isso começa `false` e
 *  só liga depois de montar — o HTML gerado e a primeira renderização batem, e
 *  a campanha começa e termina sozinha, sem republicação. */
export function usePromoAtiva(): boolean {
  const [ativa, setAtiva] = useState(false);

  useEffect(() => {
    const calcular = () => setAtiva(previaLocal() || promoAtiva());
    calcular();
    // se a pessoa deixar a aba aberta atravessando a virada, o preço muda sozinho
    const timer = setInterval(calcular, 1000);
    return () => clearInterval(timer);
  }, []);

  return ativa;
}

/** True quando a campanha está aparecendo só por causa do `?promo=1`, e não
 *  porque a data chegou. Serve pra marcar a tela como prévia. */
export function usePromoPrevia(): boolean {
  const [previa, setPrevia] = useState(false);
  useEffect(() => {
    setPrevia(previaLocal() && !promoAtiva());
  }, []);
  return previa;
}
