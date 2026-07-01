import Link from "next/link";
import { ArrowRight, Cog, MessageCircle, Ruler, User } from "lucide-react";
import { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { whatsappLink } from "@/lib/config";
import ZoomableProductImage from "./ZoomableProductImage";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ product, glow }: { product: Product; glow?: boolean }) {
  const brand = brands.find((b) => b.slug === product.brand);
  const detailHref = `/relogio/${product.id}`;

  return (
    <div className={`group flex flex-col overflow-hidden rounded-xl border bg-arkano-graphite transition ${
      glow
        ? "border-arkano-gold/50 shadow-[0_0_12px_2px_rgba(201,162,75,0.25)] hover:shadow-[0_0_20px_4px_rgba(201,162,75,0.4)] hover:border-arkano-gold"
        : "border-white/10 hover:border-arkano-gold/40"
    }`}>
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        <ZoomableProductImage src={product.image} alt={product.name} />
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

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <span className="hidden text-xs uppercase tracking-widest2 text-arkano-gold/80 sm:block">
          {brand?.name}
        </span>
        <Link href={detailHref} className="font-sans text-sm text-arkano-champagne hover:text-arkano-gold sm:text-base">
          {product.name}
        </Link>
        <p className="hidden line-clamp-2 text-xs text-arkano-champagne/50 sm:block">{product.description}</p>

        <div className="mt-1 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-arkano-champagne/50 sm:flex">
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

        <div className="mt-1 flex items-center justify-between sm:mt-3">
          <span className="text-base font-light text-arkano-champagne sm:text-lg">
            {currency.format(product.price)}
          </span>
        </div>

        <Link
          href={detailHref}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
        >
          Ver detalhes
          <ArrowRight size={15} />
        </Link>

        <a
          href={whatsappLink(`Olá! Tenho interesse no relógio ${product.name} (${brand?.name}) que vi no site.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 py-2 text-xs text-arkano-champagne/60 transition hover:border-arkano-gold/40 hover:text-arkano-gold"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
