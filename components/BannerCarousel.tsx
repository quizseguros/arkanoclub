"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/data/banners";

function getPerPage() {
  if (typeof window === "undefined") return 2;
  return window.innerWidth < 640 ? 1 : 2;
}

export default function BannerCarousel() {
  const [perPage, setPerPage] = useState(2);
  const pageCount = Math.ceil(banners.length / perPage);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  function goTo(p: number) {
    setPage((p + pageCount) % pageCount);
  }

  useEffect(() => {
    function onResize() {
      setPerPage(getPerPage());
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const card = cardRefs.current[page * perPage];
    if (card) setOffset(card.offsetLeft);
  }, [page, perPage]);

  useEffect(() => {
    const timer = setInterval(() => goTo(page + 1), 6000);
    return () => clearInterval(timer);
  }, [page, perPage]);

  return (
    <section className="bg-arkano-black py-8 sm:py-10">
      <div className="relative px-3 sm:px-4">
        <div
          className="overflow-hidden"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 40) goTo(delta > 0 ? page + 1 : page - 1);
            touchStartX.current = null;
          }}
        >
          <div
            className="flex gap-4 ease-[cubic-bezier(0.22,1,0.36,1)] transition-transform duration-[900ms]"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {banners.map((banner, i) => {
              const card = (
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-arkano-graphite"
                >
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 639px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-arkano-black via-arkano-graphite to-arkano-black" />
                  )}
                </div>
              );
              const widthClasses = "w-full sm:w-[calc(50%-0.5rem)] shrink-0";

              return banner.link ? (
                <a key={banner.id} href={banner.link} target="_blank" rel="noopener noreferrer" className={widthClasses}>
                  {card}
                </a>
              ) : (
                <div key={banner.id} className={widthClasses}>{card}</div>
              );
            })}
          </div>
        </div>

        <button
          aria-label="Banner anterior"
          onClick={() => goTo(page - 1)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/60 p-2 text-arkano-champagne transition hover:bg-black/80 sm:flex"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          aria-label="Próximo banner"
          onClick={() => goTo(page + 1)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/60 p-2 text-arkano-champagne transition hover:bg-black/80 sm:flex"
        >
          <ChevronRight size={22} />
        </button>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              aria-label={`Ir pra página ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 w-6 rounded-full transition ${
                i === page ? "bg-arkano-gold" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
