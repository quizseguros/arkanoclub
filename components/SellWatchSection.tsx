import { Truck, ShieldCheck, Megaphone, Tag, Percent, Lock, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

const steps = [
  {
    icon: Truck,
    title: "Envio seguro",
    text: "Você envia o relógio com etiqueta e seguro cobertos pela gente, sem custo nem risco pra você.",
  },
  {
    icon: ShieldCheck,
    title: "Análise de validação",
    text: "Conferimos autenticidade, estado de conservação e funcionamento antes de qualquer anúncio.",
  },
  {
    icon: Megaphone,
    title: "Anúncio profissional",
    text: "Fotos de produto e descrição técnica feitas pelo nosso time, publicadas pra nossa base de compradores.",
  },
  {
    icon: Tag,
    title: "Precificação justa",
    text: "Preço definido com base no mercado real de relógios usados, sem subvalorizar sua peça.",
  },
  {
    icon: Percent,
    title: "Comissão justa",
    text: "Cobramos uma comissão clara sobre a venda, sem letra miúda e sem surpresa no final.",
  },
  {
    icon: Lock,
    title: "Pagamento seguro",
    text: "Você só recebe quando a venda é confirmada, com repasse rápido depois do fechamento.",
  },
];

export default function SellWatchSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <span className="text-xs uppercase tracking-widest2 text-arkano-gold">Vender seu relógio</span>
        <h1 className="mt-3 text-3xl font-light text-arkano-champagne sm:text-4xl">
          Tem um relógio que não usa mais?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-arkano-champagne/70">
          O Arkano Club compra e revende relógios usados com o mesmo padrão de autenticidade
          que aplica nas peças novas. Esse é o processo, do início ao pagamento.
        </p>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-xl border border-white/10 bg-arkano-graphite p-6">
              <step.icon size={22} className="text-arkano-gold" />
              <h3 className="mt-4 text-base text-arkano-champagne">{step.title}</h3>
              <p className="mt-2 text-sm text-arkano-champagne/60">{step.text}</p>
            </div>
          ))}
        </div>

        <a
          href={whatsappLink("Olá! Quero vender meu relógio pelo Arkano Club.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-arkano-gold px-8 py-3 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
        >
          <MessageCircle size={16} />
          Quero vender meu relógio
        </a>
      </div>
    </section>
  );
}
