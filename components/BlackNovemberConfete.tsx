"use client";

import { useEffect, useState } from "react";
import { useBlackAtiva } from "@/lib/use-black-november";

const PECAS = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 29) % 100,
  delay: ((i * 11) % 15) / 10,
  dur: 2.6 + ((i * 7) % 18) / 10,
  cor: ["#c9a24b", "#e4c878", "#ece2cf", "#8a6a2b", "#ffffff"][i % 5],
  largura: 6 + (i % 3) * 2,
  gira: i % 2 === 0 ? 1 : -1,
}));

/** Chuva de confete por cima da página, uma vez por visita (por aba), logo
 *  depois que a abertura do logo termina. Não bloqueia clique. */
export default function BlackNovemberConfete() {
  const ativa = useBlackAtiva();
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (!ativa) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("black-confete")) return;
    sessionStorage.setItem("black-confete", "1");

    // a abertura (splash) cobre a tela por ~5s
    const entra = setTimeout(() => setMostrar(true), 4800);
    const sai = setTimeout(() => setMostrar(false), 4800 + 6000);
    return () => {
      clearTimeout(entra);
      clearTimeout(sai);
    };
  }, [ativa]);

  if (!mostrar) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {PECAS.map((c, i) => (
        <span
          key={i}
          className="black-confete black-confete-tela"
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
  );
}
