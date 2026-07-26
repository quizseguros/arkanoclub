"use client";

import { useEffect, useState } from "react";
import { Product, products } from "@/data/products";
import { fetchLiveWatches } from "@/lib/live-watches";
import ProductCard from "./ProductCard";

const staticDisponiveis = products.filter((p) => p.stock === "em-estoque");

export default function ProntaEntregaGrid() {
  const [items, setItems] = useState<Product[]>(staticDisponiveis);

  useEffect(() => {
    fetchLiveWatches().then((live) => {
      if (live.length > 0) setItems([...live, ...staticDisponiveis]);
    });
  }, []);

  if (items.length === 0) {
    return (
      <p className="mt-10 text-sm text-arkano-champagne/50">
        Nenhum relógio em pronta entrega no momento. Fala com a gente que buscamos o que você procura.
      </p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} glow />
      ))}
    </div>
  );
}
