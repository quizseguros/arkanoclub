"use client";

import { useState } from "react";
import { X } from "lucide-react";

const KEYWORDS = [
  "relógio original", "relógio com garantia", "comprar relógio online",
  "relógio masculino", "relógio automático", "relógio mecânico",
  "relógio de pulso", "relógio unissex", "relógio premium",
  "relógio de luxo acessível", "relógio com garantia Brasil",
  "relógio entrega todo Brasil", "relógio autêntico",
  "relógio original com nota fiscal", "relógio social masculino",
  "relógio esportivo", "relógio diver", "relógio mergulho",
  "relógio pilot", "relógio GMT", "relógio cronógrafo",
  "relógio safira", "relógio aço inoxidável", "melhor relógio custo benefício",
  "entry luxury watch Brasil", "relógio Seiko", "relógio Citizen",
  "relógio TAG Heuer", "relógio Tudor", "relógio Longines",
  "relógio Mido", "relógio Baltic", "relógio Venezianico",
  "relógio Christopher Ward", "Seiko Presage", "Seiko 5",
  "Citizen Promaster", "TAG Heuer Aquaracer", "Tudor Black Bay",
  "Longines Master Collection", "Mido Baroncelli",
  "relojoaria brasileira", "onde comprar relógio original",
  "vender relógio",
  "relógio de investimento", "relógio colecionável",
  "relógio de qualidade", "relógio Vargem Alegre",
];

export default function SeoKeywordsPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-widest text-arkano-champagne/30 hover:text-arkano-gold transition-colors"
      >
        SEO
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg border border-white/10 bg-arkano-graphite p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-arkano-champagne/40 hover:text-arkano-champagne transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="mb-1 text-sm font-medium tracking-widest uppercase text-arkano-gold">
              Palavras-chave SEO
            </h2>
            <p className="mb-5 text-xs text-arkano-champagne/50">
              50 termos do nicho de relojoaria indexados neste site.
            </p>

            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((kw) => (
                <span
                  key={kw}
                  className="rounded border border-white/10 px-2 py-1 text-xs text-arkano-champagne/60"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
