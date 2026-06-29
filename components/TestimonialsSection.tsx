"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { depoimentos, Depoimento } from "@/data/depoimentos";

export default function TestimonialsSection() {
  const track = [...depoimentos, ...depoimentos, ...depoimentos, ...depoimentos];
  const [selected, setSelected] = useState<Depoimento | null>(null);

  useEffect(() => {
    if (!selected) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section className="border-b border-white/10 bg-arkano-graphite py-16">
      <h2 className="mb-10 text-center text-2xl font-light text-arkano-champagne">
        Quem comprou, confirma
      </h2>

      <div className="group relative overflow-hidden">
        <div className="flex w-max items-center gap-6 animate-[marquee_110s_linear_infinite] group-hover:[animation-play-state:paused]">
          {track.map((d, i) => (
            <button
              key={`${d.id}-${i}`}
              onClick={() => setSelected(d)}
              aria-label="Abrir depoimento em tamanho maior"
              className="shrink-0 transition hover:opacity-80"
            >
              <Image
                src={d.image}
                alt="Depoimento de cliente do Arkano Club"
                width={d.width}
                height={d.height}
                className="h-72 w-auto rounded-xl border-2 border-arkano-gold/40 sm:h-96 md:h-[460px]"
              />
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            aria-label="Fechar"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 text-arkano-champagne transition hover:text-arkano-gold"
          >
            <X size={28} />
          </button>
          <Image
            src={selected.image}
            alt="Depoimento de cliente do Arkano Club"
            width={selected.width}
            height={selected.height}
            className="max-h-[90vh] w-auto rounded-xl border-2 border-arkano-gold"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
