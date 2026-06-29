"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import { applyFilters, CategoryTab, Filters } from "@/lib/filters";
import FilterPanel from "./FilterPanel";
import ProductCard from "./ProductCard";

const tabs: { value: CategoryTab; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Femininos" },
];

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  priceBounds: number;
  diameterBounds: number;
};

export default function CatalogSection({ filters, onChange, priceBounds, diameterBounds }: Props) {
  const filtered = applyFilters(products, filters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <section id="catalogo" className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-light text-arkano-champagne">Catálogo completo</h2>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div id="femininos" className="flex gap-2 rounded-full border border-white/10 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onChange({ ...filters, category: tab.value })}
                  className={`rounded-full px-3 py-1.5 text-sm transition sm:px-4 ${
                    filters.category === tab.value
                      ? "bg-arkano-gold text-arkano-black"
                      : "text-arkano-champagne/60 hover:text-arkano-gold"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-sm text-arkano-champagne/80 transition hover:border-arkano-gold/60 hover:text-arkano-gold lg:hidden"
            >
              <SlidersHorizontal size={15} />
              Filtrar
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <FilterPanel
              filters={filters}
              onChange={onChange}
              priceBounds={priceBounds}
              diameterBounds={diameterBounds}
            />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="self-start text-sm text-arkano-champagne/50">
              Nenhum relógio encontrado com esses filtros. Tenta ajustar a busca ou limpar os filtros.
            </p>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-arkano-gold/20 bg-arkano-graphite p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest2 text-arkano-gold">Filtros</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fechar filtros">
                <X size={20} className="text-arkano-champagne" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={onChange}
              priceBounds={priceBounds}
              diameterBounds={diameterBounds}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-arkano-gold py-3 text-sm font-medium text-arkano-black"
            >
              Ver relógios
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
