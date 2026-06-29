import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/config";

export default function InstagramSection() {
  return (
    <section className="border-b border-white/10 bg-arkano-graphite px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <Instagram size={32} className="text-arkano-gold" strokeWidth={1.5} />
        <h2 className="text-2xl font-light text-arkano-champagne">Acompanhe no Instagram</h2>
        <p className="text-sm text-arkano-champagne/60">
          Lançamentos, bastidores e curadoria de relojoaria todos os dias em @arkano.club.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full border border-arkano-gold px-7 py-2.5 text-sm font-medium text-arkano-gold transition hover:bg-arkano-gold hover:text-arkano-black"
        >
          Seguir @arkano.club
        </a>
      </div>
    </section>
  );
}
