"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

const ZOOM_SCALE = 2.5;

export default function ZoomableProductImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  function updateOrigin(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
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
            className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-xl bg-black"
            onClick={(e) => {
              e.stopPropagation();
              updateOrigin(e);
              setZoomed((z) => !z);
            }}
            onMouseMove={updateOrigin}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain transition-transform duration-150 ease-out"
              style={{
                transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
