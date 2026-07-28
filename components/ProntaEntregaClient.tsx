"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Product, products } from "@/data/products";
import { brands } from "@/data/brands";
import { fetchLiveWatches } from "@/lib/live-watches";
import BrandLogoCarousel from "./BrandLogoCarousel";
import ProntaEntregaGrid from "./ProntaEntregaGrid";

const staticDisponiveis = products.filter((p) => p.stock === "em-estoque");

/** Esteira de marcas + grade da página de pronta entrega. A esteira mostra só
 *  as marcas que têm relógio nessa seção, e clicar numa delas filtra a grade. */
export default function ProntaEntregaClient() {
  const [items, setItems] = useState<Product[]>(staticDisponiveis);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveWatches().then((live) => {
      if (live.length > 0) setItems([...live, ...staticDisponiveis]);
    });
  }, []);

  // ordem de data/brands, pra esteira ficar igual à da home
  const marcasNaSecao = useMemo(() => {
    const presentes = new Set(items.map((p) => p.brand));
    return brands.filter((b) => presentes.has(b.slug)).map((b) => b.slug);
  }, [items]);

  const marcaAtiva = brands.find((b) => b.slug === activeBrand);

  return (
    <>
      <BrandLogoCarousel
        activeBrand={activeBrand}
        onSelectBrand={(slug) => setActiveBrand((atual) => (atual === slug ? null : slug))}
        scrollToId="pronta-entrega"
        brandSlugs={marcasNaSecao}
      />

      <section id="pronta-entrega" className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest2 text-arkano-gold">Disponível agora</p>
          <h1 className="mt-2 text-3xl font-light text-arkano-champagne sm:text-4xl">Pronta entrega</h1>
          <p className="mt-3 max-w-2xl text-sm text-arkano-champagne/60 sm:text-base">
            Esses relógios já estão com a gente, prontos pra enviar assim que o pedido é fechado — sem
            espera de importação. Original, com garantia.
          </p>

          {marcaAtiva && (
            <button
              type="button"
              onClick={() => setActiveBrand(null)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-arkano-gold/50 px-4 py-1.5 text-xs text-arkano-gold transition hover:bg-arkano-gold/10"
            >
              Mostrando só {marcaAtiva.name}
              <X size={14} />
            </button>
          )}

          <ProntaEntregaGrid items={items} brandFilter={activeBrand} />
        </div>
      </section>
    </>
  );
}
