"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, products } from "@/data/products";
import ProductCard from "./ProductCard";

type Row = { id: string; title: string; items: Product[] };

const rows: Row[] = [
  { id: "destaque", title: "Relógios em destaque", items: products.filter((p) => p.featured) },
  { id: "mais-vendidos", title: "Mais vendidos", items: products.filter((p) => p.bestseller) },
];

function ProductRow({ row }: { row: Row }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (row.items.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-light text-arkano-champagne">{row.title}</h3>
        <div className="hidden gap-2 sm:flex">
          <button
            aria-label={`Voltar em ${row.title}`}
            onClick={() => scrollByCard(-1)}
            className="flex items-center justify-center rounded-full border border-white/10 p-2 text-arkano-champagne transition hover:border-arkano-gold/60 hover:text-arkano-gold"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label={`Avançar em ${row.title}`}
            onClick={() => scrollByCard(1)}
            className="flex items-center justify-center rounded-full border border-white/10 p-2 text-arkano-champagne transition hover:border-arkano-gold/60 hover:text-arkano-gold"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {row.items.map((product) => (
          <div key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProductCard product={product} glow={row.id === "destaque"} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedSection() {
  return (
    <section className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {rows.map((row) => (
          <ProductRow key={row.id} row={row} />
        ))}
      </div>
    </section>
  );
}
