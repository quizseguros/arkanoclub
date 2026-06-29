import Image from "next/image";
import { Cog, MessageCircle, Ruler, User } from "lucide-react";
import { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { whatsappLink } from "@/lib/config";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ product }: { product: Product }) {
  const brand = brands.find((b) => b.slug === product.brand);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-arkano-graphite transition hover:border-arkano-gold/40">
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium ${
            product.stock === "em-estoque"
              ? "bg-arkano-gold text-arkano-black"
              : "bg-black/70 text-arkano-champagne"
          }`}
        >
          {product.stock === "em-estoque" ? "Em estoque" : "Sob encomenda"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-widest2 text-arkano-gold/80">{brand?.name}</span>
        <h3 className="font-sans text-base text-arkano-champagne">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-arkano-champagne/50">{product.description}</p>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-arkano-champagne/50">
          <span className="flex items-center gap-1.5">
            <Ruler size={13} className="text-arkano-gold/70" />
            {product.caseDiameter}mm
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <Cog size={13} className="text-arkano-gold/70" />
            {product.movement}
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <User size={13} className="text-arkano-gold/70" />
            {product.category}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-light text-arkano-champagne">{currency.format(product.price)}</span>
        </div>

        <a
          href={whatsappLink(`Olá! Tenho interesse no relógio ${product.name} (${brand?.name}) que vi no site.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
        >
          <MessageCircle size={16} />
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
