"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Cog, MessageCircle, Ruler, Share2, User } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import ZoomableProductImage from "./ZoomableProductImage";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export type ProductDetailData = {
  name: string;
  brandName: string;
  category?: string;
  price: number;
  caseDiameter: number;
  movement: string;
  image: string;
  description: string;
  history?: string;
  stockLabel: string;
  conditionLabel?: string;
  backHref: string;
  backLabel: string;
};

export default function ProductDetail({ data }: { data: ProductDetailData }) {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  function handleShare() {
    const text = `Olha esse relógio que encontrei no Arkano Club: ${data.name} — ${pageUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: data.name, text, url: pageUrl }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="border-b border-white/10 bg-arkano-black px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href={data.backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm text-arkano-champagne/60 transition hover:text-arkano-gold"
        >
          <ArrowLeft size={16} />
          {data.backLabel}
        </Link>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black">
            <ZoomableProductImage src={data.image} alt={data.name} />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-arkano-champagne">
              {data.stockLabel}
            </span>
            {data.conditionLabel && (
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-arkano-gold px-3 py-1 text-[11px] font-medium text-arkano-black">
                {data.conditionLabel}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest2 text-arkano-gold/80">{data.brandName}</span>
              <h1 className="mt-1 text-2xl font-light text-arkano-champagne sm:text-3xl">{data.name}</h1>
            </div>

            <p className="text-sm leading-relaxed text-arkano-champagne/70">{data.description}</p>

            {data.history && (
              <div className="rounded-lg border border-white/10 bg-arkano-graphite p-4">
                <p className="mb-1 text-[11px] uppercase tracking-widest text-arkano-gold/70">História</p>
                <p className="text-sm leading-relaxed text-arkano-champagne/60">{data.history}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-arkano-champagne/60">
              <span className="flex items-center gap-2">
                <Ruler size={15} className="text-arkano-gold/70" />
                {data.caseDiameter}mm
              </span>
              <span className="flex items-center gap-2 capitalize">
                <Cog size={15} className="text-arkano-gold/70" />
                {data.movement}
              </span>
              {data.category && (
                <span className="flex items-center gap-2 capitalize">
                  <User size={15} className="text-arkano-gold/70" />
                  {data.category}
                </span>
              )}
            </div>

            <span className="text-3xl font-light text-arkano-champagne">{currency.format(data.price)}</span>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(
                  `Olá! Tenho interesse no relógio ${data.name} (${data.brandName}) que vi no site${
                    pageUrl ? `: ${pageUrl}` : "."
                  }`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-arkano-gold py-3 text-sm font-medium text-arkano-black transition hover:bg-arkano-gold-light"
              >
                <MessageCircle size={17} />
                Falar no WhatsApp
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-arkano-champagne/80 transition hover:border-arkano-gold/60 hover:text-arkano-gold"
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
