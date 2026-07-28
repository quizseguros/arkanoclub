"use client";

import Link from "next/link";
import { Product } from "@/data/products";
import { brands } from "@/data/brands";
import ProductCard from "./ProductCard";

export default function ProntaEntregaGrid({
  items,
  brandFilter,
}: {
  items: Product[];
  brandFilter?: string | null;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-10 text-sm text-arkano-champagne/50">
        Nenhum relógio em pronta entrega no momento. Fala com a gente que buscamos o que você procura.
      </p>
    );
  }

  const visiveis = brandFilter ? items.filter((p) => p.brand === brandFilter) : items;

  if (visiveis.length === 0) {
    const marca = brands.find((b) => b.slug === brandFilter)?.name;
    return (
      <p className="mt-10 text-sm text-arkano-champagne/50">
        Nenhum relógio {marca ? `da ${marca}` : "dessa marca"} em pronta entrega agora.{" "}
        <Link href="/#catalogo" className="text-arkano-gold underline-offset-4 hover:underline">
          Ver no catálogo completo
        </Link>{" "}
        ou clicar de novo na marca pra mostrar todos.
      </p>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {visiveis.map((product) => (
        <ProductCard key={product.id} product={product} glow />
      ))}
    </div>
  );
}
