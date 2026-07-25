import type { Metadata } from "next";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CustomOrderCallout from "@/components/CustomOrderCallout";

export const metadata: Metadata = {
  title: "Pronta entrega | Arkano Club",
  description: "Relógios originais já disponíveis, prontos pra enviar assim que fechar o pedido.",
};

export default function ProntaEntregaPage() {
  const disponiveis = products.filter((p) => p.stock === "em-estoque");

  return (
    <>
      <section className="border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest2 text-arkano-gold">Disponível agora</p>
          <h1 className="mt-2 text-3xl font-light text-arkano-champagne sm:text-4xl">Pronta entrega</h1>
          <p className="mt-3 max-w-2xl text-sm text-arkano-champagne/60 sm:text-base">
            Esses relógios já estão com a gente, prontos pra enviar assim que o pedido é fechado — sem
            espera de importação. Original, com garantia.
          </p>

          {disponiveis.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {disponiveis.map((product) => (
                <ProductCard key={product.id} product={product} glow />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-arkano-champagne/50">
              Nenhum relógio em pronta entrega no momento. Fala com a gente que buscamos o que você procura.
            </p>
          )}
        </div>
      </section>

      <CustomOrderCallout />
    </>
  );
}
