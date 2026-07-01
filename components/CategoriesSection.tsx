import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    slug: "casual",
    label: "Casual",
    subtitle: "Para o dia a dia com estilo",
    image: "/img/produtos/venezianico-nereide.webp",
    delay: "0s",
  },
  {
    slug: "dress",
    label: "Dress Watch",
    subtitle: "Elegância que se reconhece",
    image: "/img/produtos/seiko-presage-cocktail.webp",
    delay: "1.5s",
  },
  {
    slug: "esportivo",
    label: "Esportivo",
    subtitle: "Construído para ir além",
    image: "/img/produtos/tudor-black-bay-58.webp",
    delay: "3s",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categorias" className="border-b border-white/10 bg-arkano-black px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-xs uppercase tracking-widest2 text-arkano-gold/70">Explorar</p>
        <h2 className="mb-8 text-2xl font-light text-arkano-champagne">Categorias</h2>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="group relative block aspect-[2/3] overflow-hidden rounded-xl sm:aspect-[3/4] sm:rounded-2xl"
            >
              {/* Imagem de fundo */}
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 639px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay escuro degradê */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Borda dourada sutil */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-arkano-gold/40" />

              {/* Light sweep */}
              <div
                className="category-card-sweep absolute inset-0"
                style={{ animationDelay: cat.delay }}
              />

              {/* Texto */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <p className="mb-0.5 hidden text-[10px] uppercase tracking-widest text-arkano-gold/70 sm:block">
                  {cat.subtitle}
                </p>
                <h3 className="text-sm font-light tracking-wide text-arkano-champagne sm:text-2xl">
                  {cat.label}
                </h3>
                <span className="mt-1 hidden text-xs uppercase tracking-widest text-arkano-champagne/40 transition-colors group-hover:text-arkano-gold sm:inline-block sm:mt-3">
                  Ver coleção →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
