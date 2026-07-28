"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ZoomableProductImage from "./ZoomableProductImage";

const SWIPE_THRESHOLD = 45; // px de arrasto horizontal pra trocar de foto
const DRAG_THRESHOLD = 12; // acima disso é arrasto, não clique

/** Carrossel de fotos da página de detalhes: seta, miniatura e arrasto no
 *  celular. Com uma foto só, se comporta exatamente como antes (imagem
 *  simples com lupa). As fotos extras são as que o Guilherme sobe no admin. */
export default function ProductGallery({
  images,
  alt,
  overlay,
}: {
  images: string[];
  alt: string;
  /** selos (estoque, condição) que ficam por cima da foto principal */
  overlay?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const drag = useRef({ startX: 0, active: false, moved: false });

  const total = images.length;
  const hasMany = total > 1;
  const current = images[Math.min(index, total - 1)] ?? images[0];

  function go(step: number) {
    setIndex((i) => (i + step + total) % total);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = { startX: e.clientX, active: true, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    if (Math.abs(e.clientX - drag.current.startX) > DRAG_THRESHOLD) drag.current.moved = true;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.startX;
    if (hasMany && Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  }

  // arrastar não pode abrir a lupa — só o clique "seco" abre
  function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div>
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-xl bg-black"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (drag.current.active = false)}
        onClickCapture={handleClickCapture}
      >
        <ZoomableProductImage
          src={current}
          alt={alt}
          gallery={images}
          index={index}
          onIndexChange={setIndex}
        />

        {overlay}

        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-arkano-champagne/80 transition hover:bg-black/80 hover:text-arkano-gold"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-arkano-champagne/80 transition hover:bg-black/80 hover:text-arkano-gold"
            >
              <ChevronRight size={20} />
            </button>

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5">
              {images.map((img, i) => (
                <span
                  key={`${img}-${i}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-arkano-gold" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMany && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img}-thumb-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1} de ${total}`}
              aria-pressed={i === index}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                i === index ? "border-arkano-gold" : "border-white/10 hover:border-arkano-gold/50"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
