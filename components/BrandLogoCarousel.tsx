"use client";

import Image from "next/image";
import { brands } from "@/data/brands";

type Props = {
  activeBrand: string | null;
  onSelectBrand: (slug: string) => void;
  /** seção pra onde a página rola ao clicar numa marca (na home é o catálogo) */
  scrollToId?: string;
  /** marcas a exibir; sem isso usa a vitrine fixa da home */
  brandSlugs?: string[];
};

// carrossel mostra só as marcas do catálogo original (pré-ampliação de 23/07/2026) —
// as marcas novas continuam disponíveis pra filtro/busca, só não aparecem nessa vitrine
const MARCAS_CARROSSEL = [
  "seiko",
  "citizen",
  "tag-heuer",
  "tudor",
  "longines",
  "mido",
  "baltic",
  "venezianico",
  "christopher-ward",
];

// cada logo ocupa ~200px (w-40 + gap-10); com menos de 8 numa cópia, o trilho
// fica estreito demais e o loop expõe espaço vazio em tela grande
const MIN_POR_COPIA = 8;

export default function BrandLogoCarousel({
  activeBrand,
  onSelectBrand,
  scrollToId = "catalogo",
  brandSlugs,
}: Props) {
  const slugs = brandSlugs ?? MARCAS_CARROSSEL;
  const marcasExibidas = brands.filter((b) => slugs.includes(b.slug));

  // com uma marca só não é carrossel, é um logo repetido — melhor não mostrar
  if (marcasExibidas.length < 2) return null;

  const copia: typeof marcasExibidas = [];
  while (copia.length < MIN_POR_COPIA) copia.push(...marcasExibidas);

  // 4 cópias: garante que o trilho seja bem mais largo que qualquer viewport,
  // então o loop (translateX 0 -> -25%, ou seja 1 cópia) nunca expõe espaço vazio.
  const track = [...copia, ...copia, ...copia, ...copia];

  function handleClick(slug: string) {
    onSelectBrand(slug);
    document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth" });
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
