import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands } from "@/data/brands";
import { Product } from "@/data/products";
import { SITE_URL } from "@/lib/config";
import { fetchLiveWatch } from "@/lib/live-watches";
import ProductDetail from "@/components/ProductDetail";

type Props = { params: Promise<{ id: string }> };

// Rota própria dos relógios de pronta entrega: eles vêm do painel do Guilherme,
// então a página é montada a cada acesso (nada de cache). O catálogo fixo
// continua em /relogio/[id], gerado no build.
export const dynamic = "force-dynamic";

function brandNameOf(product: Product) {
  return brands.find((b) => b.slug === product.brand)?.name ?? product.brandName ?? product.brand;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchLiveWatch(id);
  if (!product) return {};

  const title = `${product.name} | Arkano Club`;
  const imageUrl = product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`;

  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      url: `${SITE_URL}/pronta-entrega/${id}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [imageUrl],
    },
    other: { "product:brand": brandNameOf(product) },
  };
}

export default async function RelogioProntaEntregaPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchLiveWatch(id);
  if (!product) notFound();

  return (
    <ProductDetail
      data={{
        name: product.name,
        brandName: brandNameOf(product),
        category: product.category,
        price: product.price,
        caseDiameter: product.caseDiameter,
        movement: product.movement,
        watchType: product.watchType,
        image: product.image,
        images: product.images,
        description: product.description,
        history: product.history,
        stockLabel: "Em estoque",
        backHref: "/pronta-entrega",
        backLabel: "Voltar pra pronta entrega",
        buyLink: product.buyLink,
      }}
    />
  );
}
