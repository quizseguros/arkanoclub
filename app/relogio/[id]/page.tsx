import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Product, products } from "@/data/products";
import { brands } from "@/data/brands";
import { SITE_URL } from "@/lib/config";
import { fetchLiveWatch, LIVE_ID_PREFIX } from "@/lib/live-watches";
import ProductDetail from "@/components/ProductDetail";

type Props = { params: Promise<{ id: string }> };

// os relógios do catálogo saem prontos no build; os de pronta entrega (que o
// Guilherme cadastra no painel) são montados na hora do acesso
export const dynamicParams = true;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

/** Acha o relógio pelo id: primeiro no catálogo, depois no painel do Guilherme. */
async function findProduct(id: string): Promise<Product | null> {
  if (id.startsWith(LIVE_ID_PREFIX)) return fetchLiveWatch(id);
  return products.find((p) => p.id === id) ?? null;
}

function brandNameOf(product: Product) {
  return brands.find((b) => b.slug === product.brand)?.name ?? product.brandName ?? product.brand;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProduct(id);
  if (!product) return {};

  const brandName = brandNameOf(product);
  const title = `${product.name} | Arkano Club`;
  const imageUrl = product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`;

  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      url: `${SITE_URL}/relogio/${product.id}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [imageUrl],
    },
    other: { "product:brand": brandName },
  };
}

export default async function RelogioPage({ params }: Props) {
  const { id } = await params;
  const product = await findProduct(id);
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
        stockLabel: product.stock === "em-estoque" ? "Em estoque" : "Sob encomenda",
        backHref: product.live ? "/pronta-entrega" : "/#catalogo",
        backLabel: product.live ? "Voltar pra pronta entrega" : "Voltar pro catálogo",
        variants: product.variants,
        buyLink: product.buyLink,
      }}
    />
  );
}
