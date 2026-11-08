"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BLACK_PARCELAS, TempoRestante, tempoRestanteBlack } from "@/lib/black-november";
import { useBlackAtiva } from "@/lib/use-black-november";

/** Faixa fina no topo de todas as páginas durante a Black November. */
export default function BlackNovemberBar() {
  const ativa = useBlackAtiva();
  const [tempo, setTempo] = useState<TempoRestante | null>(null);

  useEffect(() => {
    setTempo(tempoRestanteBlack());
    const timer = setInterval(() => setTempo(tempoRestanteBlack()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!ativa || !tempo || tempo.acabou) return null;

  const dois = (n: number) => String(n).padStart(2, "0");

  return (
    <Link
      href="/pronta-entrega"
      className="black-bar block border-b border-arkano-gold/30 px-4 py-2 text-center text-[11px] text-arkano-black sm:text-xs"
    >
      <strong className="font-semibold uppercase tracking-wider">Black November</strong>
      <span className="mx-2 opacity-60">·</span>
      <span className="tabular-nums sm:hidden">
        termina em {tempo.dias}d {dois(tempo.horas)}h {dois(tempo.minutos)}m {dois(tempo.segundos)}s
      </span>
      <span className="mt-0.5 block sm:mt-0 sm:inline">
        Frete grátis + até {BLACK_PARCELAS}x sem juros até R$&nbsp;8&nbsp;mil
      </span>
      <span className="mx-2 hidden opacity-60 sm:inline">·</span>
      <span className="hidden font-medium tabular-nums sm:inline">
        termina em {tempo.dias}d {dois(tempo.horas)}h {dois(tempo.minutos)}m {dois(tempo.segundos)}s
      </span>
    </Link>
  );
}
