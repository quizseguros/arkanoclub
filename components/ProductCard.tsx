import Link from "next/link";
import { ArrowRight, Cog, MessageCircle, Ruler, ShoppingBag, User } from "lucide-react";
import { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { whatsappLink } from "@/lib/config";
import { formatDiameter } from "@/lib/format";
import { detailHref } from "@/lib/live-watches";
import { precoPromocional } from "@/lib/promo";
import { usePrecoAoVivo } from "@/lib/precos-ao-vivo";
import ProductPrice from "./ProductPrice";
import ZoomableProductImage from "./ZoomableProductImage";

/** `promoAtiva` só é passado pelas listas de pronta entrega, que sabem no
 *  navegador se a campanha de Dia dos Pais ainda está valendo. */
export default function ProductCard({
  product,
  glow,
  promoAtiva,
}: {
  product: Product;
  glow?: boolean;
  promoAtiva?: boolean;
}) {
  const brand = brands.find((b) => b.slug === product.brand);
  const brandName = brand?.name ?? product.brandName ?? product.brand;
  const href = detailHref(product);
  const emPromocao = Boolean(promoAtiva) && precoPromocional(product) !== null;
  // quando tem link de compra, o botão dourado é o de comprar e "Ver detalhes"
  // desce pra linha de baixo, ao lado do WhatsApp
  const showBuyFirst = Boolean(product.buyLink);
  // relógio da pronta entrega já vem com o preço do painel; o resto pode ter ajuste
  const valores = usePrecoAoVivo(product.live ? undefined : product.id, product.price, product.installmentPrice);

  const inner = (
    <div
      className={`group flex flex-col overflow-hidden bg-arkano-graphite transition ${
        glow
          ? "h-full rounded-[11px]"
          : "rounded-xl border border-white/10 hover:border-arkano-gold/40"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
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
        {/* embaixo, e não no canto oposto: no celular o card fica estreito e os
            dois selos se sobrepunham na mesma linha */}
        {emPromocao && (
          <span className="absolute bottom-3 left-3 rounded-full bg-arkano-blue px-3 py-1 text-[11px] font-medium text-white shadow-[0_0_18px_rgba(47,111,208,0.65)]">
            Dia dos Pais
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <span className="hidden text-xs uppercase tracking-widest2 text-arkano-gold/80 sm:block">
          {brandName}
        </span>
        <Link href={href} className="font-sans text-sm text-arkano-champagne hover:text-arkano-gold sm:text-base">
          {product.name}
        </Link>
        <p className="hidden line-clamp-2 text-xs text-arkano-champagne/50 sm:block">{product.description}</p>

        <div className="mt-1 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-arkano-champagne/50 sm:flex">
          <span className="flex items-center gap-1.5">
            <Ruler size={13} className="text-arkano-gold/70" />
            {formatDiameter(product.caseDiameter)}
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

        {/* mt-auto: o preço promocional é mais alto que o preço simples, e sem
            isso os botões desalinhavam entre os cards da mesma linha */}
        <div className="mt-auto flex items-center justify-between pt-1 sm:pt-3">
          <ProductPrice
            price={valores.price}
            promoPrice={product.promoPrice}
            installments={product.installments}
            installmentPrice={valores.installmentPrice}
            promoAtiva={promoAtiva}
          />
        </div>

        {showBuyFirst ? (
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
          >
            Comprar agora
            <ShoppingBag size={15} />
          </a>
        ) : (
          <Link
            href={href}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-arkano-gold py-2.5 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
          >
            Ver detalhes
            <ArrowRight size={15} />
          </Link>
        )}

        {/* no celular os cards ficam estreitos demais pra dois botões lado a lado */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {showBuyFirst && (
            <Link
              href={href}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 py-2 text-xs text-arkano-champagne/60 transition hover:border-arkano-gold/40 hover:text-arkano-gold"
            >
              Ver detalhes
              <ArrowRight size={13} />
            </Link>
          )}
          <a
            href={whatsappLink(`Olá! Tenho interesse no relógio ${product.name} (${brandName}) que vi no site.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 py-2 text-xs text-arkano-champagne/60 transition hover:border-arkano-gold/40 hover:text-arkano-gold"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  if (glow) {
    // na campanha a borda giratória troca o dourado pelo azul, pra promoção
    // se ler de longe já na grade
    return (
      <div className={`${emPromocao ? "promo-glow-border" : "product-glow-border"} rounded-xl p-px`}>
        {inner}
      </div>
    );
  }

  return inner;
}
