import type { Metadata } from "next";
import ProntaEntregaDetalhe from "@/components/ProntaEntregaDetalhe";
import CustomOrderCallout from "@/components/CustomOrderCallout";

export const metadata: Metadata = {
  title: "Relógio em pronta entrega | Arkano Club",
  description: "Relógio original com garantia, pronto pra enviar assim que o pedido é fechado.",
};

// Página única pros detalhes dos relógios do painel: o id vem por ?id= e os
// dados são buscados no navegador. Assim continua sendo arquivo estático, que
// é o que a hospedagem do arkanoclub.com aceita.
export default function ProntaEntregaDetalhePage() {
  return (
    <>
      <ProntaEntregaDetalhe />
      <CustomOrderCallout />
    </>
  );
}
