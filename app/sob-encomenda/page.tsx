import type { Metadata } from "next";
import BannerCarousel from "@/components/BannerCarousel";
import SobEncomendaClient from "@/components/SobEncomendaClient";
import CustomOrderCallout from "@/components/CustomOrderCallout";

export const metadata: Metadata = {
  title: "Sob encomenda | Arkano Club",
  description: "Relógios originais com garantia, encomendados pra você, com envio pra todo o Brasil.",
};

export default function SobEncomendaPage() {
  return (
    <>
      <BannerCarousel />

      <SobEncomendaClient />

      <CustomOrderCallout />
    </>
  );
}
