import Link from "next/link";
import { Search } from "lucide-react";

export default function CustomOrderCallout() {
  return (
    <section className="border-b border-white/10 bg-arkano-graphite px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 hidden shrink-0 rounded-full border border-arkano-gold/30 p-2.5 sm:flex">
            <Search size={18} className="text-arkano-gold" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-arkano-gold/70">Não achou?</p>
            <h3 className="mt-1 text-lg font-light text-arkano-champagne sm:text-xl">
              A gente busca o relógio que você procura
            </h3>
            <p className="mt-1 max-w-lg text-sm text-arkano-champagne/50">
              Mesmo que o modelo não esteja no catálogo, conseguimos. Manda a referência
              e confirmamos preço e prazo direto no WhatsApp.
            </p>
          </div>
        </div>

        <Link
          href="/encomenda"
          className="shrink-0 rounded-full border border-arkano-gold/50 px-6 py-2.5 text-sm text-arkano-champagne transition hover:border-arkano-gold hover:text-arkano-gold"
        >
          Fazer pedido sob encomenda
        </Link>
      </div>
    </section>
  );
}
