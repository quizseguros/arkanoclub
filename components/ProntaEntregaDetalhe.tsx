"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { fetchLiveWatch } from "@/lib/live-watches";
import ProductDetail from "./ProductDetail";

type Estado = { fase: "carregando" } | { fase: "achou"; product: Product } | { fase: "nao-achou" };

/** Detalhe do relógio de pronta entrega. O id vem na URL (?id=...) e os dados
 *  vêm do painel na hora, pelo navegador — assim a página é um arquivo estático
 *  só, e funciona tanto na Vercel quanto na hospedagem do arkanoclub.com. */
export default function ProntaEntregaDetalhe() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setEstado({ fase: "nao-achou" });
      return;
    }

    let ativo = true;
    fetchLiveWatch(id).then((product) => {
      if (!ativo) return;
      if (product) {
        document.title = `${product.name} | Arkano Club`;
        setEstado({ fase: "achou", product });
      } else {
        setEstado({ fase: "nao-achou" });
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  if (estado.fase === "carregando") {
    return (
      <section className="border-b border-white/10 bg-arkano-black px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
            <div className="aspect-square w-full animate-pulse rounded-xl bg-white/5" />
            <div className="flex flex-col gap-4">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-16 w-full animate-pulse rounded bg-white/5" />
              <div className="h-10 w-40 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (estado.fase === "nao-achou") {
    return (
      <section className="border-b border-white/10 bg-arkano-black px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/pronta-entrega"
            className="mb-6 inline-flex items-center gap-2 text-sm text-arkano-champagne/60 transition hover:text-arkano-gold"
          >
            <ArrowLeft size={16} />
            Voltar pra pronta entrega
          </Link>
          <h1 className="text-2xl font-light text-arkano-champagne sm:text-3xl">
            Esse relógio não está mais disponível
          </h1>
          <p className="mt-3 max-w-xl text-sm text-arkano-champagne/60">
            Pode ter sido vendido ou saído do estoque. Dá uma olhada nos que estão prontos pra envio
            agora — ou chama a gente no WhatsApp que buscamos o modelo que você procura.
          </p>
        </div>
      </section>
    );
  }

  const { product } = estado;
  const brandName =
    brands.find((b) => b.slug === product.brand)?.name ?? product.brandName ?? product.brand;

  return (
    <ProductDetail
      data={{
        name: product.name,
        brandName,
        category: product.category,
        price: product.price,
        caseDiameter: product.caseDiameter,
        movement: product.movement,
        watchType: product.watchType,
        image: product.image,
        images: product.images,
        description: product.description,
        history: product.history,
        stockLabel: "Em estoque",
        backHref: "/pronta-entrega",
        backLabel: "Voltar pra pronta entrega",
        buyLink: product.buyLink,
      }}
    />
  );
}
