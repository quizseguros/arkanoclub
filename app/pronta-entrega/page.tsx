import type { Metadata } from "next";
import BannerCarousel from "@/components/BannerCarousel";
import ProntaEntregaClient from "@/components/ProntaEntregaClient";
import CustomOrderCallout from "@/components/CustomOrderCallout";

export const metadata: Metadata = {
  title: "Pronta entrega | Arkano Club",
  description: "Relógios originais já disponíveis, prontos pra enviar assim que fechar o pedido.",
};

// Página de destino dos anúncios: repete os banners e a esteira de marcas da
// home (sem tirar de lá) pra quem cai aqui direto ver a cara da loja inteira.
export default function ProntaEntregaPage() {
  return (
    <>
      <BannerCarousel />

      <ProntaEntregaClient />

      <CustomOrderCallout />
    </>
  );
}
