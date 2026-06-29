import { MessageCircle, ShieldCheck, Watch, Award } from "lucide-react";
import { whatsappLink } from "@/lib/config";

const highlights = [
  {
    icon: Watch,
    title: "Desde 2024",
    text: "O Arkano Club nasceu em 22 de julho de 2024, em Vargem Alegre (MG), com um propósito simples: vender relógio original, com garantia de verdade.",
  },
  {
    icon: ShieldCheck,
    title: "Autenticidade em primeiro lugar",
    text: "Cada peça vendida passa por análise de autenticidade antes de chegar ao cliente. É o que separa o Arkano Club da percepção de réplica comum no nicho.",
  },
  {
    icon: Award,
    title: "Curadoria de marcas reconhecidas",
    text: "Seiko, Citizen, TAG Heuer, Tudor, Longines, Mido, Baltic e Venezianico: peças genuínas, selecionadas com critério técnico.",
  },
];

export default function AboutSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <span className="text-xs uppercase tracking-widest2 text-arkano-gold">Quem somos</span>
        <h1 className="mt-3 text-3xl font-light text-arkano-champagne sm:text-4xl">
          Arkano Club
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-arkano-champagne/70 sm:text-base">
          O Arkano Club é tocado pelo Guilherme Franco, sozinho, do jeito que negócio de
          relojoaria de confiança deveria ser: sem intermediário, sem letra miúda. A loja vende
          relógios originais com garantia para todo o Brasil, e cada conversa de venda passa
          pela mão dele no WhatsApp.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-arkano-champagne/70 sm:text-base">
          O problema que a marca resolve é claro: no nicho de relojoaria, a primeira reação de
          quem nunca comprou é desconfiar: &ldquo;será que é réplica?&rdquo;. O Arkano Club existe
          pra provar o contrário, peça por peça, com nota, autenticidade confirmada e garantia
          real.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 text-left sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl border border-white/10 bg-arkano-graphite p-6">
            <h.icon size={22} className="text-arkano-gold" />
            <h3 className="mt-4 text-base text-arkano-champagne">{h.title}</h3>
            <p className="mt-2 text-sm text-arkano-champagne/60">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl text-center">
        <p className="text-sm text-arkano-champagne/60">
          Hoje o Arkano Club já reúne quase 7 mil seguidores no Instagram e mantém um grupo VIP
          de ofertas no WhatsApp pra quem quer ser o primeiro a saber de cada peça nova.
        </p>
        <a
          href={whatsappLink("Olá! Quero conhecer melhor o Arkano Club.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-arkano-gold px-7 py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
        >
          <MessageCircle size={16} />
          Falar com o Guilherme
        </a>
      </div>
    </section>
  );
}
