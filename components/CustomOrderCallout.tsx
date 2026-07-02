import Link from "next/link";
import { Search } from "lucide-react";

export default function CustomOrderCallout() {
  return (
    <section className="section-gold-gradient border-b border-black/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 hidden shrink-0 rounded-full border border-black/15 p-2.5 sm:flex">
            <Search size={18} className="text-arkano-black" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-arkano-black/60">Não achou?</p>
            <h3 className="mt-1 text-lg font-light text-arkano-black sm:text-xl">
              A gente busca o relógio que você procura
            </h3>
            <p className="mt-1 max-w-lg text-sm text-arkano-black/60">
              Mesmo que o modelo não esteja no catálogo, conseguimos. Manda a referência
              e confirmamos preço e prazo direto no WhatsApp.
            </p>
          </div>
        </div>

        <Link
          href="/encomenda"
          className="shrink-0 rounded-full border border-black/25 px-6 py-2.5 text-sm text-arkano-black transition hover:bg-black/10 hover:border-black/50"
        >
          Fazer pedido sob encomenda
        </Link>
      </div>
    </section>
  );
}
