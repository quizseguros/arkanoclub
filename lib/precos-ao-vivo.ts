"use client";

import { useEffect, useState } from "react";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin-vert-sigma-49.vercel.app";

// Preços que o Guilherme ajusta na aba "Sob encomenda" do painel. Uma busca só
// por visita, dividida entre todos os cards da página.
let pedido: Promise<Record<string, number>> | null = null;

function buscarPrecos() {
  if (!pedido) {
    pedido = fetch(`${ADMIN_API_URL}/api/public/precos-sob-encomenda`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return pedido;
}

/** Preço e parcela do relógio, já com o ajuste do painel quando houver.
 *  Enquanto a busca não volta (ou se falhar) fica o preço do build. */
export function usePrecoAoVivo(id: string | undefined, price: number, installmentPrice?: number) {
  const [precos, setPrecos] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (id) buscarPrecos().then(setPrecos);
  }, [id]);

  const ajustado = id ? precos?.[id] : undefined;
  if (!ajustado) return { price, installmentPrice };
  // mesma regra do resto do site: parcelado = à vista + 14%, em 12x
  return { price: ajustado, installmentPrice: Math.round(((ajustado * 1.14) / 12) * 100) / 100 };
}
