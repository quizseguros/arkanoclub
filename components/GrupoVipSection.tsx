import { Bell, MessageCircle, Tag, Zap } from "lucide-react";
import { WHATSAPP_GRUPO_VIP } from "@/lib/config";

const reasons = [
  {
    icon: Zap,
    title: "Lançamento em primeira mão",
    text: "Peça nova chegou? O grupo VIP sabe antes do feed do Instagram.",
  },
  {
    icon: Tag,
    title: "Condição exclusiva",
    text: "Ofertas e descontos que não saem em nenhum outro canal do Arkano Club.",
  },
  {
    icon: Bell,
    title: "Sem ficar atualizando o Instagram",
    text: "A novidade chega direto no seu WhatsApp, sem precisar caçar nos stories.",
  },
];

export default function GrupoVipSection() {
  return (
    <section className="px-4 py-20 text-center sm:px-6">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs uppercase tracking-widest2 text-arkano-gold">Grupo VIP</span>
        <h1 className="mt-3 text-3xl font-light text-arkano-champagne sm:text-4xl">
          As melhores ofertas chegam aqui primeiro
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-arkano-champagne/70 sm:text-base">
          O grupo VIP de ofertas do Arkano Club é o canal direto do Guilherme com quem realmente
          quer comprar relógio original com o melhor custo-benefício, sem spam, só o que importa.
        </p>

        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border border-white/10 bg-arkano-graphite p-6">
              <r.icon size={22} className="text-arkano-gold" />
              <h3 className="mt-4 text-base text-arkano-champagne">{r.title}</h3>
              <p className="mt-2 text-sm text-arkano-champagne/60">{r.text}</p>
            </div>
          ))}
        </div>

        <a
          href={WHATSAPP_GRUPO_VIP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-arkano-gold px-8 py-3 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
        >
          <MessageCircle size={16} />
          Entrar no grupo VIP
        </a>
      </div>
    </section>
  );
}
