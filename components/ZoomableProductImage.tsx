"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

const ZOOM_SCALE = 2.5;
const TAP_MOVE_THRESHOLD = 10; // px — acima disso conta como arrastar, não toque

export default function ZoomableProductImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const gesture = useRef({ wasZoomed: false, moved: false, startX: 0, startY: 0 });

  function setOriginFromPoint(container: HTMLElement, clientX: number, clientY: number) {
    const rect = container.getBoundingClientRect();
    setOrigin({
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
    });
  }

  // Mouse (desktop): zoom aparece no hover e segue o cursor, como antes.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (zoomed) setOriginFromPoint(e.currentTarget, e.clientX, e.clientY);
  }

  // Toque (mobile): primeiro toque ativa o zoom no ponto tocado; com o zoom já
  // ativo, arrastar o dedo navega pela imagem como um joystick. Um novo toque
  // "seco" (sem arrastar) desativa o zoom.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    gesture.current = { wasZoomed: zoomed, moved: false, startX: e.clientX, startY: e.clientY };
    setOriginFromPoint(e.currentTarget, e.clientX, e.clientY);
    if (!zoomed) setZoomed(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    const dx = e.clientX - gesture.current.startX;
    const dy = e.clientY - gesture.current.startY;
    if (Math.abs(dx) > TAP_MOVE_THRESHOLD || Math.abs(dy) > TAP_MOVE_THRESHOLD) {
      gesture.current.moved = true;
    }
    if (zoomed) setOriginFromPoint(e.currentTarget, e.clientX, e.clientY);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    if (gesture.current.wasZoomed && !gesture.current.moved) setZoomed(false);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Ver foto ampliada de ${alt}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className="absolute inset-0 cursor-zoom-in"
      >
        <Image src={src} alt={alt} fill className="object-cover transition duration-300 group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-arkano-champagne/80 opacity-0 transition group-hover:opacity-100">
          <ZoomIn size={12} />
          Ampliar
        </span>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            aria-label="Fechar"
            className="absolute right-4 top-4 text-white/80 transition hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>

          <div
            className="relative aspect-square w-full max-w-2xl touch-none overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Image
              src={src}
              alt={alt}
              fill
              draggable={false}
              className="object-contain transition-transform duration-150 ease-out"
              style={{
                transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            />
          </div>

          <p
            className="flex items-center gap-2 text-center text-xs text-arkano-champagne/60"
            onClick={(e) => e.stopPropagation()}
          >
            <ZoomIn size={14} className="text-arkano-gold/70" />
            Clique ou toque na imagem para ampliar — arraste o dedo (ou mova o mouse) para navegar pelo zoom
          </p>
        </div>
      )}
    </>
  );
}
