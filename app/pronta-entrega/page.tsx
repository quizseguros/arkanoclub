import type { Metadata } from "next";
import ProntaEntregaGrid from "@/components/ProntaEntregaGrid";
import CustomOrderCallout from "@/components/CustomOrderCallout";

export const metadata: Metadata = {
  title: "Pronta entrega | Arkano Club",
  description: "Relógios originais já disponíveis, prontos pra enviar assim que fechar o pedido.",
};

export default function ProntaEntregaPage() {
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

          <ProntaEntregaGrid />
        </div>
      </section>

      <CustomOrderCallout />
    </>
  );
}
