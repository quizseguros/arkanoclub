import { Cog, MessageCircle, Ruler } from "lucide-react";
import { ImportedProduct } from "@/data/products-sob-encomenda";
import { whatsappLink } from "@/lib/config";
import ZoomableProductImage from "./ZoomableProductImage";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ImportedProductCard({ product }: { product: ImportedProduct }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-arkano-graphite transition hover:border-arkano-gold/40">
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        <ZoomableProductImage src={product.image} alt={product.name} />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-arkano-champagne">
          Sob encomenda
        </span>
        {product.condition === "seminovo" && (
          <span className="absolute right-3 top-3 rounded-full bg-arkano-gold px-3 py-1 text-[11px] font-medium text-arkano-black">
            Seminovo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-widest2 text-arkano-gold/80">{product.brand}</span>
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
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-light text-arkano-champagne">{currency.format(product.price)}</span>
        </div>

        <a
          href={whatsappLink(`Olá! Vi o relógio ${product.name} (${product.brand}) na seção Sob Encomenda do site e quero saber mais.`)}
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
