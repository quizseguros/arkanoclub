"use client";

import Image from "next/image";
import { brands } from "@/data/brands";

type Props = {
  activeBrand: string | null;
  onSelectBrand: (slug: string) => void;
};

export default function BrandLogoCarousel({ activeBrand, onSelectBrand }: Props) {
  // 4 cópias: garante que o trilho seja bem mais largo que qualquer viewport,
  // então o loop (translateX 0 -> -25%, ou seja 1 cópia) nunca expõe espaço vazio.
  const track = [...brands, ...brands, ...brands, ...brands];

  function handleClick(slug: string) {
    onSelectBrand(slug);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="border-b border-white/10 bg-arkano-black py-10">
      <div className="group relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
          {track.map((brand, i) => (
            <button
              key={`${brand.slug}-${i}`}
              onClick={() => handleClick(brand.slug)}
              title={`Filtrar por ${brand.name}`}
              className={`flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border bg-white/95 px-6 transition ${
                activeBrand === brand.slug
                  ? "border-arkano-gold ring-2 ring-arkano-gold"
                  : "border-transparent hover:border-arkano-gold/60"
              }`}
            >
              {brand.hasLogo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={110}
                  height={48}
                  className="max-h-10 w-auto object-contain"
                />
              ) : (
                <span className="font-sans text-base font-medium tracking-wide text-arkano-black">
                  {brand.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
