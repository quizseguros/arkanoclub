"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { PROMO_NOME, TempoRestante, tempoRestante } from "@/lib/promo";
import { usePromoAtiva, usePromoPrevia } from "@/lib/use-promo";

/** Contador da campanha de Dia dos Pais, no topo da pronta entrega.
 *
 *  Roda inteiro no navegador: enquanto não monta não mostra nada, e no segundo
 *  em que o prazo vira ele some da página junto com os preços promocionais —
 *  sem depender de republicar o site. */
export default function PromoCountdown() {
  const [tempo, setTempo] = useState<TempoRestante | null>(null);
  // a campanha tem começo e fim: antes do dia 8 não há contador nenhum, senão
  // ele apareceria sozinho, sem os preços promocionais nem o banner
  const promoAtiva = usePromoAtiva();
  const previa = usePromoPrevia();

  useEffect(() => {
    setTempo(tempoRestante());
    const timer = setInterval(() => setTempo(tempoRestante()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!promoAtiva || !tempo || tempo.acabou) return null;

  return (
    <section className="promo-shine relative overflow-hidden border-b border-arkano-blue/30 bg-arkano-navy px-4 py-10 sm:px-6 sm:py-12">
      {/* halo azul por trás do conteúdo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] max-w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arkano-blue/25 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-arkano-blue-light/40 bg-arkano-blue/15 px-4 py-1.5 text-[11px] uppercase tracking-widest2 text-arkano-blue-light">
          <Gift size={13} />
          Oferta de {PROMO_NOME}
        </span>

        {previa && (
          <span className="mt-4 rounded-full border border-dashed border-arkano-champagne/40 px-3 py-1 text-[10px] uppercase tracking-widest2 text-arkano-champagne/60">
            Prévia — a campanha só entra no ar dia 8
          </span>
        )}

        <h2 className="mt-5 text-2xl font-light text-arkano-champagne sm:text-3xl">
          A promoção acaba em
        </h2>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
          <Bloco valor={tempo.dias} rotulo="dias" />
          <Bloco valor={tempo.horas} rotulo="horas" />
          <Bloco valor={tempo.minutos} rotulo="min" />
          <Bloco valor={tempo.segundos} rotulo="seg" pulsa />
        </div>

        <p className="mt-6 max-w-xl text-sm text-arkano-champagne/60">
          Preços especiais nos relógios em pronta entrega nos dias 8 e 9 de agosto, até as 23h59
          de domingo. Original, com garantia e pronto pra enviar.
        </p>
      </div>
    </section>
  );
}

function Bloco({ valor, rotulo, pulsa }: { valor: number; rotulo: string; pulsa?: boolean }) {
  return (
    <div className="w-[74px] rounded-xl border border-arkano-blue-light/25 bg-arkano-navy-light/60 px-2 py-3 shadow-[0_0_28px_rgba(47,111,208,0.28)] sm:w-24 sm:py-4">
      <span
        className={`block font-light tabular-nums text-arkano-champagne text-3xl sm:text-4xl ${
          pulsa ? "promo-tick" : ""
        }`}
      >
        {String(valor).padStart(2, "0")}
      </span>
      <span className="mt-1 block text-[10px] uppercase tracking-widest2 text-arkano-blue-light/80">
        {rotulo}
      </span>
    </div>
  );
}
