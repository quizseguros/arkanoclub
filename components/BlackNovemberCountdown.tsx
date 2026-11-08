"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, CreditCard, Truck } from "lucide-react";
import {
  BLACK_FILTRO_EVENTO,
  BLACK_FILTRO_PARAM,
  BLACK_FILTRO_VALOR,
  BLACK_LIMITE_SEM_JUROS,
  BLACK_NOME,
  BLACK_PARCELAS,
  TempoRestante,
  tempoRestanteBlack,
} from "@/lib/black-november";
import { useBlackAtiva } from "@/lib/use-black-november";

// "R$ 8 mil", com espaço que não quebra
const limite = `R$ ${BLACK_LIMITE_SEM_JUROS / 1000} mil`;

// posições fixas (nada de Math.random): o desenho é sempre o mesmo
const BALOES = [
  { left: 4, size: 46, delay: 0, dur: 11, cor: "gold" },
  { left: 13, size: 34, delay: 3.5, dur: 9, cor: "black" },
  { left: 22, size: 40, delay: 6.2, dur: 12, cor: "champagne" },
  { left: 76, size: 44, delay: 1.4, dur: 10, cor: "black" },
  { left: 85, size: 36, delay: 4.8, dur: 12.5, cor: "gold" },
  { left: 93, size: 48, delay: 7.5, dur: 10.5, cor: "champagne" },
] as const;

const CONFETES = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 7) % 40) / 10,
  dur: 4 + ((i * 13) % 30) / 10,
  cor: ["#c9a24b", "#e4c878", "#ece2cf", "#8a6a2b", "#ffffff"][i % 5],
  largura: 5 + (i % 3) * 2,
  gira: i % 2 === 0 ? 1 : -1,
}));

/** Contador da Black November, com balões subindo e confete caindo atrás.
 *  Some sozinho quando o mês acaba. */
export default function BlackNovemberCountdown() {
  const ativa = useBlackAtiva();
  const [tempo, setTempo] = useState<TempoRestante | null>(null);
  const router = useRouter();

  // se a página já tem lista de relógios (home, pronta entrega, sob
  // encomenda), liga o filtro nela e desce até a primeira; senão abre a
  // pronta entrega já filtrada
  const verRelogios = () => {
    const lista = document.getElementById("pronta-entrega") ?? document.getElementById("sob-encomenda");
    if (lista) {
      window.dispatchEvent(new Event(BLACK_FILTRO_EVENTO));
      lista.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/pronta-entrega?${BLACK_FILTRO_PARAM}=${BLACK_FILTRO_VALOR}`);
    }
  };

  useEffect(() => {
    setTempo(tempoRestanteBlack());
    const timer = setInterval(() => setTempo(tempoRestanteBlack()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!ativa || !tempo || tempo.acabou) return null;

  return (
    <section className="relative overflow-hidden border-y border-arkano-gold/25 bg-arkano-black px-4 py-12 sm:px-6 sm:py-14">
      {/* halo dourado */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] max-w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arkano-gold/15 blur-[120px]"
      />

      {/* confete */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {CONFETES.map((c, i) => (
          <span
            key={i}
            className="black-confete"
            style={
              {
                left: `${c.left}%`,
                width: c.largura,
                height: c.largura * 1.8,
                background: c.cor,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.dur}s`,
                "--gira": c.gira,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* balões */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {BALOES.map((b, i) => (
          <span
            key={i}
            className={`black-balao black-balao-${b.cor} ${i === 2 || i === 3 ? "hidden sm:block" : ""}`}
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size * 1.22,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-arkano-gold/40 bg-arkano-gold/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest2 text-arkano-gold-light">
          {BLACK_NOME}
        </span>

        <h2 className="mt-5 text-2xl font-light text-arkano-champagne sm:text-3xl">
          Condições especiais até o fim do mês
        </h2>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
          <Bloco valor={tempo.dias} rotulo="dias" />
          <Bloco valor={tempo.horas} rotulo="horas" />
          <Bloco valor={tempo.minutos} rotulo="min" />
          <Bloco valor={tempo.segundos} rotulo="seg" pulsa />
        </div>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="flex max-w-full items-center gap-2 rounded-full border border-arkano-gold/30 bg-arkano-graphite/70 px-4 py-2 text-left text-xs text-arkano-champagne sm:text-sm">
            <Truck size={16} className="shrink-0 text-arkano-gold" />
            Frete grátis para todo o Brasil
          </span>
          <span className="flex max-w-full items-center gap-2 rounded-full border border-arkano-gold/30 bg-arkano-graphite/70 px-4 py-2 text-left text-xs text-arkano-champagne sm:text-sm">
            <CreditCard size={16} className="shrink-0 text-arkano-gold" />
            Até {BLACK_PARCELAS}x sem juros em relógios até {limite}
          </span>
        </div>

        <button
          type="button"
          onClick={verRelogios}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-arkano-gold px-7 py-3 text-sm font-medium text-arkano-black shadow-[0_0_30px_rgba(201,162,75,0.35)] transition hover:bg-arkano-gold-light"
        >
          Ver relógios em {BLACK_PARCELAS}x sem juros
          <ArrowDown size={16} />
        </button>

        <p className="mt-5 max-w-xl text-xs text-arkano-champagne/50">
          Válido até 30 de novembro, às 23h59. Relógios originais, com garantia.
        </p>
      </div>
    </section>
  );
}

function Bloco({ valor, rotulo, pulsa }: { valor: number; rotulo: string; pulsa?: boolean }) {
  return (
    <div className="w-[74px] rounded-xl border border-arkano-gold/30 bg-arkano-graphite/80 px-2 py-3 shadow-[0_0_28px_rgba(201,162,75,0.18)] sm:w-24 sm:py-4">
      <span
        className={`block font-light tabular-nums text-arkano-champagne text-3xl sm:text-4xl ${
          pulsa ? "promo-tick" : ""
        }`}
      >
        {String(valor).padStart(2, "0")}
      </span>
      <span className="mt-1 block text-[10px] uppercase tracking-widest2 text-arkano-gold/80">{rotulo}</span>
    </div>
  );
}
