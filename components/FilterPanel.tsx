"use client";

import { brands } from "@/data/brands";
import { Movement, Stock } from "@/data/products";
import { Filters } from "@/lib/filters";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const stockOptions: { value: Stock; label: string }[] = [
  { value: "em-estoque", label: "Em estoque" },
  { value: "sob-encomenda", label: "Sob encomenda" },
];
const movementOptions: { value: Movement; label: string }[] = [
  { value: "automático", label: "Automático" },
  { value: "quartzo", label: "Quartzo" },
  { value: "manual", label: "Manual" },
];

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  priceBounds: number;
  diameterBounds: number;
};

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function FilterPanel({ filters, onChange, priceBounds, diameterBounds }: Props) {
  return (
    <aside className="flex flex-col gap-7 rounded-xl border border-white/10 bg-arkano-graphite p-5">
      <div>
        <h4 className="mb-3 text-xs uppercase tracking-widest2 text-arkano-gold">Disponibilidade</h4>
        <div className="flex flex-col gap-2">
          {stockOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-arkano-champagne/80">
              <input
                type="checkbox"
                checked={filters.stock.has(opt.value)}
                onChange={() => onChange({ ...filters, stock: toggleInSet(filters.stock, opt.value) })}
                className="accent-arkano-gold"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs uppercase tracking-widest2 text-arkano-gold">
          Preço até {currency.format(filters.priceMax)}
        </h4>
        <input
          type="range"
          min={0}
          max={priceBounds}
          step={100}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <h4 className="mb-3 text-xs uppercase tracking-widest2 text-arkano-gold">
          Diâmetro até {filters.diameterMax}mm
        </h4>
        <input
          type="range"
          min={20}
          max={diameterBounds}
          step={1}
          value={filters.diameterMax}
          onChange={(e) => onChange({ ...filters, diameterMax: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <h4 className="mb-3 text-xs uppercase tracking-widest2 text-arkano-gold">Marca</h4>
        <div className="flex flex-col gap-2">
          {brands.map((brand) => (
            <label key={brand.slug} className="flex items-center gap-2 text-sm text-arkano-champagne/80">
              <input
                type="checkbox"
                checked={filters.brands.has(brand.slug)}
                onChange={() => onChange({ ...filters, brands: toggleInSet(filters.brands, brand.slug) })}
                className="accent-arkano-gold"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs uppercase tracking-widest2 text-arkano-gold">Maquinário</h4>
        <div className="flex flex-col gap-2">
          {movementOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-arkano-champagne/80">
              <input
                type="checkbox"
                checked={filters.movement.has(opt.value)}
                onChange={() => onChange({ ...filters, movement: toggleInSet(filters.movement, opt.value) })}
                className="accent-arkano-gold"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() =>
          onChange({
            ...filters,
            brands: new Set(),
            stock: new Set(),
            movement: new Set(),
            priceMax: priceBounds,
            diameterMax: diameterBounds,
          })
        }
        className="text-xs text-arkano-champagne/50 underline-offset-4 hover:text-arkano-gold hover:underline"
      >
        Limpar filtros
      </button>
    </aside>
  );
}
