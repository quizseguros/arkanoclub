import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { products, StyleCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type Slug = "casual" | "dress" | "esportivo";

const CONFIG: Record<Slug, { label: string; styleCategory: StyleCategory; description: string }> = {
  casual: {
    label: "Casual",
    styleCategory: "casual",
    description: "Relógios versáteis para o dia a dia — do café da manhã ao jantar.",
  },
  dress: {
    label: "Dress Watch",
    styleCategory: "dress",
    description: "Peças elegantes para ocasiões que pedem refinamento e sofisticação.",
  },
  esportivo: {
    label: "Esportivo",
    styleCategory: "sport",
    description: "Construídos para resistir — mergulho, aventura e performance.",
  },
};

export function generateStaticParams() {
  return (Object.keys(CONFIG) as Slug[]).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const config = CONFIG[slug as Slug];
  if (!config) return {};
  return {
    title: `${config.label} | Arkano Club`,
    description: config.description,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const config = CONFIG[slug as Slug];
  if (!config) notFound();

  const filtered = products.filter((p) => p.styleCategory === config.styleCategory);

  return (
    <section className="min-h-screen bg-arkano-black px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#categorias"
          className="mb-8 inline-flex items-center gap-2 text-sm text-arkano-champagne/60 transition hover:text-arkano-gold"
        >
          <ArrowLeft size={16} />
          Voltar às categorias
        </Link>

        <p className="mb-1 text-xs uppercase tracking-widest2 text-arkano-gold/70">Coleção</p>
        <h1 className="mb-2 text-3xl font-light text-arkano-champagne sm:text-4xl">
          {config.label}
        </h1>
        <p className="mb-10 text-sm text-arkano-champagne/50">{config.description}</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-arkano-champagne/40">
            Nenhum relógio disponível nessa categoria no momento.
          </p>
        )}
      </div>
    </section>
  );
}
