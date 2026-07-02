"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { productsSobEncomenda } from "@/data/products-sob-encomenda";
import ImportedProductCard from "./ImportedProductCard";

export default function SobEncomendaSection() {
  const [brand, setBrand] = useState<string | null>(null);

  const brands = useMemo(
    () => Array.from(new Set(productsSobEncomenda.map((p) => p.brand))).sort(),
    []
  );

  const filtered = brand ? productsSobEncomenda.filter((p) => p.brand === brand) : productsSobEncomenda;

  return (
    <section id="sob-encomenda" className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex flex-col gap-2">
          <h2 className="text-2xl font-light text-arkano-champagne">Sob Encomenda</h2>
          <p className="max-w-2xl text-sm text-arkano-champagne/50">
            Outras marcas e modelos disponíveis por encomenda, sujeitos a confirmação de preço e prazo de
            entrega. Fale no WhatsApp pra consultar disponibilidade.{" "}
            <Link href="/encomenda" className="text-arkano-gold underline-offset-2 hover:underline">
              Não encontrou o que procura? Faça um pedido personalizado →
            </Link>
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setBrand(null)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              brand === null
                ? "bg-arkano-gold text-arkano-black"
                : "border border-white/10 text-arkano-champagne/60 hover:text-arkano-gold"
            }`}
          >
            Todas as marcas
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                brand === b
                  ? "bg-arkano-gold text-arkano-black"
                  : "border border-white/10 text-arkano-champagne/60 hover:text-arkano-gold"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {filtered.map((product) => (
            <ImportedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
